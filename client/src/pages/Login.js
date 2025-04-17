"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Login = () => {
  const { login, error, setError } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    if (!formData.email) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid"
    }

    if (!formData.password) {
      errors.password = "Password is required"
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
        const success = await login(formData.email, formData.password)
        if (success) {
          navigate("/")
        }
      } catch (err) {
        console.error("Login error:", err)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">Sign in to continue to Idea Incubator</p>

        {error && (
          <div className="error-alert" role="alert">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
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

          <button type="submit" className="btn-primary btn-block" disabled={isSubmitting} aria-busy={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth-redirect">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
