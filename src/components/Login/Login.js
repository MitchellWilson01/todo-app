import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import './Login.scss';

const Login = () => {
    //const [username, setUsername] = useState();
    //const [password, setPassword] = useState();
    const emailRef = useRef()
    const passwordRef = useRef()
    const [loading, setLoading] = useState(false);
    const [loginFail, setLoginFail] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);
    
    const history = useHistory();

    const { login } = useAuth();

    const usernameHandler = (e) => {
        //setUsername(e.target.value);
        emailRef = e.target.value;
    }

    const passwordHandler = (e) => {
        //setPassword(e.target.value);
        passwordRef = e.target.value;
    }

    // memory leak?
    const handleSubmit = async e => {
        e.preventDefault();
        try {
            setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value);
            setLoginSuccess(true);
            setTimeout(() => {
                setLoginSuccess(false);
                history.push("/");
            }, 600);
        } catch {
            setLoginFail(true);
            setTimeout(() => setLoginFail(false), 1000);
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
                <input type="text" ref={emailRef} required />
                <p>Password</p>
                <input type="password" ref={passwordRef} required />
                <button className={buttonClass} onClick={handleSubmit} disabled={loading}>Login</button>
            </form>
            <Link to="/signup" className="link"><h5>Don't have an account?</h5></Link>
            
        </div>
    );
}

export default Login;