const MEMBERS_KEY = 'elevencrowd_members';
const SESSION_KEY = 'elevencrowd_member_session';
const EVENT_NAME = 'elevencrowd:member_changed';

function hash(value) {
  return Array.from(new TextEncoder().encode(value)).reduce((total, byte) => ((total * 31) + byte) >>> 0, 7).toString(16);
}

function readMembers() {
  try {
    const saved = localStorage.getItem(MEMBERS_KEY);
    const members = saved ? JSON.parse(saved) : [];
    return Array.isArray(members) ? members : [];
  } catch {
    return [];
  }
}

function notify() {
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export const memberService = {
  EVENT_NAME,
  getCurrent: () => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
  },
  isLoggedIn: () => Boolean(memberService.getCurrent()),
  register: ({ name, email, phone, password }) => {
    const cleanEmail = email.trim().toLowerCase();
    const members = readMembers();
    if (members.some((member) => member.email === cleanEmail)) throw new Error('Email sudah terdaftar. Silakan login.');
    if (password.length < 6) throw new Error('Password minimal 6 karakter.');
    const member = { id: `member-${Date.now()}`, name: name.trim(), email: cleanEmail, phone: phone.trim(), passwordHash: hash(password), createdAt: new Date().toISOString() };
    localStorage.setItem(MEMBERS_KEY, JSON.stringify([member, ...members]));
    const session = { id: member.id, name: member.name, email: member.email, phone: member.phone };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    notify();
    return session;
  },
  login: ({ email, password }) => {
    const cleanEmail = email.trim().toLowerCase();
    const member = readMembers().find((item) => item.email === cleanEmail && item.passwordHash === hash(password));
    if (!member) throw new Error('Email atau password member salah.');
    const session = { id: member.id, name: member.name, email: member.email, phone: member.phone };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    notify();
    return session;
  },
  logout: () => { localStorage.removeItem(SESSION_KEY); notify(); }
};
