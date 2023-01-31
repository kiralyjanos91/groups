import axios from "axios"
import { useDispatch } from "react-redux"
import { updateUserData } from "../redux_slices/userdataslice"

export default function UserDataUpdateHook(){
    
    const dispatch = useDispatch()
    
    const userDataUpdate = () => {
        axios.get("/userdataupdate")
            .then( response => dispatch ( updateUserData ( response.data.userData ) ) )
    }

    return { userDataUpdate }
}