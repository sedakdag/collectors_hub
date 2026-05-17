import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Image as ImageIcon, Camera, FolderOpen, Type } from 'lucide-react';
import axios from 'axios';
import ImageCropperModal from './ImageCropperModal'; // Profilde yazdığımız kırpıcıyı burada da kullanıyoruz!

const AddItem = () => {
  const navigate = useNavigate();

  // Form State'leri
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Vinyl');
  const [itemImg, setItemImg] = useState(null); // Kırpılmış son görseli tutar
  
  // Kırpıcı Modalı State'leri
  const [tempImage, setTempImage] = useState(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  // Kategoriler listesi (Dashboard'daki popüler kategorilerle birebir uyumlu)
  const categories = ['Vinyl', 'Photocards', 'CDs', 'Vintage Tech', 'Postcards', 'Signed Art'];

  // Bilgisayardan dosya seçildiğinde
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result); // Ham resmi kırpıcıya gönder
        setIsCropperOpen(true); // Kırpma ekranını aç
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // Kırpma işlemi bittiğinde
  const handleCropComplete = (croppedBase64) => {
    setItemImg(croppedBase64); // Kırpılan resmi form state'ine kaydet
    setIsCropperOpen(false);
    setTempImage(null);
  };

  // Form Gönderildiğinde (Backend Kayıt)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Lütfen ürün adı girin!");
      return;
    }
    if (!itemImg) {
      alert("Lütfen koleksiyon parçası için bir fotoğraf seçin!");
      return;
    }

    const newItem = {
      id: Date.now(), // Şimdilik frontend için eşsiz id (Backend isterse ezebilir)
      title: title,
      category: category,
      img: itemImg // Kırpılmış Base64 resmi gidiyor
    };

    try {
      // Backend'e POST isteği atıyoruz
      // Not: main.py tarafında bu eklemeyi kabul edecek bir POST endpoint'i açacağız birazdan
      await axios.post("http://localhost:8080/api/items", newItem);
      alert("Yeni parça koleksiyonunuza başarıyla eklendi! 🚀");
      navigate('/dashboard'); // Başarılıysa Dashboard'a geri dön
    } catch (err) {
      console.error("Ürün eklenirken hata oluştu:", err);
      alert("Backend bağlantı hatası! Parça eklenemedi.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf3] font-['Montserrat'] text-[#333] p-10 flex flex-col items-center justify-center">
      
      {/* Üst Navigasyon */}
      <div className="w-full max-w-xl mb-6">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-[#5a7b8f] font-black uppercase text-xs tracking-widest hover:text-[#8e7eb5] transition-colors"
        >
          <ArrowLeft size={16} /> Geri Dön
        </button>
      </div>

      {/* FORM KARTU */}
      <div className="bg-[#dcd0ef]/40 backdrop-blur-md rounded-[45px] p-10 border border-black/5 w-full max-w-xl shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="font-['Playfair_Display'] text-4xl text-[#8e7eb5] font-bold mb-2">Koleksiyona Ekle</h2>
          <p className="font-bold text-xs text-gray-400 italic">"Hazinene yeni bir parça daha kazandır."</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* FOTOĞRAF SEÇME ALANI */}
          <div className="flex flex-col items-center justify-center">
            {itemImg ? (
              <div className="relative group w-44 h-60">
                <img 
                  src={itemImg} 
                  className="w-full h-full rounded-2xl object-cover border-4 border-white shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]" 
                  alt="Önizleme" 
                />
                <label 
                  htmlFor="item-upload"
                  className="absolute -bottom-2 -right-2 bg-[#5a7b8f] text-white p-2.5 rounded-xl shadow-lg hover:bg-[#486374] transition-colors cursor-pointer flex items-center justify-center"
                >
                  <Camera size={16} />
                </label>
              </div>
            ) : (
              <label 
                htmlFor="item-upload"
                className="w-44 h-60 border-2 border-dashed border-[#8e7eb5]/40 rounded-2xl flex flex-col items-center justify-center bg-white/50 cursor-pointer hover:bg-white hover:border-[#8e7eb5] transition-all group shadow-inner"
              >
                <ImageIcon size={32} className="text-[#8e7eb5]/40 group-hover:text-[#8e7eb5] transition-colors mb-2" />
                <span className="text-[10px] font-black text-gray-400 group-hover:text-[#8e7eb5] uppercase tracking-wider transition-colors">Görsel Seç</span>
              </label>
            )}
            <input 
              id="item-upload" 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="hidden" 
            />
          </div>

          {/* ÜRÜN ADI INPUTU */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-[#8e7eb5] uppercase tracking-wider block ml-1">Parçanın Adı</label>
            <div className="relative flex items-center">
              <Type size={16} className="absolute left-4 text-[#8e7eb5]" />
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: Pink Floyd - The Dark Side of the Moon"
                className="w-full text-xs font-semibold pl-12 pr-4 py-4 rounded-xl border border-[#8e7eb5]/20 bg-white outline-none focus:border-[#8e7eb5] focus:ring-1 focus:ring-[#8e7eb5] shadow-sm transition-all"
                required
              />
            </div>
          </div>

          {/* KATEGORİ SEÇİMİ (SELECT) */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-[#8e7eb5] uppercase tracking-wider block ml-1">Kategori</label>
            <div className="relative flex items-center">
              <FolderOpen size={16} className="absolute left-4 text-[#8e7eb5]" />
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs font-semibold pl-12 pr-4 py-4 rounded-xl border border-[#8e7eb5]/20 bg-white outline-none focus:border-[#8e7eb5] cursor-pointer shadow-sm appearance-none transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* GÖNDERME BUTONU */}
          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full bg-[#8e7eb5] text-white text-xs font-black py-4 rounded-xl shadow-lg hover:bg-[#7a6aa0] hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
            >
              <Plus size={16} /> Koleksiyona Kat
            </button>
          </div>

        </form>
      </div>

      {/* Kırpıcı Modalı */}
        {isCropperOpen && (
        <ImageCropperModal 
            imgSrc={tempImage} 
            onCropComplete={handleCropComplete} 
            aspect={2 / 3} // <--- İşte sihirli dikey polaroid oranı!
            onClose={() => {
            setIsCropperOpen(false);
            setTempImage(null);
            }}
        />
        )}
    </div>
  );
};

export default AddItem;