import { NextRequest, NextResponse } from 'next/server'
import { searchContent, getDiscover } from '@/lib/tmdb'

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q') || ''
  const type = (req.nextUrl.searchParams.get('type') || 'all') as 'all' | 'movie' | 'series'
  const platform = (req.nextUrl.searchParams.get('platform') || 'all') as 'all' | 'netflix' | 'hbo'
  try {
    if (query) {
      const results = await searchContent(query, type)
      return NextResponse.json({ results })
    } else {
      const discover = await getDiscover(platform)
      return NextResponse.json(discover)
    }
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch search' }, { status: 500 })
  }
}
