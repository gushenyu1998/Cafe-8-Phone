import React, {Component, useEffect, useState} from "react";
import {FullOrderType} from "../Config/OrderType";
import {FlatList, SafeAreaView, ScrollView, View, StyleSheet, TouchableOpacity, Text} from "react-native";
import {OrderCard} from "../Components/OrderCard";
import DataStore from "../Utils/DataStore";
import AddButton from "../Components/Buttons/AddButton";
import {SwipeListView} from 'react-native-swipe-list-view';


//React Navigation
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RouteProp} from "@react-navigation/native";

//import Navigation Type
import {RootStackParamList} from "../App";
import {FetchAPI} from "../Utils/APIFetching";
import ConnectionStatus from "../Components/ConnectionStatus";

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
    navigation: HomeScreenNavigationProp;
    route: HomeScreenRouteProp;
}

interface HomeScreenState {
    data: FullOrderType[],
    success: boolean
}

class HomeScreen extends Component<HomeScreenProps, HomeScreenState> {
    private dataStore = DataStore.getInstance()

    constructor(props: HomeScreenProps) {
        super(props);
        this.state = {
            data: [],
            success: false
        }
    }

    loadData = async () => {
        const storedData = await this.dataStore.getData();
        this.setState({data: storedData});
    };

    componentDidMount() {
        this.props.navigation.addListener('focus', this.loadData);
    }

    componentWillUnmount() {
        this.props.navigation.removeListener('focus', this.loadData);
    }

    handleSwipeValueChange = (swipeData: { key: number, value: number }) => {
        const {key, value} = swipeData;
        if (value < -150) {
            this.deleteOrder(key);
        }
    };


    deleteOrder = async (order_id: number) => {
        await this.dataStore.deleteItem(order_id);
        this.setState({data: await this.dataStore.getData()});
    };

    // cleanOrder = async (order_id: number) => {
    //     await this.dataStore.deleteItem(order_id);
    //     this.setState({data: await this.dataStore.getData()});
    // };

    render() {
        const {data} = this.state
        const {navigation} = this.props;
        // console.log(FetchAPI("/getMenu"))
        return (
            <SafeAreaView style={stylesheet.container}>
                {/*<FlatList data={data} renderItem={({item}) => {*/}
                {/*    return <OrderCard item={item}/>*/}
                {/*}}/>*/}
                <ConnectionStatus success={this.state.success}/>
                <SwipeListView
                    data={this.state.data}
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
                                style={{width: 75, alignItems: 'center', justifyContent: 'center', height:"100%"}}
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
                    // FetchAPI('/getMenu')
                    navigation.navigate('TableSelection')
                    // this.setState({success: !this.state.success});
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