import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, HashRouter, Routes, BrowserRouter } from 'react-router-dom'; // Import HashRouter instead of BrowserRouter
import { Signin } from './pages/Signin';
import { Mainpage } from './pages/Mainpage';
import { Importfile } from './components/Importfile';
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter> {/* Use HashRouter here */}
        <Routes>
          <Route exact path='/' element={<Signin />} />
          <Route path='/mainpage' element={<PrivateRoute><Mainpage /></PrivateRoute>} />
          <Route exact path='/importfile' element={<PrivateRoute><Importfile /></PrivateRoute>} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </>
  );
}

export default App;
