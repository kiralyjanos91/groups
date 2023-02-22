import React, { useState , useEffect , useRef } from "react"
import { Container , Col , Row } from "react-bootstrap"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import Spinner from "react-bootstrap/Spinner"
import EmojiPicker from 'emoji-picker-react';
import { useParams , useNavigate } from "react-router"
import { Link } from "react-router-dom"
import axios from "axios"
import { useSelector , useDispatch } from "react-redux"
import { changeCategory } from "../../redux_slices/categoryslice"
import UserDataUpdateHook from "../../custom_hooks/userdataupdate"
import "./group.css"
import EventModal from "./eventmodal"

export default function Group(){
    const [groupInfo , setGroupInfo] = useState()
    const [buttonLoading , setButtonLoading] = useState(false)
    const [emojiShow , setEmojiShow] = useState(false)
    const groupName = groupInfo?.name
    const admin = groupInfo?.admin
    const chatMessageRef = useRef()
    const chatWindowRef = useRef()
    
    const { userDataUpdate } = UserDataUpdateHook()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id } = useParams()
    const user = useSelector((state) => state.userData.data)
    const ownUsername = user?.username
    const notOwnGroup = user.own_groups?.find( ( group ) => group.name === groupName ) ? false : true
    const joined = user.groups?.find( ( group ) => group.name === groupName ) ? true : false

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = (event) => {
        setEventId(event)
        setShow(true);
    }
    const [ eventId , setEventId ] = useState("")

    useEffect(() => {
        axios.post("/groupdata" , { id })
            .then((groupdata) => 
                setGroupInfo(() => groupdata.data)
            )
            .then(() => { 
                if (buttonLoading) {
                    setButtonLoading(false)
                }
                if (chatWindowRef.current) {
                    chatWindowRef.current.scrollTo({
                        top: chatWindowRef.current.scrollHeight
                    })
                }
            })
    }, [user])

    const joinToGroup = () => {
        setButtonLoading(true)
        axios.post("/joingroup" , { groupName , user , id })
            .then((response) => {
                console.log(response)
                userDataUpdate()
            })
    }

    const leaveGroup = () => {
        setButtonLoading(true)
        axios.post("/leavegroup" , { groupName , user })
            .then((response) => {
                console.log(response)
                userDataUpdate()
            })
    }

    const sendToChat = () => {
        if (chatMessageRef.current.value) {
                axios.post("/sendtochat" , {
                    username: ownUsername,
                    message: chatMessageRef.current.value,
                    groupName,
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
    }

    const goToCategory = () => {
        dispatch(changeCategory(groupInfo?.category))
        navigate("/groups/1")
    }

    const emojiShowChange = () => {
        setEmojiShow(prev => !prev)
    }

    const membersList = groupInfo?.members?.map((member , index) => {
        if (member.username !== admin.username) {
            return (
                <Col 
                    as = { Link }
                    key = { index }
                    className = "primary-link member-photo-col" 
                    to = {
                        member.username === ownUsername ?
                            `/profile`
                        :
                            `/member/${member.username}`
                    }
                >
                    <img 
                        src = { 
                            member.small_photo || "https://groupsiteimages.s3.amazonaws.com/site-photos/no-profile-photo-small.png" 
                        }
                        alt = "small-profile"
                        className="small-photo-round" 
                    />
                    <p className="members-list-username">
                        { member.username }
                    </p>
                </Col>
            )
        }   
        else {
            return null
        }
    })

    const dateFormat = new Intl.DateTimeFormat("en-US",{
        year: "numeric",
        month: "short",
        day: "2-digit"
    })

    const messages = groupInfo?.messages?.map((message , index) => {
        const date = message.date
        let showMessageDate = ""
        const senderName = message.username

        if (date) {
            const messageDate = new Date(date)
            showMessageDate = dateFormat.format(messageDate)
        }

        const ownMessageClass = senderName === ownUsername ? "own-message" : ""
        const chatPhoto = senderName === admin?.username ? 
                admin?.small_photo 
            : 
                groupInfo?.members?.find((member) => member.username === senderName)?.small_photo 


        console.log(senderName)

        return (
            <Row 
                key = { index } 
                className = {`message-row ${ ownMessageClass }`}
            >
                <Col className="message-col">
                    <Row>
                        <img 
                            src = { 
                                chatPhoto 
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
                        { message.username }
                    </Row>
                    <Row>
                        { message.message }
                    </Row>
                </Col>
            </Row>
        )
    })

    console.log(groupInfo)

    return (
        <>
            <Container>
                { groupInfo ?
                    <>
                        <Row className = "group-header-row">
                            <Col className = "group-main-photo-col">
                                <img 
                                    src = {
                                        groupInfo?.photo 
                                        || 
                                        "https://groupsiteimages.s3.amazonaws.com/group_photos/no_group_photo.png"}
                                    alt = "group-img" 
                                    className = "group-main-photo"
                                />
                            </Col>
                            <Col>
                                <h1 className="group-name">
                                    { groupName }
                                </h1>                       
                                <p
                                    className="primary-link"
                                    onClick = { goToCategory }
                                >                              
                                    { groupInfo.category }
                                </p>
                                { notOwnGroup ?
                                    <Row>
                                        <Col className = "join-button-col">
                                            { joined ?
                                                <Button 
                                                    variant="secondary" 
                                                    onClick = { leaveGroup }
                                                >
                                                    { buttonLoading ?
                                                        <Spinner 
                                                            animation="border" 
                                                            role="status" 
                                                            className="loading-button"
                                                        >
                                                            <span className="visually-hidden">Loading...</span>
                                                        </Spinner>
                                                    :
                                                        "Leave"
                                                    }
                                                </Button>
                                            :
                                                <Button 
                                                    variant="primary" 
                                                    onClick = { joinToGroup }
                                                >
                                                    { buttonLoading ?
                                                        <Spinner 
                                                            animation="border" 
                                                            role="status"
                                                            className="loading-button"
                                                        >
                                                            <span className="visually-hidden">Loading...</span>
                                                        </Spinner>
                                                    :
                                                        "Join"
                                                    }
                                                </Button>
                                            }
                                        </Col>
                                    </Row>
                                    :
                                    <p 
                                        className = "own-group-badge"
                                    >
                                        Own Group
                                    </p>
                                }
                            </Col>
                        </Row>
                        <Row>
                            <p>Admin:</p>
                            <Col 
                                as = { Link } 
                                to = {
                                    admin.username === ownUsername ?
                                        `/profile`
                                    :
                                        `/member/${admin.username}`
                                }  
                                className = "primary-link member-photo-col"
                            >
                                <img 
                                    src = { 
                                        admin.small_photo || 
                                        "https://groupsiteimages.s3.amazonaws.com/site-photos/no-profile-photo-small.png" 
                                    }
                                    alt = "small-profile"
                                    className="small-photo-round" 
                                />
                                <p className="members-list-username">
                                    { admin.username }
                                </p>
                            </Col>
                        </Row>
                        <Row>      
                            <p>Members:</p>
                        </Row>
                        <Row>
                            { membersList }
                        </Row>
                            
                        <Row>
                            <Col>
                                <p>Events:</p>
                                <p onClick = {() => handleShow(1) } >Test event</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <p>Location:</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <p>Chat:</p>
                            </Col>
                        </Row>
                        <Container className = "chat-container">
                            { !joined && notOwnGroup ?
                                <>
                                    You have to be a member to see the messages
                                </>
                            :
                                <>
                                    <Row 
                                        className = "messages-window-row"
                                        ref = { chatWindowRef }
                                    >
                                        { messages }
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
                                            <Button onClick = { sendToChat }>
                                                <img 
                                                    src = "https://groupsiteimages.s3.amazonaws.com/icons/send-icon.png" 
                                                    alt = "send-button-icon"
                                                    className = "send-button-icon"
                                                />
                                            </Button>
                                        </Col>
                                    </Row>
                                </>
                            }   
                        </Container>
                    </>
                :
                    <Row className="spinner-row">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </Row>
                }
            </Container>

            <EventModal 
                handleClose={ handleClose }
                show = { show }
                eventId = { eventId }
                groupId = { id }
                groupName = { groupName }
            />
        </>
    )
}