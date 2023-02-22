import React , { useState } from "react"
import { Container , Col , Row } from "react-bootstrap"

export default function Messages() {
    const [ currentPartner , setCurrentPartner ] = useState("")


    return (
        <Container>
            <Row>
                <Col>
                    <h1>Messages Page</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    Partners
                </Col>
                <Col>
                    Messages
                </Col>
            </Row>
        </Container>
    )
}