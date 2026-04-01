const LIBRARY_KEY = 'osiris_library'

export interface LibraryItem {
  id: number
  title: string
  year: number
  rating: number
  platform?: 'netflix' | 'hbo'
  posterUrl: string | null
  mediaType?: 'movie' | 'tv'
  status: 'want' | 'watching' | 'watched'
  favorited: boolean
  addedAt: number
}

function dispatch() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('library-changed'))
  }
}

export function getLibrary(): LibraryItem[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(LIBRARY_KEY) || '[]')
  } catch {
    return []
  }
}

function setLibrary(items: LibraryItem[]) {
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(items))
  dispatch()
}

export function getLibraryItem(id: number): LibraryItem | undefined {
  return getLibrary().find(i => i.id === id)
}

export function addToLibrary(item: Omit<LibraryItem, 'status' | 'favorited' | 'addedAt'>) {
  const lib = getLibrary()
  if (lib.find(i => i.id === item.id)) return
  setLibrary([...lib, { ...item, status: 'want', favorited: false, addedAt: Date.now() }])
}

export function removeFromLibrary(id: number) {
  setLibrary(getLibrary().filter(i => i.id !== id))
}

export function updateStatus(id: number, status: LibraryItem['status']) {
  const lib = getLibrary()
  if (!lib.find(i => i.id === id)) return
  setLibrary(lib.map(i => i.id === id ? { ...i, status } : i))
}

export function toggleFavorite(id: number, itemData?: Omit<LibraryItem, 'status' | 'favorited' | 'addedAt'>) {
  const lib = getLibrary()
  const existing = lib.find(i => i.id === id)
  if (existing) {
    setLibrary(lib.map(i => i.id === id ? { ...i, favorited: !i.favorited } : i))
  } else if (itemData) {
    setLibrary([...lib, { ...itemData, status: 'want', favorited: true, addedAt: Date.now() }])
  }
}

export function toggleWatchlist(id: number, itemData?: Omit<LibraryItem, 'status' | 'favorited' | 'addedAt'>) {
  const lib = getLibrary()
  const existing = lib.find(i => i.id === id)
  if (existing) {
    setLibrary(lib.filter(i => i.id !== id))
  } else if (itemData) {
    setLibrary([...lib, { ...itemData, status: 'want', favorited: false, addedAt: Date.now() }])
  }
}
