'use client'

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { BottomNav } from "@/components/bottom-nav"
import { MovieCard } from "@/components/movie-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

interface MoviePageProps {
  title: string
  movies: Array<{
    id: number
    title: string
    year: number
    rating: number
    platform: "netflix" | "hbo"
    posterUrl: string
  }>
}

export function MovieGridPage({ title, movies }: MoviePageProps) {
  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{title}</h1>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              year={movie.year}
              rating={movie.rating}
              platform={movie.platform}
              posterUrl={movie.posterUrl}
            />
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
