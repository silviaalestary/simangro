'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  sender: 'bot' | 'user';
  text: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Halo! 👋 Saya SimangroBot. Ada yang bisa saya bantu terkait informasi mangrove hari ini?' }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll ke bawah setiap ada pesan baru
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const menuOptions = [
    {
      id: 1,
      title: '📖 Cara & Jarak Tanam',
      reply: 'Untuk jenis Rhizophora (Bakau), jarak tanam ideal adalah 1x1 meter atau 2x1 meter. Pastikan menggunakan ajir (batang bambu) agar bibit tidak hanyut terbawa arus. 🌿'
    },
    {
      id: 2,
      title: '🦀 Mengatasi Hama',
      reply: 'Hama kepiting sering memotong batang bibit muda. Solusinya, bungkus batang bawah dengan potongan botol plastik atau bambu setinggi 20-30 cm. 🛡️'
    },
    {
      id: 3,
      title: '📊 Data Penanaman KKP',
      reply: 'Sejauh ini, KKP telah mendukung penanaman mangrove seluas lebih dari 2.449,03 Hektar di seluruh Indonesia (Plafon 2020-2024). Luar biasa, kan? 🇮🇩'
    },
    {
      id: 4,
      title: '📍 Lokasi PRPEP',
      reply: 'Simangro mencatat lokasi Pusat Restorasi dan Pengembangan Ekosistem Pesisir (PRPEP) di berbagai daerah. Anda bisa melihat sebarannya di halaman "Peta Aksi". 🗺️'
    }
  ];

  const handleMenuClick = (title: string, reply: string) => {
    setMessages((prev) => [...prev, { sender: 'user', text: title }]);

    // Simulasi bot sedang berpikir
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-slide-in { animation: slideIn 0.3s ease-out forwards; }
        .animate-pulse-slow { animation: pulse-slow 3s infinite ease-in-out; }
      `}</style>

      {/* Button Launcher */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:rotate-12 animate-pulse-slow group"
          title="Buka SimangroBot"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-85 sm:w-96 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-green-100 flex flex-col overflow-hidden animate-slide-in max-h-[80vh]">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white p-5 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">SimangroBot</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-black/10 p-2 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Conversation Area */}
          <div
            ref={scrollRef}
            className="flex-1 p-5 overflow-y-auto bg-gray-50/50 flex flex-col gap-4 min-h-[300px]"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'bot'
                    ? 'bg-white border border-green-50 self-start text-gray-700 rounded-tl-none'
                    : 'bg-green-600 self-end text-white rounded-tr-none'
                  }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Menu Options */}
          <div className="p-4 bg-white border-t border-gray-100 flex flex-col gap-2.5">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1">Pilih Informasi:</p>
            <div className="flex flex-col gap-2">
              {menuOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleMenuClick(opt.title, opt.reply)}
                  className="text-left text-sm bg-white hover:bg-green-50 text-green-700 p-3 rounded-xl border border-green-100 hover:border-green-300 transition-all duration-200 hover:shadow-md active:scale-[0.98]"
                >
                  {opt.title}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-2 text-center border-t border-gray-100">
            <p className="text-[10px] text-gray-400">© 2024 Simangro KKP RI</p>
          </div>
        </div>
      )}
    </div>
  );
}
