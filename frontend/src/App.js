import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth'; // Yeni oluşturduğun dosya
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Giriş Sayfası */}
        <Route path="/login" element={<Auth />} />
        
        {/* Dashboard Sayfası */}
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
//test1212112
export default App;