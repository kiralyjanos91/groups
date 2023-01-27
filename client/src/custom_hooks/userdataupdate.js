import { useDispatch , useSelector } from "react-redux"
import { updateUserData } from "../redux_slices/userdataslice"

export default function UserDataUpdateHook(){

    // const { userData } = useSelector(( state ) => state.userData.data )

    const dispatch = useDispatch()

    const userDataUpdate = ( userData ) => {

            dispatch( updateUserData( userData ) )

    }

    return { userDataUpdate }
}