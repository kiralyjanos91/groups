import React , { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import UserDataUpdateHook from "../../../custom_hooks/userdataupdate";

export default function EditProfileModal ({
    show, 
    handleClose,
    profileData
}) {
    const {
        username,
        gender,
        birth,
        city,
        hobby,
        about
    } = profileData
    
    
    const [formData , setFormData] = useState({
        username: username,
        gender: gender,
        birth: birth,
        city: city,
        hobby: hobby,
        about: about
    })

    const formChange = (e) => {
        setFormData(prev => {
            return {
                ...prev, 
                [e.target.name]: e.target.value
            }
        })
    }

    const { userDataUpdate } = UserDataUpdateHook()

    const save = () => {
        axios.post("/profiledatachange" , formData)
            .then(response => console.log(response))
            .then(
                handleClose(),
                userDataUpdate()
            )
            .catch((err) => console.log(err))
    }

    const fields = Object.entries(formData).slice(1).map((field , index) => {  
        return (
            <div key = { index }>
                <label htmlFor = { field[0] }> 
                    { field[0] }
                </label>
                <input 
                    name = { field[0] } 
                    value = { field[1] } 
                    onChange={(e) => formChange(e)}
                />
            </div>
        )
    })

    return (    
        <Modal show={ show } onHide={ handleClose }>
            <Modal.Header closeButton>
                <Modal.Title>Log Out Box</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form>
                    { fields }
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={ save }>
                    Save 
                </Button>
                <Button variant="secondary" onClick={ handleClose }>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

