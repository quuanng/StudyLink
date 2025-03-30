import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import http from "http"
import { Server } from "socket.io"
import routesRouter from "./routes/routes.js"
import { ChatModel } from "./models/Chat.js"

dotenv.config()

const app = express()
const port = process.env.PORT || 8240

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

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("joinGroup", (groupId) => {
    socket.join(groupId)
  })

  socket.on("sendMessage", async (data) => {
    const { groupId, senderId, senderName, message } = data

    if (!message || message.trim() === "") {
      socket.emit("error", { message: "Message cannot be empty" })
      return
    }

    const newMessage = new ChatModel({ groupId, senderId, senderName, message })
    await newMessage.save()

    io.to(groupId).emit("message", newMessage)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
