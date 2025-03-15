import React, { useState, useEffect } from 'react'
import { View, Text, Alert, Button, StyleSheet } from 'react-native'
import axios, { AxiosError } from 'axios' // Import AxiosError for error typing
import LoginForm from '../components/LoginForm'
import { storeToken, getToken, deleteToken, validateToken } from '../utils/auth'
import RegisterForm from '../components/RegisterForm'

const BACKEND_URL = 'http://localhost:8240/api' // Replace with your backend URL

// Define the structure of the backend error response
interface ErrorResponse {
  error: string
}

const ProfileScreen: React.FC = () => {
  const [user, setUser] = useState<null | { name: string; email: string }>(null) // User state
  const [loading, setLoading] = useState(false)
  const [activeForm, setActiveForm] = useState<"login" | "register">("login")

  // Check if a user is already logged in on screen load
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await getToken()
        if (token) {
          const userData = await validateToken(token, BACKEND_URL)
          if (userData) {
            setUser(userData) // Set user state
          } else {
            await deleteToken() // Remove invalid token
          }
        }
      } catch (error) {
        console.error('Error checking login status:', error)
      }
    }

    checkLoginStatus()
  }, [])

  // Handle login form submission
  const handleLogin = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await axios.post(`${BACKEND_URL}/login/login`, { email, password })
      const { token, user } = response.data

      await storeToken(token) // Store the JWT securely
      setUser(user) // Update user state
      Alert.alert('Success', `Welcome, ${user.name}!`)
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse> // Type the Axios error
      console.error('Login error:', axiosError)

      const errorMessage =
        axiosError.response?.data?.error || 'An error occurred' // Access the error safely
      Alert.alert('Login Failed', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Handle register form submission
  const handleRegister = async (name: string, email: string, password: string) => {
    setLoading(true)
    try {
      const response = await axios.post(`${BACKEND_URL}/user/add`, { name, email, password })
      const { user } = response.data

      Alert.alert('Account created successfully', `You may now log in as ${user.name}!`)
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse> // Type the Axios error
      console.error('Registration error:', axiosError)

      const errorMessage =
        axiosError.response?.data?.error || 'An error occurred' // Access the error safely
      Alert.alert('Registration Failed', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await deleteToken() // Remove the token
      setUser(null) // Clear user state
      Alert.alert('Logged out', 'You have been logged out successfully.')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <View style={styles.container}>
      {user ? (
        // Display user profile if logged in
        <View>
          <Text style={styles.text}>Welcome, {user.name}!</Text>
          <Text style={styles.text}>Email: {user.email}</Text>
          <Button title="Logout" onPress={handleLogout} />
        </View>
      ) : (
        // Display login form if not logged in
        activeForm == "login" ? (
          <View>
            <Text style={styles.text}>Login to Your Profile</Text>
            <LoginForm onSubmit={handleLogin} loading={loading} swapForm={() => setActiveForm("register")} />
          </View>
        ) : (
          <View>
            <Text style={styles.text}>Create an Account</Text>
            <RegisterForm onSubmit={handleRegister} loading={loading} swapForm={() => setActiveForm("login")} />
          </View>
        )
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
})

export default ProfileScreen
