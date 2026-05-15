import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import axios from 'axios'; // Axios'u import etmeyi unutma: npm install axios
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // Form verilerini tutacak state'ler
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  // --- BACKEND BAĞLANTI FONKSİYONU ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Sayfanın yenilenmesini engelle
    
    const endpoint = isLogin ? '/login' : '/signup';
    const payload = isLogin 
      ? { email, password } 
      : { email, password, username };

    try {
      // Auth.js içinde
        const response = await axios.post(`http://127.0.0.1:8080${endpoint}`, payload);
      
      if (isLogin) {
        // Giriş başarılıysa token'ı sakla ve Dashboard'a yönlendir
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('username', response.data.username);
        navigate('/'); 
      } else {
        // Kayıt başarılıysa Login moduna geç
        alert("Kayıt başarılı! Şimdi giriş yapabilirsin.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.detail || "Bir hata oluştu!");
    }
  };

  return (
    <div className="flex h-screen bg-[#fdfaf3] font-['Montserrat']">
      {/* SOL TARAF - Dashboard ile aynı estetik */}
      <div className="hidden lg:flex w-1/2 bg-[#c5e3f4] items-center justify-center p-12 relative overflow-hidden">
        <div className="relative z-10 text-center">
          <h1 className="font-['Playfair_Display'] text-6xl text-[#5a7b8f] font-bold mb-6">Collector's Hub</h1>
          <p className="text-[#5a7b8f] text-lg font-medium italic opacity-80 tracking-wide">
            "Anılarını biriktir, geleceğe sakla."
          </p>
        </div>
      </div>

      {/* SAĞ TARAF - Form Alanı */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="text-center">
            <h2 className="text-3xl font-black text-[#8e7eb5]">
              {isLogin ? 'Hoş Geldin!' : 'Aramıza Katıl'}
            </h2>
          </div>

          {/* onSubmit kısmına fonksiyonu bağladık */}
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="İsim Soyisim" 
                  className="w-full bg-white border border-[#e8dfd0] rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#8e7eb5] transition-all font-medium text-sm shadow-sm"
                  required
                />
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta Adresi" 
                className="w-full bg-white border border-[#e8dfd0] rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#8e7eb5] transition-all font-medium text-sm shadow-sm"
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifre" 
                className="w-full bg-white border border-[#e8dfd0] rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#8e7eb5] transition-all font-medium text-sm shadow-sm"
                required
              />
            </div>

            <button type="submit" className="w-full bg-[#8e7eb5] text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-[#7a6aa0] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group">
              {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="text-center mt-6">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[12px] font-black text-gray-400 hover:text-[#8e7eb5] transition-colors uppercase tracking-widest"
            >
              {isLogin ? 'Henüz bir hesabın yok mu? Kaydol' : 'Zaten üye misin? Giriş yap'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;