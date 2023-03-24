import React , { useState , useEffect , useLayoutEffect , useRef } from "react"
import { Container , Col , Row } from "react-bootstrap"
import { Link } from "react-router-dom"
import Button from "react-bootstrap/Button"
import Spinner from "react-bootstrap/Spinner"
import { useSelector } from "react-redux"
import EmojiPicker from "emoji-picker-react"
import axios from "axios"
import "./messages.css"

export default function Messages() {
    const [ allMessages , setAllMessages ] = useState([])
    const [ currentPartner , setCurrentPartner ] = useState("")
    const [ showChat , setShowChat ] = useState(false)
    const user = useSelector((state) => state.userData.data)
    const [ emojiShow , setEmojiShow ] = useState(false)
    const [ findMember , setFindMember ] = useState("")
    const [ findMemberLoading , setFindMemberLoading ] = useState(false)
    const [ findMemberList , setFindMemberList ] = useState([])
    const chatMessageRef = useRef()
    const chatWindowRef = useRef()

    useEffect(() => {
        if (user.username){
            axios.post("/getallmessages" , { username: user.username})
            .then(res => {
                const dataForSort = res.data
                dataForSort.sort((a,b) => {
                    return new Date(b.messages.slice(-1)[0].date) - new Date(a.messages.slice(-1)[0].date)
                    
                })
                setAllMessages(dataForSort)
            })   
        }
    }, [user])

    useEffect(() => {
        if (currentPartner === "" && allMessages.length > 0) {
            setCurrentPartner({
                username: allMessages[0]?.partner,
                partner_photo: allMessages[0]?.partner_photo
            })
            setShowChat(true)
        }
    }, [allMessages])

    useEffect(() => {
        if (currentPartner){
            chatWindowRef.current.scrollTo({
                top: chatWindowRef.current.scrollHeight
            })
        }
    }, [currentPartner])

    useLayoutEffect(() => {
        if (findMember) {
            const currentPartners = allMessages.map((message) => message.partner)
            setFindMemberLoading(true)
            axios.get(`/findmember` , {
                params: {
                    memberletters: findMember,
                    currentPartners: [ ...currentPartners , user.username ]
                }
            })
                .then(res => setFindMemberList(res.data))
                .then(() => setFindMemberLoading(false))
                .catch(err => console.log(err))
        }
        else {
            setFindMemberList([])
        }
    }, [findMember])

    const sendMessage = () => {
        axios.post("/sendprivatemessage" , {
            sender_username: user?.username,
            sender_small_photo: user?.small_photo,
            receiver_username: currentPartner.username,
            receiver_small_photo: currentPartner.partner_photo,
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

    const chatPartners = allMessages.map((message , index) => {
        return (
            <Row 
                onClick = { () => setCurrentPartner({
                    username: message.partner,
                    partner_photo: message.partner_photo
                }) }
                key = { index }
                className = "chat-partners-list-row"
            >
                <Col
                    className = "messages-chat-img-col"
                >
                    <img 
                        src = { message.partner_photo || "https://groupsiteimages.s3.amazonaws.com/site-photos/no-profile-photo-small.png" } 
                        alt = "partner-img" 
                        className = "chat-img"
                    />
                </Col>
                <Col 
                    className = "chat-partner-name-col"
                >
                    <p>{ message.partner }</p>
                </Col>
                <Col
                    as = { Link }
                    to = {`/member/${message.partner}`}
                >
                    <img 
                        src = "https://groupsiteimages.s3.amazonaws.com/icons/profileicon.png"
                        alt = "go-profile-icon" 
                    />
                </Col>
            </Row>
        ) 
    })

    const dateFormat = new Intl.DateTimeFormat("en-US",{
        year: "numeric",
        month: "short",
        day: "2-digit"
    })

    const emojiShowChange = () => {
        setEmojiShow(prev => !prev)
    }

    const chatDisplayStyle = showChat ? "" : "hide-chat"

    const messagesList = allMessages.find((message) => 
        message.partner === currentPartner.username)?.messages.map((message , index) => {
            const date = message.date
            let showMessageDate = ""

            if (date) {
                const messageDate = new Date(date)
                showMessageDate = dateFormat.format(messageDate)
            }

            const ownMessageClass = message.sent ? "own-message" : ""
            const chatPhoto = currentPartner.partner_photo 

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
                            { message.sent? user?.username : currentPartner.username }
                        </Row>
                        <Row>
                            { message.message }
                        </Row>
                    </Col>
                </Row>
            )
    })

    const addMemberToPartners = (member) => {
        setFindMember("")
        allMessages.unshift({
            messages: [],
            partner: member.username,
            partner_photo: member.small_photo
        })
    }

    const findMemberListElements = findMemberList.map((member , i) => {
        return (
            <Row>
                <Col
                    onClick = { () => addMemberToPartners(member) }
                >
                    <img 
                        src = { member.small_photo || "https://groupsiteimages.s3.amazonaws.com/site-photos/no-profile-photo-small.png" } 
                        alt = "member-img" 
                        className = "chat-img"
                    />
                </Col>
                <Col>{ member.username }</Col>    
                <Col
                    as = { Link }
                    to = {`/member/${member.username}`}
                >
                    <img 
                        src = "https://groupsiteimages.s3.amazonaws.com/icons/profileicon.png"
                        alt = "go-profile-icon" 
                    />
                </Col>
            </Row>
        )
    })

    return (
        <Container
            className = "messages-page-container"
        >
            <Row>
                <Col>
                    <h1>Messages Page</h1>
                </Col>
                <Col>
                    <Row>
                        <label 
                            htmlFor = "findMembers"
                        >
                            Find Member:
                        </label>
                        <input 
                            name = "findMembers" 
                            value = { findMember }
                            onChange = { (e) => setFindMember(e.target.value) }
                        />
                    </Row>
                    {findMember &&
                        <Row
                            className = "find-member-list-row"
                        >
                            { findMemberLoading ?
                                <Col 
                                    className = "find-member-spinner-col"
                                >
                                    <Spinner animation="border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                </Col>
                            :
                                <Col>
                                    { findMemberList.length > 0 ? findMemberListElements : "no result" }
                                </Col>
                            }
                        </Row>
                    }
                </Col>
            </Row>
            { allMessages.length > 0 ?
                <Row>
                    <Col className = "chat-partners-col">
                        Partners:
                        { chatPartners }
                    </Col>
                    <Col>
                        <>
                            <Row 
                                className = {`messages-window-row ${chatDisplayStyle}`}
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
                    </Col>
                </Row>
            :
                <Row className="spinner-row">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </Row>

            }
        </Container>
    )
}