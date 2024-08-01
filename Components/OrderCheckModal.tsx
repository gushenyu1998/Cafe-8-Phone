import React, {useEffect, useState} from "react";
import {Modal, View, Text, TouchableWithoutFeedback, StyleSheet, Pressable,} from "react-native";
import {FullOrderType, OneOrderType} from "../Config/OrderType";
import ConfirmAndCancelButton from "./Buttons/ConfirmAndCancelButton";
import Icon from "react-native-vector-icons/MaterialIcons";


type OrderCheckModalType = {
    data: FullOrderType,
    deleteOrder: (item: OneOrderType) => void,
    closeModal: () => void,
    modalVisible: boolean,
    submitOrder: () => void
}

export default function ({
                             data,
                             deleteOrder,
                             closeModal,
                             modalVisible,
                             submitOrder
                         }: OrderCheckModalType): React.JSX.Element {
    const [modalData, setModalData] = useState(data)
    const [opened, setOpened] = useState(false) // trigger of rerender the component
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                closeModal()
            }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={{width: 300}}>
                        <Text style={styles.checklistTitle}>Table: {modalData.table} | Price: ${modalData.price}</Text>
                        {
                            modalData.orders.map((item, index) => {
                                return (
                                    <View key={"Checklist" + index} style={styles.orderContainer}>
                                        <View style={styles.oneOrderContainer}>
                                            <Text style={styles.oneOrderTitle}>#{item.dish_id} {item.order_name}</Text>
                                            <Text style={styles.oneOrderContent}>{item.tags.toString()}</Text>
                                        </View>
                                        <Pressable onPress={() => {
                                            deleteOrder(item)
                                            setOpened(!opened)
                                        }} style={styles.removeButton}>
                                            <Icon name={"remove"} size={25}/>
                                        </Pressable>
                                    </View>
                                )
                            })
                        }
                    </View>
                    <ConfirmAndCancelButton
                        size={{width: 150, height: 50}}
                        contentCancel={"Back"}
                        contentConfirm={"Submit Order"}
                        onConfirm={() => {
                            submitOrder()
                        }}
                        onCancel={() => {
                            closeModal()
                        }}/>
                </View>
            </View>
        </Modal>
    )
}
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "rgba(0,0,0,0.58)",
        width: "100%"
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        padding: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    checklistTitle: {fontSize: 20},
    orderContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: 'space-between',
        padding: 5,
        borderWidth: 0.5,
        marginBottom: 5,
        borderRadius: 5
    },

    oneOrderContainer: {
        maxWidth: "70%",
    },
    oneOrderTitle: {fontSize: 18},
    oneOrderContent: {textTransform: "capitalize"},
    removeButton: {
        justifyContent: "center",
        backgroundColor: "#595959",
        borderRadius: 5,
        width: 50,
        alignItems: "center"
    }

});
