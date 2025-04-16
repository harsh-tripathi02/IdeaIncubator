const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors")

const ideaRoutes = require("./routes/ideaRoutes")
const userRoutes = require("./routes/userRoutes")

// Load environment variables from .env file
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// ✅ Middleware
app.use(cors())
app.use(express.json()) // <-- this is the key line

// ✅ Routes
app.use("/api/ideas", ideaRoutes)
app.use("/api/users", userRoutes)

// ✅ Connect DB and Start Server
const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB")
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((err) => console.log(err))
