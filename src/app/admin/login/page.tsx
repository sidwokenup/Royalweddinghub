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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FBF9F5] text-[#1C1611] relative overflow-hidden px-4 py-12 selection:bg-[#521D2B] selection:text-[#FFFFFF]">
      {/* Background ambient royal illumination */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[550px] h-[550px] bg-[#9E7B3B]/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-[#521D2B]/8 rounded-full blur-[160px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(158,123,59,0.05)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#EAE4D940_1px,transparent_1px),linear-gradient(to_bottom,#EAE4D940_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60" />
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Brand Crest & Portal Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#521D2B] via-[#431622] to-[#2B0E16] text-[#FAF6F0] shadow-[0_8px_25px_rgba(82,29,43,0.25)] mb-5">
            <Sparkles className="w-7 h-7 text-[#E6C994]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#E9DECA] bg-[#FDF9F0] text-[#85662F] text-xs font-semibold tracking-wider uppercase mb-3 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Concierge Admin Access</span>
          </div>

          <h1 className="text-3xl font-serif text-[#1C1611] tracking-wide font-normal">
            Royal Wedding Hub
          </h1>
          <p className="text-xs text-[#5C5245] mt-2 font-sans font-light leading-relaxed">
            Authenticate to access live venue curation, wedding inquiries, and editorial controls.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#FFFFFF] border border-[#EAE4D9] rounded-3xl p-7 md:p-9 shadow-[0_12px_40px_rgba(28,22,17,0.06),0_1px_3px_rgba(28,22,17,0.04)]">
          {state?.error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{state.error}</div>
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <input type="hidden" name="from" value={redirectPath} />

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs uppercase tracking-wider font-semibold text-[#5C5245] mb-2 font-mono"
              >
                Administrator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C8070]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@royalweddinghub.com"
                  className="w-full bg-[#FFFFFF] border border-[#DDD5C7] rounded-xl pl-10 pr-4 py-3 text-xs text-[#1C1611] placeholder-[#A09585] focus:outline-none focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/10 transition-all duration-200 shadow-2xs font-sans"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-xs uppercase tracking-wider font-semibold text-[#5C5245] font-mono"
                >
                  Password
                </label>
                <span className="text-[10px] text-[#8C8070] font-mono">256-Bit Protected</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C8070]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••••••••••"
                  className="w-full bg-[#FFFFFF] border border-[#DDD5C7] rounded-xl pl-10 pr-11 py-3 text-xs text-[#1C1611] placeholder-[#A09585] focus:outline-none focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/10 transition-all duration-200 shadow-2xs font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8C8070] hover:text-[#1C1611] transition-colors duration-150"
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
              className="w-full mt-2 relative group overflow-hidden rounded-xl bg-gradient-to-r from-[#521D2B] to-[#431622] hover:from-[#632435] hover:to-[#521D2B] text-[#FFFFFF] font-medium py-3.5 px-4 text-xs flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(82,29,43,0.25)] hover:shadow-[0_6px_20px_rgba(82,29,43,0.35)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
            >
              <span className="relative z-10 flex items-center gap-2 font-medium tracking-wide">
                {isPending ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    <span>Enter Concierge Dashboard</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Session Safety Guarantee */}
          <div className="mt-6 pt-5 border-t border-[#F0ECE1] flex items-center justify-between text-[11px] text-[#8C8070] font-mono">
            <span>HttpOnly Session Guard</span>
            <span>Single-Device Active Token</span>
          </div>
        </div>

        {/* Back to Public Website */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#5C5245] hover:text-[#521D2B] font-medium transition-colors duration-200"
          >
            ← Return to RoyalWeddingHub.com
          </Link>
        </div>
      </div>
    </div>
  );
}
