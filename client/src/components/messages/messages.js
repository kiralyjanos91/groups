import React , { useState , useEffect } from "react"
import { Container , Col , Row } from "react-bootstrap"
import { useSelector } from "react-redux"
import axios from "axios"

export default function Messages() {
    const [ currentPartner , setCurrentPartner ] = useState("")
    const [ allMessages , setAllMessages ] = useState([])
    const user = useSelector((state) => state.userData.data)

    useEffect(() => {
        if (user.username){
            axios.post("/getallmessages" , { username: user.username})
            .then(res => setAllMessages(res.data))
        }
    }, [user])

    console.log(allMessages)

    return (
        <Container>
            <Row>
                <Col>
                    <h1>Messages Page</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    Partners
                </Col>
                <Col>
                    Messages
                </Col>
            </Row>
        </Container>
    )
}