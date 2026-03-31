import { NextResponse } from 'next/server'
import { getHomeData } from '@/lib/tmdb'

export async function GET() {
  try {
    const data = await getHomeData()
    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch home data' }, { status: 500 })
  }
}
