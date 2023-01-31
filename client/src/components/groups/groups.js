import axios from "axios"
import React , { useState , useEffect } from "react"
import { Container , Row , Col } from "react-bootstrap"
import PagePagination from "../pagination/pagination"
import Spinner from "react-bootstrap/Spinner"
import { useNavigate , useLocation , useParams } from "react-router"
import "./groups.css"
import AddGroupModal from "./addgroupmodal"
import { groupCategoryOptions } from "./groupcategories"
import { useSelector } from "react-redux"

export default function HomePage(){
    const user = useSelector((state) => state.userData.data)
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

    const categoryChange = (e) => {
        setGroupsCategory(prev => e.target.value)
        if ( location !== "/groups/1") {
            navigate("/groups/1")
        }
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
    }, [ user ])

    const groupsList = groups.filter((group)=>{
        if (groupsCategory === "all") {
            return group
        } else {
            return group.category === groupsCategory
        }
        })

    const groupsListing = groupsList.slice(
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

        const notEmptyGroupCategories = groups.reduce((accumulator , current) => {
            return (
                accumulator.includes(current.category) ? 
                    accumulator 
                : 
                    [...accumulator , current.category]
            )
        }, [])

        const groupFilterOptions = notEmptyGroupCategories.map(( category , index ) => {
            return (
                <option 
                    key = { index } 
                    value = { category }
                >
                    { category }
                </option>
            )
        })

        console.log(notEmptyGroupCategories)

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
                                onChange = {(e) => categoryChange(e)}
                            >
                                    <option value = "all">All</option>
                                    { groupFilterOptions }
                                
                            </select>
                        </Col>
                    </Row>
                    <Row className="group-listing-row">
                        { groupsListing }
                    </Row>
                    { groupsList.length > 15 &&
                        <Row className="groups-pagination-row">
                            <PagePagination 
                                root = "/groups"
                                pageCount = { 
                                    Math.ceil(groupsList.length / 15) 
                                }
                            />
                        </Row>
                    }
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