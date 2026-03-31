'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Search, ChevronLeft } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { BottomNav } from '@/components/bottom-nav'
import { MovieCard } from '@/components/movie-card'
import { cn } from '@/lib/utils'
import type { MovieCardData } from '@/lib/tmdb'

const GENRE_CONFIG: Record<string, { color: string; darkColor: string; emoji: string }> = {
  'sci-fi':      { color: '#1a0d2e', darkColor: '#0e0e1a', emoji: '🚀' },
  'action':      { color: '#2e0d0d', darkColor: '#1a0808', emoji: '⚡' },
  'drama':       { color: '#0d1a2e', darkColor: '#080e1a', emoji: '🎭' },
  'thriller':    { color: '#1a1a0d', darkColor: '#111108', emoji: '🔪' },
  'horror':      { color: '#1a0d0d', darkColor: '#120808', emoji: '👻' },
  'comedy':      { color: '#1a150d', darkColor: '#120f08', emoji: '😂' },
  'romance':     { color: '#2e0d1a', darkColor: '#1a0810', emoji: '❤️' },
  'fantasy':     { color: '#0d0d2e', darkColor: '#08081a', emoji: '✨' },
  'animation':   { color: '#0d2e1a', darkColor: '#081a0e', emoji: '🎨' },
  'crime':       { color: '#1a1a1a', darkColor: '#111111', emoji: '🕵️' },
  'mystery':     { color: '#0d1a1a', darkColor: '#081212', emoji: '🔍' },
  'war':         { color: '#1a150d', darkColor: '#120f08', emoji: '🎖️' },
  'documentary': { color: '#0d1a0d', darkColor: '#08120a', emoji: '📽️' },
  'adventure':   { color: '#1a1a0d', darkColor: '#11110a', emoji: '🗺️' },
}

export default function GenreBrowsePage() {
  const params = useParams()
  const genreSlug = (params.genre as string) || 'action'
  const genreConfig = GENRE_CONFIG[genreSlug] || { color: '#1a1a1a', darkColor: '#111111', emoji: '🎬' }

  const [platform, setPlatform] = useState<'all' | 'netflix' | 'hbo'>('all')
  const [sortBy, setSortBy] = useState<'top_rated' | 'newest' | 'a_z'>('top_rated')
  const [movies, setMovies] = useState<MovieCardData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/tmdb/discover?genre=${genreSlug}&platform=${platform}&sort=${sortBy}`)
      .then(r => r.json())
      .then(setMovies)
      .finally(() => setLoading(false))
  }, [genreSlug, platform, sortBy])

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
      <Navbar />

      <main>
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mt-4 ml-4">
          <ChevronLeft className="w-4 h-4" />
          <span className="text-xs font-medium">Back to Home</span>
        </Link>

        {/* Hero Banner */}
        <div
          className="w-full h-44 md:h-56 relative flex flex-col items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${genreConfig.color}, ${genreConfig.darkColor})` }}
        >
          <div className="text-5xl mb-2">{genreConfig.emoji}</div>
          <h1 className="text-3xl font-black text-foreground/90 capitalize text-center">{genreSlug}</h1>
          <p className="text-sm text-muted-foreground mt-2">Browse {genreSlug} on Netflix & HBO Max · Thailand</p>
          <div className="absolute bottom-4 left-4 bg-background/60 backdrop-blur text-xs text-foreground rounded-full px-3 py-1">
            {loading ? '...' : `${movies.length} titles`}
          </div>
        </div>

        {/* Controls */}
        <div className="container mx-auto px-4 py-4 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2">
            {(['all', 'netflix', 'hbo'] as const).map(p => (
              <button key={p} onClick={() => setPlatform(p)}
                className={cn('px-3 py-1.5 text-xs font-semibold rounded-full transition-colors',
                  platform === p
                    ? p === 'netflix' ? 'bg-netflix text-white' : p === 'hbo' ? 'bg-hbo text-white' : 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground border border-border/40 hover:text-foreground'
                )}>
                {p === 'all' ? 'All' : p === 'netflix' ? 'Netflix' : 'HBO Max'}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {(['top_rated', 'newest', 'a_z'] as const).map(sort => (
              <button key={sort} onClick={() => setSortBy(sort)}
                className={cn('px-3 py-1.5 text-xs font-semibold rounded-full transition-colors',
                  sortBy === sort ? 'bg-secondary border border-primary text-primary' : 'bg-secondary text-muted-foreground border border-border/40 hover:text-foreground'
                )}>
                {sort === 'top_rated' ? 'Top Rated' : sort === 'newest' ? 'Newest' : 'A-Z'}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="container mx-auto px-4 pb-24">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-secondary rounded-lg animate-pulse" />
              ))}
            </div>
          ) : movies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movies.map(movie => (
                <MovieCard key={movie.id} id={movie.id} title={movie.title} year={movie.year} rating={movie.rating} platform={movie.platform} posterUrl={movie.posterUrl} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24">
              <Search className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No titles found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your filters</p>
              <button onClick={() => { setPlatform('all'); setSortBy('top_rated') }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
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
