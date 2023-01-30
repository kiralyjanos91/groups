import React , { useRef , useState } from "react"
import { useNavigate } from "react-router"
import { Container , Row , Col } from "react-bootstrap"
import axios from "axios"
import "./registration.css"
import AccessUpdateHook from "../../custom_hooks/accessupdate"

export default function Register(){
    const navigate = useNavigate()
    const { accessUpdate } = AccessUpdateHook()
    const [errorMessage , setErrorMessage] = useState("")
    const usernameRef = useRef()
    const passwordRef = useRef()

    const sendRegistration = (e) => {
        e.preventDefault()
        axios.post("/sendregistration" , {
            username: usernameRef.current.value,
            password: passwordRef.current.value
        })
            .then(data => { 
                accessUpdate(data)
                navigate("/groups/1")
            })
            .catch((e) => 
                setErrorMessage(prev => e.response.data)
            )
    }

    return (
        <Container>
            <Row>
                <Col>
                    <h1>
                        Registration Page
                    </h1>
                </Col>
            </Row>
            <Row>
                <p>{errorMessage}</p>
            </Row>
            <Row id="registration-row">
                <form onSubmit={ sendRegistration } id="regform">
                    <label htmlFor="username">Username:</label>
                    <input type="text" name="username" ref={ usernameRef }/>
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" ref={ passwordRef }/>
                    <button type="submit" id="submit-btn">Register</button>
                </form>
            </Row>
        </Container>
    )
}