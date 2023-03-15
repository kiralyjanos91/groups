import React, { useState , useEffect } from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import CloseButton from "react-bootstrap/CloseButton"
import axios from "axios"
import UserDataUpdateHook from "../../custom_hooks/userdataupdate"
import { Country, State, City }  from 'country-state-city';
import "./createeventmodal.css"

export default function CreateEventModal({ show , handleClose , groupId }){
    
    const [ eventPhoto , setEventPhoto ] = useState(null)
    const [ photoLocation , setPhotoLocation ] = useState("")
    const [ imageUploading , setImageUploading ] = useState(false)
    const [ title , setTitle ] = useState("")
    const [ description , setDescription ] = useState("")
    const [ date , setDate ] = useState("")
    const [ errorMessage , setErrorMessage ] = useState("")
    const [locationSelector , setLocationSelector] = useState({
        country: "",
        countryCode: "",
        state: "",
        stateCode: "",
        city: ""
    })

    const { userDataUpdate } = UserDataUpdateHook()

    useEffect(() => {
        if (eventPhoto) {
            setPhotoLocation("")
            const photoForm = new FormData()
            photoForm.append("image" , eventPhoto , eventPhoto.name )
            axios.put("/eventphotoupload" , photoForm)
                .then( (res) => 
                    setPhotoLocation(() => res.data)       
                )
                .then( () => setImageUploading(false) )
        }
    } , [eventPhoto])

    const countries = Country?.getAllCountries().map((country , index) => {
        return (
            <option 
                name = {country.name} 
                value = {`["${country.name}","${country.isoCode}"]`}
                key = { index }
            >
                {country.name}
            </option>
        )
    })

    const states = State?.getStatesOfCountry(locationSelector.countryCode).map((state , index) => {
        return (
            <option 
                name = {state.name} 
                value = {`["${state.name}","${state.isoCode}"]`}
                key = { index }
            >
                {state.name}
            </option>
        )
    })
    
    const cities = City?.getCitiesOfState(
        locationSelector.countryCode , locationSelector.stateCode).map((city , index) => {
        return (
            <option 
                name = {city.name} 
                value = {`["${city.name}",""]`}
                key = { index }
            >
                {city.name}
            </option>
        )
    })

    const locationChange = (e) => {
        if (e.target.name === "country") {
            setLocationSelector(prev => {
                return {
                    ...prev,
                    state:"",
                    stateCode:"",
                    city:""
                }
            })
        }
        else if (e.target.name === "state") {
            setLocationSelector(prev => {
                return {
                    ...prev,
                    city:""
                }
            })
        }

        const data = JSON.parse(e.target.value)
        setLocationSelector(prev => {
            return {
                ...prev,
                [e.target.name ]: data[0],
                [e.target.name + "Code"]: data[1]
            }
        })
    }

    const createEvent = () => {
        const formData = {
            groupId,
            title,
            description,
            date,
            photo: photoLocation,
            location: locationSelector
        }

        axios.post("/createevent" , {
            formData
        })
            .then(() => {   
                handleClose()
                userDataUpdate()
            }
            )
            .catch((err) => {
                if(err.response.status === 406)
                    {
                        return setErrorMessage(err.response.data)
                    }
                console.log(err)
            }
            )
    }

    const clearOnClose = () => {
        setEventPhoto(null)
        setPhotoLocation("")
        setImageUploading(false)
        setTitle("")
        setDescription("")
        setDate("")
        setErrorMessage("")
        setLocationSelector({
            country: "",
            countryCode: "",
            state: "",
            stateCode: "",
            city: ""
        })
    }

    return (
        <>
            <Modal show = { show } onHide = { handleClose } centered>
                <Modal.Header>
                    <Modal.Title>Create Event</Modal.Title>
                    <CloseButton 
                        variant = "white" 
                        onClick = { () => handleClose() }
                    />
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <label htmlFor = "groupname">
                            *Title:
                        </label>
                        <input 
                            name = "title" 
                            onChange = {(e) => {
                                setTitle(e.target.value)
                                setErrorMessage("")
                            }}
                            value = { title }
                        />
                        <label htmlFor = "groupname">
                            *Description:
                        </label>
                        <input 
                            name="description" 
                            onChange = {(e) => setDescription(e.target.value)}
                            value = { description }
                        />
                        <label htmlFor = "groupname">
                            *When:
                        </label>
                        <input 
                            type = "date"
                            name="when" 
                            onChange = {(e) => setDate(e.target.value)}
                            value = { date }
                        />
                        <labe htmlFor = "group_photo">*Photo:</labe>
                        <input 
                            type = "file" 
                            name = "group_photo"
                            onChange = { (e) => {
                                setImageUploading(true)
                                setEventPhoto(e.target.files[0]) 
                            }
                            }       
                        />
                        <p>Location:</p>
                        <label htmlFor="country">Country:</label>
                        <select 
                            name="country"
                            onChange = {(e) => locationChange(e)}
                            value = {`["${locationSelector.country}","${locationSelector.countryCode}"]`}
                        >
                            <option 
                                name = "empty-option" 
                                value = {`["",""]`}
                            >
                            </option>
                            { countries }
                        </select>
                        { states.length > 0 &&
                            <>
                                <label htmlFor="state">State / Region:</label>
                                <select 
                                    name="state"
                                    onChange = {(e) => locationChange(e)}
                                    value = {`["${locationSelector.state}","${locationSelector.stateCode}"]`}
                                    >
                                    <option 
                                        name = "empty-option" 
                                        value = {`["",""]`}
                                    >
                                    </option>
                                    { states }
                                </select>
                            </>
                        }
                        { cities.length > 0 &&
                            <>
                                <label htmlFor="city">City:</label>
                                <select 
                                    name="city"
                                    onChange = {(e) => locationChange(e)}
                                    value = {`["${locationSelector.city}",""]`}
                                >
                                    <option 
                                        name = "empty-option" 
                                        value = {`["",""]`}
                                    >
                                    </option>
                                    { cities }
                                </select>
                            </>
                        }
                    </form>
                    <p> { errorMessage }</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="primary" 
                        onClick = { createEvent }
                        className = { photoLocation && title ? "" : "disabled-create-button"}
                    > 
                        { imageUploading ? "Uploading..." : "Create" } 
                    </Button>
                    <Button 
                        variant="secondary" 
                        onClick = {() => {
                            handleClose()
                            clearOnClose()
                        }
                        }
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </> 
    )
}