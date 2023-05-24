import React , { useEffect } from "react"
import { useSelector } from "react-redux"
import { createContext } from "react"
import { io } from "socket.io-client"

const socket = io("http://localhost:8080" , {autoConnect: false})
export const SocketContext = createContext()

export function ContextProvier ({ children }) {
    const user = useSelector((state) => state.userData.data)


    useEffect(() => {
        if (user?.username) {
            socket.connect()
            socket.emit("userLogin" , user?.username)
        }
        return () => {
            socket.disconnect()
        }
    }, [ user?.username ])

    return (
        <SocketContext.Provider 
            value = { socket }
        >
            { children }
        </SocketContext.Provider>
    )
}
