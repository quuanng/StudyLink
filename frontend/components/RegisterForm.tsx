import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Alert, Pressable } from 'react-native'

interface RegisterFormProps {
    onSubmit: (name: string, email: string, password: string) => void
    loading?: boolean
    swapForm: () => void
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, loading, swapForm }) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in both fields')
            return
        }
        onSubmit(name, email, password)
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Display Name"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={name}
                onChangeText={setName}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Pressable style={styles.loginButton} onPress={handleSubmit} disabled={loading}> 
                <Text style={styles.loginButton}>
                    {loading ? 'Signing up...' : 'Sign up'}
                </Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 20,
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#fff',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    loginButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 24,
        color: '#FFFFFF',
        fontSize: 16,
        alignItems: "center",
        fontWeight: '600',
    },
})

export default RegisterForm
