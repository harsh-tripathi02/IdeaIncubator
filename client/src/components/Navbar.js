"use client"
import { Link, useNavigate } from "react-router-dom"

function Navbar({ user, setUser }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    navigate("/")
  }

  return (
    <nav style={styles.nav}>
      <div>
        <Link to="/" style={styles.logo}>
          🚀 Idea Incubator
        </Link>
      </div>
      <div style={styles.links}>
        {user ? (
          <>
            <Link to="/create-idea">+ New Idea</Link>
            <Link to="/my-ideas">My Ideas</Link>
            <span style={styles.username}>👤 {user.username}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
    borderBottom: "1px solid #ccc",
    marginBottom: "20px",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  logo: {
    fontWeight: "bold",
    fontSize: "18px",
    textDecoration: "none",
  },
  username: {
    marginRight: "10px",
  },
}

export default Navbar
