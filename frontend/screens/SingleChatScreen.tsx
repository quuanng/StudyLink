import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, Button, SafeAreaView, ActivityIndicator } from 'react-native'
import ChatMessage from '../components/ChatMessage'
import { useNavigation, useRoute } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../navigation/MainNavigator'
import ChatSendBox from '../components/ChatSendBox'
import { useChat } from '../context/ChatContext'
import backend from '../backend'

export interface MergedChatMessageData {
  _ids: string[]
  groupId: string
  senderId: string
  senderName: string
  messages: string[]
  timestamps: string[]
  readBy: string[][]
}

export default function SingleChatScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const route = useRoute()
  const { chatId } = route.params as { chatId: string }

  // Use ChatContext for real-time messaging
  const { messages, joinGroup, sendMessage: socketSendMessage } = useChat()

  // Filter messages that belong to the current chat (room)
  const chatMessages = messages.filter((msg) => msg.groupId === chatId)

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null)

  // Merge consecutive messages from the same sender (if within 5 minutes)
  const tryMergeAllMessages = (rawMessages: Array<{ _id: string; groupId: string; senderId: string; senderName: string; message: string; createdAt: string; }>): MergedChatMessageData[] => {
    const sortedByTimestamp = [...rawMessages].sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
    let output: MergedChatMessageData[] = []
    let curMergedMessage: MergedChatMessageData = {
      _ids: [],
      groupId: "",
      senderId: "",
      senderName: "",
      messages: [],
      timestamps: [],
      readBy: [] // Not used in this example
    }

    sortedByTimestamp.forEach(msg => {
      const lastTimestamp = curMergedMessage.timestamps.length > 0
        ? Date.parse(curMergedMessage.timestamps[curMergedMessage.timestamps.length - 1])
        : 0
      const timeSincePreviousMessageMs = Date.parse(msg.createdAt) - lastTimestamp;

      // If more than 5 minutes have passed or a different sender sends a message,
      // push the current merged message and start a new one.
      if (curMergedMessage._ids.length > 0 && (timeSincePreviousMessageMs > 300000 || msg.senderId !== curMergedMessage.senderId)) {
        output.push(curMergedMessage);
        curMergedMessage = {
          _ids: [],
          groupId: "",
          senderId: "",
          senderName: "",
          messages: [],
          timestamps: [],
          readBy: []
        }
      }
      curMergedMessage._ids.push(msg._id);
      curMergedMessage.groupId = msg.groupId;
      curMergedMessage.senderId = msg.senderId;
      curMergedMessage.senderName = msg.senderName;
      curMergedMessage.messages.push(msg.message);
      curMergedMessage.timestamps.push(msg.createdAt);
    })

    if (curMergedMessage._ids.length > 0) {
      output.push(curMergedMessage)
    }
    return output
  }

  // Join the chat room and fetch initial messages (if needed)
  useEffect(() => {
    joinGroup(chatId)
    const fetchMessages = async () => {
      try {
        await backend.get(`/chat/${chatId}`)
        // Optionally, you can process the HTTP-fetched messages
        // and integrate them into your ChatContext state if desired.
      } catch (err) {
        console.error('Error fetching messages:', err)
        setError('Failed to load messages')
      } finally {
        setLoading(false)
      }
    }
    fetchMessages();
  }, [chatId, joinGroup])

  // Handler to send a message via the socket
  const handleSendMessage = (content: string) => {
    const senderId = "67be7407f0ae91e0663e4332" // Replace with the logged-in user ID
    const senderName = "Me" // Replace with the actual user name
    socketSendMessage(chatId, senderId, senderName, content)
  }

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>
  }

  const mergedChatMessages = tryMergeAllMessages(chatMessages)

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
            data={mergedChatMessages}
            renderItem={({ item }) => <ChatMessage Message={item} />}
            keyExtractor={(item, idx) => idx.toString()}
          />
          <ChatSendBox sendMessage={handleSendMessage} />
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
