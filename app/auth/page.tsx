'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { signIn, signUp } from '@/lib/auth'

type ActiveTab = 'signin' | 'signup'

export default function AuthPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<ActiveTab>('signin')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Sign In state
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')

  // Sign Up state
  const [displayName, setDisplayName] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const switchTab = (tab: ActiveTab) => {
    setActiveTab(tab)
    setError('')
    setSuccess('')
  }

  const handleSignIn = async () => {
    setError('')
    setLoading(true)
    const result = signIn(signInEmail, signInPassword)
    setLoading(false)
    if (result.error) { setError(result.error); return }
    setSuccess('Welcome back!')
    setTimeout(() => router.push('/'), 700)
  }

  const handleSignUp = async () => {
    setError('')
    if (signUpPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    const result = signUp(displayName, signUpEmail, signUpPassword)
    setLoading(false)
    if (result.error) { setError(result.error); return }
    setSuccess('Account created! Welcome to Osiris!')
    setTimeout(() => router.push('/'), 700)
  }

  const inputClass = "w-full bg-secondary border border-border/50 rounded-xl h-11 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12 relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="grid grid-cols-3 gap-4 p-8 w-full h-full opacity-30">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-card rounded-lg"
              style={{ transform: i % 2 === 0 ? 'rotate(-1.5deg) scale(0.9)' : 'rotate(1.5deg) scale(0.85)', opacity: 0.15 }} />
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-sm bg-card border border-border/40 rounded-2xl p-6 shadow-xl">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="text-3xl font-black text-primary tracking-widest">OSIRIS</div>
          <div className="text-sm text-muted-foreground tracking-wide mt-1">Movie Night</div>
        </div>

        {/* Tab Switcher */}
        <div className="mb-6">
          <div className="flex gap-0">
            {(['signin', 'signup'] as const).map(tab => (
              <button key={tab} onClick={() => switchTab(tab)}
                className={cn('flex-1 pb-3 border-b-2 text-sm font-semibold transition-colors',
                  activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                )}>
                {tab === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>
          <div className="border-b border-border/40 mt-0" />
        </div>

        {/* Error / Success */}
        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-3 py-2.5 mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-xl px-3 py-2.5 mb-4">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            {success}
          </div>
        )}

        {/* Sign In Form */}
        {activeTab === 'signin' && (
          <div className="space-y-4">
            <input type="email" placeholder="Email address" value={signInEmail}
              onChange={e => setSignInEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSignIn()}
              className={inputClass} />
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} placeholder="Password"
                value={signInPassword} onChange={e => setSignInPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSignIn()}
                className={cn(inputClass, 'pr-12')} />
              <button onClick={() => setShowPassword(!showPassword)} type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex justify-end">
              <span className="text-xs text-muted-foreground">Forgot password? Reset it in Profile settings.</span>
            </div>
            <button onClick={handleSignIn} disabled={loading || !!success}
              className="w-full bg-primary text-primary-foreground font-semibold rounded-xl h-11 hover:bg-primary/90 transition-colors mt-2 disabled:opacity-60">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </div>
        )}

        {/* Sign Up Form */}
        {activeTab === 'signup' && (
          <div className="space-y-4">
            <input type="text" placeholder="Display name" value={displayName}
              onChange={e => setDisplayName(e.target.value)} className={inputClass} />
            <input type="email" placeholder="Email address" value={signUpEmail}
              onChange={e => setSignUpEmail(e.target.value)} className={inputClass} />
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} placeholder="Password (min 6 characters)"
                value={signUpPassword} onChange={e => setSignUpPassword(e.target.value)}
                className={cn(inputClass, 'pr-12')} />
              <button onClick={() => setShowPassword(!showPassword)} type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="relative">
              <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm password"
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSignUp()}
                className={cn(inputClass, 'pr-12')} />
              <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button onClick={handleSignUp} disabled={loading || !!success}
              className="w-full bg-primary text-primary-foreground font-semibold rounded-xl h-11 hover:bg-primary/90 transition-colors mt-2 disabled:opacity-60">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 border-b border-border/40" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="flex-1 border-b border-border/40" />
        </div>

        {/* Google (placeholder) */}
        <button className="w-full border border-border/50 rounded-xl h-11 flex items-center justify-center gap-3 hover:bg-secondary transition-colors text-foreground text-sm font-medium opacity-50 cursor-not-allowed" disabled>
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #4285f4 25%, #ea4335 25% 50%, #fbbc04 50% 75%, #34a853 75%)' }}>
            <span className="text-white text-[10px] font-black">G</span>
          </div>
          Continue with Google
        </button>

        <div className="text-center mt-4 text-[11px] text-muted-foreground">
          By continuing you agree to our{' '}
          <Link href="#" className="text-primary hover:text-primary/80 transition-colors">Terms of Service</Link>{' '}
          and{' '}
          <Link href="#" className="text-primary hover:text-primary/80 transition-colors">Privacy Policy</Link>
        </div>
      </div>

      <p className="relative z-10 mt-4 text-center text-xs text-muted-foreground">
        Just browsing?{' '}
        <Link href="/" className="text-primary hover:text-primary/80 underline font-medium">
          Continue without account
        </Link>
      </p>
    </div>
  )
}
