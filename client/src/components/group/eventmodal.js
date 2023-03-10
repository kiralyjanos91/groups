import React , { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Container , Row , Col } from "react-bootstrap"
import { useSelector } from "react-redux"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import CloseButton from "react-bootstrap/CloseButton"
import "./eventmodal.css"

export default function EventModal({ handleClose , show , eventName , groupInfo }){

    const user = useSelector((state) => state.userData.data)

    const eventData = groupInfo.events.find((event,i) => {
        return event.title === eventName
    })

    const locationText = `${eventData?.location.country}, ${eventData?.location.state}, ${eventData?.location.city}`

    const joinToEvent = () => {
        eventData &&
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
            .then(res => console.log(res))
    }

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
                            <p>{eventData?.title}</p>
                            <img 
                                src = {eventData?.photo} 
                                alt = "event-img" 
                                className = "event-photo"
                            />
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
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick = {joinToEvent}>
                            Join
                        </Button>
                        <Button variant="secondary" onClick = { handleClose }>
                            Close
                        </Button>
                    </Modal.Footer>
                </Container>
            </Modal>
        </>
    )
}