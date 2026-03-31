"use client"

import { cn } from "@/lib/utils"

interface PlatformFilterProps {
  activeFilter: "all" | "netflix" | "hbo"
  onFilterChange: (filter: "all" | "netflix" | "hbo") => void
}

export function PlatformFilter({ activeFilter, onFilterChange }: PlatformFilterProps) {
  const filters = [
    { id: "all" as const, label: "All" },
    { id: "netflix" as const, label: "Netflix" },
    { id: "hbo" as const, label: "HBO Max" },
  ]

  return (
    <div className="flex items-center gap-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
            activeFilter === filter.id
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
              : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
