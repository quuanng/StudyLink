import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useContext } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { RootStackParamList } from '../navigation/MainNavigator';
import { useNavigation } from '@react-navigation/native';
import backend from '../backend';
import { AuthContext } from '../context/AuthContext';

interface ClassProps {
    classId: string;
    className: string;
    members: number;
    icon: string;
    joined: boolean;
    screen: "home" | "classes";
    updateJoined: (joined: boolean) => void
}

const ClassEntry: React.FC<ClassProps> = ({ classId, className, members, icon, joined, screen, updateJoined }) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
    const { user } = useContext(AuthContext)

    async function joinClass() {
        try {
            let response = backend.post("/user/toggle-class", { userId: user?.id, classId: classId })

            updateJoined(!joined)
        }
        catch (error) {
            console.error(error)
        }
    }

    return (
        <TouchableOpacity
            style={[styles.container, joined && styles.joinedContainer]}
            onPress={() => {
                if (joined) { navigation.navigate('ClassViewScreen', { classId: classId, className: className, members: members, instructor: "Unknown Instructor" }) }
            }}
            disabled={!joined}
        >
            <View style={styles.leftContent}>
                <View style={styles.iconContainer}>
                    <Icon name="book" size={24} color={joined ? "#4A90E2" : "#666"} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.className}>{className}</Text>
                    <View style={styles.memberContainer}>
                        <Icon name="team" size={14} color="#666" />
                        <Text style={styles.memberText}>{members} members</Text>
                    </View>
                </View>
            </View>

            <View style={styles.rightContent}>
                {joined && screen === "home" ? (
                    <View style={[styles.statusBadge, styles.joinedBadge]}>
                        <Text style={styles.statusText}>
                            {"View"}
                        </Text>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={styles.joinButton}
                        onPress={() => {
                            joinClass()
                        }}
                    >
                        <Text style={styles.joinButtonText}>{joined ? "Remove" : "Join"}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        padding: 16,
        marginVertical: 6,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    joinedContainer: {
        borderLeftWidth: 4,
        borderLeftColor: '#4A90E2',
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    className: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    memberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    memberText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    rightContent: {
        marginLeft: 12,
    },
    statusBadge: {
        backgroundColor: '#E8F2FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    joinedBadge: {
        backgroundColor: '#F0F0F0',
    },
    statusText: {
        fontSize: 14,
        color: '#4A90E2',
        fontWeight: '500',
    },
    joinButton: {
        backgroundColor: '#4A90E2',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
    },
    joinButtonText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '600',
    },
});

export default ClassEntry