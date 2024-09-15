import React, {Component} from "react";
import {SafeAreaView, View, StyleSheet, TouchableOpacity, Text, Alert} from "react-native";
import {OrderCard} from "../Components/OrderCard";
import DataStore from "../Utils/DataStore";
import {SwipeListView} from 'react-native-swipe-list-view';

import ConnectionStatus from "../Components/ConnectionStatus";
import {AppContext, AppContextType} from "../Utils/AppContext";

interface HomeScreenProps {
}

interface HomeScreenState {
}

class HomeScreen extends Component<HomeScreenProps, HomeScreenState> {
    private dataStore = DataStore.getInstance()
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
        let {isConnect} = this.context
        return (
            <SafeAreaView style={stylesheet.container}>
                <ConnectionStatus success={isConnect}/>
                <SwipeListView
                    data={this.context.order}
                    renderItem={({item}) => (
                        <OrderCard item={item}/>
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
            </SafeAreaView>
        )
    }
}

const stylesheet = StyleSheet.create({
    container: {
        height: "100%",
        width: "auto",
    }
})

export default HomeScreen