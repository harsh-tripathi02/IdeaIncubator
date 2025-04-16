"use client"

import { useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"
import Layout from "./components/layout/Layout"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Profile from "./pages/Profile"
import IdeaDetails from "./pages/IdeaDetails"
import CreateIdea from "./pages/CreateIdea"
import EditIdea from "./pages/EditIdea"
import NotFound from "./pages/NotFound"
import "./styles/App.css"

// Protected route component to handle authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-spinner" aria-live="polite">
        Loading...
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  const { checkAuth } = useAuth()

  // Check authentication status when app loads
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="ideas/:id" element={<IdeaDetails />} />

        {/* Protected routes */}
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="create-idea"
          element={
            <ProtectedRoute>
              <CreateIdea />
            </ProtectedRoute>
          }
        />
        <Route
          path="edit-idea/:id"
          element={
            <ProtectedRoute>
              <EditIdea />
            </ProtectedRoute>
          }
        />

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
