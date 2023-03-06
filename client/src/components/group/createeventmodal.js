import React, { useRef , useState , useEffect } from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import CloseButton from "react-bootstrap/CloseButton"
import axios from "axios"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
import UserDataUpdateHook from "../../custom_hooks/userdataupdate"
import "./createeventmodal.css"

export default function CreateEventModal({ show , handleClose }){
    
    const [ groupPhoto , setGroupPhoto ] = useState(null)
    const [ photoLocation , setPhotoLocation ] = useState("")
    const [ imageUploading , setImageUploading ] = useState(false)
    const [ groupName , setGroupName ] = useState("")
    const { userDataUpdate } = UserDataUpdateHook()
    const navigate = useNavigate()

    const createEvent = (e) => {
       
    }

    useEffect(() => {
        if (groupPhoto) {
            setPhotoLocation("")
            const photoForm = new FormData()
            photoForm.append("image" , groupPhoto , groupPhoto.name )
            axios.put("/groupphotoupload" , photoForm)
                .then( (res) => 
                    setPhotoLocation(() => res.data)       
                )
                .then( () => setImageUploading(false) )
        }
    } , [groupPhoto])

    return (
        <>
            <Modal show = { show } onHide = { handleClose } centered>
                <Modal.Header>
                    <Modal.Title>Create Event</Modal.Title>
                    <CloseButton 
                        variant = "white" 
                        onClick = { () => handleClose() }
                    />
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <label htmlFor = "groupname">
                            Name of you group:
                        </label>
                        <input 
                            name="groupname" 
                            onChange = {(e) => setGroupName(e.target.value)}
                            value = { groupName }
                        />
                        <labe htmlFor = "group_photo">Group Photo:</labe>
                        <input 
                            type = "file" 
                            name = "group_photo"
                            onChange = { (e) => {
                                setImageUploading(true)
                                setGroupPhoto(e.target.files[0]) 
                            }
                            }       
                        />
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="primary" 
                        onClick = { createEvent }
                        className = { photoLocation && groupName ? "" : "disabled-create-button"}
                    > 
                        { imageUploading ? "Uploading..." : "Create" } 
                    </Button>
                    <Button 
                        variant="secondary" 
                        onClick = { handleClose }
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </> 
    )
}