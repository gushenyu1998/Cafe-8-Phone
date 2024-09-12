import React, {useContext, useEffect, useState} from "react";
import {Alert, FlatList, SafeAreaView, View,} from "react-native";
import {AppContext} from "../Utils/AppContext";
import DishList from "../Components/DishList";
import {MenuType, OneOrderType} from "../Config/TypeConfig";
import ConfirmAndCancelButton from "../Components/Buttons/ConfirmAndCancelButton";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {RouteProp} from "@react-navigation/native";
import OrderCheckModal from "../Components/OrderCheckModal";
import dataStore from "../Utils/DataStore";
import ConnectionStatus from "../Components/ConnectionStatus";
import DataStore from "../Utils/DataStore";


type DishSelectionNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DishSelection'>;
type DishSelectionRouteProp = RouteProp<RootStackParamList, 'DishSelection'>;

type DishSelectionType = {
    navigation: DishSelectionNavigationProp,
    route: DishSelectionRouteProp
}


export default function DishSelection({navigation, route}: DishSelectionType): React.JSX.Element {
    const context = useContext(AppContext)
    const [modalVisible, setModalVisible] = useState(false);
    const [menuData, setMenuData] = useState<MenuType[]>([]);
    const dataStore = DataStore.getInstance()

    useEffect(() => {
        dataStore.getMenu().then(menu => setMenuData(menu));
    }, []);

    const closeModal = () => {
        setModalVisible(false)
    }

    // Add order to Aync DataStorage
    // Change it to send order to server and update
    const addOrder = async () => {
        const newOrder = JSON.parse(JSON.stringify(context.selectedItems)) //create a new order with new space, deep copy
        return context.addOrder(newOrder)
    };

    // Delete one order in the Context
    const deleteOrder = (item: OneOrderType) => {
        context.selectedItems.price -= item.price
        context.selectedItems.orders = context.selectedItems.orders.filter((order: OneOrderType) => order != item)
        context.updateSelectedItems(context.selectedItems)
    }

    return (
        <SafeAreaView style={{height: "100%"}}>
            <ConnectionStatus success={context.isConnect}/>
            <OrderCheckModal
                data={context.selectedItems}
                closeModal={closeModal}
                modalVisible={modalVisible}
                deleteOrder={deleteOrder}
                submitOrder={() => {
                    if (context.selectedItems.orders.length == 0) {
                        Alert.alert("Please make any order")
                    } else {
                        addOrder().then(_ => navigation.navigate("Home"))
                    }
                }}
            />
            <FlatList data={menuData} renderItem={
                ({item, index}) => {
                    return <DishList
                        key={"Section" + index}
                        menuData={item}
                        navigation={navigation}
                        route={route}
                    />
                }
            }/>
            <View style={{marginBottom: 30, width: "100%", marginTop: 10}}>
                <ConfirmAndCancelButton
                    size={{width: 170, height: 50}}
                    contentCancel="Clean Order"
                    contentConfirm="Check Menu"
                    onConfirm={() => {
                        if (context.isConnect) {
                            setModalVisible(true)
                        } else {
                            Alert.alert(
                                "Error: App is not connect to the server\n",
                                "Please wait until connected or contact developer"
                            )
                        }
                    }}
                    onCancel={() => {
                        context.selectedItems.price = 0
                        context.selectedItems.orders = []
                        context.updateSelectedItems(context.selectedItems)
                    }}
                />
            </View>
        </SafeAreaView>
    )
}