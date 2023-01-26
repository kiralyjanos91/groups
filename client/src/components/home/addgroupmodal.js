import React, { useRef } from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import axios from "axios"
import { useSelector } from "react-redux"

export default function AddGroupModal({ show , handleClose , needRefresh }){
    
    const username = useSelector((state) => state.userData.data.username)
    const groupNameRef = useRef()

    const sendNewGroup = (e) => {
        e.preventDefault()
        axios.post("/addgroup" , {
            name: groupNameRef.current.value,
            username
        })
        .then(
            needRefresh(),
            handleClose()
        )
    }

    return (
        <>
            <Modal show={ show } onHide={ handleClose }>
                <Modal.Header closeButton>
                    <Modal.Title>Log Out Box</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <label htmlFor="groupname">
                            Name of you group:
                        </label>
                        <input name="groupname" ref={ groupNameRef } />
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={ sendNewGroup }> Create </Button>
                    <Button variant="secondary" onClick={ handleClose }>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </> 
    )
}