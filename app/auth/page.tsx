'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

type ActiveTab = 'signin' | 'signup'

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('signin')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Sign In form state
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')

  // Sign Up form state
  const [displayName, setDisplayName] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12 relative">
      {/* Background Effect - Subtle grid pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="grid grid-cols-3 gap-4 p-8 w-full h-full opacity-30">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-lg"
              style={{
                transform: i % 2 === 0 ? 'rotate(-1.5deg) scale(0.9)' : 'rotate(1.5deg) scale(0.85)',
                opacity: 0.15,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Auth Card */}
      <div className="relative z-10 w-full max-w-sm bg-card border border-border/40 rounded-2xl p-6 shadow-xl">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="text-3xl font-black text-primary tracking-widest">OSIRIS</div>
          <div className="text-sm text-muted-foreground tracking-wide mt-1">Movie Night</div>
        </div>

        {/* Tab Switcher */}
        <div className="mb-6">
          <div className="flex gap-0">
            <button
              onClick={() => setActiveTab('signin')}
              className={cn(
                'flex-1 pb-3 border-b-2 text-sm font-semibold transition-colors',
                activeTab === 'signin'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={cn(
                'flex-1 pb-3 border-b-2 text-sm font-semibold transition-colors',
                activeTab === 'signup'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              Sign Up
            </button>
          </div>
          <div className="border-b border-border/40 mt-0" />
        </div>

        {/* Sign In Form */}
        {activeTab === 'signin' && (
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
              className="w-full bg-secondary border border-border/50 rounded-xl h-11 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                className="w-full bg-secondary border border-border/50 rounded-xl h-11 px-4 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                type="button"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="flex justify-end">
              <Link href="#" className="text-xs text-primary hover:text-primary/80 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button className="w-full bg-primary text-primary-foreground font-semibold rounded-xl h-11 hover:bg-primary/90 transition-colors mt-4">
              Sign In
            </button>
          </div>
        )}

        {/* Sign Up Form */}
        {activeTab === 'signup' && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-secondary border border-border/50 rounded-xl h-11 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            />

            <input
              type="email"
              placeholder="Email address"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              className="w-full bg-secondary border border-border/50 rounded-xl h-11 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                className="w-full bg-secondary border border-border/50 rounded-xl h-11 px-4 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                type="button"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-secondary border border-border/50 rounded-xl h-11 px-4 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
              <button
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                type="button"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <button className="w-full bg-primary text-primary-foreground font-semibold rounded-xl h-11 hover:bg-primary/90 transition-colors mt-4">
              Create Account
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 border-b border-border/40" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="flex-1 border-b border-border/40" />
        </div>

        {/* Google Button */}
        <button className="w-full border border-border/50 rounded-xl h-11 flex items-center justify-center gap-3 hover:bg-secondary transition-colors text-foreground text-sm font-medium">
          {/* Simple Google G logo */}
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{
            background: 'linear-gradient(135deg, #4285f4 25%, #ea4335 25% 50%, #fbbc04 50% 75%, #34a853 75%)'
          }}>
            <span className="text-white text-[10px] font-black">G</span>
          </div>
          Continue with Google
        </button>

        {/* Terms Text */}
        <div className="text-center mt-4 text-[11px] text-muted-foreground">
          By continuing you agree to our{' '}
          <Link href="#" className="text-primary hover:text-primary/80 transition-colors">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="#" className="text-primary hover:text-primary/80 transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>

      {/* Skip link */}
      <p className="relative z-10 mt-4 text-center text-xs text-muted-foreground">
        Just browsing?{" "}
        <Link href="/" className="text-primary hover:text-primary/80 underline font-medium">
          Continue without account
        </Link>
      </p>
    </div>
  )
}
