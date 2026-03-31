'use client'

import { User, Pencil, Bookmark, CheckCircle, Play, Bell, Globe, MapPin, Lock, HelpCircle, LogOut, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { BottomNav } from '@/components/bottom-nav'
import { MovieRow } from '@/components/movie-row'
import { cn } from '@/lib/utils'

const recentlyAdded = [
  { id: 1, title: 'Dune: Part Two', year: 2024, rating: 8.8, platform: 'hbo' as const, posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop&q=80' },
  { id: 2, title: 'Squid Game S2', year: 2024, rating: 8.1, platform: 'netflix' as const, posterUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=600&fit=crop&q=80' },
  { id: 3, title: 'Succession', year: 2023, rating: 9.3, platform: 'hbo' as const, posterUrl: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400&h=600&fit=crop&q=80' },
  { id: 4, title: 'Wednesday', year: 2022, rating: 8.1, platform: 'netflix' as const, posterUrl: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&h=600&fit=crop&q=80' },
  { id: 5, title: 'The White Lotus S3', year: 2025, rating: 8.6, platform: 'hbo' as const, posterUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=600&fit=crop&q=80' },
]

const settingsItems = [
  { icon: Bell, label: 'Notifications', href: '#' },
  { icon: Globe, label: 'Language', href: '#' },
  { icon: MapPin, label: 'Region · Thailand', href: '#' },
  { icon: Lock, label: 'Change Password', href: '#' },
  { icon: HelpCircle, label: 'Help & Support', href: '#' },
]

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-0">
      <Navbar />

      <main>
        {/* Profile Header Card */}
        <section className="container mx-auto px-4 pt-6 pb-4">
          <div className="bg-card border border-border/40 rounded-2xl p-5">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-secondary border-2 border-primary flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-primary" />
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-xl font-bold text-foreground">Movie Lover</h1>
                <p className="text-sm text-muted-foreground">user@email.com</p>
                <p className="text-xs text-muted-foreground mt-0.5">Member since Jan 2024</p>
              </div>
            </div>

            {/* Edit Profile Button */}
            <Link
              href="/profile/edit"
              className={cn(
                'w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 border border-primary/50 rounded-xl text-sm font-medium text-primary hover:bg-primary/10 transition-colors'
              )}
            >
              <Pencil className="w-4 h-4" />
              Edit Profile
            </Link>
          </div>
        </section>

        {/* Stats Row */}
        <section className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-3 gap-3">
            {/* Saved */}
            <div className="bg-card border border-border/40 rounded-xl p-3 text-center">
              <Bookmark className="w-4 h-4 text-primary mb-1 mx-auto" />
              <div className="text-2xl font-bold text-foreground">24</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Saved</div>
            </div>

            {/* Watched */}
            <div className="bg-card border border-border/40 rounded-xl p-3 text-center">
              <CheckCircle className="w-4 h-4 text-green-400 mb-1 mx-auto" />
              <div className="text-2xl font-bold text-foreground">18</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Watched</div>
            </div>

            {/* Watching */}
            <div className="bg-card border border-border/40 rounded-xl p-3 text-center">
              <Play className="w-4 h-4 text-blue-400 mb-1 mx-auto" />
              <div className="text-2xl font-bold text-foreground">3</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Watching</div>
            </div>
          </div>
        </section>

        {/* Favorite Genres */}
        <section className="container mx-auto px-4 py-2">
          <h2 className="text-xs uppercase font-semibold text-muted-foreground mb-3">Favorite Genres</h2>
          <div className="flex flex-wrap gap-2">
            {['Sci-Fi', 'Drama', 'Thriller', 'Action', 'Crime'].map((genre) => (
              <Link
                key={genre}
                href={`/genre/${genre.toLowerCase()}`}
                className="bg-primary/15 text-primary border border-primary/30 text-xs rounded-full px-3 py-1 font-medium hover:bg-primary/25 transition-colors"
              >
                {genre}
              </Link>
            ))}
          </div>
        </section>

        {/* Platform Breakdown */}
        <section className="container mx-auto px-4 py-2">
          <h2 className="text-xs uppercase font-semibold text-muted-foreground mb-3">Platform Breakdown</h2>
          <div className="grid grid-cols-2 gap-3">
            {/* Netflix card */}
            <div className="bg-card border-l-4 border-l-netflix border border-border/40 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-netflix font-bold">Netflix</div>
                <div className="text-xs text-muted-foreground">58%</div>
              </div>
              <div className="text-2xl font-bold text-foreground mb-2">14 <span className="text-sm font-normal text-muted-foreground">titles</span></div>
              {/* Progress bar */}
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-netflix rounded-full" style={{ width: "58%" }} />
              </div>
            </div>

            {/* HBO Max card */}
            <div className="bg-card border-l-4 border-l-hbo border border-border/40 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-hbo font-bold">HBO Max</div>
                <div className="text-xs text-muted-foreground">42%</div>
              </div>
              <div className="text-2xl font-bold text-foreground mb-2">10 <span className="text-sm font-normal text-muted-foreground">titles</span></div>
              {/* Progress bar */}
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-hbo rounded-full" style={{ width: "42%" }} />
              </div>
            </div>
          </div>
        </section>

        {/* Recently Added */}
        <section className="py-2">
          <div className="container mx-auto px-4 mb-3">
            <h2 className="text-xs uppercase font-semibold text-muted-foreground">Recently Added</h2>
          </div>
          <MovieRow title="" movies={recentlyAdded} />
        </section>

        {/* Settings List */}
        <section className="container mx-auto px-4 py-4 pb-24">
          <h2 className="text-xs uppercase font-semibold text-muted-foreground mb-3">Settings</h2>
          <div className="bg-card border border-border/40 rounded-2xl overflow-hidden">
            {settingsItems.map((item, index) => (
              <button
                key={item.label}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-secondary/50 transition-colors',
                  index !== settingsItems.length - 1 && 'border-b border-border/40'
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}

            {/* Sign Out */}
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
