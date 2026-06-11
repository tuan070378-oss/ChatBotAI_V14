import React, { useState } from 'react';
import { QuizQuestion, QuizResult } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ChevronRight, Send, HelpCircle, Loader2 } from 'lucide-react';
import { cn, cleanMathText } from '../../lib/utils';
import { gradeEssay } from '../../services/gemini';

interface QuizScreenProps {
  questions: QuizQuestion[];
  onComplete: (userAnswers: Record<string, string>, details: Record<string, QuizResult | null>) => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [essayGrading, setEssayGrading] = useState<Record<string, QuizResult | null>>({});
  const [isLoading, setIsLoading] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isMcq = currentQuestion.type === 'mcq';
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Finalize
      setIsLoading(true);
      const details: Record<string, QuizResult | null> = {};
      
      // For MCQ, we can auto-grade. For essay, we use the saved gradings (if any) or grade them now
      for (const q of questions) {
        if (q.id in essayGrading) {
            details[q.id] = essayGrading[q.id];
        } else if (q.type === 'mcq') {
            const isCorrect = userAnswers[q.id] === q.correctAnswer;
            details[q.id] = {
                score: isCorrect ? 10 : 0,
                feedback: isCorrect ? "Đáp án hoàn toàn chính xác!" : `Rất tiếc, đáp án đúng phải là ${q.correctAnswer}.`,
                missingPoints: isCorrect ? [] : ["Đáp án chưa đúng"]
            };
        }
      }
      
      onComplete(userAnswers, details);
      setIsLoading(false);
    }
  };

  const handleMcqSelect = (ans: string) => {
    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: ans }));
  };

  const handleEssaySubmit = async () => {
    const ans = userAnswers[currentQuestion.id];
    if (!ans) return;

    setIsLoading(true);
    try {
      const result = await gradeEssay(currentQuestion.question, currentQuestion.correctAnswer, ans);
      setEssayGrading(prev => ({ ...prev, [currentQuestion.id]: result }));
    } catch (error) {
      console.error("Grading failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
      {/* Progress Bar */}
      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 rounded-2xl p-4 flex items-center gap-4">
        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs font-bold text-gray-500 min-w-[50px] text-right">
          Câu {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Main Question Card */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 min-h-[400px] flex flex-col relative overflow-hidden transition-colors">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 flex-1"
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                isMcq ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30" : "bg-purple-100 text-purple-600 dark:bg-purple-900/30"
              )}>
                {isMcq ? <CheckCircle2 size={24} /> : <HelpCircle size={24} />}
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 dark:text-blue-400">
                  {isMcq ? "Câu hỏi Trắc nghiệm" : "Câu hỏi Tự luận"}
                </span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">
                  {cleanMathText(currentQuestion.question)}
                </h3>
              </div>
            </div>

            {/* Answer Area */}
            <div className="space-y-3">
              {isMcq ? (
                <div className="grid grid-cols-1 gap-3">
                  {currentQuestion.options?.map((opt, idx) => {
                    const isSelected = userAnswers[currentQuestion.id] === opt;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleMcqSelect(opt)}
                        className={cn(
                          "p-4 rounded-2xl border text-left transition-all flex items-center gap-4 group",
                          isSelected 
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500/20" 
                            : "border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        )}
                      >
                        <div className={cn(
                          "w-6 h-6 rounded-full border flex items-center justify-center transition-all shrink-0 font-bold text-xs",
                          isSelected ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300 dark:border-gray-700 text-gray-400"
                        )}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className={cn(
                          "text-sm font-medium",
                          isSelected ? "text-blue-900 dark:text-blue-100" : "text-gray-700 dark:text-gray-300"
                        )}>
                          {cleanMathText(opt)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  <textarea
                    value={userAnswers[currentQuestion.id] || ''}
                    onChange={(e) => setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                    placeholder="Hãy giải thích chi tiết câu trả lời của bạn..."
                    className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white min-h-[150px] transition-all"
                  />
                  {!essayGrading[currentQuestion.id] && (
                    <button
                        onClick={handleEssaySubmit}
                        disabled={isLoading || !userAnswers[currentQuestion.id]}
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        Nộp câu này để AI chấm điểm
                    </button>
                  )}
                  {essayGrading[currentQuestion.id] && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-widest">Đã chấm điểm</span>
                            <span className="text-lg font-black text-green-600">{essayGrading[currentQuestion.id]?.score}/10</span>
                        </div>
                        <p className="text-xs text-green-800 dark:text-green-300">{cleanMathText(essayGrading[currentQuestion.id]?.feedback)}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer Actions */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <button
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="text-sm font-bold text-gray-500 hover:text-blue-600 disabled:opacity-30 transition-colors"
                aria-label="Quay lại câu trước"
            >
                Quay lại
            </button>
            <button
                onClick={handleNext}
                disabled={isLoading || !userAnswers[currentQuestion.id]}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transform transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
            >
                {isLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                ) : (
                    <>
                        {currentIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Hoàn thành bài thi'}
                        <ChevronRight size={20} />
                    </>
                )}
            </button>
        </div>
      </div>
      
      <p className="text-center text-[10px] text-gray-400 dark:text-gray-600 font-bold uppercase tracking-widest">
        Học tập nghiêm túc - Kiến thức vững bền
      </p>
    </div>
  );
};
