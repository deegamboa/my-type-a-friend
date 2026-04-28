import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { notificationData } from '../data/notifications.js';
import {
  COLORS, SCHEDULE_DAYS, INTENSITY_COLORS, INTENSITY_LABELS, EMOJI_BY_TYPE,
} from '../constants.js';

export default function ScheduleScreen() {
  const [expanded, setExpanded] = useState(null);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>MTAF</Text>
          <Text style={styles.subtitle}>18-Day Schedule</Text>
        </View>
        <View style={styles.legend}>
          {Object.entries(INTENSITY_COLORS).map(([k, c]) => (
            <View key={k} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: c }]} />
              <Text style={styles.legendText}>{INTENSITY_LABELS[k]}</Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 32 }}>
        {SCHEDULE_DAYS.map(day => {
          const notifs = notificationData[day.d] || [];
          const isOpen = expanded === day.d;
          const color = INTENSITY_COLORS[day.intensity];

          return (
            <View key={day.d}>
              <TouchableOpacity
                style={[styles.dayRow, { borderLeftColor: color }]}
                onPress={() => setExpanded(isOpen ? null : day.d)}
                activeOpacity={0.7}
              >
                <View style={[styles.dayCircle, { backgroundColor: color }]}>
                  <Text style={styles.dayNum}>{day.d}</Text>
                </View>
                <View style={styles.dayInfo}>
                  <Text style={styles.dayName}>{day.name}</Text>
                  <Text style={styles.dayLoc}>{day.loc}</Text>
                </View>
                <View style={styles.dayRight}>
                  <Text style={styles.alertCount}>{notifs.length}</Text>
                  <Text style={styles.alertLabel}>alerts</Text>
                </View>
                <Text style={styles.chevron}>{isOpen ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {isOpen && (
                <View style={styles.expandedPanel}>
                  <View style={[styles.intensityBadge, { backgroundColor: color + '20' }]}>
                    <Text style={[styles.intensityText, { color }]}>
                      {INTENSITY_LABELS[day.intensity]} day
                    </Text>
                  </View>
                  {notifs.map((n, i) => (
                    <View key={i} style={[styles.notifRow, i < notifs.length - 1 && styles.notifBorder]}>
                      <Text style={styles.notifTime}>{n.t}</Text>
                      <Text style={styles.notifEmoji}>
                        {EMOJI_BY_TYPE[n.ty] || '📌'}
                      </Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.notifTitle}>{n.h}</Text>
                        <Text style={styles.notifMsg} numberOfLines={1}>{n.m}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fafafa' },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10,
    borderBottomWidth: 0.5, borderBottomColor: '#e0e0e0',
  },
  brand: { fontSize: 22, fontWeight: '700', color: COLORS.BRAND, letterSpacing: 2 },
  subtitle: { fontSize: 11, color: '#999', marginTop: 1, marginBottom: 10 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 10, color: '#888' },
  list: { flex: 1, paddingHorizontal: 12, paddingTop: 10 },
  dayRow: {
    backgroundColor: '#fff', borderRadius: 10,
    marginBottom: 8, borderLeftWidth: 4,
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, paddingHorizontal: 12, gap: 10,
  },
  dayCircle: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  dayNum: { color: '#fff', fontWeight: '700', fontSize: 13 },
  dayInfo: { flex: 1 },
  dayName: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 2 },
  dayLoc: { fontSize: 11, color: '#999' },
  dayRight: { alignItems: 'center', marginRight: 4 },
  alertCount: { fontSize: 16, fontWeight: '600', color: '#333' },
  alertLabel: { fontSize: 9, color: '#bbb' },
  chevron: { fontSize: 10, color: '#bbb' },
  expandedPanel: {
    backgroundColor: '#f9f9f9', marginHorizontal: 0,
    marginBottom: 8, borderRadius: 10, padding: 12,
  },
  intensityBadge: {
    alignSelf: 'flex-start', paddingHorizontal: 10,
    paddingVertical: 3, borderRadius: 10, marginBottom: 10,
  },
  intensityText: { fontSize: 11, fontWeight: '600' },
  notifRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    gap: 8, paddingVertical: 7,
  },
  notifBorder: { borderBottomWidth: 0.5, borderBottomColor: '#ebebeb' },
  notifTime: { fontSize: 10, color: '#888', width: 56, paddingTop: 1 },
  notifEmoji: { fontSize: 14 },
  notifTitle: { fontSize: 11, fontWeight: '600', color: '#333' },
  notifMsg: { fontSize: 10, color: '#aaa', marginTop: 1 },
});
