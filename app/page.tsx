"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { BottomNav } from "@/components/bottom-nav"
import { MovieCard } from "@/components/movie-card"
import { MovieRow } from "@/components/movie-row"
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
]

const top10NetflixMovies = [
  { id: 101, title: "Extraction 2", year: 2023, rating: 7.4, platform: "netflix" as const, posterUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=600&fit=crop&q=80" },
  { id: 102, title: "Glass Onion", year: 2022, rating: 7.2, platform: "netflix" as const, posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop&q=80" },
  { id: 103, title: "All Quiet on the Western Front", year: 2022, rating: 7.8, platform: "netflix" as const, posterUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop&q=80" },
  { id: 104, title: "Killers of the Flower Moon", year: 2023, rating: 7.9, platform: "netflix" as const, posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop&q=80" },
  { id: 105, title: "The Gray Man", year: 2022, rating: 6.5, platform: "netflix" as const, posterUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop&q=80" },
  { id: 106, title: "Enola Holmes 2", year: 2022, rating: 6.8, platform: "netflix" as const, posterUrl: "https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?w=400&h=600&fit=crop&q=80" },
  { id: 107, title: "The Irishman", year: 2019, rating: 7.9, platform: "netflix" as const, posterUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=600&fit=crop&q=80" },
  { id: 108, title: "Bird Box", year: 2018, rating: 6.6, platform: "netflix" as const, posterUrl: "https://images.unsplash.com/photo-1500622944204-b135684e99fd?w=400&h=600&fit=crop&q=80" },
  { id: 109, title: "The Adam Project", year: 2022, rating: 6.8, platform: "netflix" as const, posterUrl: "https://images.unsplash.com/photo-1520986606214-8b456906c813?w=400&h=600&fit=crop&q=80" },
  { id: 110, title: "Army of the Dead", year: 2021, rating: 5.8, platform: "netflix" as const, posterUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=600&fit=crop&q=80" },
]

const top10NetflixSeries = [
  { id: 151, title: "Squid Game S2", year: 2024, rating: 8.1, platform: "netflix" as const, posterUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=600&fit=crop&q=80" },
  { id: 152, title: "Wednesday", year: 2022, rating: 8.1, platform: "netflix" as const, posterUrl: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&h=600&fit=crop&q=80" },
  { id: 153, title: "Stranger Things 5", year: 2025, rating: 8.7, platform: "netflix" as const, posterUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop&q=80" },
  { id: 154, title: "The Diplomat", year: 2023, rating: 7.5, platform: "netflix" as const, posterUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=600&fit=crop&q=80" },
  { id: 155, title: "Beef", year: 2023, rating: 8.3, platform: "netflix" as const, posterUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop&q=80" },
  { id: 156, title: "Lupin Part 3", year: 2023, rating: 7.6, platform: "netflix" as const, posterUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=600&fit=crop&q=80" },
  { id: 157, title: "The Crown S6", year: 2023, rating: 7.8, platform: "netflix" as const, posterUrl: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=400&h=600&fit=crop&q=80" },
  { id: 158, title: "Black Mirror S7", year: 2025, rating: 7.9, platform: "netflix" as const, posterUrl: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&h=600&fit=crop&q=80" },
  { id: 159, title: "Ozark", year: 2022, rating: 8.5, platform: "netflix" as const, posterUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=600&fit=crop&q=80" },
  { id: 160, title: "Emily in Paris S4", year: 2024, rating: 7.0, platform: "netflix" as const, posterUrl: "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=400&h=600&fit=crop&q=80" },
]

const top10HBOMovies = [
  { id: 201, title: "Dune: Part Two", year: 2024, rating: 8.8, platform: "hbo" as const, posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop&q=80" },
  { id: 202, title: "The Batman", year: 2022, rating: 7.8, platform: "hbo" as const, posterUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop&q=80" },
  { id: 203, title: "The Menu", year: 2022, rating: 7.4, platform: "hbo" as const, posterUrl: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&h=600&fit=crop&q=80" },
  { id: 204, title: "Poor Things", year: 2023, rating: 8.3, platform: "hbo" as const, posterUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop&q=80" },
  { id: 205, title: "Oppenheimer", year: 2023, rating: 8.5, platform: "hbo" as const, posterUrl: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop&q=80" },
  { id: 206, title: "Killers of the Flower Moon", year: 2023, rating: 7.9, platform: "hbo" as const, posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop&q=80" },
  { id: 207, title: "Aquaman and the Lost Kingdom", year: 2023, rating: 6.9, platform: "hbo" as const, posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop&q=80" },
  { id: 208, title: "Godzilla x Kong", year: 2024, rating: 6.5, platform: "hbo" as const, posterUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop&q=80" },
  { id: 209, title: "Dune: Prophecy Film", year: 2024, rating: 7.6, platform: "hbo" as const, posterUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop&q=80" },
  { id: 210, title: "The Lighthouse", year: 2019, rating: 7.5, platform: "hbo" as const, posterUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=600&fit=crop&q=80" },
]

const top10HBOSeries = [
  { id: 251, title: "The Last of Us S2", year: 2025, rating: 9.0, platform: "hbo" as const, posterUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop&q=80" },
  { id: 252, title: "House of the Dragon S2", year: 2024, rating: 8.4, platform: "hbo" as const, posterUrl: "https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?w=400&h=600&fit=crop&q=80" },
  { id: 253, title: "Succession", year: 2023, rating: 9.3, platform: "hbo" as const, posterUrl: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400&h=600&fit=crop&q=80" },
  { id: 254, title: "The White Lotus S3", year: 2025, rating: 8.6, platform: "hbo" as const, posterUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=600&fit=crop&q=80" },
  { id: 255, title: "True Detective: Night Country", year: 2024, rating: 7.8, platform: "hbo" as const, posterUrl: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=400&h=600&fit=crop&q=80" },
  { id: 256, title: "Euphoria S3", year: 2025, rating: 8.4, platform: "hbo" as const, posterUrl: "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=400&h=600&fit=crop&q=80" },
  { id: 257, title: "The Penguin", year: 2024, rating: 8.5, platform: "hbo" as const, posterUrl: "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?w=400&h=600&fit=crop&q=80" },
  { id: 258, title: "Barry S4", year: 2023, rating: 9.0, platform: "hbo" as const, posterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop&q=80" },
  { id: 259, title: "Chernobyl", year: 2019, rating: 9.3, platform: "hbo" as const, posterUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop&q=80" },
  { id: 260, title: "Industry S3", year: 2024, rating: 8.1, platform: "hbo" as const, posterUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=600&fit=crop&q=80" },
]

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<"all" | "netflix" | "hbo">("all")

  const filteredMovies = trendingMovies.filter((movie) => {
    if (activeFilter === "all") return true
    return movie.platform === activeFilter
  })

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
      <Navbar />

      {/* Featured Hero — full width, outside container */}
      <section className="relative h-64 md:h-80 overflow-hidden mb-0">
        <img
          src="https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&h=500&fit=crop&q=80"
          alt="Featured"
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        {/* Left-to-right dark fade so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

        {/* Content on top of image */}
        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 pb-6 md:pb-8">
          {/* Tag row */}
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-hbo text-white text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded">
              HBO Max
            </span>
            <span className="text-xs text-muted-foreground">Featured tonight</span>
          </div>
          {/* Title */}
          <h1 className="text-2xl md:text-4xl font-black text-foreground mb-1 leading-tight">
            Dune: <span className="text-primary">Part Two</span>
          </h1>
          {/* Meta */}
          <p className="text-xs text-muted-foreground mb-4">
            2024 · Sci-Fi · Adventure · 2h 46m · ★ 8.8
          </p>
          {/* Buttons */}
          <div className="flex gap-3">
            <Link
              href="/movie/1"
              className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
            >
              Movie Detail
            </Link>
          </div>
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
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            {filteredMovies.map((movie) => (
              <div key={movie.id} className="flex-none w-40 sm:w-48">
                <MovieCard id={movie.id} title={movie.title} year={movie.year} rating={movie.rating} platform={movie.platform} posterUrl={movie.posterUrl} />
              </div>
            ))}
          </div>
          {filteredMovies.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">No movies found for this platform.</div>
          )}
        </section>

        {/* Top 10 Movies on Netflix */}
        {(activeFilter === "all" || activeFilter === "netflix") && (
          <MovieRow
            title="Top 10 Movies on Netflix in Thailand"
            movies={top10NetflixMovies}
            accentColor="netflix"
            showRank
          />
        )}

        {/* Top 10 Series on Netflix */}
        {(activeFilter === "all" || activeFilter === "netflix") && (
          <MovieRow
            title="Top 10 Series on Netflix in Thailand"
            movies={top10NetflixSeries}
            accentColor="netflix"
            showRank
          />
        )}

        {/* Top 10 Movies on HBO Max */}
        {(activeFilter === "all" || activeFilter === "hbo") && (
          <MovieRow
            title="Top 10 Movies on HBO Max in Thailand"
            movies={top10HBOMovies}
            accentColor="hbo"
            showRank
          />
        )}

        {/* Top 10 Series on HBO Max */}
        {(activeFilter === "all" || activeFilter === "hbo") && (
          <MovieRow
            title="Top 10 Series on HBO Max in Thailand"
            movies={top10HBOSeries}
            accentColor="hbo"
            showRank
          />
        )}
      </main>

      <BottomNav />
    </div>
  )
}
