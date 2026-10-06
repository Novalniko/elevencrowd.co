import React, { useState } from 'react';
import { ArrowLeft, Lock, Mail, Phone, User } from 'lucide-react';
import { memberService } from '../services/memberService';

export function MemberAuthPage({ mode = 'login', onSuccess, onNavigateToStore }) {
  const [isRegister, setIsRegister] = useState(mode === 'register');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    setError('');
    try {
      const member = isRegister ? memberService.register(form) : memberService.login(form);
      onSuccess(member);
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4 font-body">
      <div className="w-full max-w-md">
        <button onClick={onNavigateToStore} className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-white mb-10"><ArrowLeft className="w-4 h-4" /> Kembali ke toko</button>
        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">ElevenCrowd / Member</p>
        <h1 className="font-heading text-5xl mt-2">{isRegister ? 'BUAT AKUN' : 'LOGIN MEMBER'}</h1>
        <p className="text-sm text-neutral-400 mt-3">Login untuk melanjutkan pembelian dan melihat riwayat order.</p>
        <form onSubmit={submit} className="bg-neutral-900 border border-neutral-800 p-6 sm:p-8 mt-8 space-y-4">
          {isRegister && <label className="block text-xs font-bold uppercase tracking-wider">Nama<span className="relative block mt-1.5"><User className="absolute left-3 top-3 w-4 h-4 text-neutral-500" /><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 pl-10 pr-3 py-3 text-sm outline-none focus:border-white" /></span></label>}
          <label className="block text-xs font-bold uppercase tracking-wider">Email<span className="relative block mt-1.5"><Mail className="absolute left-3 top-3 w-4 h-4 text-neutral-500" /><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 pl-10 pr-3 py-3 text-sm outline-none focus:border-white" /></span></label>
          {isRegister && <label className="block text-xs font-bold uppercase tracking-wider">Nomor WhatsApp<span className="relative block mt-1.5"><Phone className="absolute left-3 top-3 w-4 h-4 text-neutral-500" /><input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 pl-10 pr-3 py-3 text-sm outline-none focus:border-white" /></span></label>}
          <label className="block text-xs font-bold uppercase tracking-wider">Password<span className="relative block mt-1.5"><Lock className="absolute left-3 top-3 w-4 h-4 text-neutral-500" /><input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 pl-10 pr-3 py-3 text-sm outline-none focus:border-white" /></span></label>
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <button className="w-full bg-white text-neutral-950 py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-neutral-200">{isRegister ? 'Daftar sebagai member' : 'Login untuk checkout'}</button>
          <button type="button" onClick={() => { setIsRegister(!isRegister); setError(''); }} className="w-full text-xs text-neutral-400 hover:text-white">{isRegister ? 'Sudah punya akun? Login' : 'Belum punya akun? Daftar'}</button>
        </form>
      </div>
    </div>
  );
}
