"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import api from "../utils/api"

const IdeaDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [idea, setIdea] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchIdea()
  }, [id])

  const fetchIdea = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await api.get(`/ideas/${id}`)
      setIdea(res.data)
    } catch (err) {
      console.error("Error fetching idea:", err)
      setError(err.response?.data?.message || "Failed to load idea")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this idea?")) {
      try {
        await api.delete(`/ideas/${id}`)
        navigate("/")
      } catch (err) {
        console.error("Error deleting idea:", err)
        setError(err.response?.data?.message || "Error deleting idea")
      }
    }
  }

  const handleVote = async (voteType) => {
    if (!user) {
      navigate("/login")
      return
    }

    try {
      await api.post(`/ideas/${id}/${voteType}`)
      fetchIdea()
    } catch (err) {
      console.error("Error voting:", err)
      setError(err.response?.data?.message || "Error voting")
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return

    if (!user) {
      navigate("/login")
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      await api.post(`/ideas/${id}/comments`, { text: comment })
      setComment("")
      fetchIdea()
    } catch (err) {
      console.error("Error posting comment:", err)
      setError(err.response?.data?.message || "Error posting comment")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-spinner" aria-live="polite">
        Loading idea...
      </div>
    )
  }

  if (error || !idea) {
    return (
      <div className="error-alert" role="alert">
        {error || "Idea not found"}
      </div>
    )
  }

  const isOwner = user && idea.creator === user._id
  const hasUpvoted = user && idea.upvotes?.includes(user._id)
  const hasDownvoted = user && idea.downvotes?.includes(user._id)

  return (
    <article className="idea-details-page">
      <div className="idea-header">
        <h1>{idea.title}</h1>

        {isOwner && (
          <div className="idea-actions">
            <Link to={`/edit-idea/${id}`} className="btn-secondary">
              Edit
            </Link>
            <button onClick={handleDelete} className="btn-danger">
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="idea-meta">
        <span className="idea-author">By {idea.username || "Unknown"}</span>
        <span className="idea-date">{new Date(idea.createdAt).toLocaleDateString()}</span>
      </div>

      <div className="idea-content">
        <p>{idea.description}</p>
      </div>

      {idea.tags && idea.tags.length > 0 && (
        <div className="idea-tags">
          {idea.tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <div className="idea-voting">
        <button
          onClick={() => handleVote("upvote")}
          className={`btn-vote ${hasUpvoted ? "active" : ""}`}
          disabled={!user}
          aria-pressed={hasUpvoted}
          aria-label="Upvote"
        >
          👍 Upvote ({idea.upvotes?.length || 0})
        </button>

        <button
          onClick={() => handleVote("downvote")}
          className={`btn-vote ${hasDownvoted ? "active" : ""}`}
          disabled={!user}
          aria-pressed={hasDownvoted}
          aria-label="Downvote"
        >
          👎 Downvote ({idea.downvotes?.length || 0})
        </button>
      </div>

      <section className="comments-section" aria-labelledby="comments-heading">
        <h2 id="comments-heading">Comments</h2>

        {idea.comments && idea.comments.length > 0 ? (
          <div className="comments-list">
            {idea.comments.map((comment, index) => (
              <div key={index} className="comment">
                <div className="comment-header">
                  <span className="comment-author">{comment.username}</span>
                  <span className="comment-date">{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
                <p className="comment-text">{comment.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        )}

        {user ? (
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <label htmlFor="comment" className="sr-only">
              Write a comment
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              disabled={submitting}
              required
            />
            <button
              type="submit"
              className="btn-primary"
              disabled={!comment.trim() || submitting}
              aria-busy={submitting}
            >
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </form>
        ) : (
          <div className="login-prompt">
            <p>
              Please <Link to="/login">login</Link> to comment
            </p>
          </div>
        )}
      </section>
    </article>
  )
}

export default IdeaDetails
