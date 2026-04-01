// localStorage-based auth — demo purposes only, not production-secure

const USERS_KEY = 'osiris_users'
const SESSION_KEY = 'osiris_session'

export interface AuthUser {
  id: string
  displayName: string
  email: string
  createdAt: number
}

interface StoredUser extends AuthUser {
  password: string
}

export interface Session {
  userId: string
  email: string
  displayName: string
}

function getUsers(): StoredUser[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') } catch { return [] }
}

function setUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function broadcast() {
  window.dispatchEvent(new Event('auth-changed'))
}

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null') } catch { return null }
}

function setSession(session: Session | null) {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  else localStorage.removeItem(SESSION_KEY)
  broadcast()
}

export function getCurrentUser(): AuthUser | null {
  const session = getSession()
  if (!session) return null
  const user = getUsers().find(u => u.id === session.userId)
  if (!user) return null
  return { id: user.id, displayName: user.displayName, email: user.email, createdAt: user.createdAt }
}

export function signUp(
  displayName: string,
  email: string,
  password: string
): { error?: string } {
  if (!displayName.trim()) return { error: 'Display name is required.' }
  if (!email.trim()) return { error: 'Email is required.' }
  if (password.length < 6) return { error: 'Password must be at least 6 characters.' }

  const users = getUsers()
  if (users.find(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
    return { error: 'An account with this email already exists.' }
  }

  const newUser: StoredUser = {
    id: Date.now().toString(),
    displayName: displayName.trim(),
    email: email.trim().toLowerCase(),
    password,
    createdAt: Date.now(),
  }
  setUsers([...users, newUser])
  setSession({ userId: newUser.id, email: newUser.email, displayName: newUser.displayName })
  return {}
}

export function signIn(email: string, password: string): { error?: string } {
  if (!email.trim()) return { error: 'Email is required.' }
  if (!password) return { error: 'Password is required.' }

  const users = getUsers()
  const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase())
  if (!user) return { error: 'No account found with this email.' }
  if (user.password !== password) return { error: 'Incorrect password.' }

  setSession({ userId: user.id, email: user.email, displayName: user.displayName })
  return {}
}

export function signOut() {
  setSession(null)
}

export function updateAuthUser(
  userId: string,
  updates: Partial<Pick<StoredUser, 'displayName' | 'email'>>
) {
  const users = getUsers()
  setUsers(users.map(u => u.id === userId ? { ...u, ...updates } : u))
  const session = getSession()
  if (session?.userId === userId) {
    setSession({ ...session, ...updates })
  }
}
