import React, { useState, useEffect, useContext } from 'react'
import { View, Text, Alert, Button, StyleSheet, ImageBackground, Image, Pressable } from 'react-native'
import LoginForm from '../components/LoginForm'
import { storeTokens, getAccessToken, getRefreshToken, deleteTokens, validateToken } from '../utils/auth'
import RegisterForm from '../components/RegisterForm'
import { AxiosError } from 'axios'
import backend from '../backend'
import { AuthContext } from '../context/AuthContext'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../navigation/MainNavigator'

interface ErrorResponse {
  error: string
}

const LoginScreen: React.FC = () => {
  const { user, login, logout } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [activeForm, setActiveForm] = useState<"login" | "register">("login")

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

  // Check if a user is already logged in on screen load
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const accessToken = await getAccessToken()
        if (accessToken) {
          const userData = await validateToken(accessToken)
          if (userData) {
            // Get refresh token and update AuthContext with both tokens
            const refreshToken = await getRefreshToken()
            if (refreshToken) {
              login(userData, accessToken, refreshToken)
            } else {
              await deleteTokens()
            }
          } else {
            await deleteTokens()
          }
        }
      } catch (error) {
        console.error('Error checking login status:', error)
      }
    }

    checkLoginStatus()
  }, [])

  useEffect(() => {
    if (user) navigation.navigate("MainTabs")
  }, [user])

  // Handle login form submission
  const handleLogin = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await backend.post(`/login/login`, { email, password })
      const { accessToken, refreshToken, user } = response.data
      await storeTokens(accessToken, refreshToken)
      // Update AuthContext with the logged in user and both tokens
      login(user, accessToken, refreshToken)
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
      const refreshToken = await getRefreshToken()
      if (refreshToken) {
        await backend.post('/login/logout', { refreshToken })
      }
      logout()
      Alert.alert('Logged out', 'You have been logged out successfully.')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1557683304-673a23048d34' }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.content}>
            {user ? (
              <View style={styles.profileContainer}>
                <Text style={styles.welcomeText}>Welcome, {user.name}!</Text>
                <Button title="Logout" onPress={handleLogout} />
              </View>
            ) : (
              <View style={styles.formContainer}>
                {activeForm === "login" ? (
                  <LoginForm
                    onSubmit={handleLogin}
                    loading={loading}
                    swapForm={() => setActiveForm("register")}
                  />
                ) : (
                  <RegisterForm
                    onSubmit={handleRegister}
                    loading={loading}
                    swapForm={() => setActiveForm("login")}
                  />
                )}
                <View style={styles.orContainer}>
                  <View style={styles.line} />
                  <Text style={styles.orText}>or</Text>
                  <View style={styles.line} />
                </View>
              </View>
            )}
          </View>
          {!user && (
            <View style={styles.swapButtonContainer}>
              {activeForm === "login" ? (
                <Pressable onPress={() => setActiveForm("register")}>
                  <Text style={styles.swapButtonText}>Create new account</Text>
                </Pressable>
              ) : (
                <Pressable onPress={() => setActiveForm("login")}>
                  <Text style={styles.swapButtonText}>I already have an account</Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: -40,
  },
  logo: {
    width: 350,
    height: 350,
    marginBottom: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 0,
  },
  formContainer: {
    padding: 20,
    borderRadius: 15,
    marginTop: -60,
  },
  profileContainer: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    marginBottom: 20,
    color: '#fff',
  },
  swapButtonContainer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  swapButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    width: 250,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    marginTop: 40,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 10,
  },
  orText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginHorizontal: 10,
  },
})

export default LoginScreen
