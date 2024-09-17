/*
 API fetching need to be async
 use axios
 axio.post/get
 await

 For fetching the Socket IO api and Http API
 */
import axios, {AxiosRequestConfig} from "axios";

const networkConfig = require("../Config/Network.json")
const hostAddress = networkConfig.protocol + "//" + networkConfig.address + ":" + networkConfig.port

const api = axios.create({
    baseURL: hostAddress,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
})

export const FetchAPI = async (endpoint: string, config?: AxiosRequestConfig) => {
    try {
        const response = await api.get(endpoint, config);
        return response.data;
    } catch (error) {
        // Handle errors (log, rethrow, etc.)
        console.error('Error fetching data:', error);
        throw error;
    }
}
