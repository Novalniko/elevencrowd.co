import React, { useState, useEffect } from 'react';
import { Lock, Mail, Eye, EyeOff, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';

export function AdminLoginPage({ onLoginSuccess, onNavigateToStore }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize admin user storage on mount
  useEffect(() => {
    authService.init();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      await authService.login(identifier, password);
      setIsLoading(false);
      onLoginSuccess();
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Email atau password salah.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-between p-4 sm:p-6 selection:bg-white selection:text-neutral-950 font-body">
      
      {/* Top Header / Back Link */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onNavigateToStore}
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors py-1 px-2.5 rounded-lg hover:bg-neutral-900 border border-transparent hover:border-neutral-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Toko</span>
        </button>

        <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
          SECURE PORTAL
        </span>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto py-8">
        
        {/* Brand Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 text-white mb-4 shadow-inner">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-white">
              ELEVEN CROWD<span className="text-neutral-500 text-3xl sm:text-4xl">.CO</span>
            </h1>
          </div>

          <div className="inline-block mt-1">
            <span className="bg-white text-neutral-950 font-bold text-[10px] tracking-[0.2em] px-2.5 py-0.5 rounded uppercase">
              ADMINISTRATOR LOGIN
            </span>
          </div>

          <p className="text-xs text-neutral-400 mt-3 max-w-xs mx-auto leading-relaxed">
            Masuk ke panel manajemen untuk mengelola katalog pakaian, stok barang, dan harga.
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          
          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 leading-snug">
                <span className="font-bold block text-[11px] uppercase tracking-wider text-rose-300">
                  Gagal Masuk
                </span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Field: Email / Username */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                Email atau Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="admin@elevencrowd.co"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  autoFocus
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-600 outline-none focus:border-white transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Field: Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-11 py-3 text-xs text-white placeholder-neutral-600 outline-none focus:border-white transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-neutral-300 transition-colors"
                  title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white hover:bg-neutral-200 text-neutral-950 font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <span>Memverifikasi...</span>
                ) : (
                  <>
                    <span>Login ke Dashboard Admin</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>

      {/* Footer copyright */}
      <div className="text-center text-[11px] text-neutral-600 pb-2">
        <p>© {new Date().getFullYear()} ElevenCrowd.co • Sistem Autentikasi Terenkripsi SHA-256</p>
      </div>

    </div>
  );
}
