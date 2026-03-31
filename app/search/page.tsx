"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, X, SlidersHorizontal, Film, Tv, Star, SearchX } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { BottomNav } from "@/components/bottom-nav"
import { MovieCard } from "@/components/movie-card"
import { MovieRow } from "@/components/movie-row"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { MovieCardData } from "@/lib/tmdb"

const GENRES = ["Action","Adventure","Animation","Comedy","Crime","Documentary","Drama","Fantasy","Horror","Mystery","Romance","Sci-Fi","Thriller","War"]

interface DiscoverData {
  popular: MovieCardData[]
  netflixTop: MovieCardData[]
  hboTop: MovieCardData[]
}

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [platform, setPlatform] = useState<"all" | "netflix" | "hbo">("all")
  const [contentType, setContentType] = useState<"all" | "movie" | "series">("all")
  const [genres, setGenres] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState<"relevance" | "rating" | "year_desc" | "year_asc">("relevance")
  const [filtersOpen, setFiltersOpen] = useState(false)

  const [results, setResults] = useState<MovieCardData[]>([])
  const [discover, setDiscover] = useState<DiscoverData | null>(null)
  const [loading, setLoading] = useState(false)

  // Debounce query
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 400)
    return () => clearTimeout(t)
  }, [query])

  // Fetch discover on mount
  useEffect(() => {
    fetch('/api/tmdb/search')
      .then(r => r.json())
      .then(setDiscover)
  }, [])

  // Search when query changes
  useEffect(() => {
    if (!debouncedQuery) { setResults([]); return }
    setLoading(true)
    fetch(`/api/tmdb/search?q=${encodeURIComponent(debouncedQuery)}&type=${contentType}`)
      .then(r => r.json())
      .then(d => setResults(d.results || []))
      .finally(() => setLoading(false))
  }, [debouncedQuery, contentType])

  const hasActiveFilters = query || platform !== "all" || contentType !== "all" || genres.length > 0 || minRating > 0

  const filteredResults = results.filter(m => {
    if (platform !== "all" && m.platform !== platform) return false
    if (minRating > 0 && m.rating < minRating) return false
    return true
  }).sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating
    if (sortBy === "year_desc") return b.year - a.year
    if (sortBy === "year_asc") return a.year - b.year
    return 0
  })

  const toggleGenre = (genre: string) => setGenres(prev => prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre])

  const resetAllFilters = () => {
    setQuery("")
    setPlatform("all")
    setContentType("all")
    setGenres([])
    setMinRating(0)
    setSortBy("relevance")
  }

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
      <Navbar />

      {/* Sticky Search Bar */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b border-border/40">
        <div className="container mx-auto px-4 py-4">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search movies & series..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-12 pl-10 pr-10 bg-secondary border border-border/50 rounded-xl text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {hasActiveFilters ? `${filteredResults.length} results` : "Discover"}
            </span>
            <button onClick={() => setFiltersOpen(!filtersOpen)} className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors relative">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />}
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide pt-2 pb-1">
            {(["all", "movie", "series"] as const).map((t) => (
              <button key={t} onClick={() => setContentType(t)}
                className={cn("flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                  contentType === t ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-muted-foreground border-border/50 hover:text-foreground"
                )}>
                {t === "movie" && <Film className="w-3 h-3" />}
                {t === "series" && <Tv className="w-3 h-3" />}
                {t === "all" ? "All" : t === "movie" ? "Movies" : "Series"}
              </button>
            ))}
            <span className="flex-none flex items-center text-border text-xs px-1">·</span>
            {(["all", "netflix", "hbo"] as const).map((p) => (
              <button key={p} onClick={() => setPlatform(p)}
                className={cn("flex-none px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                  platform === p
                    ? p === "netflix" ? "bg-netflix text-white border-netflix" : p === "hbo" ? "bg-hbo text-white border-hbo" : "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary text-muted-foreground border-border/50 hover:text-foreground"
                )}>
                {p === "all" ? "All" : p === "netflix" ? "Netflix" : "HBO Max"}
              </button>
            ))}
          </div>
        </div>

        {filtersOpen && (
          <div className="bg-card border-b border-border/40 px-4 py-5">
            <div className="container mx-auto space-y-5">
              <div>
                <p className="text-xs uppercase font-semibold text-muted-foreground mb-3">Genre — select multiple</p>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map(g => (
                    <button key={g} onClick={() => toggleGenre(g)}
                      className={cn("px-3 py-1 rounded-full text-xs font-medium transition-all border",
                        genres.includes(g) ? "bg-primary/20 text-primary border-primary/50" : "bg-secondary text-muted-foreground border-border/50 hover:text-foreground"
                      )}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase font-semibold text-muted-foreground mb-3">Min. Rating</p>
                <div className="flex gap-2 flex-wrap">
                  {[0, 6, 7, 7.5, 8, 9].map(r => (
                    <button key={r} onClick={() => setMinRating(r)}
                      className={cn("px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1",
                        minRating === r ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                      )}>
                      {r === 0 ? "Any" : <><Star className="w-3 h-3 fill-current" />{r}+</>}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase font-semibold text-muted-foreground mb-3">Sort By</p>
                <div className="flex gap-2 flex-wrap">
                  {([["relevance","Relevance"],["rating","Top Rated"],["year_desc","Newest"],["year_asc","Oldest"]] as const).map(([id, label]) => (
                    <button key={id} onClick={() => setSortBy(id as typeof sortBy)}
                      className={cn("px-3 py-1 rounded-full text-xs font-medium transition-all",
                        sortBy === id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                      )}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end pt-2 border-t border-border/40">
                <button onClick={resetAllFilters} className="text-sm text-primary hover:text-primary/80 transition-colors">Reset all filters</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <main className="container mx-auto px-4 py-8">
        {!hasActiveFilters ? (
          <div className="space-y-12">
            {discover ? (
              <>
                <MovieRow title="Popular right now" movies={discover.popular} />
                <MovieRow title="Top rated on Netflix" movies={discover.netflixTop} accentColor="netflix" />
                <MovieRow title="Top rated on HBO Max" movies={discover.hboTop} accentColor="hbo" />
              </>
            ) : (
              <div className="space-y-10">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i}>
                    <div className="h-6 w-48 bg-secondary rounded animate-pulse mb-6" />
                    <div className="flex gap-4 overflow-hidden">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <div key={j} className="flex-none w-40 aspect-[2/3] bg-secondary rounded-lg animate-pulse" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-secondary rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <SearchX className="w-12 h-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
            <p className="text-sm text-muted-foreground mb-6">Try adjusting your filters or search for something else</p>
            <Button onClick={resetAllFilters} variant="outline" className="rounded-full border-primary/50 text-primary hover:bg-primary/10">
              Reset filters
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-2">
              {query && (
                <button onClick={() => setQuery("")} className="flex items-center gap-1 px-2.5 py-1 bg-secondary border border-primary/40 text-primary text-xs rounded-full flex-shrink-0">
                  {query} <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredResults.map((movie) => (
                <MovieCard key={movie.id} id={movie.id} title={movie.title} year={movie.year} rating={movie.rating} platform={movie.platform} posterUrl={movie.posterUrl} />
              ))}
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
