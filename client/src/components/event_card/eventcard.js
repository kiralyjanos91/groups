import React from "react"
import { Col , Row } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import { Link } from "react-router-dom"
import "./event_card.css"

export default function EventCard({ 
    i, 
    event, 
    photo, 
    eventLocation, 
    showEvent = "", 
    date,
    time = "",
    isMember = false, 
    memberCount = ""
}) {
    return (
        <Col
            md = "6"
            lg = "4"
            xl = "3"
        >          
            <Col 
                key = { i }
                className = "events-event-main-col h-100"
            >
                <Row
                    className = "event-event-row"
                >
                    <Col 
                        className = "events-event-photo-col"
                        style = {{
                            backgroundImage: `url("${ photo }")`
                        }}
                    >
                        { memberCount !== "" &&
                            <Col
                                className = "event-member-counter-col"
                            >
                                <Col>
                                    <img 
                                        src = "https://groupsiteimages.s3.amazonaws.com/icons/user-icon.png"
                                        alt = "event-member-count-icon"
                                        className = "event-member-count-icon"
                                    />
                                    
                                    { memberCount }
                                </Col>
                            </Col>
                        }
                        { isMember &&
                            <Col
                                className = "joined-badge"
                            >
                                Joined

                            </Col>
                        }
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p
                            className = "event-title"
                            >
                            { event.eventName || event.title }
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col className = "event-list-details-icon-col">
                        <img 
                            src = "https://groupsiteimages.s3.amazonaws.com/site-photos/date-icon.png"
                            alt = "location-icon"
                            className = "event-list-details-icon"
                        />
                    </Col>
                    <Col>
                        <p>
                            { date }
                        </p>
                        <p>
                            { time }
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col
                        className = "event-list-details-seperator"
                    >
                    </Col>
                </Row>
                <Row>
                    <Col className = "event-list-details-icon-col">
                        <img 
                            src = "https://groupsiteimages.s3.amazonaws.com/site-photos/location-icon.png"
                            alt = "date-icon"
                            className = "event-list-details-icon"
                        />
                    </Col>
                    <Col>
                        <p>
                            { eventLocation }
                        </p>
                    </Col>
                </Row>
                <Row
                    className = "h-100"
                >
                    <Col
                        className = "go-to-group-button-col"
                    >
                        { showEvent ?
                            <Button 
                                variant="primary" 
                                className = "go-to-group-button"
                                id = { event.title }
                                onClick = { (e) => showEvent(e) }
                            >
                                View Event 
                            </Button>
                        :
                            <Button 
                                variant="primary" 
                                className = "go-to-group-button"
                                as = { Link }
                                to = { `/group/${event.groupId}` }
                            >
                                Go to Group
                            </Button>
                        }
                    </Col>
                </Row>
            </Col>              
        </Col>
    )
}