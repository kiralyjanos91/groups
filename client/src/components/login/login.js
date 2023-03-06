import React, { useRef , useState } from "react"
import { useNavigate } from "react-router"
import axios from "axios"
import { Container , Row , Col } from "react-bootstrap"
import "./login.css"
import AccessUpdateHook from "../../custom_hooks/accessupdate"

export default function Login(){

    const navigate = useNavigate()
    const { accessUpdate } = AccessUpdateHook()
    const usernameRef = useRef()
    const passwordRef = useRef()
    const [loginError , setLoginError] = useState("")

    const login = (e) => {
        e.preventDefault()
        if (!usernameRef.current.value || !passwordRef.current.value) {
            return setLoginError("Please fill out all required fields")
        }
        axios.post("/sendlogin" , { 
            username: usernameRef.current.value, 
            password: passwordRef.current.value
        })
            .then( data => {
                accessUpdate(data)
                navigate("/groups/1")
            })
            .catch((e) => {
                setLoginError(e.response.data)
                console.log(e)
            })
    }

    return (
        <Container>
            <Row id="login-row">
                <form onSubmit={ login } id="loginform">
                    <h1>
                        Login
                    </h1>
                    <label htmlFor = "username">Username:</label>
                    <input type="text" name = "username" ref={usernameRef} />
                    <label htmlFor = "password">Password:</label>
                    <input type = "password" name = "password" ref={passwordRef} />
                    <p>{loginError}</p>
                    <button 
                        type = "submit" 
                        id = "login-btn"
                        className = "login-reg-btn"
                    >
                        Login
                    </button>
                </form>
            </Row>
        </Container>
    )
}