"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import IdeaCard from "../components/ideas/IdeaCard"
import { useAuth } from "../contexts/AuthContext"
import api from "../services/api"

const Home = () => {
  const { isAuthenticated } = useAuth()
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState([])
  const [allTags, setAllTags] = useState([])

  useEffect(() => {
    fetchIdeas()
    fetchTags()
  }, [page, searchQuery, selectedTags])

  const fetchIdeas = async () => {
    setLoading(true)
    setError(null)

    try {
      // Build query parameters
      const params = new URLSearchParams()
      params.append("page", page.toString())
      params.append("limit", "5")

      if (searchQuery) {
        params.append("search", searchQuery)
      }

      if (selectedTags.length > 0) {
        params.append("tags", selectedTags.join(","))
      }

      const res = await api.get(`/ideas?${params.toString()}`)
      setIdeas(res.data.ideas)
      setTotalPages(res.data.totalPages || 1)
    } catch (err) {
      console.error("Error fetching ideas:", err)
      setError("Failed to load ideas. Please try again later.")
      setIdeas([])
    } finally {
      setLoading(false)
    }
  }

  const fetchTags = async () => {
    try {
      // This endpoint would need to be implemented on the backend
      const res = await api.get("/ideas/tags")
      setAllTags(res.data || [])
    } catch (err) {
      console.error("Error fetching tags:", err)
      // Fallback to empty array if endpoint doesn't exist
      setAllTags([])
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setSearchQuery(search)
    setPage(1) // Reset to first page on new search
  }

  const handleClearSearch = () => {
    setSearch("")
    setSearchQuery("")
    setPage(1)
  }

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
    setPage(1) // Reset to first page when changing filters
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Discover Innovative Ideas</h1>
          <p>Share, vote, and collaborate on ideas that matter</p>
          {isAuthenticated && (
            <Link to="/create-idea" className="btn-primary">
              Share Your Idea
            </Link>
          )}
        </div>
      </section>

      <section className="search-section" aria-labelledby="search-heading">
        <h2 id="search-heading" className="sr-only">
          Search Ideas
        </h2>

        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-container">
            <label htmlFor="search" className="sr-only">
              Search ideas
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search ideas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            {search && (
              <button type="button" onClick={handleClearSearch} className="search-clear" aria-label="Clear search">
                ×
              </button>
            )}
          </div>
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>

        {allTags.length > 0 && (
          <div className="tags-filter">
            <h3>Filter by tags:</h3>
            <div className="tags-container" role="list" aria-label="Filter tags">
              {allTags.map((tag, index) => (
                <span
                  key={index}
                  className={`tag ${selectedTags.includes(tag) ? "active" : ""}`}
                  onClick={() => handleTagToggle(tag)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selectedTags.includes(tag)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleTagToggle(tag)
                    }
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="ideas-section" aria-labelledby="ideas-heading">
        <h2 id="ideas-heading">Latest Ideas</h2>

        {loading ? (
          <div className="loading-spinner" aria-live="polite">
            Loading ideas...
          </div>
        ) : error ? (
          <div className="error-message" role="alert">
            {error}
          </div>
        ) : ideas.length > 0 ? (
          <>
            <div className="ideas-grid">
              {ideas.map((idea) => (
                <IdeaCard key={idea._id} idea={idea} onUpdate={fetchIdeas} />
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="pagination" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="btn-page"
                  aria-label="Previous page"
                >
                  Previous
                </button>

                <span className="page-info" aria-current="page">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="btn-page"
                  aria-label="Next page"
                >
                  Next
                </button>
              </nav>
            )}
          </>
        ) : (
          <div className="no-ideas">
            <p>No ideas found</p>
            {searchQuery || selectedTags.length > 0 ? (
              <p>Try adjusting your search or filters</p>
            ) : (
              <p>Be the first to share an idea!</p>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home
