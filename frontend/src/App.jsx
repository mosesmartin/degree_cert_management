import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Route, BrowserRouter, Routes} from 'react-router-dom'
import { Signin } from './pages/Signin'


function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
       <BrowserRouter>

        <Routes>

            <Route exact path='/' element={<Signin/>}/>

        </Routes>


      </BrowserRouter> 
    </>
  )
}

export default App

