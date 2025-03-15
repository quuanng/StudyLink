import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, SafeAreaView, ActivityIndicator } from 'react-native';
import ChatMessage from '../components/ChatMessage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/MainNavigator';
import ChatSendBox from '../components/ChatSendBox';
import backend from '../backend';

export interface RawChatMessageData {
  _id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  readBy: string[];
}

export interface MergedChatMessageData {
  _ids: string[];
  groupId: string;
  senderId: string;
  senderName: string;
  messages: string[];
  timestamps: string[];
  readBy: string[][];
}

export default function ChatsScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { chatId } = route.params as { chatId: string };

  const [chatMessages, setChatMessages] = useState<MergedChatMessageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const createEmptyMergedMessage = (): MergedChatMessageData => ({
    _ids: [],
    groupId: "",
    senderId: "",
    senderName: "",
    messages: [],
    timestamps: [],
    readBy: []
  });

  const tryMergeAllMessages = (rawMessages: RawChatMessageData[]): MergedChatMessageData[] => {
    const sortedByTimestamp = [...rawMessages].sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
    let output: MergedChatMessageData[] = [];
    let curMergedMessage: MergedChatMessageData = createEmptyMergedMessage();

    sortedByTimestamp.forEach(msg => {
      const lastTimestamp = curMergedMessage.timestamps.length > 0
        ? Date.parse(curMergedMessage.timestamps[curMergedMessage.timestamps.length - 1])
        : 0;

      const timeSincePreviousMessageMs = Date.parse(msg.timestamp) - lastTimestamp;

      if (timeSincePreviousMessageMs > 300000 || (msg.senderId !== curMergedMessage.senderId && msg.senderId !== "")) {
        if (curMergedMessage._ids.length > 0) {
          output.push(curMergedMessage);
        }
        curMergedMessage = createEmptyMergedMessage();
      }

      curMergedMessage._ids.push(msg._id);
      curMergedMessage.groupId = msg.groupId;
      curMergedMessage.senderId = msg.senderId;
      curMergedMessage.senderName = msg.senderName;
      curMergedMessage.messages.push(msg.message);
      curMergedMessage.timestamps.push(msg.timestamp);
      curMergedMessage.readBy = curMergedMessage.readBy.concat(msg.readBy);
    });

    if (curMergedMessage._ids.length > 0) {
      output.push(curMergedMessage);
    }

    return output;
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await backend.get(`/chat/${chatId}`);
        setChatMessages(tryMergeAllMessages(response.data));
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatId]);

  const sendMessage = async (content: string) => {
    try {
      await backend.post(`/chat/send`, {
        groupId: chatId,
        senderId: "67be7407f0ae91e0663e4332",
        message: content,
      });

      const response = await backend.get(`/chat/${chatId}`);
      setChatMessages(tryMergeAllMessages(response.data));
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
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
            keyExtractor={(item, idx) => idx.toString()}
          />
          <ChatSendBox sendMessage={sendMessage} />
        </View>
      </View>
    </SafeAreaView>
  );
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
});
