import React , { useState , useEffect } from "react"
import { Container , Col , Row } from "react-bootstrap"
import { Link } from "react-router-dom"
import axios from "axios"

export default function Profile(){

    const [profileData , setProfileData] = useState()

    useEffect(() => {
        axios.get("/profiledata")
            .then( memberdata => { setProfileData ( prevState => memberdata.data ) } )
    }, [])

    const ownGroupsList = profileData?.own_groups?.map(( group , index ) => {
        return (
            <li 
                key = { index }
            > 
                <Link 
                    to = {`/groups/${group.group_Id}`}
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
                    to = {`/groups/${group.group_Id}`}
                    className = "primary-link"
                >
                    { group.name } 
                </Link>
            </li> 
        )
    })

    return (
        <Container>
            <Row>
                <Col>
                    <h1>
                        Profile Page
                    </h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    Username: {profileData?.username}
                </Col>
            </Row>
            <Row>
                <Col>
                    Own Groups:
                    <ul>
                        { ownGroupsList }
                    </ul>
                </Col>
            </Row>
            <Row>
                <Col>
                    Groups:
                    <ul>
                        { groupsList }
                    </ul>
                </Col>
            </Row>
            <Row>
                <Col>
                    <p>Date of birth:</p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <p>
                        City:
                    </p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <p>
                        Gender:
                    </p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <p>
                        Hobby:
                    </p>
                </Col>
            </Row>
        </Container>
    )
}