import React, {createContext, ReactNode, useState} from 'react';
import {FullOrderType} from "../Config/OrderType";


type AppContextType = {
    selectedItems: FullOrderType;
    clearSelectedItems: () => void;
    updateSelectedItems: (items: FullOrderType) => void;
}

type AppContextProviderProps = {
    children: ReactNode;
}
export const AppContext = createContext<AppContextType[]>([]);
export const AppContextProvider: React.FC<AppContextProviderProps> = ({children}) => {
    const [selectedItems, setSelectedItems] = useState<FullOrderType>({
        order_id: 0,
        table: "1",
        price: 0,
        orders: []
    });
    //reset the order back to default value
    const clearSelectedItems = () => setSelectedItems({
        order_id: 0,
        table: "1",
        price: 0,
        orders: []
    });
    const updateSelectedItems = (items: FullOrderType) => setSelectedItems(items);

    return (
        <AppContext.Provider value={{selectedItems, clearSelectedItems, updateSelectedItems}}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;