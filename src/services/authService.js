import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const USERS_STORAGE_KEY = 'elevencrowd_users';
const SESSION_STORAGE_KEY = 'elevencrowd_admin_session';
const AUTH_EVENT_NAME = 'elevencrowd:auth_changed';
const DEFAULT_SALT = 'ec_salt_2024_auth';

/**
 * Hash password securely using Web Crypto API SHA-256
 */
export async function hashPassword(password, salt = DEFAULT_SALT) {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${password}:${salt}`);
  
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback hash implementation if Web Crypto is unavailable in environment
  let hash1 = 5381;
  let hash2 = 52711;
  for (let i = 0; i < data.length; i++) {
    const char = data[i];
    hash1 = ((hash1 << 5) + hash1) ^ char;
    hash2 = ((hash2 << 5) + hash2) ^ char;
  }
  const part1 = (Math.abs(hash1) >>> 0).toString(16).padStart(32, '0');
  const part2 = (Math.abs(hash2) >>> 0).toString(16).padStart(32, '0');
  return part1 + part2;
}

/**
 * Notify auth state listeners
 */
function notifyAuthChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(AUTH_EVENT_NAME));
  }
}

export const authService = {
  EVENT_NAME: AUTH_EVENT_NAME,

  /**
   * Initialize user storage with default admin account if not already present.
   * Password 'admin123' is NEVER stored in plaintext - only as a SHA-256 hash.
   */
  init: async () => {
    try {
      const existing = localStorage.getItem(USERS_STORAGE_KEY);
      if (!existing || JSON.parse(existing).length === 0) {
        const defaultHash = await hashPassword('admin123', DEFAULT_SALT);
        const defaultAdmin = {
          id: 'usr-admin-01',
          username: 'admin',
          email: 'admin@elevencrowd.co',
          passwordHash: defaultHash,
          salt: DEFAULT_SALT,
          role: 'admin',
          name: 'Admin ElevenCrowd',
          createdAt: new Date().toISOString()
        };
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([defaultAdmin]));
      }
    } catch (e) {
      console.error('[authService] Error initializing users:', e);
    }
  },

  /**
   * Get list of users from storage
   */
  getUsers: () => {
    try {
      const raw = localStorage.getItem(USERS_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('[authService] Error reading users:', e);
    }
    return [];
  },

  /**
   * Login with email or username and password
   */
  login: async (identifier, password) => {
    const cleanIdentifier = (identifier || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanIdentifier) {
      const err = new Error('Email atau username wajib diisi.');
      err.field = 'identifier';
      throw err;
    }

    if (!cleanPassword) {
      const err = new Error('Password wajib diisi.');
      err.field = 'password';
      throw err;
    }

    if (cleanIdentifier.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanIdentifier)) {
        const err = new Error('Format email tidak valid.');
        err.field = 'identifier';
        throw err;
      }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('admins')
          .select('*')
          .or(`email.eq.${cleanIdentifier},username.eq.${cleanIdentifier}`)
          .limit(1);

        if (!error && Array.isArray(data) && data.length > 0) {
          const matchedUser = data[0];
          const hashedInput = await hashPassword(cleanPassword, matchedUser.salt || DEFAULT_SALT);

          if (hashedInput !== matchedUser.password_hash) {
            throw new Error('Email/Username atau password salah.');
          }

          if (matchedUser.role !== 'admin') {
            throw new Error('Akses ditolak. Anda tidak memiliki izin Administrator.');
          }

          const session = {
            token: `ec-adm-tok-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
            user: {
              id: matchedUser.id,
              username: matchedUser.username,
              email: matchedUser.email,
              name: matchedUser.name || matchedUser.username,
              role: matchedUser.role
            },
            expiresAt: Date.now() + 24 * 60 * 60 * 1000
          };

          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
          notifyAuthChange();
          return session;
        }
      } catch (e) {
        console.warn('[authService] Supabase login failed, fallback to local auth:', e);
      }
    }

    // Ensure initialized
    await authService.init();

    const users = authService.getUsers();
    const matchedUser = users.find(
      (u) =>
        u.email.toLowerCase() === cleanIdentifier ||
        u.username.toLowerCase() === cleanIdentifier
    );

    if (!matchedUser) {
      throw new Error('Email/Username atau password salah.');
    }

    const hashedInput = await hashPassword(cleanPassword, matchedUser.salt || DEFAULT_SALT);
    if (hashedInput !== matchedUser.passwordHash) {
      throw new Error('Email/Username atau password salah.');
    }

    if (matchedUser.role !== 'admin') {
      throw new Error('Akses ditolak. Anda tidak memiliki izin Administrator.');
    }

    const session = {
      token: `ec-adm-tok-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
      user: {
        id: matchedUser.id,
        username: matchedUser.username,
        email: matchedUser.email,
        name: matchedUser.name,
        role: matchedUser.role
      },
      expiresAt: Date.now() + 24 * 60 * 60 * 1000
    };

    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      notifyAuthChange();
    } catch (e) {
      console.error('[authService] Error saving session:', e);
      throw new Error('Gagal menyimpan sesi login ke browser.');
    }

    return session;
  },

  /**
   * Get active session
   */
  getSession: () => {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        const session = JSON.parse(raw);
        if (session && session.expiresAt && Date.now() > session.expiresAt) {
          // Session expired
          authService.logout();
          return null;
        }
        return session;
      }
    } catch (e) {
      console.error('[authService] Error reading session:', e);
    }
    return null;
  },

  /**
   * Check if authenticated
   */
  isAuthenticated: () => {
    return Boolean(authService.getSession());
  },

  /**
   * Check if user is authenticated and has role 'admin'
   */
  isAdmin: () => {
    const session = authService.getSession();
    return Boolean(session && session.user && session.user.role === 'admin');
  },

  /**
   * Get current logged-in user details
   */
  getCurrentUser: () => {
    const session = authService.getSession();
    return session ? session.user : null;
  },

  updateCredentials: async ({ currentPassword, username, newPassword }) => {
    const session = authService.getSession();
    if (!session || session.user.role !== 'admin') {
      throw new Error('Sesi admin tidak ditemukan atau sudah berakhir.');
    }

    const cleanUsername = (username || '').trim();
    const cleanCurrentPassword = (currentPassword || '').trim();
    const cleanNewPassword = (newPassword || '').trim();

    if (cleanUsername.length < 3) {
      throw new Error('Username minimal 3 karakter.');
    }
    if (!cleanCurrentPassword) {
      throw new Error('Password saat ini wajib diisi.');
    }
    if (cleanNewPassword && cleanNewPassword.length < 6) {
      throw new Error('Password baru minimal 6 karakter.');
    }

    const users = authService.getUsers();
    const userIndex = users.findIndex((user) => user.id === session.user.id);
    if (userIndex === -1) {
      throw new Error('Data akun admin tidak ditemukan.');
    }

    const currentUser = users[userIndex];
    const currentHash = await hashPassword(cleanCurrentPassword, currentUser.salt || DEFAULT_SALT);
    if (currentHash !== currentUser.passwordHash) {
      throw new Error('Password saat ini salah.');
    }

    const duplicateUsername = users.some(
      (user, index) => index !== userIndex && user.username.toLowerCase() === cleanUsername.toLowerCase()
    );
    if (duplicateUsername) {
      throw new Error('Username tersebut sudah digunakan.');
    }

    const updatedUser = { ...currentUser, username: cleanUsername };
    if (cleanNewPassword) {
      updatedUser.passwordHash = await hashPassword(cleanNewPassword, currentUser.salt || DEFAULT_SALT);
    }
    users[userIndex] = updatedUser;
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    const updatedSession = {
      ...session,
      user: { ...session.user, username: cleanUsername }
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedSession));
    notifyAuthChange();
    return updatedSession;
  },

  /**
   * Terminate session (Logout)
   */
  logout: () => {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      notifyAuthChange();
    } catch (e) {
      console.error('[authService] Error terminating session:', e);
    }
  }
};
