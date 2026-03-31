"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { BottomNav } from "@/components/bottom-nav"
import { MovieCard } from "@/components/movie-card"
import { PlatformFilter } from "@/components/platform-filter"

const trendingMovies = [
  { id: 1, title: "Dune: Part Two", year: 2024, rating: 8.8, platform: "hbo" as const, posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop&q=80" },
  { id: 2, title: "Oppenheimer", year: 2023, rating: 8.5, platform: "netflix" as const, posterUrl: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop&q=80" },
  { id: 3, title: "Poor Things", year: 2023, rating: 8.3, platform: "hbo" as const, posterUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop&q=80" },
  { id: 4, title: "Killers of the Flower Moon", year: 2023, rating: 7.9, platform: "netflix" as const, posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop&q=80" },
  { id: 5, title: "The Batman", year: 2022, rating: 7.8, platform: "hbo" as const, posterUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop&q=80" },
  { id: 6, title: "Glass Onion", year: 2022, rating: 7.2, platform: "netflix" as const, posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop&q=80" },
  { id: 7, title: "The Menu", year: 2022, rating: 7.4, platform: "hbo" as const, posterUrl: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&h=600&fit=crop&q=80" },
  { id: 8, title: "All Quiet on the Western Front", year: 2022, rating: 7.8, platform: "netflix" as const, posterUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop&q=80" },
  { id: 9, title: "Extraction 2", year: 2023, rating: 7.4, platform: "netflix" as const, posterUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=600&fit=crop&q=80" },
  { id: 10, title: "The Diplomat", year: 2023, rating: 7.5, platform: "netflix" as const, posterUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=600&fit=crop&q=80" },
  { id: 11, title: "Beef", year: 2023, rating: 8.3, platform: "netflix" as const, posterUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop&q=80" },
  { id: 12, title: "Aquaman and the Lost Kingdom", year: 2023, rating: 6.9, platform: "hbo" as const, posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop&q=80" },
  { id: 13, title: "Godzilla x Kong", year: 2024, rating: 6.5, platform: "hbo" as const, posterUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop&q=80" },
  { id: 14, title: "The Irishman", year: 2019, rating: 7.9, platform: "netflix" as const, posterUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=600&fit=crop&q=80" },
  { id: 15, title: "Bird Box", year: 2018, rating: 6.6, platform: "netflix" as const, posterUrl: "https://images.unsplash.com/photo-1500622944204-b135684e99fd?w=400&h=600&fit=crop&q=80" },
  { id: 16, title: "The Lighthouse", year: 2019, rating: 7.5, platform: "hbo" as const, posterUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=600&fit=crop&q=80" },
]

export default function TrendingPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "netflix" | "hbo">("all")

  const filteredMovies = trendingMovies.filter((movie) => {
    if (activeFilter === "all") return true
    return movie.platform === activeFilter
  })

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
      <Navbar />

      <main className="container mx-auto px-4">
        {/* Header */}
        <section className="py-8 md:py-12">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/" className="text-primary hover:text-primary/80 transition-colors">
              ← Back
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Trending Now</h1>
          </div>

          {/* Platform Filter */}
          <div className="flex justify-start">
            <PlatformFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          </div>
        </section>

        {/* Movies Grid */}
        <section className="pb-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredMovies.map((movie) => (
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

          {filteredMovies.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">No movies found for this platform.</div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
