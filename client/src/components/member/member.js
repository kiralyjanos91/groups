import React , { useState , useEffect } from "react"
import { Container , Col , Row } from "react-bootstrap"
import { useParams } from "react-router"
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
                    Own groups: {own_groups}
                </p>
                <p>
                    Groups: {groups}
                </p>
            </Row>
        </Container>
    )
}

// own_groups:
// groups:
// gender:
// birth:
// city:
// hobby:
// about: