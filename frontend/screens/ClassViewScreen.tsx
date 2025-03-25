import React from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/MainNavigator';
import ClassGroupEntry, { ChatGroupEntryProps } from '../components/ClassGroupEntry';

const ClassViewScreen = () => {

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { className, members, instructor } = route.params as { className: string; members: number; instructor: string; };

  const dummyStudyGroups: ChatGroupEntryProps[] = [{
    title: "Homework 1 Meetup",
    timestamp: "2025-03-25T12:34:56.789Z",
    location: "HSEC Floor 3 Commons",
    maxStudents: 50,
    isPrivate: false,
    memberCount: 15
  }]

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background}>
        <View style={styles.container}>
          <View style={styles.head_container}>
            <Button title="Back" onPress={() => navigation.goBack()} />
            <View style={styles.title_container}>
              <Text style={styles.chat_title}>{className} | {members} Members</Text>
            </View>
          </View>
          <View
            style={styles.list} >
            <Text>Welcome to the class! Browse for study groups here.</Text>
          </View>

          <FlatList
            contentContainerStyle={styles.list}
            data={dummyStudyGroups}
            renderItem={({ item }) => (
              <ClassGroupEntry
                title={item.title} timestamp={item.timestamp} location={item.location} maxStudents={item.maxStudents} isPrivate={item.isPrivate} memberCount={item.memberCount}
              />
            )}
            keyExtractor={(item) => item.timestamp}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  background: {
    backgroundColor: '#ffffff',
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  head_container: {
    height: 50,
    backgroundColor: '#ffffff',
    width: "100%",
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  title_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  chat_title: {
    fontSize: 18,
  },
  list: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 2,
    gap: 2,
    flexDirection: 'column',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ClassViewScreen