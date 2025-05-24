import React, { useState, useEffect, useCallback } from 'react';

import { DEFAULT_PARAMS, DEFAULT_INITIAL_CONDITIONS, SIMULATION_DURATION_MONTHS, TIME_STEP, THETA_WITH_INTERVENTION, THETA_WITHOUT_INTERVENTION } from './constants';
import type { SeirParams, InitialConditions, SimulationDataPoint, SeirParameterKey, InitialConditionKey, AiInterpretationResponse } from './types';
import { runSeirSimulation } from './services/seirSimulator';
import { getAiInterpretation } from './services/geminiService';
import ParameterControls from './components/ParameterControls';
import SimulationChart from './components/SimulationChart';
import SeirModelInfo from './components/SeirModelInfo';
import PaperModal from './components/PaperModal';
import AiInterpretationSection from './components/AiInterpretationSection';
import AiChatModal from './components/AiChatModal';
import { InfoIcon, UsersIcon, EyeIcon, ZapIcon, ShieldCheckIcon, BarChartIcon, SettingsIcon, BookOpenIcon, SparklesIcon } from './components/icons';
import { paperTitle, paperFullText } from './paperContent';


const App: React.FC = () => {
  const [hasIntervention, setHasIntervention] = useState<boolean>(true);
  const [params, setParams] = useState<SeirParams>({
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

  const N_initial = initialConditions.S0 + initialConditions.E0 + initialConditions.I0 + initialConditions.R0;

  const calculateR0 = useCallback((currentParams: SeirParams): number => {
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
    const N_val = initialConditions.S0 + initialConditions.E0 + initialConditions.I0 + initialConditions.R0;
    if (N_val <= 0) {
      setSimulationData([{ time: 0, S: initialConditions.S0, E: initialConditions.E0, I: initialConditions.I0, R: initialConditions.R0 }]);
      setCurrentR0(0);
      setAiInterpretation(null);
      // Clear AI-specific error, let chart show its message
      setInterpretationError(null); 
      return;
    }
    // Clear previous errors if simulation is runnable
    setInterpretationError(null); 

    const data = runSeirSimulation(
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
    currentParams: SeirParams,
    currentInitialConditions: InitialConditions,
    currentSimData: SimulationDataPoint[],
    r0: number,
    nInitial: number,
    interventionStatus: boolean
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
        SIMULATION_DURATION_MONTHS
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


  const handleParamChange = <K extends SeirParameterKey,>(paramName: K, value: number) => {
    setParams(prevParams => ({ ...prevParams, [paramName]: value }));
  };

  const handleInitialConditionChange = <K extends InitialConditionKey,>(conditionName: K, value: number) => {
    setInitialConditions(prevConditions => ({ ...prevConditions, [conditionName]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-gray-100 p-4 md:p-8 font-sans">
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-2">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300 text-center sm:text-left">
            Model SEIR: Kecanduan Game Online
            </h1>
            <button
                onClick={() => setIsPaperModalOpen(true)}
                className="mt-4 sm:mt-0 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out flex items-center"
                aria-label="Baca Jurnal Lengkap"
            >
                <BookOpenIcon className="w-5 h-5 mr-2" />
                Baca Jurnal Lengkap
            </button>
        </div>
        <p className="text-slate-300 mt-1 text-md md:text-lg text-center sm:text-left">
          Simulasi interaktif berdasarkan penelitian Syafruddin Side dkk. (2020)
        </p>
      </header>

      <div className="container mx-auto grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        <div className="xl:col-span-1 space-y-4 md:space-y-6">
          <div className="bg-slate-800 shadow-2xl rounded-xl p-4 md:p-6 card-hover">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-sky-400 flex items-center">
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
            />
          </div>
           <div className="bg-slate-800 shadow-2xl rounded-xl p-4 md:p-6 card-hover">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-sky-400 flex items-center">
              <InfoIcon className="w-5 h-5 md:w-6 md:h-6 mr-2" /> Wawasan Model
            </h2>
            <SeirModelInfo currentR0={currentR0} />
          </div>
        </div>

        <div className="xl:col-span-2 space-y-4 md:space-y-6">
            <div className="bg-slate-800 shadow-2xl rounded-xl p-4 md:p-6 card-hover">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-sky-400 flex items-center">
                    <BarChartIcon className="w-5 h-5 md:w-6 md:h-6 mr-2" /> Hasil Simulasi ({SIMULATION_DURATION_MONTHS} Bulan)
                </h2>
                <div className="h-[250px] sm:h-[350px] lg:h-[450px] w-full">
                    <SimulationChart 
                        data={simulationData} 
                        hasIntervention={hasIntervention}
                        showPaperReference={true}
                    />
                </div>
                 { N_initial > 0 && simulationData.length > 0 && simulationData[0].S === initialConditions.S0 && /* Check if actual simulation data is present */
                    <div className="mt-6 space-y-4">
                        {/* Total Population Summary */}
                        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                            <h3 className="text-lg font-semibold text-sky-400 mb-2">Ringkasan Populasi</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                <div>
                                    <div className="text-sm text-slate-400">Populasi Awal</div>
                                    <div className="text-lg font-bold text-white">{N_initial}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-slate-400">Populasi Akhir</div>
                                    <div className="text-lg font-bold text-white">
                                        {simulationData.length > 0 ? Math.round(
                                            (simulationData[simulationData.length - 1]?.S || 0) + 
                                            (simulationData[simulationData.length - 1]?.E || 0) + 
                                            (simulationData[simulationData.length - 1]?.I || 0) + 
                                            (simulationData[simulationData.length - 1]?.R || 0)
                                        ) : 'N/A'}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-slate-400">R₀ (Reproduksi)</div>
                                    <div className={`text-lg font-bold ${currentR0 < 1 ? 'text-green-400' : 'text-red-400'}`}>
                                        {currentR0.toFixed(3)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-slate-400">Status Intervensi</div>
                                    <div className={`text-lg font-bold ${hasIntervention ? 'text-green-400' : 'text-orange-400'}`}>
                                        {hasIntervention ? 'Aktif' : 'Tidak Aktif'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Individual Compartment Statistics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                            {[
                            { 
                                label: 'Susceptible (S)', 
                                value: simulationData[simulationData.length - 1]?.S, 
                                initial: initialConditions.S0,
                                Icon: UsersIcon, 
                                color: 'text-blue-400',
                                bgColor: 'bg-blue-500/10',
                                description: 'Berpotensi Kecanduan'
                            },
                            { 
                                label: 'Exposed (E)', 
                                value: simulationData[simulationData.length - 1]?.E, 
                                initial: initialConditions.E0,
                                Icon: EyeIcon, 
                                color: 'text-yellow-400',
                                bgColor: 'bg-yellow-500/10',
                                description: 'Mencoba Bermain'
                            },
                            { 
                                label: 'Infected (I)', 
                                value: simulationData[simulationData.length - 1]?.I, 
                                initial: initialConditions.I0,
                                Icon: ZapIcon, 
                                color: 'text-red-400',
                                bgColor: 'bg-red-500/10',
                                description: 'Kecanduan'
                            },
                            { 
                                label: 'Recovered (R)', 
                                value: simulationData[simulationData.length - 1]?.R, 
                                initial: initialConditions.R0,
                                Icon: ShieldCheckIcon, 
                                color: 'text-green-400',
                                bgColor: 'bg-green-500/10',
                                description: 'Berhenti Bermain'
                            },
                            ].map(({ label, value, initial, Icon, color, bgColor, description }) => {
                                const currentValue = value !== undefined ? value : 0;
                                const change = currentValue - initial;
                                const finalTotal = simulationData.length > 0 ? 
                                    (simulationData[simulationData.length - 1]?.S || 0) + 
                                    (simulationData[simulationData.length - 1]?.E || 0) + 
                                    (simulationData[simulationData.length - 1]?.I || 0) + 
                                    (simulationData[simulationData.length - 1]?.R || 0) : N_initial;
                                const percentage = finalTotal > 0 ? (currentValue / finalTotal * 100) : 0;
                                
                                return (
                                    <div key={label} className={`${bgColor} border border-slate-600 p-3 md:p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 card-hover`}>
                                        <Icon className={`w-5 h-5 md:w-6 md:h-6 mx-auto mb-2 ${color}`} />
                                        <div className={`text-xs md:text-sm font-medium ${color} mb-1`}>{label}</div>
                                        <div className="text-lg md:text-xl font-bold text-white">{Math.round(currentValue)}</div>
                                        <div className="text-xs text-slate-400 mt-1">{description}</div>
                                        <div className="text-xs text-slate-300 mt-1">
                                            {percentage.toFixed(1)}% dari total
                                        </div>
                                        <div className={`text-xs mt-1 ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {change >= 0 ? '+' : ''}{Math.round(change)} 
                                            <span className="text-slate-400"> dari awal</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                 }
            </div>
            <div className="bg-slate-800 shadow-2xl rounded-xl p-4 md:p-6 card-hover">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-sky-400 flex items-center">
                    <SparklesIcon className="w-5 h-5 md:w-6 md:h-6 mr-2" /> Analisis AI (Gemini)
                </h2>
                <AiInterpretationSection
                    interpretation={aiInterpretation}
                    isLoading={isGeneratingInterpretation}
                    error={interpretationError}
                    onRefresh={() => fetchAndSetAiInterpretation(params, initialConditions, simulationData, currentR0, N_initial, hasIntervention)}
                    onOpenChat={() => setIsAiChatOpen(true)}
                />
            </div>
        </div>
      </div>
       <footer className="text-center mt-12 py-4 text-slate-400 border-t border-slate-700">
        <p>&copy; {new Date().getFullYear()} Simulasi Model SEIR. Hak Cipta Dilindungi.</p>
        <p className="text-sm">Terinspirasi dari karya Syafruddin Side, Nurul Azizah Muzakir, Dian Pebriani, Syana Nurul Utari (2020).</p>
      </footer>
      
      <PaperModal
        isOpen={isPaperModalOpen}
        onClose={() => setIsPaperModalOpen(false)}
        title={paperTitle}
        content={paperFullText}
      />

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
    </div>
  );
};

export default App;
