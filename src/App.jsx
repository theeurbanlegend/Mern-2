import { Routes,Route } from "react-router-dom"
import Layouts from "./components/Layouts"
import Public from './components/Public'
import Login from "./features/auth/Login"
import DashLayout from './components/DashLayout'
import Welcome from "./features/auth/Welcome"
import NotesList from "./features/Notes/NotesList"
import UsersList from "./features/Users/UsersList"

function App() {
  return (
    <Routes>
        <Route path='/' element={<Layouts/>}>
        <Route index element={<Public/>}/>
        <Route path='login' element={<Login/>}/>

      <Route path='dash' element={<DashLayout/>}>
          <Route index element={<Welcome/>}/>
          <Route path='notes'>
            <Route index element={<NotesList/>}/>
          </Route>
          <Route path='users'>
            <Route index element={<UsersList/>}/>
          </Route>
      </Route>
      </Route>
    </Routes>
  )
}

export default App
