import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';

interface Props {
    size?: {
        width?: number;
        height?: number;
    };
    contentCancel: string;
    contentConfirm: string
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmAndCancelButton: React.FC<Props> = ({size, contentCancel, contentConfirm,  onConfirm, onCancel}) => {
    const {width, height} = size || {};
    return (
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={{...styles.buttonCancel, width: width, height: height}} onPress={onCancel}>
                <Text style={{...styles.buttonText, color: "#505050"}}>{contentCancel}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{...styles.buttonConfirm, width: width, height: height}} onPress={onConfirm}>
                <Text style={styles.buttonText}>{contentConfirm}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: 'auto',
    },
    buttonConfirm: {
        padding: 12,
        backgroundColor: '#007BFF',
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    buttonCancel: {
        padding: 12,
        borderColor: '#007BFF',
        backgroundColor: "#efefef",
        borderWidth: 2,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default ConfirmAndCancelButton;
