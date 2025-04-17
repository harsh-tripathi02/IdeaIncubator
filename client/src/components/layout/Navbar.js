"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useTheme } from "../../contexts/ThemeContext"

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <header className="navbar" ref={navRef}>
      <div className="navbar-container">
        <Link to="/" className="logo" aria-label="Idea Incubator Home">
          <span className="logo-icon" aria-hidden="true">
            💡
          </span>
          <span className="logo-text">Idea Incubator</span>
        </Link>

        <div className="navbar-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <button
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span className={`hamburger ${menuOpen ? "open" : ""}`}></span>
          </button>
        </div>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/create-idea" className={location.pathname === "/create-idea" ? "active" : ""}>
                Create Idea
              </Link>
              <Link to="/profile" className={location.pathname === "/profile" ? "active" : ""}>
                Profile
              </Link>
              <button className="nav-button" onClick={handleLogout}>
                Logout
              </button>
              <div className="user-avatar" aria-label={`Logged in as ${user?.username}`}>
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className={location.pathname === "/login" ? "active" : ""}>
                Login
              </Link>
              <Link to="/signup" className={location.pathname === "/signup" ? "active" : ""}>
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
