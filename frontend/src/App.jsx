import React, { useContext } from 'react';
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import LogoutBtn from './components/LogoutBtn';


const App = () => {
  const token  = JSON.parse(localStorage.getItem('token'));
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
