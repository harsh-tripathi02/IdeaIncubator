"use client"

import { createContext, useContext, useState, useCallback } from "react"
import api from "../services/api"

// Create context
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is authenticated
  const checkAuth = useCallback(async () => {
    setLoading(true)
    const token = localStorage.getItem("token")

    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const response = await api.get("/users/me")
      setUser(response.data)
    } catch (err) {
      console.error("Authentication check failed:", err)
      localStorage.removeItem("token")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // Login function
  const login = async (email, password) => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.post("/users/login", { email, password })
      localStorage.setItem("token", response.data.token)
      setUser(response.data.user)
      return true
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Signup function
  const signup = async (userData) => {
    setLoading(true)
    setError(null)

    try {
      await api.post("/users/register", userData)
      return true
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  // Update user profile
  const updateProfile = async (userData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.put("/users/profile", userData)
      setUser(response.data)
      return true
    } catch (err) {
      setError(err.response?.data?.message || "Profile update failed. Please try again.")
      return false
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        checkAuth,
        updateProfile,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
