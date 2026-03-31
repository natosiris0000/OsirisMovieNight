"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { BottomNav } from "@/components/bottom-nav"
import { MovieCard } from "@/components/movie-card"
import { MovieRow } from "@/components/movie-row"
import { PlatformFilter } from "@/components/platform-filter"
import type { MovieCardData } from "@/lib/tmdb"

interface HomeData {
  featured: {
    id: number
    title: string
    year: number
    rating: number
    platform: 'netflix' | 'hbo'
    backdropUrl: string
    overview: string
  } | null
  trending: MovieCardData[]
  netflixMovies: MovieCardData[]
  netflixSeries: MovieCardData[]
  hboMovies: MovieCardData[]
  hboSeries: MovieCardData[]
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<"all" | "netflix" | "hbo">("all")
  const [data, setData] = useState<HomeData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/tmdb/home')
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  const trending = data?.trending.filter(m => {
    if (activeFilter === "all") return true
    return m.platform === activeFilter
  }) ?? []

  const featured = data?.featured

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
      <Navbar />

      {/* Featured Hero */}
      <section className="relative h-56 md:h-72 overflow-hidden mb-0">
        {featured ? (
          <img
            src={featured.backdropUrl}
            alt={featured.title}
            className="w-full h-full object-cover object-top"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="w-full h-full bg-secondary animate-pulse" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 pb-5">
          {featured && (
            <div className="flex gap-4 items-end">
              {/* Poster thumbnail */}
              {featured.posterUrl && (
                <div className="flex-shrink-0 hidden sm:block">
                  <img
                    src={featured.posterUrl}
                    alt={featured.title}
                    crossOrigin="anonymous"
                    className="w-20 md:w-24 rounded-lg shadow-lg object-cover aspect-[2/3]"
                  />
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-white text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${featured.platform === 'netflix' ? 'bg-netflix' : 'bg-hbo'}`}>
                    {featured.platform === 'netflix' ? 'Netflix' : 'HBO Max'}
                  </span>
                  <span className="text-xs text-muted-foreground">Featured tonight</span>
                </div>
                <h1 className="text-xl md:text-3xl font-black text-foreground mb-1 leading-tight truncate">
                  {featured.title}
                </h1>
                <p className="text-xs text-muted-foreground mb-3">
                  {featured.year} · ★ {featured.rating}
                </p>
                <Link
                  href={`/movie/${featured.id}`}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Movie Detail
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <main className="container mx-auto px-4 pt-6">
        {/* Platform Filter */}
        <section className="flex justify-center mb-8">
          <PlatformFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        </section>

        {/* Browse by Genre */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Browse by Genre</h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
            {[
              { slug: "action", label: "⚡ Action" },
              { slug: "drama", label: "🎭 Drama" },
              { slug: "sci-fi", label: "🚀 Sci-Fi" },
              { slug: "thriller", label: "🔪 Thriller" },
              { slug: "comedy", label: "😂 Comedy" },
              { slug: "horror", label: "👻 Horror" },
              { slug: "romance", label: "❤️ Romance" },
              { slug: "fantasy", label: "✨ Fantasy" },
              { slug: "crime", label: "🕵️ Crime" },
              { slug: "animation", label: "🎨 Animation" },
            ].map((genre) => (
              <Link
                key={genre.slug}
                href={`/genre/${genre.slug}`}
                className="flex-none bg-secondary hover:bg-secondary/80 border border-border/50 hover:border-primary/40 text-foreground text-sm font-medium px-4 py-2 rounded-full transition-all whitespace-nowrap"
              >
                {genre.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Trending Section */}
        <section className="pb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Trending Now</h2>
            <Link href="/trending" className="text-sm text-primary hover:text-primary/80 transition-colors">See all</Link>
          </div>
          {loading ? (
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex-none w-40 sm:w-48 aspect-[2/3] bg-secondary rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
              {trending.map((movie) => (
                <div key={movie.id} className="flex-none w-40 sm:w-48">
                  <MovieCard id={movie.id} title={movie.title} year={movie.year} rating={movie.rating} platform={movie.platform} posterUrl={movie.posterUrl} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Top 10 Netflix Movies */}
        {(activeFilter === "all" || activeFilter === "netflix") && data && (
          <MovieRow title="Top 10 Movies on Netflix in Thailand" movies={data.netflixMovies} accentColor="netflix" showRank />
        )}

        {/* Top 10 Netflix Series */}
        {(activeFilter === "all" || activeFilter === "netflix") && data && (
          <MovieRow title="Top 10 Series on Netflix in Thailand" movies={data.netflixSeries} accentColor="netflix" showRank />
        )}

        {/* Top 10 HBO Movies */}
        {(activeFilter === "all" || activeFilter === "hbo") && data && (
          <MovieRow title="Top 10 Movies on HBO Max in Thailand" movies={data.hboMovies} accentColor="hbo" showRank />
        )}

        {/* Top 10 HBO Series */}
        {(activeFilter === "all" || activeFilter === "hbo") && data && (
          <MovieRow title="Top 10 Series on HBO Max in Thailand" movies={data.hboSeries} accentColor="hbo" showRank />
        )}

        {loading && (
          <div className="space-y-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="h-6 w-64 bg-secondary rounded animate-pulse mb-6" />
                <div className="flex gap-4 overflow-hidden">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div key={j} className="flex-none w-40 sm:w-48 aspect-[2/3] bg-secondary rounded-lg animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
