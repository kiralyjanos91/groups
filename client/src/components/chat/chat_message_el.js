import React from "react"
import { Link } from "react-router-dom"
import { Row , Col } from "react-bootstrap"
import "./chat_message_el.css"

export default function ChatMessageEl({
    index,
    ownMessageClass,
    chatPhoto,
    showMessageDate,
    message,
    username = "",
    modalClass = "",
}) {

    return (
        <Row>
            <Col
                xs = {{ order : ownMessageClass ? 1 : 2 }}
            >
                <Row 
                    key = { index } 
                    className = {`message-row ${ ownMessageClass }`}
                >
                    <Col className = {`message-col ${modalClass}`}>
                        <Row>        
                            <Col
                                className = "chat-username-col"
                                as = { Link }
                                to = { ownMessageClass ? `/profile`
                                :
                                `/member/${message.username || username}` }
                            >
                                { message.username || username }
                            </Col>
                        </Row>
                        <Row
                            className = "chat-message-content-row"
                        >
                            <Col>
                                { message.message }
                            </Col>
                        </Row>
                        <Row
                            className = "chat-message-date-row"
                        >
                            <Col>
                                { showMessageDate }
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
            <Col
                className = "message-prof-img-col"
                xs = {{ order : ownMessageClass ? 2 : 1 }}
                as = { Link }
                to = { ownMessageClass ? `/profile`
                :
                `/member/${message.username || username}` }
            >
                <img 
                    src = { 
                        chatPhoto 
                        || 
                        "https://groupsiteimages.s3.amazonaws.com/site-photos/no-profile-photo-small.png"
                    } 
                    alt = "chat-user" 
                    className = "chat-img"
                />  
            </Col>
        </Row>
    )
}