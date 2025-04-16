"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import IdeaForm from "../components/forms/IdeaForm"
import api from "../utils/api"

const CreateIdea = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (formData) => {
    setLoading(true)
    setError(null)

    try {
      await api.post("/ideas", {
        ...formData,
        tags: formData.tags,
      })

      navigate("/")
    } catch (err) {
      console.error("Error creating idea:", err)
      setError(err.response?.data?.message || "Failed to create idea. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-idea-page">
      <h1>Share Your Idea</h1>

      {error && (
        <div className="error-alert" role="alert">
          {error}
        </div>
      )}

      <IdeaForm onSubmit={handleSubmit} submitButtonText="Create Idea" loading={loading} />
    </div>
  )
}

export default CreateIdea
