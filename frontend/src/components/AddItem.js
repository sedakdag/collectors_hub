import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Image as ImageIcon, Camera, FolderOpen, Type, Coins, FileText, Sparkles, RefreshCw } from 'lucide-react';
import axios from 'axios';
import ImageCropperModal from './ImageCropperModal';

const AddItem = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Vinyl');
  const [condition, setCondition] = useState('Mint (10/10)'); 
  const [description, setDescription] = useState('');
  const [itemImg, setItemImg] = useState(null); 
  const [isForSale, setIsForSale] = useState(false);
  const [isForSwap, setIsForSwap] = useState(false);
  const [price, setPrice] = useState('');
  
  const [tempImage, setTempImage] = useState(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  const categories = ['Vinyl', 'Photocards', 'CDs', 'Vintage Tech', 'Postcards', 'Signed Art'];
  const conditions = ['Mint (10/10)', 'Near Mint (9/10)', 'Excellent (8/10)', 'Good (7/10)', 'Fair (6/10)'];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result);
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleCropComplete = (croppedBase64) => {
    setItemImg(croppedBase64);
    setIsCropperOpen(false);
    setTempImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Lütfen ürün adı girin!");
      return;
    }
    if (!itemImg) {
      alert("Lütfen bir koleksiyon fotoğrafı kırpın!");
      return;
    }

    const newItem = {
      title: title,
      category: category,
      img: itemImg,
      is_for_sale: isForSale,
      is_for_swap: isForSwap,
      price: isForSale && price ? parseFloat(price) : null,
      description: description,
      condition: condition,
      username: localStorage.getItem('username') || 'MISAFIR'
    };

    try {
      await axios.post("http://localhost:8080/api/items", newItem);
      alert("Yeni parça koleksiyonunuza başarıyla eklendi! 🚀");
      navigate('/profile'); 
    } catch (err) {
      console.error("Ürün eklenirken hata oluştu:", err);
      alert("Ürün eklenemedi, backend bağlantısını kontrol edin.");
    }
  };

  return (
    <div className="h-screen w-full bg-[#fdfaf3] font-['Montserrat'] text-[#333] p-10 overflow-y-auto flex flex-col items-center">
      <div className="w-full max-w-xl mb-6 mt-4 flex-shrink-0">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-[#5a7b8f] font-black uppercase text-xs tracking-widest hover:text-[#8e7eb5] transition-colors"
        >
          <ArrowLeft size={16} /> Geri Dön
        </button>
      </div>

      <div className="bg-[#dcd0ef]/40 backdrop-blur-md rounded-[45px] p-10 border border-black/5 w-full max-w-xl shadow-2xl mb-16">
        <div className="text-center mb-8">
          <h2 className="font-['Playfair_Display'] text-4xl text-[#8e7eb5] font-bold mb-2">Koleksiyona Ekle</h2>
          <p className="font-bold text-xs text-gray-400 italic">"Hazinene yeni bir parça daha kazandır."</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* FOTOĞRAF SEÇME */}
          <div className="flex flex-col items-center justify-center">
            {itemImg ? (
              <div className="relative group w-44 h-60">
                <img src={itemImg} className="w-full h-full rounded-2xl object-cover border-4 border-white shadow-2xl" alt="Önizleme" />
                <label htmlFor="item-upload" className="absolute -bottom-2 -right-2 bg-[#5a7b8f] text-white p-2.5 rounded-xl shadow-lg hover:bg-[#486374] transition-colors cursor-pointer flex items-center justify-center">
                  <Camera size={16} />
                </label>
              </div>
            ) : (
              <label htmlFor="item-upload" className="w-44 h-60 border-2 border-dashed border-[#8e7eb5]/40 rounded-2xl flex flex-col items-center justify-center bg-white/50 cursor-pointer hover:bg-white hover:border-[#8e7eb5] transition-all group shadow-inner">
                <ImageIcon size={32} className="text-[#8e7eb5]/40 group-hover:text-[#8e7eb5] transition-colors mb-2" />
                <span className="text-[10px] font-black text-gray-400 group-hover:text-[#8e7eb5] uppercase tracking-wider transition-colors">Görsel Seç</span>
              </label>
            )}
            <input id="item-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>

          {/* PARÇA ADI */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-[#8e7eb5] uppercase tracking-wider block ml-1">Parçanın Adı</label>
            <div className="relative flex items-center">
              <Type size={16} className="absolute left-4 text-[#8e7eb5]" />
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: Pink Floyd - The Dark Side of the Moon"
                className="w-full text-xs font-semibold pl-12 pr-4 py-4 rounded-xl border border-[#8e7eb5]/20 bg-white outline-none focus:border-[#8e7eb5] shadow-sm transition-all"
                required
              />
            </div>
          </div>

          {/* KATEGORİ VE KONDİSYON */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-[#8e7eb5] uppercase tracking-wider block ml-1">Kategori</label>
              <div className="relative flex items-center">
                <FolderOpen size={16} className="absolute left-4 text-[#8e7eb5]" />
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full text-xs font-semibold pl-12 pr-4 py-4 rounded-xl border border-[#8e7eb5]/20 bg-white outline-none focus:border-[#8e7eb5] cursor-pointer shadow-sm appearance-none">
                  {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-[#8e7eb5] uppercase tracking-wider block ml-1">Kondisyon</label>
              <div className="relative flex items-center">
                <Sparkles size={16} className="absolute left-4 text-[#8e7eb5]" />
                <select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full text-xs font-semibold pl-12 pr-4 py-4 rounded-xl border border-[#8e7eb5]/20 bg-white outline-none focus:border-[#8e7eb5] cursor-pointer shadow-sm appearance-none">
                  {conditions.map((cond) => <option key={cond} value={cond}>{cond}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* AÇIKLAMA ALANI */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-[#8e7eb5] uppercase tracking-wider block ml-1">Açıklama / Hikaye</label>
            <div className="relative flex items-start">
              <FileText size={16} className="absolute left-4 top-4 text-[#8e7eb5]" />
              <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Bu parçanın senin için anlamı ne? (Kondisyon detayları vb.)" className="w-full text-xs font-semibold pl-12 pr-4 py-4 rounded-xl border border-[#8e7eb5]/20 bg-white outline-none focus:border-[#8e7eb5] shadow-sm transition-all resize-none font-sans" />
            </div>
          </div>

          {/* PAZARYERİ DURUM SEÇENEKLERİ */}
          <div className="space-y-4 bg-white/50 p-4 rounded-2xl border border-[#8e7eb5]/10 shadow-inner">
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={isForSale} onChange={(e) => setIsForSale(e.target.checked)} className="w-4 h-4 rounded text-[#8e7eb5]" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">SATILIK</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={isForSwap} onChange={(e) => setIsForSwap(e.target.checked)} className="w-4 h-4 rounded text-[#8e7eb5]" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider flex items-center gap-1"><RefreshCw size={12}/> TAKASLIK</span>
              </label>
            </div>

            {isForSale && (
              <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-[9px] font-black text-emerald-600 uppercase tracking-wider block ml-1">Satış Fiyatı (₺)</label>
                <div className="relative flex items-center">
                  <Coins size={16} className="absolute left-4 text-emerald-500" />
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Fiyat belirleyin" className="w-full text-xs font-semibold pl-12 pr-4 py-4 rounded-xl border border-emerald-500/20 bg-white outline-none" required={isForSale} />
                </div>
              </div>
            )}
          </div>

          {/* KAYDET BUTONU */}
          <div className="pt-2 pb-6">
            <button type="submit" className="w-full bg-[#8e7eb5] text-white text-[11px] font-black py-4 rounded-xl shadow-lg hover:bg-[#7a6aa0] transition-all flex items-center justify-center gap-2 uppercase tracking-widest"><Plus size={16} /> Koleksiyona Kat</button>
          </div>

        </form>
      </div>

      {/* Kırpıcı Modalı */}
      {isCropperOpen && (
        <ImageCropperModal imgSrc={tempImage} onCropComplete={handleCropComplete} aspect={2 / 3} onClose={() => { setIsCropperOpen(false); setTempImage(null); }} />
      )}
    </div>
  );
};

export default AddItem;