import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import bee from '../../images/bee.png';
import './Login.scss';

const Login = () => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [loginFail, setLoginFail] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const history = useHistory();

    const { login } = useAuth();

    const usernameHandler = (e) => {
        setUsername(e.target.value);
    }

    const passwordHandler = (e) => {
        setPassword(e.target.value);
    }

    // memory leak
    const handleSubmit = async e => {
        e.preventDefault();
        try {
            setError("");
            setLoading(true);
            await login(username, password);
            setLoginSuccess(true);
            setTimeout(() => {
                setLoginSuccess(false);
                history.push("/");
            }, 600);
        } catch {
            setError("Failed to sign in");
            console.log("Failed to sign  in");
            setLoginFail(true);
            setTimeout(() => setLoginFail(false), 900);
        }
        setLoading(false);
    }

    let buttonClass = null;
    if (loginFail) {
        buttonClass = "login-fail";
    } else if (loginSuccess) {
        buttonClass = "login-success";
    }

    return (
        <div className="login">
            <form className="form">
                <h1>Login</h1>
                <p>Email</p>
                <input type="text" onChange={usernameHandler} />
                <p>Password</p>
                <input type="password" onChange={passwordHandler} />
                <button className={buttonClass} onClick={handleSubmit} disabled={loading}>Login</button>
            </form>
            <Link to="/signup" className="link"><h5>Don't have an account?</h5></Link>
            <div className="bee"></div>
        </div>
    );
}

export default Login;