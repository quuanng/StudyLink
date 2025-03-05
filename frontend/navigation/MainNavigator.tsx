import React, { useContext } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Ionicons'
import { ThemeContext } from '../context/ThemeContext' // To manage light/dark mode
import HomeScreen from '../screens/HomeScreen'
import ClassesScreen from '../screens/ClassesScreen'
import ChatsScreen from '../screens/ChatsScreen'
import ProfileScreen from '../screens/ProfileScreen'
import SingleChatScreen from '../screens/SingleChatScreen'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

export type RootStackParamList = {
  MainTabs: undefined,
  SingleChatScreen: { chatId: number }; // Define chatId as a parameter
};

function TabNavigator() {
  const { theme } = useContext(ThemeContext)

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = ''
          if (route.name === 'Home') iconName = 'home-outline'
          else if (route.name === 'Courses') iconName = 'search-outline'
          else if (route.name === 'Chats') iconName = 'chatbubbles-outline'
          else if (route.name === 'Profile') iconName = 'person-outline'

          return <Icon name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: theme === 'dark' ? '#fff' : '#000',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Courses" component={ClassesScreen} />
      <Tab.Screen name="Chats" component={ChatsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

// Stack Navigator (Manages Both Tabs and Full-Screen Pages)
export default function MainNavigator() {
  const { theme } = useContext(ThemeContext)

  return (
    <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />

        <Stack.Screen name="SingleChatScreen" component={SingleChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}