"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Signup = () => {
  const { signup, error, setError } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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

    if (!formData.password) {
      errors.password = "Password is required"
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
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
        const success = await signup({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        })

        if (success) {
          navigate("/login")
        }
      } catch (err) {
        console.error("Signup error:", err)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Create Account</h1>
        <p className="auth-subtitle">Join Idea Incubator and start sharing your ideas</p>

        {error && (
          <div className="error-alert" role="alert">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
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

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={formErrors.password ? "error" : ""}
              disabled={isSubmitting}
              aria-invalid={formErrors.password ? "true" : "false"}
              aria-describedby={formErrors.password ? "password-error" : undefined}
            />
            {formErrors.password && (
              <span className="error-message" id="password-error" role="alert">
                {formErrors.password}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={formErrors.confirmPassword ? "error" : ""}
              disabled={isSubmitting}
              aria-invalid={formErrors.confirmPassword ? "true" : "false"}
              aria-describedby={formErrors.confirmPassword ? "confirmPassword-error" : undefined}
            />
            {formErrors.confirmPassword && (
              <span className="error-message" id="confirmPassword-error" role="alert">
                {formErrors.confirmPassword}
              </span>
            )}
          </div>

          <button type="submit" className="btn-primary btn-block" disabled={isSubmitting} aria-busy={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-redirect">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
