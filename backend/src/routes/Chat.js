import { Router } from "express"
import { ChatModel } from "../models/Chat.js"
import { StudyGroupModel } from "../models/StudyGroup.js"
import { ClassModel } from "../models/Class.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router = Router()

router.get("/:groupId", async (req, res) => {
  const { groupId } = req.params

  try {
    const chatMessages = await ChatModel.find({ groupId })
      .sort({ timestamp: -1 })
      .lean()

    res.status(200).json(chatMessages)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to fetch chat messages." })
  }
})

// sends a chat to a StudyGroup - this route also needs to be authenticated similarly
router.post("/", async(req, res) => {
    try {
        const { groupId, senderId, senderName, message } = req.body

        if (!message || message.trim() === ""){
            return res.status(400).json({ error: "Message can not be empty" })
        }

        const chat = new ChatModel({ groupId, senderId, senderName, message })
        await chat.save()

        res.status(201).json(chat)
    } catch {
        res.status(500).json({ error: error.message })
    }
})


export default router