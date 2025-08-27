import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { ContestService } from '../services/ContestService';
import { JoinedStore } from '../services/JoinedStore';
import JoinConfirmSheet from './JoinConfirmSheet';


const Icon = ({ name, size = 14, color = '#888' }) => (
  <Text style={{ fontSize: size, color: color, marginRight: 4 }}>
    {name === 'trophy' ? '🏆' : name === 'team' ? 'Ⓜ️' : '💰'}
  </Text>
);

const ContestDetail = ({ route, navigation }) => {
  const { contest } = route.params || {};
  const [contestData, setContestData] = useState(contest);
  const [joined, setJoined] = useState(!!(contest && contest.joined));
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState('11h 43m left'); // Hardcoded 
  const [sheetVisible, setSheetVisible] = useState(false);

  // Hardcoded 
  const matchInfo = {
    team1: 'BPH',
    team2: 'OVI',
    timeLeft: '11h 43m left',
  };

  useEffect(() => {
    if (contest) {
      fetchRealTimeData();
      const interval = setInterval(fetchRealTimeData, 30000);
      return () => clearInterval(interval);
    }
  }, [contest]);

  // Keep in sync with joins done from the list using the JoinedStore
  useEffect(() => {
    const id = (contest?.contestId || contest?.id);
    const apply = () => {
      if (!id) return;
      const js = JoinedStore.get(id);
      if (!js) return;
      // Defer state updates to avoid cross-render warnings
      setTimeout(() => {
        setContestData((prev) => {
          const merged = {
            ...prev,
            joined: js.joined ? true : (prev?.joined || false),
            currentSize: typeof js.currentSize === 'number' ? js.currentSize : (prev?.currentSize),
          };
          return merged;
        });
        if (js.joined) setJoined(true);
      }, 0);
    };
    apply();
    const unsub = JoinedStore.subscribe(apply);
    return () => unsub();
  }, [contest]);

  const fetchRealTimeData = async () => {
    try {
      setLoading(true);
      const updatedContest = await ContestService.getContestById(contest.contestId || contest.id);
      if (updatedContest) {
        // Merge with any joined state from the shared store to avoid mismatches
        const id = updatedContest.contestId || updatedContest.id || contest.contestId || contest.id;
        const js = JoinedStore.get(id);
        if (js) {
          if (typeof js.currentSize === 'number') {
            updatedContest.currentSize = js.currentSize;
          }
          if (js.joined) {
            updatedContest.joined = true;
          }
        }
        setContestData(updatedContest);
        if (updatedContest.joined) setJoined(true);
      }
    } catch (error) {
      console.error('Failed to fetch real-time data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinContest = () => {
    if (joined) return;
    setSheetVisible(true);
  };

  const joinContest = async () => {
    try {
      setJoined(true);
      const next = (prev) => ({
        ...prev,
        currentSize: (prev?.currentSize || 0) + 1,
        joined: true,
      });
      setContestData((prev) => {
        const updated = next(prev);
        const id = updated.contestId || updated.id;
        JoinedStore.markJoined(id, updated.currentSize);
        return updated;
      });
      Alert.alert('Success', 'You have successfully joined the contest!');
    } catch (error) {
      Alert.alert('Error', 'Failed to join contest. Please try again.');
    }
  };

  const handleSheetConfirm = () => {
    setSheetVisible(false);
    setTimeout(() => {
      Alert.alert(
        'Join Contest',
        `Do you want to join this contest for ₹${entryFee}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Join', onPress: () => joinContest() },
        ]
      );
    }, 150);
  };

  const formatPrizeAmount = (amount) => {
    if (amount >= 10000000) return `${(amount / 10000000).toFixed(0)} Crore`;
    if (amount >= 100000) return `${(amount / 100000).toFixed(1)} Lakhs`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
    return amount.toString();
  };

  const formatSpots = (spots) => spots >= 10000 ? spots.toLocaleString() : spots.toString();

  if (!contestData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Contest data not available</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const totalSpots = contestData.contestSize || 78941190;
  const currentSize = contestData.currentSize || 66410020;
  const spotsLeft = totalSpots - currentSize;
  const fillPercentage = (currentSize / totalSpots) * 100;
  const prizeAmount = contestData.prizeAmount || 200000000;
  const entryFee = contestData.entryFee || 20;
  const firstPrize = contestData.firstPrize || 100000;
  const winnerPercentage = Math.round(((contestData.noOfWinners || 46075) / totalSpots) * 100);
  const maxTeams = contestData.maxTeamsAllowed || 6;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
          <Text style={styles.backArrowText}>←</Text>
        </TouchableOpacity>
        <View style={styles.matchInfo}>
          <Text style={styles.matchText}>{matchInfo.team1} v {matchInfo.team2}</Text>
          <Text style={styles.timeText}>{matchInfo.timeLeft}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Contest Card (matching ContestItem.js structure) */}
        <View style={styles.card}>
          {/* Guaranteed Prize Pool */}
          <View style={styles.guaranteedSection}>
            <Text style={styles.guaranteedText}>💰 Guaranteed Prize Pool</Text>
          </View>

          {/* Prize Section */}
          <View style={styles.prizeSection}>
            <Text style={styles.prizeText}>₹{formatPrizeAmount(prizeAmount)}</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${fillPercentage}%` }]} />
          </View>

          {/* Spots Section */}
          <View style={styles.spotsSection}>
            <Text style={styles.spotsLeftText}>{formatSpots(spotsLeft)} left</Text>
            <Text style={styles.totalSpotsText}>{formatSpots(totalSpots)} spots</Text>
          </View>

          {/* Large JOIN Button */}
          <TouchableOpacity style={[styles.largeJoinButton, joined && styles.joinedButton]} onPress={handleJoinContest} disabled={joined}>
            <Text style={styles.largeJoinButtonText}>{joined ? 'JOINED' : `JOIN ₹${entryFee}`}</Text>
          </TouchableOpacity>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <View style={styles.footerItem}>
              <Icon name="prize" />
              <Text style={styles.footerText}>₹{formatPrizeAmount(firstPrize)}</Text>
            </View>
            <View style={styles.footerItem}>
              <Icon name="trophy" />
              <Text style={styles.footerText}>{winnerPercentage}%</Text>
            </View>
            <View style={styles.footerItem}>
              <Icon name="team" />
              <Text style={styles.footerText}>Upto {maxTeams}</Text>
            </View>
          </View>

          {/* Real-time indicator */}
          {loading && (
            <View style={styles.loadingIndicator}>
              <ActivityIndicator size="small" color="#4CAF50" />
              <Text style={styles.loadingText}>Updating...</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <JoinConfirmSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        entryFee={entryFee}
        payable={Math.max(0, entryFee - 25)}
        onConfirm={handleSheetConfirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#2C2C2C',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: { width: 30 },
  backArrowText: { color: '#ffffff', fontSize: 24, fontWeight: 'bold' },
  matchInfo: { flex: 1, alignItems: 'center' },
  matchText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginBottom: 2 },
  timeText: { color: '#ffffff', fontSize: 14 },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },
  
  // Card styles (matching ContestItem.js)
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  guaranteedSection: { marginBottom: 12 },
  guaranteedText: { color: '#4CAF50', fontSize: 12, fontWeight: '500' },
  largeJoinButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  joinedButton: {
    backgroundColor: '#9CA3AF',
  },
  largeJoinButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  prizeSection: { marginBottom: 16 },
  prizeText: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  progressContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    height: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: { backgroundColor: '#F44336', height: '100%', borderRadius: 10 },
  spotsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  spotsLeftText: { color: '#F44336', fontSize: 12, fontWeight: 'bold' },
  totalSpotsText: { color: '#666', fontSize: 12 },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  footerText: { color: '#333', fontSize: 12, fontWeight: '500' },
  loadingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  loadingText: { marginLeft: 8, color: '#4CAF50', fontSize: 12 },
  
  // Error styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 40,
  },
  errorText: { fontSize: 18, color: '#333', textAlign: 'center', marginBottom: 20 },
  backButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});

export default ContestDetail;
