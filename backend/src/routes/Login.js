import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { UsersModel } from "../models/User.js"

const router = express.Router()

// Login endpoint
router.post("/login", async (req, res) => {
  console.log("Login endpoint called")
  const { email, password } = req.body

  try {
    // Check if the user exists
    const user = await UsersModel.findOne({ email })
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    // Generate access token
    const accessTokenPayload = { userId: user._id, email: user.email }
    const accessToken = jwt.sign(accessTokenPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || "15m" // Short-lived access token
    })

    // Generate refresh token
    const refreshToken = jwt.sign({ userId: user._id },process.env.JWT_REFRESH_SECRET, { 
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || "7d"  // Long-lived refresh token
    })

    // Save refresh token to user document
    user.refreshToken = refreshToken
    await user.save()

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "An error occurred during login" })
  }
})

// Refresh token endpoint
router.post("/refresh-token", async (req, res) => {
  console.log("Refresh token endpoint called")
  const { refreshToken } = req.body

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token required" })
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    
    // Find user and check if refresh token matches
    const user = await UsersModel.findById(decoded.userId)
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ error: "Invalid refresh token" })
    }

    // Generate new access token
    const accessToken = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { 
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || "15m"
   })

    // Generate new refresh token
    const newRefreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || "7d"
    })

    // Update user's refresh token in database
    user.refreshToken = newRefreshToken
    await user.save()

    res.status(200).json({
      accessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    })
  } catch (error) {
    console.error("Error refreshing token:", error)
    res.status(401).json({ error: "Invalid or expired refresh token" })
  }
})

// Logout endpoint
router.post("/logout", async (req, res) => {
  console.log("Logout endpoint called")
  const { refreshToken } = req.body

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token required" })
  }

  try {
    // Find user by refresh token and remove it
    const user = await UsersModel.findOne({ refreshToken })
    if (user) {
      user.refreshToken = null
      await user.save()
    }

    res.status(200).json({ message: "Logged out successfully" })
  } catch (error) {
    console.error("Error during logout:", error)
    res.status(500).json({ error: "An error occurred during logout" })
  }
})

router.get("/me", async (req, res) => {
  console.log("Me endpoint called")
  const authHeader = req.headers.authorization

  // Check if the Authorization header is provided
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const token = authHeader.split(" ")[1] // Extract the token from "Bearer <token>"

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Find the user associated with the token
    const user = await UsersModel.findById(decoded.userId)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Return the user details (excluding sensitive info like the password)
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Error verifying token:", error)
    res.status(401).json({ error: "Invalid or expired token" })
  }
})

export default router
