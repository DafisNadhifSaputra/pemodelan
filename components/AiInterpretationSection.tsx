
import React, { useState } from 'react';
import { RefreshIcon, ChatIcon, EyeIcon } from './icons';
import LoadingSpinner from './LoadingSpinner';
import MarkdownRenderer from './MarkdownRenderer';

interface AiInterpretationSectionProps {
  interpretation: string | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: (responseLength?: 'singkat' | 'sedang' | 'panjang') => void;
  onRefreshWithChart: (responseLength?: 'singkat' | 'sedang' | 'panjang') => void;
  onOpenChat: () => void;
}

const AiInterpretationSection: React.FC<AiInterpretationSectionProps> = ({
  interpretation,
  isLoading,
  error,
  onRefresh,
  onRefreshWithChart,
  onOpenChat
}) => {
  const [responseLength, setResponseLength] = useState<'singkat' | 'sedang' | 'panjang'>('sedang');

  // API key is now hardcoded in geminiService.ts, so apiKeyAvailable check is no longer needed here.

  return (
    <div className="space-y-3 text-slate-700 dark:text-slate-300">
      {isLoading && (
        <div className="flex items-center justify-center p-6 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
          <LoadingSpinner size="md" className="text-blue-600 dark:text-sky-400 mr-3" />
          <p className="text-blue-700 dark:text-sky-300">Sedang memproses analisis AI...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="p-4 bg-red-100 dark:bg-red-800/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg">
          <p className="font-semibold">Gagal Memuat Analisis AI</p>
          <p className="text-sm">{error}</p>
          <button
              onClick={() => onRefresh(responseLength)}
              className="mt-2 bg-slate-500 hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-500 text-white font-medium py-1.5 px-3 rounded-md text-sm flex items-center"
              aria-label="Coba lagi memuat analisis AI"
          >
              <RefreshIcon className="w-4 h-4 mr-1.5" />
              Coba Lagi
          </button>
        </div>
      )}

      {!isLoading && !error && !interpretation && (
         <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">Analisis AI belum dimuat. Klik tombol di bawah untuk memulai analisis atau chat interaktif.</p>
            {/* Response Length Selector */}
            <div className="mb-4 flex items-center justify-center space-x-2">
              <label className="text-sm text-slate-600 dark:text-slate-400">Panjang Respons:</label>
              <select
                value={responseLength}
                onChange={(e) => setResponseLength(e.target.value as 'singkat' | 'sedang' | 'panjang')}
                className="bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 text-slate-700 dark:text-slate-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-400"
              >
                <option value="singkat">Singkat (Ringkas)</option>
                <option value="sedang">Sedang (Standar)</option>
                <option value="panjang">Panjang (Detail)</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                  onClick={() => onRefresh(responseLength)}
                  className="bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 px-4 rounded-md text-sm flex items-center justify-center"
                  aria-label="Dapatkan Analisis AI sekarang"
              >
                  <RefreshIcon className="w-4 h-4 mr-2" />
                  Analisis Teks
              </button>
              <button
                  onClick={() => onRefreshWithChart(responseLength)}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-md text-sm flex items-center justify-center"
                  aria-label="Dapatkan Analisis AI dengan Grafik"
              >
                  <EyeIcon className="w-4 h-4 mr-2" />
                  Analisis + Grafik
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
          <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
            <MarkdownRenderer content={interpretation} />
          </div>
          {/* Response Length Selector */}
          <div className="flex items-center space-x-2 mb-3">
            <label className="text-sm text-slate-600 dark:text-slate-400">Panjang Respons:</label>
            <select
              value={responseLength}
              onChange={(e) => setResponseLength(e.target.value as 'singkat' | 'sedang' | 'panjang')}
              className="bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 text-slate-700 dark:text-slate-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-400"
            >
              <option value="singkat">Singkat (Ringkas)</option>
              <option value="sedang">Sedang (Standar)</option>
              <option value="panjang">Panjang (Detail)</option>
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
                onClick={() => onRefresh(responseLength)}
                className="bg-slate-500 hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-500 text-white font-medium py-2 px-4 rounded-md text-sm flex items-center justify-center"
                aria-label="Refresh Analisis AI"
            >
                <RefreshIcon className="w-4 h-4 mr-2" />
                Perbarui Analisis
            </button>
            <button
                onClick={() => onRefreshWithChart(responseLength)}
                className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-md text-sm flex items-center justify-center"
                aria-label="Analisis dengan Grafik"
            >
                <EyeIcon className="w-4 h-4 mr-2" />
                Analisis + Grafik
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
