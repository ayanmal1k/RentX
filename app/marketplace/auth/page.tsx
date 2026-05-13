'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { MarketplaceNavbar } from '@/components/rentx/MarketplaceNavbar';
import { MarketplaceFooter } from '@/components/rentx/MarketplaceFooter';
import { Mail, Lock, User, Briefcase, ArrowRight, Sparkles, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'client' | 'provider'>('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        if (!displayName.trim()) {
          setError('Please enter your name');
          setLoading(false);
          return;
        }
        await signUp(email, password, displayName, role);
      }
      // Redirect based on role
      router.push(role === 'provider' ? '/marketplace/dashboard/provider' : '/marketplace/dashboard/client');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle(role);
      router.push(role === 'provider' ? '/marketplace/dashboard/provider' : '/marketplace/dashboard/client');
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-sparkle overflow-clip flex flex-col">
      <MarketplaceNavbar />

      <section className="flex-grow flex items-center justify-center py-20 px-4 relative">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/8 blur-[150px] rounded-full pointer-events-none" />

        <div className="relative z-10 w-full max-w-md">
          {/* Card */}
          <div className="glass-card rounded-3xl p-8 shadow-2xl shadow-black/30">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-primary text-xs font-bold tracking-wider uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
                  {mode === 'login' ? 'Welcome Back' : 'Join RENTX'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </h1>
              <p className="text-on-surface-variant text-sm">
                {mode === 'login'
                  ? 'Access your marketplace dashboard'
                  : 'Start booking or offering services'}
              </p>
            </div>

            {/* Role Toggle (signup only) */}
            {mode === 'signup' && (
              <div className="flex gap-2 mb-6 p-1 bg-surface-container-lowest rounded-xl">
                <button
                  type="button"
                  onClick={() => setRole('client')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    role === 'client'
                      ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                      : 'text-on-surface-variant hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Client
                </button>
                <button
                  type="button"
                  onClick={() => setRole('provider')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    role === 'provider'
                      ? 'bg-secondary text-on-secondary shadow-lg shadow-secondary/20'
                      : 'text-on-surface-variant hover:text-white'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  Provider
                </button>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-error/10 border border-error/30 rounded-xl px-4 py-3 mb-4 text-error text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={role === 'provider' ? 'Business / Full Name' : 'Full Name'}
                    className="w-full bg-surface-container-low border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-on-surface-variant/50 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                    required
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full bg-surface-container-low border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-on-surface-variant/50 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-surface-container-low border border-white/10 rounded-xl pl-11 pr-11 py-3 text-white placeholder:text-on-surface-variant/50 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-on-surface-variant text-xs">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-surface-container-high border border-white/10 py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-3 hover:border-white/20 hover:bg-surface-container-highest transition-all duration-300 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            {/* Toggle mode */}
            <p className="text-center text-on-surface-variant text-sm mt-6">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
                className="text-primary hover:text-primary-fixed font-semibold transition-colors"
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>

            {/* Security badge */}
            <div className="flex items-center justify-center gap-2 mt-4 text-on-surface-variant/50 text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Secured with Firebase Authentication</span>
            </div>
          </div>
        </div>
      </section>

      <MarketplaceFooter />

      {/* Global glow */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/[0.03] blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary-container/[0.03] blur-[120px] rounded-full" />
      </div>
    </main>
  );
}
