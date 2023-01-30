import axios from "axios"
import React , { useState , useEffect } from "react"
import { Container , Row , Col } from "react-bootstrap"
import PagePagination from "../pagination/pagination"
import Spinner from "react-bootstrap/Spinner"
import { useNavigate , useLocation , useParams } from "react-router"
import "./groups.css"
import AddGroupModal from "./addgroupmodal"
import { groupCategoryOptions } from "./groupcategories"

export default function HomePage(){
    const navigate = useNavigate()
    const location = useLocation()

    const { page } = useParams()

    const [groupsCategory , setGroupsCategory] = useState("all")
    const [refreshGroups , setRefreshGroups] = useState(1)
    const [groups , setGroups] = useState([])
    const [show , setShow] = useState(false)

    const handleShow = () => {
        setShow(true)
    }
    const handleClose = () => {
        setShow(false)
    }
    const groupRefresher = () => {
        setRefreshGroups(prevState => prevState === 1 ? 2 : 1)
    }

    useEffect(() => {
        if ( location.pathname === "/groups") {
            navigate("/groups/1")
        }
    })

    useEffect(() => {
        axios.get("/getgroups")
            .then((groupsData) => {
                setGroups(prev => groupsData.data)
            })
    }, [refreshGroups])

    const groupsListing = groups.filter((group)=>{
        if (groupsCategory === "all") {
            return group
        } else {
            return group.category === groupsCategory
        }
        }).slice(
            (parseInt(page) -1) * 15 , (parseInt(page) -1) * 15 + 15
        ).map((group , index) => {
            return (
                <Col 
                    onClick = { () => navigate(`/group/${group._id}`) } 
                    md="4" 
                    key = { index } 
                    className="group-listing-col"
                >
                    <p>{group.name}</p>
                </Col>
            )
        })

    console.log(`Selected Group Category is: ${groupsCategory}`)

    return (
        <Container>
           
            { groups.length < 1 ? 
                <Row className="spinner-row">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </Row>
                :
                <>
                    <Row className="groups-and-newgroup-row">
                        <Col>
                            <h1>Groups</h1>
                        </Col>
                        <Col className="create-new-group-col">
                            <h3 
                                onClick = {handleShow}
                                className = "create-group"
                            >
                                Create New Group +
                            </h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <label htmlFor="filter-by-category">
                                Category:
                            </label>
                            <select
                                id = "filter-by-category"
                                name = "filter-by-category"
                                onChange = {(e) => setGroupsCategory(e.target.value)}
                            >
                                    <option value = "all">All</option>
                                    { groupCategoryOptions }
                                
                            </select>
                        </Col>
                    </Row>
                    <Row className="group-listing-row">
                        { groupsListing }
                    </Row>
                    <PagePagination 
                        root = "/groups"
                        pageCount = { Math.ceil(groups.length / 15) }
                    />
                </>
            }
            <AddGroupModal 
                show = { show }
                handleClose = { handleClose }
                needRefresh = { groupRefresher }
                groupCategoryOptions = { groupCategoryOptions }
            />
        </Container>
    )
}