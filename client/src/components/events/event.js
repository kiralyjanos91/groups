import React from "react"
import { Container , Col , Row } from "react-bootstrap"
import { useParams } from "react-router"

export default function Event() {
    const { id , eventid } = useParams()

    return (
        <Container>
            <Row>
                <Col>
                    <h1>Events Page</h1>
                    <p>{id}</p>
                    <p>{eventid}</p>
                </Col>
            </Row>
        </Container>
    )
}