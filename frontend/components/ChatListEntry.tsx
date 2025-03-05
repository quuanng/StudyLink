import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, Pressable } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/MainNavigator';

interface ChatListEntryProps {

}

const ChatListEntry: React.FC<ChatListEntryProps> = ({ }) => {

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <Pressable style={styles.container} onPress={() => navigation.navigate('SingleChatScreen', {chatId:0})}>
      <View style={styles.sub_container}>
        <View style={styles.icon_container}>
          <View style={styles.placeholder_icon}>

          </View>
        </View>
        <View style={styles.text_parent_container}>
          <View style={styles.text_headline_container}>
            <Text style={styles.text_headline_group_name}>CSCI 4041 - My Group</Text>
            <Text style={styles.text_headline_last_date}>2/28/25</Text>
          </View>
          <View style={styles.text_body_container}>
            <Text style={styles.body_label}>Hey, does anyone want to work on the homework together tonight?</Text>
          </View>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    aspectRatio: 400/80,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    width:'100%',
  },
  sub_container: {
    flex: 1,
    flexDirection: 'row',
  },
  icon_container: {
    flex: 68/400,
    alignContent: 'center',
    justifyContent: 'center',
  },
  placeholder_icon: {
    flex: 5/10,
    aspectRatio: 1,
    margin: 'auto',
    borderRadius: 100,
    backgroundColor: '#D9D9D9'
  },
  text_parent_container: {
    flex: 1-68/400,
    flexDirection: 'column',
  },
  text_headline_container: {
    paddingTop: 8,
    flex: 0.3,
    fontSize: 16,
    flexDirection: 'row',
  },
  text_headline_group_name: {
    flex: 0.7,
    textAlign: 'left',
  },
  text_headline_last_date: {
    flex: 0.3,
    textAlign: 'right',
    paddingRight: 10,
    color: '#696969'
  },
  text_body_container: {
    flex: 0.7,
    fontSize: 14,
    paddingRight: 10,
  },
  body_label: {
    color: '#696969'
  },
  image: {
    width: 150,
    height: 150,
  },
})

export default ChatListEntry