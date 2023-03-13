import React , { useState , useEffect } from "react"
import axios from "axios"
import { useNavigate , Link } from "react-router-dom"
import { Container , Row , Col } from "react-bootstrap"
import { useSelector } from "react-redux"
import UserDataUpdateHook from "../../custom_hooks/userdataupdate"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import Spinner from "react-bootstrap/Spinner"
import CloseButton from "react-bootstrap/CloseButton"
import "./eventmodal.css"

export default function EventModal({ handleClose , show , eventName , groupInfo }){

    const user = useSelector((state) => state.userData.data)
    const ownUsername = user.username
    const { userDataUpdate } = UserDataUpdateHook()

    const eventData = groupInfo.events.find((event,i) => {
        return event.title === eventName
    })

    const joined = eventData?.members.find((member) => member.username === user.username) ? true : false

    const [buttonLoading , setButtonLoading] = useState(false)

    const locationText = `${eventData?.location.country}, ${eventData?.location.state}, ${eventData?.location.city}`

    const eventMembersList = eventData?.members?.map((member , index) => {
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
    })

    const joinToEvent = () => {
        eventData &&
        setButtonLoading(true)
        axios.post("/jointoevent" , {
            groupId: groupInfo._id,
            groupName: groupInfo.name,
            eventName,
            eventPhoto: eventData?.photo,
            eventDate:eventData?.date,
            eventLocation:eventData?.location,
            username: user.username,
            userPhoto: user.small_photo
        })
            .then(res => {
                console.log(res)
                userDataUpdate()
            })
    }

    const leaveEvent = () => {
        setButtonLoading(true)
        axios.post("/leaveevent" , {
            groupId: groupInfo._id,
            eventName,
            userName: user.username,
        })
            .then((res) => {
                console.log(res)
                userDataUpdate()
            })
    }

    useEffect(() => {
        if (buttonLoading) {
            setButtonLoading(false)
        }
    }, [groupInfo])

    return (
        <>
            <Modal show={ show } onHide={ handleClose } fullscreen = { true } centered>
                <Container className = "event-modal-container">
                    <Modal.Header>
                        <Modal.Title>Event</Modal.Title>
                        <CloseButton 
                            variant = "white" 
                            onClick = { () => handleClose() }
                        />
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col 
                                className = "event-photo-col"
                                style = {{
                                    backgroundImage: `url("${eventData?.photo}")`
                                }}
                                >
                            </Col>
                            <Col>
                                <p>{eventData?.title}</p>
                            </Col>
                        </Row>
                        <Row>
                            <p>Description:</p>
                            <p>{eventData?.description}</p>
                        </Row>
                        <Row>
                            <p>When:</p>
                            <p>{eventData?.date}</p>
                        </Row>
                        <Row>
                            <p>Where:</p>
                            <p>{locationText}</p>
                        </Row>
                        <Row>
                            <p>Joined Members:</p> 
                            { eventMembersList }

                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        { joined ?
                            <Button 
                                variant="secondary" 
                                onClick = { leaveEvent }
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
                                onClick = { joinToEvent }
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
                        <Button variant="secondary" onClick = { handleClose }>
                            Close
                        </Button>
                    </Modal.Footer>
                </Container>
            </Modal>
        </>
    )
}