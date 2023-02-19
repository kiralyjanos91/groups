import React from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Container , Row , Col } from "react-bootstrap"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import CloseButton from "react-bootstrap/CloseButton"
import "./eventmodal.css"

export default function EventModal( { handleClose , show , eventId  }){
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
                            <p>*Image*</p>
                        </Row>
                        <Row>
                            <p>Admin:</p>
                        </Row>
                        <Row>
                            <p>event id: {eventId}</p>
                        </Row>
                        <Row>
                            <p>Name:</p>
                        </Row>
                        <Row>
                            <p>Details:</p>
                        </Row>
                        <Row>
                            <p>When:</p>
                        </Row>
                        <Row>
                            <p>Where:</p>
                        </Row>
                        <Row>
                            <p>Where:</p>
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