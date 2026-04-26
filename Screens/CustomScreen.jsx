import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BRAND = '#1a6b5a';

const DAY_LABELS = [
  '', 'Day 1 — Travel DFW→ICN', 'Day 2 — Arrival DPS', 'Day 3 — Spa morning',
  'Day 4 — Cliffside cocktails', 'Day 5 — Temple + fire dance', 'Day 6 — Resort & relax',
  'Day 7 — Sidemen escape', 'Day 8 — Gili arrival', 'Day 9 — Explore Gilis',
  'Day 10 — Ubud arrival', 'Day 11 — Relax & recharge', 'Day 12 — Volcano + day club',
  'Day 13 — Adventure & culture', 'Day 14 — Jungle fever', 'Day 15 — Seminyak shopping',
  'Day 16 — Beach bliss', 'Day 17 — Brunch finale', 'Day 18 — Departure + Seoul',
];

const TYPES = [
  { key: 'wake',     emoji: '⏰', label: 'Wake-up'   },
  { key: 'hydrate',  emoji: '💧', label: 'Hydrate'   },
  { key: 'ready',    emoji: '👗', label: 'Get ready' },
  { key: 'travel',   emoji: '🗺️', label: 'Travel'    },
  { key: 'unplug',   emoji: '🌿', label: 'Unplug'    },
  { key: 'food',     emoji: '🍽️', label: 'Food'      },
  { key: 'wellness', emoji: '🧘', label: 'Wellness'  },
  { key: 'reminder', emoji: '📌', label: 'Reminder'  },
];

export default function CustomScreen() {
  const [customs, setCustoms] = useState([]);
  const [day, setDay] = useState(1);
  const [time, setTime] = useState('09:00 AM');
  const [type, setType] = useState('reminder');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const raw = await AsyncStorage.getItem('customNotifications');
      if (raw) setCustoms(JSON.parse(raw));
    } catch {}
  }

  async function save(list) {
    setCustoms(list);
    await AsyncStorage.setItem('customNotifications', JSON.stringify(list));
  }

  function add() {
    if (!title.trim()) { setError('Please add a title.'); return; }
    setError('');
    const notif = { id: Date.now(), day, time, ty: type, h: title.trim(), m: message.trim() };
    save([notif, ...customs]);
    setTitle(''); setMessage('');
  }

  async function remove(id) {
    save(customs.filter(c => c.id !== id));
  }

  const selectedType = TYPES.find(t => t.key === type);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>MTAF</Text>
          <Text style={styles.subtitle}>Custom Alerts</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{customs.length} added</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.form}>
          <Text style={styles.formLabel}>Day</Text>
          <TouchableOpacity style={styles.picker} onPress={() => setShowDayPicker(true)}>
            <Text style={styles.pickerText}>{DAY_LABELS[day]}</Text>
            <Text style={styles.chevron}>▾</Text>
          </TouchableOpacity>

          <Text style={styles.formLabel}>Time</Text>
          <TextInput
            style={styles.input}
            value={time}
            onChangeText={setTime}
            placeholder="e.g. 08:30 AM"
          />

          <Text style={styles.formLabel}>Type</Text>
          <TouchableOpacity style={styles.picker} onPress={() => setShowTypePicker(true)}>
            <Text style={styles.pickerEmoji}>{selectedType?.emoji}</Text>
            <Text style={styles.pickerText}>{selectedType?.label}</Text>
            <Text style={styles.chevron}>▾</Text>
          </TouchableOpacity>

          <Text style={styles.formLabel}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Short alert title"
          />

          <Text style={styles.formLabel}>Message</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={message}
            onChangeText={setMessage}
            placeholder="Optional details"
            multiline
            numberOfLines={3}
          />

          {!!error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity style={styles.addBtn} onPress={add}>
            <Text style={styles.addBtnText}>+ Add Notification</Text>
          </TouchableOpacity>
        </View>

        {customs.length > 0 && (
          <>
            <Text style={styles.listLabel}>Your custom alerts ({customs.length})</Text>
            <View style={styles.card}>
              {customs.map((c, i) => (
                <View key={c.id} style={[styles.customRow, i < customs.length - 1 && styles.customBorder]}>
                  <Text style={styles.customEmoji}>
                    {TYPES.find(t => t.key === c.ty)?.emoji || '📌'}
                  </Text>
                  <View style={styles.customInfo}>
                    <Text style={styles.customTitle}>{c.h}</Text>
                    <Text style={styles.customMeta}>Day {c.day} · {c.time} · {c.ty}</Text>
                    {!!c.m && <Text style={styles.customMsg} numberOfLines={1}>{c.m}</Text>}
                  </View>
                  <TouchableOpacity onPress={() => remove(c.id)} style={styles.removeBtn}>
                    <Text style={styles.removeBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}

        {customs.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No custom alerts yet.</Text>
            <Text style={styles.emptySubtext}>Add one above and it will appear in Today.</Text>
          </View>
        )}
      </ScrollView>

      {showDayPicker && (
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Select day</Text>
            <ScrollView>
              {DAY_LABELS.slice(1).map((label, idx) => (
                <TouchableOpacity key={idx + 1}
                  style={[styles.sheetRow, (idx + 1) === day && styles.sheetRowActive]}
                  onPress={() => { setDay(idx + 1); setShowDayPicker(false); }}>
                  <Text style={styles.sheetText}>{label}</Text>
                  {(idx + 1) === day && <Text style={{ color: BRAND }}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.sheetClose} onPress={() => setShowDayPicker(false)}>
              <Text style={styles.sheetCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {showTypePicker && (
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Select type</Text>
            {TYPES.map(t => (
              <TouchableOpacity key={t.key}
                style={[styles.sheetRow, t.key === type && styles.sheetRowActive]}
                onPress={() => { setType(t.key); setShowTypePicker(false); }}>
                <Text style={styles.sheetEmoji}>{t.emoji}</Text>
                <Text style={styles.sheetText}>{t.label}</Text>
                {t.key === type && <Text style={{ color: BRAND, marginLeft: 'auto' }}>✓</Text>}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.sheetClose} onPress={() => setShowTypePicker(false)}>
              <Text style={styles.sheetCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fafafa' },
  header: {
    backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12,
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
  form: {
    backgroundColor: '#fff', margin: 12,
    borderRadius: 12, padding: 16,
    borderWidth: 0.5, borderColor: '#e0e0e0', gap: 8,
  },
  formLabel: { fontSize: 11, color: '#999', marginTop: 6 },
  input: {
    borderWidth: 0.5, borderColor: '#ddd', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 14, color: '#333', backgroundColor: '#fafafa',
  },
  textarea: { height: 72, textAlignVertical: 'top' },
  picker: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 0.5, borderColor: '#ddd', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10, gap: 8,
    backgroundColor: '#fafafa',
  },
  pickerEmoji: { fontSize: 16 },
  pickerText: { flex: 1, fontSize: 14, color: '#333' },
  chevron: { fontSize: 11, color: '#bbb' },
  error: { fontSize: 12, color: '#E24B4A', marginTop: 4 },
  addBtn: {
    backgroundColor: BRAND, borderRadius: 8,
    paddingVertical: 12, alignItems: 'center', marginTop: 8,
  },
  addBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  listLabel: { fontSize: 12, color: '#999', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  card: {
    backgroundColor: '#fff', marginHorizontal: 12,
    borderRadius: 12, overflow: 'hidden',
    borderWidth: 0.5, borderColor: '#e0e0e0',
  },
  customRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingHorizontal: 16, paddingVertical: 12, gap: 10,
  },
  customBorder: { borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0' },
  customEmoji: { fontSize: 18, marginTop: 1 },
  customInfo: { flex: 1 },
  customTitle: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 2 },
  customMeta: { fontSize: 11, color: '#aaa', marginBottom: 2 },
  customMsg: { fontSize: 11, color: '#bbb' },
  removeBtn: {
    padding: 4, borderRadius: 4,
    backgroundColor: '#f0f0f0', marginTop: 2,
  },
  removeBtnText: { fontSize: 12, color: '#999' },
  empty: { paddingTop: 32, alignItems: 'center' },
  emptyText: { fontSize: 14, color: '#bbb', fontWeight: '500' },
  emptySubtext: { fontSize: 12, color: '#ccc', marginTop: 4 },
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 20,
    borderTopRightRadius: 20, paddingTop: 16, maxHeight: '70%',
  },
  sheetTitle: {
    fontSize: 15, fontWeight: '600', color: '#333',
    textAlign: 'center', marginBottom: 8, paddingHorizontal: 20,
  },
  sheetRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 20, paddingVertical: 13,
    borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0',
  },
  sheetRowActive: { backgroundColor: '#f0faf5' },
  sheetEmoji: { fontSize: 18 },
  sheetText: { fontSize: 14, color: '#333', flex: 1 },
  sheetClose: {
    paddingVertical: 16, alignItems: 'center',
    borderTopWidth: 0.5, borderTopColor: '#e0e0e0',
  },
  sheetCloseText: { fontSize: 15, color: '#999' },
});
