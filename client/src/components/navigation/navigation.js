import React , { useState } from "react"
import { Container , Nav , Navbar , NavDropdown } from "react-bootstrap"
import { Link } from "react-router-dom"
import LogoutModal from "./logoutmodal"
import { useSelector } from "react-redux"
import "./navigation.css"

export default function Menu(){

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const accessToken = useSelector((state) => state.accessupdate.token)

    return(
        <>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto container-fluid">
                        { accessToken ? 
                            <>
                                <Nav.Link as={ Link } to="/groups/1">Groups</Nav.Link>
                                <Nav.Link as={ Link } to="/events">Events</Nav.Link>
                                <Nav.Link as={ Link } to="/messages">Messages</Nav.Link>
                                <Nav.Link as={ Link } to="/profile">Profile</Nav.Link>
                                <Nav.Link className="ml-auto" onClick = { handleShow }>Logout</Nav.Link>
                            </>
                            :
                            <>
                                <Nav.Link as={ Link } to="/login">Login</Nav.Link>
                                <Nav.Link as={ Link } to="/registration">Registration</Nav.Link>
                            </>
                        }
                    </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <LogoutModal 
                handleClose={ handleClose }
                show = { show }
            />
        </>
  )
}