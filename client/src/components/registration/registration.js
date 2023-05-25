import React , { useRef , useState , useEffect } from "react"
import { useNavigate } from "react-router"
import { Container , Row } from "react-bootstrap"
import { axiosConf } from "../../config"
import "./registration.css"
import AccessUpdateHook from "../../custom_hooks/accessupdate"

export default function Register(){
    const navigate = useNavigate()
    const { accessUpdate } = AccessUpdateHook()
    const [errorMessage , setErrorMessage] = useState("")
    const [password , setPassword] = useState("")
    const [passwordCheck , setPasswordCheck] = useState("")
    const [passwordIsFine , setPasswordIsFine] = useState(false)
    const usernameRef = useRef()

    const sendRegistration = (e) => {
        e.preventDefault()
        if (!usernameRef.current.value || !password) {
            return setErrorMessage("Please fill out all required fields")
        }
        if (password !== passwordCheck)
            {
                return setErrorMessage("Passwords are not equal")
            }
        if (usernameRef.current.value && passwordIsFine) {
            axiosConf.post("/sendregistration" , {
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
                setErrorMessage("Password is too short")
                setPasswordIsFine(false)
            }
            else if (password.length > 14) {
                setErrorMessage("password is too long")
                setPasswordIsFine(false)
            } 
            else {
                setErrorMessage("")
                setPasswordIsFine(true)
            }
        }
    }, [password,passwordCheck])

    return (
        <Container>
            <Row id="registration-row">
                <form onSubmit={ sendRegistration } id="regform">
                    <h1>
                        Sign up
                    </h1>
                    <label htmlFor="username">Username:</label>
                    <input type = "text" name = "username" ref = { usernameRef }/>
                    <label htmlFor = "password">Password:</label>
                    <input 
                        type = "password" 
                        name = "password" 
                        onChange = {(e) => setPassword(e.target.value)}
                        value = { password }
                    />
                    <label htmlFor = "passrowd-check">Password again:</label>
                    <input 
                        type = "password" 
                        name = "password-check" 
                        onChange = {(e) => setPasswordCheck(e.target.value)}
                        value = { passwordCheck }
                    />
                    <p>{ errorMessage }</p>
                    <button 
                        type = "submit" 
                        id = "registration-btn"
                        className = "login-reg-btn"
                    >
                        Sign up
                    </button>
                </form>
            </Row>
        </Container>
    )
}