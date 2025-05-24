import React, { useState, useRef, useEffect } from 'react';
import { CloseIcon, SendIcon, ChatIcon } from './icons';
import LoadingSpinner from './LoadingSpinner';
import { getAiInterpretation } from '../services/geminiService';
import type { SeirParams, InitialConditions, SimulationDataPoint } from '../types';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  params: SeirParams;
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
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
      // Buat prompt yang mencakup pertanyaan user dan konteks simulasi
      const contextualPrompt = `
Konteks Simulasi SEIR:
- Parameter: β=${params.beta}, γ=${params.gamma}, μ₁=${params.mu1}, μ₂=${params.mu2}, θ=${params.theta}
- Kondisi Awal: S₀=${initialConditions.S0}, E₀=${initialConditions.E0}, I₀=${initialConditions.I0}, R₀=${initialConditions.R0}
- R₀ saat ini: ${currentR0.toFixed(3)}
- Total Populasi: ${nInitial}
- Intervensi: ${hasIntervention ? 'Aktif' : 'Tidak Aktif'}
- Data Terakhir: S=${simulationData[simulationData.length - 1]?.S?.toFixed(0)}, E=${simulationData[simulationData.length - 1]?.E?.toFixed(0)}, I=${simulationData[simulationData.length - 1]?.I?.toFixed(0)}, R=${simulationData[simulationData.length - 1]?.R?.toFixed(0)}

Pertanyaan User: ${userMessage.content}

Jawab pertanyaan ini dengan mengacu pada konteks simulasi SEIR di atas. Berikan penjelasan yang mudah dipahami dan relevan dengan data simulasi.`;

      const response = await getAiInterpretation(
        params,
        initialConditions,
        simulationData,
        currentR0,
        nInitial,
        hasIntervention,
        24,
        contextualPrompt
      );

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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 md:p-4 modal-backdrop">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl h-[85vh] md:h-[80vh] flex flex-col modal-content">        {/* Header */}
        <header className="flex items-center justify-between p-3 md:p-4 border-b border-slate-700">
          <div className="flex items-center space-x-2 md:space-x-3">
            <ChatIcon className="w-5 h-5 md:w-6 md:h-6 text-sky-400" />
            <h2 className="text-lg md:text-xl font-semibold text-sky-400">Chat dengan AI Gemini</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={clearChat}
              className="px-2 md:px-3 py-1 text-xs md:text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-md transition-colors"
            >
              Hapus Chat
            </button>
            <button
              onClick={onClose}
              className="p-1.5 md:p-2 text-slate-400 hover:text-red-400 transition-colors"
            >
              <CloseIcon className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-slate-400 mt-8">
              <ChatIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Mulai percakapan dengan AI</p>
              <p className="text-sm">Tanyakan apapun tentang simulasi SEIR dan hasil analisis!</p>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-sky-500 text-white'
                    : 'bg-slate-700 text-slate-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className={`text-xs mt-2 opacity-70 ${
                  message.type === 'user' ? 'text-sky-100' : 'text-slate-400'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
            {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[70%] rounded-lg px-4 py-3 bg-slate-700">
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="sm" className="text-sky-400" />
                  <span className="text-slate-300">AI sedang berpikir...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center space-x-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tanyakan sesuatu tentang simulasi SEIR..."
              className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-sky-500 hover:bg-sky-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Tekan Enter untuk kirim, Shift+Enter untuk baris baru
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiChatModal;
