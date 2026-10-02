import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DaynestProvider } from '../DaynestProvider';
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <DaynestProvider>
        <Stack screenOptions={{ headerShown: false, animation: 'none', title: 'Daynest' }} />
      </DaynestProvider>
    </SafeAreaProvider>
  );
}
