import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// --- Reusable Icon Component ---
const Icon = ({ name, size = 14, color = '#888' }) => (
  <Text style={{ fontSize: size, color: color, marginRight: 4 }}>
    {name === 'trophy' ? '🏆' : name === 'team' ? 'Ⓜ️' : '💰'}
  </Text>
);

// --- Main Contest Item Component ---
const ContestItem = ({
  isPractice = false,
  prizePool = 'Amount',
  entryFee = 49,
  spotsLeft = 800,
  totalSpots = 999,
  firstPrize = '20.5 Lakhs',
  winnerPercentage = 59,
  maxTeams = 20,
  isHighlighted = false,
}) => {
  const fillPercentage = ((totalSpots - spotsLeft) / totalSpots) * 100;
  
  // Format spots display based on the design
  const formatSpots = (spots) => {
    if (spots >= 10000) {
      return spots.toLocaleString().replace(/,/g, ',');
    }
    return spots.toString();
  };

  return (
    <View style={[styles.card, isHighlighted && styles.highlightedCard]}>
      {/* --- Top Section --- */}
      <View style={styles.topSection}>
        <View style={styles.leftSection}>
          <Text style={styles.guaranteedText}>
            {isPractice ? '✅ Guaranteed' : '✅ Guaranteed Prize Pool'}
          </Text>
        </View>
        <View style={styles.rightSection}>
          {!isPractice && (
            <Text style={styles.entryFeeText}>₹{entryFee}</Text>
          )}
          <TouchableOpacity style={isPractice ? styles.joinButton : styles.entryButton}>
            <Text style={styles.buttonText}>
              {isPractice ? 'JOIN' : '₹EF'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- Prize Pool Section --- */}
      <View style={styles.prizeSection}>
        <Text style={styles.prizeText}>
          {isPractice ? 'Practice Contest' : `₹${prizePool}`}
        </Text>
      </View>

      {/* --- Progress Bar --- */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${fillPercentage}%` }]} />
      </View>
      
      {/* --- Spots Information --- */}
      <View style={styles.spotsSection}>
        <Text style={styles.spotsLeftText}>
          {spotsLeft >= 10000 ? `${formatSpots(spotsLeft)} left` : `${spotsLeft} left`}
        </Text>
        <Text style={styles.totalSpotsText}>
          {totalSpots >= 10000 ? `${formatSpots(totalSpots)} spots` : `${totalSpots} spots`}
        </Text>
      </View>

      {/* --- Bottom Section --- */}
      {isPractice ? (
        <View style={styles.practiceFooter}>
          <View style={styles.gloryBadge}>
            <Text style={styles.gloryText}>🏆 Glory Awaits!</Text>
            <View style={styles.gloryNumber}>
              <Text style={styles.gloryNumberText}>5</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.bottomSection}>
          <View style={styles.footerItem}>
            <Icon name="prize" />
            <Text style={styles.footerText}>₹{firstPrize}</Text>
          </View>
          <View style={styles.footerItem}>
            <Icon name="trophy" />
            <Text style={styles.footerText}>{winnerPercentage}%</Text>
          </View>
          <View style={styles.footerItem}>
            <Icon name="team" />
            <Text style={styles.footerText}>
              {maxTeams === 20 && totalSpots > 10000 ? 'Upto 20' : maxTeams}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  highlightedCard: {
    borderColor: '#9C27B0',
    borderWidth: 2,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  guaranteedText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '500',
  },
  entryFeeText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  entryButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  joinButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  prizeSection: {
    marginBottom: 16,
  },
  prizeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  progressContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    height: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    backgroundColor: '#F44336',
    height: '100%',
    borderRadius: 10,
  },
  spotsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  spotsLeftText: {
    color: '#F44336',
    fontSize: 12,
    fontWeight: 'bold',
  },
  totalSpotsText: {
    color: '#666',
    fontSize: 12,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  practiceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gloryBadge: {
    backgroundColor: '#FFF9C4',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gloryText: {
    color: '#F57F17',
    fontWeight: 'bold',
    fontSize: 12,
  },
  gloryNumber: {
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  gloryNumberText: {
    color: '#333',
    fontSize: 10,
    fontWeight: 'bold',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  footerText: {
    color: '#333',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default ContestItem;