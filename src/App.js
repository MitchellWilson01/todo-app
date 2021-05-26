import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DateContext } from './contexts/DateContext';
import PrivateRoute from './components/PrivateRoute';
import Signup from './components/Signup/Signup';
import Login from './components/Login/Login';
import Home from './pages/Home/Home';
import Habits from './pages/Habits/Habits';
import Events from './pages/Events/Events';

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
                <Switch>
                    <PrivateRoute path="/" exact component={Home} />
                    <PrivateRoute path="/habits" exact component={Habits} />
                    <PrivateRoute path="/events" exact component={Events} />
                    <Route path="/signup" exact component={Signup} />
                    <Route path="/login" exact component={Login} />
                </Switch>
            </DateContext.Provider>
            </AuthProvider>
        </Router>
    );
}

export default App;