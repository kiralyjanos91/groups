import React from "react"
import { axiosConf } from "../../config"
import { useNavigate } from "react-router-dom"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import CloseButton from "react-bootstrap/CloseButton"
import AccessUpdateHook from "../../custom_hooks/accessupdate"

export default function LogoutModal( { handleClose , show , setActive  }){

    const { accessUpdate } = AccessUpdateHook()

    const navigate = useNavigate()

    const logoutHandler = () => {
        axiosConf.post("/sendlogout" , {} , { withCredentials: true })
            .then(() => {
                accessUpdate(undefined)
                handleClose()
                setActive("login")
                navigate("/login")
            }
                )
            .catch(e => console.log(e))
    }

    return (
        <>
            <Modal show={ show } onHide={ handleClose } centered>
                <Modal.Header>
                    <Modal.Title>Log Out</Modal.Title>
                    <CloseButton 
                        variant = "white" 
                        onClick = { () => handleClose() }
                    />
                </Modal.Header>
                <Modal.Body>Would you like to log out?</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={ logoutHandler }>
                        Log out
                    </Button>
                    <Button variant="secondary" onClick={ handleClose }>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}