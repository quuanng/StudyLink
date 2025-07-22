import { Router } from "express"
import { ClassModel } from "../models/Class.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router = Router()

// Get courses with optional search query
router.get("/courses", async (req, res) => {
  try {
    const { search } = req.query
    let query = {}
    
    if (search) {
      query = {
        $or: [
          { subject: { $regex: search, $options: "i" } },  // Case-insensitive match
          { catalog_number: { $regex: search, $options: "i" } },
          { full_name: { $regex: search, $options: "i" } },
          { descr: { $regex: search, $options: "i" } }
        ]
      }
    }

    const courses = await ClassModel.find(query)
      .sort({ count: -1 }) // Sort by COUNT in descending order
      .limit(20) // Limit results to top 20

    res.json(courses)
  } catch (error) {
    console.error("Error fetching courses:", error)
    res.status(500).json({ error: "Failed to fetch courses" })
  }
})

// Add a new class - DEV USE ONLY
/*
router.post("/add", async (req, res) => {
  const { subject, catalog_number, full_name, descr, count, saves } = req.body
  try {
    // Check if the class already exists in the database
    const existingClass = await ClassModel.findOne({ subject, catalog_number })
    if (existingClass) {
      return res.status(400).json({ error: "Class already exists in the database" })
    }
    // If it doesn't exist, add the new class
    const newClass = new ClassModel({ subject, catalog_number, full_name, descr, count, saves })
    await newClass.save()
    res.status(201).json({ message: "Class added successfully", class: newClass })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to add class" })
  }
})*/

export default router
