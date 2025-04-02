import React, { useEffect, useState, useContext, useRef } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native'
import ChatMessage from '../components/ChatMessage'
import { useNavigation, useRoute } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../navigation/MainNavigator'
import ChatSendBox from '../components/ChatSendBox'
import { useChat } from '../context/ChatContext'
import backend from '../backend'
import { AuthContext } from '../context/AuthContext'
import Icon from 'react-native-vector-icons/Ionicons'

export interface MergedChatMessageData {
  _ids: string[]
  groupId: string
  senderId: string
  senderName: string
  messages: string[]
  timestamps: string[]
  readBy: string[][]
}

// Merge consecutive messages from the same sender if sent within 5 minutes.
const tryMergeAllMessages = (
  rawMessages: Array<{ _id: string; groupId: string; senderId: string; senderName: string; message: string; timestamp: string; }>
): MergedChatMessageData[] => {
  const sortedByTimestamp = [...rawMessages].sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp))
  let output: MergedChatMessageData[] = []
  let curMergedMessage: MergedChatMessageData = {
    _ids: [],
    groupId: "",
    senderId: "",
    senderName: "",
    messages: [],
    timestamps: [],
    readBy: [] 
  }

  sortedByTimestamp.forEach(msg => {
    const lastTimestamp = curMergedMessage.timestamps.length > 0
      ? Date.parse(curMergedMessage.timestamps[curMergedMessage.timestamps.length - 1])
      : 0
    const timeSincePreviousMessageMs = Date.parse(msg.timestamp) - lastTimestamp

    if (curMergedMessage._ids.length > 0 && (timeSincePreviousMessageMs > 300000 || msg.senderId !== curMergedMessage.senderId)) {
      output.push(curMergedMessage)
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
    curMergedMessage._ids.push(msg._id)
    curMergedMessage.groupId = msg.groupId
    curMergedMessage.senderId = msg.senderId
    curMergedMessage.senderName = msg.senderName
    curMergedMessage.messages.push(msg.message)
    curMergedMessage.timestamps.push(msg.timestamp)
  })

  if (curMergedMessage._ids.length > 0) {
    output.push(curMergedMessage)
  }
  return output
}

export default function SingleChatScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const route = useRoute()
  const { chatId } = route.params as { chatId: string }
  const flatListRef = useRef<FlatList>(null)

  // Use AuthContext to get logged-in user info
  const { user } = useContext(AuthContext)

  // Use ChatContext for real-time messaging
  const { messages, joinGroup, sendMessage: socketSendMessage } = useChat()

  // Local state for historical messages fetched via HTTP
  const [historicalMessages, setHistoricalMessages] = useState<
    Array<{ _id: string; groupId: string; senderId: string; senderName: string; message: string; timestamp: string; }>
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter real-time messages belonging to the current chat room
  const realtimeMessages = messages.filter((msg) => msg.groupId === chatId)

  // Combine historical and real-time messages
  const combinedMessages = [...historicalMessages, ...realtimeMessages]
  // Deduplicate messages based on _id
  const uniqueMessages = combinedMessages.filter((msg, index, self) =>
    index === self.findIndex((m) => m._id === msg._id)
  )
  
  const mergedChatMessages = tryMergeAllMessages(uniqueMessages)

  // Join the chat room and fetch historical messages
  useEffect(() => {
    joinGroup(chatId)
    const fetchMessages = async () => {
      try {
        const response = await backend.get(`/chat/${chatId}`)
        setHistoricalMessages(response.data)
      } catch (err) {
        console.error('Error fetching messages:', err)
        setError('Failed to load messages')
      } finally {
        setLoading(false)
      }
    }
    fetchMessages()
    // We intentionally want to call joinGroup only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId])

  // Add effect to scroll to bottom when messages change
  useEffect(() => {
    if (flatListRef.current && mergedChatMessages.length > 0) {
      // For inverted list, scrollToOffset with 0 brings us to the latest messages
      flatListRef.current.scrollToOffset({ offset: 0, animated: true })
    }
  }, [mergedChatMessages])

  // Handler to send a message via the socket
  const handleSendMessage = (content: string) => {
    // Use the logged in user's info if available
    if (user) {
      socketSendMessage(chatId, user.id, user.name, content)
    } else {
      // Fallback behavior (if needed)
      console.warn("User is not logged in; message not sent")
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.chatTitle}>Chat Room</Text>
            <Text style={styles.participantCount}>2 participants</Text>
          </View>
        </View>
        
        <FlatList 
          ref={flatListRef}
          contentContainerStyle={[styles.messageList, { justifyContent: 'flex-end' }]} 
          data={[...mergedChatMessages].reverse()}
          renderItem={({ item }) => <ChatMessage Message={item} />}
          keyExtractor={(item, idx) => idx.toString()}
          showsVerticalScrollIndicator={false}
          inverted={true}
          maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
        />
        
        <ChatSendBox sendMessage={handleSendMessage} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  participantCount: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  messageList: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
  },
})
