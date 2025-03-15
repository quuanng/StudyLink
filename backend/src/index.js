import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import http from "http"
import { Server } from "socket.io"
import Redis from "ioredis"
import routesRouter from "./routes/routes.js"
import { ChatModel } from "./models/Chat.js"

dotenv.config()

const app = express()
const port = process.env.PORT || 8240

const server = http.createServer(app)

const io = new Server(server, { cors: { origin: "*" } })

// Redis Clients for Pub/Sub
const redisPub = new Redis(process.env.REDIS_URL)
const redisSub = new Redis(process.env.REDIS_URL)

redisSub.subscribe("chat")

redisSub.on("message", async (channel, message) => {
    if (channel === "chat") {
        const parsedMessage = JSON.parse(message)
        io.to(parsedMessage.groupId).emit("message", parsedMessage)
    }
})

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.log("MongoDB connection error:", err))

app.get("/", (req, res) => {
    res.json("StudyLink")
})

app.use("/api", routesRouter)

io.on("connection", (socket) => {
    console.log("User connected:", socket.id)

    socket.on("joinGroup", (groupId) => {
        console.log("HUH ", groupId)
        socket.join(groupId)
    })

    socket.on("sendMessage", async (data) => {
        console.log(data)
        const { groupId, senderId, senderName, message } = data
        console.log(groupId)

        if (!message || message.trim() === "") {
            socket.emit("error", { message: "Message cannot be empty" })
            return
        }

        const newMessage = new ChatModel({ groupId, senderId, senderName, message })
        await newMessage.save()
        
        // this duplicates the message because redis does the same thing
        // io.to(groupId).emit("message", newMessage)

        redisPub.publish("chat", JSON.stringify(newMessage))
    })

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id)
    })
})

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})