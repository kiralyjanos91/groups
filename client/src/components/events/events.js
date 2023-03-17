import React from "react"
import { Link } from "react-router-dom"
import { Col , Row , Container } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import { useSelector } from "react-redux"
import "./events.css"

export default function Events(){

    const user = useSelector((state) => state.userData.data)
    const eventsList = user.events.map((event , i) => {
        const eventLocation = `${event?.eventLocation.country}, ${event?.eventLocation.state}, ${event?.eventLocation.city}, ${event?.eventLocation.address || ""}`
        return (
            <Col
                md = "3"
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
                                backgroundImage: `url("${event.eventPhoto}")`
                            }}>
                        </Col>
                    </Row>
                    <Row>
                        <p
                            className = "event-title"
                        >
                            {event.eventName}
                        </p>
                    </Row>
                    <Row>
                        <Col className = "event-list-details-icon-col">
                            <img 
                                src = "https://groupsiteimages.s3.amazonaws.com/site-photos/location-icon.png"
                                alt = "location-icon"
                                className = "event-list-details-icon"
                            />
                        </Col>
                        <Col>
                            <p>
                                {event.eventDate}
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
                                src = "https://groupsiteimages.s3.amazonaws.com/site-photos/date-icon.png"
                                alt = "date-icon"
                                className = "event-list-details-icon"
                            />
                        </Col>
                        <Col>
                            <p>
                                {eventLocation}
                            </p>
                        </Col>
                    </Row>
                    <Row
                        className = "h-100"
                    >
                        <Col
                            className = "go-to-group-button-col"
                        >
                            <Button 
                                variant="primary" 
                                className = "go-to-group-button"
                                as = { Link }
                                to = { `/group/${event.groupId}` }
                                >
                                Go to Group
                            </Button>
                        </Col>
                    </Row>
                </Col>              
            </Col>
        )
    })
    console.log(user)

    return (
        <Container>
            <Row>
                { eventsList.length > 0 ?
                    eventsList
                    :
                    <h1>You haven't joined any events yet</h1>
                }
            </Row>
        </Container>
    )
}