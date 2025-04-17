"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Typography, Box, Alert } from "@mui/material"
import IdeaForm from "../components/ideas/IdeaForm"
import api from "../utils/api"

const AddIdea = () => {
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
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Share Your Idea 💡
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <IdeaForm onSubmit={handleSubmit} submitButtonText="Create Idea" loading={loading} error={error} />
      </Box>
    </Container>
  )
}

export default AddIdea
