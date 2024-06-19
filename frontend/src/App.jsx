import React, { useContext, useEffect } from 'react';
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import LogoutBtn from './components/LogoutBtn';
import UserContext from './context/UserContext';


const App = () => {
  const {token, setToken}  = useContext(UserContext);
  useEffect(() => {
    const storedToken = JSON.parse(localStorage.getItem('token'));
    if (storedToken) {
      setToken(storedToken);
    }
  }, [setToken]);
  return (
    <Router>
    {  token && <LogoutBtn />}
      <Routes>
        <Route path="/login" element={!token ? <LoginPage /> : <Navigate to={"/"}/>} />
        <Route path="/signup" element={!token ? <SignupPage /> : <Navigate to={"/"} />} />
        <Route path="/" element={token ? <DashboardPage /> : <Navigate to={"/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
