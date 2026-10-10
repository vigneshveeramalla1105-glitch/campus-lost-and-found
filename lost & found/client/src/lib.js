export const CATEGORIES = [
  'Electronics',
  'Bags',
  'Books & Notes',
  'IDs & Cards',
  'Clothing',
  'Accessories',
  'Other'
];

export const CATEGORY_EMOJI = {
  Electronics: '🎧',
  Bags: '🎒',
  'Books & Notes': '📚',
  'IDs & Cards': '🪪',
  Clothing: '🧥',
  Accessories: '🔑',
  Other: '📦'
};

export function photoForItem(item) {
  if (typeof item?.imageUrl === 'string' && item.imageUrl.startsWith('/uploads/')) return item.imageUrl;
  const title = (item?.title || '').toLowerCase();
  if (/wallet|purse/.test(title)) return '/items/wallet.jpg';
  if (/phone|iphone|mobile/.test(title)) return '/items/phone.jpg';
  if (/key|keys/.test(title)) return '/items/keys.jpg';
  return '';
}

export function emojiForItem(item) {
  const title = (item?.title || '').toLowerCase();
  if (/laptop|computer|charger/.test(title)) return '💻';
  if (/water bottle|bottle/.test(title)) return '🥤';
  if (/id card|student id/.test(title)) return '🪪';
  if (/backpack|bag/.test(title)) return '🎒';
  if (/notebook|notes|book/.test(title)) return '📘';
  if (/umbrella/.test(title)) return '☂️';
  if (/ring/.test(title)) return '💍';
  if (/phone|iphone|mobile/.test(title)) return '📱';
  if (/key|keys/.test(title)) return '🔑';
  return CATEGORY_EMOJI[item?.category] || '📦';
}

export function relativeTime(value) {
  if (!value) return 'Recently';
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? 'Yesterday' : `${days} days ago`;
}

export function formatDate(value) {
  if (!value) return 'Date not given';
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
  }).format(new Date(value));
}

export function getProfile() {
  try { return JSON.parse(localStorage.getItem('found-profile') || 'null'); } catch (_error) { return null; }
}

export function saveProfile(profile) {
  try { localStorage.setItem('found-profile', JSON.stringify(profile)); } catch (_error) { /* local profile is optional */ }
}

export function getLocalNotes() {
  try { return JSON.parse(localStorage.getItem('found-notes') || '[]'); } catch (_error) { return []; }
}

export function saveLocalNote(note) {
  try {
    const notes = getLocalNotes();
    localStorage.setItem('found-notes', JSON.stringify([note, ...notes]));
  } catch (_error) { /* local inbox is optional */ }
}

export function initials(name = 'Campus member') {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}
