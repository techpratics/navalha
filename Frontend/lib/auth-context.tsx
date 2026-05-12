"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type UserRole = "admin" | "professional" | "client"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  professionalId?: string // For professionals, links to their professional record
  clientId?: string // For clients, links to their client record
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demonstration
const mockUsers: Record<string, { password: string; user: User }> = {
  // Admin
  "admin@barberpro.com": {
    password: "admin123",
    user: {
      id: "admin-1",
      name: "Carlos Silva",
      email: "admin@barberpro.com",
      role: "admin",
    },
  },
  // Professional - linked to professional record id "1" (João Santos)
  "joao.prof@barberpro.com": {
    password: "joao123",
    user: {
      id: "prof-1",
      name: "João Santos",
      email: "joao.prof@barberpro.com",
      role: "professional",
      professionalId: "1",
    },
  },
  // Professional - linked to professional record id "2" (Pedro Oliveira)
  "pedro.prof@barberpro.com": {
    password: "pedro123",
    user: {
      id: "prof-2",
      name: "Pedro Oliveira",
      email: "pedro.prof@barberpro.com",
      role: "professional",
      professionalId: "2",
    },
  },
  // Client - linked to client record id "1" (João Santos - client)
  "joao@email.com": {
    password: "cliente123",
    user: {
      id: "client-1",
      name: "João Santos",
      email: "joao@email.com",
      role: "client",
      clientId: "1",
    },
  },
  // Client - linked to client record id "2" (Maria Oliveira)
  "maria@email.com": {
    password: "cliente123",
    user: {
      id: "client-2",
      name: "Maria Oliveira",
      email: "maria@email.com",
      role: "client",
      clientId: "2",
    },
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("barberpro_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem("barberpro_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockUser = mockUsers[email.toLowerCase()]
    if (mockUser && mockUser.password === password) {
      setUser(mockUser.user)
      localStorage.setItem("barberpro_user", JSON.stringify(mockUser.user))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("barberpro_user")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Helper to check permissions
export function hasPermission(user: User | null, requiredRoles: UserRole[]): boolean {
  if (!user) return false
  return requiredRoles.includes(user.role)
}
