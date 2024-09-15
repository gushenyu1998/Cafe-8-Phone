import React, {Component} from "react";
import {
    SafeAreaView,
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    FlatList,
    PanResponder,
    Animated,
    Dimensions
} from "react-native";
import {OrderCard} from "../Components/OrderCard";
import DataStore from "../Utils/DataStore";
import {SwipeListView} from 'react-native-swipe-list-view';

import ConnectionStatus from "../Components/ConnectionStatus";
import {AppContext, AppContextType} from "../Utils/AppContext";
import {FullOrderType} from "../Config/TypeConfig";

interface HomeScreenProps {
}

interface HomeScreenState {
}

type ItemProps = {
    item: React.JSX.Element;
    index: number;
    onDelete: (index: number) => void;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

class HomeScreen extends Component<HomeScreenProps, HomeScreenState> {
    static contextType = AppContext

    // @ts-ignore
    context!: AppContextType

    constructor(props: HomeScreenProps) {
        super(props);
    }

    deleteOrder = async (order_id: number) => {
        console.log(order_id)
        // await this.context.deleteOrder({order_id: order_id})
    };

    renderItem = ({item, index}: { item: FullOrderType; index: number }) => (
        <SwipeItem
            item={<OrderCard item={item}/>}
            index={item.order_id}
            onDelete={this.deleteOrder}
        />
    );

    render() {
        let {isConnect} = this.context
        return (
            <SafeAreaView style={stylesheet.container}>
                <ConnectionStatus success={isConnect}/>
                <FlatList
                    data={this.context.order}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    inverted // Right-to-left direction
                />
            </SafeAreaView>
        )
    }
}

class SwipeItem extends Component<ItemProps> {
    translateY: Animated.Value;
    panResponder: any;

    constructor(props: ItemProps) {
        super(props);

        this.translateY = new Animated.Value(0);

        this.panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
            onPanResponderMove: (evt, gestureState) => {
                // Move item only in Y direction (upwards swipe)
                if (gestureState.dy < 0) {
                    Animated.event([null, {dy: this.translateY}], {useNativeDriver: false})(evt, gestureState);
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                // If the swipe is upwards enough, delete the item, Add some animated effect
                if (-gestureState.dy > SCREEN_HEIGHT * 0.6) {
                    Animated.timing(this.translateY, {
                        toValue: -SCREEN_HEIGHT,
                        duration: 200,
                        useNativeDriver: false,
                    }).start(() => {
                        Animated.timing(this.translateY, {
                            toValue: 0,
                            duration: 0,
                            useNativeDriver: false,
                        }).start(() => {
                            this.props.onDelete(this.props.index); // Call delete callback after animation
                        })
                    });
                } else {
                    // Return the item to its original position if swipe is insufficient
                    Animated.spring(this.translateY, {
                        toValue: 0,
                        useNativeDriver: false,
                    }).start();
                }
            },
        });
    }

    render() {
        const {item} = this.props;

        return (
            <Animated.View
                style={[{transform: [{translateY: this.translateY}]}]}
                {...this.panResponder.panHandlers}
            >
                {item}
            </Animated.View>
        );
    }
}

const stylesheet = StyleSheet.create({
    container: {
        backgroundColor:"#ececec"
    }
})

export default HomeScreen