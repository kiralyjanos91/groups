import axios from "axios"
import React , { useState , useEffect } from "react"
import { Container , Row , Col } from "react-bootstrap"
import PagePagination from "../pagination/pagination"
import Spinner from "react-bootstrap/Spinner"
import { useNavigate , useLocation , useParams } from "react-router"
import "./groups.css"
import AddGroupModal from "./addgroupmodal"
import { groupCategoryOptions } from "./groupcategories"
import { changeCategory } from "../../redux_slices/categoryslice"
import { useSelector , useDispatch } from "react-redux"
import GroupCard from "./group_card"

export default function HomePage(){
    const user = useSelector((state) => state.userData.data)
    const selectedCategory = useSelector( ( state ) => state.category.name )
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const { page } = useParams()
    const [groups , setGroups] = useState([])
    const [show , setShow] = useState(false)
    const [groupStatus , setGroupStatus] = useState("All")
    const [ sortBy , setSortBy ] = useState("newest")
    
    const handleShow = () => {
        setShow(true)
    }

    const handleClose = () => {
        setShow(false)
    }

    const groupStatusTypes = ["All"]

    if (user.groups.length > 0) {
        groupStatusTypes.push("Joined")
    }
    if (user.own_groups.length > 0) {
        groupStatusTypes.push("Own")
    }

    const groupStatusSelectors = groupStatusTypes.map((status , index) => {
        const selected = status === groupStatus ? "selected-selector" : ""
        return (
            <Col
                onClick={() => {
                    setGroupStatus(status)
                    navigate("/groups/1")
                    dispatch(changeCategory("all"))
                }}
                className = {`group-status-selector-col ${ selected }`}
                key = { index }
            >
                <p>{status}</p>
            </Col>
        )
    })

    const categoryChange = (e) => {
        dispatch(changeCategory(e.target.value))
        if ( location !== "/groups/1") {
            navigate("/groups/1")
        }
    }

    const sortByChange = (e) => {
        setSortBy(e.target.value)
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

    const groupsForSort = [...groups]

    if (sortBy !== "Newest"){
        sortBy === "Oldest" ?
            void(0)
            :
            groupsForSort.sort((a , b) => {
                if (sortBy === "Name A-Z") {
                    if (a.name > b.name) {
                        return 1
                    }
                    if (a.name < b.name) {
                        return -1
                    }           
                    return 0
                }
                else if (sortBy === "Name Z-A"){
                    if (a.name < b.name) {
                        return 1
                    }
                    if (a.name > b.name) {
                        return -1
                    }
                        return 0
                }
                else if (sortBy === "Least Members"){
                    if (a.members.length > b.members.length) {
                        return 1
                    }
                    if (a.members.length < b.members.length) {
                        return -1
                    }
                        return 0
                }
                else {
                    if (a.members.length < b.members.length) {
                        return 1
                    }
                    if (a.members.length > b.members.length) {
                        return -1
                    }
                        return 0
                }
        })
    }

    const isReversedGroups = sortBy === "Oldest" ? [...groups].reverse() : groupsForSort

    const groupsList = isReversedGroups.filter((group) => {
        if (selectedCategory === "all") {
            return group
        } else {
            return group.category === selectedCategory
        }
    })

    const statusFilteredList = groupsList.filter((group) => {
        if (groupStatus === "All") {
            return group
        }
        else if (groupStatus === "Joined")
            return user.groups.find((usersGroup) => usersGroup.name === group.name)
        else {
            return user.own_groups.find((usersOwnGroup) => usersOwnGroup.name === group.name)
        }

    })

    const groupsListing = statusFilteredList.slice(
            (parseInt(page) -1) * 15 , (parseInt(page) -1) * 15 + 15
        ).map((group , index) => {
            return (
                <GroupCard 
                    index = { index }
                    group = { group }
                    groupStatus = { groupStatus }
                    user = { user }
                />
            )
        })

        const notEmptyGroupCategories = groups.filter((group,index) => {
            if (groupStatus === "All") {
                return group
            }
            else if (groupStatus === "Joined")
                return user.groups.find((usersGroup) => usersGroup.name === group.name)
            else {
                return user.own_groups.find((usersOwnGroup) => usersOwnGroup.name === group.name)
            }
        }).reduce((accumulator , current) => {
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

        const sortByValues = [
            "Newest",
            "Oldest",
            "Most Members",
            "Least Members",
            "Name A-Z",
            "Name Z-A"
        ]

        const sortByOptions = sortByValues.map(( value , index ) => {
            return (
                <option 
                    key = { index } 
                    value = { value }
                >
                    { value }
                </option>
            )
        })

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
                                Create group +
                            </h3>
                        </Col>
                    </Row>
                    <Row>
                        { groupStatusSelectors }
                    </Row>
                    <Row
                        className = "filter-and-sort-row"
                    >
                        <Col>
                            <label htmlFor="filter-by-category">
                                Category:
                            </label>
                            <select
                                id = "filter-by-category"
                                name = "filter-by-category"
                                className = "filter-by-category"
                                onChange = {(e) => categoryChange(e)}
                                value = { selectedCategory }
                            >
                                    <option value = "all">All</option>
                                    { groupFilterOptions }

                            </select>
                        </Col>
                        <Col>
                            <label htmlFor="sort-by">
                                Sort by:
                            </label>
                            <select
                                id = "sort-by"
                                name = "sort-by"
                                className = "sort-by"
                                onChange = {(e) => sortByChange(e)}
                                value = { sortBy }
                            >
                                { sortByOptions }

                            </select>
                        </Col>
                    </Row>
                    <Row className="group-listing-row">
                        { groupsListing }
                    </Row>
                    { statusFilteredList.length > 15 &&
                        <Row className="groups-pagination-row">
                            <PagePagination 
                                root = "/groups"
                                pageCount = { 
                                    Math.ceil(statusFilteredList.length / 15) 
                                }
                            />
                        </Row>
                    }
                </>
            }
            <AddGroupModal 
                show = { show }
                handleClose = { handleClose }
                groupCategoryOptions = { groupCategoryOptions }
            />
        </Container>
    )
}