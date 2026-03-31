import { NextRequest, NextResponse } from 'next/server'
import { discoverByGenre } from '@/lib/tmdb'

export async function GET(req: NextRequest) {
  const genre = req.nextUrl.searchParams.get('genre') || ''
  const platform = (req.nextUrl.searchParams.get('platform') || 'all') as 'all' | 'netflix' | 'hbo'
  const sort = req.nextUrl.searchParams.get('sort') || 'top_rated'
  try {
    const data = await discoverByGenre(genre, platform, sort)
    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch discover' }, { status: 500 })
  }
}
