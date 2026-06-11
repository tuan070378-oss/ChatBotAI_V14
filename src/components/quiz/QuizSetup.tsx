import React, { useState } from 'react';
import { Subject } from '../../types';
import { Settings, Play, BookOpen, Layers, BarChart3 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface QuizSetupProps {
  subjects: Subject[];
  onStart: (config: QuizConfig) => void;
}

export interface QuizConfig {
  subjectId: string;
  chapter: string;
  difficulty: 'easy' | 'medium' | 'hard';
  count: number;
}

const CHAPTERS: Record<string, string[]> = {
  'dung-sai': ['Kích thước & Sai lệch', 'Lắp ghép lỏng/chặt', 'Dụng cụ đo panme/thước cặp', 'Dung sai hình học'],
  'co-ky-thuat': ['Lực & Mô men', 'Cân bằng vật rắn', 'Ma sát', 'Truyền động bánh răng'],
  've-ky-thuat': ['Hình chiếu cơ bản', 'Hình cắt - Mặt cắt', 'Lược đồ chi tiết', 'Ký hiệu độ nhám'],
  'an-toan': ['Trang thiết bị BHLĐ', 'An toàn điện', 'PCCC tại xưởng', 'Vệ sinh công nghiệp'],
  'vat-lieu': ['Tính chất của vật liệu', 'Thép & Gang', 'Kim loại màu & Hợp kim', 'Nhiệt luyện thép', 'VẬT LIỆU PHI KIM LOẠI (Polyme, Cao su, Composit)', 'Dầu, mỡ bôi trơn & Nhiên liệu'],
};

export const QuizSetup: React.FC<QuizSetupProps> = ({ subjects, onStart }) => {
  const [subjectId, setSubjectId] = useState(subjects[0].id);
  const [chapter, setChapter] = useState(CHAPTERS[subjects[0].id]?.[0] || 'Chương 1');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [count, setCount] = useState(5);

  const handleSubjectChange = (id: string) => {
    setSubjectId(id);
    setChapter(CHAPTERS[id]?.[0] || 'Chương 1');
  };

  const currentChapters = CHAPTERS[subjectId] || ['Chương 1', 'Chương 2', 'Chương 3'];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-2">
        <h2 className="font-heading font-extrabold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-indigo-400">Cấu hình ôn tập trí tuệ AI</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Bản đồ thử thách cá nhân hóa hoàn toàn</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Select Subject */}
        <div className="space-y-4">
          <label className="text-xs font-black uppercase tracking-widest text-[#06B6D4] flex items-center gap-2">
            <BookOpen size={14} /> Bước 1: Chọn môn học ôn luyện
          </label>
          <div className="grid grid-cols-2 gap-3">
            {subjects.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSubjectChange(s.id)}
                className={cn(
                  "p-4 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer",
                  subjectId === s.id 
                    ? "border-cyan-500 bg-cyan-500/10 dark:bg-cyan-500/10 ring-2 ring-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]" 
                    : "border-white/10 dark:border-white/5 bg-white/5 dark:bg-white/[0.02] hover:border-cyan-550/30"
                )}
              >
                <s.icon size={20} className={cn("mb-3 transition-transform group-hover:scale-110", subjectId === s.id ? "text-cyan-400" : "text-gray-400 group-hover:text-cyan-400")} />
                <span className={cn("text-xs font-bold block", subjectId === s.id ? "text-cyan-600 dark:text-cyan-300" : "text-gray-600 dark:text-gray-400")}>
                  {s.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Settings */}
        <div className="bg-white/5 dark:bg-white/[0.03] backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-[1.75rem] p-6 space-y-6">
          <div className="space-y-2.5">
            <label className="text-xs font-black uppercase tracking-widest text-[#06B6D4] flex items-center gap-2">
              <Layers size={14} /> Bước 2: Chương / Chủ đề
            </label>
            <select
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              className="w-full p-3 rounded-xl bg-white dark:bg-gray-800 border-none text-xs text-gray-700 dark:text-gray-300 font-semibold shadow-sm ring-1 ring-gray-100 dark:ring-gray-800 outline-none focus:ring-2 focus:ring-cyan-500/40 cursor-pointer"
            >
              {currentChapters.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2.5">
            <label className="text-xs font-black uppercase tracking-widest text-[#06B6D4] flex items-center gap-2">
              <BarChart3 size={14} /> Bước 3: Mức độ đề
            </label>
            <div className="flex gap-2">
              {(['easy', 'medium', 'hard'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer",
                    difficulty === d 
                      ? "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white border-transparent shadow-lg shadow-cyan-500/10" 
                      : "bg-white/5 dark:bg-white/[0.01]/40 text-gray-400 border-white/10 dark:border-white/5 hover:border-cyan-500/30"
                  )}
                >
                  {d === 'easy' ? 'Dễ' : d === 'medium' ? 'Vừa' : 'Khó'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            <label className="text-xs font-black uppercase tracking-widest text-[#06B6D4] flex items-center justify-between">
              <span className="flex items-center gap-2"><Settings size={14} /> Bước 4: Số lượng câu:</span>
              <span className="text-cyan-500 font-bold">{count} câu</span>
            </label>
            <input
              type="range"
              min="3"
              max="15"
              step="1"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-gray-400 px-1 font-mono">
              <span>3</span>
              <span>15</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => onStart({ subjectId, chapter, difficulty, count })}
        className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:scale-103 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl hover:shadow-cyan-500/20 transition-all group mx-auto md:block cursor-pointer"
      >
        <Play size={20} className="fill-current group-hover:scale-110 transition-transform" />
        Bắt đầu ôn tập cùng AI
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-550/10 flex items-center justify-center text-emerald-500 text-xs font-extrabold shadow-sm">✓</div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Sinh đề ngẫu nhiên 100%</span>
        </div>
        <div className="p-4 bg-purple-500/5 dark:bg-purple-500/5 border border-purple-500/20 rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-550/10 flex items-center justify-center text-purple-400 text-xs font-extrabold shadow-sm">✎</div>
          <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">Tự luận chấm bởi AI</span>
        </div>
        <div className="p-4 bg-amber-500/5 dark:bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-550/10 flex items-center justify-center text-amber-500 text-xs font-extrabold shadow-sm">∞</div>
          <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">Học không giới hạn</span>
        </div>
      </div>
    </div>
  );
};
