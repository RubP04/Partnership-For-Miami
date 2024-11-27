import React from 'react';
import { Link } from 'react-router-dom';
import './login.css';

const NavigationBar = () => {
    return (
        <nav className= "navbar">
            <div className="navbar-logo">
                <img src="../legal loop.png" alt="Partnership for Miami" />
                <h1 style={{ color: 'white', fontSize: '24px'}}> Legal Loop</h1>
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
                </div>
        </nav>
    );
};

export default NavigationBar;