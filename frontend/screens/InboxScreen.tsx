import React, { useState, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '../navigation/MainNavigator'
import { AuthContext } from '../context/AuthContext'
import { ThemeContext } from '../context/ThemeContext'
import InboxEntry from '../components/InboxEntry'

export interface InboxEntryItem {
  id: string;
  username: string;
  icon: string;
}

export default function InboxScreen() {
  const [filteredData, setFilteredData] = useState<InboxEntryItem[]>([])
  const { user } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)

  // Populate with dummy items on first render
  useEffect(() => {
    const dummy: InboxEntryItem[] = [
      { id: '1', username: 'John Pork', icon: '' },
      { id: '2', username: 'Marvin Beak',   icon: '' },
      { id: '3', username: 'Tim Cheese',   icon: '' },
    ]
    setFilteredData(dummy)
  }, [])

  const renderItem = ({ item }: { item: InboxEntryItem }) => (
    <InboxEntry
      classId={item.id}
      className={item.username}
      icon={item.icon}
    />
  )

  return (
    <View style={[styles.container, theme === 'dark' ? styles.darkContainer : styles.lightContainer]}>
      {filteredData.length === 0 ? (
        <Text style={[styles.emptyText, theme === 'dark' ? styles.darkText : styles.lightText]}>No messages</Text>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatList}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  darkContainer: {
    backgroundColor: '#000',
  },
  lightContainer: {
    backgroundColor: '#fff',
  },
  flatList: {
    flexGrow: 1,
    paddingHorizontal: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  darkText: {
    color: '#fff',
  },
  lightText: {
    color: '#000',
  },
})
