import React , { useState , useEffect , useLayoutEffect , useRef } from "react"
import { Container , Col , Row } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import { Link , useNavigate } from "react-router-dom"
import Spinner from "react-bootstrap/Spinner"
import { useSelector } from "react-redux"
import axios from "axios"
import Chat from "../chat/chat"
import ChatMessageEl from "../chat/chat_message_el"
import "./messages.css"

export default function Messages() {
    const [ allMessages , setAllMessages ] = useState([])
    const [ currentPartner , setCurrentPartner ] = useState("")
    const user = useSelector((state) => state.userData.data)
    const [ emojiShow , setEmojiShow ] = useState(false)
    const [ findMember , setFindMember ] = useState("")
    const [ findMemberLoading , setFindMemberLoading ] = useState(false)
    const [ findMemberList , setFindMemberList ] = useState([])
    const [ isMobile , setIsMobile ] = useState(window.innerWidth < 992)
    const [ showMessage , setShowMessage ] = useState(false)
    const chatMessageRef = useRef(null)
    const chatWindowRef = useRef(null)
    const findMemberRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        window.addEventListener( "resize" , windowWidthResize )
        return () => window.removeEventListener( "resize" , windowWidthResize )
    })

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
        }
    }, [allMessages])

    useEffect(() => {
        if ((!isMobile && currentPartner) || (isMobile && showMessage && currentPartner)){
            chatWindowRef.current.scrollTo({
                top: chatWindowRef.current.scrollHeight
            })
        }
    }, [currentPartner,showMessage])

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

    const windowWidthResize = () => {
        if (isMobile && window.innerWidth >= 992) {
            setIsMobile(false)
        }
        else if (!isMobile && window.innerWidth < 992)
            {
                setIsMobile(true)
            }
    }

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
        const currentStyle = ( message.partner === currentPartner.username && !isMobile ) ? "current" : ""
        return (
            <Row 
                onClick = { () => {
                    setCurrentPartner({
                        username: message.partner,
                        partner_photo: message.partner_photo
                    })
                    setShowMessage(true)
                }}
                key = { index }
                className = {`chat-partners-list-row ${currentStyle}`}
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
                    onClick = { () => navigate(`/member/${message.partner}`) }
                    className = "go-profile-icon-col"
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
                <ChatMessageEl 
                    index = { index }
                    ownMessageClass = { ownMessageClass }
                    chatPhoto = { message.sent ? user?.small_photo : chatPhoto }
                    showMessageDate = { showMessageDate }
                    message = { message }
                    username = { message.sent ? user?.username : currentPartner?.username }
                />
            )
    })

    const addMemberToPartners = (member) => {
        setFindMember("")
        allMessages.unshift({
            messages: [],
            partner: member.username,
            partner_photo: member.small_photo
        })
        setCurrentPartner({
            username: member.username,
            partner_photo: member.small_photo
        })
    }

    const findMemberListElements = findMemberList.map((member , i) => {
        return (
            <Row
                onClick = { () => addMemberToPartners(member) }          
            >
                <Col>
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
                    className = "go-profile-icon-col"
                >
                    <img 
                        src = "https://groupsiteimages.s3.amazonaws.com/icons/profileicon.png"
                        alt = "go-profile-icon" 
                    />
                </Col>
            </Row>
        )
    })

    console.log(isMobile)

    return (
        <Container
            className = "messages-page-container"
        >
            <Row>
                <Col>
                    <h1>Messages Page</h1>
                </Col>
                <Col
                    ref = { findMemberRef }
                >
                    <Row>
                        <input 
                            placeholder = "Find Member"
                            name = "findMembers" 
                            value = { findMember }
                            onChange = { (e) => setFindMember(e.target.value) }
                        />
                    </Row>
                    { findMember &&
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
                                <Col
                                    className = "find-member-list-col"
                                >
                                    { findMemberList.length > 0 ? findMemberListElements : "no result" }
                                </Col>
                            }
                        </Row>
                    }
                </Col>
            </Row>
            { allMessages.length > 0 ?
                <Row>
                    { (!isMobile || (isMobile && !showMessage)) &&
                        <Col 
                            className = "chat-partners-col"
                        >
                            Partners:
                            { chatPartners }
                        </Col>
                    }
                    { (!isMobile || (isMobile && showMessage)) &&
                        <Col>
                            { isMobile &&
                                <Row>
                                    <Col>
                                        <h3>{ currentPartner.username }</h3>
                                    </Col>
                                    <Col>
                                        <Button 
                                            variant = "primary"
                                            onClick = {() => setShowMessage(false)}
                                        >
                                            Partners
                                        </Button>
                                    </Col>
                                </Row>
                            }
                            <Chat 
                                emojiShow = { emojiShow }
                                chatWindowRef = { chatWindowRef }
                                chatMessageRef = { chatMessageRef }
                                sendToChat = { sendMessage }
                                messages = { messagesList }
                                emojiShowChange = { emojiShowChange }
                                />
                        </Col>
                    }
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