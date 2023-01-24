import React , { useState , useEffect } from "react"
import { Container , Col , Row } from "react-bootstrap"
import axios from "axios"

export default function Profile(){

    const [profileData , setProfileData] = useState()

    useEffect(() => {
        axios.get("/profiledata")
            .then( memberdata => { setProfileData ( prevState => memberdata.data ) } )
    }, [])

    const groupsList = profileData?.groups.map((group , index) => {
        return <li key = { index }>{ group }</li> 
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
                    Groups:
                    <ul>
                        {groupsList}
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