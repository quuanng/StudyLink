import React, { useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet, Alert, Pressable } from 'react-native'

interface RegisterFormProps {
    onSubmit: (name: string, email: string, password: string) => void // Callback to handle form submission
    loading?: boolean // Optional: Show a loading state
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
            <Text style={styles.label}>Display Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your display name"
                value={name}
                onChangeText={setName}
                autoCapitalize="none"
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title={loading ? 'Signing up...' : 'Sign up'} onPress={handleSubmit} disabled={loading} />
            <Button title="I already have an account" onPress={swapForm} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    pressableLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'blue',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
    },
})

export default RegisterForm
