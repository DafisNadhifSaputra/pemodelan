import React from 'react';
import { CloseIcon, DownloadIcon, ExternalLinkIcon } from './icons';

interface PaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const PaperModal: React.FC<PaperModalProps> = ({ isOpen, onClose, title }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/pjurnal.pdf';
    link.download = 'Model_SEAR_Kecanduan_Game_Online.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open('/pjurnal.pdf', '_blank');
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
        className="bg-slate-800 dark:bg-gray-900 text-slate-200 dark:text-gray-100 rounded-xl shadow-2xl w-full h-full max-w-[95vw] max-h-[98vh] flex flex-col modal-content"
        onClick={(e) => e.stopPropagation()} 
      >
        <header className="flex items-center justify-between p-3 md:p-4 border-b border-slate-700 dark:border-gray-600">
          <h2 className="text-lg md:text-xl font-semibold text-sky-400 dark:text-sky-300 truncate">{title}</h2>
          <div className="flex items-center space-x-1 md:space-x-2">
            <button 
              onClick={handleOpenInNewTab} 
              className="p-2 text-slate-400 dark:text-gray-400 hover:text-sky-400 dark:hover:text-sky-300"
              title="Buka di tab baru"
            >
              <ExternalLinkIcon className="w-4 h-4" />
            </button>
            <button 
              onClick={handleDownload} 
              className="p-2 text-slate-400 dark:text-gray-400 hover:text-sky-400 dark:hover:text-sky-300"
              title="Download PDF"
            >
              <DownloadIcon className="w-4 h-4" />
            </button>
            <button 
              onClick={onClose} 
              className="p-2 text-slate-400 dark:text-gray-400 hover:text-red-400 dark:hover:text-red-300"
              title="Tutup"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        </header>
        
        <div className="flex-1 bg-gray-100 dark:bg-gray-200 min-h-[90vh]">
          <iframe
            src="/pjurnal.pdf"
            className="w-full h-full border-none min-h-[90vh]"
            title="Jurnal Penelitian - Model SEAR Kecanduan Game Online"
          />
        </div>
      </div>
    </div>
  );
};

export default PaperModal;
