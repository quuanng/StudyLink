import React, { useContext, useEffect } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator, StackNavigationProp, TransitionPresets } from '@react-navigation/stack'
import { NavigationContainer, DefaultTheme, DarkTheme, useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Ionicons'
import { ThemeContext } from '../context/ThemeContext' // To manage light/dark mode
import HomeScreen from '../screens/HomeScreen'
import ClassesScreen from '../screens/ClassesScreen'
import ChatsScreen from '../screens/ChatsScreen'
import LoginScreen from '../screens/LoginScreen'
import SingleChatScreen from '../screens/SingleChatScreen'
import ClassViewScreen from '../screens/ClassViewScreen'
import GroupCreationForm from '../screens/GroupCreationForm'
import GroupEditForm from '../screens/GroupEditForm'
import { ClassGroupEntryProps } from '../components/ClassGroupEntry'
import { AuthContext } from '../context/AuthContext'
import ProfileScreen from '../screens/ProfileScreen'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

export type RootStackParamList = {
  LoginScreen: undefined,
  MainTabs: undefined,
  SingleChatScreen: { chatId: string },
  ClassViewScreen: { classId: string, className: string; members: number; instructor: string; }
  GroupCreationForm: { classId: string; className: string; }
  GroupEditForm: { group: ClassGroupEntryProps }
}

function TabNavigator() {
  const { theme } = useContext(ThemeContext)

  const { user } = useContext(AuthContext)
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

  useEffect(() => {
    if (!user) {
      navigation.navigate("LoginScreen")
    }
  }, [user])

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
        <Stack.Screen options={{ ...TransitionPresets.ModalFadeTransition }} name="LoginScreen" component={LoginScreen} />

        <Stack.Screen options={{ ...TransitionPresets.ModalFadeTransition }} name="MainTabs" component={TabNavigator} />

        <Stack.Screen name="SingleChatScreen" component={SingleChatScreen} />

        <Stack.Screen name="ClassViewScreen" component={ClassViewScreen} />

        <Stack.Screen options={{ ...TransitionPresets.ModalPresentationIOS }} name="GroupCreationForm" component={GroupCreationForm} />
        <Stack.Screen options={{ ...TransitionPresets.ModalPresentationIOS }} name="GroupEditForm" component={GroupEditForm} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}