import React , { useState , useEffect } from "react"
import { Container , Col , Row } from "react-bootstrap"
import Spinner from "react-bootstrap/Spinner"
import { Link } from "react-router-dom"
import axios from "axios"
import { useSelector } from "react-redux"
import EditProfileModal from "./edit_profile_modal/edit_profile_modal"

export default function Profile(){

    const [profileData , setProfileData] = useState()
    const [show , setShow] = useState(false)
    const user = useSelector((state) => state.userData.data)

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

    return (
        <Container>
            { profileData ?
                <>
                    <Row>
                        <Col>
                            <p
                                className="edit-button"
                                onClick = { handleShow }
                            >
                                Edit Profile Data
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h1>
                                Profile Page
                            </h1>
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col>
                            Username: {profileData.username}
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
                    <hr />
                    <Row>
                        <Col>
                            <p>Date of birth:</p>
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col>
                            <p>
                                City:
                            </p>
                            <p>
                                {profileData.city}
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
                                {profileData.gender}
                            </p>
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col>
                            <p>
                                Hobby:
                            </p>
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