import React, { useState , useEffect } from "react"
import { Container , Col , Row } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import Spinner from "react-bootstrap/Spinner"
import { useParams } from "react-router"
import { Link } from "react-router-dom"
import axios from "axios"
import { useSelector } from "react-redux"
import UserDataUpdateHook from "../../custom_hooks/userdataupdate"

export default function Group(){
    const [groupInfo , setGroupInfo] = useState()
    const groupName = groupInfo?.name
    const admin = groupInfo?.admin

    const { userDataUpdate } = UserDataUpdateHook()

    const { id } = useParams()
    const user = useSelector((state) => state.userData.data)
    const notOwnGroup = user.own_groups?.find( ( group ) => group.name === groupName ) ? false : true
    const joined = user.groups?.find( ( group ) => group.name === groupName ) ? true : false

    useEffect(() => {
        axios.post("/groupdata" , { id })
            .then((groupdata) =>setGroupInfo((prevstate) => groupdata.data))
    }, [user])

    const joinToGroup = () => {
        axios.post("/joingroup" , { groupName , user , id })
            .then((response) => {
                console.log(response)
                userDataUpdate()
            })
    }

    const membersList = groupInfo?.members?.map((member , index) => {
        if (member.username !== admin) {
            return (
                <li key = { index }>
                    <Link 
                        to={`/member/${member.username}`}
                        className="primary-link"
                        >
                        { member.username }
                    </Link>
                </li>
            )
        }   
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
                                { joined ?
                                    <Button variant="secondary">
                                        Leave
                                    </Button>
                                :
                                    <Button variant="primary" onClick={ joinToGroup }>
                                        Join
                                    </Button>
                                }
                            </Col>
                        </Row>
                    }
                    <Row>
                        <Col>
                            <p>Admin:</p>
                            <p>
                                <Link 
                                    to = {`/member/${admin}`}
                                    className="primary-link"
                                >
                                    {admin}
                                </Link>
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p>Category:</p>
                            <p>
                                <Link 
                                    to = {`/member/${admin}`}
                                    className="primary-link"
                                >
                                    {groupInfo?.category}
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