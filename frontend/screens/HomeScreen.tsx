import React from 'react'
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native'
import ClassEntry from "../components/ClassEntry"


export default function HomeScreen() {
  interface Item {
    id: string;
    className: string;
    members: number;
    icon: string;
  }

  const data = [
    { id: '1', className: 'CSCI 1133', members: 27, icon: "" },
    { id: '2', className: 'CSCI 1933', members: 30, icon: ""},
    { id: '3', className: 'CSCI 2021', members: 33, icon: "" },
  ];
  const renderItem = ({ item }: { item: Item }) => (
    <ClassEntry className={item.className} members={item.members} icon={item.icon} />
  );
  return (
    <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.container}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  flatList: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  row: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
});

