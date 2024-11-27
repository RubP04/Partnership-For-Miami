import React from 'react';
import { Link } from 'react-router-dom';
import './login.css';

const NavigationBar = () => {
    return (
        <nav className= "navbar">
            <div className="navbar-logo">
                <img src="../logo.svg" alt="Partnership for Miami" />
                <h1 style={{ color: 'white', fontSize: '24px'}}> Policy App</h1>
            </div>
            <div className="navbar-links">
                <Link to="/" className="nav-item">
                    Home 
                </Link>
                
                <Link to="/Login" className="nav-item">
                    Login 
                </Link>
                <Link to ="/signup" className="nav-item">
                    Sign Up
                </Link>
                <Link to= "/CategorySelection" className="nav-item">
                    Category Selection
                </Link>
                </div>
        </nav>
    );
};

export default NavigationBar;