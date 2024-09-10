import React from "react";
import {View, Text, Platform, StyleSheet, Image} from "react-native";
import {FullOrderType} from "../Config/OrderType";
import {orderPalette, tagsPalette, determineColor} from "../Config/Palette";

type OrderCardType = {
    item: FullOrderType
}

function TagItem(tag: string, key: number): React.JSX.Element {
    return (
        <View style={{...styles.tag, backgroundColor: tagsPalette[determineColor(tag, 5) % tagsPalette.length]}} key={key}>
            <Text style={{fontSize: 12.5, fontWeight: 'bold'}}>{tag}</Text>
        </View>
    )
}

export function OrderCard({item}: OrderCardType) {
    return (
        <View style={styles.card}>
            {/*tabel as the title of the order type/*/}
            <View style={styles.tableContainer}>
                <Text style={styles.tableStyle}>Table: {item.table}</Text>
            </View>

            {/*Container for each table's order/*/}
            <View style={styles.container}>
                {
                    // map to rander each order in one table
                    item.orders.map((order, index) => {
                        return (
                            <View key={index}
                                  style={{
                                      ...styles.orderContainer,
                                      backgroundColor: orderPalette[index % orderPalette.length]
                                  }}>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.orderStyle}>#{order.dish_id} {order.order_name}</Text>
                                    <View></View>
                                    <Text style={styles.orderStyle}>${order.price}</Text>
                                </View>
                                <View style={styles.tagsContainer}>
                                    {
                                        //map to each tag in the order
                                        order.tags.map((tag, key) => {
                                            return TagItem(tag[0], key)
                                        })
                                    }
                                </View>
                                <View style={styles.noteContainer}>
                                    <Text style={{fontSize: 15,}}>Note: {order.note}</Text>
                                </View>
                            </View>
                        )
                    })
                }
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    card:{
      backgroundColor: "#ededed"
    },
    container: {
        padding: 10,
        paddingBottom: 0,
        marginLeft: 10,
        marginRight: 10,
        borderWidth: 2,
        borderColor: "gray",
        borderRadius: 10,
    },
    titleContainer:{
        flexDirection: "row",
        justifyContent: "space-between",
    },
    tableStyle: {
        fontFamily: "monospace",
        fontWeight: "bold",
        fontSize: 20
    },
    tableContainer: {
        paddingLeft: 10,
        paddingTop: 5,
        paddingBottom: 5,
        flexDirection: "row"
    },
    orderStyle: {
        fontSize: 20,
        fontFamily: "sans-serif",
        fontWeight: "bold"
    },
    orderContainer: {
        padding: 10,
        borderStyle: "dashed",
        borderWidth: 1,
        borderColor: "#afafaf",
        marginBottom: 10,
        borderRadius: 10,
    },
    tagsContainer: {
        marginTop: 2,
        flexDirection: "row",
        flexWrap: 'wrap'
    },
    tag: {
        justifyContent: "center",
        borderRadius: 15,
        marginRight: 5,
        marginBottom: 5,
        padding: 5,
        borderWidth:0.5,
    },
    noteContainer: {
        minHeight: 30,
        marginTop: 2,
        backgroundColor: "white",
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 2,
        padding: 10
    }
})
