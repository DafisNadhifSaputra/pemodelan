
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
