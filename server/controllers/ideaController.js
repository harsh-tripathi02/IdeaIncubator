const Idea = require("../models/Idea")

// GET ideas with pagination
exports.getIdeas = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const total = await Idea.countDocuments()
    const ideas = await Idea.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("title description tags username createdAt upvotes downvotes") // Include upvotes and downvotes

    res.json({
      ideas,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST a new idea
exports.createIdea = async (req, res) => {
  try {
    const { title, description, tags } = req.body
    const idea = new Idea({
      title,
      description,
      tags,
      creator: req.user.id,
      username: req.user.username, // Add username from authenticated user
    })
    await idea.save()
    res.status(201).json(idea)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// PUT: update idea by creator
exports.updateIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id)
    if (!idea) return res.status(404).json({ message: "Idea not found" })

    if (idea.creator.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized" })
    }

    const updated = await Idea.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE: delete idea by creator
exports.deleteIdea = async (req, res) => {
  try {
    console.log("Delete request received for idea ID:", req.params.id)
    console.log("Authenticated user ID:", req.user.id)

    const idea = await Idea.findById(req.params.id)
    if (!idea) {
      console.error("Idea not found for ID:", req.params.id)
      return res.status(404).json({ message: "Idea not found" })
    }

    if (idea.creator.toString() !== req.user.id.toString()) {
      console.error("Unauthorized delete attempt by user ID:", req.user.id)
      return res.status(403).json({ message: "Not authorized to delete this idea" })
    }

    await idea.deleteOne()
    console.log("Idea deleted successfully for ID:", req.params.id)

    // Ensure response is sent after successful deletion
    return res.json({ message: "Idea deleted successfully", id: req.params.id })
  } catch (err) {
    console.error("Error during idea deletion:", err)
    return res.status(500).json({ message: "Internal server error", error: err.message })
  }
}

// POST: upvote
exports.upvoteIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id)
    if (!idea) return res.status(404).json({ message: "Idea not found" })

    const userId = req.user.id.toString() // Ensure userId is a string

    const hasUpvoted = idea.upvotes.includes(userId)

    if (hasUpvoted) {
      // Reverse the upvote action
      idea.upvotes = idea.upvotes.filter((id) => id !== userId)
    } else {
      // Add upvote and remove downvote if it exists
      idea.upvotes.push(userId)
      idea.downvotes = idea.downvotes.filter((id) => id !== userId)
    }

    await idea.save()

    res.json({ message: hasUpvoted ? "Upvote removed" : "Upvoted successfully", idea })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST: downvote
exports.downvoteIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id)
    if (!idea) return res.status(404).json({ message: "Idea not found" })

    const userId = req.user.id.toString() // Ensure userId is a string

    const hasDownvoted = idea.downvotes.includes(userId)

    if (hasDownvoted) {
      // Reverse the downvote action
      idea.downvotes = idea.downvotes.filter((id) => id !== userId)
    } else {
      // Add downvote and remove upvote if it exists
      idea.downvotes.push(userId)
      idea.upvotes = idea.upvotes.filter((id) => id !== userId)
    }

    await idea.save()

    res.json({ message: hasDownvoted ? "Downvote removed" : "Downvoted successfully", idea })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST: comment
exports.addComment = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id)
    const { text } = req.body

    idea.comments.push({
      username: req.user.username,
      text,
    })

    await idea.save()
    res.status(201).json({ message: "Comment added" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getIdeaById = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id)
    if (!idea) return res.status(404).json({ message: "Idea not found" })
    res.json(idea)
  } catch (err) {
    res.status(500).json({ message: "Error fetching idea" })
  }
}

exports.searchIdeas = async (req, res) => {
  const { search, tags } = req.query

  // Build filter query
  const filter = {}
  if (search) {
    filter.title = { $regex: search, $options: "i" } // case-insensitive match
  }
  if (tags) {
    filter.tags = { $in: tags.split(",").map((tag) => tag.trim()) } // filter by multiple tags
  }

  try {
    const ideas = await Idea.find(filter).populate("user", "username").sort({ createdAt: -1 })
    res.json(ideas)
  } catch (err) {
    res.status(500).json({ message: "Error fetching ideas" })
  }
}
