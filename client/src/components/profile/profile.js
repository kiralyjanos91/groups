import React , { useState , useEffect } from "react"
import { Container , Col , Row } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import Spinner from "react-bootstrap/Spinner"
import { Link } from "react-router-dom"
import axios from "axios"
import { useSelector } from "react-redux"
import EditProfileModal from "./edit_profile_modal/edit_profile_modal"
import UserDataUpdateHook from "../../custom_hooks/userdataupdate"
import "./profile.css"

export default function Profile(){

    const [profileData , setProfileData] = useState()
    const [changePhoto , setChangePhoto] = useState(false)
    const [show , setShow] = useState(false)
    const user = useSelector((state) => state.userData.data)
    const [selectedFile , setSelectedFile] = useState(null)
    const { userDataUpdate } = UserDataUpdateHook()


    const handleShow = () => {
        setShow(true)
    }

    const handleClose = () => {
        setShow(false)
    }

    useEffect(() => {
        axios.get("/profiledata")
            .then( memberdata => { setProfileData ( prevState => memberdata.data ) } )
    }, [user])

    const ownGroupsList = profileData?.own_groups?.map(( group , index ) => {
        return (
            <Col 
                key = { index }
                className = "group-col"
                as = { Link }
                to = {`/group/${group.group_Id}`}
            > 
                { group.name } 
            </Col>
        ) 
    })

    const groupsList = profileData?.groups?.map(( group , index ) => {
        return (
            <Col 
                key = { index }
                className = "group-col"
                as = { Link }
                to = {`/group/${group.group_Id}`}
            >        
                { group.name } 
            </Col> 
        )
    })

    const locationInfoArray = []
    if (profileData?.location) {
        Object.values(profileData?.location).slice(0,3).forEach((data) => {
            if (data) {
                locationInfoArray.push(data)
            }
        })
    }
    const locationInfoString = locationInfoArray.join(", ")

    const uploadPhoto = () => {
        const formData = new FormData()
        formData.append("image" , selectedFile , selectedFile.name)
        formData.append("username" , profileData?.username)
        formData.append("ownGroups" , JSON.stringify(profileData?.own_groups))
        formData.append("groups" , JSON.stringify(profileData?.groups))

        axios.put("/photoupload" , formData)
            .then(() => userDataUpdate())
            .then(() => setChangePhoto(false))
    }

    return (
        <Container
            className = "profile-container"
        >
            { profileData ?
                <>
                    <Row>
                        <Col>
                            <Col 
                                className = "profile-img-col"
                                style = {{
                                    backgroundImage: `url(${ profileData?.photos?.small_photo || "https://groupsiteimages.s3.amazonaws.com/site-photos/no-profile-photo-small.png" })`
                                }}
                            >
                            </Col>
                        </Col>
                        <Col className="edit-profile-col">
                            <div
                                className="edit-button"
                                onClick = { handleShow }
                            >
                                Edit
                                <img 
                                    src = "https://groupsiteimages.s3.amazonaws.com/icons/edit-icon.png" 
                                    alt = "edit-icon" 
                                    className="edit-icon"
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row 
                        className = "change-photo-row"
                    >
                        { changePhoto ?
                            <Col
                                className = "change-photo-col"
                            >
                                <Row
                                    className = "photo-upload-input-row"
                                >
                                    <input 
                                        name = "photo-file" 
                                        type = "file" 
                                        onChange = { e => setSelectedFile(e.target.files[0])}
                                    />
                                </Row>
                                <Row
                                    className = "upload-or-cancel-row"
                                >
                                    <Col
                                        className = "upload-or-cancel-buttons-col"
                                    >
                                        <Button 
                                            variant = "primary"
                                            onClick = { uploadPhoto }
                                            >
                                            Upload Photo
                                        </Button>
                                    </Col>
                                    <Col
                                        className = "upload-or-cancel-buttons-col"
                                    >
                                        <Button 
                                            variant = "secondary"
                                            onClick={() => setChangePhoto(false)}
                                            >
                                            Cancel                                    
                                        </Button>
                                    </Col>
                                </Row>
                             </Col>
                        :
                            <Col
                                className = "change-photo-text-col"
                            >
                                <p
                                    onClick={() => setChangePhoto(true)}
                                    className = "change-photo-text"
                                    > 
                                    Change Photo 
                                </p>
                            </Col>

                        }
                    </Row>
                    <Row
                        className = "about-section-row"
                    >
                        <Row>
                            <Col>
                                Username: { profileData.username }
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <p>Date of birth:</p>
                                <p>
                                    { profileData.birth }
                                </p>
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col>
                                <p>
                                    Location:
                                </p>
                                <p>
                                    { locationInfoString }
                                </p>
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col>
                                <p>
                                    Gender:
                                </p>
                                <p>
                                    { profileData.gender }
                                </p>
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col>
                                <p>
                                    Hobby:
                                </p>
                                <p>
                                    { profileData.hobby }
                                </p>
                            </Col>
                        </Row>
                        <hr />
                    </Row>
                    <Row>
                        <p>
                            Own groups:         
                        </p>
                        { ownGroupsList }                       
                    </Row>
                    <hr />
                    <Row>
                        <p>
                            Groups:         
                        </p>
                        { groupsList }                       
                    </Row>
                    <EditProfileModal 
                        profileData = { profileData }
                        show = { show }
                        handleClose = { handleClose } 
                    />
                </>
            :   
                <Row className="spinner-row">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </Row>
            }
        </Container>
    )
}