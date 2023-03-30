import React from "react"
import { Col , Row } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import EmojiPicker from 'emoji-picker-react';

export default function Chat({
    emojiShow,
    chatWindowRef,
    chatMessageRef,
    sendToChat,
    messages,
    emojiShowChange
}) {

    return (
        <>
            <Row 
                className = "messages-window-row"
                ref = { chatWindowRef }
            >
                { messages }
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