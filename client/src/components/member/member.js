import React , { useState , useEffect } from "react"
import { Container , Col , Row } from "react-bootstrap"
import Spinner from "react-bootstrap/Spinner"
import { useParams } from "react-router"
import { Link } from "react-router-dom"
import axios from "axios"
import "./member.css"

export default function Member(){
    const [ memberData , setMemberData ] = useState({})
    const { membername } = useParams("membername")

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
        small_photo
    } = memberData

    const groupsList = groups?.map(( group , index ) => {
        
        return (
            <li 
                key = { index }
            >  
                <Link 
                    to = {`/group/${group.group_Id}`}
                    className = "primary-link"    
                >
                    { group.name } 
                </Link>
            </li>
        ) 
    })

    const ownGroupsList = own_groups?.map(( group , index ) => {
        
        return (
            <li 
                key = { index }
            >  
                <Link 
                    to = {`/group/${group.group_Id}`}
                    className = "primary-link"
                >
                    { group.name } 
                </Link>
            </li>
        ) 
    })

    return (
        <Container>
            { Object.keys(memberData).length > 0 ?
                <>
                    <Row>
                        <Col>
                            <Col
                                className = "member-profile-photo-col"    
                                style = {{
                                    backgroundImage: `url(${
                                        small_photo 
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
                            <h1>{username}</h1>
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <p>
                            About: {about}
                        </p>
                        <p>
                            City: {city}
                        </p>
                        <p>
                            Birth: {birth}
                        </p>
                        <p>
                            Gender: {gender}
                        </p>
                        <p>
                            Hobby: {hobby}
                        </p>
                        <p>
                            Own groups: { ownGroupsList }
                        </p>
                        <p>
                            Groups: { groupsList }
                        </p>
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

