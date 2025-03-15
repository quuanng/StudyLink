import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

interface ClassProps {
    className: string;
    members: number;
    icon: string;
}

const ClassEntry: React.FC<ClassProps> = ({ className, members, icon }) => {
    return (
        <View style={styles.item}>
            {/*tl text*/}
            <Text style={styles.title}>{className}</Text>

            <Icon name="team" size={70} color="black" style={styles.icon} />
            <View style={styles.divider} />
            <View style={styles.bottomRow}>
                <Icon name="smileo" size={20} color="black" style={styles.icon} />
                {/*bl text*/}
                <Text style={styles.bottomText}>{members}</Text>

                {/*br button*/}
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Join</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#D9D9D9',
        flex: 0.48,
        marginTop: 10,
        borderRadius: 25,
        height: 190,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 16,
        marginTop: 10,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    icon: {
        alignSelf: 'center',
        justifyContent: 'center',
        marginVertical: 25,
    },
    divider: {
        height: 1,
        backgroundColor: '#A7A7A7',
        width: '100%',
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'center',
        width: '85%',
        marginTop: -15,
    },
    bottomText: {
        fontSize: 12,
        flex: 1,
        marginLeft: 10,
        color: '#696969'
    },
    button: {
        backgroundColor: '#696969',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 20
    },
    buttonText: {
        fontWeight: 'bold',
        color: 'white'
    },
});



export default ClassEntry