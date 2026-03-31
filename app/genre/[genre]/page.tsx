'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Search, ChevronLeft } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { BottomNav } from '@/components/bottom-nav'
import { MovieCard } from '@/components/movie-card'
import { cn } from '@/lib/utils'

const GENRE_CONFIG: Record<string, { color: string; darkColor: string; emoji: string }> = {
  'sci-fi': { color: '#1a0d2e', darkColor: '#0e0e1a', emoji: '🚀' },
  'action': { color: '#2e0d0d', darkColor: '#1a0808', emoji: '⚡' },
  'drama': { color: '#0d1a2e', darkColor: '#080e1a', emoji: '🎭' },
  'thriller': { color: '#1a1a0d', darkColor: '#111108', emoji: '🔪' },
  'horror': { color: '#1a0d0d', darkColor: '#120808', emoji: '👻' },
  'comedy': { color: '#1a150d', darkColor: '#120f08', emoji: '😂' },
  'romance': { color: '#2e0d1a', darkColor: '#1a0810', emoji: '❤️' },
  'fantasy': { color: '#0d0d2e', darkColor: '#08081a', emoji: '✨' },
  'animation': { color: '#0d2e1a', darkColor: '#081a0e', emoji: '🎨' },
  'crime': { color: '#1a1a1a', darkColor: '#111111', emoji: '🕵️' },
  'mystery': { color: '#0d1a1a', darkColor: '#081212', emoji: '🔍' },
  'war': { color: '#1a150d', darkColor: '#120f08', emoji: '🎖️' },
  'documentary': { color: '#0d1a0d', darkColor: '#08120a', emoji: '📽️' },
  'adventure': { color: '#1a1a0d', darkColor: '#11110a', emoji: '🗺️' },
}

const GENRE_MOVIES = [
  { id: 1, title: 'Dune: Part Two', year: 2024, rating: 8.8, platform: 'hbo' as const, posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop&q=80' },
  { id: 2, title: 'Blade Runner 2049', year: 2017, rating: 8.0, platform: 'hbo' as const, posterUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop&q=80' },
  { id: 3, title: 'Arrival', year: 2016, rating: 7.9, platform: 'netflix' as const, posterUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop&q=80' },
  { id: 4, title: 'Interstellar', year: 2014, rating: 8.6, platform: 'hbo' as const, posterUrl: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=400&h=600&fit=crop&q=80' },
  { id: 5, title: 'The Martian', year: 2015, rating: 8.0, platform: 'netflix' as const, posterUrl: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=400&h=600&fit=crop&q=80' },
  { id: 6, title: 'Gravity', year: 2013, rating: 7.7, platform: 'hbo' as const, posterUrl: 'https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?w=400&h=600&fit=crop&q=80' },
  { id: 7, title: 'Ex Machina', year: 2014, rating: 7.7, platform: 'netflix' as const, posterUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=600&fit=crop&q=80' },
  { id: 8, title: 'Annihilation', year: 2018, rating: 6.8, platform: 'netflix' as const, posterUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=600&fit=crop&q=80' },
  { id: 9, title: 'Tenet', year: 2020, rating: 7.3, platform: 'netflix' as const, posterUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop&q=80' },
  { id: 10, title: 'Stranger Things 5', year: 2025, rating: 8.7, platform: 'netflix' as const, posterUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop&q=80' },
  { id: 11, title: 'Black Mirror S7', year: 2025, rating: 7.9, platform: 'netflix' as const, posterUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=600&fit=crop&q=80' },
  { id: 12, title: 'Dune: Part One', year: 2021, rating: 8.0, platform: 'hbo' as const, posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop&q=80' },
]

export default function GenreBrowsePage() {
  const params = useParams()
  const genreSlug = (params.genre as string) || 'sci-fi'
  const genreConfig = GENRE_CONFIG[genreSlug] || { color: '#1a1a1a', darkColor: '#111111', emoji: '🎬' }

  const [platform, setPlatform] = useState<'all' | 'netflix' | 'hbo'>('all')
  const [sortBy, setSortBy] = useState<'top_rated' | 'newest' | 'a_z'>('top_rated')

  // Filter and sort movies
  let filtered = GENRE_MOVIES.filter((movie) => {
    if (platform !== 'all' && movie.platform !== platform) return false
    return true
  })

  if (sortBy === 'top_rated') {
    filtered.sort((a, b) => b.rating - a.rating)
  } else if (sortBy === 'newest') {
    filtered.sort((a, b) => b.year - a.year)
  } else if (sortBy === 'a_z') {
    filtered.sort((a, b) => a.title.localeCompare(b.title))
  }

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
      <Navbar />

      <main>
        {/* Back Link */}
        <Link href="/profile" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mt-4 ml-4">
          <ChevronLeft className="w-4 h-4" />
          <span className="text-xs font-medium">Back to Profile</span>
        </Link>

        {/* Hero Banner */}
        <div
          className="w-full h-44 md:h-56 relative flex flex-col items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${genreConfig.color}, ${genreConfig.darkColor})` }}
        >
          <div className="text-5xl mb-2">{genreConfig.emoji}</div>
          <h1 className="text-3xl font-black text-foreground/90 capitalize text-center">{genreSlug}</h1>
          <p className="text-sm text-muted-foreground mt-2">Browse {genreSlug} on Netflix & HBO Max · Thailand</p>

          {/* Result Count Badge */}
          <div className="absolute bottom-4 left-4 bg-background/60 backdrop-blur text-xs text-foreground rounded-full px-3 py-1">
            {filtered.length} titles
          </div>
        </div>

        {/* Controls Row */}
        <div className="container mx-auto px-4 py-4 flex flex-wrap gap-3 items-center justify-between">
          {/* Platform Toggle */}
          <div className="flex gap-2">
            {(['all', 'netflix', 'hbo'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={cn(
                  'px-3 py-1.5 text-xs font-semibold rounded-full transition-colors',
                  platform === p
                    ? p === 'netflix'
                      ? 'bg-netflix text-white'
                      : p === 'hbo'
                      ? 'bg-hbo text-white'
                      : 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground border border-border/40 hover:text-foreground'
                )}
              >
                {p === 'all' ? 'All' : p === 'netflix' ? 'Netflix' : 'HBO Max'}
              </button>
            ))}
          </div>

          {/* Sort Buttons */}
          <div className="flex gap-2">
            {(['top_rated', 'newest', 'a_z'] as const).map((sort) => (
              <button
                key={sort}
                onClick={() => setSortBy(sort)}
                className={cn(
                  'px-3 py-1.5 text-xs font-semibold rounded-full transition-colors',
                  sortBy === sort
                    ? 'bg-secondary border border-primary text-primary'
                    : 'bg-secondary text-muted-foreground border border-border/40 hover:text-foreground'
                )}
              >
                {sort === 'top_rated' ? 'Top Rated' : sort === 'newest' ? 'Newest' : 'A-Z'}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div className="container mx-auto px-4 pb-24">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  year={movie.year}
                  rating={movie.rating}
                  platform={movie.platform}
                  posterUrl={movie.posterUrl}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24">
              <Search className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No titles found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your filters</p>
              <button
                onClick={() => {
                  setPlatform('all')
                  setSortBy('top_rated')
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
