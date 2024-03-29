import React , { useState , useEffect } from "react"
import { axiosConf } from "../../config"
import { Link } from "react-router-dom"
import { Container , Row , Col } from "react-bootstrap"
import { useSelector } from "react-redux"
import UserDataUpdateHook from "../../custom_hooks/userdataupdate"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import Spinner from "react-bootstrap/Spinner"
import CloseButton from "react-bootstrap/CloseButton"
import "./eventmodal.css"

export default function EventModal({ handleClose , show , eventName , groupInfo , admin }){

    const user = useSelector((state) => state.userData.data)
    const ownUsername = user.username
    const { userDataUpdate } = UserDataUpdateHook()
    
    
    const eventData = groupInfo.events.find((event,i) => {
        return event.title === eventName
    })

    const isAdmin = admin === ownUsername
    const joined = eventData?.members.find((member) => member.username === user.username) ? true : false
    const [buttonLoading , setButtonLoading] = useState(false)
    const [deletePage , setDeletePage] = useState(false)
    const locationText = `${eventData?.location.country}, ${eventData?.location.state}, ${eventData?.location.city}, ${eventData?.location.address || "" }`
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
                        member.userPhoto || "https://groupsiteimages.s3.amazonaws.com/site-photos/no-profile-photo-small.png" 
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
        axiosConf.post("/jointoevent" , {
            groupId: groupInfo._id,
            groupName: groupInfo.name,
            eventName,
            eventPhoto: eventData?.photo,
            eventDate: eventData?.date,
            eventTime: eventData?.time,
            eventLocation: eventData?.location,
            username: user.username,
            userPhoto: user.small_photo
        })
            .then(res => {
                userDataUpdate()
            })
    }

    const leaveEvent = () => {
        setButtonLoading(true)
        axiosConf.post("/leaveevent" , {
            groupId: groupInfo._id,
            eventName,
            userName: user.username,
        })
            .then((res) => {
                userDataUpdate()
            })
    }

    const deleteEvent = () => {
        setDeletePage(false)
        handleClose()
        axiosConf.delete("/deleteevent" , {
            data: {
                groupId: groupInfo._id,
                eventName 
            }
        })
            .then((res) => {
                userDataUpdate()
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        if (buttonLoading) {
            setButtonLoading(false)
        }
    }, [groupInfo])

    return (
        <>
            <Modal show = { show } onHide = { handleClose } fullscreen = { true } centered>
                { deletePage ? 
                    <Container
                        className = "delete-event-container"
                    >
                        <Row>
                            <Col>
                                <h1
                                    className = "delete-question"
                                >
                                    Do You want to delete this event?</h1>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button 
                                    className = "delete-event-page-button"
                                    variant = "primary"
                                    onClick = { deleteEvent }
                                >
                                    Delete
                                </Button>
                            </Col>
                            <Col>
                                <Button 
                                    className = "delete-event-page-button"
                                    variant = "secondary"
                                    onClick = {() => setDeletePage(false)}
                                >
                                    Close
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                :
                    <Container className = "event-modal-container">
                        <Modal.Header>
                            <Modal.Title>{ eventData?.title }</Modal.Title>
                            <CloseButton 
                                variant = "white" 
                                onClick = { () => handleClose() }
                            />
                        </Modal.Header>
                        <Modal.Body
                            className = "event-modal-body"
                        >
                            <Row
                                className = "event-photo-row"
                            >
                                <Col 
                                    className = "event-photo-col"
                                    style = {{
                                        backgroundImage: `url("${eventData?.photo}")`
                                    }}
                                    >
                                </Col>
                            </Row>
                            <Row>
                                <p
                                    className = "event-label"
                                >
                                    Description:
                                </p>
                                <p>{eventData?.description}</p>
                            </Row>
                            <Row>
                                <p
                                        className = "event-label"
                                >
                                    When:
                                </p>
                                <p>{eventData?.date}</p>
                                <p>{eventData?.time}</p>
                            </Row>
                            <Row>
                                <p
                                    className = "event-label"
                                >
                                    Where:
                                </p>
                                <p>{locationText}</p>
                            </Row>
                            <Row>
                                <p
                                    className = "event-label event-members-label"
                                >
                                    Joined Members:
                                </p> 
                                <Col
                                    className = "event-members-list-col"
                                >
                                    { eventMembersList }
                                </Col>
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
                            { isAdmin &&
                                <Button variant="dark" onClick = { () => setDeletePage(true) }>
                                    Delete Event
                                </Button>
                            }
                        </Modal.Footer>
                    </Container>
                }
            </Modal>
        </>
        )
}