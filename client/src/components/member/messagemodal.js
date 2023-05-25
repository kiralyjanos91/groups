import React , { useState , useRef , useEffect , useContext } from "react"
import { useSelector } from "react-redux"
import { axiosConf } from "../../config"
import { Container } from "react-bootstrap"
import Modal from "react-bootstrap/Modal"
import CloseButton from "react-bootstrap/CloseButton"
import Chat from "../chat/chat"
import ChatMessageEl from "../chat/chat_message_el"
import { SocketContext } from "../../context/socketiocontext"
import "./messagemodal.css"

export default function MessageModal( { handleClose , show , partnerName , partnerPhoto  }){

    const user = useSelector((state) => state.userData.data)
    const [emojiShow , setEmojiShow] = useState(false)
    const [messages , setMessages] = useState(null)
    const [ messagesLoaded , setMessagesLoaded ] = useState(false)
    const chatMessageRef = useRef()
    const chatWindowRef = useRef()
    const socket = useContext(SocketContext)

    useEffect(() => {
        if (user.username)
            {
                axiosConf.post("/findprivatemessage" , {
                    username: user.username,
                    partner_name: partnerName
                })
                .then(res => {
                    if (res.status === 202) {
                        const newMessages = {
                            partner: partnerName,
                            partner_photo: partnerPhoto,
                            messages: []
                        }
                        setMessages(newMessages)
                        setMessagesLoaded(true) 
                    }
                    else {
                        setMessages(res.data)
                        setMessagesLoaded(true)
                    }
                }
                )
                .catch(err => {
                    console.log(err)
                    setMessagesLoaded(true)
                })
            }
    } , [user])

    useEffect(() => {
        if (show) {
            chatWindowRef.current.scrollTo({
                top: chatWindowRef.current.scrollHeight
            })
            const userAndPartner = {
                userName: user.username, 
                partnerName: partnerName 
            }
            axiosConf.post("/messageseen" , userAndPartner)
        }
    } , [show , messages])
    
    useEffect(() => {
        if (messagesLoaded) {
            socket.emit("viewMember" , partnerName)
            socket.on("memberMessage" , (message) => {
                const sent = message.sender_username === user.username
                const formattedMessage = {
                    date: message.date,
                    message: message.current_message,
                    sent
                }

                const messagesCopy = {...messages}
                messagesCopy.messages.push(formattedMessage)
                setMessages(() => messagesCopy)
            })       
        }
        return () => {
            socket.emit("notViewMembers")
        }
    }, [messagesLoaded])

    const sendMessage = () => {
        const messageContent = {
            sender_username: user?.username,
            sender_small_photo: user?.small_photo,
            receiver_username: partnerName,
            receiver_small_photo: partnerPhoto,
            current_message: chatMessageRef.current.value,
            date: new Date()
        }

        socket.emit("sendMessage" , messageContent)
        
        axiosConf.post("/sendprivatemessage" , messageContent)
            .then(
                chatMessageRef.current.value = "",
                setEmojiShow(false),
                chatWindowRef.current.scrollTo({
                    top: chatWindowRef.current.scrollHeight,
                    behavior: "smooth"
                })
            )    
        }

    const emojiShowChange = () => {
        setEmojiShow(prev => !prev)
    }

    const dateFormat = new Intl.DateTimeFormat("en-US",{
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
    })

    const messagesList = messages?.messages?.map((message , index) => {
        const date = message.date
        let showMessageDate = ""

        if (date) {
            const messageDate = new Date(date)
            showMessageDate = dateFormat.format(messageDate)
        }

        const ownMessageClass = message.sent ? "own-message" : ""
        const chatPhoto = messages?.partner_photo 

        return (
            <ChatMessageEl 
                index = { index }
                ownMessageClass = { ownMessageClass }
                chatPhoto = { message.sent ? user?.small_photo : chatPhoto }
                showMessageDate = { showMessageDate }
                message = { message }
                username = { message.sent ? user?.username : partnerName }
                modalClass = "modalClass"
            />
        )
    })

    return (
        <>
            <Modal show = { show } onHide = { handleClose } centered className = "message-modal">
                <Container className = "message-modal-container">
                    <Modal.Header>
                        <Modal.Title>Send Message</Modal.Title>
                        <CloseButton 
                            variant = "white" 
                            onClick = { () => handleClose() }
                        />
                    </Modal.Header>
                    <Modal.Body>
                        <Chat 
                            emojiShow = { emojiShow }
                            chatWindowRef = { chatWindowRef }
                            chatMessageRef = { chatMessageRef }
                            sendToChat = { sendMessage }
                            messages = { messagesList }
                            emojiShowChange = { emojiShowChange }
                            plusClass = "private-chat-window"
                        />
                    </Modal.Body>
                </Container>
            </Modal>
        </>
    )
}