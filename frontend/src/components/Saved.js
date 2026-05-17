import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, ChevronLeft, Heart, Trash2, Disc, Images, DiscAlbum, Camera, Mail, PenTool } from "lucide-react";

const Saved = () => {
  const navigate = useNavigate();
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUsername = localStorage.getItem('username') || 'koleksiyoner1';

  // Sayfa açıldığında doğrudan PostgreSQL veritabanından favorileri çekiyoruz
  useEffect(() => {
    fetch(`http://localhost:8080/api/favorites?username=${currentUsername}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSavedItems(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Favori verileri çekilirken hata oluştu:", err);
        setLoading(false);
      });
  }, [currentUsername]);

  // Gerçek veritabanından favori silme işlemi (DELETE isteği atar)
  const handleRemoveItem = (e, id) => {
    e.stopPropagation(); // Karta tıklayıp detay sayfasına gitmeyi engeller
    
    fetch(`http://localhost:8080/api/favorites/${id}?username=${currentUsername}`, {
      method: "DELETE"
    })
    .then((res) => {
      if (!res.ok) throw new Error("Silme işlemi başarısız");
      return res.json();
    })
    .then(() => {
      // Başarıyla silindiyse arayüzdeki state'i de güncelleriz
      setSavedItems(savedItems.filter(item => item.id !== id));
    })
    .catch((err) => console.error("Veritabanından favori silinemedi:", err));
  };

  const getCategoryIcon = (categoryId) => {
    switch(categoryId) {
      case 1: return <Disc size={16} />;
      case 2: return <Images size={16} />;
      case 3: return <DiscAlbum size={16} />;
      case 4: return <Camera size={16} />;
      case 5: return <Mail size={16} />;
      case 6: return <PenTool size={16} />;
      default: return <Disc size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfaf3] flex items-center justify-center font-['Montserrat']">
        <p className="text-gray-400 italic animate-pulse">Favori listeniz veritabanından yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfaf3] p-10 font-['Montserrat'] text-[#333]">
      {/* Üst Bar */}
      <header className="flex items-center gap-4 mb-12 max-w-5xl mx-auto">
        <button 
          onClick={() => navigate("/dashboard")} // Güvenli bir şekilde ana panele yönlendirir
          className="p-2 hover:bg-white rounded-full transition-all text-[#8e7eb5] cursor-pointer"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-['Playfair_Display'] text-4xl text-[#8e7eb5] font-bold flex items-center gap-3">
          <Bookmark size={32} /> Saved Items
        </h1>
      </header>

      {/* Ana İçerik Alanı */}
      <main className="max-w-5xl mx-auto">
        {savedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white/40 border border-[#e8dfd0] rounded-[40px] p-16 md:p-24 backdrop-blur-md shadow-sm text-center">
            <div className="w-20 h-20 bg-[#dfd3ef]/50 rounded-full flex items-center justify-center text-[#8e7eb5] mb-6">
              <Heart size={36} />
            </div>
            <h2 className="font-['Playfair_Display'] text-2xl font-bold text-gray-800 mb-3">Your Wishlist is Empty</h2>
            <p className="text-sm text-gray-400 font-medium max-w-sm leading-relaxed mb-8">
              Koleksiyon parçalarını gezerken kalp ikonuna basarak beğendiklerini veritabanına kaydedebilirsin.
            </p>
            <button 
              onClick={() => navigate("/explore")}
              className="bg-[#8e7eb5] hover:bg-[#7a6aa0] text-white font-bold text-xs px-8 py-4 rounded-2xl shadow-md transition-all uppercase tracking-wider cursor-pointer"
            >
              Explore Collectibles
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {savedItems.map(item => (
              <div 
                key={item.id} 
                onClick={() => navigate(`/product/${item.id}`)}
                className="bg-white p-5 rounded-[30px] shadow-sm hover:shadow-xl transition-all group cursor-pointer border border-[#f0ebe0]/50 relative"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-4 bg-[#ebe4d8]/30">
                   <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.title} />
                   
                   <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full text-[#8e7eb5]">
                     {getCategoryIcon(item.category_id)}
                   </div>

                   <button 
                     onClick={(e) => handleRemoveItem(e, item.id)}
                     className="absolute bottom-3 right-3 bg-red-50 text-red-400 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-400 hover:text-white shadow-sm cursor-pointer"
                     title="Favorilerden Kaldır"
                   >
                     <Trash2 size={14} />
                   </button>
                </div>
                <h3 className="font-['Playfair_Display'] text-lg font-bold text-gray-800 line-clamp-1">{item.title}</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter mt-1">{item.artist || "Unknown Artist"}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-[#d4a373] font-bold text-sm">
                    {item.price && parseFloat(item.price) > 0 ? `${parseInt(item.price)} TL` : "Swap Only"}
                  </span>
                  <button className="text-[10px] font-black bg-[#fdfaf3] px-3 py-1 rounded-lg text-[#8e7eb5] border border-[#8e7eb5]/10">DETAILS</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Saved;