import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Header from './components/Header';
import Spinner from './components/Spinner';
import PrivateRoute from './components/PrivateRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Search from './pages/Search';
import Account from './pages/Account';
import Pharmacies from './pages/Pharmacies';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import PharmacyInventory from './pages/PharmacyInventory';

const App = () => {
  const { loading } = useAuth();

  if (loading) return <Spinner />;


  return (
    <div className="min-h-screen bg-[#0b0e15] text-gray-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
        <Route path="/pharmacies" element={<PrivateRoute><Pharmacies /></PrivateRoute>} />
        <Route path="/pharmacies/:id" element={<PharmacyInventory />} />

      </Routes>

    </div>
  );
};

export default App;
