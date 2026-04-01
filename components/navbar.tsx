"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Home, Search, BookOpen, LogIn } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"

const navLinks = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Search, label: "Search", href: "/search" },
  { icon: BookOpen, label: "Library", href: "/favorites" },
]

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useAuth()

  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : ''

  return (
    <header className="w-full border-b-2 border-border bg-background">
      <div className="container mx-auto flex h-14 items-center justify-between gap-4 px-4">
        <button onClick={() => router.push("/")} className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
          <span className="text-lg font-bold tracking-wide text-primary">Osiris Movie Night</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className={cn("flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                pathname === link.href ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}>
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side: auth state */}
        {!loading && (
          <div className="flex items-center gap-2">
            {user ? (
              /* Avatar button → profile */
              <button onClick={() => router.push("/profile")}
                className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-secondary transition-colors group">
                <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center text-primary text-xs font-bold group-hover:border-primary transition-colors">
                  {initials}
                </div>
                <span className="hidden sm:block text-sm font-medium text-foreground max-w-[100px] truncate">
                  {user.displayName}
                </span>
              </button>
            ) : (
              /* Sign In button */
              <Link href="/auth"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-sm font-semibold rounded-full hover:bg-primary/90 transition-colors">
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </Link>
            )}
          </div>
        )}

        {/* Mobile: search + profile/signin icons */}
        <div className="sm:hidden flex items-center gap-2 ml-auto">
          <button onClick={() => router.push("/search")}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
            <Search className="h-4 w-4 text-muted-foreground" />
          </button>
          {!loading && (
            user ? (
              <button onClick={() => router.push("/profile")}
                className="w-8 h-8 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center text-primary text-xs font-bold">
                {initials}
              </button>
            ) : (
              <button onClick={() => router.push("/auth")}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary hover:bg-primary/90 transition-colors">
                <LogIn className="h-4 w-4 text-primary-foreground" />
              </button>
            )
          )}
        </div>
      </div>
    </header>
  )
}
