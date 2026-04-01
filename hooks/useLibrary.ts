'use client'

import { useState, useEffect, useCallback } from 'react'
import { getLibrary, getLibraryItem, type LibraryItem } from '@/lib/library'

export function useLibrary() {
  const [library, setLibrary] = useState<LibraryItem[]>([])

  const refresh = useCallback(() => setLibrary(getLibrary()), [])

  useEffect(() => {
    refresh()
    window.addEventListener('library-changed', refresh)
    return () => window.removeEventListener('library-changed', refresh)
  }, [refresh])

  return library
}

export function useLibraryItem(id: number | undefined) {
  const [item, setItem] = useState<LibraryItem | undefined>(undefined)

  const refresh = useCallback(() => {
    setItem(id !== undefined ? getLibraryItem(id) : undefined)
  }, [id])

  useEffect(() => {
    refresh()
    window.addEventListener('library-changed', refresh)
    return () => window.removeEventListener('library-changed', refresh)
  }, [refresh])

  return item
}
