import React , { useEffect } from "react"
import { useSelector } from "react-redux"
import { createContext } from "react"
import { io } from "socket.io-client"

export const SocketContext = createContext()

export function ContextProvier ({ children }) {
    const user = useSelector((state) => state.userData.data)

    const socket = io("http://localhost:5000", {
        autoConnect: false,
    })

    useEffect(() => {
        if (user?.username) {
            socket.connect()
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
