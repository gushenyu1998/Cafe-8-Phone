import React from "react";
import {View, StyleSheet, Alert, Text} from "react-native";

type ConnectionStatus = {
    success: boolean;
}
const netConfig = require("../Config/Network.json");
const hostname = netConfig.protocol + "//" + netConfig.address + ":" + netConfig.port;
export default function ConnectionStatus({success}: ConnectionStatus) {
    return (
        <View style={{...styles.container, backgroundColor: success ? "green" : "#d8c36b"}}>
            <Text style={{
                fontSize: 12.5,
                fontWeight: 'bold',
                textAlign: 'center',
                color: "white"
            }}>{success ? "Connected" : "Connecting to: "+hostname}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
    }
})