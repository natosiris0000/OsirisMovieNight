'use client'

import { useState, useEffect } from 'react'
import { User, Pencil, Bookmark, CheckCircle, Play, Bell, Globe, MapPin, Lock, HelpCircle, LogOut, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { BottomNav } from '@/components/bottom-nav'
import { MovieRow } from '@/components/movie-row'
import { cn } from '@/lib/utils'
import { useLibrary } from '@/hooks/useLibrary'
import { getProfile, type UserProfile } from '@/lib/profile'

const settingsItems = [
  { icon: Bell, label: 'Notifications', href: '#' },
  { icon: Globe, label: 'Language', href: '#' },
  { icon: MapPin, label: 'Region · Thailand', href: '#' },
  { icon: Lock, label: 'Change Password', href: '#' },
  { icon: HelpCircle, label: 'Help & Support', href: '#' },
]

export default function ProfilePage() {
  const library = useLibrary()
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    setProfile(getProfile())
    const onProfileChanged = () => setProfile(getProfile())
    window.addEventListener('profile-changed', onProfileChanged)
    return () => window.removeEventListener('profile-changed', onProfileChanged)
  }, [])

  // Real stats from library
  const savedCount = library.length
  const watchedCount = library.filter(m => m.status === 'watched').length
  const watchingCount = library.filter(m => m.status === 'watching').length

  // Platform breakdown
  const netflixCount = library.filter(m => m.platform === 'netflix').length
  const hboCount = library.filter(m => m.platform === 'hbo').length
  const total = netflixCount + hboCount || 1
  const netflixPct = Math.round((netflixCount / total) * 100)
  const hboPct = Math.round((hboCount / total) * 100)

  // Recently added (last 10, sorted by addedAt desc)
  const recentlyAdded = [...library]
    .sort((a, b) => b.addedAt - a.addedAt)
    .slice(0, 10)
    .map(m => ({ ...m, posterUrl: m.posterUrl ?? '' }))

  const displayName = profile?.displayName ?? 'Movie Lover'
  const email = profile?.email ?? 'user@email.com'
  const genres = profile?.genres ?? ['Sci-Fi', 'Drama', 'Thriller']

  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-0">
      <Navbar />

      <main>
        {/* Profile Header */}
        <section className="container mx-auto px-4 pt-6 pb-4">
          <div className="bg-card border border-border/40 rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full bg-secondary border-2 border-primary flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-foreground">{displayName}</h1>
                <p className="text-sm text-muted-foreground">{email}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Member since Jan 2024</p>
              </div>
            </div>
            <Link
              href="/profile/edit"
              className={cn('w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 border border-primary/50 rounded-xl text-sm font-medium text-primary hover:bg-primary/10 transition-colors')}
            >
              <Pencil className="w-4 h-4" />
              Edit Profile
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card border border-border/40 rounded-xl p-3 text-center">
              <Bookmark className="w-4 h-4 text-primary mb-1 mx-auto" />
              <div className="text-2xl font-bold text-foreground">{savedCount}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Saved</div>
            </div>
            <div className="bg-card border border-border/40 rounded-xl p-3 text-center">
              <CheckCircle className="w-4 h-4 text-green-400 mb-1 mx-auto" />
              <div className="text-2xl font-bold text-foreground">{watchedCount}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Watched</div>
            </div>
            <div className="bg-card border border-border/40 rounded-xl p-3 text-center">
              <Play className="w-4 h-4 text-blue-400 mb-1 mx-auto" />
              <div className="text-2xl font-bold text-foreground">{watchingCount}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Watching</div>
            </div>
          </div>
        </section>

        {/* Favorite Genres */}
        <section className="container mx-auto px-4 py-2">
          <h2 className="text-xs uppercase font-semibold text-muted-foreground mb-3">Favorite Genres</h2>
          <div className="flex flex-wrap gap-2">
            {genres.map(genre => (
              <Link key={genre} href={`/genre/${genre.toLowerCase()}`}
                className="bg-primary/15 text-primary border border-primary/30 text-xs rounded-full px-3 py-1 font-medium hover:bg-primary/25 transition-colors">
                {genre}
              </Link>
            ))}
            {genres.length === 0 && (
              <Link href="/profile/edit" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                + Add genres in Edit Profile
              </Link>
            )}
          </div>
        </section>

        {/* Platform Breakdown */}
        <section className="container mx-auto px-4 py-2">
          <h2 className="text-xs uppercase font-semibold text-muted-foreground mb-3">Platform Breakdown</h2>
          {library.length === 0 ? (
            <p className="text-xs text-muted-foreground">Save titles to see your breakdown.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card border-l-4 border-l-netflix border border-border/40 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-netflix font-bold">Netflix</div>
                  <div className="text-xs text-muted-foreground">{netflixPct}%</div>
                </div>
                <div className="text-2xl font-bold text-foreground mb-2">{netflixCount} <span className="text-sm font-normal text-muted-foreground">titles</span></div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-netflix rounded-full transition-all" style={{ width: `${netflixPct}%` }} />
                </div>
              </div>
              <div className="bg-card border-l-4 border-l-hbo border border-border/40 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-hbo font-bold">HBO Max</div>
                  <div className="text-xs text-muted-foreground">{hboPct}%</div>
                </div>
                <div className="text-2xl font-bold text-foreground mb-2">{hboCount} <span className="text-sm font-normal text-muted-foreground">titles</span></div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-hbo rounded-full transition-all" style={{ width: `${hboPct}%` }} />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Recently Added */}
        {recentlyAdded.length > 0 && (
          <section className="py-2">
            <div className="container mx-auto px-4 mb-3">
              <h2 className="text-xs uppercase font-semibold text-muted-foreground">Recently Added</h2>
            </div>
            <MovieRow title="" movies={recentlyAdded} />
          </section>
        )}

        {/* Settings */}
        <section className="container mx-auto px-4 py-4 pb-24">
          <h2 className="text-xs uppercase font-semibold text-muted-foreground mb-3">Settings</h2>
          <div className="bg-card border border-border/40 rounded-2xl overflow-hidden">
            {settingsItems.map((item, index) => (
              <button key={item.label}
                className={cn('w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-secondary/50 transition-colors',
                  index !== settingsItems.length - 1 && 'border-b border-border/40'
                )}>
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
            <button className="w-full flex items-center justify-between px-4 py-3.5 text-left border-t-2 border-border/40 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <LogOut className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-500 font-medium">Sign Out</span>
              </div>
            </button>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
