import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, User, Mail, Lock, Plus, Eye, EyeOff, Save, Edit2, X, FolderOpen, FileText, Sparkles, Trash2 } from 'lucide-react';
import axios from 'axios';
import ImageCropperModal from './ImageCropperModal';

const Profile = () => {
  const navigate = useNavigate();
  
  // Kullanıcı Bilgileri State'leri
  const [username, setUsername] = useState(localStorage.getItem('username') || 'MISAFIR');
  const [email, setEmail] = useState(localStorage.getItem('email') || 'deneme@gmail.com');
  const [password, setPassword] = useState('********');
  
  // Profil Fotoğrafı ve Kırpma State'leri
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar') || "https://api.dicebear.com/7.x/bottts/svg?seed=NoPhoto");
  
  // Akıllı Kırpma Motoru State'leri
  const [tempImage, setTempImage] = useState(null); 
  const [isCropperOpen, setIsCropperOpen] = useState(false); 
  const [cropperTarget, setCropperTarget] = useState('avatar'); 
  
  const [myItems, setMyItems] = useState([]);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Ürün Düzenleme (Popup Modal) State'leri
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', price: '', is_for_sale: false, is_for_swap: false, category: 'Vinyl', description: '', condition: 'Mint (10/10)', img: null, image_url: '' });

  const categories = ['Vinyl', 'Photocards', 'CDs', 'Vintage Tech', 'Postcards', 'Signed Art'];
  const conditions = ['Mint (10/10)', 'Near Mint (9/10)', 'Excellent (8/10)', 'Good (7/10)', 'Fair (6/10)'];

  useEffect(() => {
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    try {
      const currentUsername = localStorage.getItem('username') || 'MISAFIR';
      const response = await axios.get(`http://localhost:8080/api/items?username=${currentUsername}`);
      setMyItems(response.data);
    } catch (err) {
      console.error("Koleksiyonunuz yüklenirken hata oluştu:", err);
    }
  };

  // Profil Fotoğrafı Seçimi İçin
  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result); 
        setCropperTarget('avatar'); 
        setIsCropperOpen(true); 
      };
      reader.readAsDataURL(file);
    }
    e.target.value = ''; 
  };

  // Ürün Düzenleme Modalında Yeni Fotoğraf Seçimi İçin
  const handleProductEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result);
        setCropperTarget('product_edit'); 
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // Akıllı Kırpma Motoru Başarıyla Tamamlandığında
  const handleCropComplete = (croppedBase64) => {
    if (cropperTarget === 'avatar') {
      localStorage.setItem('avatar', croppedBase64); 
      setAvatar(croppedBase64); 
    } else if (cropperTarget === 'product_edit') {
      setEditForm({...editForm, img: croppedBase64});
    }
    setIsCropperOpen(false); 
    setTempImage(null); 
  };

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

  const handleEditClick = (item) => {
    let currentCategory = 'Vinyl';
    if (item.category_id === 2) currentCategory = 'CDs';
    else if (item.category_id === 3) currentCategory = 'Photocards';
    else if (item.category_id === 4) currentCategory = 'Vintage Tech';
    else if (item.category_id === 5) currentCategory = 'Postcards';
    else if (item.category_id === 6) currentCategory = 'Signed Art';

    setEditingItem(item);
    setEditForm({
      title: item.title,
      price: item.price || '',
      is_for_sale: item.is_for_sale,
      is_for_swap: item.is_for_swap || false,
      category: currentCategory,
      description: item.description || '',
      condition: item.condition || 'Mint (10/10)',
      image_url: item.image_url || item.img, 
      img: null 
    });
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/items/${editingItem.id}`, {
        title: editForm.title,
        img: editForm.img, 
        image_url: editForm.image_url,
        category: editForm.category,
        is_for_sale: editForm.is_for_sale,
        is_for_swap: editForm.is_for_swap,
        price: editForm.is_for_sale && editForm.price ? parseFloat(editForm.price) : null,
        description: editForm.description,
        condition: editForm.condition
      });
      setEditingItem(null);
      fetchMyItems(); 
      alert("Koleksiyon parçası ve fotoğrafı başarıyla güncellendi! 🚀🖼️");
    } catch (err) {
      console.error("Güncelleme hatası:", err);
    }
  };

  // Ürün Silme Fonksiyonu (Yeni Eklendi!)
  const handleDeleteItem = async () => {
    if (window.confirm(`"${editForm.title}" parçasını koleksiyonunuzdan tamamen silmek istediğinize emin misiniz?`)) {
      try {
        await axios.delete(`http://localhost:8080/api/items/${editingItem.id}`);
        setEditingItem(null);
        fetchMyItems();
        alert("Parça koleksiyonunuzdan silindi. 🗑️");
      } catch (err) {
        console.error("Silme işlemi sırasında hata oluştu:", err);
        alert("Silme işlemi başarısız oldu.");
      }
    }
  };

  return (
    <div className="max-h-screen w-full bg-[#fdfaf3] font-['Montserrat'] text-[#333] p-10 overflow-y-scroll flex flex-col scrollbar-hide">
      {/* Üst Navigasyon */}
      <div className="w-full max-w-5xl mx-auto flex-shrink-0">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-[#5a7b8f] font-black uppercase text-xs tracking-widest hover:text-[#8e7eb5] transition-colors mb-10"
        >
          <ArrowLeft size={16} /> Dashboard'a Dön
        </button>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1.3fr_2fr] gap-12 w-full flex-1 items-start pb-24">
        
        {/* SOL TARAF: GELİŞMİŞ PROFİL KARTI */}
        <div className="bg-[#c5e3f4]/60 backdrop-blur-md rounded-[45px] p-8 border border-black/5 flex flex-col items-center h-fit shadow-xl md:sticky md:top-4">
          <div className="relative group mb-6">
            <img src={avatar} className="w-32 h-32 rounded-[30px] object-cover border-4 border-white shadow-md transition-transform duration-300" alt={username} />
            <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 bg-[#8e7eb5] text-white p-2.5 rounded-xl shadow-lg hover:bg-[#7a6aa0] transition-colors cursor-pointer flex items-center justify-center">
              <Camera size={16} /><input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarFileChange} className="hidden" />
            </label>
          </div>
          <h2 className="font-['Playfair_Display'] text-3xl font-bold text-[#5a7b8f] text-center mb-1">{username}</h2>
          <p className="text-[10px] font-black text-[#5a7b8f]/70 uppercase tracking-widest mb-6">Collector</p>

          <div className="w-full space-y-4 border-t border-black/5 pt-6">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-[#5a7b8f]/60 uppercase tracking-wider block">Kullanıcı Adı</label>
              <div className="relative flex items-center">
                <User size={16} className="absolute left-3 text-[#5a7b8f]" />
                <input type="text" value={username} disabled={!isEditingInfo} onChange={(e) => setUsername(e.target.value)} className={`w-full text-xs font-semibold pl-10 pr-4 py-3 rounded-xl border outline-none transition-all ${isEditingInfo ? 'bg-white border-[#8e7eb5] text-[#333] shadow-inner focus:ring-1 focus:ring-[#8e7eb5]' : 'bg-transparent border-transparent text-gray-600 cursor-not-allowed'}`} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-[#5a7b8f]/60 uppercase tracking-wider block">E-posta Adresi</label>
              <div className="relative flex items-center">
                <Mail size={16} className="absolute left-3 text-[#5a7b8f]" />
                <input type="email" value={email} disabled={!isEditingInfo} onChange={(e) => setEmail(e.target.value)} className={`w-full text-xs font-semibold pl-10 pr-4 py-3 rounded-xl border outline-none transition-all ${isEditingInfo ? 'bg-white border-[#8e7eb5] text-[#333] shadow-inner focus:ring-1 focus:ring-[#8e7eb5]' : 'bg-transparent border-transparent text-gray-600'}`} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-[#5a7b8f]/60 uppercase tracking-wider block">Şifre</label>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-3 text-[#5a7b8f]" />
                <input type={showPassword ? "text" : "password"} value={password} disabled={!isEditingInfo} onChange={(e) => setPassword(e.target.value)} className={`w-full text-xs font-semibold pl-10 pr-10 py-3 rounded-xl border outline-none transition-all ${isEditingInfo ? 'bg-white border-[#8e7eb5] text-[#333] shadow-inner focus:ring-1 focus:ring-[#8e7eb5]' : 'bg-transparent border-transparent text-gray-600 cursor-not-allowed'}`} />
                {isEditingInfo && (
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-gray-400 hover:text-[#5a7b8f]">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                )}
              </div>
            </div>
            <div className="pt-4">
              {isEditingInfo ? (
                <button type="button" onClick={handleInfoSave} className="w-full bg-[#8e7eb5] text-white text-xs font-bold py-3 rounded-xl shadow-md hover:bg-[#7a6aa0] transition-colors flex items-center justify-center gap-2"><Save size={14} /> Değişiklikleri Kaydet</button>
              ) : (
                <button type="button" onClick={() => setIsEditingInfo(true)} className="w-full bg-[#5a7b8f] text-white text-xs font-bold py-3 rounded-xl shadow-md hover:bg-[#486374] transition-colors">Profili Düzenle</button>
              )}
            </div>
          </div>
        </div>

        {/* SAĞ TARAF */}
        <div className="space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-['Playfair_Display'] text-4xl text-[#8e7eb5] font-bold mb-2">Kişisel Koleksiyonum</h3>
              <p className="font-bold text-xs text-gray-400 italic">"Kendi ellerinle biriktirdiğin eşsiz parçalar."</p>
            </div>
            <button onClick={() => navigate("/add-item")} className="bg-[#8e7eb5] text-white p-3.5 rounded-2xl shadow-md hover:bg-[#7a6aa0] hover:-translate-y-0.5 transition-all flex items-center justify-center"><Plus size={20} /></button>
          </div>

          <div className="h-[2px] opacity-10 bg-[repeating-linear-gradient(45deg,#aad4e5,#aad4e5_10px,transparent_10px,transparent_20px)] rounded-full" />

          {myItems.length === 0 ? (
            <div className="text-center py-20 bg-white/40 border border-dashed border-gray-200 rounded-3xl">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Koleksiyonunuz henüz boş.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {myItems.map((item, index) => (
                <div key={item.id || index} className="bg-white/50 border border-[#e8dfd0] rounded-3xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative">
                  <button onClick={() => handleEditClick(item)} className="absolute top-6 left-6 z-20 bg-white/90 p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity text-[#8e7eb5] shadow-md hover:scale-110 active:scale-95"><Edit2 size={14} /></button>
                  <span className={`absolute top-6 right-6 z-10 text-[9px] font-black px-2 py-1 rounded-md text-white tracking-wider shadow-sm uppercase ${item.is_for_sale ? 'bg-emerald-500' : 'bg-gray-400'}`}>
                    {item.is_for_sale && item.price ? `₺${parseInt(item.price)}` : 'NFS'}
                  </span>
                  <div className="overflow-hidden rounded-2xl h-44 mb-4 bg-gray-100 shadow-inner cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
                    <img src={item.image_url || item.img || "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.title} />
                  </div>
                  <h4 className="font-['Playfair_Display'] text-base font-bold text-gray-800 leading-tight group-hover:text-[#8e7eb5] transition-colors truncate px-1">{item.title}</h4>
                  {item.condition && (
                    <div className="flex items-center gap-1 mt-1 px-1 text-[10px] font-bold text-[#8e7eb5]"><Sparkles size={10} /> <span>{item.condition}</span></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* YENİLENMİŞ VE PREMIUM POPUP MODAL (SİLME DESTEKLİ) */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-40 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-[#fdfaf3] rounded-[40px] p-8 w-full max-w-md shadow-2xl space-y-6 relative border border-black/5 max-h-[90vh] overflow-y-auto scrollbar-hide">
             
             {/* Kapatma Butonu */}
             <button onClick={() => setEditingItem(null)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-1 hover:bg-black/5 rounded-full transition-all">
               <X size={20} />
             </button>
             
             {/* Başlık */}
             <div className="text-center pt-2">
               <h3 className="font-['Playfair_Display'] text-3xl font-bold text-[#5a7b8f]">Parçayı Düzenle</h3>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Koleksiyon Detayları</p>
             </div>
             
             {/* Fotoğraf Alanı (Daha Estetik ve Dengeli Boyut) */}
             <div className="flex flex-col items-center justify-center space-y-2">
                <div className="relative group w-32 h-44 rounded-2xl overflow-visible shadow-md border-4 border-white bg-white">
                    <img 
                        src={editForm.img || editForm.image_url} 
                        className="w-full h-full rounded-xl object-cover" 
                        alt="Önizleme" 
                    />
                    <label 
                        htmlFor="product-edit-upload" 
                        className="absolute -bottom-2 -right-2 bg-[#8e7eb5] text-white p-2.5 rounded-xl shadow-lg hover:bg-[#7a6aa0] transition-all cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95"
                        title="Fotoğrafı Değiştir"
                    >
                        <Camera size={14} />
                        <input 
                            id="product-edit-upload" 
                            type="file" 
                            accept="image/*" 
                            onChange={handleProductEditFileChange} 
                            className="hidden" 
                        />
                    </label>
                </div>
                <p className="text-[9px] font-bold text-gray-400/80 uppercase tracking-wider pt-1">Değiştirmek için kameraya dokunun</p>
             </div>

             {/* Form Alanları */}
             <div className="space-y-4">
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-[#5a7b8f] uppercase tracking-wider block ml-1">Parça Adı</label>
                 <div className="relative flex items-center">
                   <User size={14} className="absolute left-4 text-[#5a7b8f]" />
                   <input className="w-full pl-11 pr-4 py-3 bg-white rounded-xl outline-none border border-black/5 font-semibold text-xs transition-all focus:border-[#8e7eb5] focus:ring-1 focus:ring-[#8e7eb5] text-gray-700 shadow-sm" value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} />
                 </div>
               </div>

               <div className="space-y-1">
                 <label className="text-[10px] font-black text-[#5a7b8f] uppercase tracking-wider block ml-1">Kategori</label>
                 <div className="relative flex items-center">
                   <FolderOpen size={14} className="absolute left-4 text-[#5a7b8f]" />
                   <select value={editForm.category} onChange={(e) => setEditForm({...editForm, category: e.target.value})} className="w-full pl-11 pr-4 py-3 bg-white rounded-xl outline-none border border-black/5 font-semibold text-xs appearance-none cursor-pointer focus:border-[#8e7eb5] focus:ring-1 focus:ring-[#8e7eb5] text-gray-700 shadow-sm">
                     {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                   </select>
                 </div>
               </div>

               <div className="space-y-1">
                 <label className="text-[10px] font-black text-[#5a7b8f] uppercase tracking-wider block ml-1">Kondisyon (Condition)</label>
                 <div className="relative flex items-center">
                   <Sparkles size={14} className="absolute left-4 text-[#5a7b8f]" />
                   <select value={editForm.condition} onChange={(e) => setEditForm({...editForm, condition: e.target.value})} className="w-full pl-11 pr-4 py-3 bg-white rounded-xl outline-none border border-black/5 font-semibold text-xs appearance-none cursor-pointer focus:border-[#8e7eb5] focus:ring-1 focus:ring-[#8e7eb5] text-gray-700 shadow-sm">
                     {conditions.map((cond) => <option key={cond} value={cond}>{cond}</option>)}
                   </select>
                 </div>
               </div>

               <div className="space-y-1">
                 <label className="text-[10px] font-black text-[#5a7b8f] uppercase tracking-wider block ml-1">Açıklama / Hikaye</label>
                 <div className="relative flex items-start">
                   <FileText size={14} className="absolute left-4 top-3.5 text-[#5a7b8f]" />
                   <textarea rows="3" className="w-full pl-11 pr-4 py-3 bg-white rounded-xl outline-none border border-black/5 font-semibold text-xs transition-all focus:border-[#8e7eb5] focus:ring-1 focus:ring-[#8e7eb5] resize-none font-sans text-gray-700 shadow-sm" value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} placeholder="Parça hakkında hikaye girin..." />
                 </div>
               </div>

               {/* Durum Checkbox'ları */}
               <div className="flex justify-between gap-4 bg-white p-3 rounded-xl border border-black/5 shadow-sm">
                 <label className="flex items-center gap-2 text-xs font-bold text-gray-500 cursor-pointer select-none">
                   <input type="checkbox" id="modal-sale" className="w-4 h-4 rounded text-[#8e7eb5] focus:ring-[#8e7eb5]" checked={editForm.is_for_sale} onChange={(e) => setEditForm({...editForm, is_for_sale: e.target.checked})} />
                   <span>SATILIK</span>
                 </label>
                 <label className="flex items-center gap-2 text-xs font-bold text-gray-500 cursor-pointer select-none">
                   <input type="checkbox" className="w-4 h-4 rounded text-[#8e7eb5] focus:ring-[#8e7eb5]" checked={editForm.is_for_swap} onChange={(e) => setEditForm({...editForm, is_for_swap: e.target.checked})} />
                   <span>TAKASLIK</span>
                 </label>
               </div>

               {editForm.is_for_sale && (
                 <div className="space-y-1 animate-in fade-in duration-300">
                   <label className="text-[10px] font-black text-emerald-600 uppercase tracking-wider block ml-1">Satış Fiyatı (₺)</label>
                   <input type="number" className="w-full p-3 bg-white rounded-xl outline-none border border-emerald-500/20 font-semibold text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-700 shadow-sm" value={editForm.price} onChange={(e) => setEditForm({...editForm, price: e.target.value})} placeholder="Fiyat (₺)" />
                 </div>
               )}
             </div>

             {/* Alt Aksiyon Butonları (Silme ve Kaydetme Yan Yana) */}
             <div className="flex items-center gap-3 pt-2">
               <button 
                 type="button" 
                 onClick={handleDeleteItem} 
                 className="p-3.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-colors flex items-center justify-center group"
                 title="Parçayı Sil"
               >
                 <Trash2 size={18} className="group-hover:scale-105 transition-transform" />
               </button>
               
               <button 
                 type="submit" 
                 onClick={handleUpdateItem} 
                 className="flex-1 bg-[#8e7eb5] text-white font-black text-xs py-4 rounded-xl shadow-md hover:bg-[#7a6aa0] transition-colors uppercase tracking-widest hover:-translate-y-0.5 active:translate-y-0 transition-all"
               >
                 GÜNCELLEMELERİ KAYDET
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Akıllı Kırpma Motoru Modalı */}
      {isCropperOpen && (
        <div className="relative z-50">
          <ImageCropperModal 
            imgSrc={tempImage} 
            onCropComplete={handleCropComplete} 
            aspect={cropperTarget === 'avatar' ? 1 : 2 / 3} 
            onClose={() => {
              setIsCropperOpen(false);
              setTempImage(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Profile;