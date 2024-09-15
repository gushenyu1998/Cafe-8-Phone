import React from "react";
import {View, Text, Platform, StyleSheet, Image, Dimensions} from "react-native";
import {FullOrderType} from "../Config/TypeConfig";
import {orderPalette, tagsPalette, determineColor} from "../Config/Palette";

type OrderCardType = {
    item: FullOrderType
}

function TagItem(tag: string, key: number): React.JSX.Element {
    return (
        <View style={{...styles.tag, backgroundColor: tagsPalette[determineColor(tag, 5) % tagsPalette.length]}}
              key={key}>
            <Text style={{fontSize: 30, fontWeight: 'bold', textTransform: 'capitalize'}}>{tag}</Text>
        </View>
    )
}

export function OrderCard({item}: OrderCardType) {
    return (
        <View style={styles.card}>
            {/*tabel as the title of the order type/*/}
            <View>
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
                                </View>
                                <View style={styles.tagsContainer}>
                                    {
                                        //map to each tag in the order
                                        order.tags.map((tag, key) => {
                                            return TagItem(tag[0], key)
                                        })
                                    }
                                </View>
                                {
                                    order.note &&
                                    <View style={styles.noteContainer}>
                                        <Text style={{fontSize: 30,}}>Note: {order.note}</Text>
                                    </View>
                                }
                            </View>
                        )
                    })
                }
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    card: {
        backgroundColor: "rgba(237,237,237,0)"
    },
    container: {
        padding: 10,
        paddingBottom: 0,
        margin: 10,
        borderWidth: 2,
        borderColor: "gray",
        borderRadius: 10,
        height: Dimensions.get("window").height - 120,
        flexDirection: "row-reverse"
    },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    tableStyle: {
        fontFamily: "monospace",
        fontWeight: "bold",
        fontSize: 30
    },
    orderStyle: {
        fontSize: 40,
        fontFamily: "sans-serif",
        fontWeight: "bold",
        textTransform:"capitalize"
    },
    orderContainer: {
        padding: 10,
        borderStyle: "dashed",
        borderWidth: 1,
        borderColor: "#afafaf",
        marginBottom: 10,
        borderRadius: 10,
        width: Dimensions.get("window").width / 3 - 20,
    },
    tagsContainer: {
        marginTop: 2,
        flexWrap: 'wrap'
    },
    tag: {
        justifyContent: "center",
        borderRadius: 15,
        marginRight: 5,
        marginBottom: 5,
        padding: 5,
        borderWidth: 2,
    },
    noteContainer: {
        height: 'auto',
        marginTop: 2,
        backgroundColor: "white",
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 2,
        padding: 10
    }
})
