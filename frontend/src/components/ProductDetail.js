import React from "react";
import { useNavigate } from "react-router-dom"; // Sayfalar arası geçiş için bunu ekledik
import { Disc, Heart, ArrowLeft, Share2, ShieldCheck, Calendar, User } from "lucide-react";

const ProductDetail = () => {
  const navigate = useNavigate(); // Yönlendiriciyi burada tanımladık

  // Şimdilik test amaçlı sabit bir veri koyuyoruz, son adımda backend'e bağlayacağız
  const mockItem = {
    title: "Abbey Road",
    artist: "The Beatles",
    category: "Vinyl",
    price: "1250.00",
    is_for_sale: true,
    is_for_swap: false,
    description: "The eleventh studio album by the English rock band the Beatles, released on 26 September 1969 by Apple Records. Features iconic tracks like 'Come Together' and 'Here Comes the Sun'. A must-have centerpiece for any serious music collector.",
    image_url: "https://upload.wikimedia.org/wikipedia/en/a/a3/Abbey_Road.png",
    owner: "koleksiyoner1"
  };

  return (
    <div className="min-h-screen bg-[#fdfaf3] p-6 md:p-12 font-['Montserrat'] text-[#333]">
      {/* Üst Navigasyon */}
      <div className="flex justify-between items-center mb-10 max-w-5xl mx-auto">
        {/* Back Butonu Aktifleştirildi */}
        <button 
          onClick={() => navigate("/")} 
          className="flex items-center gap-2 text-xs font-black tracking-widest text-gray-400 uppercase hover:text-[#8e7eb5] transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div className="flex gap-3">
          <button className="p-3 bg-white rounded-2xl border border-[#e8dfd0] text-gray-400 hover:text-red-400 hover:shadow-sm transition-all cursor-pointer">
            <Heart size={18} />
          </button>
          <button className="p-3 bg-white rounded-2xl border border-[#e8dfd0] text-gray-400 hover:text-[#8e7eb5] hover:shadow-sm transition-all cursor-pointer">
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* Ana Detay Alanı */}
      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-white/40 border border-[#e8dfd0] rounded-[40px] p-8 md:p-12 shadow-sm backdrop-blur-md">
        
        {/* Sol Taraf: Büyük Ürün Görseli */}
        <div className="relative flex justify-center items-center group">
          {/* Arka Plan Süs Efekti */}
          <div className="absolute w-72 h-72 bg-[#c5e3f4] rounded-full blur-3xl opacity-40 -z-10 animate-pulse" />
          
          <div className="relative">
            {/* Kartın Köşesindeki Mor Bookmark */}
            <div className="absolute -top-2 right-6 w-6 h-10 bg-[#d4c1ee] [clip-path:polygon(0_0,100%_0,100%_100%,50%_80%,0_100%)] z-10 shadow-sm" />
            <img 
              src={mockItem.image_url} 
              alt={mockItem.title} 
              className="w-80 h-auto md:w-[360px] rounded-[32px] object-cover shadow-2xl border-4 border-white transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        </div>

        {/* Sağ Taraf: Ürün Bilgileri */}
        <div className="flex flex-col h-full justify-center">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#b8e2f2] text-[#5a7b8f] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Disc size={12} /> {mockItem.category}
            </span>
            {mockItem.is_for_sale && (
              <span className="bg-[#dfd3ef] text-[#8e7eb5] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                For Sale
              </span>
            )}
          </div>

          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-2">
            {mockItem.title}
          </h2>
          <p className="font-['Playfair_Display'] text-xl italic text-[#8e7eb5] font-bold mb-6">
            by {mockItem.artist}
          </p>

          <div className="h-[2px] w-20 opacity-20 bg-[#aad4e5] mb-6 rounded-full" />

          <p className="text-sm text-gray-500 leading-relaxed font-medium mb-8">
            {mockItem.description}
          </p>

          {/* Koleksiyon Meta Bilgileri */}
          <div className="grid grid-cols-2 gap-4 mb-8 bg-white/60 p-4 rounded-2xl border border-black/5">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
              <User size={14} className="text-[#8e7eb5]" />
              <span>Owner: <span className="text-gray-700">{mockItem.owner}</span></span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
              <ShieldCheck size={14} className="text-[#5a7b8f]" />
              <span>Condition: <span className="text-gray-700">Mint (10/10)</span></span>
            </div>
          </div>

          {/* Fiyat ve Aksiyon Alanı */}
          <div className="mt-auto flex items-center justify-between gap-6 bg-[#ebe4d8]/40 border border-[#e8dfd0] p-4 rounded-3xl">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price Estimation</p>
              <p className="text-2xl font-black text-gray-800 mt-1">{mockItem.price} TL</p>
            </div>
            <button className="flex-1 bg-[#8e7eb5] hover:bg-[#7a6aa0] text-white font-bold text-xs py-4 rounded-2xl shadow-lg shadow-[#8e7eb5]/20 transition-all uppercase tracking-wider active:scale-95 cursor-pointer">
              Make an Offer
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ProductDetail;