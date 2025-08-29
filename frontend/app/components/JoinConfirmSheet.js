import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Pressable } from 'react-native';
import { formatEntryFee } from '../utils/contestUtils';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const JoinConfirmSheet = ({ visible, onClose, entryFee, payable, onConfirm }) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : SCREEN_HEIGHT,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [visible, translateY]);

  if (!visible) {
    return null;
  }

  return (
    <View pointerEvents={'auto'} style={StyleSheet.absoluteFill}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
        <View style={styles.grabber} />
        <Pressable onPress={onClose} style={styles.closeButton} hitSlop={8}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
        <Text style={styles.title}>Confirmation</Text>
        <Text style={styles.subtitle}>Amount Unutilised + Winnings = ₹{formatEntryFee(entryFee)}</Text>

        <View style={styles.row}> 
          <Text style={styles.label}>Entry</Text>
          <Text style={styles.value}>₹{formatEntryFee(entryFee)}</Text>
        </View>

        <View style={styles.row}> 
          <Text style={styles.labelBold}>To Pay</Text>
          <Text style={styles.valueBold}>₹{formatEntryFee(payable)}</Text>
        </View>

        <Text style={styles.tnc}>I agree with the standard T&Cs</Text>

        <TouchableOpacity style={styles.joinButton} onPress={onConfirm}>
          <Text style={styles.joinText}>JOIN CONTEST</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)'
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 28,
  },
  closeButton: {
    position: 'absolute',
    left: 12,
    top: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { fontSize: 18, color: '#6b7280' },
  grabber: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e5e7eb',
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: { fontSize: 20, fontWeight: '700', color: '#111', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginTop: 4, marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  label: { fontSize: 16, color: '#111' },
  value: { fontSize: 16, color: '#111' },
  labelBold: { fontSize: 18, fontWeight: '700', color: '#111' },
  valueBold: { fontSize: 22, fontWeight: '800', color: '#111' },
  tnc: { fontSize: 14, color: '#6b7280', marginTop: 16 },
  joinButton: {
    backgroundColor: '#17a34a',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  joinText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 1 },
});

export default JoinConfirmSheet;


