
import type { SeirParams, InitialConditions, SimulationDataPoint } from '../types';

// Konstanta populasi tetap seperti dalam kode Python
const N_CONSTANT = 176;

export const runSeirSimulation = (
  params: SeirParams,
  initialConditions: InitialConditions,
  _N_initial: number, // Total populasi awal S0+E0+I0+R0 (tidak digunakan, hanya untuk kompatibilitas)
  duration: number, // dalam bulan
  timeStep: number // dalam bulan (misalnya, 1 untuk langkah per bulan)
): SimulationDataPoint[] => {
  const data: SimulationDataPoint[] = [];
  let { S0, E0, I0, R0 } = initialConditions;

  // Validasi kondisi awal
  if (S0 < 0 || E0 < 0 || I0 < 0 || R0 < 0) {
    return [{ time: 0, S: S0, E: E0, I: I0, R: R0 }];
  }

  let S_current = S0;
  let E_current = E0;
  let I_current = I0;
  let R_current = R0;

  for (let t = 0; t <= duration; t += timeStep) {
    data.push({ time: t, S: S_current, E: E_current, I: I_current, R: R_current });

    if (t === duration) break;

    // Model SEIR dengan populasi konstan N = 176 (seperti kode Python)
    // Lambda (laju recruitment) = μ₁ × N_CONSTANT (populasi tetap konstan)
    const lambda = params.mu1 * N_CONSTANT;
    
    // Persamaan diferensial SEIR sesuai paper asli (halaman 159):
    // dS/dt = Λ - (α + μ₂)S
    // dE/dt = αS - (β + μ₂)E  
    // dI/dt = βE - (γ + θ + μ₂)I
    // dR/dt = (γ + θ)I - μ₂R
    const dS = lambda - (params.alpha + params.mu2) * S_current;
    const dE = params.alpha * S_current - (params.beta + params.mu2) * E_current;
    const dI = params.beta * E_current - (params.gamma + params.theta + params.mu2) * I_current;
    const dR = (params.gamma + params.theta) * I_current - params.mu2 * R_current;
    
    // Update dengan Euler method
    S_current += dS * timeStep;
    E_current += dE * timeStep;
    I_current += dI * timeStep;
    R_current += dR * timeStep;

    // Pastikan populasi tidak negatif
    S_current = Math.max(0, S_current);
    E_current = Math.max(0, E_current);
    I_current = Math.max(0, I_current);
    R_current = Math.max(0, R_current);
  }

  return data;
};
