
export interface SeirParams {
  mu1: number; // Recruitment rate related to N_initial
  mu2: number; // General exit rate from each compartment
  alpha: number; // S -> E transition rate
  beta: number;  // E -> I transition rate
  gamma: number; // I -> R natural recovery rate
  theta: number; // I -> R intervention-based recovery rate (set in App.tsx)
}

export interface InitialConditions {
  S0: number; // Initial Susceptible
  E0: number; // Initial Exposed
  I0: number; // Initial Infected
  R0: number; // Initial Recovered
}

export interface SimulationDataPoint {
  time: number; // Month
  S: number;
  E: number;
  I: number;
  R: number;
}

export type SeirParameterKey = keyof Omit<SeirParams, 'theta'>; // theta is handled by intervention toggle
export type InitialConditionKey = keyof InitialConditions;

export interface AiInterpretationResponse {
    success: boolean;
    interpretation?: string;
    error?: string;
}
