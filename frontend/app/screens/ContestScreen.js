// screens/ContestScreen.js
import React, { useState, useEffect, useMemo } from 'react';
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

const ContestScreen = ({ navigation }) => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContest, setSelectedContest] = useState(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  const matchInfo = useMemo(() => ({ team1: 'BPH', team2: 'OVI' }), []);
  const matchStartTime = useMemo(() => new Date(Date.now() + (11 * 60 + 43) * 60 * 1000), []);

  useEffect(() => {
    loadContests();
  }, []);

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const ms = Math.max(0, matchStartTime.getTime() - now);
      const totalMinutes = Math.floor(ms / (60 * 1000));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      setTimeLeft(`${hours}h ${minutes}m left`);
    };
    update();
    const id = setInterval(update, 60 * 1000);
    return () => clearInterval(id);
  }, [matchStartTime]);

  const loadContests = async () => {
    try {
      setLoading(true);
      const contests = await ContestService.getAllContests();
      setContests(contests);
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
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadContests();
    setRefreshing(false);
  };

  const handleContestPress = (contest) => {
    // Navigate to ContestDetail screen with contest data
    navigation.navigate('ContestDetail', { contest });
  };

  const handleJoinPress = (contest) => {
    setSelectedContest(contest);
    setSheetVisible(true);
  };

  const handleConfirmJoin = () => {
    setSheetVisible(false);
    // Optionally navigate or call API
    // navigation.navigate('ContestDetail', { contest: selectedContest });
  };

  const renderItem = ({ item }) => (
    <ContestItem contest={item} onPress={handleContestPress} onJoin={handleJoinPress} />
  );

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
          <Text onPress={() => navigation.goBack()} style={styles.backArrow}>←</Text>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{matchInfo.team1} v {matchInfo.team2}</Text>
            <Text style={styles.headerSubtitle}>{timeLeft}</Text>
          </View>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <FlatList
        data={contests}
        keyExtractor={(item, index) => `${item.contestId || item.id || index}`}
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
};

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
