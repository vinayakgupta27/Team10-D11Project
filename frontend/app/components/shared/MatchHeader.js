import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const MatchHeader = ({ 
  team1 = 'BPH', 
  team2 = 'OVI', 
  timeLeft = '11h 43m 00s left', 
  onBackPress,
  showBackButton = true 
}) => {
  return (
    <LinearGradient
      colors={["#8A0F1A", "#16181D", "#0D0F13"]}
      locations={[0, 0.35, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.header}
    >
      <Image
        source={require('../../assets/images/grid_pattern.png')}
        style={styles.headerPattern}
        resizeMode="cover"
      />
      <View style={styles.headerRow}>
        {showBackButton ? (
          <Text onPress={onBackPress} style={styles.backArrow}>←</Text>
        ) : (
          <View style={{ width: 24 }} />
        )}
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{team1} v {team2}</Text>
          <Text style={styles.headerSubtitle}>{timeLeft}</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 52,
    paddingBottom: 14,
    paddingHorizontal: 16,
    position: 'relative',
  },
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  backArrow: { 
    color: '#ffffff', 
    fontSize: 24, 
    fontWeight: 'bold', 
    width: 24 
  },
  headerCenter: { 
    flex: 1, 
    alignItems: 'center' 
  },
  headerTitle: { 
    fontSize: 22, 
    fontWeight: '800', 
    color: '#ffffff', 
    marginBottom: 2, 
    letterSpacing: 0.3 
  },
  headerSubtitle: { 
    fontSize: 13, 
    color: '#cbd5e1' 
  },
  headerPattern: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 165,
    height: 128.32654,
    opacity: 0.4,
    pointerEvents: 'none',
  },
});

export default MatchHeader;
