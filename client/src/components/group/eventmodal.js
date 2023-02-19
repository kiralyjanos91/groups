import React from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Container , Row , Col } from "react-bootstrap"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"

export default function EventModal( { handleClose , show , eventId  }){
    return (
        <>
            <Modal show={ show } onHide={ handleClose } fullscreen = { true } centered>
                <Container>
                    <Modal.Header closeButton>
                        <Modal.Title>Event</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Would you like to log out?
                        <p>event id: {eventId}</p>
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