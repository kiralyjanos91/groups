import React from "react"
import { Col , Row } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import EmojiPicker from 'emoji-picker-react';
import "./chat.css"

export default function Chat({
    emojiShow,
    chatWindowRef,
    chatMessageRef,
    sendToChat,
    messages,
    emojiShowChange,
    plusClass = ""
}) {

    const enterHandler = (e) => {
        e.key === "Enter" && sendToChat()
    }

    return (
        <>
            <Row 
                className = {`messages-window-row ${plusClass}`}
                ref = { chatWindowRef }
            >
                { ( messages && messages?.length > 0 ) || plusClass !== "group-chat-window" ? 
                    messages 
                : 
                    <Col
                        className = "start-conversation-col"
                    >
                        Start the conversation
                    </Col> }
            </Row>
            <Row className = {`emoji-picker-row ${emojiShow ? "" : "emojihide"}`}>
                <EmojiPicker 
                    onEmojiClick = {(emoji) => 
                        chatMessageRef.current.value += emoji.emoji 
                    }
                    theme = "dark"
                    emojiStyle = "google"
                />
            </Row>
            <Row className = "chat-input-row">
                <Col className = "chat-input-col">
                    <input 
                        name="chat-input"
                        ref = { chatMessageRef }
                        className = "chat-input"
                        onKeyDown = {(e) => enterHandler(e)}
                    />
                </Col>
                <Col 
                    className = "emoji-show-button"
                    onClick = { emojiShowChange }
                >
                    <img 
                        src="https://groupsiteimages.s3.amazonaws.com/icons/emoji-open-icon.png" 
                        alt="emoji-open-icon"
                    />
                </Col>
                <Col className = "chat-send-button-col">
                    <Button onClick = { sendToChat }>
                        <img 
                            src = "https://groupsiteimages.s3.amazonaws.com/icons/send-icon.png" 
                            alt = "send-button-icon"
                            className = "send-button-icon"
                        />
                    </Button>
                </Col>
            </Row>
        </>
    )
}