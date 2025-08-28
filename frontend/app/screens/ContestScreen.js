// screens/ContestScreen.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Image,
} from 'react-native';
import ContestItem from '../components/ContestItem';
import JoinConfirmSheet from '../components/JoinConfirmSheet';
import { ContestService } from '../services/ContestService';
import { LinearGradient } from 'expo-linear-gradient';
import { JoinedStore } from '../services/JoinedStore';
import { CountdownStore } from '../services/CountdownStore';

const ContestScreen = React.memo(({ navigation }) => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContest, setSelectedContest] = useState(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  const matchInfo = useMemo(() => ({ team1: 'BPH', team2: 'OVI' }), []);

  useEffect(() => {
    loadContests();
  }, []);

  useEffect(() => {
    const onStore = () => {
      // Defer to next tick to avoid setState during other component renders
      setTimeout(() => {
        setContests((prev) => prev.map((c) => {
          const id = c.contestId || c.id;
          const js = JoinedStore.get(id);
          if (!js) return c;
          const merged = { ...c };
          if (js.joined) merged.joined = true;
          if (typeof js.currentSize === 'number') merged.currentSize = js.currentSize;
          return merged;
        }));
      }, 0);
    };
    const unsub = JoinedStore.subscribe(onStore);
    return () => unsub();
  }, []);

  useEffect(() => {
    // Subscribe to global countdown (initialized in App.js)
    const update = () => {
      const ms = CountdownStore.getRemaining();
      const totalSeconds = Math.floor(ms / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
      setTimeLeft(`${hours}h ${pad(minutes)}m ${pad(seconds)}s left`);
    };
    update();
    const unsub = CountdownStore.subscribe(update);
    return () => unsub();
  }, []);

  const loadContests = useCallback(async () => {
    try {
      setLoading(true);
      const contests = await ContestService.getAllContests();
      // Merge any locally joined state so values persist across navigation
      const merged = contests.map((c) => {
        const id = c.contestId || c.id;
        const js = JoinedStore.get(id);
        if (!js) return c;
        return {
          ...c,
          joined: js.joined ? true : c.joined,
          currentSize: typeof js.currentSize === 'number' ? js.currentSize : c.currentSize,
        };
      });
      setContests(merged);
    } catch (error) {
      console.error('Failed to load contests:', error);
      Alert.alert(
        'Error',
        'Failed to load contests. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadContests();
    setRefreshing(false);
  }, [loadContests]);

  const handleContestPress = useCallback((contest) => {
    // Navigate to details with only serializable data; syncing handled via JoinedStore
    navigation.navigate('ContestDetail', { contest });
  }, [navigation]);

  const handleJoinPress = useCallback((contest) => {
    setSelectedContest(contest);
    setSheetVisible(true);
  }, []);

  const handleConfirmJoin = () => {
    const fee = (selectedContest && selectedContest.entryFee) || 0;
    setSheetVisible(false);
    setTimeout(() => {
      Alert.alert(
        'Join Contest',
        `Do you want to join this contest for ₹${fee}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Join',
            onPress: () => {
              // Update local list: mark joined and decrement spots
              if (selectedContest) {
                const id = selectedContest.contestId || selectedContest.id;
                const updatedCurrent = (selectedContest.currentSize || 0) + 1;
                JoinedStore.markJoined(id, updatedCurrent);
              }
              Alert.alert('Success', 'You have successfully joined the contest!');
            },
          },
        ]
      );
    }, 150);
  };

  const renderItem = useCallback(({ item }) => (
    <ContestItem contest={item} onPress={handleContestPress} onJoin={handleJoinPress} />
  ), [handleContestPress, handleJoinPress]);

  const keyExtractor = useCallback((item, index) => `${item.contestId || item.id || index}`, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading contests...</Text>
      </View>
    );
  }

  if (contests.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No contests available</Text>
        <Text style={styles.emptySubtext}>Pull down to refresh</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#8A0F1A", "#16181D", "#0D0F13"]}
        locations={[0, 0.35, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Image
          source={require('../assets/images/grid_pattern.png')}
          style={styles.headerPattern}
          resizeMode="cover"
        />
        <View style={styles.headerRow}>
          <Text 
            onPress={() => navigation.goBack()} 
            style={styles.backArrow}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            accessibilityHint="Return to previous screen"
          >
            ←
          </Text>
          <View style={styles.headerCenter}>
            <Text 
              style={styles.headerTitle}
              accessibilityRole="header"
            >
              {matchInfo.team1} v {matchInfo.team2}
            </Text>
            <Text 
              style={styles.headerSubtitle}
              accessibilityLabel={`Match starts in ${timeLeft}`}
            >
              {timeLeft}
            </Text>
          </View>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <FlatList
        data={contests}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4CAF50']}
            tintColor="#4CAF50"
          />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={10}
        getItemLayout={(data, index) => ({
          length: 120, // Approximate item height
          offset: 120 * index,
          index,
        })}
        accessibilityRole="list"
        accessibilityLabel="Contest list"
      />

      <JoinConfirmSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        entryFee={(selectedContest && selectedContest.entryFee) || 0}
        payable={(selectedContest && Math.max(0, selectedContest.entryFee - 25)) || 0}
        onConfirm={handleConfirmJoin}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    paddingTop: 52,
    paddingBottom: 14,
    paddingHorizontal: 16,
    position: 'relative',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  backArrow: { color: '#ffffff', fontSize: 24, fontWeight: 'bold', width: 24 },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#ffffff', marginBottom: 2, letterSpacing: 0.3 },
  headerSubtitle: { fontSize: 13, color: '#cbd5e1' },
  headerPattern: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 165,
    height: 128.32654,
    opacity: 0.4,
    pointerEvents: 'none',
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#666' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5', paddingHorizontal: 40 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#333', textAlign: 'center', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#666', textAlign: 'center' },
  listContainer: { paddingBottom: 20 },
});

export default ContestScreen;
