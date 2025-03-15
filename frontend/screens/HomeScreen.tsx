import React, { useState } from 'react'
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native'
import ClassEntry from "../components/ClassEntry"
import ClassSearch from "../components/ClassSearch"


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
    { id: '4', className: 'MATH 1371', members: 87, icon: "" },
    { id: '5', className: 'STAT 3021', members: 49, icon: "" }
  ];

  const renderItem = ({ item }: { item: Item }) => (
    <ClassEntry className={item.className} members={item.members} icon={item.icon} />
  );
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);


  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === ''){
      setFilteredData(data);
    } else {
      const filtered = data.filter(item =>
        item.className.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }

  return (
    <View style={styles.container}>
      <ClassSearch onSearch={handleSearch}/>
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
});

