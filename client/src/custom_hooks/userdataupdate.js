import { axiosConf } from "../config"
import { useDispatch } from "react-redux"
import { updateUserData } from "../redux_slices/userdataslice"

export default function UserDataUpdateHook(){
    
    const dispatch = useDispatch()
    
    const userDataUpdate = () => {
        axiosConf.get("/userdataupdate")
            .then( response => dispatch ( updateUserData ( response.data.userData ) ) )
    }

    return { userDataUpdate }
}