"use client"

import { useState } from "react"
import { Box, TextField, Button, Paper, Typography, Chip, Stack, Alert, CircularProgress } from "@mui/material"
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material"

const IdeaForm = ({ initialValues = {}, onSubmit, submitButtonText = "Submit", loading = false, error = null }) => {
  const [title, setTitle] = useState(initialValues.title || "")
  const [description, setDescription] = useState(initialValues.description || "")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState(initialValues.tags || [])
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!title.trim()) newErrors.title = "Title is required"
    if (!description.trim()) newErrors.description = "Description is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddTag = () => {
    if (!tagInput.trim()) return

    // Prevent duplicate tags
    if (!tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
    }

    setTagInput("")
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validate()) {
      onSubmit({
        title,
        description,
        tags,
      })
    }
  }

  const handleKeyDown = (e) => {
    // Add tag when Enter is pressed in the tag input
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {initialValues.title ? "Edit Idea" : "Create New Idea"}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          required
          error={!!errors.title}
          helperText={errors.title}
          disabled={loading}
        />

        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          required
          multiline
          rows={4}
          error={!!errors.description}
          helperText={errors.description}
          disabled={loading}
        />

        <Box sx={{ mt: 2, mb: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            Tags
          </Typography>

          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <TextField
              label="Add a tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              size="small"
              disabled={loading}
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="outlined"
              onClick={handleAddTag}
              disabled={!tagInput.trim() || loading}
              startIcon={<AddIcon />}
            >
              Add
            </Button>
          </Box>

          <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap", gap: 1 }}>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={() => handleRemoveTag(tag)}
                color="primary"
                variant="outlined"
                deleteIcon={<CloseIcon />}
                disabled={loading}
              />
            ))}
          </Stack>
        </Box>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Submitting..." : submitButtonText}
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

export default IdeaForm
