import React , { useState , useRef , useEffect } from "react"
import { useSelector } from "react-redux"
import axios from "axios"
import { Container , Row , Col } from "react-bootstrap"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import CloseButton from "react-bootstrap/CloseButton"
import EmojiPicker from "emoji-picker-react"

export default function MessageModal( { handleClose , show , partnerName , partnerPhoto  }){

    const user = useSelector((state) => state.userData.data)
    const [emojiShow , setEmojiShow] = useState(false)
    const [messages , setMessages] = useState(null)
    const chatMessageRef = useRef()
    const chatWindowRef = useRef()

    useEffect(() => {
        if (user.username)
            {
                axios.post("/findprivatemessage" , {
                    username: user.username,
                    partner_name: partnerName
                })
                .then(res => 
                    setMessages(res.data)
                )
            }
    } , [user])

    useEffect(() => {
        if (show)
            chatWindowRef.current.scrollTo({
                top: chatWindowRef.current.scrollHeight
            })
    } , [show])

    console.log(messages)

    const sendMessage = () => {
        axios.post("/sendprivatemessage" , {
            sender_username: user?.username,
            sender_small_photo: user?.small_photo,
            receiver_username: partnerName,
            receiver_small_photo: partnerPhoto,
            current_message: chatMessageRef.current.value,
            date: new Date()
        })
            .then(
                chatMessageRef.current.value = "",
                setEmojiShow(false),
                chatWindowRef.current.scrollTo({
                    top: chatWindowRef.current.scrollHeight,
                    behavior: "smooth"
                })
            )    
    }

    console.log(user)

    const emojiShowChange = () => {
        setEmojiShow(prev => !prev)
    }


    const dateFormat = new Intl.DateTimeFormat("en-US",{
        year: "numeric",
        month: "short",
        day: "2-digit"
    })

    const messagesList = messages?.messages.map((message , index) => {
        const date = message.date
        let showMessageDate = ""
        const senderName = message.username

        if (date) {
            const messageDate = new Date(date)
            showMessageDate = dateFormat.format(messageDate)
        }

        const ownMessageClass = message.sent ? "own-message" : ""
        const chatPhoto = messages?.partner_photo 


        return (
            <Row 
                key = { index } 
                className = {`message-row ${ ownMessageClass }`}
            >
                <Col className="message-col">
                    <Row>
                        <img 
                            src = { 
                                message.sent ? user?.small_photo : chatPhoto
                                || 
                                "https://groupsiteimages.s3.amazonaws.com/site-photos/no-profile-photo-small.png"
                            } 
                            alt = "chat-user" 
                            className = "chat-img"
                        />
                    </Row>
                    <Row>
                        { showMessageDate }
                    </Row>
                    <Row>
                        { message.sent? user?.username : message.partner }
                    </Row>
                    <Row>
                        { message.message }
                    </Row>
                </Col>
            </Row>
        )
    })




    return (
        <>
            <Modal show={ show } onHide={ handleClose } centered>
                <Container className = "message-modal-container">
                    <Modal.Header>
                        <Modal.Title>Send Message</Modal.Title>
                        <CloseButton 
                            variant = "white" 
                            onClick = { () => handleClose() }
                        />
                    </Modal.Header>
                    <Modal.Body>
                    <>
                        <Row 
                            className = "messages-window-row"
                            ref = { chatWindowRef }
                        >
                            { messagesList }
                        </Row>
                        <Row className = {`emoji-picker-row ${emojiShow ? "" : "emojihide"}`}>
                            <EmojiPicker 
                                onEmojiClick = {(emoji) => 
                                    chatMessageRef.current.value += emoji.emoji 
                                }
                                theme = "dark"
                                emojiStyle = "google"
                                />
                        </Row>
                        <Row className = "chat-input-row">
                            <Col className = "chat-input-col">
                                <input 
                                    name="chat-input"
                                    ref = { chatMessageRef }
                                    className = "chat-input"
                                />
                            </Col>
                            <Col 
                                className = "emoji-show-button"
                                onClick = { emojiShowChange }
                            >
                                <img 
                                    src="https://groupsiteimages.s3.amazonaws.com/icons/emoji-open-icon.png" 
                                    alt="emoji-open-icon"
                                />
                            </Col>
                            <Col className = "chat-send-button-col">
                                <Button onClick = {() => sendMessage()}>
                                    <img 
                                        src = "https://groupsiteimages.s3.amazonaws.com/icons/send-icon.png" 
                                        alt = "send-button-icon"
                                        className = "send-button-icon"
                                    />
                                </Button>
                            </Col>
                        </Row>
                    </>
                    </Modal.Body>
                </Container>
            </Modal>
        </>
    )
}