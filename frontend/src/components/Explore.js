import React, { useState, useEffect } from "react";
import { Search, Filter, Disc, Images, DiscAlbum, ChevronLeft, Camera, Mail, PenTool } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Explore = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // --- DASHBOARD BAĞLANTILI STATE BAŞLANGIÇLARI ---
  const [searchTerm, setSearchTerm] = useState(location.state?.initialSearch || "");
  const [selectedCategory, setSelectedCategory] = useState(location.state?.category || "All");

  useEffect(() => {
    fetch('http://localhost:8080/api/items')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error("Hata:", err));
  }, []);

  // --- SQL SEED VE VERİTABANI MODELİYLE %100 UYUMLU FİLTRELEME ---
  const filteredItems = Array.isArray(items) 
    ? items.filter(item => {
        const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              item.artist?.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (selectedCategory === "All") return matchesSearch;
        
        // Veritabanındaki gerçek category_id indeksleriyle tam eşleme kanka:
        if (selectedCategory === "Vinyl") return matchesSearch && item.category_id === 1;
        if (selectedCategory === "CDs") return matchesSearch && item.category_id === 2;
        if (selectedCategory === "Photocards") return matchesSearch && item.category_id === 3;
        if (selectedCategory === "Vintage Tech") return matchesSearch && item.category_id === 4;
        if (selectedCategory === "Postcards") return matchesSearch && item.category_id === 5;
        if (selectedCategory === "Signed Art") return matchesSearch && item.category_id === 6;
        
        return matchesSearch;
      })
    : [];

  // Veritabanındaki category_id karşılıklarına göre ikon eşleme
  const getCategoryIcon = (categoryId) => {
    switch(categoryId) {
      case 1: return <Disc size={16} />;        // Vinyl
      case 2: return <DiscAlbum size={16} />;   // CDs
      case 3: return <Images size={16} />;      // Photocards
      case 4: return <Camera size={16} />;      // Vintage Tech
      case 5: return <Mail size={16} />;        // Postcards
      case 6: return <PenTool size={16} />;      // Signed Art
      default: return <Disc size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf3] p-10 font-['Montserrat'] flex flex-col h-screen overflow-hidden">
      
      {/* Üst Bar - Sabit Kalacak */}
      <header className="flex items-center justify-between mb-8 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/")} 
            className="p-2 hover:bg-white rounded-full transition-all text-[#8e7eb5] cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="font-['Playfair_Display'] text-4xl text-[#8e7eb5] font-bold">Explore Collection</h1>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white/70 backdrop-blur-md border border-[#8e7eb5]/10 rounded-2xl px-5 py-3 flex items-center w-80 shadow-sm">
            <Search size={18} className="text-gray-300" />
            <input 
              className="bg-transparent border-none outline-none text-xs ml-3 w-full font-medium" 
              placeholder="Search by title or artist..."
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-[#b8e2f2] p-3 rounded-2xl text-[#5a7b8f] hover:shadow-lg transition-all">
            <Filter size={20} />
          </button>
        </div>
      </header>

      {/* Kategori Filtreleri - Sabit Kalacak */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-none flex-shrink-0">
        {['All', 'Vinyl', 'Photocards', 'CDs', 'Vintage Tech', 'Postcards', 'Signed Art'].map(cat => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat ? 'bg-[#8e7eb5] text-white' : 'bg-white text-gray-400 border border-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* --- SCROLLABLE GRID ALANI: İÇERİDEN KAYACAK OLAN CANAVAR --- */}
      <div className="flex-1 overflow-y-auto pr-2 pb-6 scrollbar-none">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              onClick={() => navigate(`/product/${item.id}`)}
              className="bg-white p-5 rounded-[30px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer border border-[#f0ebe0]/50 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-4 bg-[#ebe4d8]/30">
                   <img 
                     src={item.image_url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400"} 
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                     alt={item.title} 
                   />
                   <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full text-[#8e7eb5]">
                     {getCategoryIcon(item.category_id)}
                   </div>
                </div>
                <h3 className="font-['Playfair_Display'] text-lg font-bold text-gray-800 line-clamp-1">{item.title}</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter mt-1">{item.artist || "Unknown Artist"}</p>
              </div>

              <div className="mt-4 flex justify-between items-center w-full">
                <span className="text-[#d4a373] font-bold text-sm">
                  {item.price && parseFloat(item.price) > 0 ? `₺${parseInt(item.price)}` : "Swap Only"}
                </span>
                <button className="text-[10px] font-black bg-[#fdfaf3] px-3 py-1 rounded-lg text-[#8e7eb5] border border-[#8e7eb5]/10 cursor-pointer">
                  DETAILS
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Eğer filtreye uygun ürün yoksa gösterilecek boş ekran uyarısı */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="font-['Playfair_Display'] text-2xl text-gray-400 italic">No items found in this category yet.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Explore;