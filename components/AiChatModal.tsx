import React, { useState, useRef, useEffect } from 'react';
import { CloseIcon, SendIcon, ChatIcon, EyeIcon } from './icons';
import LoadingSpinner from './LoadingSpinner';
import { getAiInterpretation, getAiChartAnalysis } from '../services/geminiService';
import type { SearParams, InitialConditions, SimulationDataPoint } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  params: SearParams;
  initialConditions: InitialConditions;
  simulationData: SimulationDataPoint[];
  currentR0: number;
  nInitial: number;
  hasIntervention: boolean;
}

const AiChatModal: React.FC<AiChatModalProps> = ({
  isOpen,
  onClose,
  params,
  initialConditions,
  simulationData,
  currentR0,
  nInitial,
  hasIntervention
}) => {  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseLength, setResponseLength] = useState<'singkat' | 'sedang' | 'panjang'>('sedang');
  const [includeChartAnalysis, setIncludeChartAnalysis] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Konteks jurnal lengkap untuk chat AI
      const journalContext = `
KONTEKS PENELITIAN MODEL SEAR:

Model SEAR (Susceptible-Exposed-Addicted-Recovered) untuk analisis kecanduan game online:

KOMPARTEMEN MODEL:
- S (Susceptible): Individu rentan yang belum terpapar game online namun berpotensi kecanduan
- E (Exposed): Individu yang telah mencoba bermain game online namun belum menunjukkan tanda kecanduan
- A (Addicted): Individu yang mengalami kecanduan game online dengan gejala merugikan
- R (Recovered): Individu yang telah pulih dari kecanduan dan memiliki resistensi

SISTEM PERSAMAAN:
- dS/dt = Λ - (α + μ₂)S
- dE/dt = αS - (β + μ₂)E
- dA/dt = βE - (γ + θ + μ₂)A
- dR/dt = (γ + θ)A - μ₂R

PARAMETER TRANSISI:
- α = ${params.alpha}: Laju S→E (paparan game)
- β = ${params.beta}: Laju E→A (menjadi kecanduan)  
- γ = ${params.gamma}: Laju pemulihan alami A→R
- θ = ${params.theta}: Efektivitas intervensi (0=tanpa, 1=dengan)
- μ₁ = ${params.mu1}: Laju rekrutmen populasi baru
- μ₂ = ${params.mu2}: Laju keluar alami

BASIC REPRODUCTION NUMBER:
R₀ = ${currentR0.toFixed(3)} = (αβ)/((β + μ₂)(γ + θ + μ₂))
${currentR0 > 1 ? '- R₀ > 1: Kecanduan menyebar dan menjadi endemik' : '- R₀ < 1: Kecanduan menghilang secara alami'}

ANALISIS INTERVENSI:
${hasIntervention ? '- Program intervensi AKTIF (konseling, terapi, dukungan sosial)' : '- TANPA program intervensi, hanya pemulihan alami'}
`;      const contextualPrompt = `
${journalContext}

KONDISI SIMULASI SAAT INI:
- Kondisi Awal: S₀=${initialConditions.S0}, E₀=${initialConditions.E0}, A₀=${initialConditions.A0}, R₀=${initialConditions.R0}
- Total Populasi: ${nInitial}
- Status Terakhir: S=${simulationData[simulationData.length - 1]?.S?.toFixed(0)}, E=${simulationData[simulationData.length - 1]?.E?.toFixed(0)}, A=${simulationData[simulationData.length - 1]?.A?.toFixed(0)}, R=${simulationData[simulationData.length - 1]?.R?.toFixed(0)}

PERTANYAAN USER: ${userMessage.content}

${includeChartAnalysis ? 
'**CATATAN:** Analisis grafik AKTIF - gunakan informasi visual dari grafik simulasi untuk memberikan jawaban yang lebih akurat dan detail tentang pola kurva, tren, dan titik kritis yang terlihat.' : 
'**CATATAN:** Analisis berbasis data numerik - fokus pada angka dan parameter simulasi.'}

**INSTRUKSI FORMAT:**
Jawab menggunakan format Markdown yang benar:
- Gunakan ## untuk heading utama
- Gunakan **bold** untuk emphasis penting  
- Gunakan notasi LaTeX dengan $ untuk matematika (contoh: $R_0$, $\\alpha$, $\\beta$)
- Gunakan bullet points dengan - untuk list
- Struktur jawaban dengan jelas dan mudah dipahami

Jawab berdasarkan konteks model SEAR di atas dengan penjelasan yang mudah dipahami dan relevan dengan teori epidemiologi kecanduan game online.`;

      let response;
      
      if (includeChartAnalysis) {
        // Use chart analysis with vision capabilities
        response = await getAiChartAnalysis(
          params,
          initialConditions,
          simulationData,
          currentR0,
          nInitial,
          hasIntervention,
          responseLength === 'singkat' ? 8 : responseLength === 'sedang' ? 16 : 24,
          'simulation-chart', // Chart element ID
          responseLength
        );
      } else {
        // Use regular text-based analysis
        response = await getAiInterpretation(
          params,
          initialConditions,
          simulationData,
          currentR0,
          nInitial,
          hasIntervention,
          responseLength === 'singkat' ? 8 : responseLength === 'sedang' ? 16 : 24,
          contextualPrompt,
          responseLength
        );
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.success ? response.interpretation || 'Maaf, tidak ada respons dari AI.' : response.error || 'Terjadi kesalahan.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Maaf, terjadi kesalahan saat memproses pertanyaan Anda.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-3 md:p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center space-x-2 md:space-x-3">
            <ChatIcon className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-sky-400" />
            <h2 className="text-lg md:text-xl font-semibold text-blue-600 dark:text-sky-400">Chat dengan AI Gemini</h2>
          </div>          <div className="flex items-center space-x-2">
            {/* Chart Analysis Toggle */}
            <div className="flex items-center space-x-1">
              <input
                type="checkbox"
                id="chart-analysis"
                checked={includeChartAnalysis}
                onChange={(e) => setIncludeChartAnalysis(e.target.checked)}
                className="w-3 h-3 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="chart-analysis" className="text-xs text-slate-600 dark:text-slate-400 flex items-center">
                <EyeIcon className="w-3 h-3 mr-1" />
                Grafik
              </label>
            </div>
            {/* Response Length Selector */}
            <div className="flex items-center space-x-1">
              <label className="text-xs text-slate-400">Panjang:</label>
              <select
                value={responseLength}
                onChange={(e) => setResponseLength(e.target.value as 'singkat' | 'sedang' | 'panjang')}
                className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-sky-400"
              >
                <option value="singkat">Singkat</option>
                <option value="sedang">Sedang</option>
                <option value="panjang">Panjang</option>
              </select>
            </div>
            <button
              onClick={clearChat}
              className="px-2 md:px-3 py-1 text-xs md:text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-md transition-colors"
            >
              Hapus Chat
            </button>
            <button
              onClick={onClose}
              className="p-1.5 md:p-2 text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              <CloseIcon className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.length === 0 && (            <div className="text-center text-slate-600 dark:text-slate-400 mt-8">
              <ChatIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Mulai percakapan dengan AI</p>
              <p className="text-sm mb-3">Tanyakan apapun tentang simulasi SEAR dan hasil analisis!</p>
              <div className="text-xs text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 rounded-lg p-3 max-w-md mx-auto">
                <div className="flex items-center justify-center mb-2">
                  <EyeIcon className="w-4 h-4 mr-1 text-purple-500" />
                  <span className="font-medium">Tips: Aktifkan "Grafik" untuk analisis visual</span>
                </div>
                <p>Mode grafik menggunakan AI Vision untuk menganalisis pola kurva, tren, dan detail visual dari simulasi.</p>
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] md:max-w-[70%] rounded-lg px-4 py-3 break-words ${
                  message.type === 'user'
                    ? 'bg-blue-500 dark:bg-sky-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200'
                }`}
              >
                {message.type === 'user' ? (
                  <div className="whitespace-pre-wrap break-words">{message.content}</div>
                ) : (
                  <MarkdownRenderer content={message.content} />
                )}
                <div className={`text-xs mt-2 opacity-70 ${
                  message.type === 'user' ? 'text-blue-100 dark:text-sky-100' : 'text-slate-600 dark:text-slate-400'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] md:max-w-[70%] rounded-lg px-4 py-3 bg-slate-100 dark:bg-slate-700">
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="sm" className="text-blue-600 dark:text-sky-400" />
                  <span className="text-slate-700 dark:text-slate-300">AI sedang berpikir...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center space-x-3">              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={includeChartAnalysis ? "Tanyakan tentang grafik simulasi SEAR..." : "Tanyakan sesuatu tentang simulasi SEAR..."}
                className="flex-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-400 focus:border-transparent"
                disabled={isLoading}
              />
            <button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-blue-500 hover:bg-blue-600 dark:bg-sky-500 dark:hover:bg-sky-600 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors flex-shrink-0"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </div>            <div className="mt-2 text-xs text-slate-600 dark:text-slate-500">
              Tekan Enter untuk kirim, Shift+Enter untuk baris baru
              {includeChartAnalysis && (
                <span className="ml-2 text-purple-600 dark:text-purple-400">
                  • Analisis grafik aktif
                </span>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AiChatModal;
