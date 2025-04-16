"use client"

// pages/Idea.js

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../utils/api"

function Idea({ user }) {
  const { id } = useParams()
  const [idea, setIdea] = useState(null)
  const [comment, setComment] = useState("")

  const fetchIdea = async () => {
    try {
      const res = await api.get(`/ideas/${id}`)
      setIdea(res.data)
    } catch (err) {
      alert("Error fetching idea.")
    }
  }

  useEffect(() => {
    fetchIdea()
  }, [id])

  const handleVote = async (type) => {
    try {
      await api.post(`/ideas/${id}/${type}`)
      fetchIdea()
    } catch (err) {
      alert(err.response.data.message)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    try {
      await api.post(`/ideas/${id}/comment`, { text: comment })
      setComment("")
      fetchIdea()
    } catch (err) {
      alert("Error posting comment")
    }
  }

  if (!idea) return <div>Loading...</div>

  return (
    <div>
      <h2>{idea.title}</h2>
      <p>{idea.description}</p>
      <p>
        <strong>Created by:</strong> {idea.username}
      </p>
      <p>
        <strong>Tags:</strong> {idea.tags.join(", ")}
      </p>
      <div>
        <button onClick={() => handleVote("upvote")}>👍 {idea.upvotes.length}</button>
        <button onClick={() => handleVote("downvote")}>👎 {idea.downvotes.length}</button>
      </div>

      <hr />
      <h4>Comments 💬</h4>
      {idea.comments.map((c, i) => (
        <div key={i}>
          <strong>{c.username}</strong>: {c.text}
          <small style={{ marginLeft: "10px" }}>{new Date(c.timestamp).toLocaleString()}</small>
        </div>
      ))}
      {user && (
        <form onSubmit={handleComment}>
          <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment" required />
          <button type="submit">Post</button>
        </form>
      )}
    </div>
  )
}

export default Idea
