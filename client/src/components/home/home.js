import React, { useState , useEffect } from "react"
import { Col, Container, Row } from "react-bootstrap"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
import Spinner from "react-bootstrap/Spinner"

export default function Home({ accessChecked } ) {

    const navigate = useNavigate()
    const accessToken = useSelector((state) => state.accessupdate.token)

    useEffect(() => {
        if (accessToken) {  
            navigate("/groups/1")
        }
    })

    return (
        <Container>
            { accessChecked ?
                <Row>
                    <Col>
                        <h1>
                            This is the home page
                        </h1>
                    </Col>
                </Row>
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