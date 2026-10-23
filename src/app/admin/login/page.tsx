'use client';

import React, { useActionState, useState, use } from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { loginAdminAction, LoginActionState } from './actions';

interface LoginPageProps {
  searchParams?: Promise<{ from?: string }>;
}

export default function AdminLoginPage(props: LoginPageProps) {
  const searchParams = props.searchParams ? use(props.searchParams) : undefined;
  const redirectPath = searchParams?.from || '/admin';

  const [state, formAction, isPending] = useActionState<LoginActionState | null, FormData>(
    loginAdminAction,
    null
  );

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#070605] text-[#f5f0eb] relative overflow-hidden px-4 py-12 selection:bg-[#c5a880] selection:text-[#070605]">
      {/* Background ambient royal illumination */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[550px] h-[550px] bg-[#c5a880]/8 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-[#997e59]/10 rounded-full blur-[160px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.04)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1c1815_1px,transparent_1px),linear-gradient(to_bottom,#1f1c1815_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Brand Crest & Portal Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2a241c] via-[#1a1713] to-[#0d0c0a] border border-[#c5a880]/30 shadow-[0_0_35px_rgba(197,168,128,0.15)] mb-5">
            <Sparkles className="w-7 h-7 text-[#c5a880]" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#c5a880]/20 bg-[#161411]/80 text-[#c5a880] text-xs font-medium tracking-widest uppercase mb-3 backdrop-blur-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Editorial Concierge Portal</span>
          </div>

          <h1 className="text-3xl font-serif text-[#faf6f0] tracking-wide font-normal">
            Royal Wedding Hub
          </h1>
          <p className="text-sm text-[#a89f91] mt-2 font-sans font-light">
            Authenticate to access live venue curation, wedding inquiries, and editorial controls.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#12100d]/90 border border-[#2e2820] rounded-2xl p-7 md:p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          {state?.error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{state.error}</div>
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <input type="hidden" name="from" value={redirectPath} />

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs uppercase tracking-wider font-medium text-[#c5a880] mb-2"
              >
                Administrator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#73685a]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@royalweddinghub.com"
                  className="w-full bg-[#1b1713]/80 border border-[#332a20] rounded-xl pl-10 pr-4 py-3 text-sm text-[#f5f0eb] placeholder-[#6e6457] focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/50 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-xs uppercase tracking-wider font-medium text-[#c5a880]"
                >
                  Passkey
                </label>
                <span className="text-[11px] text-[#7d7263]">256-Bit Protected</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#73685a]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••••••••••"
                  className="w-full bg-[#1b1713]/80 border border-[#332a20] rounded-xl pl-10 pr-11 py-3 text-sm text-[#f5f0eb] placeholder-[#6e6457] focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/50 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7d7263] hover:text-[#c5a880] transition-colors duration-150"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-2 relative group overflow-hidden rounded-xl bg-gradient-to-r from-[#c5a880] via-[#dfc9a5] to-[#c5a880] text-[#12100d] font-medium py-3.5 px-4 text-sm flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(197,168,128,0.25)] hover:shadow-[0_4px_35px_rgba(197,168,128,0.4)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2 font-medium tracking-wide">
                {isPending ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#12100d]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Verifying Credentials...
                  </>
                ) : (
                  <>
                    Enter Concierge Dashboard
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Session Safety Guarantee */}
          <div className="mt-6 pt-5 border-t border-[#231e17] flex items-center justify-between text-[11px] text-[#73685a]">
            <span>HttpOnly Session Guard</span>
            <span>Single-Device Active Token</span>
          </div>
        </div>

        {/* Back to Public Website */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#8a7f70] hover:text-[#c5a880] transition-colors duration-200"
          >
            ← Return to RoyalWeddingHub.com
          </Link>
        </div>
      </div>
    </div>
  );
}
