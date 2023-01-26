import React, { useState , useEffect } from "react"
import { Container , Col , Row } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import Spinner from "react-bootstrap/Spinner"
import { useParams } from "react-router"
import { Link } from "react-router-dom"
import axios from "axios"
import { useSelector } from "react-redux"

export default function Group(){
    const [groupInfo , setGroupInfo] = useState()
    const groupName = groupInfo?.name
    const admin = groupInfo?.admin

    const { id } = useParams()
    const user = useSelector((state) => state.userData.data)
    const notOwnGroup = user.own_groups?.includes(groupName) ? false : true

    console.log(user)

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
        return (
            <li>
                <Link to={`/member/${member.username}`}>
                    { member.username }
                </Link>
            </li>
        )
    })
    return (
        <Container>
            { groupInfo ?
                <>
                    <Row>
                        <Col>
                            <h1>
                                {groupName}
                            </h1>
                        </Col>
                    </Row>
                    { notOwnGroup &&
                        <Row>
                            <Col>
                                <Button variant="primary" onClick={ joinToGroup }>
                                    Join
                                </Button>
                            </Col>
                        </Row>
                    }
                    <Row>
                        <Col>
                            <p>Admin:</p>
                            <p>
                                <Link to = {`/member/${admin}`}>
                                    {admin}
                                </Link>
                            </p>
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
                </>
            :
                <Row className="spinner-row">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </Row>
            }
        </Container>
    )
}