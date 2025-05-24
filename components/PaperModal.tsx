import React, { useRef, useState } from 'react';
import { CloseIcon, DownloadIcon, PrintIcon, ZoomInIcon, ZoomOutIcon } from './icons';

interface PaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string; 
}

const PaperModal: React.FC<PaperModalProps> = ({ isOpen, onClose, title, content }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seir-model-paper.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 md:p-4 modal-backdrop"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-slate-800 text-slate-200 rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] md:max-h-[90vh] flex flex-col modal-content"
        onClick={(e) => e.stopPropagation()} 
      >
        <header className="flex items-center justify-between p-3 md:p-4 border-b border-slate-700">
          <h2 className="text-lg md:text-xl font-semibold text-sky-400 truncate">{title}</h2>
          <div className="flex items-center space-x-1 md:space-x-2">
            <button onClick={handleZoomOut} className="p-2 text-slate-400 hover:text-sky-400">
              <ZoomOutIcon className="w-4 h-4" />
            </button>
            <span className="text-xs text-slate-400">{zoom}%</span>
            <button onClick={handleZoomIn} className="p-2 text-slate-400 hover:text-sky-400">
              <ZoomInIcon className="w-4 h-4" />
            </button>
            <button onClick={handleDownload} className="p-2 text-slate-400 hover:text-sky-400">
              <DownloadIcon className="w-4 h-4" />
            </button>
            <button onClick={handlePrint} className="p-2 text-slate-400 hover:text-sky-400">
              <PrintIcon className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-400">
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        </header>
        
        <div 
          ref={contentRef}
          className="flex-1 p-6 overflow-y-auto bg-white text-gray-900"
          style={{ fontSize: zoom + '%' }}
          dangerouslySetInnerHTML={{ __html: content }} 
        />
      </div>
    </div>
  );
};

export default PaperModal;
