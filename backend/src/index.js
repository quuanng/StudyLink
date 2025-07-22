import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import http from "http"
import { Server } from "socket.io"
import routesRouter from "./routes/routes.js"
import { setupSocketHandlers } from "./socketHandler.js"

dotenv.config()

const app = express()
const port = process.env.PORT || 8080

const server = http.createServer(app)

const io = new Server(server, { cors: { origin: "*" } })

app.use(cors())
app.use(express.json())

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err))

app.get("/", (req, res) => {
  res.json("StudyLink")
})

app.use("/api", routesRouter)

// Setup socket handlers
setupSocketHandlers(io)

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})