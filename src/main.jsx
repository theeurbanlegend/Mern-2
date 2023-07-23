import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import { store } from './app/store.jsx'
import { Provider } from 'react-redux'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
 
 <React.StrictMode>
  <Provider store={store}>
  <BrowserRouter>
  <Routes>
    <Route path='/*' element={<App/>}/>
  </Routes>
  </BrowserRouter>
  </Provider>
  </React.StrictMode>
)
