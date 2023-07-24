import { Routes,Route } from "react-router-dom"
import Layouts from "./components/Layouts"
import Public from './components/Public'
import Login from "./features/auth/Login"
import DashLayout from './components/DashLayout'
import Welcome from "./features/auth/Welcome"
import NotesList from "./features/Notes/NotesList"
import UsersList from "./features/Users/UsersList"
import  NewNote from './features/Notes/NewNote'
import EditNote from './features/Notes/EditNote'
import UserForm from './features/Users/UserForm'
import EditUser from './features/Users/EditUser'
import Prefetch from "./features/auth/preFetch"
import PersistLogin from "./features/auth/PersistLogin"
import RequireAuth from "./features/auth/RequireAuth"
import { ROLES } from "../config/roles"

function App() {
  return (
    <Routes>
        <Route path='/' element={<Layouts/>}>
        <Route index element={<Public/>}/>
        <Route path='login' element={<Login/>}/>


        <Route element={<PersistLogin/>}>
          <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]}/>}>
          <Route element={<Prefetch/>}>
              <Route path='dash' element={<DashLayout/>}>
                  <Route index element={<Welcome/>}/>
                      <Route path='notes'>
                        <Route index element={<NotesList/>}/>
                        <Route path=':id' element={<EditNote/>}/>
                        <Route path='new' element={<NewNote/>}/>
                      </Route>
                      <Route element={<RequireAuth allowedRoles={[ROLES.Manager,ROLES.Admin]}/>}>
                      <Route path='users'>
                        <Route index element={<UsersList/>}/>
                        <Route path=':id' element={<EditUser/>}/>
                        <Route path='new' element={<UserForm/>}/>
                      </Route>
                      </Route>
              </Route>
          </Route>
          </Route>
        </Route>

        </Route>
    </Routes>
  )
}

export default App
