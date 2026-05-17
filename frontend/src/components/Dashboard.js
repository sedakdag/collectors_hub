import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  LayoutGrid, Bell, Bookmark, Users, Compass, Search, // Settings yerine Compass geldi
  Plus, LogOut, Disc, Images, DiscAlbum, Laptop, Mail, PenTool, User
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'MISAFIR';
  
  // İlk kayıtta veya yoksa boş profil resmi (No-Photo)
  const userAvatar = localStorage.getItem('avatar') || "https://api.dicebear.com/7.x/bottts/svg?seed=NoPhoto";

  const [featuredItems, setFeaturedItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/items");
        setFeaturedItems(response.data);
      } catch (err) {
        console.error("Koleksiyon parçaları çekilirken hata oluştu:", err);
      }
    };
    fetchItems();
  }, []);
  
  return (
    <div className="flex h-screen bg-[#fdfaf3] font-['Montserrat'] overflow-hidden text-[#333]">
      {/* SIDEBAR */}
      <aside className="w-[85px] bg-[#c5e3f4] flex flex-col items-center py-8 border-r border-black/5">
        {/* Üstteki Profil Bilgisi */}
        <div className="flex flex-col items-center mb-10 cursor-pointer" onClick={() => navigate("/profile")}>
          <img src={userAvatar} className="w-11 h-11 rounded-xl border-2 border-white shadow-sm object-cover" alt={username} />
          <span className="text-[10px] font-black text-[#5a7b8f] mt-2 tracking-widest uppercase text-center max-w-[75px] truncate">
            {username}
          </span>
        </div>
        
        <nav className="flex flex-col gap-6 flex-1 items-center w-full">
          <div className="w-12 h-12 flex items-center justify-center bg-[#fdfaf3] rounded-2xl shadow-md text-[#5a7b8f] relative cursor-pointer">
            <LayoutGrid size={22} />
            <div className="absolute bottom-2 w-3 h-[2px] bg-[#5a7b8f] rounded" />
          </div>
          <NavItem icon={<Bell size={22} />} />
          <NavItem icon={<Bookmark size={22} />} />
          
          <div onClick={() => navigate("/social")} className="w-full flex justify-center cursor-pointer">
            <NavItem icon={<Users size={22} />} />
          </div>
          
          {/* Arkadaşının Keşfet Alanı - İkon Pusula (Compass) Oldu */}
          <div onClick={() => navigate("/explore")} className="w-full flex justify-center cursor-pointer">
            <NavItem icon={<Compass size={22} />} />
          </div>
        </nav>

        {/* En Alttaki Profil ve Çıkış Bölümü */}
        <div className="flex flex-col items-center gap-6">
          {/* Profil İkonu: Basınca profil sayfasına fırlatır */}
          <div onClick={() => navigate("/profile")} className="cursor-pointer text-[#5a7b8f] hover:scale-110 transition-transform">
            <User size={24} />
          </div>
          
          <div onClick={() => {
            localStorage.clear();
            navigate("/login");
          }} className="text-[#5a7b8f] cursor-pointer hover:text-red-400 transition-colors">
            <LogOut size={22} />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 overflow-y-auto scrollbar-hide">
        <header className="flex justify-between items-start mb-10">
          <div>
            <h1 className="font-['Playfair_Display'] text-5xl text-[#8e7eb5] font-bold">Collector's Hub</h1>
            <p className="font-bold text-sm mt-2 text-gray-400 italic">"Tarihin izini sürenlerin buluşma noktası."</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="bg-white/70 backdrop-blur-md border border-[#8e7eb5]/10 rounded-2xl px-5 py-3 flex items-center w-80 shadow-sm focus-within:shadow-md transition-all">
              <Search size={18} className="text-gray-300" />
              <input className="bg-transparent border-none outline-none text-xs ml-3 w-full font-medium" placeholder="Koleksiyonunda ara..." />
            </div>
            
            {/* Hızlı Ürün Ekleme Butonu (Plus) - Tam jürilik şov alanı */}
            <button 
              onClick={() => navigate("/add-item")}
              className="bg-[#8e7eb5] text-white p-3 rounded-2xl shadow-md hover:bg-[#7a6aa0] hover:-translate-y-0.5 transition-all flex items-center justify-center"
              title="Yeni Parça Ekle"
            >
              <Plus size={20} />
            </button>

            <div className="flex items-center gap-3 bg-white/40 px-4 py-2 rounded-2xl border border-white/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-gray-500">ONLINE</span>
              </div>
              <div className="flex items-center">
                {[12, 15, 20].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i}`} className="w-7 h-7 rounded-full border-2 border-white -ml-2 first:ml-0 shadow-sm" alt="" />
                ))}
                <div className="w-7 h-7 rounded-full bg-[#dfd3ef] border-2 border-white -ml-2 flex items-center justify-center text-[#8e7eb5] text-[10px] font-black shadow-sm">+</div>
              </div>
            </div>
          </div>
        </header>

        <div className="h-[4px] mb-12 opacity-10 bg-[repeating-linear-gradient(45deg,#aad4e5,#aad4e5_10px,transparent_10px,transparent_20px)] rounded-full" />

        {/* HERO SECTION */}
        <section className="flex justify-start gap-12 mb-16 px-4">
          {featuredItems.map((item, index) => (
            <div key={item.id || index} className="relative w-44 h-60 flex items-center group cursor-pointer">
              <span className="absolute text-[160px] font-extrabold text-[#ece4d4] -left-8 top-1/2 -translate-y-1/2 opacity-60 select-none font-sans leading-none z-0">
                {index + 1}
              </span>
              <div className="relative z-10 ml-6 transition-all duration-500 group-hover:-translate-y-4 group-hover:rotate-2">
                <div className="absolute -top-1 right-4 w-5 h-8 bg-[#d4c1ee] [clip-path:polygon(0_0,100%_0,100%_100%,50%_80%,0_100%)] z-20 shadow-sm" />
                <img src={item.img || "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400"} className="w-36 h-52 rounded-2xl object-cover shadow-2xl border-white border-[3px]" alt={item.title} />
              </div>
            </div>
          ))}
        </section>

        {/* BOTTOM ROW */}
        <div className="grid grid-cols-[1.2fr_1fr] gap-12">
          <div>
            <h3 className="font-extrabold text-sm mb-6 tracking-widest text-gray-400 uppercase">Continue Browsing..</h3>
            <button 
                onClick={() => navigate("/explore")}
                className="block mb-8 text-[11px] font-black bg-[#dfd3ef] text-[#8e7eb5] px-4 py-2 rounded-xl hover:bg-[#8e7eb5] hover:text-white hover:shadow-md transition-all uppercase tracking-wider"
              >
                See All
              </button>
              
            <div className="flex gap-6">
              <BrowseCard title="Pink Floyd - Vinyl" img="https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png" />
              <BrowseCard title="K-pop Group Photo" img="https://i.pinimg.com/736x/8c/1a/0c/8c1a0c36081e793910c8502f672323e2.jpg" />
            </div>
          </div>

          <div>
            <h3 className="font-extrabold text-sm mb-6 tracking-widest text-gray-400 uppercase">Popular Categories</h3>
            <div className="grid grid-cols-2 gap-4">
              <CatButton label="Vinyl" icon={<Disc size={16}/>} color="bg-[#b8e2f2]" />
              <CatButton label="Photocards" icon={<Images size={16}/>} color="bg-[#dcd0ef]" />
              <CatButton label="CDs" icon={<DiscAlbum size={16}/>} color="bg-[#dcd0ef]" />
              <CatButton label="Vintage Tech" icon={<Laptop size={16}/>} color="bg-[#b8e2f2]" />
              <CatButton label="Postcards" icon={<Mail size={16}/>} color="bg-[#b8e2f2]" />
              <CatButton label="Signed Art" icon={<PenTool size={16}/>} color="bg-[#dcd0ef]" />
            </div>
          </div>
        </div>
      </main>

      {/* RIGHT PANEL */}
      <aside className="w-[380px] p-6">
        <div className="bg-[#b7a2d6] h-full rounded-[45px] p-8 flex flex-col shadow-2xl transition-all duration-700">
          <div className="flex justify-between items-center text-white mb-10">
            <h2 className="text-xl font-extrabold tracking-tight">Friends' Recommendations</h2>
            <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black backdrop-blur-md border border-white/20">3 NEW</div>
          </div>
          
          <div className="flex flex-col gap-5">
            <RecommendationCard title="FIVE FEET APART" author="Rachael Lippincott" img="https://m.media-amazon.com/images/I/81L7-oZ+uHL.jpg" />
            <RecommendationCard title="ME BEFORE YOU" author="Jojo Moyes" img="https://m.media-amazon.com/images/I/81unp8f+YtL.jpg" />
            <RecommendationCard title="THE HUMAN BRAIN" author="David Eagleman" img="https://m.media-amazon.com/images/I/71uV4p5Uu1L.jpg" />
          </div>

          <div className="mt-auto pt-10 text-center text-white border-t border-white/10">
            <p className="text-[9px] tracking-[4px] font-black opacity-60">QUOTES FOR COLLECTORS</p>
            <p className="font-['Playfair_Display'] text-4xl my-4 italic font-bold">Bad Ideas</p>
            <div className="flex justify-center gap-1 mb-4 opacity-40">
              <span className="w-1 h-1 bg-white rounded-full"></span>
              <span className="w-1 h-1 bg-white rounded-full"></span>
              <span className="w-1 h-1 bg-white rounded-full"></span>
            </div>
            <p className="text-[10px] font-bold opacity-70 leading-relaxed uppercase tracking-tighter">But only if there are enough of them</p>
          </div>
        </div>
      </aside>
    </div>
  );
};

// --- Alt Bileşenler (Değişmeyenler) ---
const NavItem = ({ icon }) => (
  <div className="w-12 h-12 flex items-center justify-center text-gray-400 opacity-60 hover:opacity-100 hover:text-[#5a7b8f] cursor-pointer transition-all hover:bg-white/50 rounded-xl">
    {icon}
  </div>
);

const BrowseCard = ({ title, img }) => {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate("/product")} className="flex-1 bg-white/40 border border-[#e8dfd0] rounded-2xl p-4 transition-all duration-300 cursor-pointer group hover:bg-white hover:shadow-xl hover:-translate-y-2">
      <div className="overflow-hidden rounded-xl h-28 mb-4 shadow-inner">
          <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={title} />
      </div>
      <h4 className="font-['Playfair_Display'] text-[15px] font-bold leading-tight group-hover:text-[#8e7eb5] transition-colors">{title}</h4>
    </div>
  );
};

const CatButton = ({ label, icon, color }) => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate("/explore", { state: { category: label } })} className={`${color} px-4 py-4 rounded-2xl font-bold text-[11px] hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3 border border-white/20 shadow-sm cursor-pointer`}>
      <span className="opacity-60">{icon}</span>
      {label}
    </button>
  );
};

const RecommendationCard = ({ title, author, img }) => {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate("/social")} className="bg-white/90 backdrop-blur-sm rounded-[24px] p-5 flex gap-4 shadow-sm hover:shadow-2xl hover:scale-[1.05] hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-white/30 group">
      <img src={img} className="w-12 h-16 rounded-lg object-cover shadow-md flex-shrink-0 group-hover:rotate-2 transition-transform" alt={title} />
      <div className="flex flex-col justify-center">
        <h4 className="text-[12px] font-black leading-tight text-gray-800 group-hover:text-[#8e7eb5] transition-colors">{title}</h4>
        <p className="text-[9px] text-gray-400 font-bold uppercase mt-1 tracking-tighter">{author}</p>
        <div className="flex mt-3 -space-x-1 opacity-80">
           <img src="https://i.pravatar.cc/100?img=11" className="w-5 h-5 rounded-full border border-white shadow-sm" alt=""/>
           <img src="https://i.pravatar.cc/100?img=32" className="w-5 h-5 rounded-full border border-white shadow-sm" alt=""/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;