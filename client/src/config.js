import axios from "axios"

export const axiosConf = axios.create({
    // baseURL: "https://groupyxapp1.fly.dev/",
    baseURL: "http://localhost:8080/",
    withCredentials: true
})