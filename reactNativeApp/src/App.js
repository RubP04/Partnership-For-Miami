// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import CategorySelection from './components/CategorySelection';
import ForgotPassword from './components/ForgotPassword';
import NotFound from './components/NotFound';
import Scraper from './components/Scraper';
import NavigationBar from './components/NavigationBar';

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent = () => {
  const location = useLocation();

  // Define paths where the NavigationBar should be hidden
  const hideNavbarPaths = ['/legislative-entries'];

  // Check if the current path is in the array of paths to hide the navbar
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {/* Conditionally render the NavigationBar */}
      {!shouldHideNavbar && <NavigationBar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/category-selection" element={<CategorySelection />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/legislative-entries" element={<Scraper />} />
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
