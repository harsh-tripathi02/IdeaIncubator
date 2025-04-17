"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import IdeaForm from "../components/forms/IdeaForm"
import { useAuth } from "../contexts/AuthContext"
import api from "../services/api"

const EditIdea = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [idea, setIdea] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchIdea()
  }, [id])

  const fetchIdea = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await api.get(`/ideas/${id}`)
      setIdea(res.data)

      // Check if user is the creator of the idea
      if (user && res.data.creator !== user._id) {
        setError("You can only edit your own ideas")
      }
    } catch (err) {
      console.error("Error fetching idea:", err)
      setError(err.response?.data?.message || "Failed to load idea")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData) => {
    setSubmitting(true)
    setError(null)

    try {
      await api.put(`/ideas/${id}`, {
        ...formData,
        tags: formData.tags,
      })

      navigate(`/ideas/${id}`)
    } catch (err) {
      console.error("Error updating idea:", err)
      setError(err.response?.data?.message || "Failed to update idea")
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

  if (error && !idea) {
    return (
      <div className="error-alert" role="alert">
        {error}
      </div>
    )
  }

  return (
    <div className="edit-idea-page">
      <h1>Edit Your Idea</h1>

      {error && (
        <div className="error-alert" role="alert">
          {error}
        </div>
      )}

      {idea && (
        <IdeaForm
          initialValues={{
            title: idea.title,
            description: idea.description,
            tags: idea.tags || [],
          }}
          onSubmit={handleSubmit}
          submitButtonText="Update Idea"
          loading={submitting}
        />
      )}
    </div>
  )
}

export default EditIdea
