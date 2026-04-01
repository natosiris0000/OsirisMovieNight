'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bookmark, Play, CheckCircle, Heart, Library } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { BottomNav } from '@/components/bottom-nav'
import { MovieCard } from '@/components/movie-card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useLibrary } from '@/hooks/useLibrary'
import { removeFromLibrary, updateStatus, toggleFavorite, type LibraryItem } from '@/lib/library'

type TabType = 'all' | 'favorites' | 'want' | 'watching' | 'watched'
type PlatformFilter = 'all' | 'netflix' | 'hbo'
type SortType = 'recent' | 'rated' | 'alpha'

export default function FavoritesPage() {
  const library = useLibrary()
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>('all')
  const [sortBy, setSortBy] = useState<SortType>('recent')
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)

  const favoritesCount = library.filter(m => m.favorited).length
  const wantCount = library.filter(m => m.status === 'want').length
  const watchingCount = library.filter(m => m.status === 'watching').length
  const watchedCount = library.filter(m => m.status === 'watched').length

  let filtered = library.filter(movie => {
    if (activeTab === 'favorites' && !movie.favorited) return false
    if (activeTab !== 'all' && activeTab !== 'favorites' && movie.status !== activeTab) return false
    if (platformFilter !== 'all' && movie.platform !== platformFilter) return false
    return true
  })

  if (sortBy === 'rated') filtered = [...filtered].sort((a, b) => b.rating - a.rating)
  else if (sortBy === 'alpha') filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title))
  else filtered = [...filtered].sort((a, b) => b.addedAt - a.addedAt)

  const getStatusBadge = (status: LibraryItem['status']) => {
    switch (status) {
      case 'want': return { bg: 'bg-blue-500/80', text: 'text-white', label: 'Want to Watch' }
      case 'watching': return { bg: 'bg-primary/80', text: 'text-primary-foreground', label: 'Watching' }
      case 'watched': return { bg: 'bg-green-600/80', text: 'text-white', label: '✓ Watched' }
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
      <Navbar />

      <main>
        {/* Header */}
        <div className="container mx-auto px-4 pt-6 pb-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">My Library</h1>
            <div className="inline-flex bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
              {library.length}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Your personal streaming collection</p>
        </div>

        {/* Stats */}
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-card border border-border/40 rounded-xl p-3 flex flex-col items-center gap-1">
              <Heart className="w-5 h-5 text-netflix" />
              <div className="text-2xl font-bold text-foreground">{favoritesCount}</div>
              <div className="text-[10px] text-muted-foreground uppercase font-semibold">Favorites</div>
            </div>
            <div className="bg-card border border-border/40 rounded-xl p-3 flex flex-col items-center gap-1">
              <Bookmark className="w-5 h-5 text-blue-400" />
              <div className="text-2xl font-bold text-foreground">{wantCount}</div>
              <div className="text-[10px] text-muted-foreground uppercase font-semibold">Want</div>
            </div>
            <div className="bg-card border border-border/40 rounded-xl p-3 flex flex-col items-center gap-1">
              <Play className="w-5 h-5 text-primary" />
              <div className="text-2xl font-bold text-foreground">{watchingCount}</div>
              <div className="text-[10px] text-muted-foreground uppercase font-semibold">Watching</div>
            </div>
            <div className="bg-card border border-border/40 rounded-xl p-3 flex flex-col items-center gap-1">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div className="text-2xl font-bold text-foreground">{watchedCount}</div>
              <div className="text-[10px] text-muted-foreground uppercase font-semibold">Watched</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1">
              {(['all', 'favorites', 'want', 'watching', 'watched'] as const).map(tab => {
                const labels: Record<TabType, string> = { all: 'All', favorites: 'Favorites', want: 'Want to Watch', watching: 'Watching', watched: 'Watched' }
                return (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={cn('text-sm pb-1 whitespace-nowrap transition-colors',
                      activeTab === tab ? 'border-b-2 border-primary text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'
                    )}>
                    {labels[tab]}
                  </button>
                )
              })}
            </div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as SortType)}
              className="bg-secondary border border-border/50 text-xs rounded-lg px-2 py-1 text-foreground">
              <option value="recent">Recently Added</option>
              <option value="rated">Top Rated</option>
              <option value="alpha">A-Z</option>
            </select>
          </div>

          <div className="flex gap-2 mt-3">
            {(['all', 'netflix', 'hbo'] as const).map(platform => (
              <button key={platform} onClick={() => setPlatformFilter(platform)}
                className={cn('text-[10px] px-2 py-0.5 rounded-full transition-all border',
                  platformFilter === platform
                    ? platform === 'netflix' ? 'bg-netflix/20 text-netflix border-netflix'
                    : platform === 'hbo' ? 'bg-hbo/20 text-hbo border-hbo'
                    : 'bg-secondary text-foreground border-primary'
                    : 'bg-secondary text-muted-foreground border-border/20'
                )}>
                {platform === 'all' ? 'All' : platform === 'netflix' ? 'N' : 'HBO'}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="container mx-auto px-4 pb-24">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map(movie => {
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
                      mediaType={movie.mediaType}
                    />

                    {/* Status badge */}
                    <div className={cn('absolute bottom-[72px] right-2 text-[9px] px-1.5 py-0.5 rounded font-semibold z-10', badge.bg, badge.text)}>
                      {badge.label}
                    </div>

                    {/* Quick action menu */}
                    <div className="absolute top-2 left-2 z-20">
                      <button
                        onClick={e => { e.preventDefault(); setOpenMenuId(openMenuId === movie.id ? null : movie.id) }}
                        className="w-6 h-6 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-background/90 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <span className="text-xs font-bold leading-none">···</span>
                      </button>

                      {openMenuId === movie.id && (
                        <div className="absolute top-7 left-0 bg-card border border-border/60 rounded-xl shadow-xl overflow-hidden z-30 min-w-[140px]">
                          {movie.status !== 'want' && (
                            <button onClick={() => { updateStatus(movie.id, 'want'); setOpenMenuId(null) }}
                              className="w-full text-left px-3 py-2.5 text-xs text-foreground hover:bg-secondary transition-colors flex items-center gap-2">
                              🔖 Want to Watch
                            </button>
                          )}
                          {movie.status !== 'watching' && (
                            <button onClick={() => { updateStatus(movie.id, 'watching'); setOpenMenuId(null) }}
                              className="w-full text-left px-3 py-2.5 text-xs text-foreground hover:bg-secondary transition-colors flex items-center gap-2 border-t border-border/40">
                              ▶️ Now Watching
                            </button>
                          )}
                          {movie.status !== 'watched' && (
                            <button onClick={() => { updateStatus(movie.id, 'watched'); setOpenMenuId(null) }}
                              className="w-full text-left px-3 py-2.5 text-xs text-foreground hover:bg-secondary transition-colors flex items-center gap-2 border-t border-border/40">
                              ✅ Mark Watched
                            </button>
                          )}
                          <button onClick={() => { toggleFavorite(movie.id); setOpenMenuId(null) }}
                            className="w-full text-left px-3 py-2.5 text-xs text-foreground hover:bg-secondary transition-colors flex items-center gap-2 border-t border-border/40">
                            {movie.favorited ? '🤍 Unfavorite' : '❤️ Favorite'}
                          </button>
                          <button onClick={() => { removeFromLibrary(movie.id); setOpenMenuId(null) }}
                            className="w-full text-left px-3 py-2.5 text-xs text-destructive hover:bg-secondary transition-colors flex items-center gap-2 border-t border-border/40">
                            🗑️ Remove
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
            <Library className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">
              {library.length === 0 ? 'Nothing here yet' : 'No matches'}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {library.length === 0
                ? 'Tap the bookmark icon on any movie or series to save it here'
                : 'Try a different filter'}
            </p>
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
