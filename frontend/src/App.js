import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Explore from './components/Explore';
import ProductDetail from './components/ProductDetail';
import SocialPanel from './components/SocialPanel';
import Auth from './components/Auth'; 
import Profile from './components/Profile';
import AddItem from './components/AddItem';
import './App.css';

// Korumalı Rota (Protected Route) Bileşeni
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
          
          {/* Dashboard artık /dashboard linkinde çalışacak */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Eğer birisi direkt boş linke (/) girerse otomatik /dashboard'a yönlendirsin */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Profil sayfasını buraya ekliyoruz */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          <Route path="/add-item" element={
            <ProtectedRoute>
              <AddItem />
            </ProtectedRoute>
          } />
          
          {/* Diğer Sayfalar */}
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