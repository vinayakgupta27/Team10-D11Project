import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CountdownStore } from '../services/CountdownStore';

export default function ContestFullScreen({ navigation }) {
  const goBackToList = () => {
    navigation.navigate('ContestList');
  };

  const matchInfo = useMemo(() => ({ team1: 'BPH', team2: 'OVI' }), []);
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
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

      <View style={styles.content}>
        <Image
          source={require('../assets/images/out.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>Contest Full</Text>
        <Text style={styles.subtitle}>All spots are already taken.</Text>
        <TouchableOpacity style={styles.button} onPress={goBackToList}>
          <Text style={styles.buttonText}>BACK TO CONTEST LIST</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 0 },
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: '800', color: '#111' },
  subtitle: { fontSize: 14, color: '#6b7280', marginTop: 6, marginBottom: 20 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 10,
    paddingHorizontal: 18,
    shadowColor: 'rgba(0,0,0,0.04)',
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: { color: '#111827', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  buttonIcon: { marginLeft: 8, color: '#111827', fontSize: 14 },
});


