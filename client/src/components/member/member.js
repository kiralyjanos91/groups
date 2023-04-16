import React , { useState , useEffect } from "react"
import { Container , Col , Row } from "react-bootstrap"
import Spinner from "react-bootstrap/Spinner"
import { useParams } from "react-router"
import { Link } from "react-router-dom"
import axios from "axios"
import "./member.css"
import MessageModal from "./messagemodal"

export default function Member(){
    const [ memberData , setMemberData ] = useState({})
    const { membername } = useParams("membername")

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
    }

    useEffect(()=>{
        axios.post("/memberdata" , { membername })
            .then(response => {
                setMemberData(prevState => response.data)
            })
    }, [])

    console.log(memberData)
    const {
        username,
        own_groups,
        groups,
        gender,
        birth,
        city,
        hobby,
        about,
    } = memberData

    const groupsList = groups?.map(( group , index ) => {
        
        return (
            <Col 
                key = { index }
                className = "group-col"
                as = { Link }
                to = {`/group/${group.group_Id}`}
                >        
                { group.name } 
            </Col> 
        ) 
    })

    const ownGroupsList = own_groups?.map(( group , index ) => {
        
        return (
            <Col 
                key = { index }
                className = "group-col"
                as = { Link }
                to = {`/group/${group.group_Id}`}
            >        
                { group.name } 
            </Col> 
        ) 
    })

    return (
        <>
            <Container
                className = "member-container"
            >
                { Object.keys(memberData).length > 0 ?
                    <>
                        <Row>
                            <Col>
                                <Col
                                    className = "member-profile-photo-col"    
                                    style = {{
                                        backgroundImage: `url(${
                                            memberData?.photos?.small_photo 
                                            || 
                                            "https://groupsiteimages.s3.amazonaws.com/site-photos/no-profile-photo-small.png"
                                        })`
                                    }}
                                    >
                                </Col>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <h1>{ username }</h1>
                            </Col>
                            <Col
                                className = "send-message-col"
                                onClick = {() => handleShow()}
                            >
                                <Col>
                                    <p
                                        className = "send-message-p"
                                    >
                                        Send Message
                                    </p>
                                </Col>
                                <Col>
                                    <img 
                                        src = "https://groupsiteimages.s3.amazonaws.com/icons/message-icon.png" 
                                        alt = "message-icon"
                                    />
                                </Col>
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <p>
                                About: { about || "-"}
                            </p>
                            <p>
                                Date of birth: { birth || "-" }
                            </p>
                            <p>
                                Location: { city || "-" }
                            </p>
                            <p>
                                Hobby: { hobby || "-" }
                            </p>
                            <p>
                                Gender: { gender || "-" }
                            </p>
                        </Row>
                        <Row>
                            <p>
                                Groups: 
                            </p>
                            { groupsList }
                            <p>
                                Own groups: 
                            </p>
                            { ownGroupsList}
                        </Row>
                        <MessageModal 
                            handleClose = { handleClose }
                            show = { show }
                            partnerName = { username }
                            partnerPhoto = { memberData?.photos?.small_photo  }
                        />
                    </>
                    :
                    <Row className="spinner-row">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </Row>
                }
            </Container>
        </>
    )
}

