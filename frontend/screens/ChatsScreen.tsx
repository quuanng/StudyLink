// ChatsScreen.tsx
import React, { useEffect, useState, useCallback, useMemo, useContext } from 'react'
import { View, StyleSheet, FlatList, ActivityIndicator, Text } from 'react-native'
import ChatListEntry from '../components/ChatListEntry'
import backend from '../backend'
import { useChat } from '../context/ChatContext'
import { useFocusEffect } from '@react-navigation/native'
import { AuthContext } from '../context/AuthContext' // Import your AuthContext

interface StudyGroup {
  id: string
  title: string
  lastMessage: string
  lastDate: string | null
}

export default function ChatsScreen() {
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Get the logged in user from AuthContext
  const { user } = useContext(AuthContext)
  // Get real-time messages and joinGroup function from ChatContext
  const { messages, joinGroup } = useChat()

  // Helper function to format timestamps
  const formatTimestamp = (timestamp: string): string => {
    const fixedTimestamp = timestamp.replace(/:(?=\d{2}$)/, '')
    const date = new Date(fixedTimestamp)
    if (isNaN(date.getTime())) {
      return ''
    }
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    return isToday 
      ? date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) 
      : date.toLocaleDateString([], { month: "short", day: "numeric" })
  }

  // Function to fetch study groups using the logged-in user's ID
  const fetchStudyGroups = async () => {
    if (!user) {
      setLoading(false)
      return
    }
    try {
      const response = await backend.get(`/study-group/user/${user.id}`)
      setStudyGroups(response.data)
      // Join each study group so that you can receive real-time messages
      response.data.forEach((group: StudyGroup) => {
        joinGroup(group.id)
      })
    } catch (err) {
      console.error('Error fetching study groups:', err)
      setError('Failed to load study groups')
    } finally {
      setLoading(false)
    }
  }

  // Re-fetch study groups every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setLoading(true)
      if (user) {
        fetchStudyGroups()
      }
    }, [user])
  )

  // Also re-run fetch when the user state changes (e.g., after login)
  useEffect(() => {
    if (user) {
      setLoading(true)
      fetchStudyGroups()
    }
  }, [user])

  // Update study groups with the latest messages using memoization
  const updatedStudyGroups = useMemo(() => {
    return studyGroups.map((group) => {
      const groupMessages = messages.filter(msg => msg.groupId === group.id)
      if (groupMessages.length > 0) {
        // Sort descending by timestamp to pick the latest message
        const latestMessage = groupMessages.sort(
          (a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp)
        )[0]
        return {
          ...group,
          lastMessage: latestMessage.message,
          lastDate: latestMessage.timestamp
        }
      }
      return group
    })
  }, [studyGroups, messages])

  // If no user is logged in, show a prompt
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>Please log in to view your chats.</Text>
      </View>
    )
  }

  // Display loading indicator or error if necessary
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>
  }

  return (
    <View style={styles.container}>
      <FlatList 
        contentContainerStyle={styles.list} 
        data={updatedStudyGroups}
        renderItem={({ item }) => (
          <ChatListEntry 
            id={item.id} 
            title={item.title} 
            lastMessage={item.lastMessage} 
            lastDate={item.lastDate ? formatTimestamp(item.lastDate) : ""} 
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
  },
})
