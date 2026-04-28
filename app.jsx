import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

import TodayScreen from './screens/TodayScreen.jsx';
import ScheduleScreen from './screens/ScheduleScreen.jsx';
import CurrencyScreen from './screens/CurrencyScreen.jsx';
import SettingsScreen from './screens/SettingsScreen.jsx';
import CustomScreen from './screens/CustomScreen.jsx';
import { COLORS, TABS as TABS_CONFIG, STORAGE_KEYS } from './constants.js';
import { safeAsync } from './errorUtils.js';

// Initialize notification handler
function initializeNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

initializeNotifications();

const Tab = createBottomTabNavigator();

// Map TABS_CONFIG to include components
const TABS = TABS_CONFIG.map(tab => ({
  ...tab,
  component: {
    Today: TodayScreen,
    Schedule: ScheduleScreen,
    Currency: CurrencyScreen,
    Settings: SettingsScreen,
    Custom: CustomScreen,
  }[tab.name],
}));

function TabIcon({ icon, label, focused }) {
  return (
    <View style={styles.tabIcon}>
      <Text style={[styles.tabEmoji, focused && styles.tabEmojiActive]}>{icon}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </View>
  );
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    registerForPush();
    const sub1 = Notifications.addNotificationReceivedListener(() => {});
    const sub2 = Notifications.addNotificationResponseReceivedListener(() => {});
    return () => {
      Notifications.removeNotificationSubscription(sub1);
      Notifications.removeNotificationSubscription(sub2);
    };
  }, []);

  async function registerForPush() {
    if (!Device.isDevice) return;
    
    const { status: existing } = await safeAsync(
      Notifications.getPermissionsAsync(),
      'Get notification permissions'
    ) || { status: null };
    
    let final = existing;
    if (existing !== 'granted') {
      const result = await safeAsync(
        Notifications.requestPermissionsAsync(),
        'Request notification permissions'
      ) || {};
      final = result.status;
    }
    
    if (final !== 'granted') return;
    
    try {
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
      });
      const token = tokenData?.data;
      
      if (token) {
        setExpoPushToken(token);
        await AsyncStorage.setItem(STORAGE_KEYS.EXPO_PUSH_TOKEN, token);
        
        if (process.env.EXPO_PUBLIC_API_URL) {
          await safeAsync(
            fetch(`${process.env.EXPO_PUBLIC_API_URL}/register-device`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                expoPushToken: token,
                userId: 'mtaf-user',
                device: Device.osName,
              }),
            }),
            'Register device token with API'
          );
        }
      }
    } catch (error) {
      console.warn('[registerForPush] Failed to get push token:', error);
    }
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Tab.Navigator
        screenOptions={{ headerShown: false, tabBarStyle: styles.tabBar, tabBarShowLabel: false }}
      >
        {TABS.map(({ name, icon, component }) => (
          <Tab.Screen
            key={name}
            name={name}
            component={component}
            options={{
              tabBarIcon: ({ focused }) => (
                <TabIcon icon={icon} label={name} focused={focused} />
              ),
            }}
          />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
    height: 64,
    paddingTop: 6,
    paddingBottom: 8,
  },
  tabIcon: {
    alignItems: 'center',
    gap: 2,
  },
  tabEmoji: {
    fontSize: 20,
    opacity: 0.4,
  },
  tabEmojiActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 10,
    color: COLORS.gray,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: COLORS.BRAND,
  },
});