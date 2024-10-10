import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import { Signin } from './pages/Signin'
import { Selectyear } from './components/selectyear';


function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>

        <Routes>

          <Route exact path='/' element={<Signin />} />
          <Route exact path='/mainpage' element={<Selectyear />} />

        </Routes>


      </BrowserRouter>
    </>
  )
}

export default App

