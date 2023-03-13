import React from "react"
import { Link } from "react-router-dom"
import { Col , Row , Container } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import { useSelector } from "react-redux"
import "./events.css"

export default function Events(){

    const user = useSelector((state) => state.userData.data)
    const eventsList = user.events.map((event , i) => {
        const eventLocation = `${event?.eventLocation.country}, ${event?.eventLocation.state}, ${event?.eventLocation.city}`
        return (
            <Col>
                <Row>
                    <Col 
                        key = { i }
                        className = "events-event-photo-col"
                        style = {{
                            backgroundImage: `url("${event.eventPhoto}")`
                        }}>
                    </Col>
                </Row>
                <Row>
                    <p>
                        {event.eventName}
                    </p>
                </Row>
                <Row>
                    <p>
                        {event.eventDate}
                    </p>
                </Row>
                <Row>
                    <p>
                        {eventLocation}
                    </p>
                </Row>
                <Row>
                    <p>
                    <Button 
                        variant="secondary" 
                        as = { Link }
                        to = { `/group/${event.groupId}` }
                    >
                        Go to Group
                    </Button>
                    </p>
                </Row>

            </Col>
        )
    })
    console.log(user)

    return (
        <Container>
            { eventsList.length > 0 ?
                eventsList
            :
                <h1>You haven't joined any events yet</h1>
            }
        </Container>
    )
}