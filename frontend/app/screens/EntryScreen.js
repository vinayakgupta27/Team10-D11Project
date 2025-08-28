import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export default function EntryScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#8A0F1A", "#16181D", "#0D0F13"]}
        locations={[0, 0.35, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Background Grid Pattern */}
        <Image
          source={require('../assets/images/grid_pattern.png')}
          style={styles.backgroundPattern}
          resizeMode="cover"
        />
        
        {/* Content Container */}
        <View style={styles.content}>
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Image
              source={require('../assets/images/dream11_logo.png')}  
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.tagline}>Create your team & win big!</Text>
          </View>

          {/* Action Section */}
          <View style={styles.actionSection}>
            <Pressable
              style={({ pressed }) => [
                styles.joinButton,
                pressed && styles.joinButtonPressed
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                navigation.navigate('ContestList');
              }}
              accessibilityRole="button"
              accessibilityLabel="Join Match"
              accessibilityHint="Navigate to contest list to join a match"
            >
              <LinearGradient
                colors={['#4CAF50', '#2E7D32']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Join Match</Text>
                {/* <Text style={styles.buttonSubtext}>Start Playing Now</Text> */}
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0F13',
  },
  gradient: {
    flex: 1,
    position: 'relative',
  },
  backgroundPattern: {
    position: 'absolute',
    left: -50,
    top: -50,
    width: width * 0.8,
    height: height * 0.6,
    opacity: 0.3,
    transform: [{ rotate: '15deg' }],
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 60,
  },
  welcomeSection: {
    alignItems: 'center',
    marginTop: 100,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '300',
    color: '#E0F7FA',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 30,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  tagline: {
    fontSize: 24,
    fontWeight: '300',
    color: '#E0F7FA',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  actionSection: {
    alignItems: 'center',
    marginTop: 15,
  },
  joinButton: {
    width: width * 0.8,
    borderRadius: 16,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  joinButtonPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.1,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 200,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  buttonSubtext: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
