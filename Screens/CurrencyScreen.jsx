import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, TextInput,
  ActivityIndicator, Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  COLORS, CURRENCIES, SPENDING_EXAMPLES, QUICK_AMOUNTS, FALLBACK_RATES,
} from '../constants.js';

function fmt(value, code) {
  if (value === null || isNaN(value)) return '—';
  const n = Number(value);
  switch (code) {
    case 'IDR': return 'Rp ' + Math.round(n).toLocaleString('en-US');
    case 'JPY': return '¥' + Math.round(n).toLocaleString('en-US');
    case 'KRW': return '₩' + Math.round(n).toLocaleString('en-US');
    case 'USD': return '$' + n.toFixed(2);
    case 'AUD': return 'A$' + n.toFixed(2);
    case 'SGD': return 'S$' + n.toFixed(2);
    case 'EUR': return '€' + n.toFixed(2);
    case 'GBP': return '£' + n.toFixed(2);
    default:    return n.toFixed(2);
  }
}

function convert(amount, from, to, rates) {
  if (!rates[from] || !rates[to]) return null;
  const usd = from === 'USD' ? amount : amount / rates[from];
  return to === 'USD' ? usd : usd * rates[to];
}

export default function CurrencyScreen() {
  const [rates, setRates] = useState(FALLBACK_RATES);
  const [rateDate, setRateDate] = useState('Loading…');
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('100');
  const [fromCode, setFromCode] = useState('USD');
  const [toCode, setToCode] = useState('IDR');
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [tab, setTab] = useState('converter'); // 'converter' | 'spending'

  useEffect(() => {
    fetchRates();
  }, []);

  async function fetchRates() {
    try {
      const res = await fetch('https://api.frankfurter.app/latest?from=USD');
      const data = await res.json();
      setRates({ ...data.rates, USD: 1 });
      setRateDate(data.date);
    } catch {
      setRateDate('Offline estimate');
    } finally {
      setLoading(false);
    }
  }

  function swap() {
    const prev = fromCode;
    setFromCode(toCode);
    setToCode(prev);
  }

  const numAmount = parseFloat(amount) || 0;
  const result = convert(numAmount, fromCode, toCode, rates);
  const reverseRate = convert(1, toCode, fromCode, rates);

  const fromCur = CURRENCIES.find(c => c.code === fromCode);
  const toCur   = CURRENCIES.find(c => c.code === toCode);

  function CurrencyPicker({ selected, onSelect, onClose }) {
    return (
      <View style={styles.pickerOverlay}>
        <View style={styles.pickerSheet}>
          <Text style={styles.pickerTitle}>Select currency</Text>
          <ScrollView>
            {CURRENCIES.map(c => (
              <TouchableOpacity
                key={c.code}
                style={[styles.pickerRow, c.code === selected && styles.pickerRowActive]}
                onPress={() => { onSelect(c.code); onClose(); }}
              >
                <Text style={styles.pickerFlag}>{c.flag}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pickerCode}>{c.code}</Text>
                  <Text style={styles.pickerName}>{c.name}</Text>
                </View>
                {c.code === selected && <Text style={{ color: COLORS.BRAND, fontSize: 16 }}>✓</Text>}
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.pickerClose} onPress={onClose}>
            <Text style={styles.pickerCloseText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>MTAF</Text>
          <Text style={styles.subtitle}>Currency</Text>
        </View>
        <View style={styles.ratePill}>
          {loading
            ? <ActivityIndicator size="small" color={COLORS.BRAND} />
            : <Text style={styles.rateDate}>{rateDate}</Text>
          }
        </View>
      </View>

      <View style={styles.tabs}>
        {['converter', 'spending'].map(t => (
          <TouchableOpacity key={t} style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
            onPress={() => setTab(t)}>
            <Text style={[styles.tabBtnText, tab === t && styles.tabBtnTextActive]}>
              {t === 'converter' ? 'Converter' : 'Bali spending'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 32 }}>
        {tab === 'converter' ? (
          <>
            <View style={styles.converterCard}>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fieldLabel}>Amount</Text>
                  <TextInput
                    style={styles.amountInput}
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="decimal-pad"
                    placeholder="0"
                  />
                </View>
                <TouchableOpacity style={styles.swapBtn} onPress={swap}>
                  <Text style={styles.swapIcon}>⇄</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fieldLabel}>From</Text>
                  <TouchableOpacity style={styles.currencyBtn} onPress={() => { setShowFromPicker(true); setShowToPicker(false); }}>
                    <Text style={styles.currencyFlag}>{fromCur?.flag}</Text>
                    <Text style={styles.currencyCode}>{fromCode}</Text>
                    <Text style={styles.chevron}>▾</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ width: 36 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.fieldLabel}>To</Text>
                  <TouchableOpacity style={styles.currencyBtn} onPress={() => { setShowToPicker(true); setShowFromPicker(false); }}>
                    <Text style={styles.currencyFlag}>{toCur?.flag}</Text>
                    <Text style={styles.currencyCode}>{toCode}</Text>
                    <Text style={styles.chevron}>▾</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>{fmt(numAmount, fromCode)} {fromCode} =</Text>
              <Text style={styles.resultValue}>{fmt(result, toCode)}</Text>
              <Text style={styles.reverseRate}>
                1 {toCode} = {fmt(reverseRate, fromCode)} {fromCode}
              </Text>
            </View>

            <Text style={styles.sectionLabel}>Quick amounts</Text>
            <View style={styles.quickGrid}>
              {(QUICK_AMOUNTS[fromCode] || [10, 50, 100, 500]).map(a => (
                <TouchableOpacity key={a} style={styles.quickCard}
                  onPress={() => setAmount(String(a))}>
                  <Text style={styles.quickFrom}>{fmt(a, fromCode)}</Text>
                  <Text style={styles.quickTo}>{fmt(convert(a, fromCode, toCode, rates), toCode)}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.rateRow}>
              <Text style={styles.rateLabel}>Live rate · {rateDate}</Text>
              <TouchableOpacity onPress={fetchRates}>
                <Text style={styles.refreshBtn}>Refresh</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.sectionLabel}>Showing in {toCode} · tap to update currency above</Text>
            <View style={styles.spendingCard}>
              {SPENDING_EXAMPLES.map((item, i) => {
                const converted = convert(item.usd, 'USD', toCode, rates);
                return (
                  <View key={i} style={[
                    styles.spendRow,
                    i < SPENDING_EXAMPLES.length - 1 && styles.spendRowBorder
                  ]}>
                    <Text style={styles.spendLabel}>{item.label}</Text>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.spendConverted}>{fmt(converted, toCode)}</Text>
                      <Text style={styles.spendUsd}>${item.usd}</Text>
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={styles.budgetCard}>
              <Text style={styles.budgetTitle}>Your trip budget</Text>
              {[
                { label: 'Total budget',        usd: 6360 },
                { label: 'Lodging',             usd: 3680 },
                { label: 'Dining & Activities', usd: 1405 },
                { label: 'Travel & Transfers',  usd: 775  },
                { label: 'Shopping',            usd: 500  },
              ].map((b, i) => (
                <View key={i} style={[styles.budgetRow, i < 4 && styles.budgetRowBorder]}>
                  <Text style={[styles.budgetLabel, i === 0 && { fontWeight: '600', color: '#333' }]}>{b.label}</Text>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.budgetConverted, i === 0 && { fontWeight: '600', color: COLORS.BRAND }]}>
                      {fmt(convert(b.usd, 'USD', toCode, rates), toCode)}
                    </Text>
                    <Text style={styles.budgetUsd}>${b.usd.toLocaleString()}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {showFromPicker && (
        <CurrencyPicker selected={fromCode} onSelect={setFromCode} onClose={() => setShowFromPicker(false)} />
      )}
      {showToPicker && (
        <CurrencyPicker selected={toCode} onSelect={setToCode} onClose={() => setShowToPicker(false)} />
      )}
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
  brand: { fontSize: 22, fontWeight: '700', color: COLORS.BRAND, letterSpacing: 2 },
  subtitle: { fontSize: 11, color: '#999', marginTop: 1 },
  ratePill: {
    backgroundColor: '#f0f0f0', paddingHorizontal: 12,
    paddingVertical: 5, borderRadius: 20,
  },
  rateDate: { fontSize: 11, color: '#666' },
  tabs: {
    flexDirection: 'row', backgroundColor: '#fff',
    paddingHorizontal: 16, paddingBottom: 12, gap: 8,
  },
  tabBtn: {
    flex: 1, paddingVertical: 8, borderRadius: 8,
    backgroundColor: '#f0f0f0', alignItems: 'center',
  },
  tabBtnActive: { backgroundColor: COLORS.BRAND },
  tabBtnText: { fontSize: 13, color: '#666', fontWeight: '500' },
  tabBtnTextActive: { color: '#fff' },
  scroll: { flex: 1 },
  converterCard: {
    backgroundColor: '#fff', margin: 12,
    borderRadius: 12, padding: 16,
    borderWidth: 0.5, borderColor: '#e0e0e0',
    gap: 16,
  },
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 12 },
  fieldLabel: { fontSize: 11, color: '#999', marginBottom: 6 },
  amountInput: {
    fontSize: 24, fontWeight: '500', color: '#333',
    borderBottomWidth: 1.5, borderBottomColor: COLORS.BRAND,
    paddingVertical: 4,
  },
  swapBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#f0f0f0', alignItems: 'center',
    justifyContent: 'center', marginBottom: 2,
  },
  swapIcon: { fontSize: 18, color: COLORS.BRAND },
  currencyBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#f7f7f7', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10,
  },
  currencyFlag: { fontSize: 20 },
  currencyCode: { fontSize: 15, fontWeight: '600', color: '#333', flex: 1 },
  chevron: { fontSize: 12, color: '#999' },
  resultCard: {
    backgroundColor: COLORS.BRAND, marginHorizontal: 12,
    borderRadius: 12, padding: 20, alignItems: 'center',
  },
  resultLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  resultValue: { fontSize: 36, fontWeight: '700', color: '#fff', letterSpacing: -0.5 },
  reverseRate: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 6 },
  sectionLabel: { fontSize: 12, color: '#999', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  quickGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: 12, gap: 8,
  },
  quickCard: {
    backgroundColor: '#fff', borderRadius: 8,
    padding: 10, width: '47%',
    borderWidth: 0.5, borderColor: '#e0e0e0',
  },
  quickFrom: { fontSize: 11, color: '#999', marginBottom: 2 },
  quickTo: { fontSize: 14, fontWeight: '600', color: '#333' },
  rateRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 16, alignItems: 'center',
  },
  rateLabel: { fontSize: 11, color: '#bbb' },
  refreshBtn: { fontSize: 12, color: COLORS.BRAND, fontWeight: '500' },
  spendingCard: {
    backgroundColor: '#fff', marginHorizontal: 12,
    borderRadius: 12, overflow: 'hidden',
    borderWidth: 0.5, borderColor: '#e0e0e0',
  },
  spendRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12,
  },
  spendRowBorder: { borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0' },
  spendLabel: { fontSize: 13, color: '#555' },
  spendConverted: { fontSize: 14, fontWeight: '600', color: '#333' },
  spendUsd: { fontSize: 10, color: '#bbb' },
  budgetCard: {
    backgroundColor: '#fff', marginHorizontal: 12, marginTop: 12,
    borderRadius: 12, overflow: 'hidden',
    borderWidth: 0.5, borderColor: '#e0e0e0',
  },
  budgetTitle: {
    fontSize: 12, fontWeight: '600', color: '#999',
    paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8,
    textTransform: 'uppercase', letterSpacing: 1,
  },
  budgetRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 16, paddingVertical: 11,
  },
  budgetRowBorder: { borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0' },
  budgetLabel: { fontSize: 13, color: '#666' },
  budgetConverted: { fontSize: 14, color: '#333' },
  budgetUsd: { fontSize: 10, color: '#bbb' },
  pickerOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end',
  },
  pickerSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 20,
    borderTopRightRadius: 20, paddingTop: 16, maxHeight: '70%',
  },
  pickerTitle: {
    fontSize: 15, fontWeight: '600', color: '#333',
    textAlign: 'center', marginBottom: 12,
  },
  pickerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingVertical: 13,
    borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0',
  },
  pickerRowActive: { backgroundColor: '#f0faf5' },
  pickerFlag: { fontSize: 24 },
  pickerCode: { fontSize: 14, fontWeight: '600', color: '#333' },
  pickerName: { fontSize: 12, color: '#999' },
  pickerClose: {
    paddingVertical: 16, alignItems: 'center',
    borderTopWidth: 0.5, borderTopColor: '#e0e0e0', marginTop: 4,
  },
  pickerCloseText: { fontSize: 15, color: '#999' },
});
