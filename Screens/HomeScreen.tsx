import React, {Component} from "react";
import {SafeAreaView, View, StyleSheet, TouchableOpacity, Text, Alert} from "react-native";
import {OrderCard} from "../Components/OrderCard";
import DataStore from "../Utils/DataStore";
import AddButton from "../Components/Buttons/AddButton";
import {SwipeListView} from 'react-native-swipe-list-view';

//React Navigation
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RouteProp} from "@react-navigation/native";
import {Audio} from "expo-av";

//import Navigation Type
import {RootStackParamList} from "../App";
import ConnectionStatus from "../Components/ConnectionStatus";
import {AppContext, AppContextType} from "../Utils/AppContext";


type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

const audio = require("../assets/notification.mp3")

interface HomeScreenProps {
    navigation: HomeScreenNavigationProp;
    route: HomeScreenRouteProp;
}

interface HomeScreenState {}

class HomeScreen extends Component<HomeScreenProps, HomeScreenState> {
    static contextType = AppContext

    // @ts-ignore
    context!: AppContextType

    constructor(props: HomeScreenProps) {
        super(props);
    }

    handleSwipeValueChange = (swipeData: { key: number, value: number }) => {
        console.log(swipeData)
    };

    deleteOrder = async (order_id: number) => {
        await this.context.deleteOrder({order_id: order_id})
    };

    render() {
        const {navigation} = this.props;
        let {isConnect, taggedOrder} = this.context
        return (
            <SafeAreaView style={stylesheet.container}>
                <ConnectionStatus success={isConnect}/>
                <SwipeListView
                    data={this.context.order}
                    renderItem={({item}) => (
                        <OrderCard item={item} taggedItem={taggedOrder}/>
                    )}
                    renderHiddenItem={({item}) => (
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255,33,33,0.8)',
                            height: '100%'
                        }}>
                            <TouchableOpacity
                                style={{width: 75, alignItems: 'center', justifyContent: 'center', height: "100%"}}
                                onPress={() => this.deleteOrder(item.order_id)}
                            >
                                <Text style={{color: 'white'}}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    leftOpenValue={0}
                    rightOpenValue={-75}
                    disableRightSwipe
                    keyExtractor={(item, index) => item.order_id.toString() + index.toString()}
                />
                <AddButton onPress={() => {
                    if (isConnect) {
                        navigation.navigate('TableSelection')
                    } else {
                        Alert.alert(
                            "Error: App is not connect to the server\n",
                            "Please wait until connected or contact developer"
                        )
                    }
                }}/>
            </SafeAreaView>
        )
    }
}

const stylesheet = StyleSheet.create({
    container: {
        height: "100%",
        width: "auto",
        paddingBottom: 10,
    }
})

export default HomeScreen