const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const IMAGE_EXTENSIONS = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/avif': '.avif',
  'image/heic': '.heic',
  'image/heif': '.heif'
};
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, UPLOAD_DIR),
    filename: (_req, file, callback) => callback(null, `${crypto.randomUUID()}${IMAGE_EXTENSIONS[file.mimetype] || '.jpg'}`)
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!IMAGE_EXTENSIONS[file.mimetype]) return callback(new Error('Use a JPG, PNG, WebP, AVIF, or HEIC image.'));
    return callback(null, true);
  }
});
const DATA_DIR = path.join(__dirname, 'data');
const ITEMS_FILE = path.join(DATA_DIR, 'items.json');
const CLAIMS_FILE = path.join(DATA_DIR, 'claims.json');
const VALID_TYPES = new Set(['lost', 'found']);
const VALID_STATUSES = new Set(['active', 'resolved']);
const CATEGORIES = [
  'Electronics',
  'Bags',
  'Books & Notes',
  'IDs & Cards',
  'Clothing',
  'Accessories',
  'Other'
];

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(UPLOAD_DIR, { dotfiles: 'deny', index: false, maxAge: '7d' }));
app.use('/uploads', (_req, res) => res.status(404).json({ error: 'Image not found.' }));

function removeUploadedFile(file) {
  if (file && file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
}

function removeItemImage(imageUrl) {
  if (typeof imageUrl !== 'string' || !imageUrl.startsWith('/uploads/')) return;
  const filePath = path.resolve(UPLOAD_DIR, path.basename(imageUrl));
  if (filePath.startsWith(`${UPLOAD_DIR}${path.sep}`) && fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

function hoursAgo(hours) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

function seedItems() {
  return [
    {
      id: 'itm-wallet', type: 'found', title: 'Black leather wallet', category: 'Accessories',
      location: 'Main Library · reading room', dateOccurred: hoursAgo(1),
      description: 'A slim black bifold wallet found near the west entrance. It is safe with the library desk.',
      posterName: 'Aarav M.', contactEmail: 'aarav@example.edu', createdAt: hoursAgo(0.25), status: 'active'
    },
    {
      id: 'itm-phone', type: 'found', title: 'Blush pink smartphone', category: 'Electronics',
      location: 'Student Centre · window seats', dateOccurred: hoursAgo(2),
      description: 'Pink phone in a clear case. Found charging beside the window seats; describe the lock screen to identify it.',
      posterName: 'Diya K.', contactEmail: 'diya@example.edu', createdAt: hoursAgo(2), status: 'active'
    },
    {
      id: 'itm-keys', type: 'lost', title: 'Silver keys with teal fob', category: 'Accessories',
      location: 'Engineering Block · Lab 2', dateOccurred: hoursAgo(4),
      description: 'Two silver keys on a small dark teal fabric key fob. Last seen after the afternoon lab.',
      posterName: 'Rishi P.', contactEmail: 'rishi@example.edu', createdAt: hoursAgo(3), status: 'active'
    },
    {
      id: 'itm-laptop', type: 'found', title: 'Laptop sleeve · charcoal', category: 'Electronics',
      location: 'Innovation Lab · desk 14', dateOccurred: hoursAgo(8),
      description: 'Charcoal sleeve with a 14-inch laptop inside. Handed to the Innovation Lab front desk.',
      posterName: 'Neha S.', contactEmail: 'neha@example.edu', createdAt: hoursAgo(7), status: 'active'
    },
    {
      id: 'itm-bottle', type: 'lost', title: 'Sage green water bottle', category: 'Other',
      location: 'Student Centre · ground floor', dateOccurred: hoursAgo(20),
      description: 'Matte green 750 ml bottle with a small mountain sticker on the side.',
      posterName: 'Rohan K.', contactEmail: 'rohan@example.edu', createdAt: hoursAgo(12), status: 'active'
    },
    {
      id: 'itm-idcard', type: 'found', title: 'Campus ID card', category: 'IDs & Cards',
      location: 'Cafeteria · near the coffee counter', dateOccurred: hoursAgo(16),
      description: 'Found a student ID card on the floor by the coffee counter. Initials look like S. M.',
      posterName: 'Meera S.', contactEmail: 'meera@example.edu', createdAt: hoursAgo(19), status: 'active'
    },
    {
      id: 'itm-backpack', type: 'lost', title: 'Olive canvas backpack', category: 'Bags',
      location: 'North Gate bus stop', dateOccurred: hoursAgo(29),
      description: 'Olive-green canvas backpack with a tan leather patch and a blue keychain.',
      posterName: 'Kavya N.', contactEmail: 'kavya@example.edu', createdAt: hoursAgo(26), status: 'active'
    },
    {
      id: 'itm-notes', type: 'lost', title: 'Blue calculus notebook', category: 'Books & Notes',
      location: 'Lecture Hall B · room 104', dateOccurred: hoursAgo(51),
      description: 'A5 spiral notebook with handwritten calculus notes and a yellow sticky note on the cover.',
      posterName: 'Nikhil D.', contactEmail: 'nikhil@example.edu', createdAt: hoursAgo(32), status: 'active'
    }
  ];
}

function readJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, JSON.stringify(fallback, null, 2));
      return fallback;
    }
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    console.error(`Could not read ${path.basename(file)}; using an empty/default store.`, error.message);
    return fallback;
  }
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporaryFile = `${file}.tmp`;
  fs.writeFileSync(temporaryFile, JSON.stringify(value, null, 2));
  fs.renameSync(temporaryFile, file);
}

let items = readJson(ITEMS_FILE, seedItems());
let claims = readJson(CLAIMS_FILE, []);

function publicItem(item) {
  const { contactEmail, ...safeItem } = item;
  return safeItem;
}

function cleanText(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

function validateItem(body, partial = false) {
  const errors = [];
  const result = {};
  const fields = ['type', 'title', 'category', 'location', 'dateOccurred', 'description', 'posterName', 'contactEmail'];

  for (const field of fields) {
    if (partial && body[field] === undefined) continue;
    const value = body[field];
    if (field === 'type') {
      if (!VALID_TYPES.has(value)) errors.push('Choose either lost or found.');
      else result.type = value;
    } else if (field === 'category') {
      if (!CATEGORIES.includes(value)) errors.push('Choose a valid category.');
      else result.category = value;
    } else if (field === 'contactEmail') {
      const email = cleanText(value, 180);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Enter a valid campus email address.');
      else result.contactEmail = email;
    } else {
      const limits = { title: 90, location: 120, dateOccurred: 40, description: 700, posterName: 70 };
      const text = cleanText(value, limits[field]);
      if (!text && ['title', 'location', 'dateOccurred', 'description', 'posterName'].includes(field)) {
        errors.push(`${field === 'dateOccurred' ? 'When it happened' : field[0].toUpperCase() + field.slice(1)} is required.`);
      } else {
        result[field] = text;
      }
    }
  }

  if (body.status !== undefined) {
    if (!VALID_STATUSES.has(body.status)) errors.push('Status must be active or resolved.');
    else result.status = body.status;
  }
  return { result, errors };
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'campus-lost-and-found-api' });
});

app.get('/api/categories', (_req, res) => {
  res.json({ categories: CATEGORIES });
});

app.get('/api/stats', (_req, res) => {
  const active = items.filter((item) => item.status === 'active');
  res.json({
    active: active.length,
    lost: active.filter((item) => item.type === 'lost').length,
    found: active.filter((item) => item.type === 'found').length,
    reunited: items.filter((item) => item.status === 'resolved').length
  });
});

app.get('/api/items', (req, res) => {
  const query = cleanText(String(req.query.q || ''), 120).toLowerCase();
  const type = String(req.query.type || 'all').toLowerCase();
  const category = String(req.query.category || 'all');
  const status = String(req.query.status || 'active').toLowerCase();
  const sort = String(req.query.sort || 'newest').toLowerCase();

  let filtered = items.filter((item) => {
    if (status !== 'all' && item.status !== status) return false;
    if (type !== 'all' && item.type !== type) return false;
    if (category !== 'all' && item.category !== category) return false;
    if (query) {
      const haystack = [item.title, item.category, item.location, item.description, item.posterName]
        .join(' ').toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });

  filtered = filtered.sort((a, b) => {
    const difference = new Date(b.createdAt) - new Date(a.createdAt);
    return sort === 'oldest' ? -difference : difference;
  });

  res.json({ items: filtered.map(publicItem), total: filtered.length });
});

app.get('/api/items/:id', (req, res) => {
  const item = items.find((entry) => entry.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'That item could not be found.' });
  return res.json({ item: publicItem(item) });
});

app.post('/api/items', upload.single('photo'), (req, res) => {
  const { result, errors } = validateItem(req.body || {});
  if (errors.length) {
    removeUploadedFile(req.file);
    return res.status(400).json({ error: errors[0], errors });
  }

  const item = {
    id: `itm-${crypto.randomUUID()}`,
    ...result,
    ...(req.file ? { imageUrl: `/uploads/${req.file.filename}` } : {}),
    status: 'active',
    createdAt: new Date().toISOString()
  };
  items.unshift(item);
  writeJson(ITEMS_FILE, items);
  return res.status(201).json({ item: publicItem(item), message: 'Your post is live.' });
});

app.patch('/api/items/:id', (req, res) => {
  const index = items.findIndex((entry) => entry.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'That item could not be found.' });
  const { result, errors } = validateItem(req.body || {}, true);
  if (errors.length) return res.status(400).json({ error: errors[0], errors });
  items[index] = { ...items[index], ...result, updatedAt: new Date().toISOString() };
  writeJson(ITEMS_FILE, items);
  return res.json({ item: publicItem(items[index]) });
});

app.patch('/api/items/:id/status', (req, res) => {
  const item = items.find((entry) => entry.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'That item could not be found.' });
  const status = req.body && req.body.status;
  if (!VALID_STATUSES.has(status)) return res.status(400).json({ error: 'Status must be active or resolved.' });
  item.status = status;
  item.updatedAt = new Date().toISOString();
  writeJson(ITEMS_FILE, items);
  return res.json({ item: publicItem(item) });
});

app.delete('/api/items/:id', (req, res) => {
  const index = items.findIndex((entry) => entry.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'That item could not be found.' });
  const [removedItem] = items.splice(index, 1);
  removeItemImage(removedItem.imageUrl);
  writeJson(ITEMS_FILE, items);
  return res.status(204).end();
});

app.post('/api/items/:id/claims', (req, res) => {
  const item = items.find((entry) => entry.id === req.params.id && entry.status === 'active');
  if (!item) return res.status(404).json({ error: 'This post is no longer active.' });

  const name = cleanText(req.body && req.body.name, 70);
  const email = cleanText(req.body && req.body.email, 180);
  const message = cleanText(req.body && req.body.message, 500);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message) {
    return res.status(400).json({ error: 'Add your name, a valid email, and a short message.' });
  }

  const claim = {
    id: `clm-${crypto.randomUUID()}`,
    itemId: item.id,
    name,
    email,
    message,
    createdAt: new Date().toISOString()
  };
  claims.push(claim);
  writeJson(CLAIMS_FILE, claims);
  return res.status(201).json({ message: 'Your note has been recorded.', receiptId: claim.id });
});

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    const tooLarge = error.code === 'LIMIT_FILE_SIZE';
    return res.status(tooLarge ? 413 : 400).json({ error: tooLarge ? 'Image must be 5 MB or smaller.' : 'Only one image can be uploaded.' });
  }
  if (error.message && error.message.startsWith('Use a JPG')) return res.status(400).json({ error: error.message });
  console.error(error);
  return res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

// Serve the built React app when running the production build.
const builtClient = path.resolve(__dirname, '../dist');
if (fs.existsSync(builtClient)) {
  app.use(express.static(builtClient));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    return res.sendFile(path.join(builtClient, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Campus lost & found API listening on http://0.0.0.0:${PORT}`);
});
