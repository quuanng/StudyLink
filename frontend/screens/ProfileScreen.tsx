import React, { useState, useEffect, useContext } from 'react'
import { View, Text, Alert, Button, StyleSheet } from 'react-native'
import LoginForm from '../components/LoginForm'
import { storeToken, getToken, deleteToken, validateToken } from '../utils/auth'
import RegisterForm from '../components/RegisterForm'
import { AxiosError } from 'axios'
import backend from '../backend'
import { AuthContext } from '../context/AuthContext'  // Import AuthContext

interface ErrorResponse {
  error: string
}

const ProfileScreen: React.FC = () => {
  // Remove local user state and use AuthContext instead
  const { user, login, logout } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [activeForm, setActiveForm] = useState<"login" | "register">("login")

  // Check if a user is already logged in on screen load
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await getToken()
        if (token) {
          const userData = await validateToken(token)
          if (userData) {
            // Instead of setting local state, update the AuthContext
            login(userData, token)
          } else {
            await deleteToken()
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
      const response = await backend.post(`/login/login`, { email, password })
      const { token, user } = response.data
      await storeToken(token)
      // Update AuthContext with the logged in user
      login(user, token)
      Alert.alert('Success', `Welcome, ${user.name}!`)
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>
      console.error('Login error:', axiosError)
      const errorMessage =
        axiosError.response?.data?.error || 'An error occurred'
      Alert.alert('Login Failed', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Handle register form submission
  const handleRegister = async (name: string, email: string, password: string) => {
    setLoading(true)
    try {
      const response = await backend.post(`/user/add`, { name, email, password })
      const { user } = response.data
      Alert.alert('Account created successfully', `You may now log in as ${user.name}!`)
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>
      console.error('Registration error:', axiosError)
      const errorMessage =
        axiosError.response?.data?.error || 'An error occurred'
      Alert.alert('Registration Failed', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await deleteToken()
      logout()  // Update AuthContext to clear the user
      Alert.alert('Logged out', 'You have been logged out successfully.')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <View style={styles.container}>
      {user ? (
        <View>
          <Text style={styles.text}>Welcome, {user.name}!</Text>
          <Text style={styles.text}>Email: {user.email}</Text>
          <Button title="Logout" onPress={handleLogout} />
        </View>
      ) : (
        activeForm === "login" ? (
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
