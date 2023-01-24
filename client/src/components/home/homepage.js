import axios from "axios"
import React , { useState , useEffect } from "react"
import { Container , Row , Col } from "react-bootstrap"
import Spinner from "react-bootstrap/Spinner"
import { useNavigate } from "react-router"
import "./homepage.css"
import AddGroupModal from "./addgroupmodal"

export default function HomePage(){
    const navigate = useNavigate()
    const [refreshGroups , setRefreshGroups] = useState(1)
    const [groups , setGroups] = useState([])
    const [show , setShow] = useState(false)

    const handleShow = () => {
        setShow(true)
    }
    const handleClose = () => {
        setShow(false)
    }
    const groupRefresher = () => {
        setRefreshGroups(prevState => prevState === 1 ? 2 : 1)
    }

    useEffect(() => {
        axios.get("/getgroups")
            .then((groupsData) => {
                setGroups(prev => groupsData.data)
            })
    }, [refreshGroups])

    console.log(groups)

    const groupsListing = groups.map((group , index) => {
        return (
            <Col 
                onClick = { () => navigate(`/groups/${group._id}`) } 
                md="4" 
                key = { index } 
                className="group-listing-col"
            >
                <p>{group.name}</p>
            </Col>
        )
    })

    return (
        <Container>
            <Row>
                <Col>
                    <h1>Groups</h1>
                </Col>
                <Col>
                    <h3 onClick = {handleShow}>Create New Group +</h3>
                </Col>
            </Row>
            { groups.length < 1 ? 
                <Row className="spinner-row">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </Row>
                :
                <Row className="group-listing-row">
                    { groupsListing }
                </Row>
            }
            <AddGroupModal 
                show = { show }
                handleClose = { handleClose }
                needRefresh = { groupRefresher }
            />
        </Container>
    )
}