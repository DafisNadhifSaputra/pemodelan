
import type { SearParams, InitialConditions, SimulationDataPoint } from '../types';

// Konstanta populasi tetap seperti dalam kode Python
const N_CONSTANT = 176;

export const runSearSimulation = (
  params: SearParams,
  initialConditions: InitialConditions,
  _N_initial: number, // Total populasi awal S0+E0+A0+R0 (tidak digunakan, hanya untuk kompatibilitas)
  duration: number, // dalam bulan
  timeStep: number // dalam bulan (misalnya, 1 untuk langkah per bulan)
): SimulationDataPoint[] => {
  const data: SimulationDataPoint[] = [];
  let { S0, E0, A0, R0 } = initialConditions;

  // Validasi kondisi awal
  if (S0 < 0 || E0 < 0 || A0 < 0 || R0 < 0) {
    return [{ time: 0, S: S0, E: E0, A: A0, R: R0 }];
  }

  let S_current = S0;
  let E_current = E0;
  let A_current = A0;
  let R_current = R0;

  for (let t = 0; t <= duration; t += timeStep) {
    data.push({ time: t, S: S_current, E: E_current, A: A_current, R: R_current });

    if (t === duration) break;

    // Model SEAR dengan populasi konstan N = 176 (seperti kode Python)
    // Lambda (laju recruitment) = μ₁ × N_CONSTANT (populasi tetap konstan)
    const lambda = params.mu1 * N_CONSTANT;
    
    // Persamaan diferensial SEAR sesuai paper asli (halaman 159):
    // dS/dt = Λ - (α + μ₂)S
    // dE/dt = αS - (β + μ₂)E  
    // dA/dt = βE - (γ + θ + μ₂)A  (A = Addicted, dulunya I)
    // dR/dt = (γ + θ)A - μ₂R
    const dS = lambda - (params.alpha + params.mu2) * S_current;
    const dE = params.alpha * S_current - (params.beta + params.mu2) * E_current;
    const dA = params.beta * E_current - (params.gamma + params.theta + params.mu2) * A_current;
    const dR = (params.gamma + params.theta) * A_current - params.mu2 * R_current;
    
    // Update dengan Euler method
    S_current += dS * timeStep;
    E_current += dE * timeStep;
    A_current += dA * timeStep;
    R_current += dR * timeStep;

    // Pastikan populasi tidak negatif
    S_current = Math.max(0, S_current);
    E_current = Math.max(0, E_current);
    A_current = Math.max(0, A_current);
    R_current = Math.max(0, R_current);
  }

  return data;
};

// Alias untuk backward compatibility
export const runSeirSimulation = runSearSimulation;
