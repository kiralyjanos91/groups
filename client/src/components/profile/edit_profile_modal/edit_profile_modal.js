import React , { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CloseButton from "react-bootstrap/CloseButton"
import axios from "axios";
import UserDataUpdateHook from "../../../custom_hooks/userdataupdate";
import { Country, State, City }  from 'country-state-city';

export default function EditProfileModal ({
    show, 
    handleClose,
    profileData
}) {
    const {
        username,
        gender,
        birth,
        hobby,
        about
    } = profileData
    
    const { userDataUpdate } = UserDataUpdateHook()

    const [locationSelector , setLocationSelector] = useState({
        country: profileData?.location?.country,
        countryCode: profileData?.location?.countryCode,
        state: profileData?.location?.state,
        stateCode: profileData?.location?.stateCode,
        city: profileData?.location?.city
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
    
    const [formData , setFormData] = useState({
        username: username,
        gender: gender,
        birth: birth,
        hobby: hobby,
        about: about
    })

    const formChange = (e) => {
        setFormData(prev => {
            return {
                ...prev, 
                [e.target.name]: e.target.value
            }
        })
    }

    const save = () => {
        axios.post("/profiledatachange" , {
            formData, 
            locationSelector
        })
            .then(response => console.log(response))
            .then(
                handleClose(),
                userDataUpdate()
            )
            .catch((err) => console.log(err))
    }

    const fields = Object.entries(formData).slice(1).map((field , index) => {  
        return (
            <div key = { index }>
                <label htmlFor = { field[0] }> 
                    { `${field[0]}:` }
                </label>
                <input 
                    name = { field[0] } 
                    value = { field[1] || ""} 
                    onChange={(e) => formChange(e)}
                    type = { field[0] === "birth" ? "date" : "text"}
                />
            </div>
        )
    })

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

    console.log(profileData)

    return (    
        <Modal show={ show } onHide={ handleClose } centered>
            <Modal.Header>
                <Modal.Title>
                    Edit profile data
                </Modal.Title>
                <CloseButton 
                    variant = "white" 
                    onClick = { () => handleClose() }
                />
            </Modal.Header>
            <Modal.Body>
                <form>
                    { fields }
                    <label>Location:</label>
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
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={ save }>
                    Save 
                </Button>
                <Button variant="secondary" onClick={ handleClose }>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

