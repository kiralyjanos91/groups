import React from "react"
import { Row , Col } from "react-bootstrap"

export default function ChatMessageEl({
    index,
    ownMessageClass,
    chatPhoto,
    showMessageDate,
    message
}) {
    return (
        <Row 
            key = { index } 
            className = {`message-row ${ ownMessageClass }`}
        >
            <Col className="message-col">
                <Row>
                    <img 
                        src = { 
                            chatPhoto 
                            || 
                            "https://groupsiteimages.s3.amazonaws.com/site-photos/no-profile-photo-small.png"
                        } 
                        alt = "chat-user" 
                        className = "chat-img"
                    />
                </Row>
                <Row>
                    { showMessageDate }
                </Row>
                <Row>
                    { message.username }
                </Row>
                <Row>
                    { message.message }
                </Row>
            </Col>
        </Row>
    )
}