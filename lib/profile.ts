const PROFILE_KEY = 'osiris_profile'

export interface UserProfile {
  displayName: string
  username: string
  email: string
  bio: string
  genres: string[]
  preferredPlatform: 'all' | 'netflix' | 'hbo'
}

const DEFAULT_PROFILE: UserProfile = {
  displayName: 'Movie Lover',
  username: '@movielover',
  email: 'user@email.com',
  bio: '',
  genres: ['Sci-Fi', 'Drama', 'Thriller'],
  preferredPlatform: 'all',
}

export function getProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE
  try {
    const saved = localStorage.getItem(PROFILE_KEY)
    return saved ? { ...DEFAULT_PROFILE, ...JSON.parse(saved) } : DEFAULT_PROFILE
  } catch {
    return DEFAULT_PROFILE
  }
}

export function saveProfile(profile: Partial<UserProfile>) {
  const current = getProfile()
  localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...current, ...profile }))
  window.dispatchEvent(new Event('profile-changed'))
}
