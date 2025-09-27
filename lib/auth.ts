import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export interface AuthUser {
  userId: string
  email: string
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN'
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as AuthUser
    return decoded
  } catch (error) {
    return null
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return !!user
}

export async function hasRole(role: 'PATIENT' | 'DOCTOR' | 'ADMIN'): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === role
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}

export async function requireRole(role: 'PATIENT' | 'DOCTOR' | 'ADMIN'): Promise<AuthUser> {
  const user = await requireAuth()
  if (user.role !== role) {
    throw new Error(`Role ${role} required`)
  }
  return user
}
