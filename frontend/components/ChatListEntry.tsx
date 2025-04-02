import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../navigation/MainNavigator'

interface ChatListEntryProps {
  id: string
  title: string
  lastMessage: string
  lastDate: string | null
}

const ChatListEntry: React.FC<ChatListEntryProps> = ({ id, title, lastMessage, lastDate }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

  const formattedDate = lastDate ? lastDate.split("T")[0] : "No Date"

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressedContainer
      ]} 
      onPress={() => navigation.navigate('SingleChatScreen', { chatId: id })}
    >
      <View style={styles.sub_container}>
        <View style={styles.icon_container}>
          <View style={styles.placeholder_icon} />
        </View>
        <View style={styles.text_parent_container}>
          <View style={styles.text_headline_container}>
            <Text style={styles.text_headline_group_name} numberOfLines={1}>{title}</Text>
            <Text style={styles.text_headline_last_date}>{formattedDate}</Text>
          </View>
          <View style={styles.text_body_container}>
            <Text style={styles.body_label} numberOfLines={1}>{lastMessage || "No messages yet"}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    width: '100%',
    marginVertical: 6,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pressedContainer: {
    backgroundColor: '#f8f8f8',
    transform: [{ scale: 0.98 }],
  },
  sub_container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  icon_container: {
    width: 48,
    height: 48,
    marginRight: 16,
  },
  placeholder_icon: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    backgroundColor: '#E8E8E8',
  },
  text_parent_container: {
    flex: 1,
    width: '100%',
  },
  text_headline_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    width: '100%',
  },
  text_headline_group_name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
    marginRight: 8,
  },
  text_headline_last_date: {
    fontSize: 14,
    color: '#666666',
  },
  text_body_container: {
    marginTop: 2,
    width: '100%',
  },
  body_label: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
})

export default ChatListEntry
