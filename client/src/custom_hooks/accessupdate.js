import { useDispatch , useSelector } from "react-redux"
import { setToken } from "../redux_slices/accessupdateslice"
import { updateUserData } from "../redux_slices/userdataslice"

export default function AccessUpdateHook(){

    const { userData } = useSelector(( state ) => state.userData.data )

    const dispatch = useDispatch()

    const accessUpdate = (token) => {
        dispatch(setToken(token?.data?.newToken))
        if (!token) {
           return dispatch( updateUserData({}) )
        }
        if (token?.data?.user !== userData) {
            dispatch( updateUserData( token?.data?.user ) )
        }
    }

    return { accessUpdate }
}
