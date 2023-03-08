import React , { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Container , Row , Col } from "react-bootstrap"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import CloseButton from "react-bootstrap/CloseButton"
import "./eventmodal.css"

export default function EventModal( { handleClose , show , eventName , groupInfo  }){

    const eventData = groupInfo.events.find((event,i) => {
        return event.title === eventName
    })

    console.log(eventData)
    const locationText = `${eventData?.location.country}, ${eventData?.location.state}, ${eventData?.location.city}`

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
                            <p>Admin:</p>
                            <p>{groupInfo.admin.username}</p>
                        </Row>
                        <Row>
                            <p>Name:</p>
                            {/* <p>{thisEventData?.title}</p> */}
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
                        <Button variant="primary">
                            Join
                        </Button>
                        <Button variant="secondary" onClick={ handleClose }>
                            Close
                        </Button>
                    </Modal.Footer>
                </Container>
            </Modal>
        </>
    )
}