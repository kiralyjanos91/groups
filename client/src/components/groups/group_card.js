import React from "react"
import { Col , Row } from "react-bootstrap"
import { useNavigate } from "react-router"

export default function GroupCard({ index , group , groupStatus , user }) {

    const navigate = useNavigate()

    return (
        <Col 
            md="4" 
            key = { index } 
            className="group-listing-col"
        >
            <Col
                className="group-listing-inner-col" 
                onClick = { () => navigate(`/group/${group._id}`) } 
                style = {
                    {
                        backgroundImage:`url(${ group.photo || "https://groupsiteimages.s3.amazonaws.com/group_photos/no_group_photo.png" })`
                    }
                }
            >   
                { groupStatus === "All" &&
                    <div className = "groups-status-badge">
                        { user.groups?.some(oneGroup => oneGroup.name === group.name) ? 
                            <p>Joined</p> 
                            : 
                            null
                        }
                        { user.own_groups?.some(oneGroup => oneGroup.name === group.name) ?
                            <p>Own group</p> 
                            : 
                            null
                        }
                    </div>
                }
                <Row className = "group-name-row">
                    <Col>
                            { group.name }
                    </Col>
                    <Col
                        className = "groups-member-count-col"
                    >
                        <Col>
                            <img 
                                src = "https://groupsiteimages.s3.amazonaws.com/icons/user-icon.png"
                                alt = "member-count-icon"
                            />
                            { group.members.length + 1 }
                        </Col>
                    </Col>
                </Row>
                    
            </Col>
        </Col>
    )
}