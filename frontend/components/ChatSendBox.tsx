import React, { useState } from 'react'
import { View, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

interface ChatSendBoxProps {
    sendMessage: (content: string) => void
}

const ChatSendBox: React.FC<ChatSendBoxProps> = ({ sendMessage }) => {
    const [content, setContent] = useState('')

    const onPressSend = () => {
        if (content.trim() !== '') {
            sendMessage(content)
            setContent('')
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    onChangeText={setContent}
                    value={content}
                    placeholder="Message"
                    placeholderTextColor="#999999"
                    style={styles.input}
                    multiline
                />
                <TouchableOpacity 
                    style={[styles.sendButton, !content.trim() && styles.sendButtonDisabled]} 
                    onPress={onPressSend}
                    disabled={!content.trim()}
                >
                    <Icon 
                        name="send" 
                        size={20} 
                        color={content.trim() ? '#007AFF' : '#999999'} 
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e5e5e5',
        paddingHorizontal: 16,
        paddingVertical: 8,
        paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333333',
        maxHeight: 100,
        minHeight: 36,
        paddingTop: 8,
        paddingBottom: 8,
    },
    sendButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    sendButtonDisabled: {
        backgroundColor: '#f5f5f5',
    },
})

export default ChatSendBox
