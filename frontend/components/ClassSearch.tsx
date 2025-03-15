import React, { useState } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface ClassSearchProps {
    onSearch: (text: string) => void;
}

const ClassSearch: React.FC<ClassSearchProps> = ({ onSearch }) => {
    const [searchText, setSearchText] = useState('');

    const handleInputChange = (text: string) => {
        setSearchText(text);
        onSearch(text);
    };

    return (
        <View style={styles.container}>
            <Icon name="search" size={20} style={styles.icon} />
            <TextInput
                style={styles.input}
                placeholder="Search all classes..."
                placeholderTextColor="gray"
                value={searchText}
                onChangeText={handleInputChange}
                autoCapitalize="none"
                clearButtonMode="always"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D9D9D9',
        borderRadius: 20,
        height: 40,
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5
    },
    icon: {
        marginRight: 5,
        color: "grey"
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#333"
    }
});

export default ClassSearch;
