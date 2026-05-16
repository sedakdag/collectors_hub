import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Explore from './components/Explore';
import ProductDetail from './components/ProductDetail';
import SocialPanel from './components/SocialPanel';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/product" element={<ProductDetail />} />
          <Route path="/social" element={<SocialPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;