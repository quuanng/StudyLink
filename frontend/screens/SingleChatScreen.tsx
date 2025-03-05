import React, {useState} from 'react'
import { View, Text, StyleSheet, FlatList, Button, SafeAreaView} from 'react-native'
import ChatMessage, { ChatMessageData } from '../components/ChatMessage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/MainNavigator';
import ChatSendBox from '../components/ChatSendBox';

export default function ChatsScreen() {

    {/* TODO: remove */}
    const [dummyChatMessages, setDummyChatMessages] = useState([
      {
        _id: "65df3bfa1c4a1a001c1d7e5a",
        groupId: "65de2bfa2b4a2b002d2e8f5b",
        senderId: "65de2cfa3b5b3c003e3f9g6c",
        senderName: "Alice Johnson",
        message: "Hey everyone! When is our next study session?",
        timestamp: "2025-02-28T14:30:00.000Z",
        readBy: ["0", "65de4efa5d7d5e005g5i1k8e"]
      },
      {
        _id: "65df3bfb2d5c5b002e2f8g6d",
        groupId: "65de2bfa2b4a2b002d2e8f5b",
        senderId: "0",
        senderName: "Bob Smith",
        message: "I think we agreed on Sunday at 3 PM. Does that work for everyone?",
        timestamp: "2025-02-28T14:35:00.000Z",
        readBy: ["65de4efa5d7d5e005g5i1k8e"]
      },
      {
        _id: "65df3bfc3e6d6c003f3h9j8e",
        groupId: "65de2bfa2b4a2b002d2e8f5b",
        senderId: "65de4efa5d7d5e005g5i1k8e",
        senderName: "Charlie Brown",
        message: "Yeah, Sunday at 3 PM works for me!",
        timestamp: "2025-02-28T14:40:00.000Z",
        readBy: []
      }
    ]);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background}>
          <View style={styles.container}>
              <View style={styles.head_container}>
                  <Button title="Back" onPress={() => navigation.goBack()} />
                  <View style={styles.title_container}>
                      <Text style={styles.chat_title}>Chat Title Here</Text>
                  </View>
              </View>
          <FlatList contentContainerStyle={styles.list} data={dummyChatMessages}
              renderItem={({item}) => <ChatMessage Message={item} />}
              keyExtractor={(item, idx) => idx.toString()} />
          <ChatSendBox sendMessage={(content) => { {/* TODO: replace test sendMessage call with real one */}
            setDummyChatMessages(dummyChatMessages.concat({
              _id: "testid",
              groupId: "65de2bfa2b4a2b002d2e8f5b",
              senderId: "0",
              senderName: "Bob Smith",
              message: content,
              timestamp: new Date().toISOString(),
              readBy: []
            }))
          }}></ChatSendBox>
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
});
