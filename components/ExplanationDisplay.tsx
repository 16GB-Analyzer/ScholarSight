
import React, { useState, useRef } from 'react';
import type { Explanation } from '../types';
import { BookOpenIcon, BeakerIcon, ChartBarIcon, SparklesIcon, PuzzlePieceIcon, DocumentTextIcon, ExclamationTriangleIcon, CpuChipIcon, WandIcon } from './Icons';

interface ExplanationDisplayProps {
  explanation: Explanation | null;
  isLoading: boolean;
  error: string | null;
  onRephrase: (text: string) => void;
}

const ExplanationCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => {
    return (
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/60 transition-all hover:border-cyan-500/50">
            <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center">
                <span className="mr-3">{icon}</span>
                {title}
            </h3>
            <div className="text-gray-300 text-sm space-y-2 prose prose-sm prose-invert max-w-none">
                {children}
            </div>
        </div>
    );
};

export const ExplanationDisplay: React.FC<ExplanationDisplayProps> = ({ explanation, isLoading, error, onRephrase }) => {
  const [popup, setPopup] = useState<{ x: number; y: number; text: string } | null>(null);
  const displayRef = useRef<HTMLDivElement>(null);

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 15 && displayRef.current) {
      const text = selection.toString().trim();
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const containerRect = displayRef.current.getBoundingClientRect();
      
      setPopup({
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top,
          text: text,
      });
    } else {
      // Clear popup on deselection
      setPopup(null);
    }
  };

  const handleRephraseClick = () => {
    if (popup) {
      onRephrase(popup.text);
      setPopup(null);
    }
  };


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 bg-gray-900 rounded-lg border-2 border-dashed border-gray-600">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-500 h-12 w-12 mb-4 animate-spin border-t-cyan-500"></div>
        <h2 className="text-xl font-semibold text-gray-300">Analyzing Paper</h2>
        <p className="text-gray-500">The AI is reading and structuring the content...</p>
      </div>
    );
  }

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center h-full p-8 bg-red-900/20 text-red-300 rounded-lg border border-red-500/50">
            <ExclamationTriangleIcon className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">An Error Occurred</h3>
            <p className="text-center">{error}</p>
        </div>
    );
  }

  if (!explanation) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 bg-gray-900 rounded-lg border-2 border-dashed border-gray-600">
        <BookOpenIcon className="w-16 h-16 text-gray-600 mb-4" />
        <h2 className="text-xl font-semibold text-gray-400">Explanation Awaits</h2>
        <p className="text-gray-500 text-center">Your simplified paper breakdown will appear here.</p>
      </div>
    );
  }

  return (
    <div className="relative" ref={displayRef}>
       {popup && (
        <button
          onClick={handleRephraseClick}
          className="absolute z-10 bg-cyan-500 hover:bg-cyan-400 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center shadow-lg transform -translate-x-1/2 -translate-y-[calc(100%+5px)] transition-all duration-150"
          style={{ left: popup.x, top: popup.y, willChange: 'transform' }}
          aria-label="Simplify selected text"
        >
          <WandIcon className="w-4 h-4 mr-1.5" />
          Simplify
        </button>
      )}
      <div onMouseUp={handleMouseUp} onMouseDown={() => setPopup(null)} className="space-y-4 h-full overflow-y-auto max-h-[calc(100vh-250px)] pr-2 custom-scrollbar">
        <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #22d3ee; border-radius: 20px; }`}</style>
        <h2 className="text-xl md:text-2xl font-bold text-cyan-400 mb-4">Structured Breakdown</h2>
        <ExplanationCard title="Simple Explanation" icon={<SparklesIcon />}>
          <p>{explanation.simpleExplanation}</p>
        </ExplanationCard>
        <ExplanationCard title="Methodology" icon={<BeakerIcon />}>
          <p>{explanation.methodology}</p>
        </ExplanationCard>
        <ExplanationCard title="Algorithms" icon={<CpuChipIcon />}>
          <p>{explanation.algorithms}</p>
        </ExplanationCard>
        <ExplanationCard title="Datasets" icon={<ChartBarIcon />}>
          <p>{explanation.datasets}</p>
        </ExplanationCard>
        <ExplanationCard title="Key Contributions" icon={<PuzzlePieceIcon />}>
          <ul className="list-disc pl-5">
            {explanation.keyContributions.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </ExplanationCard>
        <ExplanationCard title="Potential Applications" icon={<SparklesIcon />}>
          <ul className="list-disc pl-5">
            {explanation.potentialApplications.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </ExplanationCard>
        <ExplanationCard title="Reference Helper" icon={<DocumentTextIcon />}>
          <p>{explanation.referenceHelper}</p>
        </ExplanationCard>
      </div>
    </div>
  );
};
