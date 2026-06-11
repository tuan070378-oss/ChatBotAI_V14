import React from 'react';
import { Home, Moon, Sun, Volume2, VolumeX, Database } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ChatHeaderProps {
  autoSpeak: boolean;
  setAutoSpeak: (val: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  hasMessages: boolean;
  onHome: () => void;
  isRagOpen: boolean;
  setIsRagOpen: (val: boolean) => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  autoSpeak,
  setAutoSpeak,
  isDarkMode,
  setIsDarkMode,
  hasMessages,
  onHome,
  isRagOpen,
  setIsRagOpen
}) => {
  return (
    <header className="relative z-20 bg-white/10 dark:bg-white/[0.03] backdrop-blur-xl border-b border-white/10 dark:border-white/5 px-6 py-4 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-colors">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="font-heading font-extrabold text-gray-900 dark:text-white text-base leading-tight tracking-tight">
            AI <span className="text-cyan-500 font-bold">•</span> Trợ lý Học tập
          </h1>
          <p className="text-[9px] text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Lê Tuấn CK • Cơ khí kỹ thuật thực tiễn</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setIsRagOpen(!isRagOpen)}
          className={cn(
            "p-2 px-3 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold focus:ring-2 focus:ring-cyan-500/50 outline-none backdrop-blur-md border cursor-pointer",
            isRagOpen 
              ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
              : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-white/5 dark:bg-white/[0.02] border-white/10 dark:border-white/5"
          )}
          aria-label={isRagOpen ? "Đóng kho RAG" : "Quản trị kho RAG"}
          title={isRagOpen ? "Đóng kho RAG" : "Quản trị kho RAG"}
        >
          <Database size={16} className={cn(isRagOpen && "animate-pulse")} />
          <span className="hidden md:inline">Kho RAG</span>
        </button>
        <button
          onClick={() => setAutoSpeak(!autoSpeak)}
          className={cn(
            "p-2 px-3 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold focus:ring-2 focus:ring-cyan-500/50 outline-none backdrop-blur-md border",
            autoSpeak 
              ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
              : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-white/5 dark:bg-white/[0.02] border-white/10 dark:border-white/5"
          )}
          aria-label={autoSpeak ? "Tắt tự động đọc" : "Bật tự động đọc"}
          title={autoSpeak ? "Tắt tự động đọc" : "Bật tự động đọc"}
        >
          {autoSpeak ? <Volume2 size={16} /> : <VolumeX size={16} />}
          <span className="hidden md:inline">Đọc phản hồi</span>
        </button>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-white/5 dark:bg-white/[0.02] border border-white/10 dark:border-white/5 rounded-xl transition-all focus:ring-2 focus:ring-cyan-500/50 outline-none"
          aria-label={isDarkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
          title={isDarkMode ? "Chế độ sáng" : "Chế độ tối"}
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        {hasMessages && (
          <button 
            onClick={onHome}
            className="p-2 px-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-white/5 dark:bg-white/[0.02] border border-white/10 dark:border-white/5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold focus:ring-2 focus:ring-cyan-500/50 outline-none"
            aria-label="Quay về trang chủ"
            title="Quay về trang chủ"
          >
            <Home size={16} />
            <span className="hidden sm:inline">Trang chủ</span>
          </button>
        )}
        <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
          Trực tuyến
        </span>
      </div>
    </header>
  );
};
