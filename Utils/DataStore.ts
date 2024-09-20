import AsyncStorage from "@react-native-async-storage/async-storage";
import {MenuType, TagsType} from "../Config/TypeConfig";
import {Alert} from "react-native";
import {FetchAPI} from "./APIFetching";

const networkConfig = require('../Config/Network.json')

class DataStore {
    private static instance: DataStore
    private menuKey = "menu_key"
    private tableKey = "table_key"
    private tagsKey = "tags_key"
    private hostAddress = networkConfig.protocol + "//" + networkConfig.address + ":" + networkConfig.port

    private constructor() {
    }

    public static getInstance(): DataStore {
        if (!DataStore.instance) {
            DataStore.instance = new DataStore()
        }
        return DataStore.instance
    }


    async getMenu(): Promise<MenuType[]> {
        try {
            const data = await AsyncStorage.getItem(this.menuKey)
            return data ? JSON.parse(data) : []
        } catch (error) {
            console.log("Fail in get menu")
            return []
        }
    }

    async getTags(): Promise<TagsType> {
        try {
            const data = await AsyncStorage.getItem(this.tagsKey)
            return data ? JSON.parse(data) : {}
        } catch (error) {
            console.log("Fail in get tags")
            return {}
        }
    }

    async getTables(): Promise<string[]> {
        try {
            const data = await AsyncStorage.getItem(this.tableKey)
            return data ? JSON.parse(data) : []
        } catch (error) {
            console.log("Fail in get menu")
            return []
        }
    }

    async fetchMemu(): Promise<boolean> {
        try {
            const menu = await FetchAPI(this.hostAddress + "/getMenu")
            await AsyncStorage.setItem(this.menuKey, JSON.stringify(menu))
            return true
        } catch (error) {
            Alert.alert("Error", "Fail to fetch menu from server")
            return false
        }
    }

    async fetchTable(): Promise<boolean> {
        try {
            const table = await FetchAPI(this.hostAddress + "/getTables")
            await AsyncStorage.setItem(this.tableKey, JSON.stringify(table))
            return true
        } catch (error) {
            Alert.alert("Error", "Fail to fetch table list from server")
            return false
        }
    }

    async fetchTags(): Promise<boolean> {
        try {
            const tags = await FetchAPI(this.hostAddress + "/getTags")
            await AsyncStorage.setItem(this.tagsKey, JSON.stringify(tags))
            return true
        } catch (error) {
            Alert.alert("Error", "Fail to fetch tags list from server")
            return false
        }
    }

}

export default DataStore