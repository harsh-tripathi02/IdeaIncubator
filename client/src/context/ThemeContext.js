"use client"

import { createContext, useContext, useState, useEffect, useMemo } from "react"
import { createTheme } from "@mui/material/styles"

// Create context
const ThemeContext = createContext()

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Check if dark mode is stored in localStorage
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem("themeMode")
    return savedMode || "light"
  })

  // Update localStorage when mode changes
  useEffect(() => {
    localStorage.setItem("themeMode", mode)
  }, [mode])

  // Toggle theme function
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"))
  }

  // Create theme based on current mode
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#7e57c2", // Purple shade
          },
          secondary: {
            main: "#26a69a", // Teal shade
          },
          background: {
            default: mode === "light" ? "#f5f5f5" : "#121212",
            paper: mode === "light" ? "#ffffff" : "#1e1e1e",
          },
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontSize: "2.5rem",
            fontWeight: 500,
          },
          h2: {
            fontSize: "2rem",
            fontWeight: 500,
          },
          h3: {
            fontSize: "1.75rem",
            fontWeight: 500,
          },
          h4: {
            fontSize: "1.5rem",
            fontWeight: 500,
          },
          h5: {
            fontSize: "1.25rem",
            fontWeight: 500,
          },
          h6: {
            fontSize: "1rem",
            fontWeight: 500,
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: "none",
                fontWeight: 500,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow: mode === "light" ? "0 2px 8px rgba(0,0,0,0.1)" : "0 2px 8px rgba(0,0,0,0.4)",
              },
            },
          },
        },
      }),
    [mode],
  )

  return <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>{children}</ThemeContext.Provider>
}

// Custom hook to use the theme context
export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider")
  }
  return context
}
