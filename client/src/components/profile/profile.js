import React , { useState , useEffect , useRef } from "react"
import { Container , Col , Row } from "react-bootstrap"
import Spinner from "react-bootstrap/Spinner"
import { Link } from "react-router-dom"
import axios from "axios"
import { useSelector } from "react-redux"
import EditProfileModal from "./edit_profile_modal/edit_profile_modal"
import "./profile.css"

export default function Profile(){

    const [profileData , setProfileData] = useState()
    const [show , setShow] = useState(false)
    const user = useSelector((state) => state.userData.data)
    const photoRef = useRef()

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
            <li 
                key = { index }
            > 
                <Link 
                    to = {`/group/${group.group_Id}`}
                    className = "primary-link"    
                >
                    { group.name } 
                </Link> 
            </li>
        ) 
    })

    const groupsList = profileData?.groups?.map(( group , index ) => {
        return (
            <li 
                key = { index }
            >
                <Link 
                    to = {`/group/${group.group_Id}`}
                    className = "primary-link"
                >
                    { group.name } 
                </Link>
            </li> 
        )
    })

    const locationInfoArray = []
    if (profileData) {
        Object.values(profileData?.location).slice(0,3).forEach((data) => {
            if (data) {
                locationInfoArray.push(data)
            }
        })
    }
    const locationInfoString = locationInfoArray.join(", ")

    const uploadPhoto = () => {
        // console.log("Photo moto")
        // console.log(photoRef.current.value)
        axios.put("/photoupload" , photoRef.current.value)
            .then(res => console.log(res))
    }

    return (
        <Container>
            { profileData ?
                <>
                    <Row>
                        <Col>
                            <h1>
                                Profile Page
                            </h1>
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <input 
                            name = "photo-file" 
                            type = "file" 
                            ref = { photoRef }
                        />
                        <p onClick = { uploadPhoto }>
                            Upload Photo
                        </p>
                    </Row>
                    <Row>
                        <Col>
                            Username: {profileData.username}
                        </Col>
                        <Col className="edit-profile-col">
                            <div
                                className="edit-button"
                                onClick = { handleShow }
                            >
                                Edit profile data
                                <img 
                                    src = "https://groupsiteimages.s3.amazonaws.com/icons/edit-icon.png" 
                                    alt = "edit-icon" 
                                    className="edit-icon"
                                />
                            </div>
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
                    <Row>
                        <Col>
                            Own Groups:
                            <ul>
                                { ownGroupsList }
                            </ul>
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col>
                            Groups:
                            <ul>
                                { groupsList }
                            </ul>
                        </Col>
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