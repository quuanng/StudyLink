import { ChatModel } from "./models/Chat.js"

export const setupSocketHandlers = (io) => {
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

      try {
        const newMessage = new ChatModel({ groupId, senderId, senderName, message })
        await newMessage.save()

        io.to(groupId).emit("message", newMessage)
      } catch (error) {
        console.error("Error saving message:", error)
        socket.emit("error", { message: "Failed to save message" })
      }
    })

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id)
    })
  })
}