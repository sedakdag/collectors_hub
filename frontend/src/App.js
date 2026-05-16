import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Explore from './components/Explore';
import ProductDetail from './components/ProductDetail';
import SocialPanel from './components/SocialPanel';
import Auth from './components/Auth'; 
import './App.css';

// Korumalı Rota (Protected Route) Bileşeni
// Token yoksa kullanıcıyı zorla login sayfasına atar
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Giriş ve Kayıt Sayfası */}
          <Route path="/login" element={<Auth />} />
          
          {/* Dashboard (Korumalı) */}
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Arkadaşının Sayfaları (İstersen bunları da ProtectedRoute içine alabilirsin) */}
          <Route path="/explore" element={<Explore />} />
          <Route path="/product" element={<ProductDetail />} />
          <Route path="/social" element={<SocialPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

//test1212112
export default App;