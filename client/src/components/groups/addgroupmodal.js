import React, { useRef } from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import axios from "axios"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
import UserDataUpdateHook from "../../custom_hooks/userdataupdate"

export default function AddGroupModal({ show , handleClose , groupCategoryOptions }){
    
    const username = useSelector((state) => state.userData.data.username)
    const groupNameRef = useRef()
    const categoryRef = useRef()
    const { userDataUpdate } = UserDataUpdateHook()
    const navigate = useNavigate()

    const sendNewGroup = (e) => {
        e.preventDefault()
        axios.post("/addgroup" , {
            name: groupNameRef.current.value,
            username,
            category: categoryRef.current.value
            // location: locationRef.current.value
        })
        .then( response => {
            const groupId = response.data.group_Id
            userDataUpdate()
            navigate(`/group/${groupId}`)
            handleClose()
        }
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
                        <input 
                            name="groupname" 
                            ref={ groupNameRef } 
                        />
                        <label htmlFor="category">
                            Category:
                        </label>
                        <select 
                            id = "category"
                            name = "category" 
                            ref = { categoryRef }
                        > 
                            { groupCategoryOptions }
                        </select>
                        
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