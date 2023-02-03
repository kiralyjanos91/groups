import React, { useState , useEffect , useRef } from "react"
import { Container , Col , Row } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import Spinner from "react-bootstrap/Spinner"
import { useParams , useNavigate } from "react-router"
import { Link } from "react-router-dom"
import axios from "axios"
import { useSelector , useDispatch } from "react-redux"
import { changeCategory } from "../../redux_slices/categoryslice"
import UserDataUpdateHook from "../../custom_hooks/userdataupdate"
import "./group.css"

export default function Group(){
    const [groupInfo , setGroupInfo] = useState()
    const [buttonLoading , setButtonLoading] = useState(false)
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

    useEffect(() => {
        axios.post("/groupdata" , { id })
            .then((groupdata) =>setGroupInfo((prevstate) => groupdata.data))
            .then(() => { 
                if (buttonLoading === true) {
                    setButtonLoading(false)
                }
                chatWindowRef.current.scrollTo({
                    top: chatWindowRef.current.scrollHeight
                })
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

    const membersList = groupInfo?.members?.map((member , index) => {
        if (member.username !== admin) {
            return (
                <li key = { index }>
                    <Link 
                        to = {
                            member.username === ownUsername ?
                                `/profile`
                            :
                                `/member/${member.username}`
                        }
                        className="primary-link"
                    >
                        { member.username }
                    </Link>
                </li>
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

        if (date) {
            const messageDate = new Date(date)
            showMessageDate = dateFormat.format(messageDate)
        }

        const ownMessageClass = message.username === ownUsername ? "own-message" : ""

        return (
            <Row 
                key = { index } 
                className = {`message-row ${ ownMessageClass }`}
            >
                <Col className="message-col">
                    <Row>
                        {showMessageDate}
                    </Row>
                    <Row>
                        {message.username}
                    </Row>
                    <Row>
                        {message.message}
                    </Row>
                </Col>
            </Row>
        )
    })

    return (
        <Container>
            { groupInfo ?
                <>
                    <Row>
                        <Col>
                            <h1>
                                { groupName }
                            </h1>
                        </Col>
                    </Row>
                    { notOwnGroup &&
                        <Row>
                            <Col>
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
                    }
                    <Row>
                        <Col>
                            <p>Admin:</p>
                            <p>
                                <Link                            
                                    to = {
                                        admin === ownUsername ?
                                            `/profile`
                                        :
                                            `/member/${admin}`
                                    }                                 
                                    className="primary-link"
                                >
                                    { admin } 
                                </Link>
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p>Category:</p>
                            <p
                                className="primary-link"
                                onClick = { goToCategory }
                            >                              
                                { groupInfo.category }
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p>Members:</p>
                            <ul>
                                { membersList }
                            </ul>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p>Events:</p>
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
                        <Row 
                            className = "messages-window-row"
                            ref = { chatWindowRef }
                        >
                            { messages }
                        </Row>
                        <Row className = "chat-input-row">
                            <Col className = "chat-input-col">
                                <input 
                                    name="chat-input"
                                    ref = { chatMessageRef }
                                    className = "chat-input"
                                />
                            </Col>
                            <Col className = "chat-send-button-col">
                                <Button onClick = { sendToChat }>
                                    Send
                                </Button>
                            </Col>
                        </Row>
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
    )
}