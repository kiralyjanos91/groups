import React, { useRef , useState , useEffect } from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import CloseButton from "react-bootstrap/CloseButton"
import { axiosConf } from "../../config"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
import UserDataUpdateHook from "../../custom_hooks/userdataupdate"
import "./addgroupmodal.css"

export default function AddGroupModal({ show , handleClose , groupCategoryOptions }){
    
    const username = useSelector((state) => state.userData.data.username)
    const small_photo = useSelector((state) => state.userData.data.small_photo)
    const categoryRef = useRef()
    const [ groupPhoto , setGroupPhoto ] = useState(null)
    const [ photoLocation , setPhotoLocation ] = useState("")
    const [ imageUploading , setImageUploading ] = useState(false)
    const [ groupName , setGroupName ] = useState("")
    const [ description , setDescription ] = useState("")
    const [ errorMessage , setErrorMessage] = useState("")
    const { userDataUpdate } = UserDataUpdateHook()
    const navigate = useNavigate()

    const sendNewGroup = (e) => {
        e.preventDefault()
        axiosConf.post("/addgroup" , {
            name: groupName,
            user: {
                username,
                small_photo
            },
            description,
            category: categoryRef.current.value,
            photoLocation
        })
        .then( response => {
            const groupId = response.data.group_Id
            userDataUpdate()
            navigate(`/group/${groupId}`)
            handleClose()
            clearForm()
        }
        )
        .catch((err) => {
            if(err.response.status === 406)
                {
                    return setErrorMessage(err.response.data)
                }
            console.log(err)
        })
    }

    const clearForm = () => {
        setGroupPhoto(null)
        setPhotoLocation("")
        setImageUploading(false)
        setGroupName("")
        setDescription("")
        setErrorMessage("")
    }

    useEffect(() => {
        if (groupPhoto) {
            setPhotoLocation("")
            const photoForm = new FormData()
            photoForm.append("image" , groupPhoto , groupPhoto.name )
            axiosConf.put("/groupphotoupload" , photoForm)
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
                    <Modal.Title>Create group</Modal.Title>
                    <CloseButton 
                        variant = "white" 
                        onClick = { () => {
                            handleClose()
                            clearForm()
                        } }
                    />
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <label htmlFor = "groupname">
                            Name of your group:
                        </label>
                        <input 
                            name="groupname" 
                            onChange = {(e) => {
                                setGroupName(e.target.value)
                                setErrorMessage("")
                            }
                            }
                            value = { groupName }
                        />
                        <label htmlFor = "description">
                            Description:
                        </label>
                        <textarea 
                            className = "description-input"
                            name="description" 
                            onChange = {(e) => {
                                setDescription(e.target.value)
                            }
                            }
                            value = { description }
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
                        <label htmlFor = "group_photo">Group Photo:</label>
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
                    <p>{ errorMessage }</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="primary" 
                        onClick = { sendNewGroup }
                        className = { photoLocation && groupName ? "" : "disabled-create-button"}
                    > 
                        { imageUploading ? "Uploading..." : "Create" } 
                    </Button>
                    <Button 
                        variant="secondary" 
                        onClick = {() => {
                            handleClose()
                            clearForm()
                        } }
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </> 
    )
}