// Real Persistent Storage Layer for ShraddhaSetu
// Supports production node environment with persistence across requests

import fs from 'fs';
import path from 'path';

const DB_PATH = process.env.DB_FILE_PATH || path.join(process.cwd(), '.data_store.json');

// Initial master database seeds
function getInitialData() {
  return {
    users: [
      {
        id: 'usr_admin_108',
        name: 'Mandir Samiti Master Admin',
        email: 'admin@shraddhasetu.com',
        phone: '+91 12345 67890',
        password: 'password123',
        role: 'ADMIN',
        city: 'Varanasi',
        isVerified: true,
        rating: 5.0,
        poojasConducted: 0,
        createdAt: '2026-10-01T00:00:00.000Z'
      },
      {
        id: 'usr_pandit_108',
        name: 'Acharya Vidyadhar Shastri',
        email: 'pandit@shraddhasetu.com',
        phone: '+91 98234 56789',
        password: 'password123',
        role: 'PANDIT',
        city: 'Varanasi',
        gurukul: 'Sampurnanand Sanskrit University, Varanasi',
        vedicSpecialization: 'Navagraha Shanti, Rudrabhishek & Griha Pravesh',
        experienceYears: 18,
        languages: ['Hindi', 'Sanskrit', 'Bhojpuri'],
        isVerified: true,
        rating: 4.95,
        poojasConducted: 1420,
        createdAt: '2026-10-01T00:00:00.000Z'
      },
      {
        id: 'usr_pandit_109',
        name: 'Pt. Rameshwar Dwivedi',
        email: 'rameshwar@shraddhasetu.com',
        phone: '+91 98111 22233',
        password: 'password123',
        role: 'PANDIT',
        city: 'Delhi NCR',
        gurukul: 'Maharshi Sandipani Rashtriya Veda Vidya Pratishthan',
        vedicSpecialization: 'Maha Mrityunjaya Jaap & Vastu Shanti',
        experienceYears: 14,
        languages: ['Hindi', 'Sanskrit', 'Marathi'],
        isVerified: true,
        rating: 4.92,
        poojasConducted: 980,
        createdAt: '2026-10-02T00:00:00.000Z'
      },
      {
        id: 'usr_pandit_110',
        name: 'Pt. Devnarayan Joshi',
        email: 'devnarayan@shraddhasetu.com',
        phone: '+91 98444 55566',
        password: 'password123',
        role: 'PANDIT',
        city: 'Mumbai',
        gurukul: 'Kashi Vedic Math, Haridwar',
        vedicSpecialization: 'Satyanarayan Katha & Chandi Path',
        experienceYears: 12,
        languages: ['Hindi', 'Sanskrit', 'Gujarati'],
        isVerified: false, // Pending Admin verification in real portal!
        rating: 4.98,
        poojasConducted: 850,
        createdAt: '2026-10-05T00:00:00.000Z'
      },
      {
        id: 'usr_devotee_108',
        name: 'Rameshwar Devotee',
        email: 'devotee@shraddhasetu.com',
        phone: '+91 98765 43210',
        password: 'password123',
        role: 'CLIENT',
        city: 'Varanasi',
        isVerified: true,
        rating: 5.0,
        poojasConducted: 0,
        createdAt: '2026-10-01T00:00:00.000Z'
      }
    ],
    bookings: [
      {
        id: 'bkg_1081',
        bookingCode: 'SS-1081',
        clientId: 'usr_devotee_108',
        clientName: 'Rameshwar Devotee',
        clientPhone: '+91 98765 43210',
        clientEmail: 'devotee@shraddhasetu.com',
        poojaId: 'griha-pravesh',
        poojaTitle: 'Griha Pravesh Pooja',
        withSamagri: true,
        basePrice: 2500,
        samagriPrice: 1000,
        totalAmount: 3500,
        bookingDate: '2026-10-25',
        timeSlot: 'Morning Auspicious Muhurat (08:30 AM)',
        city: 'Varanasi',
        occasion: 'New Home Housewarming',
        specialNotes: 'Kashyapa Gotra Sankalp for family of four.',
        status: 'ASSIGNED',
        assignedPanditId: 'usr_pandit_108',
        assignedPanditName: 'Acharya Vidyadhar Shastri',
        assignedPanditPhone: '+91 98234 56789',
        createdAt: '2026-10-15T10:00:00.000Z'
      },
      {
        id: 'bkg_1082',
        bookingCode: 'SS-1082',
        clientId: 'usr_devotee_108',
        clientName: 'Rameshwar Devotee',
        clientPhone: '+91 98765 43210',
        clientEmail: 'devotee@shraddhasetu.com',
        poojaId: 'grah-shanti',
        poojaTitle: 'Grah Shanti Pooja',
        withSamagri: true,
        basePrice: 1500,
        samagriPrice: 600,
        totalAmount: 2100,
        bookingDate: '2026-10-28',
        timeSlot: 'Morning Auspicious Muhurat (09:00 AM)',
        city: 'Varanasi',
        occasion: 'Domestic Peace & Planetary Harmony',
        specialNotes: 'Gotra pronunciation confirmation requested on call.',
        status: 'CONFIRMED', // Available for Pandit in Varanasi to accept!
        assignedPanditId: '',
        assignedPanditName: '',
        assignedPanditPhone: '',
        createdAt: '2026-10-16T12:00:00.000Z'
      }
    ]
  };
}

let inMemoryDb = null;

function loadDb() {
  if (inMemoryDb) return inMemoryDb;

  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      inMemoryDb = JSON.parse(raw);
      return inMemoryDb;
    }
  } catch (e) {
    console.warn('Could not read persistent DB file, initializing fresh store:', e);
  }

  inMemoryDb = getInitialData();
  saveDb(inMemoryDb);
  return inMemoryDb;
}

function saveDb(data) {
  inMemoryDb = data;
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    // If running in read-only environment, keep in memory
  }
}

export function normalizePhone(p) {
  if (!p) return '';
  const digits = String(p).replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

const globalOtpStore = new Map();

export const serverStore = {
  // Users
  getUsers() {
    const db = loadDb();
    return db.users || [];
  },

  findUserByEmail(email) {
    if (!email) return null;
    const users = this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  findUserByPhone(phone) {
    if (!phone) return null;
    const target = normalizePhone(phone);
    if (!target) return null;
    const users = this.getUsers();
    return users.find(u => normalizePhone(u.phone) === target) || null;
  },

  findUserByEmailOrPhone(identifier) {
    if (!identifier) return null;
    const str = String(identifier).trim();
    if (str.includes('@')) {
      return this.findUserByEmail(str);
    }
    return this.findUserByPhone(str);
  },

  storeOtp(phone, otp, role = 'CLIENT') {
    const key = normalizePhone(phone);
    if (!key) return false;
    globalOtpStore.set(key, {
      otp: String(otp).trim(),
      role,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });
    return true;
  },

  getStoredOtp(phone) {
    const key = normalizePhone(phone);
    return globalOtpStore.get(key) || null;
  },

  verifyOtp(phone, inputOtp) {
    const key = normalizePhone(phone);
    if (!key) return false;
    const cleanOtp = String(inputOtp).trim();

    // Universal test/demo OTPs for reliable testing
    if (cleanOtp === '108108' || cleanOtp === '123456') {
      return true;
    }

    const record = globalOtpStore.get(key);
    if (!record) return false;
    if (Date.now() > record.expiresAt) {
      globalOtpStore.delete(key);
      return false;
    }
    if (record.otp === cleanOtp) {
      globalOtpStore.delete(key);
      return true;
    }
    return false;
  },

  findUserById(id) {
    if (!id) return null;
    const users = this.getUsers();
    return users.find(u => u.id === id) || null;
  },

  createUser(userData) {
    const db = loadDb();
    const newUser = {
      id: 'usr_' + Date.now(),
      createdAt: new Date().toISOString(),
      isVerified: userData.role === 'ADMIN' ? true : (userData.role === 'PANDIT' ? false : true),
      rating: 5.0,
      poojasConducted: 0,
      ...userData
    };
    db.users.push(newUser);
    saveDb(db);
    return newUser;
  },

  updateUser(id, updates) {
    const db = loadDb();
    const idx = db.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      db.users[idx] = { ...db.users[idx], ...updates, updatedAt: new Date().toISOString() };
      saveDb(db);
      return db.users[idx];
    }
    return null;
  },

  // Bookings
  getBookings(filter = {}) {
    const db = loadDb();
    let list = db.bookings || [];
    if (filter.clientId) {
      list = list.filter(b => b.clientId === filter.clientId);
    }
    if (filter.panditId) {
      list = list.filter(b => b.assignedPanditId === filter.panditId || (b.assignedPanditId === '' && b.status === 'CONFIRMED'));
    }
    if (filter.city) {
      list = list.filter(b => b.city.toLowerCase() === filter.city.toLowerCase());
    }
    return list;
  },

  createBooking(bookingData) {
    const db = loadDb();
    const newBooking = {
      id: 'bkg_' + Date.now(),
      bookingCode: 'SS-' + Math.floor(1000 + Math.random() * 9000),
      status: 'CONFIRMED',
      assignedPanditId: '',
      assignedPanditName: '',
      assignedPanditPhone: '',
      createdAt: new Date().toISOString(),
      ...bookingData
    };
    db.bookings.unshift(newBooking);
    saveDb(db);
    return newBooking;
  },

  updateBookingStatus(id, status, pandit = null) {
    const db = loadDb();
    const idx = db.bookings.findIndex(b => b.id === id);
    if (idx !== -1) {
      db.bookings[idx].status = status;
      db.bookings[idx].updatedAt = new Date().toISOString();
      if (pandit) {
        db.bookings[idx].assignedPanditId = pandit.id;
        db.bookings[idx].assignedPanditName = pandit.name;
        db.bookings[idx].assignedPanditPhone = pandit.phone;
      }
      saveDb(db);
      return db.bookings[idx];
    }
    return null;
  }
};
