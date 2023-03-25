import React, { useState , useEffect } from "react"
import { Col, Container, Row } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
import Spinner from "react-bootstrap/Spinner"
import axios from "axios"
import "./home.css"

export default function Home({ accessChecked } ) {

    const navigate = useNavigate()
    const accessToken = useSelector((state) => state.accessupdate.token)
    const [popularGroups , setPopularGroups] = useState([])

    useEffect(() => {
        if (accessToken) {  
            navigate("/groups/1")
        }
    })

    useEffect(() => {
        axios.get("/populargroups")
            .then((res) => setPopularGroups(res.data))
    },[])

    console.log(popularGroups)

    const popularGroupsElements = popularGroups.map((group , i) => {
        return (
            <Col>
                <Row>
                    <Col>
                        <img 
                            src = { group.photo || "https://groupsiteimages.s3.amazonaws.com/group_photos/no_group_photo.png" }
                            alt = "group-img"
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>{ group.name }</p>
                    </Col>
                </Row>
            </Col>
        )
    })

    return (
        <Container
            className = "home-page-container"
        >
            { accessChecked ?
                <Row>
                    <Row>
                        <Col
                            md = "6"
                        >
                            <Row>
                                <h1>    
                                    This is the home page
                                </h1>
                            </Row>
                            <Row>
                                <p>
                                    Lorem ipsum dolor sit ament. Lorem ipsum dolor sit ament.
                                    Lorem ipsum dolor sit ament. Lorem ipsum dolor sit ament.
                                    Lorem ipsum dolor sit ament. Lorem ipsum dolor sit ament.
                                </p>
                            </Row>
                            <Row
                                className = "home-page-main-buttons-row"
                            >
                                <Col>
                                    <Button variant = "primary">
                                        Sign Up
                                    </Button>
                                </Col>
                                <Col>
                                    <Button variant = "secondary">
                                        Sign in
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                        <Col
                            md = "6"
                        >
                            <img 
                                src = ""
                                alt = "main-img"
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Row
                            className = "how-works-row"
                        >
                            <h1>
                                How Meetup works
                            </h1>
                            <p>
                                Meet new people who share your interests through online and in-person events. It’s free to create an account.
                            </p>
                        </Row>
                        <Row
                            className = "bullet-points-row"
                        >
                            <Col
                                md = "4"
                            >
                                <h1>
                                    Join a group
                                </h1>
                                <p>
                                    Do what you love, meet others who love it, find your community. The rest is history!
                                </p>
                            </Col>
                            <Col
                                md = "4"
                            >
                                <h1>
                                    Find an event
                                </h1>
                                <p>
                                    Events are happening on just about any topic you can think of, from online gaming and photography to yoga and hiking.
                                </p>
                            </Col>
                            <Col
                                md = "4"
                            >
                                <h1>
                                    Start a group
                                </h1>
                                <p>
                                    You don’t have to be an expert to gather people together and explore shared interests.
                                </p>
                            </Col>
                        </Row>
                        <Row
                            className = "home-join-button-row"
                        >
                            <Col>
                                <Button 
                                    variant = "primary"
                                    className = "home-join-button"
                                    >
                                    Join GROUPYX
                                </Button>
                            </Col>
                        </Row>
                    </Row>
                    <Row
                        className = "popular-groups-row"
                    >
                        <h1>
                            Most Popular Groups:
                        </h1>
                        { popularGroupsElements }
                    </Row>
                </Row>
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