import 'react-native-gesture-handler'
import React from 'react'
import { ThemeProvider } from './context/ThemeContext' // Theme context
import { ChatProvider } from './context/ChatContext' // New ChatContext
import MainNavigator from './navigation/MainNavigator' // Navigation setup
import { AuthProvider } from './context/AuthContext'

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ChatProvider> 
          <MainNavigator />
        </ChatProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}
