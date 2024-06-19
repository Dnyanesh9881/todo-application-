import React, { useContext, useState } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { validateLoginData } from "../utils/validation";
import UserContext from "../context/UserContext.jsx";

const LoginPage = () => {

    const { token, setToken } = useContext(UserContext);
    const [user, setUser] = useState({
        loginId: "",
        password: "",
    });
    const [message, setMessage] = useState("");

    const navigate = useNavigate();
    async function handleLogin(e) {
        e.preventDefault();
      const error=validateLoginData({...user});
      if(error) return setMessage(error);
        try {
            const response = await fetch("/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ...user})
            });
            const data = await response.json();
            if (data.error) {
               return setMessage(data.error)
            }

            
            // console.log(response.data.message);
            // console.log("Status : ", response.status);
            // setMessage(response.data.message);
            setToken(data);
            localStorage.setItem("token", JSON.stringify(data));
            navigate("/")
            setUser({
                loginId: "",
                password: "",
            });

        }
        catch (error) {
            console.log("Error", error.response.data.message);
            console.log("Status : ", error.response.status);
            setMessage(error.response.data.message);
        }
    }

    function changeInput(e) {

        setUser({
            ...user, [e.target.name]: e.target.value
        })
    }
    return (
        <div className="login all">

            <div className="login_card">
                <h1>Login</h1>
                {
                    message && <p style={{color:"red"}}>{message}</p>
                }
                <form className="login_form" onSubmit={handleLogin}>
                    <input id="lEmail" type="text" placeholder="Enter loginId" name="loginId" value={user.loginId} onChange={changeInput} />
                    <input id="lPassword" type="password" placeholder="Enter Password" name="password" value={user.password} onChange={changeInput} />
                    <button type="submit">submit</button>
                </form>
                <p>Don't have an account? <Link to={"/signup"}>signup</Link></p>
            </div>

        </div>
    )
}


export default LoginPage;