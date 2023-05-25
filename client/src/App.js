import React , { useEffect , useState } from "react"
import { Route , Routes , useLocation , useNavigate } from "react-router"
import Menu from "./components/navigation/navigation"
import Home from "./components/home/home"
import Groups from "./components/groups/groups"
import Group from "./components/group/group"
import Profile from "./components/profile/profile"
import Events from "./components/events/events"
import Messages from "./components/messages/messages"
import Login from "./components/login/login"
import Register from "./components/registration/registration"
import Member from "./components/member/member"
import Footer from "./components/footer/footer"
import 'bootstrap/dist/css/bootstrap.min.css'
import { axiosConf } from "./config"
import { useSelector } from "react-redux"
import AccessUpdateHook from "./custom_hooks/accessupdate"
import { ContextProvier } from "./context/socketiocontext"
import "./App.css"

export default function App(){

  const { accessUpdate } = AccessUpdateHook()
  const location = useLocation()
  const navigate = useNavigate()
  const accessToken = useSelector((state) => state.accessupdate.token)
  const [accessChecked , setAccessChecked] = useState(false)

  useEffect(() => {
    window.scrollTo( 0 , 0 )
  } , [ location ])

  useEffect(() => {
    if (
        location.pathname !== "/login" 
        && location.pathname !== "/registration"
      ) {
        axiosConf.post("/auth" , {accessToken})
          .then(response => {
            if (response.status === 200) {
              accessUpdate(response)
            }
          })
      .catch((e) => {
        setAccessChecked((prev) => true)
        accessUpdate(undefined)
        if (location.pathname !== "/") {
          navigate("/login")
        }
      })
    }
  }, [location])

  return(
    <>
      <ContextProvier>
        <Menu />
          <div className="app-body">
            <Routes>
              { accessToken && 
                <>
                  <Route path="/profile" element = { <Profile /> } />
                  <Route path="/groups"> 
                    <Route index element={<Groups />} />
                    <Route path=":page" element={<Groups />} />
                  </Route>
                  <Route path="/group/:id" element = { <Group /> } />
                  <Route path = "/events" element = { <Events />} />
                  <Route path="/messages" element = { <Messages /> } />
                  <Route path="/member/:membername" element = { <Member /> } />
                </>
              }
              <Route path="/" element = { 
                  <Home 
                    accessChecked = { accessChecked } 
                  /> 
                } 
              />
              <Route path="/login" element = { <Login /> } />
              <Route path="/registration" element = { <Register /> } />
            </Routes>
          </div>
        <Footer />
      </ContextProvier>
    </>
  )
}