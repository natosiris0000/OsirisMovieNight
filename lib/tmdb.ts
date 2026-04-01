const TMDB_BASE = 'https://api.themoviedb.org/3'
const TMDB_IMAGE = 'https://image.tmdb.org/t/p'

export const GENRE_MAP: Record<string, number> = {
  'action': 28,
  'adventure': 12,
  'animation': 16,
  'comedy': 35,
  'crime': 80,
  'documentary': 99,
  'drama': 18,
  'fantasy': 14,
  'horror': 27,
  'mystery': 9648,
  'romance': 10749,
  'sci-fi': 878,
  'thriller': 53,
  'war': 10752,
}

export function posterUrl(path: string | null | undefined, size = 'w500'): string | null {
  if (!path) return null
  return `${TMDB_IMAGE}/${size}${path}`
}

export function backdropUrl(path: string | null | undefined): string | null {
  if (!path) return null
  return `${TMDB_IMAGE}/original${path}`
}

async function tmdbFetch(path: string, params: Record<string, string> = {}) {
  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) throw new Error('TMDB_API_KEY is not set')
  const url = new URL(`${TMDB_BASE}${path}`)
  url.searchParams.set('api_key', apiKey)
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v)
  }
  const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`TMDB error ${res.status}: ${path}`)
  return res.json()
}

export interface TMDBItem {
  id: number
  title?: string
  name?: string
  release_date?: string
  first_air_date?: string
  vote_average: number
  poster_path: string | null
  backdrop_path: string | null
  overview: string
  media_type?: string
}

export interface MovieCardData {
  id: number
  title: string
  year: number
  rating: number
  platform?: 'netflix' | 'hbo'
  posterUrl: string | null
  mediaType?: 'movie' | 'tv'
}

function toCard(item: TMDBItem, platform?: 'netflix' | 'hbo', mediaType?: 'movie' | 'tv'): MovieCardData {
  const date = item.release_date || item.first_air_date || ''
  return {
    id: item.id,
    title: item.title || item.name || 'Unknown',
    year: date ? parseInt(date.slice(0, 4)) : 0,
    rating: Math.round(item.vote_average * 10) / 10,
    platform,
    posterUrl: posterUrl(item.poster_path),
    mediaType,
  }
}

function determinePlatform(providerIds: number[]): 'netflix' | 'hbo' | undefined {
  if (providerIds.includes(8)) return 'netflix'
  if (providerIds.includes(1899) || providerIds.includes(384)) return 'hbo'
  return undefined
}

// ─── Home ────────────────────────────────────────────────────────────────────

export async function getHomeData() {
  const [trendingTH, netflixMovies, netflixSeries, hboMovies, hboSeries] = await Promise.all([
    tmdbFetch('/discover/movie', { with_watch_providers: '8|1899', watch_region: 'TH', sort_by: 'popularity.desc' }),
    tmdbFetch('/discover/movie', { with_watch_providers: '8', watch_region: 'TH', sort_by: 'popularity.desc' }),
    tmdbFetch('/discover/tv', { with_watch_providers: '8', watch_region: 'TH', sort_by: 'popularity.desc' }),
    tmdbFetch('/discover/movie', { with_watch_providers: '1899', watch_region: 'TH', sort_by: 'popularity.desc' }),
    tmdbFetch('/discover/tv', { with_watch_providers: '1899', watch_region: 'TH', sort_by: 'popularity.desc' }),
  ])

  const netflixIds = new Set<number>(netflixMovies.results.map((m: TMDBItem) => m.id))
  const hboIds = new Set<number>(hboMovies.results.map((m: TMDBItem) => m.id))

  const trendingCards = (trendingTH.results as TMDBItem[]).slice(0, 10).map((item: TMDBItem) => {
    const platform = netflixIds.has(item.id) ? 'netflix' : hboIds.has(item.id) ? 'hbo' : undefined
    return toCard(item, platform as 'netflix' | 'hbo' | undefined)
  })

  const featured = (netflixMovies.results as TMDBItem[]).find(m => m.backdrop_path) || netflixMovies.results[0]

  return {
    featured: featured ? {
      id: featured.id,
      title: featured.title || featured.name || '',
      year: featured.release_date ? parseInt(featured.release_date.slice(0, 4)) : 0,
      rating: Math.round(featured.vote_average * 10) / 10,
      platform: 'netflix' as const,
      posterUrl: posterUrl(featured.poster_path),
      backdropUrl: backdropUrl(featured.backdrop_path),
      overview: featured.overview,
    } : null,
    trending: trendingCards,
    netflixMovies: (netflixMovies.results as TMDBItem[]).slice(0, 10).map(m => toCard(m, 'netflix')),
    netflixSeries: (netflixSeries.results as TMDBItem[]).slice(0, 10).map(m => toCard(m, 'netflix', 'tv')),
    hboMovies: (hboMovies.results as TMDBItem[]).slice(0, 10).map(m => toCard(m, 'hbo')),
    hboSeries: (hboSeries.results as TMDBItem[]).slice(0, 10).map(m => toCard(m, 'hbo', 'tv')),
  }
}

// ─── Trending ────────────────────────────────────────────────────────────────

export async function getTrending(platform: 'all' | 'netflix' | 'hbo', page = 1) {
  if (platform === 'netflix') {
    const data = await tmdbFetch('/discover/movie', { with_watch_providers: '8', watch_region: 'TH', sort_by: 'popularity.desc', page: String(page) })
    return (data.results as TMDBItem[]).map(m => toCard(m, 'netflix'))
  }
  if (platform === 'hbo') {
    const data = await tmdbFetch('/discover/movie', { with_watch_providers: '1899', watch_region: 'TH', sort_by: 'popularity.desc', page: String(page) })
    return (data.results as TMDBItem[]).map(m => toCard(m, 'hbo'))
  }
  const [netflix, hbo] = await Promise.all([
    tmdbFetch('/discover/movie', { with_watch_providers: '8', watch_region: 'TH', sort_by: 'popularity.desc', page: String(page) }),
    tmdbFetch('/discover/movie', { with_watch_providers: '1899', watch_region: 'TH', sort_by: 'popularity.desc', page: String(page) }),
  ])
  const result: MovieCardData[] = []
  const nCards = (netflix.results as TMDBItem[]).map(m => toCard(m, 'netflix'))
  const hCards = (hbo.results as TMDBItem[]).map(m => toCard(m, 'hbo'))
  for (let i = 0; i < Math.max(nCards.length, hCards.length); i++) {
    if (nCards[i]) result.push(nCards[i])
    if (hCards[i]) result.push(hCards[i])
  }
  return result
}

// ─── Search ──────────────────────────────────────────────────────────────────

export async function searchContent(query: string, type: 'all' | 'movie' | 'series' = 'all') {
  const endpoint = type === 'movie' ? '/search/movie' : type === 'series' ? '/search/tv' : '/search/multi'
  const data = await tmdbFetch(endpoint, { query, include_adult: 'false' })
  return (data.results as TMDBItem[])
    .filter(item => item.poster_path && item.media_type !== 'person')
    .map(item => toCard(item))
}

export async function getDiscover(platform: 'all' | 'netflix' | 'hbo') {
  const [pop, netflixTop, hboTop] = await Promise.all([
    tmdbFetch('/discover/movie', { with_watch_providers: '8|1899', watch_region: 'TH', sort_by: 'popularity.desc' }),
    tmdbFetch('/discover/movie', { with_watch_providers: '8', watch_region: 'TH', sort_by: 'popularity.desc' }),
    tmdbFetch('/discover/movie', { with_watch_providers: '1899', watch_region: 'TH', sort_by: 'popularity.desc' }),
  ])
  const netflixIds = new Set<number>(netflixTop.results.map((m: TMDBItem) => m.id))
  const hboIds = new Set<number>(hboTop.results.map((m: TMDBItem) => m.id))
  return {
    popular: (pop.results as TMDBItem[]).slice(0, 8).map((m: TMDBItem) => {
      const p = netflixIds.has(m.id) ? 'netflix' : hboIds.has(m.id) ? 'hbo' : undefined
      return toCard(m, p as 'netflix' | 'hbo' | undefined)
    }),
    netflixTop: (netflixTop.results as TMDBItem[]).slice(0, 6).map(m => toCard(m, 'netflix')),
    hboTop: (hboTop.results as TMDBItem[]).slice(0, 6).map(m => toCard(m, 'hbo')),
  }
}

// ─── Movie Detail ────────────────────────────────────────────────────────────

export async function getMovieDetail(id: number) {
  const [detail, detailTh, credits, similar, providers, videos] = await Promise.all([
    tmdbFetch(`/movie/${id}`),
    tmdbFetch(`/movie/${id}`, { language: 'th-TH' }),
    tmdbFetch(`/movie/${id}/credits`),
    tmdbFetch(`/movie/${id}/similar`),
    tmdbFetch(`/movie/${id}/watch/providers`),
    tmdbFetch(`/movie/${id}/videos`),
  ])

  const thProviders = providers.results?.TH
  const flatrateIds = (thProviders?.flatrate || []).map((p: { provider_id: number }) => p.provider_id)
  const platform = determinePlatform(flatrateIds)

  const genres: string[] = (detail.genres || []).map((g: { name: string }) => g.name)
  const runtime = detail.runtime ? `${Math.floor(detail.runtime / 60)}h ${detail.runtime % 60}m` : 'N/A'
  const year = detail.release_date ? parseInt(detail.release_date.slice(0, 4)) : 0

  const cast = (credits.cast || []).slice(0, 8).map((c: { name: string; character: string; profile_path: string | null }) => ({
    name: c.name,
    role: c.character,
    avatarUrl: c.profile_path ? `${TMDB_IMAGE}/w185${c.profile_path}` : null,
  }))

  const similarMovies = (similar.results || []).slice(0, 6).map((m: TMDBItem) => toCard(m, platform))

  const trailer = (videos.results || []).find(
    (v: { type: string; site: string; key: string }) => v.type === 'Trailer' && v.site === 'YouTube'
  )
  const trailerUrl = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null

  return {
    id: detail.id,
    title: detail.title,
    year,
    rating: Math.round(detail.vote_average * 10) / 10,
    platform,
    runtime,
    genres,
    country: detail.production_countries?.[0]?.name || 'Unknown',
    language: detail.original_language?.toUpperCase() || 'Unknown',
    synopsis: detail.overview,
    synopsisTh: detailTh.overview || '',
    posterUrl: posterUrl(detail.poster_path),
    backdropUrl: backdropUrl(detail.backdrop_path),
    cast,
    similar: similarMovies,
    trailerUrl,
  }
}

// ─── TV Detail ───────────────────────────────────────────────────────────────

export async function getTVDetail(id: number) {
  const [detail, detailTh, credits, similar, providers, videos] = await Promise.all([
    tmdbFetch(`/tv/${id}`),
    tmdbFetch(`/tv/${id}`, { language: 'th-TH' }),
    tmdbFetch(`/tv/${id}/credits`),
    tmdbFetch(`/tv/${id}/similar`),
    tmdbFetch(`/tv/${id}/watch/providers`),
    tmdbFetch(`/tv/${id}/videos`),
  ])

  const thProviders = providers.results?.TH
  const flatrateIds = (thProviders?.flatrate || []).map((p: { provider_id: number }) => p.provider_id)
  const platform = determinePlatform(flatrateIds)

  const genres: string[] = (detail.genres || []).map((g: { name: string }) => g.name)
  const episodeRuntime = detail.episode_run_time?.[0]
  const runtime = episodeRuntime ? `${episodeRuntime}m / ep` : 'N/A'
  const year = detail.first_air_date ? parseInt(detail.first_air_date.slice(0, 4)) : 0

  const cast = (credits.cast || []).slice(0, 8).map((c: { name: string; character: string; profile_path: string | null }) => ({
    name: c.name,
    role: c.character,
    avatarUrl: c.profile_path ? `${TMDB_IMAGE}/w185${c.profile_path}` : null,
  }))

  const similarShows = (similar.results || []).slice(0, 6).map((m: TMDBItem) => toCard(m, platform, 'tv'))

  const trailer = (videos.results || []).find(
    (v: { type: string; site: string; key: string }) => v.type === 'Trailer' && v.site === 'YouTube'
  )
  const trailerUrl = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null

  return {
    id: detail.id,
    title: detail.name,
    year,
    rating: Math.round(detail.vote_average * 10) / 10,
    platform,
    runtime,
    genres,
    country: detail.origin_country?.[0] || 'Unknown',
    language: detail.original_language?.toUpperCase() || 'Unknown',
    synopsis: detail.overview,
    synopsisTh: detailTh.overview || '',
    posterUrl: posterUrl(detail.poster_path),
    backdropUrl: backdropUrl(detail.backdrop_path),
    cast,
    similar: similarShows,
    trailerUrl,
  }
}

// ─── Discover by Genre ───────────────────────────────────────────────────────

export async function discoverByGenre(genre: string, platform: 'all' | 'netflix' | 'hbo', sort: string) {
  const genreId = GENRE_MAP[genre.toLowerCase()]
  const params: Record<string, string> = {
    sort_by: sort === 'newest' ? 'release_date.desc' : sort === 'a_z' ? 'original_title.asc' : 'vote_average.desc',
    'vote_count.gte': '100',
    watch_region: 'TH',
  }
  if (genreId) params.with_genres = String(genreId)
  if (platform === 'netflix') params.with_watch_providers = '8'
  else if (platform === 'hbo') params.with_watch_providers = '384'
  else params.with_watch_providers = '8|1899'

  const data = await tmdbFetch('/discover/movie', params)
  const p = platform === 'all' ? undefined : platform
  return (data.results as TMDBItem[]).map(m => toCard(m, p))
}
