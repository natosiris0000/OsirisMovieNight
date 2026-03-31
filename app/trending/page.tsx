"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { BottomNav } from "@/components/bottom-nav"
import { MovieCard } from "@/components/movie-card"
import { PlatformFilter } from "@/components/platform-filter"
import type { MovieCardData } from "@/lib/tmdb"

export default function TrendingPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "netflix" | "hbo">("all")
  const [movies, setMovies] = useState<MovieCardData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/tmdb/trending?platform=${activeFilter}`)
      .then(r => r.json())
      .then(setMovies)
      .finally(() => setLoading(false))
  }, [activeFilter])

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
      <Navbar />

      <main className="container mx-auto px-4">
        <section className="py-8 md:py-12">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/" className="text-primary hover:text-primary/80 transition-colors">← Back</Link>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Trending Now</h1>
          </div>
          <div className="flex justify-start">
            <PlatformFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          </div>
        </section>

        <section className="pb-12">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-secondary rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movies.map((movie) => (
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
          )}
          {!loading && movies.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">No movies found for this platform.</div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
