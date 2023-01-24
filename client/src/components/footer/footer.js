import React from "react"
import { Container , Col , Row } from "react-bootstrap"
import "./footer.css"

export default function Footer() {
    return (
        <div className="footer-background">
            <Container className="footer-container">
                <Row>
                    <Col>
                        <h3>Place of footer logo</h3>
                    </Col>
                    <Col>
                        <h3>Place of links</h3>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}