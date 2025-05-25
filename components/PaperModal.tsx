import React, { useState, useEffect } from 'react';
import { CloseIcon, DownloadIcon, ExternalLinkIcon } from './icons';

interface PaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const PaperModal: React.FC<PaperModalProps> = ({ isOpen, onClose, title }) => {
  const [pdfError, setPdfError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pdfExists, setPdfExists] = useState(false);

  // Check if PDF file exists when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log('PaperModal opened, checking PDF...');
      setIsLoading(true);
      setPdfError(false);
      setPdfExists(false);
      
      // Try to fetch the PDF to see if it exists
      fetch('/pjurnal.pdf', { method: 'HEAD' })
        .then(response => {
          console.log('PDF fetch response:', response.status, response.statusText);
          if (response.ok) {
            setPdfExists(true);
            console.log('PDF exists and is accessible');
          } else {
            throw new Error(`PDF not found: ${response.status}`);
          }
        })
        .catch((error) => {
          console.error('Error loading PDF:', error);
          setPdfError(true);
          setPdfExists(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // Reset state when modal closes
      setIsLoading(true);
      setPdfError(false);
      setPdfExists(false);
    }
  }, [isOpen]);

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

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setPdfError(true);
    setIsLoading(false);
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
        className="bg-slate-800 dark:bg-gray-900 text-slate-200 dark:text-gray-100 rounded-xl shadow-2xl w-full h-full max-w-[95vw] max-h-[100vh] flex flex-col modal-content"
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
        
        <div className="flex-1 bg-gray-100 dark:bg-gray-200 min-h-[90vh] relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-200 z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-700">Memuat PDF...</p>
              </div>
            </div>
          )}
          
          {pdfError || !pdfExists ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-6 rounded-lg max-w-md">
                <h3 className="text-lg font-semibold mb-4">
                  {!pdfExists ? 'File PDF tidak ditemukan' : 'Tidak dapat memuat PDF'}
                </h3>
                <p className="mb-6">
                  {!pdfExists 
                    ? 'File PDF mungkin belum tersedia atau ada masalah dengan server.'
                    : 'Browser Anda mungkin tidak mendukung tampilan PDF langsung.'
                  } Silakan gunakan opsi di bawah ini:
                </p>
                <div className="space-y-3">
                  <button 
                    onClick={handleOpenInNewTab}
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <ExternalLinkIcon className="w-4 h-4 mr-2" />
                    Buka di Tab Baru
                  </button>
                  <button 
                    onClick={handleDownload}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <iframe
                src="/pjurnal.pdf#toolbar=1&navpanes=1&scrollbar=1"
                className="w-full h-full border-none min-h-[90vh]"
                title="Jurnal Penelitian - Model SEAR Kecanduan Game Online"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                style={{ display: isLoading ? 'none' : 'block' }}
              />
              {/* Fallback for browsers that don't support PDF in iframe */}
              <object
                data="/pjurnal.pdf"
                type="application/pdf"
                className="w-full h-full min-h-[90vh]"
                style={{ display: 'none' }}
                onError={handleIframeError}
              >
                <embed
                  src="/pjurnal.pdf"
                  type="application/pdf"
                  className="w-full h-full min-h-[90vh]"
                  onError={handleIframeError}
                />
              </object>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaperModal;
