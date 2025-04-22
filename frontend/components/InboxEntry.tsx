import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useContext } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../navigation/MainNavigator';
import { useNavigation } from '@react-navigation/native';
import backend from '../backend';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

interface InboxProps {
    classId: string;
    className: string;
    icon: string;
}

const InboxEntry: React.FC<InboxProps> = ({ classId, className, icon }) => {
    const { user } = useContext(AuthContext)
    const { theme } = useContext(ThemeContext)
    const [isLoading, setIsLoading] = useState(false)

    const handleAccept = async () => {
        setIsLoading(true)
        try {
            // TODO: Implement accept request logic
            await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
        } catch (error) {
            console.error('Failed to accept request:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleReject = async () => {
        setIsLoading(true)
        try {
            // TODO: Implement reject request logic
            await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
        } catch (error) {
            console.error('Failed to reject request:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <View style={[styles.container, theme === 'dark' ? styles.darkContainer : styles.lightContainer]}>
            <View style={styles.leftContent}>
                <View style={[styles.iconContainer, theme === 'dark' ? styles.darkIconContainer : styles.lightIconContainer]}>
                    <Icon name="person-add-outline" size={24} color={theme === 'dark' ? '#fff' : '#4A90E2'} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.className, theme === 'dark' ? styles.darkText : styles.lightText]}>
                        {className}
                    </Text>
                    <Text style={[styles.requestText, theme === 'dark' ? styles.darkSubText : styles.lightSubText]}>
                        Wants to join your group
                    </Text>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleAccept}
                    disabled={isLoading}
                >
                    <Icon name="checkmark" size={24} color="#4CAF50" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleReject}
                    disabled={isLoading}
                >
                    <Icon name="close" size={24} color="#f44336" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        marginVertical: 6,
        marginHorizontal: 10,
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
    darkContainer: {
        backgroundColor: '#1a1a1a',
    },
    lightContainer: {
        backgroundColor: '#FFFFFF',
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 20,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    darkIconContainer: {
        backgroundColor: '#2a2a2a',
    },
    lightIconContainer: {
        backgroundColor: '#F5F5F5',
    },
    textContainer: {
        flex: 1,
    },
    className: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    darkText: {
        color: '#fff',
    },
    lightText: {
        color: '#333',
    },
    requestText: {
        fontSize: 14,
        opacity: 0.8,
    },
    darkSubText: {
        color: '#ccc',
    },
    lightSubText: {
        color: '#666',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 4,
        marginLeft: 'auto',
    },
    button: {
        padding: 4,
    },
});

export default InboxEntry