
import React from 'react';
import { RefreshIcon, ChatIcon } from './icons';
import LoadingSpinner from './LoadingSpinner';

interface AiInterpretationSectionProps {
  interpretation: string | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onOpenChat: () => void;
}

const AiInterpretationSection: React.FC<AiInterpretationSectionProps> = ({
  interpretation,
  isLoading,
  error,
  onRefresh,
  onOpenChat
}) => {
  // API key is now hardcoded in geminiService.ts, so apiKeyAvailable check is no longer needed here.

  return (
    <div className="space-y-3 text-slate-300">
      {isLoading && (
        <div className="flex items-center justify-center p-6 bg-slate-700/50 rounded-lg">
          <LoadingSpinner size="md" className="text-sky-400 mr-3" />
          <p className="text-sky-300">Sedang memproses analisis AI...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="p-4 bg-red-800/30 border border-red-700 text-red-300 rounded-lg">
          <p className="font-semibold">Gagal Memuat Analisis AI</p>
          <p className="text-sm">{error}</p>
          <button
              onClick={onRefresh}
              className="mt-2 bg-slate-600 hover:bg-slate-500 text-white font-medium py-1.5 px-3 rounded-md text-sm flex items-center"
              aria-label="Coba lagi memuat analisis AI"
          >
              <RefreshIcon className="w-4 h-4 mr-1.5" />
              Coba Lagi
          </button>
        </div>
      )}

      {!isLoading && !error && !interpretation && (
         <div className="p-4 bg-slate-700/50 rounded-lg text-center">
            <p className="text-slate-400 mb-4">Analisis AI belum dimuat. Klik tombol di bawah untuk memulai analisis atau chat interaktif.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                  onClick={onRefresh}
                  className="bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 px-4 rounded-md text-sm flex items-center justify-center"
                  aria-label="Dapatkan Analisis AI sekarang"
              >
                  <RefreshIcon className="w-4 h-4 mr-2" />
                  Dapatkan Analisis AI
              </button>
              <button
                  onClick={onOpenChat}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-md text-sm flex items-center justify-center"
                  aria-label="Buka Chat AI"
              >
                  <ChatIcon className="w-4 h-4 mr-2" />
                  Chat dengan AI
              </button>
            </div>
         </div>
      )}

      {!isLoading && !error && interpretation && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-700/50 rounded-lg prose prose-sm prose-invert max-w-none">
            <div style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: interpretation.replace(/\n/g, '<br />') }} />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
                onClick={onRefresh}
                className="bg-slate-600 hover:bg-slate-500 text-white font-medium py-2 px-4 rounded-md text-sm flex items-center justify-center"
                aria-label="Refresh Analisis AI"
            >
                <RefreshIcon className="w-4 h-4 mr-2" />
                Perbarui Analisis
            </button>
            <button
                onClick={onOpenChat}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-md text-sm flex items-center justify-center"
                aria-label="Buka Chat AI"
            >
                <ChatIcon className="w-4 h-4 mr-2" />
                Chat dengan AI
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiInterpretationSection;
