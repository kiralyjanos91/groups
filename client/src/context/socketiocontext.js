import { createContext } from "react"
import { io } from "socket.io-client"


const socket = io("http://localhost:5000", {
    autoConnect: false
})

export { socket }
export const socketContext = createContext()
