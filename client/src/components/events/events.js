import React from "react"
import { Row , Container } from "react-bootstrap"
import { useSelector } from "react-redux"
import EventCard from "../event_card/eventcard"

export default function Events(){

    const user = useSelector((state) => state.userData.data)
    const eventsList = user.events.map((event , i) => {
        const eventLocation = `${event?.eventLocation.country}, ${event?.eventLocation.state}, ${event?.eventLocation.city}, ${event?.eventLocation.address || ""}`
        return (
            <EventCard 
                i = { i }
                event = { event }
                eventLocation = { eventLocation }
                photo = { event.eventPhoto }
                date = { event.eventDate }
            />
        )
    })

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