import { useState } from "react";
import UserContext from "./UserContext.jsx";


const UserProvider = ({ children }) => {
    const [token, setToken] = useState(()=> JSON.parse(localStorage.getItem('token'))|| "");
  
    return (
      <UserContext.Provider value={{ token, setToken }}>
        {children}
      </UserContext.Provider>
    );
  };

  export default UserProvider;