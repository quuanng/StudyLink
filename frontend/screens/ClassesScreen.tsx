import React, { useState, useEffect, useRef, useContext } from 'react'
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import ClassEntry from '../components/ClassEntry'
import ClassSearch from '../components/ClassSearch'
import backend from '../backend'
import { AuthContext } from '../context/AuthContext'

export interface ClassEntryItem {
  id: string;
  className: string;
  members: number;
  icon: string;
  joined: boolean;
}

export default function ClassesScreen() {
  const { user } = useContext(AuthContext)
  const [classes, setClasses] = useState<ClassEntryItem[]>([])
  const [filteredData, setFilteredData] = useState<ClassEntryItem[]>([])
  const [savedClassIds, setSavedClassIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const isFirstRender = useRef(true)

  useEffect(() => {
    const fetchClasses = async () => {
      if (!user?.id) {
        setError("User not logged in.")
        setLoading(false)
        return
      }

      try {
        const [allClassesResponse, savedClassesResponse] = await Promise.all([
          backend.get(`/class/courses`),
          backend.get(`/user/${user.id}/saved-courses`),
        ])

        const savedIds = new Set<string>(
          savedClassesResponse.data.savedCourses.map((course: any) => String(course._id))
        )        
        setSavedClassIds(savedIds)

        const formattedClasses: ClassEntryItem[] = allClassesResponse.data.map((course: any) => ({
          id: course._id,
          className: course.full_name,
          members: course.count,
          icon: '',
          joined: savedIds.has(course._id),
        }))

        setClasses(formattedClasses)
        setFilteredData(formattedClasses)
        setError(null)
      } catch (err) {
        console.error('Error fetching classes:', err)
        setError('Failed to load classes')
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [user])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const delaySearch = setTimeout(() => {
      if (searchQuery.trim() === '') {
        setFilteredData(classes)
      } else {
        fetchSearchedClasses(searchQuery)
      }
    }, 500)

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
        joined: savedClassIds.has(course._id), // ✅ Use global Set
      }))

      setFilteredData(searchedClasses)
    } catch (error) {
      console.error('Error searching classes:', error)
    }
  }

  const handleSearch = (text: string) => {
    setSearchQuery(text)
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
