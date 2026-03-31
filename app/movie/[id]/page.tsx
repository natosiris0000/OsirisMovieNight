'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, Heart, Share2, ChevronLeft, Bookmark } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { BottomNav } from '@/components/bottom-nav'
import { MovieRow } from '@/components/movie-row'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const MOCK_MOVIE = {
  id: 1,
  title: 'Dune: Part Two',
  year: 2024,
  rating: 8.8,
  platform: 'hbo' as const,
  runtime: '2h 46m',
  genres: ['Sci-Fi', 'Adventure', 'Drama'],
  country: 'USA',
  type: 'movie',
  language: 'English',
  synopsis:
    "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.",
  posterUrl:
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop&q=80',
  backdropUrl:
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&h=500&fit=crop&q=80',
  cast: [
    {
      name: 'Timothée Chalamet',
      role: 'Paul Atreides',
      avatarUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80',
    },
    {
      name: 'Zendaya',
      role: 'Chani',
      avatarUrl:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&q=80',
    },
    {
      name: 'Rebecca Ferguson',
      role: 'Lady Jessica',
      avatarUrl:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80',
    },
    {
      name: 'Austin Butler',
      role: 'Feyd-Rautha',
      avatarUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80',
    },
    {
      name: 'Florence Pugh',
      role: 'Princess Irulan',
      avatarUrl:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&q=80',
    },
    {
      name: 'Josh Brolin',
      role: 'Gurney Halleck',
      avatarUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80',
    },
    {
      name: 'Dave Bautista',
      role: 'Glossu Rabban',
      avatarUrl:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&q=80',
    },
    {
      name: 'Christopher Walken',
      role: 'Emperor Shaddam IV',
      avatarUrl:
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&q=80',
    },
  ],
  similar: [
    {
      id: 2,
      title: 'Blade Runner 2049',
      year: 2017,
      rating: 8.0,
      platform: 'hbo' as const,
      posterUrl:
        'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop&q=80',
    },
    {
      id: 3,
      title: 'Arrival',
      year: 2016,
      rating: 7.9,
      platform: 'netflix' as const,
      posterUrl:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop&q=80',
    },
    {
      id: 4,
      title: 'Interstellar',
      year: 2014,
      rating: 8.6,
      platform: 'hbo' as const,
      posterUrl:
        'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop&q=80',
    },
    {
      id: 5,
      title: 'The Martian',
      year: 2015,
      rating: 8.0,
      platform: 'netflix' as const,
      posterUrl:
        'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=400&h=600&fit=crop&q=80',
    },
    {
      id: 6,
      title: 'Dune: Part One',
      year: 2021,
      rating: 8.0,
      platform: 'hbo' as const,
      posterUrl:
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop&q=80',
    },
    {
      id: 7,
      title: 'Ex Machina',
      year: 2014,
      rating: 7.7,
      platform: 'netflix' as const,
      posterUrl:
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=600&fit=crop&q=80',
    },
  ],
}

export default function MovieDetailPage() {
  const [isSaved, setIsSaved] = useState(false)
  const [isWantToWatch, setIsWantToWatch] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)

  const filledStars = Math.floor(MOCK_MOVIE.rating / 2)
  const hasHalfStar = MOCK_MOVIE.rating % 2 !== 0

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative h-64 md:h-96 overflow-hidden">
          {/* Back Button — positioned inside hero, top-left */}
          <Link
            href="/"
            className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-background/70 backdrop-blur-sm text-foreground hover:text-primary transition-colors rounded-full px-3 py-1.5 text-sm font-medium border border-border/30"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Link>
          <Image
            src={MOCK_MOVIE.backdropUrl}
            alt={MOCK_MOVIE.title}
            fill
            className="object-cover"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />

          {/* Poster and Info */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-6">
            <div className="flex gap-4 items-end">
              {/* Poster Thumbnail */}
              <div className="flex-shrink-0">
                <Image
                  src={MOCK_MOVIE.posterUrl}
                  alt={MOCK_MOVIE.title}
                  width={112}
                  height={168}
                  className="rounded-lg shadow-lg object-cover"
                  crossOrigin="anonymous"
                />
              </div>

              {/* Info Block */}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {MOCK_MOVIE.title}
                </h1>

                {/* Meta Info */}
                <div className="text-xs text-muted-foreground mb-3 flex flex-wrap gap-1">
                  <span>{MOCK_MOVIE.year}</span>
                  <span>·</span>
                  <span>{MOCK_MOVIE.runtime}</span>
                  <span>·</span>
                  <span>{MOCK_MOVIE.country}</span>
                  <span>·</span>
                  <span>{MOCK_MOVIE.language}</span>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {MOCK_MOVIE.genres.map((genre) => (
                    <span
                      key={genre}
                      className="bg-secondary text-xs rounded-full px-2 py-0.5 text-muted-foreground"
                    >
                      {genre}
                    </span>
                  ))}
                </div>

                {/* Platform Badge and Rating */}
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'text-white text-xs font-bold px-3 py-1 rounded',
                      MOCK_MOVIE.platform === 'netflix'
                        ? 'bg-netflix'
                        : 'bg-hbo'
                    )}
                  >
                    {MOCK_MOVIE.platform === 'netflix'
                      ? 'Netflix'
                      : 'HBO Max'}
                  </span>
                  <div className="flex items-center gap-1 text-lg font-bold text-primary">
                    <Star className="w-5 h-5 fill-primary" />
                    {MOCK_MOVIE.rating} / 10
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
            <Heart
              className={cn(
                'w-5 h-5',
                isSaved ? 'fill-netflix text-netflix' : 'text-muted-foreground'
              )}
            />
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
            <Bookmark
              className={cn(
                'w-5 h-5',
                isWantToWatch ? 'fill-primary text-primary' : 'text-muted-foreground'
              )}
            />
            <span className={cn('text-[9px] font-semibold uppercase tracking-wide', isWantToWatch ? 'text-primary' : 'text-muted-foreground')}>
              {isWantToWatch ? 'Listed' : 'Watchlist'}
            </span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1 w-16 h-14 border border-border rounded-xl hover:bg-secondary/50 transition-colors">
            <Share2 className="w-5 h-5 text-muted-foreground" />
            <span className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">Share</span>
          </button>
        </section>

        {/* User Rating Section */}
        <section className="px-4 py-3 border-t border-border/20">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-semibold text-muted-foreground">Your Rating</span>
            {userRating > 0 && (
              <button
                onClick={() => setUserRating(0)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
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
                <Star
                  className={cn(
                    "w-7 h-7 transition-colors",
                    star <= (hoveredRating || userRating)
                      ? "fill-primary text-primary"
                      : "text-muted-foreground/40"
                  )}
                />
              </button>
            ))}
            {userRating > 0 && (
              <span className="ml-2 text-sm font-semibold text-primary">
                {["", "Poor", "Fair", "Good", "Great", "Must Watch"][userRating]}
              </span>
            )}
            {userRating === 0 && (
              <span className="ml-2 text-xs text-muted-foreground">Tap to rate</span>
            )}
          </div>
        </section>

        {/* Synopsis Section */}
        <section className="px-4 py-2">
          <div className="text-xs uppercase font-semibold text-muted-foreground mb-2">
            Synopsis
          </div>
          <p
            className={cn(
              'text-sm text-foreground/90 leading-relaxed',
              !isExpanded && 'line-clamp-3'
            )}
          >
            {MOCK_MOVIE.synopsis}
          </p>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-primary hover:text-primary/80 font-semibold mt-2"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        </section>

        {/* Details Grid */}
        <section className="px-4 py-4">
          <div className="text-xs uppercase font-semibold text-muted-foreground mb-3">
            Details
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground">Type</div>
              <div className="text-sm text-foreground font-medium capitalize">
                {MOCK_MOVIE.type}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Genre</div>
              <div className="text-sm text-foreground font-medium">
                {MOCK_MOVIE.genres[0]}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Country</div>
              <div className="text-sm text-foreground font-medium">
                {MOCK_MOVIE.country}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Language</div>
              <div className="text-sm text-foreground font-medium">
                {MOCK_MOVIE.language}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Runtime</div>
              <div className="text-sm text-foreground font-medium">
                {MOCK_MOVIE.runtime}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Year</div>
              <div className="text-sm text-foreground font-medium">
                {MOCK_MOVIE.year}
              </div>
            </div>
          </div>
        </section>

        {/* Cast Section */}
        <section className="py-4">
          <div className="px-4 text-xs uppercase font-semibold text-muted-foreground mb-3">
            Cast
          </div>
          <div className="overflow-x-auto scrollbar-hide px-4 flex gap-4">
            {MOCK_MOVIE.cast.map((actor) => {
              const initials = actor.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
              return (
                <div key={actor.name} className="flex-none w-16">
                  <div className="w-14 h-14 rounded-full bg-secondary border-2 border-primary/30 flex items-center justify-center mx-auto mb-1">
                    <span className="text-sm font-bold text-primary">{initials}</span>
                  </div>
                  <p className="text-xs text-foreground text-center truncate">
                    {actor.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground text-center truncate">
                    {actor.role}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Where to Watch Section */}
        <section className="px-4 py-4">
          <div className="text-xs uppercase font-semibold text-muted-foreground mb-3">
            Where to Watch in Thailand
          </div>
          <div className="bg-card border border-border/40 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div
                className={cn(
                  'font-bold text-lg',
                  MOCK_MOVIE.platform === 'netflix'
                    ? 'text-netflix'
                    : 'text-hbo'
                )}
              >
                {MOCK_MOVIE.platform === 'netflix' ? 'Netflix' : 'HBO Max'}
              </div>
              <div className="text-xs text-muted-foreground">
                Available in Thailand
              </div>
            </div>
          </div>
        </section>

        {/* More Like This Section */}
        <section className="py-4">
          <MovieRow
            title="More Like This"
            movies={MOCK_MOVIE.similar}
          />
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
