import React , { useRef , useState , useEffect } from "react"
import { useNavigate } from "react-router"
import { Container , Row , Col } from "react-bootstrap"
import axios from "axios"
import "./registration.css"
import AccessUpdateHook from "../../custom_hooks/accessupdate"

export default function Register(){
    const navigate = useNavigate()
    const { accessUpdate } = AccessUpdateHook()
    const [errorMessage , setErrorMessage] = useState("")
    const [password , setPassword] = useState("")
    const [passwordIsFine , setPasswordIsFine] = useState(false)
    const [passwordMessage , setPasswordMessage] = useState("")
    const usernameRef = useRef()

    const sendRegistration = (e) => {
        e.preventDefault()
        if (usernameRef.current.value && passwordIsFine) {
            axios.post("/sendregistration" , {
                username: usernameRef.current.value,
                password: password
            })
            .then(data => { 
                accessUpdate(data)
                navigate("/groups/1")
            })
            .catch((e) => 
            setErrorMessage(prev => e.response.data)
            )
        }
    }

    useEffect(() => {
        if (password) {
            if (password.length < 6) {
                setPasswordMessage("Password is too short")
                setPasswordIsFine(false)
            }
            else if (password.length > 14) {
                setPasswordMessage("password is too long")
                setPasswordIsFine(false)
            } 
            else {
                setPasswordMessage("")
                setPasswordIsFine(true)
            }
        }
    }, [password])

    console.log(password)

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
                    <input type = "text" name = "username" ref = { usernameRef }/>
                    <label htmlFor = "password">Password:</label>
                    <input 
                        type = "password" 
                        name = "password" 
                        onChange = {(e) => setPassword(e.target.value)}
                        value = { password }
                    />
                    <p>{ passwordMessage }</p>
                    <button type="submit" id="submit-btn">Register</button>
                </form>
            </Row>
        </Container>
    )
}