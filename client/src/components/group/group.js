import React, { useState , useEffect } from "react"
import { Container , Col , Row } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import { useParams } from "react-router"
import axios from "axios"
import { useSelector } from "react-redux"

export default function Group(){
    const [groupInfo , setGroupInfo] = useState()
    const groupName = groupInfo?.name
    const { id } = useParams()
    const user = useSelector((state) => state.userData.data)

    useEffect(() => {
        axios.post("/groupdata" , { id })
            .then((groupdata) =>setGroupInfo((prevstate) => groupdata.data))
    }, [])

    const joinToGroup = () => {
        axios.post("/joingroup" , { groupName , user })
            .then((response) => {
                console.log(response)
            })
    }

    const membersList = groupInfo?.members?.map((member) => {
        return <li>{ member.username }</li>
    })
    return (
        <Container>
            <Row>
                <Col>
                    <h1>
                        {groupName}
                    </h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button variant="primary" onClick={ joinToGroup }>
                        Join
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <p>Admin:</p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <p>Members:</p>
                    <ul>
                        { membersList }
                    </ul>
                </Col>
            </Row>
            <Row>
                <Col>
                    <p>Events:</p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <p>Location:</p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <p>Chat:</p>
                </Col>
            </Row>
        </Container>
    )
}