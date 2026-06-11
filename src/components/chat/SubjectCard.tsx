import React from 'react';
import { cn } from '../../lib/utils';
import { Subject } from '../../types';

interface SubjectCardProps {
  subject: Subject;
  onClick: () => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 p-4 rounded-[1.5rem] border border-gray-205 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] backdrop-blur-md hover:scale-102 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300 text-left group focus:ring-2 focus:ring-cyan-500/50 outline-none",
      )}
      aria-label={`Hỏi về môn ${subject.name}`}
      title={`Bắt đầu hỏi về ${subject.name}`}
    >
      <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110", subject.bg)}>
        <subject.icon className={cn("w-6 h-6", subject.color)} />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">{subject.name}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">Bấm để bắt đầu trao đổi</p>
      </div>
    </button>
  );
};
