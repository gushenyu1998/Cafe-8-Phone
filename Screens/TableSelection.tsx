import React, {useContext, useEffect, useState} from "react";
import {SafeAreaView, Text, TouchableOpacity, View, StyleSheet, Alert} from "react-native";
import {Picker} from '@react-native-picker/picker';
import {AppContext} from "../Utils/AppContext";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {FullOrderType} from "../Config/TypeConfig";
import {FetchAPI} from "../Utils/APIFetching";
import ConnectionStatus from "../Components/ConnectionStatus";
import DataStore from "../Utils/DataStore";

type MultiSelectScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TableSelection'>;

interface TableSelectionProps {
    navigation: MultiSelectScreenNavigationProp;
}

export default function TableSelection({navigation}: TableSelectionProps): React.JSX.Element {
    const dataStore = DataStore.getInstance()
    const context = useContext(AppContext)
    const [selectedValue, setSelectedValue] = useState<string>("N/A");
    const [tableList, setTableList] = useState<string[]>([]);

    useEffect(() => {
        dataStore.getTables().then(tableList => setTableList(tableList))
    }, []);

    const createNewOrder = async () => {
        if (selectedValue == "N/A") {
            Alert.alert("Please select a table or Take Out")
        } else {
            //order_id can be required by the backend
            const order_id = await FetchAPI("http://10.0.2.2:5000/getOrderNumber")
            const newOrder: FullOrderType = {
                order_id: order_id[0],
                table: selectedValue,
                price: 0,
                orders: []
            }
            context.updateSelectedItems(newOrder)
            navigation.navigate('DishSelection')
        }
    }
    return (
        <>
            <ConnectionStatus success={context.isConnect}/>
            <SafeAreaView style={styles.container}>
                <Text style={styles.label}>Select Table</Text>
                <View style={{borderWidth: 1, width: "101%"}}>
                    <Picker
                        selectedValue={selectedValue}
                        style={styles.picker}
                        onValueChange={(itemValue) => setSelectedValue(itemValue)}

                    >
                        {
                            tableList.map((item, index) => {
                                return (
                                    <Picker.Item
                                        label={item}
                                        key={index}
                                        value={item}
                                        style={{
                                            backgroundColor: index % 2 == 0 ? "#f6f6f6" : "white",
                                            fontSize: 30,
                                        }}
                                    />
                                )
                            })
                        }
                    </Picker>
                </View>
                <TouchableOpacity style={styles.submission} onPress={() => {
                    if (context.isConnect) {
                        createNewOrder().then(r => {
                        })
                    } else {
                        Alert.alert(
                            "Error: App is not connect to the server\n",
                            "Please wait until connected or contact developer"
                        )
                    }
                }}>
                    <Text style={styles.selected}>Selected: {selectedValue}</Text>
                    <Text style={styles.selected}>Go Next Step</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    label: {
        fontSize: 30,
        fontWeight: "bold"
    },
    picker: {
        height: 100,
        width: "100%",
        fontSize: 25,
    },
    selected: {
        fontSize: 25,
        color: "white"
    },
    submission: {
        backgroundColor: '#595959',
        fontSize: 15,
        width: "80%",
        alignItems: 'center',
        borderRadius: 10,
        padding: 2
    }
});
