import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import { Signin } from './pages/Signin'
import { Selectyear } from './components/selectyear';
import { Mainpage } from './pages/Mainpage';
import { Importfile } from './components/Importfile';


function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>

        <Routes>

          <Route exact path='/' element={<Signin />} />
          <Route  path='/mainpage' element={<Mainpage />} />
          <Route exact path='/importfile' element={<Importfile />} />

        </Routes>


      </BrowserRouter>
    </>
  )
}

export default App

