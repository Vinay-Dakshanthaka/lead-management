import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Header from './components/header/Header';
import Main from './components/main/Main';

const App = () => {
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(true); // Default to true initially
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const roleFromLocalStorage = localStorage.getItem('role');
    const passwordUpdateStatus = localStorage.getItem('password_updated') === 'true'; // Correct key name

    if (token && roleFromLocalStorage) {
      setIsLoggedIn(true);
      setRole(roleFromLocalStorage);
      setPasswordUpdated(passwordUpdateStatus);
    } else {
      setIsLoggedIn(false);
      setRole(null);
      setPasswordUpdated(true); // Reset if not logged in
    }
  }, [location]);

  return (
    <>
      <Header role={role} isLoggedIn={isLoggedIn} onSignOut={() => setIsLoggedIn(false)} />
      <Main role={role} isLoggedIn={isLoggedIn} passwordUpdated={passwordUpdated} />
    </>
  );
};

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
