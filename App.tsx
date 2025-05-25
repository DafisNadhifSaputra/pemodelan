import React, { useState, useEffect, useCallback, lazy } from 'react';

import { DEFAULT_PARAMS, DEFAULT_INITIAL_CONDITIONS, SIMULATION_DURATION_MONTHS, TIME_STEP, THETA_WITH_INTERVENTION, THETA_WITHOUT_INTERVENTION } from './constants';
import type { SearParams, InitialConditions, SimulationDataPoint, SearParameterKey, InitialConditionKey, AiInterpretationResponse } from './types';
import { runSearSimulation } from './services/seirSimulator';
import { getAiInterpretation, getAiChartAnalysis } from './services/geminiService';
import ParameterControls from './components/ParameterControls';
import SearModelInfo from './components/SeirModelInfo';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoadingProvider } from './contexts/LoadingContext';
import { InfoIcon, BarChartIcon, SettingsIcon, BookOpenIcon, SparklesIcon } from './components/icons';
import LazyLoadWrapper from './components/LazyLoadWrapper';
import LoadingProgressBar from './components/LoadingProgressBar';

// Lazy loaded components untuk optimasi performa
const StatisticsCards = lazy(() => import('./components/StatisticsCards'));
const AiInterpretationSection = lazy(() => import('./components/AiInterpretationSection'));
const PaperModal = lazy(() => import('./components/PaperModal'));
const AiChatModal = lazy(() => import('./components/AiChatModal'));
const JournalPage = lazy(() => import('./components/JournalPage'));

// Import SimulationChart directly to avoid lazy loading issues
import SimulationChart from './components/SimulationChart';


const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<'simulation' | 'journal'>('simulation');
  const [hasIntervention, setHasIntervention] = useState<boolean>(true);
  const [params, setParams] = useState<SearParams>({
    ...DEFAULT_PARAMS,
    theta: hasIntervention ? THETA_WITH_INTERVENTION : THETA_WITHOUT_INTERVENTION,
  });
  const [initialConditions, setInitialConditions] = useState<InitialConditions>(DEFAULT_INITIAL_CONDITIONS);
  const [simulationData, setSimulationData] = useState<SimulationDataPoint[]>([]);
  const [currentR0, setCurrentR0] = useState<number>(0);

  const [isPaperModalOpen, setIsPaperModalOpen] = useState<boolean>(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState<boolean>(false);
  const [aiInterpretation, setAiInterpretation] = useState<string | null>(null);
  const [isGeneratingInterpretation, setIsGeneratingInterpretation] = useState<boolean>(false);
  const [interpretationError, setInterpretationError] = useState<string | null>(null);

  const N_initial = initialConditions.S0 + initialConditions.E0 + initialConditions.A0 + initialConditions.R0;

  const calculateR0 = useCallback((currentParams: SearParams): number => {
    // Theta is already part of currentParams when this is called
    if ((currentParams.gamma + currentParams.theta + currentParams.mu2) === 0) return Infinity;
    return currentParams.beta / (currentParams.gamma + currentParams.theta + currentParams.mu2);
  }, []);

  useEffect(() => {
    const newTheta = hasIntervention ? THETA_WITH_INTERVENTION : THETA_WITHOUT_INTERVENTION;
    setParams(prevParams => {
      if (prevParams.theta !== newTheta) {
        return { ...prevParams, theta: newTheta };
      }
      return prevParams;
    });
  }, [hasIntervention]);

  useEffect(() => {
    const N_val = initialConditions.S0 + initialConditions.E0 + initialConditions.A0 + initialConditions.R0;
    if (N_val <= 0) {
      setSimulationData([{ time: 0, S: initialConditions.S0, E: initialConditions.E0, A: initialConditions.A0, R: initialConditions.R0 }]);
      setCurrentR0(0);
      setAiInterpretation(null);
      // Clear AI-specific error, let chart show its message
      setInterpretationError(null); 
      return;
    }
    // Clear previous errors if simulation is runnable
    setInterpretationError(null); 

    const data = runSearSimulation(
      params,
      initialConditions,
      N_val,
      SIMULATION_DURATION_MONTHS,
      TIME_STEP
    );
    setSimulationData(data);
    setCurrentR0(calculateR0(params));
  }, [params, initialConditions, calculateR0]);

  const fetchAndSetAiInterpretation = async (
    currentParams: SearParams,
    currentInitialConditions: InitialConditions,
    currentSimData: SimulationDataPoint[],
    r0: number,
    nInitial: number,
    interventionStatus: boolean,
    responseLength: 'singkat' | 'sedang' | 'panjang' = 'sedang'
  ) => {
    // The API key check is now robustly handled in getAiInterpretation service.
    // This function now focuses on managing state for the API call.
    setIsGeneratingInterpretation(true);
    setInterpretationError(null);
    setAiInterpretation(null);
    try {
      const interpretationResult: AiInterpretationResponse = await getAiInterpretation(
        currentParams,
        currentInitialConditions,
        currentSimData,
        r0,
        nInitial,
        interventionStatus,
        SIMULATION_DURATION_MONTHS,
        undefined,
        responseLength
      );
      if (interpretationResult.success && interpretationResult.interpretation) {
        setAiInterpretation(interpretationResult.interpretation);
      } else {
        setAiInterpretation(null);
        setInterpretationError(interpretationResult.error || "Gagal mendapatkan interpretasi dari AI.");
      }
    } catch (error) {
      console.error("Error fetching AI interpretation:", error);
      setAiInterpretation(null);
      let errorMessage = "Terjadi kesalahan saat mengambil interpretasi AI.";
      if (error instanceof Error) {
          errorMessage += ` Detail: ${error.message}`;
      }
      setInterpretationError(errorMessage);
    } finally {
      setIsGeneratingInterpretation(false);
    }
  };

  const fetchAndSetAiChartAnalysis = async (
    currentParams: SearParams,
    currentInitialConditions: InitialConditions,
    currentSimData: SimulationDataPoint[],
    r0: number,
    nInitial: number,
    interventionStatus: boolean,
    responseLength?: 'singkat' | 'sedang' | 'panjang'
  ) => {
    // Function for AI chart analysis with vision capabilities
    setIsGeneratingInterpretation(true);
    setInterpretationError(null);
    setAiInterpretation(null);
    try {
      const interpretationResult: AiInterpretationResponse = await getAiChartAnalysis(
        currentParams,
        currentInitialConditions,
        currentSimData,
        r0,
        nInitial,
        interventionStatus,
        SIMULATION_DURATION_MONTHS,
        'simulation-chart', // Chart element ID
        responseLength || 'sedang'
      );
      if (interpretationResult.success && interpretationResult.interpretation) {
        setAiInterpretation(interpretationResult.interpretation);
      } else {
        setAiInterpretation(null);
        setInterpretationError(interpretationResult.error || "Gagal mendapatkan analisis grafik dari AI.");
      }
    } catch (error) {
      console.error("Error fetching AI chart analysis:", error);
      setAiInterpretation(null);
      let errorMessage = "Terjadi kesalahan saat mengambil analisis grafik AI.";
      if (error instanceof Error) {
          errorMessage += ` Detail: ${error.message}`;
      }
      setInterpretationError(errorMessage);
    } finally {
      setIsGeneratingInterpretation(false);
    }
  };

  // Tidak lagi menggunakan debounced fetch karena AI interpretation sekarang manual
  // const debouncedFetchInterpretation = useCallback(
  //   debounce(fetchAndSetAiInterpretation, 1500),
  //   [] 
  // );

  // Menghilangkan auto-fetch AI interpretation
  // useEffect(() => {
  //   if (simulationData && simulationData.length > 0 && N_initial > 0 &&
  //       !(simulationData.length === 1 && simulationData[0].S === initialConditions.S0 && N_initial <=0)
  //   ) {
  //     debouncedFetchInterpretation(params, initialConditions, simulationData, currentR0, N_initial, hasIntervention);
  //   } else if (N_initial <= 0) {
  //       setAiInterpretation(null);
  //       setInterpretationError(null);
  //   }
  // }, [simulationData, params, initialConditions, currentR0, N_initial, hasIntervention, debouncedFetchInterpretation]);


  const handleParamChange = <K extends SearParameterKey,>(paramName: K, value: number) => {
    setParams(prevParams => ({ ...prevParams, [paramName]: value }));
  };

  const handleInitialConditionChange = <K extends InitialConditionKey,>(conditionName: K, value: number) => {
    setInitialConditions(prevConditions => ({ ...prevConditions, [conditionName]: value }));
  };

  const handleReset = () => {
    setParams({
      ...DEFAULT_PARAMS,
      theta: hasIntervention ? THETA_WITH_INTERVENTION : THETA_WITHOUT_INTERVENTION,
    });
    setInitialConditions(DEFAULT_INITIAL_CONDITIONS);
    setHasIntervention(true);
    // Clear AI interpretation when resetting
    setAiInterpretation(null);
    setInterpretationError(null);
  };

  // Handle view switching
  if (currentView === 'journal') {
    return (
      <LazyLoadWrapper fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4 animate-pulse">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="text-slate-600 dark:text-slate-400">Memuat halaman jurnal...</p>
          </div>
        </div>
      }>
        <JournalPage onBack={() => setCurrentView('simulation')} />
      </LazyLoadWrapper>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-700 text-gray-900 dark:text-gray-100 p-4 md:p-8 font-sans">
      <LoadingProgressBar />
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-2">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 dark:from-sky-400 to-cyan-600 dark:to-cyan-300 text-center sm:text-left">
            Model SEAR: Kecanduan Game Online
            </h1>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <ThemeToggle />
              <button
                  onClick={() => setCurrentView('journal')}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out flex items-center"
                  aria-label="Baca Jurnal Lengkap"
              >
                  <BookOpenIcon className="w-5 h-5 mr-2" />
                  Jurnal Penelitian
              </button>
              <button
                  onClick={() => setIsPaperModalOpen(true)}
                  className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out flex items-center"
                  aria-label="Baca Paper Asli"
              >
                  <BookOpenIcon className="w-5 h-5 mr-2" />
                  Paper Asli
              </button>
            </div>
        </div>
        <p className="text-slate-600 dark:text-slate-300 mt-1 text-md md:text-lg text-center sm:text-left">
          Simulasi interaktif Model SEAR (Susceptible-Exposed-Addicted-Recovered) untuk analisis kecanduan game online
        </p>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm text-center sm:text-left">
          Dikembangkan oleh Tim Matematika UNESA: Dafis N.S., Nabila A.P., Helmaylia D.P., Mayla Y.M.
        </p>
      </header>

      <div className="container mx-auto grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        <div className="xl:col-span-1 space-y-4 md:space-y-6">
          <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-xl p-4 md:p-6 card-hover">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-blue-600 dark:text-sky-400 flex items-center">
              <SettingsIcon className="w-5 h-5 md:w-6 md:h-6 mr-2" /> Konfigurasi Model
            </h2>
            <ParameterControls
              params={params}
              initialConditions={initialConditions}
              hasIntervention={hasIntervention}
              onParamChange={handleParamChange}
              onInitialConditionChange={handleInitialConditionChange}
              onInterventionChange={setHasIntervention}
              N_initial={N_initial}
              onReset={handleReset}
            />
          </div>
           <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-xl p-4 md:p-6 card-hover">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-blue-600 dark:text-sky-400 flex items-center">
              <InfoIcon className="w-5 h-5 md:w-6 md:h-6 mr-2" /> Wawasan Model
            </h2>
            <SearModelInfo currentR0={currentR0} />
          </div>
        </div>

        <div className="xl:col-span-2 space-y-4 md:space-y-6">
            <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-xl p-4 md:p-6 card-hover">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-blue-600 dark:text-sky-400 flex items-center">
                    <BarChartIcon className="w-5 h-5 md:w-6 md:h-6 mr-2" /> Hasil Simulasi ({SIMULATION_DURATION_MONTHS} Bulan)
                </h2>
                
                <div className="h-[250px] sm:h-[350px] lg:h-[450px] w-full">
                    <SimulationChart 
                        data={simulationData} 
                        hasIntervention={hasIntervention}
                        showPaperReference={true}
                    />
                </div>
                
                {/* Statistics Cards */}
                {N_initial > 0 && simulationData.length > 0 && (
                    <div className="mt-6">
                        <LazyLoadWrapper fallback={
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg animate-pulse">
                                        <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded mb-2"></div>
                                        <div className="h-6 bg-slate-200 dark:bg-slate-600 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        }>
                            <StatisticsCards
                                simulationData={simulationData}
                                hasIntervention={hasIntervention}
                                currentR0={currentR0}
                                N_initial={N_initial}
                                params={params}
                                initialConditions={initialConditions}
                            />
                        </LazyLoadWrapper>
                    </div>
                )}
            </div>
            <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-xl p-4 md:p-6 card-hover">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-blue-600 dark:text-sky-400 flex items-center">
                    <SparklesIcon className="w-5 h-5 md:w-6 md:h-6 mr-2" /> Analisis AI (Gemini)
                </h2>
                <LazyLoadWrapper fallback={
                    <div className="space-y-4 animate-pulse">
                        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                        <div className="h-20 bg-slate-700 rounded"></div>
                        <div className="flex space-x-2">
                            <div className="h-8 bg-slate-700 rounded w-20"></div>
                            <div className="h-8 bg-slate-700 rounded w-20"></div>
                        </div>
                    </div>
                }>
                    <AiInterpretationSection
                        interpretation={aiInterpretation}
                        isLoading={isGeneratingInterpretation}
                        error={interpretationError}
                        onRefresh={(responseLength = 'sedang') => fetchAndSetAiInterpretation(params, initialConditions, simulationData, currentR0, N_initial, hasIntervention, responseLength)}
                        onRefreshWithChart={(responseLength = 'sedang') => fetchAndSetAiChartAnalysis(params, initialConditions, simulationData, currentR0, N_initial, hasIntervention, responseLength)}
                        onOpenChat={() => setIsAiChatOpen(true)}
                    />
                </LazyLoadWrapper>
            </div>
        </div>
      </div>
       <footer className="text-center mt-12 py-6 text-slate-400 dark:text-gray-400 border-t border-slate-700 dark:border-gray-600">
        <div className="space-y-3">
          <p>&copy; {new Date().getFullYear()} Simulasi Model SEAR - Kecanduan Game Online. Hak Cipta Dilindungi.</p>
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500 dark:text-gray-300">Dikembangkan oleh:</p>
            <div className="text-sm space-y-1">
              <p><strong>Dafis Nadhif Saputra</strong> • <strong>Nabila Agatha Parsa</strong></p>
              <p><strong>Helmaylia Deshynta Putri</strong> • <strong>Mayla Yaasmiin Mumtaazah</strong></p>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-2">Mahasiswa S1 Matematika, Universitas Negeri Surabaya</p>
            </div>
          </div>
          <p className="text-xs border-t border-slate-600 dark:border-gray-600 pt-3 mt-4">
            Terinspirasi dari penelitian: Syafruddin Side, Nurul Azizah Muzakir, Dian Pebriani, Syana Nurul Utari (2020)
          </p>
        </div>
      </footer>
      {isPaperModalOpen && (
          
            <PaperModal
              isOpen={isPaperModalOpen}
              onClose={() => setIsPaperModalOpen(false)}
              title="Model SEIR Kecanduan Game Online pada Siswa di SMP Negeri 3 Makassar"
            />
         
        )}

        {isAiChatOpen && (
          
            <AiChatModal
              isOpen={isAiChatOpen}
              onClose={() => setIsAiChatOpen(false)}
              params={params}
              initialConditions={initialConditions}
              simulationData={simulationData}
              currentR0={currentR0}
              nInitial={N_initial}
              hasIntervention={hasIntervention}
            />

        )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LoadingProvider>
        <AppContent />
      </LoadingProvider>
    </ThemeProvider>
  );
};

export default App;
export { App };
