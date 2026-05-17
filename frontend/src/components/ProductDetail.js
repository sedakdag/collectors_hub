import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingBag, MessageSquare, ShieldCheck, Disc, CheckCircle, XCircle } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- POP-UP (TOAST) BİLDİRİM STATE'LERİ ---
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success"); // success veya error

  useEffect(() => {
    fetch(`http://localhost:8080/api/items/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Ürün bulunamadı");
        return res.json();
      })
      .then((data) => {
        setItem(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Hata:", err);
        setLoading(false);
      });
  }, [id]);

  // Yardımcı Pop-up Tetikleyici Fonksiyon
  const triggerToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    // 3 saniye sonra pop-up ekrandan kaybolsun
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfaf3] flex items-center justify-center font-['Montserrat']">
        <p className="text-gray-400 italic animate-pulse">Koleksiyon parçası yükleniyor...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-[#fdfaf3] flex flex-col items-center justify-center font-['Montserrat'] gap-4">
        <p className="text-gray-500 font-bold">Koleksiyon parçası bulunamadı!</p>
        <button onClick={() => navigate("/explore")} className="text-xs bg-[#8e7eb5] text-white px-4 py-2 rounded-xl cursor-pointer">
          Keşfet Sayfasına Dön
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfaf3] p-6 md:p-12 font-['Montserrat'] text-[#333] relative">
      
      {/* ========================================================= */}
      {/* DİNAMİK POP-UP BİLDİRİM ALANI (YUKARDAN DÜŞEN TOAST) */}
      {/* ========================================================= */}
      <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 transform transition-all duration-500 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border backdrop-blur-md ${
        showToast ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0 pointer-events-none"
      } ${
        toastType === "success" 
          ? "bg-[#dfd3ef]/90 border-[#8e7eb5]/20 text-[#8e7eb5]" 
          : "bg-red-50/90 border-red-200 text-red-600"
      }`}>
        {toastType === "success" ? <CheckCircle size={18} /> : <XCircle size={18} />}
        <span className="text-xs font-bold tracking-wide uppercase">{toastMessage}</span>
      </div>

      <header className="max-w-5xl mx-auto mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-xs font-black tracking-widest text-gray-400 uppercase hover:text-[#8e7eb5] transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 bg-white/40 border border-[#e8dfd0] rounded-[40px] p-6 md:p-10 backdrop-blur-md shadow-sm">
        
        {/* Görsel Alanı */}
        <div className="aspect-[3/4] rounded-[30px] overflow-hidden bg-[#ebe4d8]/30 shadow-md">
          <img 
            src={item.image_url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500"} 
            className="w-full h-full object-cover" 
            alt={item.title} 
          />
        </div>

        {/* Detaylar Alanı */}
        <div className="flex flex-col justify-between py-2">
          <div>
            <div className="flex gap-2 mb-4">
              <span className="bg-[#b8e2f2] text-[#5a7b8f] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Disc size={12} /> {item.category || "Collectible"}
              </span>
              <span className="text-[9px] font-black uppercase tracking-widest bg-[#8e7eb5]/10 text-[#8e7eb5] px-3 py-1 rounded-full">
                {item.condition || "Mint (10/10)"}
              </span>
              {item.is_for_swap && (
                <span className="text-[9px] font-black uppercase tracking-widest bg-green-500/10 text-green-600 px-3 py-1 rounded-full">
                  Swap Available
                </span>
              )}
            </div>

            <h1 className="font-['Playfair_Display'] text-4xl font-bold text-gray-900 mb-2 leading-tight">{item.title}</h1>
            <p className="font-['Playfair_Display'] text-xl italic text-[#8e7eb5] font-bold mb-6">by {item.artist || "Unknown Artist"}</p>
            
            <p className="text-sm text-gray-500 leading-relaxed font-medium bg-white/50 border border-dashed border-[#e8dfd0] rounded-2xl p-4 mb-6">
              {item.description || "Bu koleksiyon parçası için bir açıklama girilmemiş."}
            </p>
          </div>

          <div>
            {/* Sahip Bilgisi */}
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-6 bg-white/40 p-3 rounded-xl border border-black/5">
              <ShieldCheck size={14} className="text-[#5a7b8f]" />
              <span>Koleksiyoner: <span className="text-gray-700">@{item.owner || "anonim"}</span></span>
            </div>

            {/* Fiyat Alanı */}
            <div className="mb-6">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Estimated Value</p>
              <p className="text-3xl font-bold text-[#d4a373]">
                {item.price && parseFloat(item.price) > 0 ? `${parseInt(item.price)} TL` : "Not for Sale / Swap Only"}
              </p>
            </div>

            <div className="flex gap-4">
              {item.is_for_sale && parseFloat(item.price) > 0 && (
                <button className="flex-1 bg-[#8e7eb5] text-white font-bold text-xs py-4 rounded-2xl hover:bg-[#7a6aa0] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer">
                  <ShoppingBag size={16} /> BUY NOW
                </button>
              )}
              
              <button 
                onClick={() => navigate("/social", { state: { openChatWith: item.owner || "koleksiyoner1" } })}
                className="flex-1 bg-white border border-[#e8dfd0] text-gray-700 font-bold text-xs py-4 rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
               <MessageSquare size={16} className="text-[#5a7b8f]" /> CONTACT OWNER
              </button>
              
              {/* Yenilenen Akıllı Kalp Butonu */}
              <button 
                onClick={() => {
                  const currentUsername = localStorage.getItem('username') || 'koleksiyoner1';
                  
                  fetch(`http://localhost:8080/api/favorites/${item.id}?username=${currentUsername}`, {
                    method: "POST"
                  })
                  .then((res) => {
                    if (!res.ok) throw new Error("API hatası fırlatıldı");
                    return res.json();
                  })
                  .then(() => {
                    // Başarılı ise yukarıda mor pop-up açılır
                    triggerToast("Ürün başarıyla kaydedilenlerinize eklendi! 🌟", "success");
                  })
                  .catch((err) => {
                    console.error("Favori kaydetme hatası:", err);
                    // Başarısız ise yukarıda kırmızı pop-up açılır
                    triggerToast("Bağlantı hatası: Favorilere eklenemedi!", "error");
                  });
                }}
                className="p-4 bg-red-50 text-red-400 rounded-2xl hover:bg-red-400 hover:text-white transition-all shadow-sm cursor-pointer"
                title="Favorilere Ekle"
              >
                <Heart size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;