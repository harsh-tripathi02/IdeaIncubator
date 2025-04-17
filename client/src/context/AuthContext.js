"use client"

import { createContext, useContext, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import api from "../utils/api"

// Create context
const AuthContext = createContext()

// Auth provider component
export const AuthProvider = ({ children, initialUser = null }) => {
  const [user, setUser] = useState(initialUser)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Login function
  const login = useCallback(
    async (email, password) => {
      setLoading(true)
      setError(null)
      try {
        const res = await api.post("/users/login", { email, password })
        const { token, user: userData } = res.data

        // Save token to localStorage
        localStorage.setItem("token", token)

        // Set user in state
        setUser(userData)

        // Navigate to home page
        navigate("/")
        return true
      } catch (err) {
        setError(err.response?.data?.message || "Login failed")
        return false
      } finally {
        setLoading(false)
      }
    },
    [navigate],
  )

  // Register function
  const register = useCallback(
    async (username, email, password) => {
      setLoading(true)
      setError(null)
      try {
        await api.post("/users/register", { username, email, password })
        navigate("/login")
        return true
      } catch (err) {
        setError(err.response?.data?.message || "Registration failed")
        return false
      } finally {
        setLoading(false)
      }
    },
    [navigate],
  )

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem("token")
    setUser(null)
    navigate("/login")
  }, [navigate])

  // Update user profile
  const updateProfile = useCallback(async (userData) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.put("/users/profile", userData)
      setUser(res.data)
      return true
    } catch (err) {
      setError(err.response?.data?.message || "Profile update failed")
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
