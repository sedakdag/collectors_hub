import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex h-screen bg-[#fdfaf3] font-['Montserrat']">
      {/* SOL TARAF - Estetik Görsel Alanı */}
      <div className="hidden lg:flex w-1/2 bg-[#c5e3f4] items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-[#dfd3ef] rounded-full opacity-40 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#b7a2d6] rounded-full opacity-30 blur-3xl" />
        
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
            <h2 className="text-3xl font-black text-[#8e7eb5] tracking-tight">
              {isLogin ? 'Hoş Geldin!' : 'Aramıza Katıl'}
            </h2>
            <p className="text-gray-400 text-sm mt-2 font-medium uppercase tracking-[2px]">
              {isLogin ? 'Hesabına giriş yap' : 'Koleksiyonuna başlamak için kayıt ol'}
            </p>
          </div>

          <form className="mt-8 space-y-4">
            {!isLogin && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8e7eb5] transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="İsim Soyisim" 
                  className="w-full bg-white border border-[#e8dfd0] rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[#8e7eb5]/20 focus:border-[#8e7eb5] transition-all font-medium text-sm shadow-sm"
                />
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8e7eb5] transition-colors" size={18} />
              <input 
                type="email" 
                placeholder="E-posta Adresi" 
                className="w-full bg-white border border-[#e8dfd0] rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[#8e7eb5]/20 focus:border-[#8e7eb5] transition-all font-medium text-sm shadow-sm"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8e7eb5] transition-colors" size={18} />
              <input 
                type="password" 
                placeholder="Şifre" 
                className="w-full bg-white border border-[#e8dfd0] rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[#8e7eb5]/20 focus:border-[#8e7eb5] transition-all font-medium text-sm shadow-sm"
              />
            </div>

            <button className="w-full bg-[#8e7eb5] text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-[#7a6aa0] hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2 group">
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