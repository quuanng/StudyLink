import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../navigation/MainNavigator'
import Icon from 'react-native-vector-icons/Octicons'

export interface ClassGroupEntryProps {
    title: string
    timestamp: string
    location: string
    maxStudents: number
    isPrivate: boolean
    memberCount: number
}

const ClassGroupEntry: React.FC<ClassGroupEntryProps> = ({
    title,
    timestamp,
    location,
    memberCount,
    maxStudents,
    isPrivate
}) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

    const calculateDaysUntilMeeting = (timestamp: string): string => {
        const meetingDate = new Date(timestamp)
        if (isNaN(meetingDate.getTime())) return ''

        const now = new Date()
        const diffTime = meetingDate.getTime() - now.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 0) return 'Meeting today'
        if (diffDays === 1) return 'Meeting tomorrow'
        if (diffDays < 0) return 'Meeting passed'
        return `Meeting in ${diffDays} days`
    }

    const meetingText = calculateDaysUntilMeeting(timestamp)

    return (
        <Pressable
            style={styles.container}
            onPress={() => {/* Handle navigation */ }}
        >
            <View style={styles.contentContainer}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title} numberOfLines={1}>{title}</Text>
                    <View style={styles.memberCount}>
                        <Icon name="people" size={16} color="#666" />
                        <Text style={styles.memberCountText}>
                            {memberCount}/{maxStudents}
                        </Text>
                    </View>
                </View>

                <View style={styles.mainContentRow}>
                    <View style={styles.infoContainer}>
                        <View style={styles.iconRow}>
                            <View style={styles.iconContainer}>
                                <View style={styles.iconWrapper}>
                                    <Icon
                                        name={isPrivate ? "lock" : "globe"}
                                        size={16}
                                        color="#666"
                                        style={{ marginLeft: 1 }}
                                    />
                                </View>
                                <Text style={styles.infoText}>
                                    {isPrivate ? "Request Only" : "Open to Anyone"}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.iconRow}>
                            <View style={styles.iconContainer}>
                                <View style={styles.iconWrapper}>
                                    <Icon
                                        name="clock"
                                        size={16}
                                        color="#666"
                                    />
                                </View>
                                <Text style={styles.infoText}>{meetingText}</Text>
                            </View>
                        </View>

                        <View style={styles.iconRow}>
                            <View style={styles.iconContainer}>
                                <View style={styles.iconWrapper}>
                                    <Icon
                                        name="location"
                                        size={16}
                                        color="#666"
                                        style={{ marginLeft: 1 }}
                                    />
                                </View>
                                <Text style={styles.infoText} numberOfLines={1}>{location}</Text>
                            </View>
                        </View>
                    </View>

                    <Pressable
                        style={[
                            styles.joinButton,
                            isPrivate && styles.requestButton
                        ]}
                        onPress={() => {/* Handle join/request */ }}
                    >
                        <Text style={styles.joinButtonText}>
                            {isPrivate ? "Request" : "Join"}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        width: '95%',
        marginVertical: 6,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        alignSelf: 'center',
    },
    contentContainer: {
        padding: 12,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        flex: 1,
        marginRight: 12,
    },
    memberCount: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    memberCountText: {
        marginLeft: 4,
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    mainContentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    infoContainer: {
        flex: 1,
        marginRight: 16,
    },
    iconRow: {
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    iconWrapper: {
        width: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoText: {
        fontSize: 13,
        color: '#666',
        marginLeft: 8,
        flex: 1,
    },
    joinButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
        alignSelf: 'flex-end',
    },
    requestButton: {
        backgroundColor: '#FF9500',
    },
    joinButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
})

export default ClassGroupEntry
