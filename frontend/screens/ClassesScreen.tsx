import React, { useState, useEffect } from 'react'
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

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await backend.get(`/class/courses`)
        
        // Transform API response to match ClassEntryItem
        const formattedClasses = response.data.map((course: any) => ({
          id: course._id,
          className: course.full_name,
          members: course.count,
          icon: "",
          joined: false
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

  const handleSearch = async (text: string) => {
    setSearchQuery(text)
  
    if (text.trim() === '') {
      setFilteredData(classes) // Reset to initial 20 courses
      return
    }
  
    try {
      const response = await backend.get(`/class/courses?search=${text}`)
      const searchedClasses = response.data.map((course: any) => ({
        id: course._id,
        className: course.full_name,
        members: course.count,
        icon: "",
        joined: false
      }))
  
      setFilteredData(searchedClasses)
    } catch (error) {
      console.error('Error searching classes:', error)
    }
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
      className={item.className} 
      members={item.members} 
      icon={item.icon} 
      joined={item.joined} 
      screen={"classes"} 
    />
  )

  return (
    <View style={styles.container}>
      <ClassSearch onSearch={handleSearch} />
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
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
    paddingHorizontal: 10
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
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
