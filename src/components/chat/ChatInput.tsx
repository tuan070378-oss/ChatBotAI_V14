import React from 'react';
import { Send, Loader2, Mic, MicOff, Image as ImageIcon, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  isLoading: boolean;
  isListening: boolean;
  toggleListening: () => void;
  handleSend: (text?: string, images?: string[]) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  isLoading,
  isListening,
  toggleListening,
  handleSend
}) => {
  const [selectedImages, setSelectedImages] = React.useState<string[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    const remainingSlots = 3 - selectedImages.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result as string);
        if (newImages.length === filesToProcess.length) {
          setSelectedImages(prev => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSend = () => {
    if (!input.trim() && selectedImages.length === 0) return;
    handleSend(input, selectedImages);
    setSelectedImages([]);
  };

  return (
    <div className="bg-white/5 dark:bg-white/[0.02] backdrop-blur-2xl border-t border-white/10 dark:border-white/5 p-4 transition-colors relative z-10">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Image Preview Area */}
        {selectedImages.length > 0 && (
          <div className="flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {selectedImages.map((img, idx) => (
              <div key={idx} className="relative group">
                <img 
                  src={img} 
                  alt="Xem trước ảnh" 
                  className="w-16 h-16 object-cover rounded-xl border-2 border-cyan-500/50 shadow-lg"
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={() => removeImage(idx)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-md opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="relative flex gap-2 items-center">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            multiple
            className="hidden"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={selectedImages.length >= 3}
            className={cn(
                "p-3 rounded-2xl bg-white/5 dark:bg-white/[0.02] text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 border border-white/15 dark:border-white/5 transition-all shadow-sm focus:ring-2 focus:ring-cyan-500/50 outline-none disabled:opacity-30",
            )}
            title="Tải lên ảnh (Tối đa 3)"
          >
            <ImageIcon size={22} />
          </button>

          <button
            onClick={toggleListening}
            className={cn(
              "p-3 rounded-2xl transition-all shadow-sm flex items-center justify-center focus:ring-2 focus:ring-cyan-500/50 outline-none",
              isListening ? "bg-red-500 text-white animate-pulse" : "bg-white/5 dark:bg-white/[0.02] text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 border border-white/15 dark:border-white/5"
            )}
            aria-label={isListening ? "Dừng nghe giọng nói" : "Bắt đầu nói để nhập liệu"}
            title={isListening ? "Đang nghe..." : "Nói chuyện"}
          >
            {isListening ? <MicOff size={22} /> : <Mic size={22} />}
          </button>

          <div className="relative flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSend();
                }
              }}
              placeholder={selectedImages.length > 0 ? "Thêm mô tả cho ảnh..." : "Đặt câu hỏi hoặc tải ảnh bản vẽ..."}
              aria-label="Nội dung câu hỏi"
              className="w-full pl-4 pr-12 py-3.5 bg-white/5 dark:bg-white/[0.02] border border-white/15 dark:border-white/5 rounded-2xl focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent outline-none resize-none min-h-[52px] max-h-32 transition-all text-gray-900 dark:text-white backdrop-blur-md"
              rows={1}
            />
            <button
              onClick={onSend}
              disabled={isLoading || (!input.trim() && selectedImages.length === 0)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10 dark:hover:bg-cyan-400/20 rounded-lg disabled:opacity-50 disabled:hover:bg-transparent transition-all focus:ring-2 focus:ring-cyan-500/50 outline-none"
              aria-label="Gửi tin nhắn"
              title="Gửi"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      <p className="text-[10px] text-center text-blue-600 dark:text-blue-400 mt-2 uppercase tracking-widest font-bold animate-sparkle">
        Học tập thực chất - Vững chắc tay nghề
      </p>
    </div>
  );
};
