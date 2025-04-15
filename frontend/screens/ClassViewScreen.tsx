import React, { useContext, useEffect, useState } from 'react'
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../navigation/MainNavigator'
import ClassGroupEntry, { ClassGroupEntryProps } from '../components/ClassGroupEntry'
import backend from '../backend'
import { AuthContext } from '../context/AuthContext'

const ClassViewScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const route = useRoute()
  const { classId, className, members, instructor } = route.params as {
    classId: string,
    className: string,
    members: number,
    instructor: string
  }

  const { user } = useContext(AuthContext)

  const [studyGroups, setStudyGroups] = useState<ClassGroupEntryProps[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isFocused = useIsFocused()

  const refresh = () => {
    // TODO: refresh func
  }

  useEffect(() => {
    if (!isFocused) return

    const fetchStudyGroups = async () => {
      try {
        const response = await backend.get(`study-group/class/${classId}`)
        const groups = response.data

        const formattedGroups: ClassGroupEntryProps[] = groups.map((group: any) => ({
          title: group.title,
          timestamp: group.time,
          location: group.location,
          maxStudents: group.maxStudents,
          isPrivate: group.priv,
          memberCount: group.members.length,
          isOwnedByLocal: group.creatorId == user?.id,
          localIsJoined: (group.members.some((u: any) => user?.id == u?.userId)),
          refresh: refresh,
        }))

        setStudyGroups(formattedGroups)
      } catch (err) {
        console.error(err)
        setError('Failed to load study groups.')
      } finally {
        setLoading(false)
      }
    }

    fetchStudyGroups()
  }, [classId, isFocused])

  const renderItem = ({ item }: { item: ClassGroupEntryProps }) => (
    <ClassGroupEntry {...item} />
  )

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: '#007AFF' }}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{className}</Text>
          <Text style={styles.memberCount}>{members} Members</Text>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.welcomeText}>Browse Available Study Groups</Text>

          {loading ? (
            <ActivityIndicator size="large" style={{ marginTop: 20 }} />
          ) : error ? (
            <Text style={styles.emptyText}>{error}</Text>
          ) : (
            <FlatList
              data={studyGroups}
              renderItem={renderItem}
              keyExtractor={(item) => item.timestamp}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No study groups available</Text>
              }
            />
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() =>
                navigation.navigate('GroupCreationForm', {
                  classId,
                  className,
                })
              }
            >
              <Text style={styles.addButtonText}>Add a Group</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  memberCount: {
    fontSize: 14,
    color: '#666',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginVertical: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 32,
    fontSize: 16,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
})

export default ClassViewScreen
