import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './App.css';
import Signup from './authenticate/Signup';
import Header from './authenticate/Header';
import Footer from './authenticate/Footer';
import Login from './authenticate/Login';
import Home from './authenticate/Home';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is already logged in by checking localStorage
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setLoggedIn(true);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        {loggedIn && <Header />}
        <main className="flex-grow">
          <Routes>
            {/* Routes accessible only when NOT logged in */}
            {!loggedIn && (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
                <Route path="/signup" element={<Signup setLoggedIn={setLoggedIn} />} />
                {/* Redirect logged-in users away from Login, Signup, and Home */}
                <Route path="*" element={<Navigate to="/account" replace />} />
              </>
            )}
            
            {/* Routes accessible only when logged in */}
            {loggedIn && (
              <>
                {/* <Route path="/account" element={<h1>Hello World</h1>} /> */}
                {/* Add other protected routes here */}
                {/* <Route path="*" element={<Navigate to="/account" replace />} /> */}
              </>
            )}
          </Routes>
        </main>
        {loggedIn && <Footer />}
      </Router>
    </div>
  );
};

export default App;
