import React from 'react';
import { QuizQuestion, QuizResult } from '../../types';
import { Trophy, RefreshCcw, Home, ChevronDown, Check, X, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { cn, cleanMathText } from '../../lib/utils';

interface ResultDashboardProps {
  questions: QuizQuestion[];
  userAnswers: Record<string, string>;
  details: Record<string, QuizResult | null>;
  onReset: () => void;
  onHome: () => void;
}

export const ResultDashboard: React.FC<ResultDashboardProps> = ({
  questions,
  userAnswers,
  details,
  onReset,
  onHome
}) => {
  const totalScore = Object.values(details).reduce((acc, curr) => acc + (curr?.score || 0), 0);
  const avgScore = (totalScore / (questions.length * 10)).toFixed(1);
  const percentage = Math.round((totalScore / (questions.length * 10)) * 100);

  const getEncouragement = (p: number) => {
    if (p >= 90) return "Xuất sắc! Bạn đã nắm vững kiến thức này.";
    if (p >= 70) return "Rất tốt! Bạn hiểu bài khá sâu, hãy phát huy.";
    if (p >= 50) return "Khá ổn, nhưng vẫn cần xem kỹ lại một số phần.";
    return "Hãy tập trung ôn tập thêm, đừng nản lòng nhé!";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Summary Card */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="bg-blue-600 p-8 text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
            className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto border-4 border-white/50"
          >
            <Trophy className="w-12 h-12 text-white fill-white/20" />
          </motion.div>
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-white">Kết quả: {percentage}%</h2>
            <p className="text-blue-100 font-medium">{getEncouragement(percentage)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-gray-100 dark:border-gray-800">
          <div className="p-6 text-center">
            <span className="block text-xs uppercase font-bold text-gray-400 dark:text-gray-500 mb-1">Tổng điểm</span>
            <span className="text-2xl font-black text-gray-900 dark:text-white">{totalScore}</span>
          </div>
          <div className="p-6 text-center border-l border-gray-100 dark:border-gray-800">
            <span className="block text-xs uppercase font-bold text-gray-400 dark:text-gray-500 mb-1">Số câu hỏi</span>
            <span className="text-2xl font-black text-gray-900 dark:text-white">{questions.length}</span>
          </div>
          <div className="p-6 text-center border-l border-gray-100 dark:border-gray-800">
            <span className="block text-xs uppercase font-bold text-gray-400 dark:text-gray-500 mb-1">Đúng/Đạt</span>
            <span className="text-2xl font-black text-green-600">
              {Object.values(details).filter(d => (d?.score || 0) >= 7).length}
            </span>
          </div>
          <div className="p-6 text-center border-l border-gray-100 dark:border-gray-800">
            <span className="block text-xs uppercase font-bold text-gray-400 dark:text-gray-500 mb-1">Trung bình</span>
            <span className="text-2xl font-black text-blue-600">{avgScore}</span>
          </div>
        </div>

        {/* Detailed Feedback */}
        <div className="p-6 space-y-6">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <AlertCircle size={18} className="text-blue-500" /> Chi tiết đáp án & Giải thích
          </h3>
          <div className="space-y-4">
            {questions.map((q, idx) => {
              const res = details[q.id];
              const isCorrect = (res?.score || 0) >= 8;
              return (
                <div key={q.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-sm",
                      isCorrect ? "bg-green-100 text-green-600 dark:bg-green-900/30" : "bg-red-100 text-red-600 dark:bg-red-900/30"
                    )}>
                      {isCorrect ? <Check size={14} /> : <X size={14} />}
                    </div>
                    <div className="space-y-2 flex-1">
                      <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center justify-between">
                        <span>Câu {idx + 1}: {cleanMathText(q.question)}</span>
                        <span className={cn("text-xs font-black", isCorrect ? "text-green-600" : "text-red-600")}>{res?.score}/10</span>
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <span className="text-gray-400 font-bold uppercase tracking-tighter">Bạn chọn:</span>
                          <p className={cn("font-medium", isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400")}>
                            {cleanMathText(userAnswers[q.id] || '(Chưa trả lời)')}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-gray-400 font-bold uppercase tracking-tighter">Đáp án chuẩn:</span>
                          <p className="text-blue-700 dark:text-blue-400 font-medium">{cleanMathText(q.correctAnswer)}</p>
                        </div>
                      </div>

                      <div className="mt-3 p-3 bg-white dark:bg-gray-900 rounded-xl text-[11px] leading-relaxed border border-gray-100 dark:border-gray-800">
                        <span className="font-bold text-blue-600 uppercase mb-1 block">💡 Giải thích từ AI:</span>
                        <p className="text-gray-600 dark:text-gray-400">{cleanMathText(res?.feedback || q.explanation)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onReset}
          className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 transition-all transition-transform hover:-translate-y-1"
        >
          <RefreshCcw size={20} />
          Làm đề mới
        </button>
        <button
          onClick={onHome}
          className="flex-1 py-4 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-md transition-all transition-transform hover:-translate-y-1"
        >
          <Home size={20} />
          Về trang chủ
        </button>
      </div>
    </div>
  );
};
