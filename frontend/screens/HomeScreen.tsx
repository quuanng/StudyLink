import React, { useState } from 'react'
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native'
import ClassEntry from "../components/ClassEntry"
import ClassSearch from "../components/ClassSearch"
import { ClassEntryItem } from './ClassesScreen';


export default function HomeScreen() {

  // TODO: replace with real data
  const test_joined_classes = [
    { id: '1', className: 'CSCI 1133', members: 27, icon: "", joined: true },
    { id: '5', className: 'STAT 3021', members: 49, icon: "", joined: true }
  ];

  const renderItem = ({ item }: { item: ClassEntryItem }) => (
    <ClassEntry classId={item.id} className={item.className} members={item.members} icon={item.icon} joined={true} screen='home' />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={test_joined_classes}
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
  },
  flatList: {
    flexGrow: 1,
    paddingHorizontal: 10,
  },
});

