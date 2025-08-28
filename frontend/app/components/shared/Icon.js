import React from 'react';
import { Text } from 'react-native';

// --- Reusable Icon Component ---
const Icon = ({ name, size = 14, color = '#888' }) => (
  <Text style={{ fontSize: size, color: color, marginRight: 4 }}>
    {name === 'trophy' ? '🏆' : name === 'team' ? 'Ⓜ️' : '💰'}
  </Text>
);

export default Icon;
