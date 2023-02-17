import React, { useRef , useState , useEffect } from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import axios from "axios"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
import UserDataUpdateHook from "../../custom_hooks/userdataupdate"

export default function AddGroupModal({ show , handleClose , groupCategoryOptions }){
    
    const username = useSelector((state) => state.userData.data.username)
    const small_photo = useSelector((state) => state.userData.data.small_photo)
    const groupNameRef = useRef()
    const categoryRef = useRef()
    const [ groupPhoto , setGroupPhoto ] = useState(null)
    const [ photoLocation , setPhotoLocation ] = useState("")
    const [ formFilled , setFormFilled ] = useState(false)
    const [ imageUploading , setImageUploading ] = useState(false)
    const { userDataUpdate } = UserDataUpdateHook()
    const navigate = useNavigate()

    const sendNewGroup = (e) => {
        e.preventDefault()
        axios.post("/addgroup" , {
            name: groupNameRef.current.value,
            user: {
                username,
                small_photo
            },
            category: categoryRef.current.value,
            photoLocation
        })
        .then( response => {
            const groupId = response.data.group_Id
            userDataUpdate()
            navigate(`/group/${groupId}`)
            handleClose()
        }
        )
    }

    useEffect(() => {
        if (groupPhoto) {
            const photoForm = new FormData()
            photoForm.append("image" , groupPhoto , groupPhoto.name )
            axios.put("/groupphotoupload" , photoForm)
            .then((res) => 
            setPhotoLocation(() => res.data)
            )
        }
    } , [groupPhoto])

    console.log(`Photo location is: ${photoLocation}`)

    return (
        <>
            <Modal show={ show } onHide={ handleClose } centered>
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
                        <input 
                            type = "file" 
                            name = "group_photo"
                            onChange = { (e) => {
                                setGroupPhoto(e.target.files[0]) 
                            }
                            }       
                        />
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick = { sendNewGroup }> Create </Button>
                    <Button variant="secondary" onClick = { handleClose }>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </> 
    )
}