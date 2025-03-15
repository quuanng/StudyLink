import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { MergedChatMessageData } from '../screens/SingleChatScreen';

import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ChatMessageProps {
  Message: MergedChatMessageData
}

const ChatMessage: React.FC<ChatMessageProps> = ({ Message }) => {
  const [isSelf, setIsSelf] = useState(false);

  useEffect(() => {
    // TODO: setting isSelf to always be false to make all messages left-aligned
    // setIsSelf(Message.senderId == dummyLocalUserId)
  }, [Message])

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); // Example: "3:45 PM"
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" }); // Example: "Feb 27"
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sub_container}>
        {isSelf || <View style={styles.icon_container}>
          <View style={styles.placeholder_icon}>
          </View>
        </View>}
        <View style={styles.text_parent_container}>
          {!isSelf ? (
            <View style={styles.other_text_headline_container}>
              <Text style={styles.other_message_sender}>{Message.senderName}</Text>
              <Text style={styles.other_message_date}>{formatTimestamp(Message.timestamps[0])}</Text>
            </View>
          ) : (
            <View style={styles.self_text_headline_container}>
              <Text style={styles.self_message_sender}>{Message.senderName}</Text>
              <Text style={styles.self_message_date}>{formatTimestamp(Message.timestamps[0])}</Text>
            </View>
          )}
          {!isSelf ? (
            <View style={styles.other_text_body_container}>
              {Message.messages.map((content, index) => (
                <Text key={index} style={styles.other_body_label}>{content}</Text>
              ))}
            </View>
          ) : (
            <View style={styles.self_text_body_container}>
              {Message.messages.map((content, index) => (
                <Text key={index} style={styles.self_body_label}>{content}</Text>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    minHeight: 60,
    paddingVertical: 8, // Add some vertical padding
    paddingHorizontal: 10, // Add some horizontal padding
    alignSelf: 'stretch',
    backgroundColor: 'transparent', // Ensure background is visible
  },
  sub_container: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align items to the start
    width: '100%',
  },
  icon_container: {
    width: 50, // Fixed width instead of flex
    marginRight: 10,
    alignItems: 'center',
  },
  placeholder_icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D9D9D9'
  },
  text_parent_container: {
    flex: 1, // Take remaining space
    flexDirection: 'column',
    width: '100%',
  },
  other_text_headline_container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  self_text_headline_container: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 4,
  },
  other_message_sender: {
    fontWeight: 'bold',
  },
  other_message_date: {
    marginLeft: 5,
    color: '#696969',
  },
  self_message_sender: {
    fontWeight: 'bold',
    width: '100%',
  },
  self_message_date: {
    marginRight: 5,
    color: '#696969',
  },
  other_text_body_container: {
    // Remove fixed flex, allow natural expansion
  },
  self_text_body_container: {
    // Remove fixed flex, align to the right
    alignItems: 'flex-end',
  },
  other_body_label: {
    color: '#000000',
    textAlign: 'left',
    lineHeight: 18,
    marginBottom: 5,
  },
  self_body_label: {
    color: '#000000',
    textAlign: 'right',
  },
})

export default ChatMessage