
import React, { useState, useEffect } from "react";
import { Search, Filter, Disc, Images, DiscAlbum, ChevronLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom"; // Sayfalar arası geçiş için

const Explore = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation(); 

  
  const [selectedCategory, setSelectedCategory] = useState(location.state?.category || "All");
  

  useEffect(() => {
    // Backend'den tüm koleksiyonu çekiyoruz
    fetch('http://localhost:8080/api/items')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error("Hata:", err));
  }, []);

  // Filtreleme mantığı
// Filtreleme mantığı
  // --- KURŞUNGEÇİRMEZ FİLTRELEME MANTIĞI ---
  // Array.isArray(items) kontrolü sayesinde backend'den liste gelmediyse bile uygulama asla çökmez.
  // Seda'nın önerdiği ?. (optional chaining) mantığını da ekledik.
  const filteredItems = Array.isArray(items) 
    ? items.filter(item => {
        // 1. Arama filtresi
        const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              item.artist?.toLowerCase().includes(searchTerm.toLowerCase());
        
        // 2. Kategori filtresi
        if (selectedCategory === "All") return matchesSearch;
        if (selectedCategory === "Vinyl") return matchesSearch && item.category_id === 1;
        if (selectedCategory === "CDs") return matchesSearch && item.category_id === 3;
        if (selectedCategory === "Photocards") return matchesSearch && item.category_id === 2;
        
        return matchesSearch;
      })
    : []; // Eğer items bir dizi değilse boş bir liste dön ki ekran patlamasın

  return (
    <div className="min-h-screen bg-[#fdfaf3] p-10 font-['Montserrat']">
      {/* Üst Bar */}
      <header className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          {/* Back Butonu aktifleştirildi */}
          <button 
            onClick={() => navigate("/")} 
            className="p-2 hover:bg-white rounded-full transition-all text-[#8e7eb5] cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="font-['Playfair_Display'] text-4xl text-[#8e7eb5] font-bold">Explore Collection</h1>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white/70 border border-[#8e7eb5]/10 rounded-2xl px-5 py-3 flex items-center w-80 shadow-sm">
            <Search size={18} className="text-gray-300" />
            <input 
              className="bg-transparent border-none outline-none text-xs ml-3 w-full" 
              placeholder="Search in history..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-[#b8e2f2] p-3 rounded-2xl text-[#5a7b8f] hover:shadow-lg transition-all">
            <Filter size={20} />
          </button>
        </div>
      </header>

      {/* Kategori Filtreleri */}
      <div className="flex gap-4 mb-10">
        {['All', 'Vinyl', 'CDs', 'Photocards'].map(cat => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${
              selectedCategory === cat ? 'bg-[#8e7eb5] text-white' : 'bg-white text-gray-400 border border-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid Liste */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredItems.map(item => (
          <div 
            key={item.id} 
            onClick={() => navigate("/product")} // Kartın tamamına tıklandığında ürün detayına gider
            className="bg-white p-5 rounded-[30px] shadow-sm hover:shadow-xl transition-all group cursor-pointer border border-[#f0ebe0]/50"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-4">
               <img src={item.image_url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400"} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.title} />
               <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full text-[#8e7eb5]">
                 {item.category_id === 1 ? <Disc size={16} /> : <Images size={16} />}
               </div>
            </div>
            <h3 className="font-['Playfair_Display'] text-lg font-bold text-gray-800">{item.title}</h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter mt-1">{item.artist}</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-[#d4a373] font-bold text-sm">{item.price ? `${item.price} TL` : "Not for Sale"}</span>
              <button className="text-[10px] font-black bg-[#fdfaf3] px-3 py-1 rounded-lg text-[#8e7eb5] border border-[#8e7eb5]/10 cursor-pointer">
                DETAILS
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;