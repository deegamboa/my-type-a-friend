/**
 * Centralized constants for MTAF app
 * Single source of truth for colors, emojis, configuration, and shared data
 */

// Brand & UI Colors
export const COLORS = {
  BRAND: '#1a6b5a',
  white: '#fff',
  lightGray: '#fafafa',
  gray: '#999',
  darkGray: '#333',
  border: '#e0e0e0',
  lightBorder: '#ddd',
  veryLightGray: '#f0f0f0',
  bgPanel: '#f9f9f9',
  bgInput: '#f7f7f7',
};

// Category/Type Colors (Notifications)
export const TYPE_COLORS = {
  wake: '#FAEEDA',
  hydrate: '#E6F1FB',
  ready: '#EAF3DE',
  travel: '#EEEDFE',
  unplug: '#FBEAF0',
  food: '#FAECE7',
  wellness: '#E1F5EE',
  reminder: '#F1EFE8',
};

// Category/Type Border Colors
export const TYPE_BORDERS = {
  wake: '#EF9F27',
  hydrate: '#378ADD',
  ready: '#639922',
  travel: '#7F77DD',
  unplug: '#D4537E',
  food: '#D85A30',
  wellness: '#1D9E75',
  reminder: '#888780',
};

// Intensity Colors (Schedule)
export const INTENSITY_COLORS = {
  rest: '#1D9E75',
  travel: '#888780',
  moderate: '#378ADD',
  intense: '#BA7517',
  epic: '#E24B4A',
};

export const INTENSITY_LABELS = {
  rest: 'Rest',
  travel: 'Travel',
  moderate: 'Moderate',
  intense: 'Intense',
  epic: 'EPIC',
};

// Emoji Mappings
export const EMOJI_BY_TYPE = {
  wake: '⏰',
  hydrate: '💧',
  ready: '👗',
  travel: '🗺️',
  unplug: '🌿',
  food: '🍽️',
  wellness: '🧘',
  reminder: '📌',
};

export const TYPE_LABELS = {
  wake: 'Wake-up',
  hydrate: 'Hydrate',
  ready: 'Get ready',
  travel: 'Travel',
  unplug: 'Unplug',
  food: 'Food',
  wellness: 'Wellness',
  reminder: 'Reminder',
};

// Trip Metadata
export const TRIP_START_DATE = new Date('2026-05-01');
export const TRIP_DAYS_COUNT = 18;

export const DAY_NAMES = [
  '', // 0 (unused, days are 1-indexed)
  'Travel — DFW→ICN',
  'Arrival — ICN→DPS',
  'Spa morning',
  'Cliffside cocktails',
  'Temple + fire dance',
  'Resort & relax',
  'Sidemen escape',
  'Gili arrival',
  'Explore Gilis',
  'Ubud arrival',
  'Relax & recharge',
  'Volcano + day club',
  'Adventure & culture',
  'Jungle fever',
  'Seminyak shopping',
  'Beach bliss',
  'Brunch finale',
  'Departure + Seoul',
];

export const SCHEDULE_DAYS = [
  { d: 1, name: 'Travel day', loc: 'DFW → SLC → ICN', intensity: 'travel' },
  { d: 2, name: 'Arrival in Bali', loc: 'ICN → DPS', intensity: 'travel' },
  { d: 3, name: 'Spa morning', loc: 'Uluwatu', intensity: 'rest' },
  { d: 4, name: 'Cliffside cocktails', loc: 'Uluwatu', intensity: 'moderate' },
  { d: 5, name: 'Temple + fire dance', loc: 'Uluwatu', intensity: 'moderate' },
  { d: 6, name: 'Resort & relax', loc: 'Uluwatu', intensity: 'rest' },
  { d: 7, name: 'Sidemen escape', loc: 'Uluwatu → Sidemen', intensity: 'travel' },
  { d: 8, name: 'Gili arrival', loc: 'Sidemen → Gili T.', intensity: 'intense' },
  { d: 9, name: 'Explore the Gilis', loc: 'Gili Trawangan', intensity: 'moderate' },
  { d: 10, name: 'Ubud arrival', loc: 'Gilis → Ubud', intensity: 'travel' },
  { d: 11, name: 'Relax & recharge', loc: 'Ubud', intensity: 'rest' },
  { d: 12, name: 'Volcano + day club', loc: 'Ubud', intensity: 'epic' },
  { d: 13, name: 'Adventure & culture', loc: 'Ubud', intensity: 'intense' },
  { d: 14, name: 'Jungle fever', loc: 'Ubud', intensity: 'moderate' },
  { d: 15, name: 'Seminyak shopping', loc: 'Ubud → Seminyak', intensity: 'intense' },
  { d: 16, name: 'Beach bliss', loc: 'Seminyak / Canggu', intensity: 'moderate' },
  { d: 17, name: 'Brunch finale', loc: 'Seminyak → DPS', intensity: 'moderate' },
  { d: 18, name: 'Departure + Seoul', loc: 'DPS → ICN → DFW', intensity: 'travel' },
];

// Currency Configuration
export const CURRENCIES = [
  { code: 'USD', flag: '🇺🇸', name: 'US Dollar', symbol: '$' },
  { code: 'IDR', flag: '🇮🇩', name: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'AUD', flag: '🇦🇺', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'SGD', flag: '🇸🇬', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'JPY', flag: '🇯🇵', name: 'Japanese Yen', symbol: '¥' },
  { code: 'KRW', flag: '🇰🇷', name: 'Korean Won', symbol: '₩' },
  { code: 'EUR', flag: '🇪🇺', name: 'Euro', symbol: '€' },
  { code: 'GBP', flag: '🇬🇧', name: 'British Pound', symbol: '£' },
];

export const QUICK_AMOUNTS = {
  USD: [5, 20, 100, 500],
  IDR: [50000, 100000, 500000, 1000000],
  AUD: [10, 50, 100, 500],
  SGD: [10, 50, 100, 500],
  JPY: [500, 1000, 5000, 10000],
  KRW: [5000, 10000, 50000, 100000],
  EUR: [10, 50, 100, 500],
  GBP: [10, 50, 100, 500],
};

export const FALLBACK_RATES = {
  USD: 1,
  IDR: 16050,
  AUD: 1.54,
  SGD: 1.34,
  JPY: 149.5,
  KRW: 1325,
  EUR: 0.92,
  GBP: 0.79,
};

// Spending Categories
export const SPENDING_EXAMPLES = [
  { label: 'Warung meal (local)', usd: 3 },
  { label: 'Restaurant meal', usd: 12 },
  { label: 'Bintang beer', usd: 3.5 },
  { label: 'Fresh coconut water', usd: 1 },
  { label: 'Massage (60 min)', usd: 15 },
  { label: 'Grab ride (5 km)', usd: 2 },
  { label: 'Temple entry fee', usd: 2.5 },
  { label: 'Market sarong', usd: 5 },
  { label: 'Kecak fire dance entry', usd: 15 },
  { label: 'Kempinski cocktail', usd: 18 },
  { label: 'Spa treatment', usd: 45 },
  { label: 'Day club entry (Cretya)', usd: 35 },
];

// Notification Categories
export const NOTIFICATION_CATEGORIES = [
  {
    key: 'wake',
    emoji: '⏰',
    label: 'Wake-up alarms',
    desc: 'Early starts, flight departures, 3 AM Batur',
  },
  {
    key: 'hydrate',
    emoji: '💧',
    label: 'Hydration reminders',
    desc: 'Every 2–3 hrs, pre/post-activity',
  },
  {
    key: 'ready',
    emoji: '👗',
    label: 'Get ready prompts',
    desc: '30–60 min before dinners, shows, departures',
  },
  {
    key: 'travel',
    emoji: '🗺️',
    label: 'Travel ETAs',
    desc: 'Drive times, ferry boarding, gate alerts',
  },
  {
    key: 'unplug',
    emoji: '🌿',
    label: 'Unplug & rewind',
    desc: 'Sunset moments, digital detox nudges',
  },
  {
    key: 'food',
    emoji: '🍽️',
    label: 'Food & dining',
    desc: 'Reservation timing, meal reminders',
  },
  {
    key: 'wellness',
    emoji: '🧘',
    label: 'Wellness check-ins',
    desc: 'Rest prompts, yoga, energy checks, sleep',
  },
  {
    key: 'reminder',
    emoji: '📌',
    label: 'Custom reminders',
    desc: 'Your personal added alerts',
  },
];

// AsyncStorage Keys
export const STORAGE_KEYS = {
  NOTIFICATION_STATE: 'notificationState',
  NOTIFICATION_SETTINGS: 'notificationSettings',
  CUSTOM_NOTIFICATIONS: 'customNotifications',
  EXPO_PUSH_TOKEN: 'expoPushToken',
};

// UI Constants
export const NOTIFICATION_SAVE_TIMEOUT_MS = 1500;
export const SNOOZE_BUTTON_TEXT = 'Snooze 15m';

// Tab Navigation
export const TABS = [
  { name: 'Today', icon: '⏰', screen: 'TodayScreen' },
  { name: 'Schedule', icon: '📅', screen: 'ScheduleScreen' },
  { name: 'Currency', icon: '💱', screen: 'CurrencyScreen' },
  { name: 'Settings', icon: '⚙️', screen: 'SettingsScreen' },
  { name: 'Custom', icon: '✏️', screen: 'CustomScreen' },
];
