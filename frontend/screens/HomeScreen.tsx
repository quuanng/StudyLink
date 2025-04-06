import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import ClassEntry from '../components/ClassEntry';
import { ClassEntryItem } from './ClassesScreen';
import backend from '../backend';
import { AuthContext } from '../context/AuthContext';

export default function HomeScreen() {
  const { user } = useContext(AuthContext);
  const [joinedClasses, setJoinedClasses] = useState<ClassEntryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't run the fetch until user is loaded
    if (!user) return;

    const fetchJoinedClasses = async () => {
      try {
        const response = await backend.get(`/user/${user.id}/saved-courses`);
        const courses = response.data.savedCourses;

        const formattedCourses: ClassEntryItem[] = courses.map((course: any) => ({
          id: course._id,
          className: course.full_name,
          members: course.count,
          icon: '',
          joined: true,
        }));

        setJoinedClasses(formattedCourses);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load courses.');
      } finally {
        setLoading(false); // Only stop loading after fetch is attempted
      }
    };

    fetchJoinedClasses();
  }, [user]);

  const renderItem = ({ item }: { item: ClassEntryItem }) => (
    <ClassEntry
      classId={item.id}
      className={item.className}
      members={item.members}
      icon={item.icon}
      joined={true}
      screen="home"
    />
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={joinedClasses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={1}
        contentContainerStyle={styles.flatList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    flexGrow: 1,
    paddingHorizontal: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
