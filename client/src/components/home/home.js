import React, { useState , useEffect } from "react"
import { Col, Container, Row } from "react-bootstrap"
import { Link } from "react-router-dom"
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
                    <Col
                        className = "group-photo-member-count-col"
                    >
                        <Col
                            className = "popular-group-col"
                            style = {{
                                backgroundImage: `url(${group.photo || "https://groupsiteimages.s3.amazonaws.com/group_photos/no_group_photo.png"})`
                            }}
                            >
                        </Col>
                        <Col
                            className = "member-count-col"
                        >            
                            <img 
                                src = "https://groupsiteimages.s3.amazonaws.com/icons/user-icon.png"
                                alt = "member-icon"
                            />              
                            { group.membersCount + 1 }                        
                        </Col>
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
                            className = "home-main-text-col"
                        >
                            <Row>
                                <h1
                                    className = "home-title"
                                >    
                                    Where friendships are born from shared interests
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
                                    <Button 
                                        as = { Link }
                                        to = "/registration"
                                        variant = "primary"
                                    >
                                        Sign Up
                                    </Button>
                                </Col>
                                <Col>
                                    <Button 
                                        as = { Link }
                                        to = "/login"
                                        variant = "secondary"
                                    >
                                        Sign in
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                        <Col
                            md = "6"
                            className = "home-img-col"
                        >
                            <img 
                                src = "https://groupsiteimages.s3.amazonaws.com/site-photos/home-img.png"
                                alt = "main-img"
                                className = "home-img"
                            />
                        </Col>
                    </Row>
                    <Row
                        className = "how-works-main-row"
                    >
                        <Row
                            className = "how-works-row"
                        >
                            <h1>
                                How groupyx works
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
                                <img 
                                    className = "bullet-point-img"
                                    src = "https://groupsiteimages.s3.amazonaws.com/site-photos/bullet1.png" 
                                    alt = "bullet-1" 
                                />
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
                                <img 
                                    className = "bullet-point-img"
                                    src = "https://groupsiteimages.s3.amazonaws.com/site-photos/bullet02.png" 
                                    alt = "bullet-2" 
                                />
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
                                <img 
                                    className = "bullet-point-img"
                                    src = "https://groupsiteimages.s3.amazonaws.com/site-photos/bullet3.png" 
                                    alt = "bullet-3" 
                                />
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
                                    Join Now
                                </Button>
                            </Col>
                        </Row>
                    </Row>
                    { popularGroups.length > 0 &&
                        <Row
                        className = "popular-groups-row"
                        >
                            <h1>
                                Most Popular Groups:
                            </h1>
                            { popularGroupsElements }
                        </Row>
                    }
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