import React, {useContext, useEffect, useState} from "react";
import {
    Animated,
    Text,
    TouchableWithoutFeedback,
    View,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import {DishType, MenuType, FullOrderType, OneOrderType} from "../Config/TypeConfig";
import Icon from "react-native-vector-icons/MaterialIcons";
import {AppContext} from "../Utils/AppContext";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {RouteProp} from "@react-navigation/native";

type DishSelectionNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DishSelection'>;
type DishSelectionRouteProp = RouteProp<RootStackParamList, 'DishSelection'>;


type DishInputType = {
    data: DishType,
    decrease: (item: DishType, key: number) => void | undefined,
    increase: (item: DishType, key: number) => void | undefined,
    onPress: (item: DishType) => void | undefined,
    quantity: number | undefined,
    opened: boolean,
    index: number,
}


type MenuInputType = {
    menuData: MenuType,
    navigation: DishSelectionNavigationProp,
    route: DishSelectionRouteProp
}


const Dish = (item: DishInputType): React.JSX.Element => {
    return (
        <TouchableOpacity style={{...styles.DishContainer, borderWidth: item.opened ? 1 : 0, padding: item.opened ? 5 : 0}}
                          key={item.index}
                          onPress={()=>{item.onPress(item.data)}}
        >
            <View style={styles.DishTitleContainer}>
                <Text style={styles.DishTitle}>#{item.data.id} {item.data.name}</Text>
                <Text style={{...styles.DishTitle, textAlign:'right'}}>$ {item.data.price}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default function DishList({menuData, navigation, route}: MenuInputType): React.JSX.Element {
    //states used for the function
    const [opened, setOpened] = useState(false)
    const [animation] = useState(new Animated.Value(0))
    const context = useContext(AppContext)
    const [currentOrder, setCurrentOrder] = useState<FullOrderType>(context.selectedItems);

    useEffect(() => {
        // context.updateSelectedItems(currentOrder)
    }, [currentOrder]);

    const toggleAccordion = () => {
        if (!opened) {
            Animated.timing(animation, {
                toValue: 1,
                duration: 100,
                useNativeDriver: false,
            }).start()
        } else {
            Animated.timing(animation, {
                toValue: 0,
                duration: 100,
                useNativeDriver: false,
            }).start()
        }
        setOpened(!opened)
    }
    const heightAnimationInterpolation = animation.interpolate(
        {
            inputRange: [0, 1],
            outputRange: [0, 75 * menuData.dishes.length]
        }
    )


    // function or adding the dish to order
    const addDish = (item: DishType, key: number) => {
        const dishName = item.name
        const defaultTags: [string, number][] = menuData.defaultTags
        setCurrentOrder((prevState: FullOrderType) => {
            const toAdd = prevState.orders.findIndex((order) => {
                return order.order_name == item.name
            })
            if (toAdd == -1) {
                prevState.orders = [
                    ...prevState.orders,
                    {
                        dish_id: item.id,
                        order_name: dishName,
                        note: '',
                        tags: defaultTags,
                        quantity: 1,
                        price:item.price
                    }
                ]
            } else {
                prevState.orders[toAdd].quantity += 1
            }
            return prevState
        })
    }

    //function for delete order from menu
    const deleteDish = (item: DishType, key: number) => {
        setCurrentOrder((prevState: FullOrderType) => {
            const toDelete = prevState.orders.findIndex((order) => {
                return order.order_name == item.name
            })
            if (toDelete != -1) {
                prevState.orders[toDelete].quantity -= 1
                if (prevState.orders[toDelete].quantity == 0) {
                    prevState.orders.splice(toDelete, 1)
                }
            }
            return prevState
        })
    }

    const routeToTags = (item: DishType) => {
        const data: OneOrderType = {
            dish_id: item.id,
            order_name: item.name,
            note:"",
            tags:menuData.defaultTags,
            quantity: 1,
            price: item.price
        }
        navigation.navigate("TagsSelection", {data, section:menuData.tagSection, price: item.price})
    }
    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={toggleAccordion}>
                <View style={styles.header}>
                    <Text style={styles.header_text}>{menuData.sectionName}</Text>
                    <Icon name={opened ? "expand-less" : "expand-more"} size={30} color=""/>
                </View>
            </TouchableWithoutFeedback>
            <Animated.View style={{height: heightAnimationInterpolation}}>
                {
                    menuData.dishes.map((item: DishType, index: number) => {
                        const find = currentOrder.orders.find((item) => item.order_name == menuData.dishes[index].name)
                        return <Dish key={item.name + index}
                                     data={item}
                                     decrease={deleteDish}
                                     increase={addDish}
                                     quantity={find?find.quantity:0}
                                     opened={opened}
                                     index={index}
                                     onPress={routeToTags}
                        />
                    })
                }
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
        padding: 15,
        backgroundColor: "white",
        borderRadius: 6,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    header_text: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: "auto",
        marginBottom: "auto",
    },
    DishContainer: {
        flex: 1,
        margin: 5,
        borderWidth: 1,
        padding: 5,
        borderRadius: 10,
        backgroundColor: "#f1f1f1",
        borderStyle: "dashed",
        maxHeight: 65,
    },
    DishTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    DishTitleContainer: {
        flexDirection: "column",
        justifyContent: "space-between",
        marginBottom: 5,
    },
    DishButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    AdjustButton: {
        flexDirection: "row",
        backgroundColor: "#f4d454",
        justifyContent: "center",
        width: 80,
        borderRadius: 15,
    },
    NumberContainer: {
        justifyContent: "center",
        padding: "auto",
        width: 80,
        flexDirection: 'row',
        borderRadius: 3,
        backgroundColor: "white"
    }
})