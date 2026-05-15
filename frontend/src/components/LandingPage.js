import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LandingPage = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Proje Gereksinimi: RESTful API üzerinden veriye erişim [cite: 16]
    axios.get('http://localhost:8080/api/items')
      .then(res => setItems(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ padding: '40px' }}>
      <header>
        <h1>Collector's Hub</h1>
        <p><i>Plaklardan K-pop photocard'lara, tarihin izini sürün.</i></p>
        <div className="ethnic-divider"></div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {items.map(item => (
          <div key={item.id} className="item-card" style={{
            background: 'white', 
            padding: '15px', 
            border: '1px solid #ddd',
            boxShadow: '5px 5px 0px var(--ethnic-red)' // Vintage stil gölge
          }}>
            <img src={item.image_url || 'https://via.placeholder.com/200'} alt={item.title} style={{ width: '100%' }} />
            <h3>{item.title}</h3>
            <p>{item.artist}</p>
            <div style={{ fontWeight: 'bold' }}>
              {item.is_for_sale ? `${item.price} TL` : 'Sadece Takas'}
            </div>
            {/* Proje Gereksinimi: Giriş yapanlara özel butonlar  */}
            <button style={{ marginTop: '10px', background: 'var(--ethnic-red)', color: 'white', border: 'none', padding: '10px' }}>
              Detayları Gör
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;