import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import { Signin } from './pages/Signin'
import { Mainpage } from './pages/Mainpage';
import { Importfile } from './components/Importfile';
import PrivateRoute from './components/PrivateRoute';


function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>

        <Routes>


          <Route exact path='/' element={<Signin/>} />
          <Route  path='/mainpage' element={<PrivateRoute><Mainpage /></PrivateRoute>} />
          <Route exact path='/importfile' element={<PrivateRoute><Importfile /></PrivateRoute>} />

        </Routes>


      </BrowserRouter>
    </>
  )
}

export default App

