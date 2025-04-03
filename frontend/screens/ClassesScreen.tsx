import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import ClassEntry from '../components/ClassEntry'
import ClassSearch from '../components/ClassSearch'
import backend from '../backend'

export interface ClassEntryItem {
  id: string;
  className: string;
  members: number;
  icon: string;
  joined: boolean;
}

export default function ClassesScreen() {
  const [classes, setClasses] = useState<ClassEntryItem[]>([])
  const [filteredData, setFilteredData] = useState<ClassEntryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const isFirstRender = useRef(true)

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await backend.get(`/class/courses`)
        const formattedClasses = response.data.map((course: any) => ({
          id: course._id,
          className: course.full_name,
          members: course.count,
          icon: '',
          joined: false,
        }))

        setClasses(formattedClasses)
        setFilteredData(formattedClasses)
      } catch (err) {
        console.error('Error fetching classes:', err)
        setError('Failed to load classes')
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false // Mark first render as done
      return
    }

    const delaySearch = setTimeout(() => {
      if (searchQuery.trim() === '') {
        setFilteredData(classes) // Reset to original fetched data
      } else {
        fetchSearchedClasses(searchQuery)
      }
    }, 500) // Delay api call half second

    return () => clearTimeout(delaySearch)
  }, [searchQuery])

  const fetchSearchedClasses = async (query: string) => {
    try {
      const response = await backend.get(`/class/courses?search=${query}`)
      const searchedClasses = response.data.map((course: any) => ({
        id: course._id,
        className: course.full_name,
        members: course.count,
        icon: '',
        joined: false,
      }))

      setFilteredData(searchedClasses)
    } catch (error) {
      console.error('Error searching classes:', error)
    }
  }

  const handleSearch = (text: string) => {
    setSearchQuery(text) // Update searchQuery state (debounced effect will trigger API call)
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  const renderItem = ({ item }: { item: ClassEntryItem }) => (
    <ClassEntry
      classId={item.id}
      className={item.className}
      members={item.members}
      icon={item.icon}
      joined={item.joined}
      screen={'classes'}
    />
  )

  return (
    <View style={styles.container}>
      <ClassSearch onSearch={handleSearch} />
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={1}
        contentContainerStyle={styles.flatList}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  flatList: {
    flexGrow: 1,
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
})
