"use client"

import Link from "next/link"
import { MovieCard } from "@/components/movie-card"
import { cn } from "@/lib/utils"

interface Movie {
  id: number
  title: string
  year: number
  rating: number
  platform: "netflix" | "hbo"
  posterUrl: string
}

interface MovieRowProps {
  title: string
  movies: Movie[]
  accentColor?: "netflix" | "hbo"
  showRank?: boolean
  seeAllHref?: string
}

export function MovieRow({ title, movies, accentColor, showRank = false, seeAllHref }: MovieRowProps) {
  return (
    <section className="pb-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {accentColor && (
            <span
              className={cn(
                "h-5 w-1.5 rounded-full",
                accentColor === "netflix" ? "bg-netflix" : "bg-hbo"
              )}
            />
          )}
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        </div>
        {seeAllHref && (
          <Link href={seeAllHref} className="text-sm text-primary hover:text-primary/80 transition-colors">
            See all
          </Link>
        )}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
        {movies.map((movie, index) => (
          <div key={movie.id} className="flex-none w-40 sm:w-48 relative group">
            <MovieCard
              id={movie.id}
              title={movie.title}
              year={movie.year}
              rating={movie.rating}
              platform={movie.platform}
              posterUrl={movie.posterUrl}
            />
            {showRank && (
              <span
                className={cn(
                  "absolute left-1 top-1 z-10 text-5xl font-black leading-none select-none pointer-events-none",
                  accentColor === "netflix"
                    ? "text-netflix/70"
                    : accentColor === "hbo"
                    ? "text-hbo/70"
                    : "text-primary/70",
                  "[text-shadow:_0_2px_8px_rgba(0,0,0,0.8)]"
                )}
              >
                {index + 1}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
