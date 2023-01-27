import React , { useState , useEffect } from "react"
import { Container , Col , Row } from "react-bootstrap"
import { useParams } from "react-router"
import { Link } from "react-router-dom"
import axios from "axios"

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
        about
    } = memberData

    const groupsList = groups?.map(( group , index ) => {
        
        return (
            <li 
                key = { index }
            >  
                <Link 
                    to = {`/groups/${group.group_Id}`}
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
                    to = {`/groups/${group.group_Id}`}
                    className = "primary-link"
                >
                    { group.name } 
                </Link>
            </li>
        ) 
    })

    return (
        <Container>
            <Row>
                <Col>
                    <h1>{username}</h1>
                </Col>
            </Row>
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
        </Container>
    )
}

