
import React, { useState, useRef, useCallback } from 'react';
import { DocumentArrowUpIcon, DocumentIcon, XCircleIcon } from './Icons';

interface PaperInputFormProps {
  paperFile: File | null;
  setPaperFile: (file: File | null) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const PaperInputForm: React.FC<PaperInputFormProps> = ({ paperFile, setPaperFile, onSubmit, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setPaperFile(file);
      } else {
        alert("Please upload a valid PDF file.");
      }
      e.dataTransfer.clearData();
    }
  }, [setPaperFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPaperFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl md:text-2xl font-bold text-cyan-400 mb-4">Upload Your Paper</h2>
      <div 
        className={`flex-grow flex flex-col items-center justify-center w-full p-4 bg-gray-900 border-2 border-dashed rounded-lg transition-all duration-300 min-h-[300px] lg:min-h-[500px] ${isDragging ? 'border-cyan-500 bg-gray-800' : 'border-gray-600'}`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          onChange={handleChange}
          className="hidden"
          disabled={isLoading}
        />

        {!paperFile ? (
            <div className="text-center text-gray-400 cursor-pointer">
                <DocumentArrowUpIcon className="w-16 h-16 mx-auto mb-4" />
                <p className="font-semibold">Drag & drop a PDF here</p>
                <p className="text-sm">or click to select a file</p>
            </div>
        ) : (
            <div className="text-center text-gray-200">
                <DocumentIcon className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
                <p className="font-semibold break-all">{paperFile.name}</p>
                <p className="text-sm text-gray-400">{formatFileSize(paperFile.size)}</p>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setPaperFile(null);
                        if(inputRef.current) inputRef.current.value = "";
                    }}
                    disabled={isLoading}
                    className="mt-4 text-gray-500 hover:text-white"
                    aria-label="Remove selected file"
                >
                    <XCircleIcon className="w-6 h-6" />
                </button>
            </div>
        )}
      </div>
      <button
        onClick={onSubmit}
        disabled={isLoading || !paperFile}
        className="mt-4 w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-cyan-500/30"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </>
        ) : (
          'Explain Paper'
        )}
      </button>
    </div>
  );
};
