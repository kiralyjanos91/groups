import axios from "axios"

export const axiosConf = axios.create({
    // baseURL: "https://groupyx.fly.dev/"
    withCredentials: true,
    baseURL: "http://localhost:8080/"
})