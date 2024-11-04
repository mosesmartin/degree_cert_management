import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { Signin } from './pages/Signin';
import { Mainpage } from './pages/Mainpage';
import { Importfile } from './components/Importfile';
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from "./ApiConfig";
import AccessDenied from './pages/AccessDenied';
import { AddUser } from './pages/AddUser';


function App() {
  const [isIpValid, setIsIpValid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateIp = async () => {
      setLoading(true); // Set loading to true at the start of the request
      try {
        // Get the client's public IP address
        const { data } = await axios.get('https://api.ipify.org?format=json');
        const clientIP = data.ip;

        console.log("Client Public IP Address:", clientIP); // Log the public IP address

        // Send request to validate the IP address
        const response = await axios.get(`${API_BASE_URL}/validate-ip`, {
          params: { ip: clientIP } // Send the IP as a query parameter
        });

        // Set the validity of the IP based on the response
        setIsIpValid(response.data.isValid);
      } catch (error) {
        console.error('Error validating IP address:', error);
        setIsIpValid(false); // Handle any errors by denying access
      } finally {
        setLoading(false); // Set loading to false after the request is done
      }
    };

    validateIp();
  }, []);

  if (loading) {
    return ;
  }

  if (!isIpValid) {
    return <div><AccessDenied/></div>; // Display access denied message
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Signin />} />
        <Route path='/mainpage' element={<PrivateRoute><Mainpage /></PrivateRoute>} />
        <Route path='/importfile' element={<PrivateRoute><Importfile /></PrivateRoute>} />
        <Route path='/AddUser' element={<PrivateRoute><AddUser /></PrivateRoute>} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
