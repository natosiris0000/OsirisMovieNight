import { NextRequest, NextResponse } from 'next/server'
import { getTrending } from '@/lib/tmdb'

export async function GET(req: NextRequest) {
  const platform = (req.nextUrl.searchParams.get('platform') || 'all') as 'all' | 'netflix' | 'hbo'
  try {
    const data = await getTrending(platform)
    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch trending' }, { status: 500 })
  }
}
