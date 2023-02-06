import React from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import AccessUpdateHook from "../../custom_hooks/accessupdate"

export default function LogoutModal( { handleClose , show  }){

    const { accessUpdate } = AccessUpdateHook()

    const navigate = useNavigate()

    const logoutHandler = () => {
        axios.post("/sendlogout" , {} , { withCredentials: true })
            .then(() => {
                accessUpdate(undefined)
                handleClose()
                navigate("/login")
            }
                )
            .catch(e => console.log(e))
    }

    return (
        <>
            <Modal show={ show } onHide={ handleClose } centered>
                <Modal.Header closeButton>
                    <Modal.Title>Log Out Box</Modal.Title>
                </Modal.Header>
                <Modal.Body>Would you like to log out?</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={ logoutHandler }>
                        Logout
                    </Button>
                    <Button variant="secondary" onClick={ handleClose }>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}