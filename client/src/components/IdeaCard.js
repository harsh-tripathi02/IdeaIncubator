"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../utils/api"

const IdeaCard = ({ idea, userId, refresh }) => {
  const [comment, setComment] = useState("")
  const navigate = useNavigate()

  const hasVoted = idea.votes.includes(userId)

  const deleteIdea = async () => {
    if (!window.confirm("Are you sure you want to delete this idea?")) return
    try {
      await api.delete(`/ideas/${idea._id}`)
      refresh()
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed")
    }
  }

  const vote = async (type) => {
    try {
      const endpoint = type === "up" ? `/ideas/${idea._id}/upvote` : `/ideas/${idea._id}/downvote`
      await api.post(endpoint)
      refresh()
    } catch (err) {
      alert(err.response?.data?.message || "Voting error")
    }
  }

  const addComment = async (e) => {
    e.preventDefault()
    try {
      await api.post(`/ideas/${idea._id}/comments`, { text: comment })
      setComment("")
      refresh()
    } catch (err) {
      alert(err.response?.data?.message || "Comment failed")
    }
  }

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "6px",
        padding: "10px",
        marginBottom: "15px",
      }}
    >
      <h3>{idea.title}</h3>
      <p>{idea.description}</p>
      <p>
        <strong>Tags:</strong> {idea.tags.join(", ")}
      </p>

      {idea.createdBy === userId && (
        <>
          <button onClick={() => navigate(`/edit-idea/${idea._id}`)}>Edit</button>{" "}
          <button onClick={deleteIdea}>Delete</button>
        </>
      )}

      <div style={{ marginTop: "10px" }}>
        <button style={{ color: hasVoted ? "green" : "black" }} onClick={() => vote("up")}>
          ⬆️
        </button>
        <strong style={{ margin: "0 10px" }}>{idea.votes.length}</strong>
        <button style={{ color: hasVoted ? "red" : "black" }} onClick={() => vote("down")}>
          ⬇️
        </button>
      </div>

      <div style={{ marginTop: "10px" }}>
        <h4>Comments 💬</h4>
        {idea.comments.map((comment, idx) => (
          <div key={idx} style={{ borderBottom: "1px solid #eee", marginBottom: "5px" }}>
            <p>{comment.text}</p>
            <small>🕒 {new Date(comment.createdAt).toLocaleString()}</small>
          </div>
        ))}

        <form onSubmit={addComment}>
          <input
            type="text"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <button type="submit">Add</button>
        </form>
      </div>
    </div>
  )
}

export default IdeaCard
