// screens/ContestScreen.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Alert} from 'react-native';
import ContestItem from '../components/ContestItem';
import JoinConfirmSheet from '../components/JoinConfirmSheet';
import MatchHeader from '../components/shared/MatchHeader';
import { ContestService } from '../services/ContestService';
import { JoinedStore } from '../services/JoinedStore';
import { useCountdown } from '../hooks/useCountdown';

const ContestScreen = React.memo(({ navigation }) => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContest, setSelectedContest] = useState(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const timeLeft = useCountdown();

  // Function to group and sort contests
  const groupAndSortContests = (contestsArray) => {
    // Group contests by title
    const grouped = contestsArray.reduce((groups, contest) => {
      const title = contest.title || 'Other';
      if (!groups[title]) {
        groups[title] = [];
      }
      groups[title].push(contest);
      return groups;
    }, {});

    // Sort each group by prizeAmount in descending order
    Object.keys(grouped).forEach(title => {
      grouped[title].sort((a, b) => (b.prizeAmount || 0) - (a.prizeAmount || 0));
    });

    // Convert to array and sort groups by their first member's prizeAmount
    const sortedSections = Object.keys(grouped)
      .map(title => ({
        title,
        data: grouped[title],
        firstPrizeAmount: grouped[title][0]?.prizeAmount || 0
      }))
      .sort((a, b) => b.firstPrizeAmount - a.firstPrizeAmount);

    return sortedSections;
  };

  // Memoized sorted sections
  const sortedSections = useMemo(() => groupAndSortContests(contests), [contests]);

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
            onPress: async () => {
              if (!selectedContest) return;
              const id = selectedContest.contestId || selectedContest.id;
              try {
                const updated = await ContestService.joinContest(id);
                const updatedCurrent = updated.currentSize || (selectedContest.currentSize || 0) + 1;
                JoinedStore.markJoined(id, updatedCurrent);
                Alert.alert('Success', 'You have successfully joined the contest!');
              } catch (e) {
                JoinedStore.markUnjoined(id, selectedContest.currentSize || 0);
                navigation.navigate('ContestFull');
              }
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

  if (sortedSections.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No contests available</Text>
        <Text style={styles.emptySubtext}>Pull down to refresh</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MatchHeader 
        team1={matchInfo.team1}
        team2={matchInfo.team2}
        timeLeft={timeLeft}
        onBackPress={() => navigation.goBack()}
      />

      <FlatList
        data={sortedSections}
        keyExtractor={(section, index) => `section-${index}`}
        renderItem={({ item: section }) => (
          <View style={styles.sectionContainer}>
            {/* Section Header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{section.title}</Text>
            </View>
            
            {/* Contest Cards in this section */}
            {section.data.map((contest, index) => (
              <View key={`${contest.contestId || contest.id || index}`} style={styles.contestWrapper}>
                <ContestItem contest={contest} onPress={handleContestPress} onJoin={handleJoinPress} />
              </View>
            ))}
          </View>
        )}
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
        payable={(selectedContest && Math.max(0, selectedContest.entryFee)) || 0}
        onConfirm={handleConfirmJoin}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#666' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5', paddingHorizontal: 40 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#333', textAlign: 'center', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#666', textAlign: 'center' },
  listContainer: { paddingBottom: 20 },
  sectionContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 0,
    marginBottom: 10,
    borderRadius: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    overflow: 'hidden',
  },
  sectionHeader: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#333',
    letterSpacing: 0.2,
    marginBottom: -10,
  },
  contestWrapper: {
    backgroundColor: '#ffffff',
  },
});

export default ContestScreen;
