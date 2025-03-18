import React, { createContext, useState, useEffect, useContext, useCallback } from 'react'
import io from 'socket.io-client'
import { Alert } from 'react-native'
import { API_URL } from '../config.ts' 

interface Message {
  _id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
}

interface ChatContextType {
  messages: Message[]
  joinGroup: (groupId: string) => void
  sendMessage: (groupId: string, senderId: string, senderName: string, message: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const socket = io(`${API_URL}`, { transports: ['websocket'] })

  useEffect(() => {
    // Connect to WebSocket server
    socket.on('connect', () => {
      console.log('Connected to WebSocket server')
    })

    // Listen for incoming messages
    socket.on('message', (newMessage: Message) => {
      setMessages(prevMessages => [...prevMessages, newMessage])
    })

    // Handle errors
    socket.on('error', (error) => {
      Alert.alert('Chat Error', error.message || 'Something went wrong')
    })

    // Cleanup on unmount
    return () => {
      socket.disconnect()
    }
  }, [])

  // Join a chat group (room)
  const joinGroup = useCallback((groupId: string) => {
    socket.emit('joinGroup', groupId)
  }, [])

  // Send a message
  const sendMessage = useCallback((groupId: string, senderId: string, senderName: string, message: string) => {
    if (!message.trim()) {
      Alert.alert('Error', 'Message cannot be empty')
      return
    }
    
    const newMessage: Message = {
        _id: `${Date.now()}`, // Temporary ID before server response
        groupId,
        senderId,
        senderName,
        message,
        timestamp: new Date().toISOString(),
    }

    socket.emit('sendMessage', newMessage)
  }, [])

  return (
    <ChatContext.Provider value={{ messages, joinGroup, sendMessage }}>
      {children}
    </ChatContext.Provider>
  )
}

// Custom Hook to use ChatContext
export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
