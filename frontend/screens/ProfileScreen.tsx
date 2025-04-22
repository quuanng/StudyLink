import { useContext, useEffect, useState } from "react"
import { Alert, Button, SafeAreaView, Text, ScrollView, TouchableOpacity } from "react-native"
import backend from "../backend"
import { AuthContext } from "../context/AuthContext"
import { getRefreshToken } from "../utils/auth"
import { StyleSheet } from "react-native"
import { View } from "react-native"
import Icon from 'react-native-vector-icons/MaterialIcons'

const ProfileScreen: React.FC = () => {
    const { user, login, logout } = useContext(AuthContext)
    const [avatarColor, setAvatarColor] = useState('#000000')

    useEffect(() => {
        if (user == null) return

        // Generate a consistent profile color based on the user's ID
        const hash = user.id.split('').reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc)
        }, 0)

        // Generate a pastel color using the hash
        const hue = Math.abs(hash % 360)
        const saturation = 70
        const lightness = 80
        setAvatarColor(`hsl(${hue}, ${saturation}%, ${lightness}%)`)
    }, [user])

    const handleLogout = async () => {
        try {
            const refreshToken = await getRefreshToken()
            if (refreshToken) {
                await backend.post('/login/logout', { refreshToken })
            }
            logout()
            Alert.alert('Logged out', 'You have been logged out successfully.')
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    if (!user) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <Text>Loading...</Text>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <View style={styles.profileSection}>
                    <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
                        <Text style={styles.avatarText}>
                            {user?.name.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                    <Text style={styles.userName}>{user?.name}</Text>
                    <Text style={styles.userEmail}>{user?.email}</Text>
                </View>

                <View style={styles.infoSection}>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Icon name="school" size={24} color="#007AFF" />
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>School</Text>
                                <Text style={styles.infoValue}>University of Minnesota</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Icon name="event" size={24} color="#007AFF" />
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Member Since</Text>
                                <Text style={styles.infoValue}>January 2024</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Icon name="group" size={24} color="#007AFF" />
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Study Groups</Text>
                                <Text style={styles.infoValue}>3 Active Groups</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.settingsSection}>
                    <TouchableOpacity
                        style={styles.settingsButton}
                        onPress={handleLogout}
                    >
                        <Icon name="logout" size={24} color="#FF3B30" />
                        <Text style={styles.settingsButtonText}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 24,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 40,
        fontWeight: '600',
        color: '#000000',
    },
    userName: {
        fontSize: 24,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 16,
        color: '#666666',
    },
    infoSection: {
        padding: 16,
    },
    infoCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoContent: {
        marginLeft: 16,
        flex: 1,
    },
    infoLabel: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        color: '#000000',
        fontWeight: '500',
    },
    settingsSection: {
        padding: 16,
        marginTop: 8,
    },
    settingsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    settingsButtonText: {
        marginLeft: 16,
        fontSize: 16,
        color: '#FF3B30',
        fontWeight: '500',
    },
})
