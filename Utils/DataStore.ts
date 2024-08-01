import AsyncStorage from "@react-native-async-storage/async-storage";
import {FullOrderType} from "../Config/OrderType";

class DataStore {
    private static instance: DataStore
    private dataKey = "data_list"

    private constructor() {}

    public static getInstance(): DataStore {
        if (!DataStore.instance) {
            DataStore.instance = new DataStore()
        }
        return DataStore.instance
    }

    async getData(): Promise<FullOrderType[]> {
        try {
            const data = await AsyncStorage.getItem(this.dataKey)
            return data ? JSON.parse(data) : []
        } catch (error) {
            console.log("Fail in get data")
            return []
        }
    }

    async addItem(item: FullOrderType): Promise<void> {
        const data = await this.getData();
        data.push(item);
        await AsyncStorage.setItem(this.dataKey, JSON.stringify(data));
    }

    async deleteItem(order_id: number): Promise<void> {
        const data = await this.getData()
        const removeIndex = data.findIndex(item => item.order_id === order_id)
        data.splice(removeIndex, 1);
        await AsyncStorage.setItem(this.dataKey, JSON.stringify(data));
    }

    async cleanCache():Promise<void> {
        await AsyncStorage.removeItem(this.dataKey)
    }
}

export default DataStore