import React, { useEffect, useState } from 'react'
import { View, StyleSheet, FlatList, ActivityIndicator, Text } from 'react-native'
import ChatListEntry from '../components/ChatListEntry'
import backend from '../backend'

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

  useEffect(() => {
    const fetchStudyGroups = async () => {
      try {
        const userId = "678a1bbf6e3ce8fc205de6d2" // Replace with logged in user id
        const response = await backend.get(`/study-group/user/${userId}`)
        setStudyGroups(response.data)
      } catch (err) {
        console.error('Error fetching study groups:', err)
        setError('Failed to load study groups')
      } finally {
        setLoading(false)
      }
    }

    fetchStudyGroups()
  }, [])

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
        data={studyGroups}
        renderItem={({ item }) => (
          <ChatListEntry 
            id={item.id} 
            title={item.title} 
            lastMessage={item.lastMessage} 
            lastDate={item.lastDate ? item.lastDate.split("T")[0] : "No Date"} 
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
