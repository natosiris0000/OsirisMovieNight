'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Star, Heart, Play, ChevronLeft, Bookmark } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { BottomNav } from '@/components/bottom-nav'
import { MovieRow } from '@/components/movie-row'
import { cn } from '@/lib/utils'

interface TVDetail {
  id: number
  title: string
  year: number
  rating: number
  platform?: 'netflix' | 'hbo'
  runtime: string
  genres: string[]
  country: string
  language: string
  synopsis: string
  synopsisTh: string
  posterUrl: string | null
  backdropUrl: string | null
  cast: { name: string; role: string; avatarUrl: string | null }[]
  similar: { id: number; title: string; year: number; rating: number; platform?: 'netflix' | 'hbo'; posterUrl: string; mediaType?: 'movie' | 'tv' }[]
  trailerUrl: string | null
}

export default function TVDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [show, setShow] = useState<TVDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const [isWantToWatch, setIsWantToWatch] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [synopsisLang, setSynopsisLang] = useState<'en' | 'th'>('en')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setIsExpanded(false)
    setUserRating(0)
    setSynopsisLang('en')
    fetch(`/api/tmdb/tv/${id}`)
      .then(r => r.json())
      .then(data => { if (!data.error) setShow(data) })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20 sm:pb-0">
        <Navbar />
        <div className="h-64 md:h-96 bg-secondary animate-pulse" />
        <div className="container mx-auto px-4 py-6 space-y-4">
          <div className="h-8 w-3/4 bg-secondary rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-secondary rounded animate-pulse" />
          <div className="h-24 bg-secondary rounded animate-pulse" />
        </div>
        <BottomNav />
      </div>
    )
  }

  if (!show) {
    return (
      <div className="min-h-screen bg-background pb-20 sm:pb-0 flex items-center justify-center">
        <Navbar />
        <p className="text-muted-foreground">Series not found.</p>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative h-64 md:h-96 overflow-hidden">
          <Link
            href="/"
            className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-background/70 backdrop-blur-sm text-foreground hover:text-primary transition-colors rounded-full px-3 py-1.5 text-sm font-medium border border-border/30"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Link>
          {show.backdropUrl ? (
            <Image
              src={show.backdropUrl}
              alt={show.title}
              fill
              className="object-cover object-top"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-full h-full bg-secondary" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 px-4 pb-6">
            <div className="flex gap-4 items-end">
              {show.posterUrl && (
                <div className="flex-shrink-0">
                  <Image
                    src={show.posterUrl}
                    alt={show.title ?? 'Series poster'}
                    width={112}
                    height={168}
                    className="rounded-lg shadow-lg object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{show.title}</h1>
                <div className="text-xs text-muted-foreground mb-3 flex flex-wrap gap-1">
                  <span>{show.year}</span>
                  <span>·</span>
                  <span>{show.runtime}</span>
                  <span>·</span>
                  <span>{show.country}</span>
                  <span>·</span>
                  <span>{show.language}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(show.genres ?? []).map((genre) => (
                    <span key={genre} className="bg-secondary text-xs rounded-full px-2 py-0.5 text-muted-foreground">
                      {genre}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  {show.platform && (
                    <span className={cn('text-white text-xs font-bold px-3 py-1 rounded', show.platform === 'netflix' ? 'bg-netflix' : 'bg-hbo')}>
                      {show.platform === 'netflix' ? 'Netflix' : 'HBO Max'}
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-lg font-bold text-primary">
                    <Star className="w-5 h-5 fill-primary" />
                    {show.rating} / 10
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="px-4 py-4 flex gap-3">
          <button
            onClick={() => setIsSaved(!isSaved)}
            title="Add to Favorites"
            className={cn(
              'flex flex-col items-center justify-center gap-1 w-16 h-14 border rounded-xl transition-colors',
              isSaved ? 'border-netflix/60 bg-netflix/10' : 'border-border hover:bg-secondary/50'
            )}
          >
            <Heart className={cn('w-5 h-5', isSaved ? 'fill-netflix text-netflix' : 'text-muted-foreground')} />
            <span className={cn('text-[9px] font-semibold uppercase tracking-wide', isSaved ? 'text-netflix' : 'text-muted-foreground')}>
              {isSaved ? 'Saved' : 'Favorite'}
            </span>
          </button>
          <button
            onClick={() => setIsWantToWatch(!isWantToWatch)}
            title="Want to Watch"
            className={cn(
              'flex flex-col items-center justify-center gap-1 w-16 h-14 border rounded-xl transition-colors',
              isWantToWatch ? 'border-primary/60 bg-primary/10' : 'border-border hover:bg-secondary/50'
            )}
          >
            <Bookmark className={cn('w-5 h-5', isWantToWatch ? 'fill-primary text-primary' : 'text-muted-foreground')} />
            <span className={cn('text-[9px] font-semibold uppercase tracking-wide', isWantToWatch ? 'text-primary' : 'text-muted-foreground')}>
              {isWantToWatch ? 'Listed' : 'Watchlist'}
            </span>
          </button>
          {show.trailerUrl ? (
            <a
              href={show.trailerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-1 w-16 h-14 border border-primary/60 bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors"
            >
              <Play className="w-5 h-5 text-primary fill-primary" />
              <span className="text-[9px] font-semibold uppercase tracking-wide text-primary">Trailer</span>
            </a>
          ) : (
            <button disabled className="flex flex-col items-center justify-center gap-1 w-16 h-14 border border-border rounded-xl opacity-40 cursor-not-allowed">
              <Play className="w-5 h-5 text-muted-foreground" />
              <span className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">Trailer</span>
            </button>
          )}
        </section>

        {/* User Rating */}
        <section className="px-4 py-3 border-t border-border/20">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-semibold text-muted-foreground">Your Rating</span>
            {userRating > 0 && (
              <button onClick={() => setUserRating(0)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Clear
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setUserRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star className={cn('w-7 h-7 transition-colors', star <= (hoveredRating || userRating) ? 'fill-primary text-primary' : 'text-muted-foreground/40')} />
              </button>
            ))}
            {userRating > 0 && (
              <span className="ml-2 text-sm font-semibold text-primary">
                {["", "Poor", "Fair", "Good", "Great", "Must Watch"][userRating]}
              </span>
            )}
            {userRating === 0 && <span className="ml-2 text-xs text-muted-foreground">Tap to rate</span>}
          </div>
        </section>

        {/* Synopsis */}
        <section className="px-4 py-2">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs uppercase font-semibold text-muted-foreground">Synopsis</div>
            {show.synopsisTh && (
              <div className="flex items-center gap-1 bg-secondary rounded-full p-0.5">
                <button
                  onClick={() => setSynopsisLang('en')}
                  className={cn('text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors', synopsisLang === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}
                >
                  EN
                </button>
                <button
                  onClick={() => setSynopsisLang('th')}
                  className={cn('text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors', synopsisLang === 'th' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}
                >
                  TH
                </button>
              </div>
            )}
          </div>
          <p className={cn('text-sm text-foreground/90 leading-relaxed', !isExpanded && 'line-clamp-3')}>
            {synopsisLang === 'th' && show.synopsisTh ? show.synopsisTh : show.synopsis}
          </p>
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-xs text-primary hover:text-primary/80 font-semibold mt-2">
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        </section>

        {/* Details */}
        <section className="px-4 py-4">
          <div className="text-xs uppercase font-semibold text-muted-foreground mb-3">Details</div>
          <div className="grid grid-cols-2 gap-4">
            <div><div className="text-xs text-muted-foreground">Genre</div><div className="text-sm text-foreground font-medium">{show.genres?.[0] ?? '—'}</div></div>
            <div><div className="text-xs text-muted-foreground">Country</div><div className="text-sm text-foreground font-medium">{show.country}</div></div>
            <div><div className="text-xs text-muted-foreground">Language</div><div className="text-sm text-foreground font-medium">{show.language}</div></div>
            <div><div className="text-xs text-muted-foreground">Runtime</div><div className="text-sm text-foreground font-medium">{show.runtime}</div></div>
            <div><div className="text-xs text-muted-foreground">Year</div><div className="text-sm text-foreground font-medium">{show.year}</div></div>
            {show.platform && (
              <div>
                <div className="text-xs text-muted-foreground">Platform</div>
                <div className="text-sm text-foreground font-medium">{show.platform === 'netflix' ? 'Netflix' : 'HBO Max'}</div>
              </div>
            )}
          </div>
        </section>

        {/* Cast */}
        {(show.cast ?? []).length > 0 && (
          <section className="py-4">
            <div className="px-4 text-xs uppercase font-semibold text-muted-foreground mb-3">Cast</div>
            <div className="overflow-x-auto scrollbar-hide px-4 flex gap-4">
              {(show.cast ?? []).map((actor) => {
                const initials = actor.name.split(' ').map(n => n[0]).slice(0, 2).join('')
                return (
                  <div key={actor.name} className="flex-none w-16">
                    <div className="w-14 h-14 rounded-full bg-secondary border-2 border-primary/30 overflow-hidden flex items-center justify-center mx-auto mb-1">
                      {actor.avatarUrl ? (
                        <img src={actor.avatarUrl} alt={actor.name} className="w-full h-full object-cover" crossOrigin="anonymous" />
                      ) : (
                        <span className="text-sm font-bold text-primary">{initials}</span>
                      )}
                    </div>
                    <p className="text-xs text-foreground text-center truncate">{actor.name}</p>
                    <p className="text-[10px] text-muted-foreground text-center truncate">{actor.role}</p>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Where to Watch */}
        <section className="px-4 py-4">
          <div className="text-xs uppercase font-semibold text-muted-foreground mb-3">Where to Watch in Thailand</div>
          <div className="bg-card border border-border/40 rounded-xl p-4">
            {show.platform ? (
              <div>
                <div className={cn('font-bold text-lg', show.platform === 'netflix' ? 'text-netflix' : 'text-hbo')}>
                  {show.platform === 'netflix' ? 'Netflix' : 'HBO Max'}
                </div>
                <div className="text-xs text-muted-foreground">Available in Thailand</div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Not available on Netflix or HBO Max in Thailand</div>
            )}
          </div>
        </section>

        {/* More Like This */}
        {(show.similar ?? []).length > 0 && (
          <section className="py-4">
            <MovieRow title="More Like This" movies={show.similar} />
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
