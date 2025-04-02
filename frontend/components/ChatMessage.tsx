import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { MergedChatMessageData } from '../screens/SingleChatScreen'
import { Dimensions } from 'react-native'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

interface ChatMessageProps {
  Message: MergedChatMessageData
}

const ChatMessage: React.FC<ChatMessageProps> = ({ Message }) => {
  const [isSelf, setIsSelf] = useState(false)
  const [avatarColor, setAvatarColor] = useState('#000000')

  useEffect(() => {
    // TODO: setting isSelf to always be false to make all messages left-aligned
    // setIsSelf(Message.senderId == dummyLocalUserId)
    
    // Generate a consistent color based on the sender's ID
    const hash = Message.senderId.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc)
    }, 0)
    
    // Generate a pastel color using the hash
    const hue = Math.abs(hash % 360)
    const saturation = 70
    const lightness = 80
    setAvatarColor(`hsl(${hue}, ${saturation}%, ${lightness}%)`)
  }, [Message])

  const formatTimestamp = (timestamp?: string): string => {
    if (!timestamp) return ''
    // Replace colon in timezone offset (e.g., +00:00 -> +0000)
    const fixedTimestamp = timestamp.replace(/:(?=\d{2}$)/, '')
    const date = new Date(fixedTimestamp)
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

  return (
    <View style={styles.container}>
      <View style={[styles.messageWrapper, isSelf ? styles.selfWrapper : styles.otherWrapper]}>
        {!isSelf && (
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
              <Text style={styles.avatarText}>
                {Message.senderName.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>
        )}
        <View style={styles.contentContainer}>
          {!isSelf && (
            <View style={styles.nameContainer}>
              <Text style={styles.senderName}>{Message.senderName}</Text>
              <Text style={styles.timestamp}>{formatTimestamp(Message.timestamps[0])}</Text>
            </View>
          )}
          {Message.messages.map((content, index) => (
            <View key={index} style={styles.messageGroup}>
              <View style={[
                styles.messageBubble, 
                isSelf ? styles.selfBubble : styles.otherBubble,
                index === 0 ? (isSelf ? styles.firstSelfBubble : styles.firstOtherBubble) : styles.sequentialBubble
              ]}>
                <Text style={[styles.messageText, isSelf ? styles.selfText : styles.otherText]}>
                  {content}
                </Text>
              </View>
            </View>
          ))}
        </View>
        {isSelf && (
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
              <Text style={styles.avatarText}>M</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  messageWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    maxWidth: '85%',
    width: '100%',
  },
  selfWrapper: {
    alignSelf: 'flex-end',
  },
  otherWrapper: {
    alignSelf: 'flex-start',
  },
  avatarContainer: {
    width: 36,
    height: 36,
    marginHorizontal: 6,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  contentContainer: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderName: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '500',
    marginRight: 8,
  },
  messageGroup: {
    marginBottom: 4,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selfBubble: {
    alignSelf: 'flex-end',
  },
  otherBubble: {
    alignSelf: 'flex-start',
  },
  firstSelfBubble: {
    borderTopRightRadius: 4,
  },
  firstOtherBubble: {
    borderTopLeftRadius: 4,
  },
  sequentialBubble: {
    borderRadius: 20,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  selfText: {
    color: '#000000',
  },
  otherText: {
    color: '#000000',
  },
  timestamp: {
    fontSize: 11,
    color: '#999999',
  },
})

export default ChatMessage
