import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notificationData } from '../data/notifications';
import {
  COLORS,
  TYPE_COLORS,
  TYPE_BORDERS,
  EMOJI_BY_TYPE,
  TRIP_START_DATE,
  TRIP_DAYS_COUNT,
  DAY_NAMES,
  STORAGE_KEYS,
  SNOOZE_BUTTON_TEXT,
} from '../constants';
import { safeAsync, safeJsonParse, safeJsonStringify } from '../errorUtils';

function getTripDay() {
  const now = new Date();
  const diff = Math.floor((now - TRIP_START_DATE) / 86400000) + 1;
  if (diff < 1) return 1;
  if (diff > TRIP_DAYS_COUNT) return TRIP_DAYS_COUNT;
  return diff;
}

export default function TodayScreen() {
  const [day, setDay] = useState(getTripDay());
  const [done, setDone] = useState(new Set());
  const [snoozed, setSnoozed] = useState(new Set());

  useEffect(() => { loadState(); }, []);

  async function loadState() {
    const raw = await safeAsync(
      AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_STATE),
      'Load notification state'
    );
    
    if (raw) {
      const state = safeJsonParse(raw, 'Parse notification state', {});
      setDone(new Set(state.done || []));
      setSnoozed(new Set(state.snoozed || []));
    }
  }

  async function persist(newDone, newSnoozed) {
    const data = {
      done: Array.from(newDone),
      snoozed: Array.from(newSnoozed),
    };
    const json = safeJsonStringify(data, 'Stringify notification state');
    if (json) {
      await safeAsync(
        AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_STATE, json),
        'Persist notification state'
      );
    }
  }

  const notifs = notificationData[day] || [];
  const doneCount = notifs.filter((_, i) => done.has(`${day}-${i}`)).length;
  const snoozeCount = notifs.filter((_, i) => snoozed.has(`${day}-${i}`)).length;
  const pending = notifs.length - doneCount - snoozeCount;

  const markDone = useCallback(async (i) => {
    const nd = new Set(done);
    nd.add(`${day}-${i}`);
    const ns = new Set(snoozed);
    ns.delete(`${day}-${i}`);
    setDone(nd);
    setSnoozed(ns);
    await persist(nd, ns);
  }, [day, done, snoozed]);

  const markSnooze = useCallback(async (i) => {
    const ns = new Set(snoozed);
    ns.add(`${day}-${i}`);
    setSnoozed(ns);
    await persist(done, ns);
  }, [day, done, snoozed]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>MTAF</Text>
          <Text style={styles.subtitle}>My Type-A Friend</Text>
        </View>
        <Text style={styles.dayBadge}>Day {day}</Text>
      </View>

      <View style={styles.dayNameBar}>
        <Text style={styles.dayName}>{DAY_NAMES[day]}</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayPicker} contentContainerStyle={styles.dayPickerContent}>
        {Array.from({ length: 18 }, (_, i) => i + 1).map(d => (
          <TouchableOpacity key={d} onPress={() => setDay(d)}
            style={[styles.dayPill, d === day && styles.dayPillActive]}>
            <Text style={[styles.dayPillText, d === day && styles.dayPillTextActive]}>{d}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.statsRow}>
        {[
          { label: 'Scheduled', val: notifs.length, color: '#333' },
          { label: 'Cleared',   val: doneCount,     color: '#1D9E75' },
          { label: 'Snoozed',   val: snoozeCount,   color: '#BA7517' },
          { label: 'Pending',   val: pending,        color: '#378ADD' },
        ].map(s => (
          <View key={s.label} style={styles.statCard}>
            <Text style={[styles.statVal, { color: s.color }]}>{s.val}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 24 }}>
        {notifs.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No alerts scheduled for this day.</Text>
          </View>
        ) : notifs.map((n, i) => {
          const isDone = done.has(`${day}-${i}`);
          const isSnooze = snoozed.has(`${day}-${i}`);
          return (
            <View key={i} style={[
              styles.card,
              { borderLeftColor: TYPE_BORDERS[n.ty] || COLORS.lightBorder },
              (isDone || isSnooze) && styles.cardFaded,
            ]}>
              <View style={styles.cardTop}>
                <Text style={styles.cardEmoji}>{EMOJI_BY_TYPE[n.ty] || '📌'}</Text>
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{n.h}</Text>
                  <Text style={styles.cardMsg} numberOfLines={2}>{n.m}</Text>
                </View>
                <Text style={styles.cardTime}>{n.t}</Text>
              </View>
              <View style={styles.cardActions}>
                {isDone ? (
                  <Text style={styles.clearedLabel}>✓ Cleared</Text>
                ) : (
                  <TouchableOpacity style={styles.btnDone} onPress={() => markDone(i)}>
                    <Text style={styles.btnDoneText}>Done</Text>
                  </TouchableOpacity>
                )}
                {!isDone && !isSnooze && (
                  <TouchableOpacity style={styles.btnSnooze} onPress={() => markSnooze(i)}>
                    <Text style={styles.btnSnoozeText}>{SNOOZE_BUTTON_TEXT}</Text>
                  </TouchableOpacity>
                )}
                {isSnooze && <Text style={styles.snoozeLabel}>Snoozed…</Text>}
                <View style={[styles.typeBadge, { backgroundColor: TYPE_COLORS[n.ty] || COLORS.veryLightGray }]}>
                  <Text style={styles.typeBadgeText}>{n.ty}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.lightGray },
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  brand: { fontSize: 22, fontWeight: '700', color: COLORS.BRAND, letterSpacing: 2 },
  subtitle: { fontSize: 11, color: COLORS.gray, marginTop: 1 },
  dayBadge: {
    backgroundColor: COLORS.BRAND,
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  dayNameBar: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  dayName: { fontSize: 13, color: '#666' },
  dayPicker: { maxHeight: 48, backgroundColor: COLORS.white },
  dayPickerContent: { paddingHorizontal: 12, paddingBottom: 8, gap: 6, flexDirection: 'row' },
  dayPill: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.veryLightGray,
  },
  dayPillActive: { backgroundColor: COLORS.BRAND },
  dayPillText: { fontSize: 12, color: '#666', fontWeight: '500' },
  dayPillTextActive: { color: COLORS.white, fontWeight: '700' },
  statsRow: {
    flexDirection: 'row', paddingHorizontal: 12,
    paddingVertical: 10, gap: 8, backgroundColor: COLORS.white,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  statCard: {
    flex: 1, backgroundColor: COLORS.bgInput, borderRadius: 8,
    paddingVertical: 10, alignItems: 'center',
  },
  statVal: { fontSize: 22, fontWeight: '600', marginBottom: 2 },
  statLabel: { fontSize: 10, color: COLORS.gray },
  list: { flex: 1, paddingHorizontal: 12, paddingTop: 10 },
  card: {
    backgroundColor: COLORS.white, borderRadius: 10,
    marginBottom: 10, borderLeftWidth: 4, padding: 12,
  },
  cardFaded: { opacity: 0.35 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  cardEmoji: { fontSize: 20 },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 13, fontWeight: '600', color: COLORS.darkGray, marginBottom: 2 },
  cardMsg: { fontSize: 11, color: '#666', lineHeight: 16 },
  cardTime: { fontSize: 10, color: COLORS.gray },
  cardActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' },
  btnDone: {
    backgroundColor: COLORS.darkGray, paddingVertical: 5,
    paddingHorizontal: 12, borderRadius: 4,
  },
  btnDoneText: { color: COLORS.white, fontSize: 11, fontWeight: '600' },
  btnSnooze: {
    backgroundColor: COLORS.veryLightGray, paddingVertical: 5,
    paddingHorizontal: 10, borderRadius: 4,
    borderWidth: 0.5, borderColor: COLORS.lightBorder,
  },
  btnSnoozeText: { color: '#666', fontSize: 10, fontWeight: '500' },
  clearedLabel: { fontSize: 10, color: '#1D9E75', fontWeight: '500' },
  snoozeLabel: { fontSize: 10, color: COLORS.gray },
  typeBadge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 4 },
  typeBadgeText: { fontSize: 9, fontWeight: '600', color: '#666' },
  empty: { paddingVertical: 40, alignItems: 'center' },
  emptyText: { fontSize: 14, color: COLORS.gray },
});
