import React, {useContext, useEffect, useState} from "react";
import {
    Animated,
    SafeAreaView,
    Text,
    TouchableWithoutFeedback,
    View,
    StyleSheet,
    ScrollView,
    Alert, FlatList,
} from "react-native";
import AppContext from "../Utils/AppContext";
import DishList from "../Components/DishList";
import {FullOrderType, MenuType, OneOrderType} from "../Config/OrderType";
import ConfirmAndCancelButton from "../Components/Buttons/ConfirmAndCancelButton";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {RouteProp} from "@react-navigation/native";
import OrderCheckModal from "../Components/OrderCheckModal";
import dataStore from "../Utils/DataStore";

const menuData: MenuType[] = require('../Config/Menu.json')
type DishSelectionNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DishSelection'>;
type DishSelectionRouteProp = RouteProp<RootStackParamList, 'DishSelection'>;

type DishSelectionType = {
    navigation: DishSelectionNavigationProp,
    route: DishSelectionRouteProp
}


export default function DishSelection({navigation, route}: DishSelectionType):React.JSX.Element {
    const context = useContext(AppContext)
    const [modalVisible, setModalVisible] = useState(false);

    const closeModal = () => {
        setModalVisible(false)
    }

    // Add order to AyncDataStorage )
    // Todo: Change it to send order to server and update
    const addOrder = async () => {
        const dataStoreInstance = dataStore.getInstance()
        const newOrder = JSON.parse(JSON.stringify(context.selectedItems)) //create a new order with new space, deep copy
        await dataStoreInstance.addItem(newOrder)
    };

    // Delete one order in the Context
    const deleteOrder = (item: OneOrderType) => {
        context.selectedItems.price -= item.price
        const newOrders = context.selectedItems.orders.filter((order: OneOrderType) => order != item)
        context.selectedItems.orders = newOrders
        context.updateSelectedItems(context.selectedItems)
    }

    return (
        <SafeAreaView style={{height: "100%", paddingTop: 40}}>
            <OrderCheckModal
                data={context.selectedItems}
                closeModal={closeModal}
                modalVisible={modalVisible}
                deleteOrder={deleteOrder}
                submitOrder={() => {
                    if (context.selectedItems.orders.length == 0) {
                        Alert.alert("Please make any order")
                    } else {
                        addOrder().then(r => navigation.navigate("Home"))
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
                        setModalVisible(true)
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