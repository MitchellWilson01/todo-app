import React from 'react';
import { BrowserRouter as Router, Switch, Route, useLocation } from 'react-router-dom';
import Signup from './components/Signup/Signup';
import Login from './components/Login/Login';
import Header from './components/Header/Header';
import DateNode from './components/DateNode/DateNode';
import Home from './pages/Home/Home';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
    const handleResize = () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
  
    window.addEventListener("resize", handleResize);

    return (
        <Router>
            <AuthProvider>
                <Header />
                <Switch>
                    <PrivateRoute path="/" exact component={Home} />
                    <Route path="/signup" exact component={Signup} />
                    <Route path="/login" exact component={Login} />
                </Switch>
            </AuthProvider>
        </Router>
    );
}

export default App;