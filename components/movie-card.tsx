"use client"

import { useState } from "react"
import Link from "next/link"
import { Star, Heart, Bookmark } from "lucide-react"
import { cn } from "@/lib/utils"

interface MovieCardProps {
  id?: number
  title: string
  year: number
  rating: number
  platform: "netflix" | "hbo"
  posterUrl: string
}

export function MovieCard({ id, title, year, rating, platform, posterUrl }: MovieCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isWantToWatch, setIsWantToWatch] = useState(false)

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg bg-card transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/10">
      <Link href={id ? `/movie/${id}` : "#"} className="aspect-[2/3] relative overflow-hidden block">
        <img
          src={posterUrl}
          alt={title}
          crossOrigin="anonymous"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Platform Badge */}
        <div
          className={cn(
            "absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide text-white",
            platform === "netflix" ? "bg-netflix" : "bg-hbo"
          )}
        >
          {platform === "netflix" ? "Netflix" : "HBO Max"}
        </div>

        {/* Action Icons - always visible, active state shown */}
        <div className="absolute bottom-2 left-2 flex flex-col gap-1.5">
          <button
            onClick={(e) => { e.preventDefault(); setIsFavorited(!isFavorited) }}
            title="Add to Favorites"
            className={cn(
              "w-7 h-7 flex items-center justify-center rounded-full backdrop-blur-sm transition-colors",
              isFavorited
                ? "bg-netflix/90 shadow-lg shadow-netflix/30"
                : "bg-background/60 hover:bg-background/90"
            )}
          >
            <Heart
              className={cn(
                "w-3.5 h-3.5",
                isFavorited ? "fill-white text-white" : "text-white/70"
              )}
            />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); setIsWantToWatch(!isWantToWatch) }}
            title="Want to Watch"
            className={cn(
              "w-7 h-7 flex items-center justify-center rounded-full backdrop-blur-sm transition-colors",
              isWantToWatch
                ? "bg-primary/90 shadow-lg shadow-primary/30"
                : "bg-background/60 hover:bg-background/90"
            )}
          >
            <Bookmark
              className={cn(
                "w-3.5 h-3.5",
                isWantToWatch ? "fill-white text-white" : "text-white/70"
              )}
            />
          </button>
        </div>
      </Link>

      <Link href={id ? `/movie/${id}` : "#"} className="flex flex-col gap-1 p-3">
        <h3 className="font-semibold text-sm text-foreground truncate">{title}</h3>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{year}</span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="text-foreground font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}
