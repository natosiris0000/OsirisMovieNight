"use client"

import { useState, useMemo } from "react"
import { Search, X, SlidersHorizontal, Film, Tv, Star, SearchX } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { BottomNav } from "@/components/bottom-nav"
import { MovieCard } from "@/components/movie-card"
import { MovieRow } from "@/components/movie-row"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "War",
]

const COUNTRIES = [
  { id: "all", name: "All", flag: "" },
  { id: "thailand", name: "Thailand", flag: "🇹🇭" },
  { id: "usa", name: "USA", flag: "🇺🇸" },
  { id: "uk", name: "UK", flag: "🇬🇧" },
  { id: "south-korea", name: "South Korea", flag: "🇰🇷" },
  { id: "japan", name: "Japan", flag: "🇯🇵" },
  { id: "france", name: "France", flag: "🇫🇷" },
  { id: "spain", name: "Spain", flag: "🇪🇸" },
  { id: "india", name: "India", flag: "🇮🇳" },
  { id: "germany", name: "Germany", flag: "🇩🇪" },
]

const MOCK_MOVIES = [
  {
    id: 1,
    title: "Dune: Part Two",
    year: 2024,
    rating: 8.8,
    platform: "hbo" as const,
    genre: ["Sci-Fi", "Adventure"],
    country: "USA",
    type: "movie" as const,
    posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop&q=80",
  },
  {
    id: 2,
    title: "Squid Game S2",
    year: 2024,
    rating: 8.1,
    platform: "netflix" as const,
    genre: ["Thriller", "Drama"],
    country: "South Korea",
    type: "series" as const,
    posterUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=600&fit=crop&q=80",
  },
  {
    id: 3,
    title: "Oppenheimer",
    year: 2023,
    rating: 8.5,
    platform: "netflix" as const,
    genre: ["Drama", "War"],
    country: "USA",
    type: "movie" as const,
    posterUrl: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop&q=80",
  },
  {
    id: 4,
    title: "Succession",
    year: 2023,
    rating: 9.3,
    platform: "hbo" as const,
    genre: ["Drama", "Crime"],
    country: "USA",
    type: "series" as const,
    posterUrl: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400&h=600&fit=crop&q=80",
  },
  {
    id: 5,
    title: "The Menu",
    year: 2022,
    rating: 7.4,
    platform: "hbo" as const,
    genre: ["Thriller", "Drama"],
    country: "USA",
    type: "movie" as const,
    posterUrl: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&h=600&fit=crop&q=80",
  },
  {
    id: 6,
    title: "Wednesday",
    year: 2022,
    rating: 8.1,
    platform: "netflix" as const,
    genre: ["Comedy", "Crime"],
    country: "USA",
    type: "series" as const,
    posterUrl: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&h=600&fit=crop&q=80",
  },
  {
    id: 7,
    title: "Extraction 2",
    year: 2023,
    rating: 7.4,
    platform: "netflix" as const,
    genre: ["Action", "Thriller"],
    country: "USA",
    type: "movie" as const,
    posterUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=600&fit=crop&q=80",
  },
  {
    id: 8,
    title: "The White Lotus S3",
    year: 2025,
    rating: 8.6,
    platform: "hbo" as const,
    genre: ["Drama", "Mystery"],
    country: "USA",
    type: "series" as const,
    posterUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=600&fit=crop&q=80",
  },
  {
    id: 9,
    title: "Glass Onion",
    year: 2022,
    rating: 7.2,
    platform: "netflix" as const,
    genre: ["Mystery", "Comedy"],
    country: "USA",
    type: "movie" as const,
    posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop&q=80",
  },
  {
    id: 10,
    title: "Stranger Things 5",
    year: 2025,
    rating: 8.7,
    platform: "netflix" as const,
    genre: ["Sci-Fi", "Drama"],
    country: "USA",
    type: "series" as const,
    posterUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop&q=80",
  },
  {
    id: 11,
    title: "Poor Things",
    year: 2023,
    rating: 8.3,
    platform: "hbo" as const,
    genre: ["Drama", "Romance"],
    country: "UK",
    type: "movie" as const,
    posterUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop&q=80",
  },
  {
    id: 12,
    title: "The Diplomat",
    year: 2023,
    rating: 7.5,
    platform: "netflix" as const,
    genre: ["Drama", "Comedy"],
    country: "USA",
    type: "series" as const,
    posterUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=600&fit=crop&q=80",
  },
  {
    id: 13,
    title: "The Batman",
    year: 2022,
    rating: 7.8,
    platform: "hbo" as const,
    genre: ["Action", "Crime"],
    country: "USA",
    type: "movie" as const,
    posterUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop&q=80",
  },
  {
    id: 14,
    title: "Beef",
    year: 2023,
    rating: 8.3,
    platform: "netflix" as const,
    genre: ["Drama", "Crime"],
    country: "USA",
    type: "series" as const,
    posterUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop&q=80",
  },
  {
    id: 15,
    title: "True Detective: Night Country",
    year: 2024,
    rating: 7.8,
    platform: "hbo" as const,
    genre: ["Crime", "Mystery"],
    country: "USA",
    type: "series" as const,
    posterUrl: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=400&h=600&fit=crop&q=80",
  },
  {
    id: 16,
    title: "All Quiet on the Western Front",
    year: 2022,
    rating: 7.8,
    platform: "netflix" as const,
    genre: ["Drama", "War"],
    country: "Germany",
    type: "movie" as const,
    posterUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop&q=80",
  },
  {
    id: 17,
    title: "House of the Dragon S2",
    year: 2024,
    rating: 8.4,
    platform: "hbo" as const,
    genre: ["Fantasy", "Drama"],
    country: "USA",
    type: "series" as const,
    posterUrl: "https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?w=400&h=600&fit=crop&q=80",
  },
  {
    id: 18,
    title: "Lupin Part 3",
    year: 2023,
    rating: 7.6,
    platform: "netflix" as const,
    genre: ["Crime", "Mystery"],
    country: "France",
    type: "series" as const,
    posterUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=600&fit=crop&q=80",
  },
  {
    id: 19,
    title: "Black Mirror S7",
    year: 2025,
    rating: 7.9,
    platform: "netflix" as const,
    genre: ["Sci-Fi", "Thriller"],
    country: "USA",
    type: "series" as const,
    posterUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=600&fit=crop&q=80",
  },
  {
    id: 20,
    title: "Barry S4",
    year: 2023,
    rating: 9.0,
    platform: "hbo" as const,
    genre: ["Comedy", "Crime"],
    country: "USA",
    type: "series" as const,
    posterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop&q=80",
  },
]

const DISCOVER_MOVIES = MOCK_MOVIES.slice(0, 8)
const NETFLIX_TOP = MOCK_MOVIES.filter((m) => m.platform === "netflix").slice(0, 6)
const HBO_TOP = MOCK_MOVIES.filter((m) => m.platform === "hbo").slice(0, 6)
const THAI_ORIGINALS = MOCK_MOVIES.filter((m) => m.country === "Thailand").slice(0, 5)

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [platform, setPlatform] = useState<"all" | "netflix" | "hbo">("all")
  const [contentType, setContentType] = useState<"all" | "movie" | "series">("all")
  const [genres, setGenres] = useState<string[]>([])
  const [country, setCountry] = useState("all")
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState<"relevance" | "rating" | "year_desc" | "year_asc">("relevance")
  const [filtersOpen, setFiltersOpen] = useState(false)

  const hasActiveFilters = query || platform !== "all" || contentType !== "all" || genres.length > 0 || country !== "all" || minRating > 0

  const filteredResults = useMemo(() => {
    let results = MOCK_MOVIES.filter((m) => {
      if (platform !== "all" && m.platform !== platform) return false
      if (contentType !== "all" && m.type !== contentType) return false
      if (genres.length > 0 && !genres.some((g) => m.genre.includes(g))) return false
      if (country !== "all" && m.country !== country) return false
      if (minRating > 0 && m.rating < minRating) return false
      if (query && !m.title.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })

    results.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating
      if (sortBy === "year_desc") return b.year - a.year
      if (sortBy === "year_asc") return a.year - b.year
      return 0
    })

    return results
  }, [query, platform, contentType, genres, country, minRating, sortBy])

  const toggleGenre = (genre: string) => {
    setGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]))
  }

  const removeFilter = (filterType: string, value: string) => {
    switch (filterType) {
      case "platform":
        setPlatform("all")
        break
      case "type":
        setContentType("all")
        break
      case "genre":
        setGenres((prev) => prev.filter((g) => g !== value))
        break
      case "country":
        setCountry("all")
        break
      case "rating":
        setMinRating(0)
        break
      case "query":
        setQuery("")
        break
    }
  }

  const resetAllFilters = () => {
    setQuery("")
    setPlatform("all")
    setContentType("all")
    setGenres([])
    setCountry("all")
    setMinRating(0)
    setSortBy("relevance")
  }

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
      <Navbar />

      {/* Sticky Search Bar */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b border-border/40">
        <div className="container mx-auto px-4 py-4">
          {/* Search Input */}
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
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Result count and Filters toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {hasActiveFilters
                ? `${filteredResults.length} results`
                : "Discover"}
            </span>
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors relative"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
              )}
            </button>
          </div>

          {/* Always-visible quick filters */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pt-2 pb-1">
            {/* Type pills */}
            <button
              onClick={() => setContentType("all")}
              className={cn(
                "flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                contentType === "all"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-muted-foreground border-border/50 hover:text-foreground"
              )}
            >
              All
            </button>
            <button
              onClick={() => setContentType("movie")}
              className={cn(
                "flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                contentType === "movie"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-muted-foreground border-border/50 hover:text-foreground"
              )}
            >
              <Film className="w-3 h-3" /> Movies
            </button>
            <button
              onClick={() => setContentType("series")}
              className={cn(
                "flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                contentType === "series"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-muted-foreground border-border/50 hover:text-foreground"
              )}
            >
              <Tv className="w-3 h-3" /> Series
            </button>

            {/* Divider dot */}
            <span className="flex-none flex items-center text-border text-xs px-1">·</span>

            {/* Platform pills */}
            <button
              onClick={() => setPlatform("all")}
              className={cn(
                "flex-none px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                platform === "all"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-muted-foreground border-border/50 hover:text-foreground"
              )}
            >
              All
            </button>
            <button
              onClick={() => setPlatform("netflix")}
              className={cn(
                "flex-none px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                platform === "netflix"
                  ? "bg-netflix text-white border-netflix"
                  : "bg-secondary text-muted-foreground border-border/50 hover:text-foreground"
              )}
            >
              Netflix
            </button>
            <button
              onClick={() => setPlatform("hbo")}
              className={cn(
                "flex-none px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                platform === "hbo"
                  ? "bg-hbo text-white border-hbo"
                  : "bg-secondary text-muted-foreground border-border/50 hover:text-foreground"
              )}
            >
              HBO Max
            </button>
          </div>
        </div>

        {/* Collapsible Filter Panel */}
        {filtersOpen && (
          <div className="bg-card border-b border-border/40 px-4 py-5">
            <div className="container mx-auto space-y-5">
              {/* Platform */}
              <div>
                <p className="text-xs uppercase font-semibold text-muted-foreground mb-3">Platform</p>
                <div className="flex gap-2">
                  {["all", "netflix", "hbo"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPlatform(p as "all" | "netflix" | "hbo")}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-all",
                        platform === p
                          ? p === "netflix"
                            ? "bg-netflix text-white"
                            : p === "hbo"
                            ? "bg-hbo text-white"
                            : "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {p === "all" ? "All" : p === "netflix" ? "Netflix" : "HBO Max"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type */}
              <div>
                <p className="text-xs uppercase font-semibold text-muted-foreground mb-3">Type</p>
                <div className="flex gap-2">
                  {[
                    { id: "all", label: "All", icon: null },
                    { id: "movie", label: "Movie", icon: Film },
                    { id: "series", label: "Series", icon: Tv },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setContentType(id as "all" | "movie" | "series")}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                        contentType === id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {Icon && <Icon className="w-3.5 h-3.5" />}
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Genre */}
              <div>
                <p className="text-xs uppercase font-semibold text-muted-foreground mb-3">Genre — select multiple</p>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map((g) => (
                    <button
                      key={g}
                      onClick={() => toggleGenre(g)}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium transition-all border",
                        genres.includes(g)
                          ? "bg-primary/20 text-primary border-primary/50"
                          : "bg-secondary text-muted-foreground border-border/50 hover:text-foreground"
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Country */}
              <div>
                <p className="text-xs uppercase font-semibold text-muted-foreground mb-3">Country</p>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {COUNTRIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCountry(c.id)}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap flex-shrink-0",
                        country === c.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {c.flag} {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Min Rating */}
              <div>
                <p className="text-xs uppercase font-semibold text-muted-foreground mb-3">Min. Rating</p>
                <div className="flex gap-2 flex-wrap">
                  {[0, 6, 7, 7.5, 8, 9].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1",
                        minRating === r
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {r === 0 ? (
                        "Any"
                      ) : (
                        <>
                          <Star className="w-3 h-3 fill-current" />
                          {r}+
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <p className="text-xs uppercase font-semibold text-muted-foreground mb-3">Sort By</p>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { id: "relevance", label: "Relevance" },
                    { id: "rating", label: "Top Rated" },
                    { id: "year_desc", label: "Newest" },
                    { id: "year_asc", label: "Oldest" },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => setSortBy(id as typeof sortBy)}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium transition-all",
                        sortBy === id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset */}
              <div className="flex justify-end pt-2 border-t border-border/40">
                <button
                  onClick={resetAllFilters}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Reset all filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <main className="container mx-auto px-4 py-8">
        {!hasActiveFilters ? (
          // Discover State
          <div className="space-y-12">
            <MovieRow title="Popular right now" movies={DISCOVER_MOVIES} />
            <MovieRow title="Top rated on Netflix" movies={NETFLIX_TOP} accentColor="netflix" />
            <MovieRow title="Top rated on HBO Max" movies={HBO_TOP} accentColor="hbo" />
            {THAI_ORIGINALS.length > 0 && <MovieRow title="Thai originals" movies={THAI_ORIGINALS} />}
          </div>
        ) : filteredResults.length === 0 ? (
          // Empty Results State
          <div className="flex flex-col items-center justify-center py-24">
            <SearchX className="w-12 h-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
            <p className="text-sm text-muted-foreground mb-6">Try adjusting your filters or search for something else</p>
            <Button
              onClick={resetAllFilters}
              variant="outline"
              className="rounded-full border-primary/50 text-primary hover:bg-primary/10"
            >
              Reset filters
            </Button>
          </div>
        ) : (
          // Results State
          <div>
            {/* Active Filters Summary */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-2">
              {query && (
                <button
                  onClick={() => removeFilter("query", "")}
                  className="flex items-center gap-1 px-2.5 py-1 bg-secondary border border-primary/40 text-primary text-xs rounded-full flex-shrink-0 hover:bg-secondary/80 transition-colors"
                >
                  {query}
                  <X className="w-3 h-3" />
                </button>
              )}
              {platform !== "all" && (
                <button
                  onClick={() => removeFilter("platform", "")}
                  className="flex items-center gap-1 px-2.5 py-1 bg-secondary border border-primary/40 text-primary text-xs rounded-full flex-shrink-0 hover:bg-secondary/80 transition-colors"
                >
                  {platform === "netflix" ? "Netflix" : "HBO Max"}
                  <X className="w-3 h-3" />
                </button>
              )}
              {contentType !== "all" && (
                <button
                  onClick={() => removeFilter("type", "")}
                  className="flex items-center gap-1 px-2.5 py-1 bg-secondary border border-primary/40 text-primary text-xs rounded-full flex-shrink-0 hover:bg-secondary/80 transition-colors"
                >
                  {contentType === "movie" ? "Movie" : "Series"}
                  <X className="w-3 h-3" />
                </button>
              )}
              {genres.map((g) => (
                <button
                  key={g}
                  onClick={() => removeFilter("genre", g)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-secondary border border-primary/40 text-primary text-xs rounded-full flex-shrink-0 hover:bg-secondary/80 transition-colors"
                >
                  {g}
                  <X className="w-3 h-3" />
                </button>
              ))}
              {country !== "all" && (
                <button
                  onClick={() => removeFilter("country", "")}
                  className="flex items-center gap-1 px-2.5 py-1 bg-secondary border border-primary/40 text-primary text-xs rounded-full flex-shrink-0 hover:bg-secondary/80 transition-colors"
                >
                  {COUNTRIES.find((c) => c.id === country)?.name}
                  <X className="w-3 h-3" />
                </button>
              )}
              {minRating > 0 && (
                <button
                  onClick={() => removeFilter("rating", "")}
                  className="flex items-center gap-1 px-2.5 py-1 bg-secondary border border-primary/40 text-primary text-xs rounded-full flex-shrink-0 hover:bg-secondary/80 transition-colors"
                >
                  {minRating}+
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredResults.map((movie) => (
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
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
