// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import CategorySelection from './components/CategorySelection';
import ForgotPassword from './components/ForgotPassword'; // Import ForgotPassword
import NotFound from './components/NotFound';
import Scraper from './components/Scraper';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/category-selection" element={<CategorySelection />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Add route for ForgotPassword */}
        <Route path="/legislative-entries" element={<Scraper />} /> {/* Add this route */}



        {/* Catch-all route for 404 */}
       <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
