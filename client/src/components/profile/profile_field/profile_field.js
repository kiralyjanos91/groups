import React , { useState , useRef } from "react"
import { Col , Row } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import axios from "axios"

export default function ProfileField({
    label,
    name,
    value
}) {
    const [editing , setEditing] = useState( false )

    const fieldValueRef = useRef()

    const save = () => {
        axios.post("/profiledatachange" , {
            field: name,
            value: fieldValueRef.current.value     
        })
            .then(response => console.log(response))
    }

    return (
        <>
            <Row>
                <label htmlFor = { name }>
                    { label }
                </label>
            </Row>
            <Row>
                { editing ?
                    <>
                        <Col>
                            <input 
                                type="text" 
                                name= { label } 
                                value = { value } 
                                ref = { fieldValueRef }
                            />
                        </Col>
                        <Col>
                            <Button variant="primary" onClick = { save }>
                                Save
                            </Button>
                        </Col>
                        <Col>
                            <Button variant="secondary" onClick = { setEditing(false) }>
                                Cancel
                            </Button>
                        </Col>
                    </>
                    :
                    <>
                        <Col>
                            <p>
                                {value}
                            </p>
                        </Col>
                        <Col>
                            <Button variant="primary" onClick={setEditing(true)}>
                                Edit
                            </Button>
                        </Col>
                    </>
                }
            </Row>
        </>
    )

}