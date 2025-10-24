
import React, { useState, useCallback } from 'react';
import type { Explanation } from './types';
import { explainPaper, rephraseText } from './services/geminiService';
import { PaperInputForm } from './components/PaperInputForm';
import { ExplanationDisplay } from './components/ExplanationDisplay';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { RephraseModal } from './components/RephraseModal';

const App: React.FC = () => {
  const [paperFile, setPaperFile] = useState<File | null>(null);
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    isLoading: false,
    error: null as string | null,
    originalText: '',
    rephrasedText: null as string | null,
  });

  const handleSubmit = useCallback(async () => {
    if (!paperFile) {
      setError('Please select a PDF file to analyze.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setExplanation(null);

    try {
      const result = await explainPaper(paperFile);
      setExplanation(result);
    } catch (e) {
      console.error(e);
      setError('An error occurred while explaining the paper. The PDF might be corrupted, protected, or an issue with the API. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [paperFile]);

  const handleRephraseRequest = async (textToRephrase: string) => {
    setModalState({
      isOpen: true,
      isLoading: true,
      error: null,
      originalText: textToRephrase,
      rephrasedText: null,
    });

    try {
      const result = await rephraseText(textToRephrase);
      setModalState(prev => ({ ...prev, isLoading: false, rephrasedText: result }));
    } catch (e) {
      console.error(e);
      setModalState(prev => ({ ...prev, isLoading: false, error: 'Failed to simplify the selected text. Please try again.' }));
    }
  };

  const handleCloseModal = () => {
    setModalState({ ...modalState, isOpen: false });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <Hero />
        <div className="bg-gray-800/50 rounded-2xl shadow-2xl p-6 backdrop-blur-sm border border-gray-700/50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PaperInputForm
              paperFile={paperFile}
              setPaperFile={setPaperFile}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
            <ExplanationDisplay
              explanation={explanation}
              isLoading={isLoading}
              error={error}
              onRephrase={handleRephraseRequest}
            />
          </div>
        </div>
      </main>
      <Footer />
      {modalState.isOpen && (
        <RephraseModal
          isLoading={modalState.isLoading}
          error={modalState.error}
          originalText={modalState.originalText}
          rephrasedText={modalState.rephrasedText}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default App;
