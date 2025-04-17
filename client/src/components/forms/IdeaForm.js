"use client"

import { useState } from "react"

const IdeaForm = ({ initialValues = {}, onSubmit, submitButtonText = "Submit", loading = false }) => {
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
    <form className="idea-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          className={errors.title ? "error" : ""}
          aria-invalid={errors.title ? "true" : "false"}
          aria-describedby={errors.title ? "title-error" : undefined}
        />
        {errors.title && (
          <span className="error-message" id="title-error" role="alert">
            {errors.title}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          disabled={loading}
          className={errors.description ? "error" : ""}
          aria-invalid={errors.description ? "true" : "false"}
          aria-describedby={errors.description ? "description-error" : undefined}
        />
        {errors.description && (
          <span className="error-message" id="description-error" role="alert">
            {errors.description}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="tags">Tags</label>
        <div className="tag-input-container">
          <input
            type="text"
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a tag and press Enter"
            disabled={loading}
          />
          <button
            type="button"
            onClick={handleAddTag}
            disabled={!tagInput.trim() || loading}
            className="btn-secondary"
            aria-label="Add tag"
          >
            Add
          </button>
        </div>

        {tags.length > 0 && (
          <div className="tags-container" role="list" aria-label="Selected tags">
            {tags.map((tag, index) => (
              <span key={index} className="tag" role="listitem">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="tag-remove"
                  aria-label={`Remove tag ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={loading} aria-busy={loading}>
          {loading ? "Submitting..." : submitButtonText}
        </button>
      </div>
    </form>
  )
}

export default IdeaForm
