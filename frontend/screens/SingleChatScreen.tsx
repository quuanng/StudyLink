import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, Button, SafeAreaView, ActivityIndicator } from 'react-native'
import ChatMessage, { ChatMessageData } from '../components/ChatMessage'
import { useNavigation, useRoute } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../navigation/MainNavigator'
import ChatSendBox from '../components/ChatSendBox'
import backend from '../backend'

export default function SingleChatScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const route = useRoute()
  const { chatId } = route.params as { chatId: string }

  const [chatMessages, setChatMessages] = useState<ChatMessageData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await backend.get(`/chat/${chatId}`)
        setChatMessages(response.data)
      } catch (err) {
        console.error('Error fetching messages:', err)
        setError('Failed to load messages')
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [chatId])

  // Function to send a new message -- not working, will implement web sockets
  const sendMessage = async (content: string) => {
    try {
      await backend.post(`/chat/send`, {
        groupId: chatId,
        senderId: "67be7407f0ae91e0663e4332",
        message: content,
      })

      // Refresh chat after sending a message
      const response = await backend.get(`/chat/${chatId}`)
      setChatMessages(response.data)
    } catch (err) {
      console.error('Error sending message:', err)
    }
  }

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background}>
        <View style={styles.container}>
          <View style={styles.head_container}>
            <Button title="Back" onPress={() => navigation.goBack()} />
            <View style={styles.title_container}>
              <Text style={styles.chat_title}>Chat Room</Text>
            </View>
          </View>
          <FlatList 
            contentContainerStyle={styles.list} 
            data={chatMessages}
            renderItem={({ item }) => <ChatMessage Message={item} />}
            keyExtractor={(item) => item._id}
          />
          <ChatSendBox sendMessage={sendMessage} />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  background: {
    backgroundColor:'#ffffff',
    width:'100%',
    height:'100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#f2f2f2',
  },
  head_container: {
    height: 50,
    backgroundColor: '#ffffff',
    width: "100%",
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  title_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  chat_title: {
    fontSize: 18,
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
