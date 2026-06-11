import React from 'react';
import { User, Bot, Loader2, Volume2, VolumeX } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';
import { cn, cleanMathText } from '../../lib/utils';
import { Message } from '../../types';

interface MessageItemProps {
  message: Message;
  isLast: boolean;
  isLoading: boolean;
  isSpeaking: boolean;
  onSpeak: (content: string) => void;
  onStopSpeaking: () => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isLast,
  isLoading,
  isSpeaking,
  onSpeak,
  onStopSpeaking
}) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-3 max-w-4xl mx-auto",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div className={cn(
        "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md transition-all hover:scale-110",
        isUser ? "bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white" : "bg-white/10 dark:bg-white/[0.04] border border-white/15 dark:border-white/5 text-cyan-600 dark:text-cyan-400 backdrop-blur-md"
      )}>
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>
      <div className={cn(
        "px-5 py-3.5 rounded-[1.5rem] shadow-sm max-w-[85%] backdrop-blur-xl transition-all border",
        isUser 
          ? "bg-indigo-600/90 dark:bg-indigo-500/20 border-indigo-500/30 text-white rounded-tr-none" 
          : "bg-white/10 dark:bg-white/[0.03] border-white/15 dark:border-white/5 text-gray-800 dark:text-gray-200 rounded-tl-none"
      )}>
        <div className={cn(
          "prose prose-sm max-w-none dark:prose-invert",
          isUser ? "prose-invert" : ""
        )}>
          <ReactMarkdown>{cleanMathText(message.content)}</ReactMarkdown>
        </div>
        
        {message.images && message.images.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.images.map((img, idx) => (
              <img 
                key={idx} 
                src={img} 
                alt="Ảnh đã tải lên" 
                className="max-w-[200px] max-h-[200px] rounded-xl border border-white/20 shadow-md cursor-pointer hover:scale-105 transition-transform"
                onClick={() => window.open(img, '_blank')}
                referrerPolicy="no-referrer"
              />
            ))}
          </div>
        )}

        {!isUser && message.content && (
          <button
            onClick={() => isSpeaking ? onStopSpeaking() : onSpeak(cleanMathText(message.content))}
            className="mt-2 p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1 text-[10px] font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            aria-label={isSpeaking ? "Dừng đọc" : "Nghe lại phản hồi"}
            title={isSpeaking ? "Dừng đọc" : "Nghe lại"}
          >
            {isSpeaking ? (
              <>
                <VolumeX size={14} />
                <span>Dừng</span>
              </>
            ) : (
              <>
                <Volume2 size={14} />
                <span>Nghe lại</span>
              </>
            )}
          </button>
        )}
        {isLast && isLoading && !isUser && !message.content && (
          <div className="flex items-center gap-2 mt-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
            <span className="text-xs text-gray-500 animate-pulse">Đang suy nghĩ...</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
