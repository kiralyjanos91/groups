import React from "react"
import { Container , Col , Row } from "react-bootstrap"
import { useNavigate } from "react-router"
import { useSelector } from "react-redux"
import "./footer.css"

export default function Footer() {

    const accessToken = useSelector((state) => state.accessupdate.token)
    const navigate = useNavigate()
    const logoLink = accessToken ? "/groups/1" : "/"

    return (
        <div className="footer-background">
            <Container className="footer-container">
                <Row>
                    <Col>
                        <h3
                            className = "footer-logo"
                            onClick = { () => navigate(logoLink) }
                        >
                            GROUPYX
                        </h3>
                    </Col>
                    <Col
                        className = "footer-links-col"
                    >
                        { accessToken ?
                            <ul>
                                <li
                                    onClick = { () => navigate("/groups/1") }
                                    >
                                    Groups
                                </li>
                                <li
                                    onClick = { () => navigate("/events") }
                                    >
                                    Events
                                </li>
                                <li
                                    onClick = { () => navigate("/messages") }
                                >
                                    Messages
                                </li>
                                <li
                                    onClick = { () => navigate("/profile") }
                                >
                                    Profile
                                </li>
                            </ul>
                            :
                            <ul>
                                <li
                                    onClick = { () => navigate("/registration") }
                                >
                                    Sign Up
                                </li>
                                <li
                                    onClick = { () => navigate("/login") }
                                >
                                    Sign In
                                </li>
                            </ul>
                        }
                    </Col>
                </Row>
            </Container>
        </div>
    )
}