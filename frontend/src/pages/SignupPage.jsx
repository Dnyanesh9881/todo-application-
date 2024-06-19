import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { validateSignUpData } from "../utils/validation";
import UserContext from "../context/UserContext.jsx";

const SignupPage = () => {
    const {token, setToken } = useContext(UserContext);
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: ""
    });
    const [message, setMessage] = useState("");
    
   
    async function handleSignup(e) {
        e.preventDefault();
        const error = validateSignUpData({ ...user });
        if (error) return setMessage(error);
        try {
            const response = await fetch("/api/users/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ...user })
            });
            const data = await response.json();
            if (data.error) {
                return setMessage(data.error)
            }
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
        <div className="all">
            <div className="signup_card">
                <h1>Sign Up</h1>
                {
                    message && <p style={{color:"red"}}>{message}</p>
                }
                <form className="signup_form" onSubmit={handleSignup}>

                    <input id="name" placeholder="Enter your name" type="text" name="name" value={user.name} onChange={changeInput} />

                    <input id="username" placeholder="Enter username" type="username" value={user.username} name="username" onChange={changeInput} />

                    <input id="email" placeholder="Enter email" type="email" value={user.email} name="email" onChange={changeInput} />

                    <input id="password" placeholder="Enter password" type="password" value={user.password} name="password" onChange={changeInput} />

                    <input id="confirmPassword" placeholder="Confirm password" type="password" value={user.confirmPassword} name="confirmPassword" onChange={changeInput} /><br />
                    <button type="submit">submit</button>
                </form>
                <p>User already exist? <Link to={"/login"}>Login</Link></p>
            </div>

        </div>
    )
}


export default SignupPage;