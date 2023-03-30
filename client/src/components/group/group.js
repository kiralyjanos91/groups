import React, { useState , useEffect , useRef } from "react"
import { Container , Col , Row } from "react-bootstrap"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import Spinner from "react-bootstrap/Spinner"
// import EmojiPicker from 'emoji-picker-react';
import { useParams , useNavigate } from "react-router"
import { Link } from "react-router-dom"
import axios from "axios"
import { useSelector , useDispatch } from "react-redux"
import { changeCategory } from "../../redux_slices/categoryslice"
import UserDataUpdateHook from "../../custom_hooks/userdataupdate"
import "./group.css"
import EventModal from "./eventmodal"
import CreateEventModal from "./createeventmodal"
import BanMemberModal from "./banmembermodal"
import EventCard from "../event_card/eventcard"
import Chat from "../chat/chat"
import ChatMessageEl from "../chat/chat_message_el"

export default function Group(){

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [groupInfo , setGroupInfo] = useState()
    const [buttonLoading , setButtonLoading] = useState(false)
    const [emojiShow , setEmojiShow] = useState(false)
    const [eventName , setEventName] = useState("")
    const [eventShow, setEventShow] = useState(false);
    const [banShow, setBanShow] = useState(false);

    const [banUsername , setBanUsername] = useState("")
    
    const groupName = groupInfo?.name
    const admin = groupInfo?.admin

    const chatMessageRef = useRef()
    const chatWindowRef = useRef()
    
    const { userDataUpdate } = UserDataUpdateHook()
    const { id } = useParams()
    const user = useSelector((state) => state.userData.data)

    const ownUsername = user?.username
    const notOwnGroup = user.own_groups?.find( ( group ) => group.name === groupName ) ? false : true
    const joined = user.groups?.find( ( group ) => group.name === groupName ) ? true : false

    const handleEventClose = () => setEventShow(false);
    const handleEventShow = (event) => {
        setEventName(event.currentTarget.id)
        setEventShow(true);
    }
    const [createEventShow, setcreateEventShow] = useState(false);
    const handleCreateEventClose = () => setcreateEventShow(false);
    const handleCreateEventShow = () => {
        setcreateEventShow(true);
    }

    const handleBanClose = () => {
        setBanShow(false)
        setBanUsername("")
    }

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

    const banMember = (username) => {
        setBanUsername(username)
        setBanShow(true)
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
                    key = { index }
                    className = "member-list-element-main-col"
                >
                    { !notOwnGroup &&                       
                        <p
                            onClick = {
                                () => banMember(member.username) 
                            }
                            className = "ban-x"
                            >
                            ⨉
                    </p>
                    }
                    <Col                   
                        className = "primary-link member-photo-col" 
                        as = { Link }
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
                </Col>
            )
        }   
        else {
            return null
        }
    })

    const eventsList = groupInfo?.events.map((event , i) => {
        const isMember = event.members.find((member) => member.username === ownUsername) ? true : false
        const locationText = `${event?.location.country}, ${event?.location.state}, ${event?.location.city}, ${event?.location.address || ""}`
        return (
            <EventCard 
                i = { i }
                event = { event }
                eventLocation = { locationText }
                showEvent = { handleEventShow }
                photo = { event.photo }
                date = { event.date }
            />
        )
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

        return (
            <ChatMessageEl 
                index = { index }
                ownMessageClass = { ownMessageClass }
                chatPhoto = { chatPhoto }
                showMessageDate = { showMessageDate }
                message = { message }
            />
            
            // <Row 
            //     key = { index } 
            //     className = {`message-row ${ ownMessageClass }`}
            // >
            //     <Col className="message-col">
            //         <Row>
            //             <img 
            //                 src = { 
            //                     chatPhoto 
            //                     || 
            //                     "https://groupsiteimages.s3.amazonaws.com/site-photos/no-profile-photo-small.png"
            //                 } 
            //                 alt = "chat-user" 
            //                 className = "chat-img"
            //             />
            //         </Row>
            //         <Row>
            //             { showMessageDate }
            //         </Row>
            //         <Row>
            //             { message.username }
            //         </Row>
            //         <Row>
            //             { message.message }
            //         </Row>
            //     </Col>
            // </Row>
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
                            <div 
                                className = "group-main-photo-div"
                                style = {{
                                    backgroundImage: `url(${
                                        groupInfo?.photo 
                                        || 
                                        "https://groupsiteimages.s3.amazonaws.com/group_photos/no_group_photo.png"
                                    })`
                                }}
                            >
                            </div>
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
                                    <Row>
                                        <Col className = "own-group-badge-col">
                                            <p 
                                                className = "own-group-badge"
                                                >
                                                Own Group
                                            </p>
                                        </Col>
                                        <Col className = "create-event-badge-col">
                                            <p 
                                                className = "create-event-badge"
                                                onClick = {() => handleCreateEventShow()}
                                            >
                                                Create Event
                                            </p>
                                        </Col>
                                    </Row>
                                    
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
                            <p>Events:</p>
                            {eventsList}                       
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
                                <Chat 
                                    emojiShow = { emojiShow }
                                    chatWindowRef = { chatWindowRef }
                                    chatMessageRef = { chatMessageRef }
                                    sendToChat = { sendToChat }
                                    messages = { messages }
                                    emojiShowChange = { emojiShowChange }
                                />
                            }   
                            <EventModal 
                                handleClose={ handleEventClose }
                                show = { eventShow }
                                groupInfo = { groupInfo }
                                eventName = { eventName }
                                groupId = { id }
                            />

                            <CreateEventModal 
                                show = { createEventShow }
                                groupId = { id }
                                handleClose = { handleCreateEventClose }
                            />

                            <BanMemberModal 
                                handleClose={ handleBanClose }
                                show = { banShow }
                                username = { banUsername }
                                groupId = { id }
                            />
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
        </>
    )
}