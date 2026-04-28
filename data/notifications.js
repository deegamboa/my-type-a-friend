/**
 * Notification Data for MTAF (My Type-A Friend)
 * Pre-planned alerts for the 18-day Bali honeymoon
 * 
 * Structure: notificationData[day] = [ { t: time, h: heading, m: message, ty: type }, ... ]
 */

export const notificationData = {
  1: [
    { t: '6:00 AM', h: 'Wake up!', m: 'Early start to DFW airport', ty: 'wake' },
    { t: '6:30 AM', h: 'Hydrate', m: 'Drink water before travel', ty: 'hydrate' },
    { t: '8:00 AM', h: 'Boarding', m: 'Flight DFW → SLC departs', ty: 'travel' },
    { t: '2:00 PM', h: 'Hydrate', m: 'Stay hydrated on flight', ty: 'hydrate' },
    { t: '5:00 PM', h: 'Connection', m: 'Arrive SLC, prepare for connection', ty: 'travel' },
  ],
  2: [
    { t: '8:30 PM', h: 'International flight', m: 'SLC → Incheon (ICN) departs', ty: 'travel' },
    { t: '10:00 PM', h: 'Get comfortable', m: 'Settle in for overnight flight', ty: 'ready' },
    { t: '2:00 AM', h: 'Hydrate', m: 'Drink water, stay hydrated', ty: 'hydrate' },
  ],
  3: [
    { t: '6:30 AM', h: 'Landing', m: 'Arrive Incheon (ICN)', ty: 'travel' },
    { t: '9:00 AM', h: 'Connection', m: 'ICN → Bali (DPS), 4 hour flight', ty: 'travel' },
    { t: '3:30 PM', h: 'Arrival!', m: 'Arrive in Bali, clear customs', ty: 'travel' },
    { t: '5:00 PM', h: 'Settle in', m: 'Check into Uluwatu villa', ty: 'ready' },
  ],
  4: [
    { t: '9:00 AM', h: 'Spa morning', m: 'Couples spa treatment begins', ty: 'wellness' },
    { t: '12:00 PM', h: 'Hydrate', m: 'Drink plenty of water', ty: 'hydrate' },
    { t: '1:00 PM', h: 'Lunch', m: 'Light meal after spa', ty: 'food' },
    { t: '4:00 PM', h: 'Rest', m: 'Relax and unwind', ty: 'unplug' },
  ],
  5: [
    { t: '6:00 PM', h: 'Get ready', m: 'Dinner at Sunken Bar', ty: 'ready' },
    { t: '6:30 PM', h: 'Sunset', m: 'Cliffside cocktails', ty: 'food' },
    { t: '8:00 PM', h: 'Dinner', m: 'Dinner reservation', ty: 'food' },
    { t: '11:00 PM', h: 'Unwind', m: 'Return to villa, relax', ty: 'unplug' },
  ],
  6: [
    { t: '8:00 AM', h: 'Wake up', m: 'Breakfast at villa', ty: 'wake' },
    { t: '10:00 AM', h: 'Temple visit', m: 'Tanah Lot temple entrance fee', ty: 'reminder' },
    { t: '4:00 PM', h: 'Get ready', m: 'Prepare for Kecak fire dance', ty: 'ready' },
    { t: '6:00 PM', h: 'Kecak show', m: 'Fire dance performance', ty: 'food' },
    { t: '9:00 PM', h: 'Dinner', m: 'Dinner after show', ty: 'food' },
  ],
  7: [
    { t: '8:00 AM', h: 'Breakfast', m: 'Morning meal at villa', ty: 'food' },
    { t: '9:00 AM', h: 'Leisure', m: 'Relax at resort', ty: 'unplug' },
    { t: '12:00 PM', h: 'Lunch', m: 'Lunch at villa pool', ty: 'food' },
    { t: '3:00 PM', h: 'Hydrate', m: 'Drink water, stay cool', ty: 'hydrate' },
  ],
  8: [
    { t: '7:00 AM', h: 'Wake up', m: 'Pack for Sidemen', ty: 'wake' },
    { t: '9:00 AM', h: 'Travel', m: 'Depart Uluwatu for Sidemen (2 hours)', ty: 'travel' },
    { t: '12:00 PM', h: 'Arrival', m: 'Arrive Sidemen, check in', ty: 'travel' },
    { t: '1:00 PM', h: 'Lunch', m: 'Meal at accommodation', ty: 'food' },
  ],
  9: [
    { t: '7:00 AM', h: 'Wake up', m: 'Early start for Gili Islands', ty: 'wake' },
    { t: '8:00 AM', h: 'Travel', m: 'Sidemen to Gili Trawangan (ferry)', ty: 'travel' },
    { t: '12:00 PM', h: 'Arrival', m: 'Arrive Gili Islands', ty: 'travel' },
    { t: '1:00 PM', h: 'Lunch', m: 'Island lunch', ty: 'food' },
    { t: '3:00 PM', h: 'Explore', m: 'Snorkel or beach walk', ty: 'wellness' },
  ],
  10: [
    { t: '7:00 AM', h: 'Wake up', m: 'Gili island day', ty: 'wake' },
    { t: '9:00 AM', h: 'Activity', m: 'Snorkeling or water sports', ty: 'wellness' },
    { t: '12:00 PM', h: 'Lunch', m: 'Beach lunch', ty: 'food' },
    { t: '3:00 PM', h: 'Rest', m: 'Afternoon relaxation', ty: 'unplug' },
    { t: '6:00 PM', h: 'Dinner', m: 'Sunset dinner on beach', ty: 'food' },
  ],
  11: [
    { t: '8:00 AM', h: 'Travel day', m: 'Gilis to Ubud (ferry + drive)', ty: 'travel' },
    { t: '12:00 PM', h: 'Arrival', m: 'Arrive Ubud, check in', ty: 'travel' },
    { t: '1:00 PM', h: 'Lunch', m: 'Welcome meal', ty: 'food' },
    { t: '3:00 PM', h: 'Rest', m: 'Relax after travel', ty: 'unplug' },
  ],
  12: [
    { t: '3:30 AM', h: 'Wake up!', m: 'Mount Batur volcano trek', ty: 'wake' },
    { t: '4:00 AM', h: 'Depart', m: 'Leave for volcano trek', ty: 'travel' },
    { t: '7:00 AM', h: 'Summit', m: 'Reach Batur summit for sunrise', ty: 'wellness' },
    { t: '9:00 AM', h: 'Breakfast', m: 'Breakfast at summit', ty: 'food' },
    { t: '2:00 PM', h: 'Day club', m: 'Return to Ubud, rest', ty: 'unplug' },
    { t: '5:00 PM', h: 'Get ready', m: 'Prepare for day club', ty: 'ready' },
    { t: '7:00 PM', h: 'Day club', m: 'Evening at Cretya day club', ty: 'food' },
  ],
  13: [
    { t: '8:00 AM', h: 'Breakfast', m: 'Morning meal', ty: 'food' },
    { t: '9:00 AM', h: 'Adventure', m: 'Ubud adventure activities', ty: 'wellness' },
    { t: '12:00 PM', h: 'Lunch', m: 'Local restaurant', ty: 'food' },
    { t: '2:00 PM', h: 'Culture', m: 'Visit Ubud cultural sites', ty: 'reminder' },
    { t: '6:00 PM', h: 'Dinner', m: 'Dinner reservation', ty: 'food' },
  ],
  14: [
    { t: '7:00 AM', h: 'Wake up', m: 'Ubud jungle adventure', ty: 'wake' },
    { t: '8:00 AM', h: 'Activity', m: 'Jungle trek or monkey forest', ty: 'wellness' },
    { t: '12:00 PM', h: 'Lunch', m: 'Lunch in Ubud', ty: 'food' },
    { t: '3:00 PM', h: 'Relax', m: 'Afternoon rest', ty: 'unplug' },
  ],
  15: [
    { t: '8:00 AM', h: 'Travel', m: 'Ubud to Seminyak (2.5 hours)', ty: 'travel' },
    { t: '11:00 AM', h: 'Arrival', m: 'Arrive Seminyak, check in', ty: 'travel' },
    { t: '1:00 PM', h: 'Lunch', m: 'Welcome lunch', ty: 'food' },
    { t: '3:00 PM', h: 'Shopping', m: 'Seminyak shopping', ty: 'reminder' },
    { t: '6:00 PM', h: 'Dinner', m: 'Beachfront dinner', ty: 'food' },
  ],
  16: [
    { t: '8:00 AM', h: 'Breakfast', m: 'Morning meal', ty: 'food' },
    { t: '9:00 AM', h: 'Beach', m: 'Beach day or water activities', ty: 'wellness' },
    { t: '12:00 PM', h: 'Lunch', m: 'Beachclub lunch', ty: 'food' },
    { t: '3:00 PM', h: 'Hydrate', m: 'Stay hydrated in sun', ty: 'hydrate' },
    { t: '6:00 PM', h: 'Unwind', m: 'Sunset time', ty: 'unplug' },
  ],
  17: [
    { t: '9:00 AM', h: 'Breakfast', m: 'Final Bali breakfast', ty: 'food' },
    { t: '11:00 AM', h: 'Brunch', m: 'Special brunch celebration', ty: 'food' },
    { t: '2:00 PM', h: 'Pack', m: 'Pack for departure', ty: 'ready' },
    { t: '4:00 PM', h: 'Depart', m: 'Leave for airport (DPS)', ty: 'travel' },
    { t: '8:00 PM', h: 'Flight', m: 'DPS to Incheon (ICN)', ty: 'travel' },
  ],
  18: [
    { t: '7:00 AM', h: 'Land in Korea', m: 'Arrive Incheon', ty: 'travel' },
    { t: '10:00 AM', h: 'Connection', m: 'ICN to DFW final flight', ty: 'travel' },
    { t: '8:00 PM', h: 'Home!', m: 'Arrive Dallas, end of trip', ty: 'travel' },
  ],
};
