// App.js
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import EntryScreen from './screens/EntryScreen';
import ContestScreen from './screens/ContestScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Entry"
        screenOptions={{
          headerTitleAlign: 'center',
          headerBackTitleVisible: true,
          contentStyle: styles.container,
        }}
      >
        <Stack.Screen name="Entry" component={EntryScreen} options={{ title: 'Welcome' }} />
        <Stack.Screen name="ContestList" component={ContestScreen} options={{ title: 'Contest List' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#f5f5f5' },
});
