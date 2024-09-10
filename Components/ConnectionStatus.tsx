import React from "react";
import {View, StyleSheet, Alert, Text} from "react-native";

type ConnectionStatus = {
    success: boolean;
}

export default function ConnectionStatus({success}: ConnectionStatus) {
    return (
        <View style={{...styles.container, backgroundColor:success?"green":"#d8c36b"}}>
            <Text style={{fontSize: 12.5, fontWeight: 'bold', textAlign:'center', color:"white"}}>{success ? "Connected" : "Connecting"}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent:'center',
    }
})