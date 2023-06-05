import React , { useState , useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Container , Nav , Navbar } from "react-bootstrap"
import { Link } from "react-router-dom"
import LogoutModal from "./logoutmodal"
import { useSelector } from "react-redux"
import "./navigation.css"

export default function Menu(){

    const accessToken = useSelector((state) => state.accessupdate.token)
    const location = useLocation()
    const [show, setShow] = useState(false)
    const [activeLink , setActiveLink] = useState("Groups")
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    useEffect(() => {
        if (location.pathname.startsWith("/groups/") && activeLink !== "Groups") {
            setActiveLink("Groups")
        }
        else if ( location.pathname.startsWith("/group/") && activeLink !== "") {
            setActiveLink("")
        }
        else if (location.pathname.startsWith("/member/") && activeLink !== "") {
            setActiveLink("")
        }
        else if (location.pathname === "/profile") {
            setActiveLink("Profile")
        }
        else if (location.pathname === "/events") {
            setActiveLink("Events")
        }
        else if (location.pathname === "/messages") {
            setActiveLink("Messages")
        }
    }, [location.pathname])

    const isHome = location.pathname === "/"
    const homePageClass = isHome ? "home-page-nav" : ""
    const bgColor = isHome ? "transparent" : "dark"

    return(
        <>
            <Navbar bg = { bgColor } variant="dark" expand="lg" collapseOnSelect>
                <Container>
                    <Navbar.Brand 
                        as = { Link }
                        to = { accessToken ? "/groups/1" : "/" }
                        eventKey = "groupyx"
                        onClick = {() => setActiveLink("Groups")}
                    >
                        GROUPYX
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav 
                        className={`me-auto container-fluid ${homePageClass}`} 
                        activeKey = { activeLink } 
                    >
                        { accessToken ? 
                            <>
                                <Nav.Link 
                                    as = { Link } 
                                    to = "/groups/1"
                                    eventKey = "Groups"
                                    onClick = {() => setActiveLink("Groups")}
                                >
                                    Groups
                                </Nav.Link>
                                <Nav.Link 
                                    as = { Link } 
                                    to = "/events"
                                    eventKey = "Events"
                                    onClick = {() => setActiveLink("Events")}
                                >
                                    Events
                                </Nav.Link>
                                <Nav.Link 
                                    as = { Link } 
                                    to = "/messages"
                                    eventKey = "Messages"
                                    onClick = {() => setActiveLink("Messages")}
                                >
                                    Messages
                                </Nav.Link>
                                <Nav.Link 
                                    as = { Link } 
                                    to = "/profile"
                                    eventKey = "Profile"
                                    onClick = {() => setActiveLink("Profile")}
                                >
                                    Profile
                                </Nav.Link>
                                <Nav.Link 
                                    className="ml-auto" 
                                    onClick = { handleShow }
                                    eventKey = "Logout"
                                >
                                    Logout
                                </Nav.Link>
                            </>
                            :
                            <>
                                <Nav.Link 
                                    as = { Link } 
                                    to = "/login"
                                    eventKey = "login"
                                    onClick = {() => setActiveLink("login")}
                                >
                                    Log in
                                </Nav.Link>
                                <Nav.Link 
                                    as = { Link } 
                                    to = "/registration"
                                    eventKey = "registration"
                                    onClick = {() => setActiveLink("registration")}
                                >
                                    Sign up
                                </Nav.Link>
                            </>
                        }
                    </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <LogoutModal 
                handleClose = { handleClose }
                show = { show }
                setActive = { setActiveLink }
            />
        </>
    )
}