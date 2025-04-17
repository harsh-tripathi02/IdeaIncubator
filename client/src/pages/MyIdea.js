"use client"

import { useEffect, useState } from "react"
import api from "../utils/api"
import IdeaCard from "../components/IdeaCard" // Update path if needed

function MyIdeas({ user }) {
  const [ideas, setIdeas] = useState([])

  const fetchMyIdeas = async () => {
    try {
      const res = await api.get("/ideas")
      const myIdeas = res.data.filter((idea) => idea.user._id === user._id)
      setIdeas(myIdeas)
    } catch (err) {
      console.error("Error fetching ideas")
    }
  }

  useEffect(() => {
    if (user) {
      fetchMyIdeas()
    }
  }, [user])

  return (
    <div>
      <h2>🧠 My Ideas</h2>
      {ideas.length > 0 ? (
        ideas.map((idea) => <IdeaCard key={idea._id} idea={idea} userId={user._id} refresh={fetchMyIdeas} />)
      ) : (
        <p>You haven’t posted any ideas yet.</p>
      )}
    </div>
  )
}

export default MyIdeas
