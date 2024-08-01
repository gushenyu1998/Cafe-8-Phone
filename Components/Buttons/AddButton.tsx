import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";

type AddButtonType = {
    onPress: ()=>void
}

const AddButton:React.FC<AddButtonType> = ({onPress}) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Icon name={"add"} size={80} color={"white"}/>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: 'rgba(228,13,13,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // Adds shadow for Android
        shadowColor: '#000', // Adds shadow for iOS
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
});

export default AddButton;