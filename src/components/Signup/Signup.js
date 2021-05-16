import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import './Signup.scss';

const Signup = () => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();
    const [signupFail, setSignupFail] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const { signup } = useAuth();

    const usernameHandler = (e) => {
        setUsername(e.target.value);
    }

    const passwordHandler = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            setError("");
            setLoading(true);
            await signup(username, password);
            setSignupSuccess(true);
            setTimeout(() => {
                setSignupSuccess(false);
                history.push("/");
            }, 600);
        } catch {
            setError("Failed to create account");
            console.log("Failed to create account");
            setSignupFail(true);
            setTimeout(() => setSignupFail(false), 900);
        }

        setLoading(false);
    }

    let buttonClass = null;
    if (signupFail) {
        buttonClass = "login-fail";
    } else if (signupSuccess) {
        buttonClass = "login-success";
    }

    return (
        <div className="login">
            <form>
                <h1>Sign Up</h1>
                <p>Email:</p>
                <input type="text" onChange={usernameHandler} />
                <p>Password:</p>
                <input type="password" onChange={passwordHandler} />
                <button className={buttonClass} onClick={handleSubmit} disabled={loading}>Sign Up</button>
            </form>
            <Link to="/login" className="link"><h5>Already have an account?</h5></Link>
            <div className="bee"></div>
        </div>
    );
}

export default Signup;