import axios from "axios"

export const axiosConf = axios.create({
    // baseURL: "https://groupyx001.fly.dev/",
    baseURL: "http://localhost:8080/",
    withCredentials: true
})