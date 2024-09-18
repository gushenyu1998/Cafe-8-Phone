import React, {createContext, ReactNode, useEffect, useState} from 'react';
import {FullOrderType} from "../Config/TypeConfig";
import io, {Socket} from "socket.io-client";
import DataStore from "./DataStore";
import {Alert} from "react-native";
import {FetchAPI} from "./APIFetching";
import {Audio} from "expo-av";

const networkConfig = require('../Config/Network.json')

export interface AppContextType {
    selectedItems: FullOrderType;
    clearSelectedItems: () => void;
    updateSelectedItems: (items: FullOrderType) => void;
    isConnect: boolean;
    order: FullOrderType[]
    addOrder: (item: FullOrderType) => Promise<boolean>;
    deleteOrder: (item: { order_id: number }) => Promise<boolean>
}

type AppContextProviderProps = {
    children: ReactNode;
}
export const AppContext = createContext<AppContextType>({
    selectedItems: {
        order_id: 0,
        table: "0",
        price: 0,
        orders: []
    },
    clearSelectedItems: () => {
    },
    updateSelectedItems: () => {
    },
    isConnect: false,
    order: [],
    addOrder: async () => false,
    deleteOrder: async () => false
});

// Create Socket Context Here
export const AppContextProvider: React.FC<AppContextProviderProps> = ({children}) => {
    const [selectedItems, setSelectedItems] = useState<FullOrderType>({
        order_id: 0,
        table: "1",
        price: 0,
        orders: []
    });
    const [socket, setSocket] = useState<Socket | null>(null)
    const [isConnect, setIsConnect] = useState<boolean>(false)
    const [order, setOrder] = useState<FullOrderType[]>([])
    const [sound, setSound] = useState<Audio.Sound>(require("../assets/notification.mp3"))
    const hostAddress = networkConfig.protocol + "//" + networkConfig.address + ":" + networkConfig.port
    useEffect(() => {
        const connectSocket = () => {
            const newSocket = io(hostAddress + '/cafe-8-backend'); // Replace with your API endpoint
            newSocket.on('connect', () => {
                // console.log('Connected to Socket.IO server');
                setIsConnect(true);
            });

            newSocket.on('disconnect', () => {
                // console.log('Disconnected from Socket.IO server');
                setIsConnect(false);
            });

            newSocket.on('message', (message: string) => {
                if (message.includes('Success: Update the Order')) {
                    FetchAPI(hostAddress + "/getOrder").then(
                        async newOrder => {
                            const {sound} = await Audio.Sound.createAsync(require('../assets/notification.mp3'));
                            setSound(sound);
                            const fullOrder: FullOrderType[] = newOrder;
                            const filteredOrders:FullOrderType[] = fullOrder.map(fullOrder => ({
                                ...fullOrder,
                                orders: fullOrder.orders.filter(oneOrder => oneOrder.order_name !== "Drink")
                            })).filter(fullOrder => fullOrder.orders.length > 0);
                            await sound.playAsync();
                            setOrder(filteredOrders);
                        }
                    )
                }
            });

            setSocket(newSocket);
            FetchAPI(hostAddress + "/getOrder").then(
                order => setOrder(order)
            )
        };
        connectSocket();
        return () => {
            socket?.disconnect();
            sound ? sound.unloadAsync() : undefined
        };
    }, []);

    const addOrder = async (newOrder: FullOrderType) => {
        let flag = false
        if (isConnect && socket) {
            socket.emit('addOrder', newOrder, (reply: string) => {
                if (!reply.includes("Success")) {
                    Alert.alert("Failed to send the order");
                } else {
                    flag = true
                }
            });
        }
        return flag
    }

    const deleteOrder = async (orderToRemove: { order_id: number }) => {
        let flag = false
        if (isConnect && socket) {
            socket.emit('removeOrder', orderToRemove, (reply: string) => {
                if (!reply.includes("Success")) {
                    Alert.alert("Failed to delete the order");
                } else {
                    flag = true
                }
            });
        }
        return flag
    }

    //reset the order back to default value
    const clearSelectedItems = () => setSelectedItems({
        order_id: 0,
        table: "1",
        price: 0,
        orders: []
    });

    //update the order about to make
    const updateSelectedItems = (items: FullOrderType) => setSelectedItems(items);


    return (
        <AppContext.Provider value={{
            selectedItems,
            clearSelectedItems,
            updateSelectedItems,
            isConnect,
            order,
            addOrder,
            deleteOrder
        }}>
            {children}
        </AppContext.Provider>
    );
};
