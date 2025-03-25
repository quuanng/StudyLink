import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../navigation/MainNavigator'
import ClockSvg from '../assets/ClockSvg.svg'

export interface ChatGroupEntryProps {
    title: string
    timestamp: string
    location: string
    maxStudents: Number
    isPrivate: boolean
    memberCount: Number
}

const ChatGroupEntry: React.FC<ChatGroupEntryProps> = ({ title, timestamp, location, memberCount, maxStudents, isPrivate }) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

    // TODO: May want to create one single formatTimestamp function to import and re-use
    const formatTimestamp = (timestamp: string): string => {
        const fixedTimestamp = timestamp.replace(/:(?=\d{2}$)/, '')
        const date = new Date(fixedTimestamp)
        if (isNaN(date.getTime())) {
            return ''
        }
        const now = new Date()
        const isToday = date.toDateString() === now.toDateString()
        return isToday
            ? date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
            : date.toLocaleDateString([], { month: "short", day: "numeric" })
    }

    const formattedDate = formatTimestamp(timestamp)

    return (
        <Pressable
            style={styles.container}
            disabled={true}
        >
            <View style={styles.sub_container}>
                <View style={styles.text_parent_container}>
                    <View style={styles.text_headline_container}>
                        <Text style={styles.text_headline_group_name}>{title}</Text>
                        <ClockSvg width={200} height={200} /><Text style={styles.text_headline_last_date}>{formattedDate}</Text>
                    </View>
                    <View style={styles.text_body_container}>
                        <Text style={styles.body_label}>{"No messages yet"}</Text>
                    </View>
                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        aspectRatio: 400 / 80,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        width: '100%',
    },
    sub_container: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 7,
    },
    icon_container: {
        flex: 68 / 400,
        alignContent: 'center',
        justifyContent: 'center',
    },
    placeholder_icon: {
        flex: 5 / 10,
        aspectRatio: 1,
        margin: 'auto',
        borderRadius: 100,
        backgroundColor: '#D9D9D9'
    },
    text_parent_container: {
        flex: 1,
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
        paddingRight: 0,
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
})

export default ChatGroupEntry
