"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { MovieCard } from "@/components/movie-card"
import { cn } from "@/lib/utils"

interface Movie {
  id: number
  title: string
  year: number
  rating: number
  platform?: "netflix" | "hbo"
  posterUrl: string
  mediaType?: "movie" | "tv"
}

interface MovieRowProps {
  title: string
  movies: Movie[]
  accentColor?: "netflix" | "hbo"
  showRank?: boolean
  seeAllHref?: string
}

export function MovieRow({ title, movies, accentColor, showRank = false, seeAllHref }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    el.addEventListener("scroll", checkScroll, { passive: true })
    const ro = new ResizeObserver(checkScroll)
    ro.observe(el)
    return () => {
      el.removeEventListener("scroll", checkScroll)
      ro.disconnect()
    }
  }, [checkScroll, movies])

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.querySelector("div")?.offsetWidth ?? 192
    el.scrollBy({ left: dir === "left" ? -(cardWidth * 3) : cardWidth * 3, behavior: "smooth" })
  }

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
        <div className="flex items-center gap-2">
          {seeAllHref && (
            <Link href={seeAllHref} className="text-sm text-primary hover:text-primary/80 transition-colors mr-2">
              See all
            </Link>
          )}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded-full border transition-all",
              canScrollLeft
                ? "border-border/60 bg-secondary/80 hover:bg-secondary text-foreground hover:border-primary/50"
                : "border-border/20 bg-secondary/20 text-muted-foreground/30 cursor-not-allowed"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded-full border transition-all",
              canScrollRight
                ? "border-border/60 bg-secondary/80 hover:bg-secondary text-foreground hover:border-primary/50"
                : "border-border/20 bg-secondary/20 text-muted-foreground/30 cursor-not-allowed"
            )}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 scroll-smooth"
      >
        {movies.map((movie, index) => (
          <div key={movie.id} className="flex-none w-40 sm:w-48 relative group">
            <MovieCard
              id={movie.id}
              title={movie.title}
              year={movie.year}
              rating={movie.rating}
              platform={movie.platform}
              posterUrl={movie.posterUrl}
              mediaType={movie.mediaType}
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
