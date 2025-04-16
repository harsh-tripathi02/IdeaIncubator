"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import IdeaCard from "../components/ideas/IdeaCard"
import api from "../utils/api"

const Profile = () => {
  const { user, updateProfile, error, setError } = useAuth()

  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("ideas")
  const [userIdeas, setUserIdeas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
      })
      fetchUserIdeas()
    }
  }, [user])

  const fetchUserIdeas = async () => {
    setLoading(true)
    try {
      const response = await api.get("/ideas/user")
      setUserIdeas(response.data || [])
    } catch (err) {
      console.error("Error fetching user ideas:", err)
      setUserIdeas([])
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear field-specific error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      })
    }
  }

  const validate = () => {
    const errors = {}

    if (!formData.username) {
      errors.username = "Username is required"
    }

    if (!formData.email) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Clear any previous errors
    setError(null)

    if (validate()) {
      setIsSubmitting(true)

      try {
        const success = await updateProfile(formData)
        if (success) {
          setEditing(false)
        }
      } catch (err) {
        console.error("Profile update error:", err)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  if (!user) {
    return (
      <div className="loading-spinner" aria-live="polite">
        Loading profile...
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar" aria-hidden="true">
          {user.username?.charAt(0).toUpperCase() || "U"}
        </div>

        <div className="profile-info">
          <h1>{user.username}</h1>
          <p>Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
        </div>

        {!editing && (
          <button className="btn-secondary" onClick={() => setEditing(true)} aria-label="Edit profile">
            Edit Profile
          </button>
        )}
      </div>

      {error && (
        <div className="error-alert" role="alert">
          {error}
        </div>
      )}

      {editing ? (
        <div className="profile-edit">
          <h2>Edit Profile</h2>

          <form className="profile-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={formErrors.username ? "error" : ""}
                disabled={isSubmitting}
                aria-invalid={formErrors.username ? "true" : "false"}
                aria-describedby={formErrors.username ? "username-error" : undefined}
              />
              {formErrors.username && (
                <span className="error-message" id="username-error" role="alert">
                  {formErrors.username}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={formErrors.email ? "error" : ""}
                disabled={isSubmitting}
                aria-invalid={formErrors.email ? "true" : "false"}
                aria-describedby={formErrors.email ? "email-error" : undefined}
              />
              {formErrors.email && (
                <span className="error-message" id="email-error" role="alert">
                  {formErrors.email}
                </span>
              )}
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setEditing(false)
                  setFormData({
                    username: user.username || "",
                    email: user.email || "",
                  })
                  setFormErrors({})
                }}
                disabled={isSubmitting}
              >
                Cancel
              </button>

              <button type="submit" className="btn-primary" disabled={isSubmitting} aria-busy={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="profile-details">
          <div className="detail-item">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{user.email}</span>
          </div>
        </div>
      )}

      <div className="profile-tabs" role="tablist">
        <button
          className={`tab-button ${activeTab === "ideas" ? "active" : ""}`}
          onClick={() => setActiveTab("ideas")}
          role="tab"
          aria-selected={activeTab === "ideas"}
          aria-controls="ideas-tab-content"
          id="ideas-tab"
        >
          My Ideas
        </button>
        <button
          className={`tab-button ${activeTab === "activity" ? "active" : ""}`}
          onClick={() => setActiveTab("activity")}
          role="tab"
          aria-selected={activeTab === "activity"}
          aria-controls="activity-tab-content"
          id="activity-tab"
        >
          Activity
        </button>
      </div>

      <div className="tab-content">
        <div id="ideas-tab-content" role="tabpanel" aria-labelledby="ideas-tab" hidden={activeTab !== "ideas"}>
          {activeTab === "ideas" && (
            <>
              {loading ? (
                <div className="loading-spinner" aria-live="polite">
                  Loading ideas...
                </div>
              ) : userIdeas.length > 0 ? (
                <div className="ideas-grid">
                  {userIdeas.map((idea) => (
                    <IdeaCard key={idea._id} idea={idea} onUpdate={fetchUserIdeas} />
                  ))}
                </div>
              ) : (
                <div className="no-ideas">
                  <p>You haven't posted any ideas yet.</p>
                  <a href="/create-idea" className="btn-primary">
                    Create Your First Idea
                  </a>
                </div>
              )}
            </>
          )}
        </div>

        <div id="activity-tab-content" role="tabpanel" aria-labelledby="activity-tab" hidden={activeTab !== "activity"}>
          {activeTab === "activity" && (
            <div className="activity-tab">
              <p className="coming-soon">Activity tracking coming soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
