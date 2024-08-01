import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

type AddButtonType = {
    onPress: () => void
}

const SubmitButton: React.FC<AddButtonType> = ({onPress}) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.text}>Submit</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 150,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(13,63,228,0.65)',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // Adds shadow for Android
        shadowColor: '#000', // Adds shadow for iOS
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    text: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#FFFFFF"
    }
});

export default SubmitButton;