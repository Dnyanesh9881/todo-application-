import axios from 'axios'
import React, { useContext } from 'react'
import UserContext from '../context/UserContext.jsx'
import { useNavigate } from 'react-router-dom';



const LogoutBtn = () => {
 const {setToken}=useContext(UserContext);
 const navigate=useNavigate();

    const handleLogout=async() => {
         try {
            const data=await axios.get('/api/users/logout');
             console.log(data);
             localStorage.removeItem("token");
             setToken("");
             navigate("/login");
         } catch (error) {
            console.log(error);
         }
    }
  return (
    <button className='logout_btn' onClick={handleLogout}>Logout</button>
  )
}

export default LogoutBtn