'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { FiMail, FiLock } from 'react-icons/fi';
import Image from 'next/image';
 import logo from '@/assets/logo.png'
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.replace(next);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || 'Invalid email or password');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden -my-10 bg-[#F4F1EC]">
      {/* Background accents */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-24 -right-24 h-[380px] w-[380px] rounded-full blur-3xl opacity-40"
          style={{ background: 'radial-gradient(closest-side, #234D7E 30%, transparent)' }}
        />
        <div
          className="absolute -bottom-24 -left-24 h-[420px] w-[420px] rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(closest-side, #244D7E 30%, transparent)' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(1200px 600px at 80% -20%, rgba(0,0,0,0.06), transparent 60%), radial-gradient(800px 400px at 10% 110%, rgba(0,0,0,0.05), transparent 60%)',
          }}
        />
      </div>

      {/* Shell */}
      <div className="relative mx-auto flex min-h-screen max-w-[1100px] items-center px-5 py-">
        <div className="grid w-full gap-6 rounded-3xl border border-black/10 bg-white/70 backdrop-blur-xl shadow-sm md:grid-cols-2 md:gap-0">
          {/* Brand / Illustration panel */}
          <aside className="relative hidden md:flex flex-col justify-between rounded-l-3xl bg-gradient-to-b from-[#234D7E] to-[#173352] p-8 text-white">
            <div className="flex items-center gap-3 bg-w">
              <span className='bg-white'>
                              <Image src={logo} alt="Trygve Studio logo" width={40} height={40} priority />

              </span>
              <span className="text-lg font-semibold tracking-wide">Trygve Studio</span>
            </div>

            <div className="mt-8">
              <h2 className="text-3xl font-semibold leading-tight">
                Welcome back,
                <br />
                Administrator
              </h2>
              <p className="mt-3 max-w-sm text-white/80">
                Sign in to access your dashboard and manage Architectural & Interior projects,
                renders, and more.
              </p>
            </div>

            {/* Decorative grid / illustration */}
            <div className="relative mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="grid grid-cols-3 gap-2 opacity-90">
                <div className="aspect-[4/3] rounded-lg bg-white/10" />
                <div className="aspect-[4/3] rounded-lg bg-white/10" />
                <div className="aspect-[4/3] rounded-lg bg-white/10" />
                <div className="aspect-[4/3] rounded-lg bg-white/10" />
                <div className="aspect-[4/3] rounded-lg bg-white/10" />
                <div className="aspect-[4/3] rounded-lg bg-white/10" />
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
            </div>

            <p className="mt-6 text-xs text-white/70">
              © {new Date().getFullYear()} Trygve Studio Private Limited
            </p>
          </aside>

          {/* Form panel */}
          <main className="relative flex flex-col justify-center rounded-3xl md:rounded-l-none p-7 md:p-10">
            {/* Logo (mobile) */}
            <div className="mb-3 flex items-center gap-3 md:hidden">
              <Image src={logo} alt="Trygve Studio logo" width={36} height={36} />
              <span className="text-base font-semibold text-[#234D7E]">Trygve Studio</span>
            </div>

            <header>
              <h1 className="text-2xl font-semibold text-[#234D7E]">Sign in</h1>
              <p className="mt-1 text-sm text-neutral-600">
                Use your admin credentials to continue.
              </p>
            </header>

            {/* Error banner */}
            {error ? (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Email */}
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-neutral-700">Email</span>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiMail className="text-neutral-400" />
                  </span>
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="username"
                    className="w-full rounded-lg border border-black/10 bg-white px-10 py-3 outline-none ring-0 transition focus:border-[#234D7E] focus:ring-2 focus:ring-[#234D7E]/20"
                  />
                </div>
              </label>

              {/* Password */}
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-neutral-700">Password</span>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiLock className="text-neutral-400" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full rounded-lg border border-black/10 bg-white px-10 py-3 pr-12 outline-none ring-0 transition focus:border-[#234D7E] focus:ring-2 focus:ring-[#234D7E]/20"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-neutral-500 hover:text-neutral-700"
                  >
                    {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  </button>
                </div>
              </label>

              {/* Actions */}
              <div className="mt-2 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-neutral-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-black/20 text-[#234D7E] focus:ring-[#234D7E]"
                  />
                  Remember me
                </label>
                <a href="#" className="text-sm text-[#234D7E] underline-offset-2 hover:underline">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-4 w-full rounded-lg bg-[#244D7E] py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {submitting ? 'Signing in…' : 'Sign in'}
              </button>

              {/* Divider */}
              <div className="relative my-4 text-center">
                <span className="relative z-10 bg-white px-2 text-xs text-neutral-500">secure area</span>
                <div className="absolute inset-0 top-1/2 -translate-y-1/2 border-t border-black/10" />
              </div>

             
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}