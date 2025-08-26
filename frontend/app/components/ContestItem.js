import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ContestItem = ({ contest, onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress(contest);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.contestCard}>
        <View style={styles.header}>
          <Text style={styles.contestId}>#{contest.contestId || contest.id}</Text>
          <Text style={styles.status}>{contest.status || 'ACTIVE'}</Text>
        </View>
        
        <Text style={styles.title}>{contest.prizeAmount}</Text>
        
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Entry Fee</Text>
            <Text style={styles.detailValue}>
              ₹{contest.entryFee || contest.entryFee || '0'}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Prize Pool</Text>
            <Text style={styles.detailValue}>
              ₹{contest.prizePool || contest.prizeAmount || '0'}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Participants</Text>
            <Text style={styles.detailValue}>
              {contest.participants || contest.participant_count || '0'}/{contest.maxParticipants || contest.max_participants || 'Unlimited'}
            </Text>
          </View>
        </View>

        {contest.description && (
          <Text style={styles.description} numberOfLines={2}>
            {contest.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  contestCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  contestId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: '#4CAF50',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  },
});

export default ContestItem;
