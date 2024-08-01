/*
 API fetching need to be async
 use axios
 axio.post/get
 await

 For fetching the Socket IO api and Http API
 */
import axios, {AxiosRequestConfig} from "axios";
import React from "react";

const setting = require("../Config/Network.json")
const BASE_URL = setting['protocol'] + setting['address'] + ":" + setting['port']

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
})

export const FetchAPI = async (endpoint: string, config?: AxiosRequestConfig) => {
    try {
        const response = await api.get(endpoint, config);
        console.log(response.data)
        return response.data;
    } catch (error) {
        // Handle errors (log, rethrow, etc.)
        console.error('Error fetching data:', error);
        throw error;
    }
}
