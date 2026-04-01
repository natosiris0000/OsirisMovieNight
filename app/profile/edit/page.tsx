'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Camera, CheckCircle } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { cn } from '@/lib/utils'
import { getProfile, saveProfile } from '@/lib/profile'
import { useAuth } from '@/hooks/useAuth'
import { updateAuthUser } from '@/lib/auth'

const GENRES = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War']

export default function EditProfilePage() {
  const router = useRouter()
  const { user } = useAuth()

  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [preferredPlatform, setPreferredPlatform] = useState<'all' | 'netflix' | 'hbo'>('all')
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const profile = getProfile()
    // Prefer auth user values for name/email
    setDisplayName(user?.displayName ?? profile.displayName)
    setEmail(user?.email ?? profile.email)
    setUsername(profile.username)
    setBio(profile.bio)
    setSelectedGenres(profile.genres)
    setPreferredPlatform(profile.preferredPlatform)
  }, [user])

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : prev.length < 5 ? [...prev, genre] : prev
    )
  }

  const handleSave = () => {
    setIsSaving(true)
    // Save to profile store
    saveProfile({ displayName, username, email, bio, genres: selectedGenres, preferredPlatform })
    // Update auth user name/email if signed in
    if (user) updateAuthUser(user.id, { displayName, email })
    setTimeout(() => {
      setIsSaving(false)
      setSaved(true)
      setTimeout(() => {
        setSaved(false)
        router.push('/profile')
      }, 800)
    }, 600)
  }

  const initials = displayName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="min-h-screen bg-background pb-40">
      <Navbar />

      <main className="container mx-auto px-4 pb-32">
        <div className="pt-6 pb-4 flex items-center gap-3">
          <Link href="/profile" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Profile</span>
          </Link>
          <h1 className="flex-1 text-center text-xl font-bold text-foreground">Edit Profile</h1>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center py-6">
          <div className="relative w-24 h-24 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
            <span className="text-3xl font-black text-primary">{initials || '?'}</span>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors">
              <Camera className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
          <button className="text-xs text-primary font-semibold mt-2 hover:text-primary/80 transition-colors">
            Change Photo
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="text-xs uppercase font-semibold text-muted-foreground mb-1.5 block">Display Name</label>
            <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
              className="w-full bg-secondary border border-border/50 rounded-xl h-11 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              placeholder="Your display name" />
          </div>
          <div>
            <label className="text-xs uppercase font-semibold text-muted-foreground mb-1.5 block">Username</label>
            <input type="text" value={username}
              onChange={e => setUsername(e.target.value.startsWith('@') ? e.target.value : '@' + e.target.value)}
              className="w-full bg-secondary border border-border/50 rounded-xl h-11 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              placeholder="@username" />
          </div>
          <div>
            <label className="text-xs uppercase font-semibold text-muted-foreground mb-1.5 block">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-secondary border border-border/50 rounded-xl h-11 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              placeholder="your@email.com" />
          </div>
          <div>
            <label className="text-xs uppercase font-semibold text-muted-foreground mb-1.5 block">Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)}
              placeholder="Tell us what you love to watch…"
              className="w-full bg-secondary border border-border/50 rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none h-24" />
          </div>
        </div>

        {/* Genre Preferences */}
        <div className="py-4">
          <label className="text-xs uppercase font-semibold text-muted-foreground mb-2 block">Favorite Genres</label>
          <p className="text-xs text-muted-foreground mb-3">Select up to 5</p>
          <div className="flex flex-wrap gap-2">
            {GENRES.map(genre => (
              <button key={genre} onClick={() => toggleGenre(genre)}
                disabled={selectedGenres.length >= 5 && !selectedGenres.includes(genre)}
                className={cn('px-3 py-1.5 text-xs rounded-full font-semibold transition-colors',
                  selectedGenres.includes(genre)
                    ? 'bg-primary/20 text-primary border border-primary/50'
                    : 'bg-secondary text-muted-foreground border border-border/50 hover:text-foreground',
                  selectedGenres.length >= 5 && !selectedGenres.includes(genre) && 'opacity-50 cursor-not-allowed'
                )}>
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Preferred Platform */}
        <div className="py-4">
          <label className="text-xs uppercase font-semibold text-muted-foreground mb-3 block">Preferred Platform</label>
          <div className="grid grid-cols-3 gap-3">
            {(['all', 'netflix', 'hbo'] as const).map(p => (
              <button key={p} onClick={() => setPreferredPlatform(p)}
                className={cn('bg-card border-2 rounded-xl p-3 text-center cursor-pointer transition-colors',
                  preferredPlatform === p
                    ? p === 'netflix' ? 'border-netflix text-netflix'
                    : p === 'hbo' ? 'border-hbo text-hbo'
                    : 'border-primary'
                    : 'border-border/40 text-foreground'
                )}>
                <div className="text-lg font-bold mb-1">{p === 'all' ? 'ALL' : p === 'netflix' ? 'N' : 'HBO'}</div>
                <div className="text-[10px]">{p === 'all' ? 'Netflix & HBO Max' : p === 'netflix' ? 'Netflix' : 'HBO Max'}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="text-center py-6">
          <button className="text-sm text-red-500 hover:text-red-400 underline transition-colors">
            Delete Account
          </button>
        </div>
      </main>

      {/* Fixed Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border/40 p-4 z-40">
        <button onClick={handleSave} disabled={isSaving || saved}
          className={cn('w-full h-12 font-bold text-base rounded-xl transition-colors flex items-center justify-center gap-2',
            saved ? 'bg-green-600 text-white' : 'bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60'
          )}>
          {saved ? <><CheckCircle className="w-5 h-5" /> Saved!</> : isSaving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
