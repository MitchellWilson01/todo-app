import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DateContext } from './contexts/DateContext';
import PrivateRoute from './components/PrivateRoute';
import Signup from './components/Signup/Signup';
import Login from './components/Login/Login';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';

const App = () => {
    const [date, setDate] = useState(new Date());

    const handleResize = () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    window.addEventListener("resize", handleResize);

    return (
        <Router>
            <AuthProvider>
            <DateContext.Provider value={{ date, setDate }}>
                <Header />
                <Switch>
                    <PrivateRoute path="/" exact component={Home} />
                    <Route path="/signup" exact component={Signup} />
                    <Route path="/login" exact component={Login} />
                </Switch>
            </DateContext.Provider>
            </AuthProvider>
        </Router>
    );
}

export default App;