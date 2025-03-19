import EncryptedStorage from 'react-native-encrypted-storage'
import backend from '../backend.ts'

/**
 * Stores the JWT token securely.
 * @param token - The token to store.
 */
export const storeToken = async (token: string): Promise<void> => {
  try {
    await EncryptedStorage.setItem('userToken', token)
  } catch (error) {
    console.error('Error storing token:', error)
    throw new Error('Failed to store token.')
  }
}

/**
 * Retrieves the stored JWT token.
 * @returns The token, or null if it doesn't exist.
 */
export const getToken = async (): Promise<string | null> => {
  try {
    return await EncryptedStorage.getItem('userToken')
  } catch (error) {
    console.error('Error retrieving token:', error)
    return null
  }
}

/**
 * Deletes the stored JWT token.
 */
export const deleteToken = async (): Promise<void> => {
  try {
    const token = await EncryptedStorage.getItem('userToken')
    if (token) {
      await EncryptedStorage.removeItem('userToken')
    }
  } catch (error) {
    console.error('Error deleting token:', error)
  }
}


/**
 * Validates the token with the backend.
 * @param token - The token to validate.
 * @returns The user data if the token is valid.
 */
export const validateToken = async (token: string): Promise<any> => {
  try {
    const response = await backend.get('/login/me', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    return response.data.user
  } catch (error) {
    console.error('Error validating token:', error)
    return null
  }
}
