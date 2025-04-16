"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import api from "../../services/api"

const IdeaCard = ({ idea, onUpdate }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const isOwner = user && idea.creator === user._id
  const hasUpvoted = user && idea.upvotes?.includes(user._id)
  const hasDownvoted = user && idea.downvotes?.includes(user._id)

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this idea?")) {
      try {
        await api.delete(`/ideas/${idea._id}`)
        onUpdate()
      } catch (err) {
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
      await api.post(`/ideas/${idea._id}/${voteType}`)
      onUpdate()
    } catch (err) {
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
      await api.post(`/ideas/${idea._id}/comments`, { text: comment })
      setComment("")
      onUpdate()
    } catch (err) {
      setError(err.response?.data?.message || "Error posting comment")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <article className="idea-card">
      <div className="idea-card-header">
        <Link to={`/ideas/${idea._id}`} className="idea-title">
          {idea.title}
        </Link>

        {isOwner && (
          <div className="idea-actions">
            <button onClick={() => navigate(`/edit-idea/${idea._id}`)} className="btn-icon" aria-label="Edit idea">
              ✏️
            </button>
            <button onClick={handleDelete} className="btn-icon" aria-label="Delete idea">
              🗑️
            </button>
          </div>
        )}
      </div>

      <p className="idea-description">{idea.description}</p>

      {idea.tags && idea.tags.length > 0 && (
        <div className="idea-tags">
          {idea.tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="idea-meta">
        <span className="idea-author">By {idea.username || "Unknown"}</span>
        <span className="idea-date">{new Date(idea.createdAt).toLocaleDateString()}</span>
      </div>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <div className="idea-interactions">
        <div className="vote-buttons">
          <button
            onClick={() => handleVote("upvote")}
            className={`btn-vote ${hasUpvoted ? "active" : ""}`}
            aria-label="Upvote"
            aria-pressed={hasUpvoted}
          >
            👍 <span>{idea.upvotes?.length || 0}</span>
          </button>

          <button
            onClick={() => handleVote("downvote")}
            className={`btn-vote ${hasDownvoted ? "active" : ""}`}
            aria-label="Downvote"
            aria-pressed={hasDownvoted}
          >
            👎 <span>{idea.downvotes?.length || 0}</span>
          </button>
        </div>

        <button
          className="btn-comments"
          onClick={() => setShowComments(!showComments)}
          aria-expanded={showComments}
          aria-controls={`comments-section-${idea._id}`}
        >
          💬 Comments ({idea.comments?.length || 0})
        </button>
      </div>

      {showComments && (
        <div className="comments-section" id={`comments-section-${idea._id}`}>
          <h3>Comments</h3>

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

          {user && (
            <form className="comment-form" onSubmit={handleCommentSubmit}>
              <label htmlFor={`comment-${idea._id}`} className="sr-only">
                Write a comment
              </label>
              <textarea
                id={`comment-${idea._id}`}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                disabled={submitting}
                required
              />
              <button type="submit" className="btn-primary" disabled={!comment.trim() || submitting}>
                {submitting ? "Posting..." : "Post Comment"}
              </button>
            </form>
          )}
        </div>
      )}
    </article>
  )
}

export default IdeaCard
