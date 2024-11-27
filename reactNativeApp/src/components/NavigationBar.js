import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './login.css';

const NavigationBar = () => {
    const location = useLocation(); //gets current url path


const renderLinks = () => {

    if (location.pathname === '/') {


    return (
      <>
        <Link to="/login" >Login</Link>
        <Link to= "/signup">Sign Up</Link>
        <Link to= "/CategorySelection">Category Selection</Link>
        </>
    );
    } else if (location.pathname === '/signup') {
        //on the sign up page displayed: Home, Login, and Category Selection
        return(
        <>
            <Link to=" /">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/category-selection">Category Selection</Link>
         </>
        );
    } else if (location.pathname === '/login') {
        return(
            <>
            <Link to=" /">Home</Link>
            <Link to="/signup">Sign Up</Link>
            <Link to="/category-selection">Category Selection</Link>
            </>
        );
    } else {
        //default for other page 
        return (
            <>
            <Link to=" ">Home</Link>
            <Link to="/category-selection">Category Selection</Link>
            </>
        );
    }
};
return(
        <nav className= "navbar">
            <div className="navbar-logo">
                <img src="../legal loop.png" alt="Partnership for Miami" />
                <h1 style={{ color: 'white', fontSize: '24px'}}> Legal Loop</h1>
            </div>
            <div className="navbar-links">
                {renderLinks()}
                </div>
              </nav>
    );
};

export default NavigationBar;