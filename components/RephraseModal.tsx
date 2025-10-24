
import React from 'react';
import { XIcon, WandIcon, ExclamationTriangleIcon } from './Icons';

interface RephraseModalProps {
  isLoading: boolean;
  error: string | null;
  originalText: string;
  rephrasedText: string | null;
  onClose: () => void;
}

export const RephraseModal: React.FC<RephraseModalProps> = ({ isLoading, error, originalText, rephrasedText, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rephrase-modal-title"
    >
      <style>{`@keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }`}</style>
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl border border-gray-700/50 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-700/50 flex-shrink-0">
          <h2 id="rephrase-modal-title" className="text-lg font-semibold text-cyan-400 flex items-center">
            <WandIcon className="w-5 h-5 mr-2" />
            Simplified Explanation
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </header>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
            <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Original Text</h3>
                <blockquote className="text-sm text-gray-300 bg-gray-900/50 p-3 rounded-md border-l-2 border-gray-600 italic">
                    {originalText}
                </blockquote>
            </div>

            <hr className="border-gray-700/50 my-4" />

            <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Simplified Version</h3>
                {isLoading && (
                    <div className="flex items-center justify-center p-8 space-x-3">
                        <div className="loader ease-linear rounded-full border-2 border-t-2 border-gray-500 h-6 w-6 animate-spin border-t-cyan-500"></div>
                        <span className="text-gray-400">Simplifying...</span>
                    </div>
                )}
                {error && (
                    <div className="bg-red-900/20 text-red-300 p-3 rounded-md flex items-start space-x-3">
                        <ExclamationTriangleIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}
                {rephrasedText && (
                    <div className="text-gray-200 space-y-3 prose prose-sm prose-invert max-w-none">
                        <p>{rephrasedText}</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
