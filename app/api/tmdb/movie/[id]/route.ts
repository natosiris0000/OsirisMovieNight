import { NextRequest, NextResponse } from 'next/server'
import { getMovieDetail } from '@/lib/tmdb'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params
  const id = parseInt(idStr)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  try {
    const data = await getMovieDetail(id)
    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch movie' }, { status: 500 })
  }
}
