// App.js
import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import EntryScreen from './screens/EntryScreen';
import ContestScreen from './screens/ContestScreen';
import ContestDetail from './components/Contestdetail';
import { CountdownStore } from './services/CountdownStore';
import ContestFullScreen from './screens/ContestFullScreen';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={errorStyles.container}>
          <Text style={errorStyles.title}>Oops! Something went wrong</Text>
          <Text style={errorStyles.message}>We're working to fix this issue</Text>
          <Text 
            style={errorStyles.retry}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            Tap to retry
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const Stack = createNativeStackNavigator();

export default function App() {
  // Initialize global timer when app starts
  React.useEffect(() => {
    const initializeTimer = async () => {
      // First try to recover persisted timer
      await CountdownStore.recover();
      
      // If no timer was recovered, set a new one
      if (CountdownStore.getRemaining() === 0) {
        const matchStartTime = new Date(Date.now() + (11 * 60 + 43) * 60 * 1000);
        await CountdownStore.setTarget(matchStartTime.getTime());
      }
    };
    
    initializeTimer();
  }, []);

  return (
    <ErrorBoundary>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="Entry"
          screenOptions={{
            headerTitleAlign: 'center',
            headerBackTitleVisible: true,
            contentStyle: styles.container,
            animation: 'slide_from_right',
            animationDuration: 300,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        >
          <Stack.Screen 
            name="Entry" 
            component={EntryScreen} 
            options={{ 
              headerShown: false,
              animation: 'fade'
            }} 
          />
          <Stack.Screen 
            name="ContestList" 
            component={ContestScreen} 
            options={{ 
              headerShown: false,
              animation: 'slide_from_right'
            }} 
          />
          <Stack.Screen 
            name="ContestDetail" 
            component={ContestDetail} 
            options={{ 
              headerShown: false,
              animation: 'slide_from_bottom'
            }} 
          />
          <Stack.Screen 
            name="ContestFullScreen" 
            component={ContestFullScreen} 
            options={{ 
              headerShown: false,
              animation: 'slide_from_right'
            }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );
}
const styles = StyleSheet.create({
  container: { backgroundColor: '#f5f5f5' },
});

const errorStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D0F13',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#CBD5E1',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  retry: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 8,
    textAlign: 'center',
  },
});
