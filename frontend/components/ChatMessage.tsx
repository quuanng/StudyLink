import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, Pressable } from 'react-native'

export interface ChatMessageData {
  _id: string;  // MongoDB ObjectId as a string
  groupId: string; // Reference to StudyGroup
  senderId: string; // Reference to User
  senderName: string;
  message: string;
  timestamp: string; // Date represented as an ISO string
  readBy: string[]; // Array of User IDs who have read the message
}

interface ChatMessageProps {
  Message: ChatMessageData
}

// TODO: This is only for testing, remove once connected to backend
const dummyLocalUserId = "0";

const ChatMessage: React.FC<ChatMessageProps> = ({ Message }) => {

  const [isSelf, setIsSelf] = useState(false);

  useEffect(() => {
    setIsSelf(Message.senderId == dummyLocalUserId)
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
          {!isSelf &&
            <View style={styles.other_text_headline_container}>
              <Text style={styles.other_message_sender}>{Message.senderName}</Text>
              <Text style={styles.other_message_date}>{formatTimestamp(Message.timestamp)}</Text>
            </View>
            ||
            <View style={styles.self_text_headline_container}>
              <Text style={styles.self_message_sender}>{Message.senderName}</Text>
              <Text style={styles.self_message_date}>{formatTimestamp(Message.timestamp)}</Text>
            </View>
          }
          {!isSelf &&
            <View style={styles.other_text_body_container}>
              <Text style={styles.other_body_label}>{Message.message}</Text>
            </View>
            ||
            <View style={styles.self_text_body_container}>
              <Text style={styles.self_body_label}>{Message.message}</Text>
            </View>
          }
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    aspectRatio: 400 / 60,
    borderRadius: 5,
    width: '100%',
  },
  sub_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  icon_container: {
    flex: 68 / 400,
    alignContent: 'center',
    justifyContent: 'center',
  },
  placeholder_icon: {
    width: 40,
    height: 40,
    aspectRatio: 1,
    margin: 'auto',
    borderRadius: 100,
    backgroundColor: '#D9D9D9'
  },
  text_parent_container: {
    flex: 1 - 68 / 400,
    flexDirection: 'column',
  },
  other_text_headline_container: {
    paddingTop: 8,
    flex: 0.3,
    fontSize: 16,
    flexDirection: 'row',
  },
  self_text_headline_container: {
    paddingTop: 8,
    flex: 0.3,
    fontSize: 16,
    paddingRight: 10,
    flexDirection: 'row-reverse',
  },
  other_message_sender: {
    textAlign: 'left',
  },
  other_message_date: {
    textAlign: 'left',
    paddingLeft: 5,
    color: '#696969'
  },
  self_message_sender: {
    textAlign: 'right',
  },
  self_message_date: {
    textAlign: 'right',
    paddingRight: 5,
    color: '#696969'
  },
  other_text_body_container: {
    flex: 0.7,
    fontSize: 14,
    paddingRight: 10,
    marginTop: 3,
  },
  self_text_body_container: {
    flex: 0.7,
    fontSize: 14,
    paddingRight: 10,
    flexDirection: 'row-reverse',
    marginTop: 3,
  },
  other_body_label: {
    color: '#696969',
    textAlign: 'left',
  },
  self_body_label: {
    color: '#696969',
    textAlign: 'right',
  },
  image: {
    width: 150,
    height: 150,
  },
})

export default ChatMessage