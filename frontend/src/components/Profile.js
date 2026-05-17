import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, User, Mail, Lock, Plus, Eye, EyeOff, Save } from 'lucide-react';
import axios from 'axios';
import ImageCropperModal from './ImageCropperModal'; // Yeni kırpma modalını içeri alıyoruz

const Profile = () => {
  const navigate = useNavigate();
  
  // Kullanıcı Bilgileri State'leri
  const [username, setUsername] = useState(localStorage.getItem('username') || 'MISAFIR');
  const [email, setEmail] = useState(localStorage.getItem('email') || 'deneme@gmail.com');
  const [password, setPassword] = useState('********');
  
  // Profil Fotoğrafı ve Kırpma State'leri
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar') || "https://api.dicebear.com/7.x/bottts/svg?seed=NoPhoto");
  const [tempImage, setTempImage] = useState(null); // Ham seçilen resmi tutar
  const [isCropperOpen, setIsCropperOpen] = useState(false); // Modal açık/kapalı kontrolü
  
  const [myItems, setMyItems] = useState([]);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Koleksiyon parçalarını backend'den çekme
  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/items");
        setMyItems(response.data);
      } catch (err) {
        console.error("Koleksiyonunuz yüklenirken hata oluştu:", err);
      }
    };
    fetchMyItems();
  }, []);

  // Bilgisayardan dosya seçildiğinde çalışan fonksiyon
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result); // Seçilen ham resmi kırpıcıya gönder
        setIsCropperOpen(true); // Kırpma ekranını aç
      };
      reader.readAsDataURL(file);
    }
    e.target.value = ''; // Aynı dosya tekrar seçilebilsin diye temizle
  };

  // Kırpma işlemi başarıyla tamamlandığında çalışacak fonksiyon
  const handleCropComplete = (croppedBase64) => {
    localStorage.setItem('avatar', croppedBase64); // Hafifletilmiş kırpık resmi kaydet
    setAvatar(croppedBase64); // Ekranda anında güncelle
    setIsCropperOpen(false); // Modalı kapat
    setTempImage(null); // Geçici resmi temizle
  };

  // Kullanıcı bilgilerini kaydetme fonksiyonu
  const handleInfoSave = (e) => {
    e.preventDefault();
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);
    if (password !== '********' && password.trim() !== '') {
      alert("Şifreniz güncellendi (Sunum simülasyonu)!");
    }
    setIsEditingInfo(false);
    alert("Profil bilgileriniz başarıyla güncellendi!");
  };

  return (
    <div className="min-h-screen bg-[#fdfaf3] font-['Montserrat'] text-[#333] p-10">
      {/* Üst Navigasyon */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-[#5a7b8f] font-black uppercase text-xs tracking-widest hover:text-[#8e7eb5] transition-colors mb-10"
      >
        <ArrowLeft size={16} /> Dashboard'a Dön
      </button>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1.3fr_2fr] gap-12">
        
        {/* SOL TARAF: GELİŞMİŞ PROFİL KARTI */}
        <div className="bg-[#c5e3f4]/60 backdrop-blur-md rounded-[45px] p-8 border border-black/5 flex flex-col items-center h-fit shadow-xl">
          
          {/* Avatar Alanı - PC'den Seçim Detaylı */}
          <div className="relative group mb-6">
            <img 
              src={avatar} 
              className="w-32 h-32 rounded-[30px] object-cover border-4 border-white shadow-md transition-transform duration-300 group-hover:scale-105" 
              alt={username} 
            />
            <label 
              htmlFor="avatar-upload" 
              className="absolute -bottom-2 -right-2 bg-[#8e7eb5] text-white p-2.5 rounded-xl shadow-lg hover:bg-[#7a6aa0] transition-colors cursor-pointer flex items-center justify-center"
              title="Bilgisayardan Fotoğraf Seç"
            >
              <Camera size={16} />
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </label>
          </div>

          <h2 className="font-['Playfair_Display'] text-3xl font-bold text-[#5a7b8f] text-center mb-1">{username}</h2>
          <p className="text-[10px] font-black text-[#5a7b8f]/70 uppercase tracking-widest mb-6">Collector</p>

          {/* Profil Düzenleme Formu */}
          <div className="w-full space-y-4 border-t border-black/5 pt-6">
            
            {/* Kullanıcı Adı */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-[#5a7b8f]/60 uppercase tracking-wider block">Kullanıcı Adı</label>
              <div className="relative flex items-center">
                <User size={16} className="absolute left-3 text-[#5a7b8f]" />
                <input 
                  type="text" 
                  value={username}
                  disabled={!isEditingInfo}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full text-xs font-semibold pl-10 pr-4 py-3 rounded-xl border outline-none transition-all ${
                    isEditingInfo 
                      ? 'bg-white border-[#8e7eb5] text-[#333] shadow-inner focus:ring-1 focus:ring-[#8e7eb5]' 
                      : 'bg-transparent border-transparent text-gray-600 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>

            {/* E-posta */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-[#5a7b8f]/60 uppercase tracking-wider block">E-posta Adresi</label>
              <div className="relative flex items-center">
                <Mail size={16} className="absolute left-3 text-[#5a7b8f]" />
                <input 
                  type="email" 
                  value={email}
                  disabled={!isEditingInfo}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full text-xs font-semibold pl-10 pr-4 py-3 rounded-xl border outline-none transition-all ${
                    isEditingInfo 
                      ? 'bg-white border-[#8e7eb5] text-[#333] shadow-inner focus:ring-1 focus:ring-[#8e7eb5]' 
                      : 'bg-transparent border-transparent text-gray-600 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>

            {/* Şifre */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-[#5a7b8f]/60 uppercase tracking-wider block">Şifre</label>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-3 text-[#5a7b8f]" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  disabled={!isEditingInfo}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => password === '********' && setPassword('')}
                  className={`w-full text-xs font-semibold pl-10 pr-10 py-3 rounded-xl border outline-none transition-all ${
                    isEditingInfo 
                      ? 'bg-white border-[#8e7eb5] text-[#333] shadow-inner focus:ring-1 focus:ring-[#8e7eb5]' 
                      : 'bg-transparent border-transparent text-gray-600 cursor-not-allowed'
                  }`}
                />
                {isEditingInfo && (
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-400 hover:text-[#5a7b8f]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                )}
              </div>
            </div>

            {/* Form Butonları */}
            <div className="pt-4">
              {isEditingInfo ? (
                <button 
                  type="button" 
                  onClick={handleInfoSave}
                  className="w-full bg-[#8e7eb5] text-white text-xs font-bold py-3 rounded-xl shadow-md hover:bg-[#7a6aa0] transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={14} /> Değişiklikleri Kaydet
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={() => setIsEditingInfo(true)}
                  className="w-full bg-[#5a7b8f] text-white text-xs font-bold py-3 rounded-xl shadow-md hover:bg-[#486374] transition-colors"
                >
                  Profili Düzenle
                </button>
              )}
            </div>

          </div>
        </div>

        {/* SAĞ TARAF: KOLEKSİYONUM SERGİ ALANI VE EKLEME BUTONU */}
        <div className="space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-['Playfair_Display'] text-4xl text-[#8e7eb5] font-bold mb-2">Kişisel Koleksiyonum</h3>
              <p className="font-bold text-xs text-gray-400 italic">"Kendi ellerinle biriktirdiğin eşsiz parçalar."</p>
            </div>
            
            {/* Profil İçi Yeni Parça Ekleme Butonu */}
            <button 
              onClick={() => navigate("/add-item")}
              className="bg-[#8e7eb5] text-white p-3.5 rounded-2xl shadow-md hover:bg-[#7a6aa0] hover:-translate-y-0.5 transition-all flex items-center justify-center"
              title="Koleksiyona Yeni Parça Ekle"
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="h-[2px] opacity-10 bg-[repeating-linear-gradient(45deg,#aad4e5,#aad4e5_10px,transparent_10px,transparent_20px)] rounded-full" />

          {myItems.length === 0 ? (
            <div className="text-center py-20 bg-white/40 border border-dashed border-gray-200 rounded-3xl">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Koleksiyonunuz henüz boş.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {myItems.map((item, index) => (
                <div key={item.id || index} className="bg-white/50 border border-[#e8dfd0] rounded-2xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  {/* Profile.js içindeki ilgili alan */}
                    <div className="overflow-hidden rounded-xl h-36 mb-4 bg-gray-100 shadow-inner">
                    <img 
                        src={item.image_url || item.img || "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400"} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        alt={item.title} 
                    />
                    </div>
                  <h4 className="font-['Playfair_Display'] text-sm font-bold text-gray-800 leading-tight group-hover:text-[#8e7eb5] transition-colors line-clamp-1">{item.title}</h4>
                  <span className="inline-block mt-2 text-[9px] font-black tracking-wider text-[#5a7b8f] bg-[#c5e3f4]/50 px-2 py-1 rounded-md uppercase">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Kırpıcı Modalı Tetikleyici */}
      {isCropperOpen && (
        <ImageCropperModal 
          imgSrc={tempImage} 
          onCropComplete={handleCropComplete} 
          onClose={() => {
            setIsCropperOpen(false);
            setTempImage(null);
          }}
        />
      )}
    </div>
  );
};

export default Profile;