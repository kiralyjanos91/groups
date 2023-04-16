import React from "react"
import { Col , Row , Container } from "react-bootstrap"
import { useSelector } from "react-redux"
import EventCard from "../event_card/eventcard"
import "./events.css"

export default function Events(){

    
    const user = useSelector((state) => state.userData.data)
    console.log(user.events)
    const eventsList = user.events.map((event , i) => {
        const eventLocation = `${event?.eventLocation.country}, ${event?.eventLocation.state}, ${event?.eventLocation.city}, ${event?.eventLocation.address || ""}`
        return (
            <EventCard 
                i = { i }
                event = { event }
                eventLocation = { eventLocation }
                photo = { event.eventPhoto }
                date = { event.eventDate }
                time = { event.eventTime }
            />
        )
    })

    return (
        <Container>
            <Row>
                <Col>
                    <h1
                        className = "events-h1"
                    >
                        Events
                    </h1>
                </Col>
            </Row>
            <Row
                className = "events-main-row"
            >
                { eventsList.length > 0 ?
                    eventsList
                    :
                    <h1>You haven't joined any events yet</h1>
                }
            </Row>
        </Container>
    )
}