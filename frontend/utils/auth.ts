import EncryptedStorage from 'react-native-encrypted-storage'
import backend from '../backend.ts'

/**
 * Stores the access and refresh tokens securely.
 * @param accessToken - The access token to store.
 * @param refreshToken - The refresh token to store.
 */
export const storeTokens = async (accessToken: string, refreshToken: string): Promise<void> => {
  try {
    await EncryptedStorage.setItem('userAccessToken', accessToken)
    await EncryptedStorage.setItem('userRefreshToken', refreshToken)
  } catch (error) {
    console.error('Error storing tokens:', error)
    throw new Error('Failed to store tokens.')
  }
}

/**
 * Retrieves the stored access token.
 * @returns The access token, or null if it doesn't exist.
 */
export const getAccessToken = async (): Promise<string | null> => {
  try {
    return await EncryptedStorage.getItem('userAccessToken')
  } catch (error) {
    console.error('Error retrieving access token:', error)
    return null
  }
}

/**
 * Retrieves the stored refresh token.
 * @returns The refresh token, or null if it doesn't exist.
 */
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await EncryptedStorage.getItem('userRefreshToken')
  } catch (error) {
    console.error('Error retrieving refresh token:', error)
    return null
  }
}

/**
 * Deletes the stored tokens.
 */
export const deleteTokens = async (): Promise<void> => {
  try {
    await EncryptedStorage.removeItem('userAccessToken')
    await EncryptedStorage.removeItem('userRefreshToken')
  } catch (error) {
    console.error('Error deleting tokens:', error)
  }
}

/**
 * Refreshes the access token using the refresh token.
 * @returns The new access token if successful, null otherwise.
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await getRefreshToken()
    if (!refreshToken) return null

    const response = await backend.post('/login/refresh-token', { refreshToken })
    const { accessToken, refreshToken: newRefreshToken } = response.data
    
    // Store both the new access token and refresh token
    await EncryptedStorage.setItem('userAccessToken', accessToken)
    await EncryptedStorage.setItem('userRefreshToken', newRefreshToken)
    
    return accessToken
  } catch (error) {
    console.error('Error refreshing token:', error)
    return null
  }
}

/**
 * Validates the access token with the backend.
 * @param accessToken - The access token to validate.
 * @returns The user data if the token is valid.
 */
export const validateToken = async (accessToken: string): Promise<any> => {
  try {
    const response = await backend.get('/login/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    return response.data.user
  } catch (error) {
    // console.error('Error validating token:', error)
    return null
  }
}
