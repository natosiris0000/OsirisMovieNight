'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Camera, User } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { cn } from '@/lib/utils'

const GENRES = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War']

export default function EditProfilePage() {
  const [displayName, setDisplayName] = useState('Movie Lover')
  const [username, setUsername] = useState('@movielover')
  const [email, setEmail] = useState('user@email.com')
  const [bio, setBio] = useState('')
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Sci-Fi', 'Drama', 'Thriller'])
  const [preferredPlatform, setPreferredPlatform] = useState<'all' | 'netflix' | 'hbo'>('all')
  const [isSaving, setIsSaving] = useState(false)

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genre)) {
        return prev.filter((g) => g !== genre)
      } else if (prev.length < 5) {
        return [...prev, genre]
      }
      return prev
    })
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => setIsSaving(false), 1500)
  }

  return (
    <div className="min-h-screen bg-background pb-40">
      <Navbar />

      <main className="container mx-auto px-4 pb-32">
        {/* Back + Title Row */}
        <div className="pt-6 pb-4 flex items-center gap-3">
          <Link href="/profile" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Profile</span>
          </Link>
          <h1 className="flex-1 text-center text-xl font-bold text-foreground">Edit Profile</h1>
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center py-6">
          <div className="relative w-24 h-24 rounded-full bg-secondary border-2 border-primary flex items-center justify-center">
            <User className="w-10 h-10 text-primary" />
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
          {/* Display Name */}
          <div>
            <label className="text-xs uppercase font-semibold text-muted-foreground mb-1.5 block">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-secondary border border-border/50 rounded-xl h-11 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              placeholder="Your display name"
            />
          </div>

          {/* Username */}
          <div>
            <label className="text-xs uppercase font-semibold text-muted-foreground mb-1.5 block">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.startsWith('@') ? e.target.value : '@' + e.target.value)}
              className="w-full bg-secondary border border-border/50 rounded-xl h-11 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              placeholder="@username"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs uppercase font-semibold text-muted-foreground mb-1.5 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-secondary border border-border/50 rounded-xl h-11 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              placeholder="your@email.com"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-xs uppercase font-semibold text-muted-foreground mb-1.5 block">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us what you love to watch…"
              className="w-full bg-secondary border border-border/50 rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none rows-3 h-24"
            />
          </div>
        </div>

        {/* Genre Preferences */}
        <div className="py-4">
          <label className="text-xs uppercase font-semibold text-muted-foreground mb-2 block">Favorite Genres</label>
          <p className="text-xs text-muted-foreground mb-3">Select up to 5</p>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                disabled={selectedGenres.length >= 5 && !selectedGenres.includes(genre)}
                className={cn(
                  'px-3 py-1.5 text-xs rounded-full font-semibold transition-colors',
                  selectedGenres.includes(genre)
                    ? 'bg-primary/20 text-primary border border-primary/50'
                    : 'bg-secondary text-muted-foreground border border-border/50 hover:text-foreground',
                  selectedGenres.length >= 5 && !selectedGenres.includes(genre) && 'opacity-50 cursor-not-allowed'
                )}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Preferred Platform */}
        <div className="py-4">
          <label className="text-xs uppercase font-semibold text-muted-foreground mb-3 block">Preferred Platform</label>
          <div className="grid grid-cols-3 gap-3">
            {/* All Platforms */}
            <button
              onClick={() => setPreferredPlatform('all')}
              className={cn(
                'bg-card border-2 rounded-xl p-3 text-center cursor-pointer transition-colors',
                preferredPlatform === 'all' ? 'border-primary' : 'border-border/40'
              )}
            >
              <div className="text-lg font-bold text-foreground mb-1">ALL</div>
              <div className="text-[10px] text-muted-foreground">Netflix & HBO Max</div>
            </button>

            {/* Netflix */}
            <button
              onClick={() => setPreferredPlatform('netflix')}
              className={cn(
                'bg-card border-2 rounded-xl p-3 text-center cursor-pointer transition-colors',
                preferredPlatform === 'netflix' ? 'border-netflix text-netflix' : 'border-border/40 text-foreground'
              )}
            >
              <div className="text-lg font-bold mb-1">N</div>
              <div className="text-[10px]">Netflix</div>
            </button>

            {/* HBO Max */}
            <button
              onClick={() => setPreferredPlatform('hbo')}
              className={cn(
                'bg-card border-2 rounded-xl p-3 text-center cursor-pointer transition-colors',
                preferredPlatform === 'hbo' ? 'border-hbo text-hbo' : 'border-border/40 text-foreground'
              )}
            >
              <div className="text-lg font-bold mb-1">HBO</div>
              <div className="text-[10px]">HBO Max</div>
            </button>
          </div>
        </div>

        {/* Delete Account Link */}
        <div className="text-center py-6">
          <button className="text-sm text-red-500 hover:text-red-400 underline transition-colors">
            Delete Account
          </button>
        </div>
      </main>

      {/* Fixed Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border/40 p-4 z-40">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full h-12 bg-primary text-primary-foreground font-bold text-base rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {isSaving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
