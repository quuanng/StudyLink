import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { View, StyleSheet, FlatList, ActivityIndicator, Text } from 'react-native'
import ChatListEntry from '../components/ChatListEntry'
import backend from '../backend'
import { useChat } from '../context/ChatContext'
import { useFocusEffect } from '@react-navigation/native'

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
  
  // Get real-time messages and joinGroup function from ChatContext
  const { messages, joinGroup } = useChat()

  const formatTimestamp = (timestamp: string): string => {
    // Replace the colon in the timezone offset (e.g., +00:00 becomes +0000)
    const fixedTimestamp = timestamp.replace(/:(?=\d{2}$)/, '')
    const date = new Date(fixedTimestamp)
    
    // Check for an invalid date
    if (isNaN(date.getTime())) {
      return ''
    }
  
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
  
    if (isToday) {
      return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  // Function to fetch study groups from the backend and join each group
  const fetchStudyGroups = async () => {
    try {
      const userId = "678a1bbf6e3ce8fc205de6d2" // Replace with the logged-in user ID
      const response = await backend.get(`/study-group/user/${userId}`)
      setStudyGroups(response.data)
      // Join every study group so that real-time messages for each are received
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

  // Re-fetch study groups (and join them) every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchStudyGroups()
    }, [])
  )

  // Memoize updated study groups so that they re-calculate whenever studyGroups or messages change.
  const updatedStudyGroups = useMemo(() => {
    return studyGroups.map((group) => {
      // Filter messages for the current group
      const groupMessages = messages.filter(msg => msg.groupId === group.id)
      if (groupMessages.length > 0) {
        // Sort messages descending by createdAt and pick the latest one
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 2,
    gap: 2,
    flexDirection: 'column',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
})
