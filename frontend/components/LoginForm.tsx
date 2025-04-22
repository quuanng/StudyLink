import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, StyleSheet, Alert, Pressable } from 'react-native'

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void
  loading?: boolean
  swapForm: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading, swapForm }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [welcomeText, setWelcomeText] = useState('')
  const fullText = 'Welcome back!'

  useEffect(() => {
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setWelcomeText(fullText.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(interval)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [])

  const handleSubmit = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in both fields')
      return
    }
    onSubmit(email, password)
  }

  return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>{welcomeText}</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="rgba(255, 255, 255, 0.7)"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="rgba(255, 255, 255, 0.7)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Pressable style={styles.loginButton} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.loginButton}>
          {loading ? 'Logging In...' : 'Log In'}
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    color: '#FFFFFF',
    fontSize: 16,
    alignItems: "center",
    fontWeight: '600',
  },
})

export default LoginForm
