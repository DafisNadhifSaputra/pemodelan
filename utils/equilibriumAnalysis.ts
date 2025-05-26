// Equilibrium analysis untuk model SEAR
import type { SearParams, EquilibriumPoint, EquilibriumAnalysis } from '../types';

/**
 * Menghitung titik keseimbangan untuk model SEAR
 * Berdasarkan analisis matematika sistem persamaan diferensial
 */
export function calculateEquilibrium(
  params: SearParams,
  totalPopulation: number
): EquilibriumAnalysis {  const { mu1, mu2, alpha, beta, gamma, theta } = params;
  
  // Hitung R0 - sesuai dengan rumus di paper dan App.tsx
  const R0 = beta / (gamma + theta + mu2);
    // Disease-free equilibrium selalu ada
  // Dalam teori epidemiologi: pada disease-free equilibrium, tidak ada transmisi penyakit
  // dS/dt = λ - μ₂S = 0 → S* = λ/μ₂ (tidak ada α karena tidak ada paparan penyakit)
  const S_star = (mu1 * totalPopulation) / mu2;
  const diseaseFreePoint: EquilibriumPoint = {
    S: S_star,
    E: 0,
    A: 0,
    R: 0,
    type: 'disease-free',
    stability: R0 < 1 ? 'stable' : 'unstable'
  };

  let endemicPoint: EquilibriumPoint | undefined;
  let endemicExists = false;
  // Endemic equilibrium hanya ada jika R0 > 1
  if (R0 > 1) {
    endemicExists = true;
    
    // Perhitungan endemic equilibrium sesuai rumus jurnal (halaman 267 pemodelan.tex)
    // S* = μ₁N/(μ₂+α)
    // E* = αμ₁N/((μ₂+β)(μ₂+α))
    // I* = βαμ₁N/((μ₂+γ+θ)(μ₂+β)(μ₂+α))
    // R* = (γ+θ)βαμ₁N/(μ₂(μ₂+γ+θ)(μ₂+β)(μ₂+α))
    
    const lambda = mu1 * totalPopulation; // λ = μ₁N
    
    // S* = μ₁N/(μ₂+α) = λ/(μ₂+α)
    const S_endemic = lambda / (mu2 + alpha);
    
    // E* = αμ₁N/((μ₂+β)(μ₂+α)) = αλ/((μ₂+β)(μ₂+α))
    const E_endemic = (alpha * lambda) / ((mu2 + beta) * (mu2 + alpha));
    
    // I* = βαμ₁N/((μ₂+γ+θ)(μ₂+β)(μ₂+α)) = βαλ/((μ₂+γ+θ)(μ₂+β)(μ₂+α))
    // Catatan: I dalam jurnal = A dalam kode (Addicted)
    const A_endemic = (beta * alpha * lambda) / 
                     ((mu2 + gamma + theta) * (mu2 + beta) * (mu2 + alpha));
    
    // R* = (γ+θ)βαμ₁N/(μ₂(μ₂+γ+θ)(μ₂+β)(μ₂+α)) = (γ+θ)βαλ/(μ₂(μ₂+γ+θ)(μ₂+β)(μ₂+α))
    const R_endemic = ((gamma + theta) * beta * alpha * lambda) / 
                     (mu2 * (mu2 + gamma + theta) * (mu2 + beta) * (mu2 + alpha));

    // Verifikasi bahwa nilai-nilai positif dan realistis
    if (S_endemic > 0 && E_endemic > 0 && A_endemic > 0 && R_endemic > 0) {
      endemicPoint = {
        S: S_endemic,
        E: E_endemic,
        A: A_endemic,
        R: R_endemic,
        type: 'endemic',
        stability: 'stable'
      };
    }
  }

  // Estimasi waktu konvergensi (berdasarkan eigenvalue dominant)
  let timeToEquilibrium: number | undefined;
  
  // Untuk R0 < 1, estimasi berdasarkan recovery rate
  if (R0 < 1) {
    // Time scale tergantung pada parameter terkecil (bottleneck)
    const effectiveDecayRate = Math.min(gamma + theta + mu2, beta + mu2, alpha + mu2);
    timeToEquilibrium = Math.ceil(5 / effectiveDecayRate); // 5 time constants untuk 99% konvergensi
  } else if (endemicPoint) {
    // Untuk endemic case, estimasi berdasarkan parameter sistem
    const settlingTime = Math.ceil(3 / Math.min(mu2, gamma + theta));
    timeToEquilibrium = settlingTime;
  }

  return {
    diseaseFreePreviouslyExists: true, // Selalu ada
    diseaseFreePoint,
    endemicExists,
    endemicPoint,
    R0,
    timeToEquilibrium
  };
}

/**
 * Format equilibrium point untuk display
 */
export function formatEquilibriumPoint(point: EquilibriumPoint, precision: number = 1): string {
  return `S*=${point.S.toFixed(precision)}, E*=${point.E.toFixed(precision)}, A*=${point.A.toFixed(precision)}, R*=${point.R.toFixed(precision)}`;
}

/**
 * Cek apakah simulasi sudah mendekati equilibrium
 */
export function isNearEquilibrium(
  currentState: { S: number; E: number; A: number; R: number },
  equilibriumPoint: EquilibriumPoint,
  tolerance: number = 0.01 // 1% tolerance
): boolean {
  const relativeError = Math.sqrt(
    Math.pow((currentState.S - equilibriumPoint.S) / equilibriumPoint.S, 2) +
    Math.pow((currentState.E - equilibriumPoint.E) / (equilibriumPoint.E + 1), 2) + // +1 to avoid division by zero
    Math.pow((currentState.A - equilibriumPoint.A) / (equilibriumPoint.A + 1), 2) +
    Math.pow((currentState.R - equilibriumPoint.R) / (equilibriumPoint.R + 1), 2)
  );
  
  return relativeError < tolerance;
}
