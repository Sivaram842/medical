import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useDarkMode } from './lib/useDarkMode';
import { useAuth } from './context/AuthContext';

import Header from './components/Header';
import Spinner from './components/Spinner';
import PrivateRoute from './components/PrivateRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Search from './pages/Search';
import Account from './pages/Account';
import Pharmacies from './pages/Pharmacies';

const App = () => {
  const [dark, setDark] = useDarkMode();
  const { loading } = useAuth();
  const { pathname } = useLocation();

  if (loading) return <Spinner />;

  const hideHeader = pathname === '/login' || pathname === '/signup';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {!hideHeader && <Header dark={dark} setDark={setDark} />}
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/account"
          element={<PrivateRoute><Account /></PrivateRoute>}
        />
        <Route
          path="/pharmacies"
          element={<PrivateRoute><Pharmacies /></PrivateRoute>}
        />
      </Routes>
    </div>
  );
};

export default App;
