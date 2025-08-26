import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';

export default function EntryScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Local image using require */}
      <Image
        source={require('../assets/images/dream11_logo.png')}  
        style={styles.image}
        resizeMode="contain"
      />

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('ContestList')}
      >
        <Text style={styles.buttonText}>Join Match</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  image: { width: 150, height: 150, marginBottom: 40 },
  button: { backgroundColor: '#007AFF', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
