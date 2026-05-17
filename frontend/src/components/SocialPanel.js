import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Users, UserPlus, UserMinus, Search, MessageSquare, Award, ArrowLeft, Send, X } from "lucide-react";

const SocialPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const current_user = localStorage.getItem('username') || 'koleksiyoner1';

  const [friends, setFriends] = useState([]);
  const [allUsers, setAllUsers] = useState([
    { id: 4, name: "Koleksiyoner Can", role: "Vintage Tech Guru", avatar: "https://i.pravatar.cc/100?img=12" },
    { id: 5, name: "Ece Ünal", role: "Photocard Hunter", avatar: "https://i.pravatar.cc/100?img=26" },
    { id: 6, name: "Berke Aslan", role: "Comic Book Fan", avatar: "https://i.pravatar.cc/100?img=33" },
    { id: 7, name: "Zeynep Yılmaz", role: "Signed Art Lover", avatar: "https://i.pravatar.cc/100?img=43" }
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatHistories, setChatHistories] = useState({
    1: [
      { id: 101, sender: "them", text: "Selam! Abbey Road plağı için takas düşünür müsün?" },
      { id: 102, sender: "me", text: "Selam! Hangi plaklarla takas yapmak istediğine bağlı aslında, elimde listesi var." }
    ]
  });
  const [activeChat, setActiveChat] = useState(null); 
  const [newMessage, setNewMessage] = useState("");

  const loadFriendsFromDB = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/friends?username=${current_user}`);
      setFriends(response.data);
    } catch (err) {
      console.error("Veritabanından arkadaşlar çekilirken hata oluştu:", err);
    }
  };

  useEffect(() => {
    loadFriendsFromDB();
  }, [current_user]);

  useEffect(() => {
    const handleContextualChat = async () => {
      if (location.state?.openChatWith) {
        const ownerName = location.state.openChatWith;
        const foundFriend = friends.find((f) => f.name.toLowerCase() === ownerName.toLowerCase());

        if (foundFriend) {
          setActiveChat(foundFriend);
        } else {
          try {
            await axios.post("http://localhost:8080/api/friends", {
              username: current_user,
              friend_name: ownerName
            });
            const response = await axios.get(`http://localhost:8080/api/friends?username=${current_user}`);
            setFriends(response.data);
            const newlyAdded = response.data.find(f => f.name.toLowerCase() === ownerName.toLowerCase());
            if (newlyAdded) {
              setActiveChat(newlyAdded);
              setChatHistories(prev => ({
                ...prev,
                [newlyAdded.id]: [{ id: 999, sender: "them", text: `Selam! Koleksiyonumdaki parça hakkında konuşmak istemiştin, dinliyorum.` }]
              }));
            }
          } catch (err) {
            console.error("Contextual chat hatası:", err);
          }
        }
      }
    };
    if (friends.length > 0 || location.state?.openChatWith) {
      handleContextualChat();
    }
  }, [location.state, friends.length]);

  const filteredSuggestions = allUsers.filter(user => {
    const isNotFriend = !friends.some(f => f.name.toLowerCase() === user.name.toLowerCase());
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.role.toLowerCase().includes(searchQuery.toLowerCase());
    return isNotFriend && matchesSearch;
  });

  const handleAddFriend = async (user) => {
    try {
      await axios.post("http://localhost:8080/api/friends", { username: current_user, friend_name: user.name });
      await loadFriendsFromDB();
    } catch (err) { console.error(err); }
  };

  const handleRemoveFriend = async (friendId, friendName) => {
    try {
      await axios.delete("http://localhost:8080/api/friends", { data: { username: current_user, friend_name: friendName } });
      if (activeChat && activeChat.id === friendId) setActiveChat(null);
      await loadFriendsFromDB();
    } catch (err) { console.error(err); }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;
    const currentChatId = activeChat.id;
    setChatHistories(prev => ({
      ...prev,
      [currentChatId]: [...(prev[currentChatId] || []), { id: Date.now(), sender: "me", text: newMessage }]
    }));
    setNewMessage("");
  };

  const activeMessages = activeChat ? (chatHistories[activeChat.id] || []) : [];

  return (
    <div className="min-h-screen bg-[#fdfaf3] p-6 md:p-12 font-['Montserrat'] text-[#333] relative overflow-hidden flex flex-col h-screen">
      <header className="flex justify-between items-center mb-8 w-full max-w-5xl mx-auto flex-shrink-0">
        <button onClick={() => navigate("/", { state: null })} className="flex items-center gap-2 text-xs font-black tracking-widest text-gray-400 uppercase hover:text-[#8e7eb5] transition-colors cursor-pointer">
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="font-['Playfair_Display'] text-4xl text-[#8e7eb5] font-bold flex items-center gap-3">
          <Users size={32} /> Social Hub
        </h1>
        <div className="w-16"></div>
      </header>

      <div className="w-full max-w-5xl mx-auto flex-1 flex gap-8 relative overflow-hidden h-[calc(100vh-180px)] pb-6">
        <main className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 h-full overflow-hidden">
          
          {/* SÖL PANEL: SCROLLABLE ARKADAŞLAR */}
          <section className="md:col-span-2 bg-white/40 border border-[#e8dfd0] rounded-[40px] p-6 md:p-8 backdrop-blur-md flex flex-col h-full overflow-hidden">
            <h2 className="font-['Playfair_Display'] text-2xl font-bold mb-6 text-gray-800 flex-shrink-0">Your Collector Friends</h2>
            <div className="flex flex-col gap-4 overflow-y-auto flex-1 pr-1 scrollbar-none">
              {friends.map(friend => (
                <div key={friend.id} className="bg-white/90 rounded-[24px] p-4 flex items-center justify-between shadow-sm border border-white/30 hover:shadow-md transition-all group flex-shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img src={friend.avatar} alt={friend.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm" />
                      {friend.online && <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white animate-pulse" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-800 group-hover:text-[#8e7eb5] transition-colors">{friend.name}</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{friend.role || "Collector Partner"}</p>
                      <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-gray-500">
                        <Award size={12} className="text-[#d4a373]" />
                        <span>{friend.itemscount || 0} Collectibles</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setActiveChat(friend)} className="p-3 bg-[#c5e3f4] text-[#5a7b8f] rounded-xl hover:bg-[#5a7b8f] hover:text-white transition-all shadow-sm cursor-pointer">
                      <MessageSquare size={16} />
                    </button>
                    <button onClick={() => handleRemoveFriend(friend.id, friend.name)} className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-400 hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100 cursor-pointer">
                      <UserMinus size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {friends.length === 0 && (
                <p className="text-center py-10 text-gray-400 italic font-['Playfair_Display'] text-lg">Yalnız bir koleksiyonersiniz.. Hemen arkadaş bulun!</p>
              )}
            </div>
          </section>

          {/* SAĞ PANEL: SCROLLABLE ÖNERİLEN KULLANICILAR */}
          <section className="bg-[#b7a2d6] rounded-[40px] p-6 md:p-8 text-white flex flex-col shadow-xl h-full overflow-hidden">
            <h2 className="font-['Playfair_Display'] text-2xl font-bold mb-6 flex-shrink-0">Find Collectors</h2>
            <div className="bg-white/20 border border-white/10 rounded-2xl px-4 py-3 flex items-center w-full shadow-inner mb-6 flex-shrink-0">
              <Search size={16} className="text-white/70" />
              <input className="bg-transparent border-none outline-none text-xs ml-3 w-full placeholder-white/60 text-white font-medium" placeholder="Search by name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <p className="text-[9px] tracking-[2px] font-black opacity-60 mb-4 uppercase flex-shrink-0">Suggested For You</p>
            <div className="flex flex-col gap-4 overflow-y-auto flex-1 pr-1 scrollbar-none">
              {filteredSuggestions.map(user => (
                <div key={user.id} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:bg-white/20 transition-all flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <h4 className="text-xs font-bold">{user.name}</h4>
                      <p className="text-[9px] text-white/60 font-medium mt-0.5">{user.role}</p>
                    </div>
                  </div>
                  <button onClick={() => handleAddFriend(user)} className="p-2 bg-white text-[#8e7eb5] rounded-xl hover:scale-110 transition-all shadow-md cursor-pointer">
                    <UserPlus size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* CHAT PANEL MODAL */}
        <div className={`fixed top-0 right-0 h-full w-[380px] bg-white shadow-2xl border-l border-[#e8dfd0] z-50 transition-transform duration-500 flex flex-col ${activeChat ? "translate-x-0" : "translate-x-full"}`}>
          {activeChat && (
            <>
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#c5e3f4]/30 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <img src={activeChat.avatar} alt={activeChat.name} className="w-10 h-10 rounded-xl object-cover border border-white shadow-sm" />
                  <div>
                    <h3 className="font-bold text-sm text-gray-800">{activeChat.name}</h3>
                    <span className="text-[9px] text-green-500 font-extrabold tracking-wider uppercase">{activeChat.role || "Collector Partner"}</span>
                  </div>
                </div>
                <button onClick={() => setActiveChat(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-all cursor-pointer"><X size={18} /></button>
              </div>
              <div className="flex-1 p-6 overflow-y-auto bg-[#fdfaf3]/50 flex flex-col gap-4">
                {activeMessages.map((msg) => (
                  <div key={msg.id} className={`max-w-[80%] p-3.5 rounded-[20px] text-xs font-medium shadow-sm leading-relaxed ${msg.sender === "me" ? "bg-[#8e7eb5] text-white rounded-br-none self-end" : "bg-white text-gray-700 rounded-bl-none border border-gray-100 self-start"}`}>{msg.text}</div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white flex gap-3 items-center flex-shrink-0">
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="flex-1 bg-[#fdfaf3] border border-[#e8dfd0] rounded-xl px-4 py-3 text-xs outline-none font-medium focus:border-[#8e7eb5] transition-all" placeholder={`Write a message to ${activeChat.name}...`} />
                <button type="submit" className="p-3 bg-[#8e7eb5] text-white rounded-xl hover:bg-[#7a6aa0] transition-all shadow-md cursor-pointer"><Send size={14} /></button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialPanel;