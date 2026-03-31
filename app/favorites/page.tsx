'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bookmark, Play, CheckCircle, Heart } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { BottomNav } from '@/components/bottom-nav'
import { MovieCard } from '@/components/movie-card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const SAVED_MOVIES = [
  { id: 1, title: 'Dune: Part Two', year: 2024, rating: 8.8, platform: 'hbo' as const, posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop&q=80', status: 'watching' as const, favorited: true },
  { id: 2, title: 'Squid Game S2', year: 2024, rating: 8.1, platform: 'netflix' as const, posterUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=600&fit=crop&q=80', status: 'want' as const, favorited: false },
  { id: 3, title: 'Succession', year: 2023, rating: 9.3, platform: 'hbo' as const, posterUrl: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400&h=600&fit=crop&q=80', status: 'watched' as const, favorited: true },
  { id: 4, title: 'Wednesday', year: 2022, rating: 8.1, platform: 'netflix' as const, posterUrl: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&h=600&fit=crop&q=80', status: 'watched' as const, favorited: false },
  { id: 5, title: 'The White Lotus S3', year: 2025, rating: 8.6, platform: 'hbo' as const, posterUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=600&fit=crop&q=80', status: 'want' as const, favorited: true },
  { id: 6, title: 'Stranger Things 5', year: 2025, rating: 8.7, platform: 'netflix' as const, posterUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop&q=80', status: 'want' as const, favorited: false },
  { id: 7, title: 'Barry S4', year: 2023, rating: 9.0, platform: 'hbo' as const, posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop&q=80', status: 'watched' as const, favorited: true },
  { id: 8, title: 'Oppenheimer', year: 2023, rating: 8.5, platform: 'netflix' as const, posterUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop&q=80', status: 'watched' as const, favorited: true },
  { id: 9, title: 'True Detective: Night Country', year: 2024, rating: 7.8, platform: 'hbo' as const, posterUrl: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=400&h=600&fit=crop&q=80', status: 'watching' as const, favorited: false },
  { id: 10, title: 'Beef', year: 2023, rating: 8.3, platform: 'netflix' as const, posterUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop&q=80', status: 'watched' as const, favorited: false },
  { id: 11, title: 'House of the Dragon S2', year: 2024, rating: 8.4, platform: 'hbo' as const, posterUrl: 'https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?w=400&h=600&fit=crop&q=80', status: 'want' as const, favorited: true },
  { id: 12, title: 'Black Mirror S7', year: 2025, rating: 7.9, platform: 'netflix' as const, posterUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=600&fit=crop&q=80', status: 'watching' as const, favorited: false },
]

type TabType = 'all' | 'favorites' | 'want' | 'watching' | 'watched'
type PlatformFilter = 'all' | 'netflix' | 'hbo'
type SortType = 'recent' | 'rated' | 'alpha'

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>('all')
  const [sortBy, setSortBy] = useState<SortType>('recent')
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)

  const cycleStatus = (movieId: number, currentStatus: string) => {
    // In real app this would update Firestore — for now just close menu
    setOpenMenuId(null)
  }

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null)
    if (openMenuId !== null) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [openMenuId])

  // Filter by tab and platform
  let filtered = SAVED_MOVIES.filter((movie) => {
    if (activeTab === 'favorites' && !movie.favorited) return false
    if (activeTab !== 'all' && activeTab !== 'favorites' && movie.status !== activeTab) return false
    if (platformFilter !== 'all' && movie.platform !== platformFilter) return false
    return true
  })

  // Sort
  if (sortBy === 'rated') {
    filtered.sort((a, b) => b.rating - a.rating)
  } else if (sortBy === 'alpha') {
    filtered.sort((a, b) => a.title.localeCompare(b.title))
  }

  // Counts
  const favoritesCount = SAVED_MOVIES.filter((m) => m.favorited).length
  const wantCount = SAVED_MOVIES.filter((m) => m.status === 'want').length
  const watchingCount = SAVED_MOVIES.filter((m) => m.status === 'watching').length
  const watchedCount = SAVED_MOVIES.filter((m) => m.status === 'watched').length

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'want':
        return {
          bg: 'bg-blue-500/80',
          text: 'text-white',
          label: 'Want to Watch',
        }
      case 'watching':
        return {
          bg: 'bg-primary/80',
          text: 'text-primary-foreground',
          label: 'Watching',
        }
      case 'watched':
        return {
          bg: 'bg-green-600/80',
          text: 'text-white',
          label: '✓ Watched',
        }
      default:
        return { bg: '', text: '', label: '' }
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
      <Navbar />

      <main>
        {/* Page Header */}
        <div className="container mx-auto px-4 pt-6 pb-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">My Library</h1>
            <div className="inline-flex bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
              {SAVED_MOVIES.length}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Your personal streaming collection</p>
        </div>

        {/* Stats Row */}
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-4 gap-3">
            {/* Favorites */}
            <div className="bg-card border border-border/40 rounded-xl p-3 flex flex-col items-center gap-1">
              <Heart className="w-5 h-5 text-netflix" />
              <div className="text-2xl font-bold text-foreground">{favoritesCount}</div>
              <div className="text-[10px] text-muted-foreground uppercase font-semibold">Favorites</div>
            </div>

            {/* Want to Watch */}
            <div className="bg-card border border-border/40 rounded-xl p-3 flex flex-col items-center gap-1">
              <Bookmark className="w-5 h-5 text-blue-400" />
              <div className="text-2xl font-bold text-foreground">{wantCount}</div>
              <div className="text-[10px] text-muted-foreground uppercase font-semibold">Want</div>
            </div>

            {/* Watching */}
            <div className="bg-card border border-border/40 rounded-xl p-3 flex flex-col items-center gap-1">
              <Play className="w-5 h-5 text-primary" />
              <div className="text-2xl font-bold text-foreground">{watchingCount}</div>
              <div className="text-[10px] text-muted-foreground uppercase font-semibold">Watching</div>
            </div>

            {/* Watched */}
            <div className="bg-card border border-border/40 rounded-xl p-3 flex flex-col items-center gap-1">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div className="text-2xl font-bold text-foreground">{watchedCount}</div>
              <div className="text-[10px] text-muted-foreground uppercase font-semibold">Watched</div>
            </div>
          </div>
        </div>

        {/* Filter Row */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Tab Buttons */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1">
              {(['all', 'favorites', 'want', 'watching', 'watched'] as const).map((tab) => {
                const labels: Record<TabType, string> = {
                  all: 'All',
                  favorites: 'Favorites',
                  want: 'Want to Watch',
                  watching: 'Watching',
                  watched: 'Watched',
                }
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'text-sm pb-1 whitespace-nowrap transition-colors',
                      activeTab === tab
                        ? 'border-b-2 border-primary text-primary font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {labels[tab]}
                  </button>
                )
              })}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="bg-secondary border border-border/50 text-xs rounded-lg px-2 py-1 text-foreground"
            >
              <option value="recent">Recently Added</option>
              <option value="rated">Top Rated</option>
              <option value="alpha">A-Z</option>
            </select>
          </div>

          {/* Platform Toggle */}
          <div className="flex gap-2 mt-3">
            {(['all', 'netflix', 'hbo'] as const).map((platform) => {
              const labels: Record<PlatformFilter, string> = {
                all: 'All',
                netflix: 'N',
                hbo: 'HBO',
              }
              const bgColor =
                platform === 'netflix'
                  ? 'bg-netflix/20 text-netflix'
                  : platform === 'hbo'
                  ? 'bg-hbo/20 text-hbo'
                  : 'bg-secondary text-foreground'

              return (
                <button
                  key={platform}
                  onClick={() => setPlatformFilter(platform)}
                  className={cn(
                    'text-[10px] px-2 py-0.5 rounded-full transition-all border',
                    platformFilter === platform
                      ? `${bgColor} border-current`
                      : `${bgColor} border-border/20`
                  )}
                >
                  {labels[platform]}
                </button>
              )
            })}
          </div>
        </div>

        {/* Movies Grid */}
        {filtered.length > 0 ? (
          <div className="container mx-auto px-4 pb-24">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map((movie) => {
                const badge = getStatusBadge(movie.status)
                return (
                  <div key={movie.id} className="relative group">
                    <MovieCard
                      id={movie.id}
                      title={movie.title}
                      year={movie.year}
                      rating={movie.rating}
                      platform={movie.platform}
                      posterUrl={movie.posterUrl}
                    />

                    {/* Status badge — bottom right */}
                    <div
                      className={cn(
                        'absolute bottom-[72px] right-2 text-[9px] px-1.5 py-0.5 rounded font-semibold z-10',
                        badge.bg,
                        badge.text
                      )}
                    >
                      {badge.label}
                    </div>

                    {/* Quick action menu button — top left, visible on hover */}
                    <div className="absolute top-2 left-2 z-20">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          setOpenMenuId(openMenuId === movie.id ? null : movie.id)
                        }}
                        className="w-6 h-6 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-background/90 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <span className="text-xs font-bold leading-none">···</span>
                      </button>

                      {/* Dropdown menu */}
                      {openMenuId === movie.id && (
                        <div className="absolute top-7 left-0 bg-card border border-border/60 rounded-xl shadow-xl overflow-hidden z-30 min-w-[140px]">
                          {movie.status !== 'want' && (
                            <button
                              onClick={() => cycleStatus(movie.id, movie.status)}
                              className="w-full text-left px-3 py-2.5 text-xs text-foreground hover:bg-secondary transition-colors flex items-center gap-2"
                            >
                              <span>🔖</span> Want to Watch
                            </button>
                          )}
                          {movie.status !== 'watching' && (
                            <button
                              onClick={() => cycleStatus(movie.id, movie.status)}
                              className="w-full text-left px-3 py-2.5 text-xs text-foreground hover:bg-secondary transition-colors flex items-center gap-2 border-t border-border/40"
                            >
                              <span>▶️</span> Now Watching
                            </button>
                          )}
                          {movie.status !== 'watched' && (
                            <button
                              onClick={() => cycleStatus(movie.id, movie.status)}
                              className="w-full text-left px-3 py-2.5 text-xs text-foreground hover:bg-secondary transition-colors flex items-center gap-2 border-t border-border/40"
                            >
                              <span>✅</span> Mark Watched
                            </button>
                          )}
                          <button
                            onClick={() => setOpenMenuId(null)}
                            className="w-full text-left px-3 py-2.5 text-xs text-destructive hover:bg-secondary transition-colors flex items-center gap-2 border-t border-border/40"
                          >
                            <span>🗑️</span> Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-20 text-center">
            <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Nothing here yet</h2>
            <p className="text-sm text-muted-foreground mb-6">Start saving movies to build your collection</p>
            <Link href="/">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                Browse Movies
              </Button>
            </Link>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
