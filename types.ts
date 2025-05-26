export interface SearParams {
  mu1: number; // Recruitment rate related to N_initial
  mu2: number; // General exit rate from each compartment
  alpha: number; // S -> E transition rate
  beta: number;  // E -> A transition rate (Addicted)
  gamma: number; // A -> R natural recovery rate
  theta: number; // A -> R intervention-based recovery rate (set in App.tsx)
}

export interface InitialConditions {
  S0: number; // Initial Susceptible
  E0: number; // Initial Exposed
  A0: number; // Initial Addicted (formerly I0)
  R0: number; // Initial Recovered
}

export interface SimulationDataPoint {
  time: number; // Month
  S: number;
  E: number;
  A: number; // Addicted (formerly I)
  R: number;
}

// Alias untuk backward compatibility
export type SeirParams = SearParams;
export type SearParameterKey = keyof Omit<SearParams, 'theta'>; // theta is handled by intervention toggle
export type SeirParameterKey = SearParameterKey; // backward compatibility
export type InitialConditionKey = keyof InitialConditions;

export interface AiInterpretationResponse {
    success: boolean;
    interpretation?: string;
    error?: string;
}

export interface EquilibriumPoint {
  S: number;
  E: number;
  A: number;
  R: number;
  type: 'disease-free' | 'endemic';
  stability: 'stable' | 'unstable' | 'unknown';
}

export interface EquilibriumAnalysis {
  diseaseFreePreviouslyExists: boolean;
  diseaseFreePoint?: EquilibriumPoint;
  endemicExists: boolean;
  endemicPoint?: EquilibriumPoint;
  R0: number;
  timeToEquilibrium?: number; // estimated time in months
}

// Interface untuk kompatibilitas dengan simulator revisi
export interface SimulationParameters {
  alpha: number;  // β - laju transmisi
  beta: number;   // σ - laju progresivitas
  delta: number;  // γ - laju pemulihan alami
  theta: number;  // θ - efektivitas intervensi
  mu1: number;    // tidak digunakan di model revisi
  mu2: number;    // μ - laju keluar alami
}

export interface SimulationData {
  time: number;
  S: number;
  E: number;
  A: number; // Addicted (mengganti I)
  R: number;
}
