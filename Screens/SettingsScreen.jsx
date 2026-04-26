import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BRAND = '#1a6b5a';

const CATEGORIES = [
  { key: 'wake',     emoji: '⏰', label: 'Wake-up alarms',      desc: 'Early starts, flight departures, 3 AM Batur' },
  { key: 'hydrate',  emoji: '💧', label: 'Hydration reminders', desc: 'Every 2–3 hrs, pre/post-activity' },
  { key: 'ready',    emoji: '👗', label: 'Get ready prompts',   desc: '30–60 min before dinners, shows, departures' },
  { key: 'travel',   emoji: '🗺️', label: 'Travel ETAs',         desc: 'Drive times, ferry boarding, gate alerts' },
  { key: 'unplug',   emoji: '🌿', label: 'Unplug & rewind',     desc: 'Sunset moments, digital detox nudges' },
  { key: 'food',     emoji: '🍽️', label: 'Food & dining',       desc: 'Reservation timing, meal reminders' },
  { key: 'wellness', emoji: '🧘', label: 'Wellness check-ins',  desc: 'Rest prompts, yoga, energy checks, sleep' },
  { key: 'reminder', emoji: '📌', label: 'Custom reminders',    desc: 'Your personal added alerts' },
];

const DEFAULT_SETTINGS = Object.fromEntries(CATEGORIES.map(c => [c.key, true]));

export default function SettingsScreen() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => { loadSettings(); }, []);

  async function loadSettings() {
    try {
      const raw = await AsyncStorage.getItem('notificationSettings');
      if (raw) setSettings(JSON.parse(raw));
    } catch {}
  }

  async function toggle(key) {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    await AsyncStorage.setItem('notificationSettings', JSON.stringify(next));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  const activeCount = Object.values(settings).filter(Boolean).length;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>MTAF</Text>
          <Text style={styles.subtitle}>Notification Settings</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{activeCount}/8 on</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.sectionNote}>
          Toggle notification categories. Changes apply to your next scheduled build.
        </Text>

        <View style={styles.card}>
          {CATEGORIES.map((cat, i) => (
            <View key={cat.key} style={[styles.row, i < CATEGORIES.length - 1 && styles.rowBorder]}>
              <View style={[styles.iconWrap, { backgroundColor: settings[cat.key] ? BRAND + '15' : '#f0f0f0' }]}>
                <Text style={styles.emoji}>{cat.emoji}</Text>
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>{cat.label}</Text>
                <Text style={styles.rowDesc}>{cat.desc}</Text>
              </View>
              <Switch
                value={settings[cat.key]}
                onValueChange={() => toggle(cat.key)}
                trackColor={{ false: '#e0e0e0', true: BRAND }}
                thumbColor="#fff"
              />
            </View>
          ))}
        </View>

        {saved && (
          <View style={styles.savedBanner}>
            <Text style={styles.savedText}>✓ Settings saved</Text>
          </View>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About MTAF</Text>
          <Text style={styles.infoBody}>
            My Type-A Friend keeps your Bali honeymoon on track — wake times, hydration,
            transfers, sunsets, and every detail in between. {'\n\n'}
            Trip dates: May 1–18, 2026 · Dallas → Bali
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fafafa' },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16, paddingVertical: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderBottomWidth: 0.5, borderBottomColor: '#e0e0e0',
  },
  brand: { fontSize: 22, fontWeight: '700', color: BRAND, letterSpacing: 2 },
  subtitle: { fontSize: 11, color: '#999', marginTop: 1 },
  countBadge: {
    backgroundColor: BRAND + '15', paddingHorizontal: 12,
    paddingVertical: 5, borderRadius: 20,
  },
  countText: { fontSize: 12, color: BRAND, fontWeight: '600' },
  sectionNote: {
    fontSize: 12, color: '#999', paddingHorizontal: 16,
    paddingTop: 14, paddingBottom: 10,
  },
  card: {
    backgroundColor: '#fff', marginHorizontal: 12,
    borderRadius: 12, overflow: 'hidden',
    borderWidth: 0.5, borderColor: '#e0e0e0',
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14, gap: 12,
  },
  rowBorder: { borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0' },
  iconWrap: {
    width: 38, height: 38, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  emoji: { fontSize: 18 },
  rowInfo: { flex: 1 },
  rowLabel: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 2 },
  rowDesc: { fontSize: 11, color: '#aaa' },
  savedBanner: {
    backgroundColor: BRAND, marginHorizontal: 12, marginTop: 12,
    borderRadius: 8, paddingVertical: 10, alignItems: 'center',
  },
  savedText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  infoCard: {
    backgroundColor: '#fff', marginHorizontal: 12, marginTop: 16,
    borderRadius: 12, padding: 16,
    borderWidth: 0.5, borderColor: '#e0e0e0',
  },
  infoTitle: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 8 },
  infoBody: { fontSize: 12, color: '#888', lineHeight: 18 },
});
