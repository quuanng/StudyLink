import React from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/MainNavigator';
import ClassGroupEntry, { ClassGroupEntryProps } from '../components/ClassGroupEntry';

const ClassViewScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { className, members, instructor } = route.params as { className: string; members: number; instructor: string; };

  const dummyStudyGroups: ClassGroupEntryProps[] = [
    {
      title: "Homework 1 Meetup",
      timestamp: "2024-03-25T12:34:56.789Z",
      location: "HSEC Floor 3 Commons",
      maxStudents: 8,
      isPrivate: false,
      memberCount: 5
    },
    {
      title: "Final Exam Study Session",
      timestamp: "2024-04-15T14:00:00.000Z",
      location: "Library Study Room 204",
      maxStudents: 6,
      isPrivate: true,
      memberCount: 3
    },
    {
      title: "Project Group Discussion",
      timestamp: "2024-03-28T16:30:00.000Z",
      location: "Engineering Building Room 302",
      maxStudents: 5,
      isPrivate: false,
      memberCount: 4
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Button title="Back" onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>{className}</Text>
          <Text style={styles.memberCount}>{members} Members</Text>
        </View>

        <View style={styles.contentContainer}>

          <Text style={styles.welcomeText}>Browse Available Study Groups</Text>

          <FlatList
            data={dummyStudyGroups}
            renderItem={({ item }) => (
              <ClassGroupEntry {...item} />
            )}
            keyExtractor={(item) => item.timestamp}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No study groups available</Text>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginLeft: -40, // Offset for the back button to center the title
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
});

export default ClassViewScreen;