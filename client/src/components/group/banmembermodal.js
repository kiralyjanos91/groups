import React from "react"
import axios from "axios"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import CloseButton from "react-bootstrap/CloseButton"
import UserDataUpdateHook from "../../custom_hooks/userdataupdate"

export default function BanMemberModal( { handleClose , show , groupId , username }){

    const { userDataUpdate } = UserDataUpdateHook()

    const ban = () => {
        axios.post("/banMember" , {
            groupId , username
        })
            .then(() => {
                handleClose()
                userDataUpdate()
            }
                )
            .catch(e => console.log(e))
    }

    return (
        <>
            <Modal show={ show } onHide={ handleClose } centered>
                <Modal.Header>
                    <Modal.Title>Ban Member</Modal.Title>
                    <CloseButton 
                        variant = "white" 
                        onClick = { () => handleClose() }
                    />
                </Modal.Header>
                <Modal.Body>{ `Woul you like to ban ${username}?` }</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={ ban }>
                        Ban
                    </Button>
                    <Button variant="secondary" onClick={ handleClose }>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}