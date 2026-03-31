"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Home, Search, BookOpen, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Search, label: "Search", href: "/search" },
  { icon: BookOpen, label: "Library", href: "/favorites" },
  { icon: User, label: "Profile", href: "/profile" },
]

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between gap-4 px-4">
        <button onClick={() => router.push("/")} className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
          <span className="text-lg font-bold tracking-wide text-primary">Osiris Movie Night</span>
        </button>

        {/* Desktop nav links */}
        <nav className="hidden sm:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                pathname === link.href
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile: search + profile icons */}
        <div className="sm:hidden flex items-center gap-2 ml-auto">
          <button
            onClick={() => router.push("/search")}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <Search className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => router.push("/profile")}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <User className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  )
}
