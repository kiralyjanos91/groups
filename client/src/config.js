import axios from "axios"

export const axiosConf = axios.create({
    baseURL: "https://groupyx11.fly.dev/",
    withCredentials: true
})