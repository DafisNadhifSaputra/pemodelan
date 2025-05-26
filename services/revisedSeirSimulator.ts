import type { SimulationData, SimulationParameters } from '../types';

// Model SEAR yang direvisi dari revisi.tex  
// S = Susceptible (Rentan)
// E = Exposed (Terpapar)
// A = Addicted (Kecanduan) - mengganti I
// R = Recovered (Pulih)
// Persamaan:
// dS/dt = Λ - (β*S*A)/N - μ*S
// dE/dt = (β*S*A)/N - (σ + δ + μ)*E 
// dA/dt = σ*E - (γ + θ + μ)*A
// dR/dt = δ*E + (γ + θ)*A - μ*R

export interface RevisedParameters extends SimulationParameters {
  // Parameter tambahan untuk model revisi
  Lambda: number;     // Laju rekrutmen (Λ)
  mu: number;         // Laju keluar alami (μ)
  beta: number;       // Laju transmisi efektif (β)
  sigma: number;      // Laju progresivitas E->I (σ)
  delta: number;      // Laju pemulihan dini E->R (δ)
  gamma: number;      // Laju pemulihan alami I->R (γ)
  theta: number;      // Efektivitas intervensi tambahan (θ)
}

// Konversi parameter dari model asli ke model revisi
export function convertToRevisedParameters(params: SimulationParameters): RevisedParameters {
  // Menggunakan parameter yang sama dengan model asli namun dengan interpretasi baru
  return {
    ...params,
    Lambda: 2.0,        // Laju rekrutmen konstan
    mu: params.mu2,     // Menggunakan mu2 sebagai laju keluar alami
    beta: params.alpha, // alpha sebagai laju transmisi
    sigma: params.beta, // beta sebagai laju progresivitas
    delta: 0.1,         // Laju pemulihan dini baru (10% dari E pulih langsung)
    gamma: params.delta, // delta sebagai laju pemulihan alami
    theta: params.theta  // tetap menggunakan theta
  };
}

// Hitung R0 untuk model revisi
export function calculateRevisedR0(params: RevisedParameters): number {
  const kE = params.sigma + params.delta + params.mu;
  const kI = params.gamma + params.theta + params.mu;
  return (params.beta * params.sigma) / (kE * kI);
}

// Hitung titik keseimbangan bebas kecanduan
export function calculateDiseaseFreeEquilibrium(params: RevisedParameters) {
  const S0 = params.Lambda / params.mu;  return {
    S: S0,
    E: 0,
    A: 0, // Addicted mengganti Infected
    R: 0,
    totalPopulation: S0
  };
}

// Hitung titik keseimbangan endemik (jika R0 > 1)
export function calculateEndemicEquilibrium(params: RevisedParameters) {
  const R0 = calculateRevisedR0(params);
  
  if (R0 <= 1) {
    return null; // Tidak ada keseimbangan endemik
  }

  const kE = params.sigma + params.delta + params.mu;
  const kI = params.gamma + params.theta + params.mu;
    // Menyelesaikan sistem equilibrium untuk A* > 0
  // Dari sistem equilibrium:
  const N0 = params.Lambda / params.mu;
  const A_star = (params.Lambda * (R0 - 1)) / (params.beta + params.mu * R0);
  const E_star = (kI * A_star) / params.sigma;
  const S_star = (kE * E_star) / (params.beta * A_star / N0);
  const R_star = (params.delta * E_star + (params.gamma + params.theta) * A_star) / params.mu;
  return {
    S: S_star,
    E: E_star,
    A: A_star, // Addicted mengganti Infected
    R: R_star,
    totalPopulation: S_star + E_star + A_star + R_star
  };
}

export function runRevisedSEARSimulation(
  initialValues: { S: number; E: number; A: number; R: number },
  parameters: SimulationParameters,
  timePoints: number[] = Array.from({ length: 61 }, (_, i) => i)
): SimulationData[] {
  
  const revisedParams = convertToRevisedParameters(parameters);
  const dt = 0.01; // Step size yang lebih kecil untuk akurasi
  const result: SimulationData[] = [];
  
  let S = initialValues.S;
  let E = initialValues.E;
  let A = initialValues.A; // Addicted mengganti Infected
  let R = initialValues.R;

  for (const t of timePoints) {
    // Interpolasi ke waktu target dengan step yang lebih kecil
    const targetTime = t;
    let currentTime = result.length > 0 ? result[result.length - 1].time : 0;
    
    while (currentTime < targetTime) {
      const remainingTime = targetTime - currentTime;
      const stepSize = Math.min(dt, remainingTime);
      
      const N = S + E + A + R;
      
      // Model SEAR yang direvisi
      const dS_dt = revisedParams.Lambda - (revisedParams.beta * S * A) / N - revisedParams.mu * S;
      const dE_dt = (revisedParams.beta * S * A) / N - (revisedParams.sigma + revisedParams.delta + revisedParams.mu) * E;
      const dA_dt = revisedParams.sigma * E - (revisedParams.gamma + revisedParams.theta + revisedParams.mu) * A;
      const dR_dt = revisedParams.delta * E + (revisedParams.gamma + revisedParams.theta) * A - revisedParams.mu * R;

      // Update menggunakan metode Euler
      S += dS_dt * stepSize;
      E += dE_dt * stepSize;
      A += dA_dt * stepSize;
      R += dR_dt * stepSize;

      // Pastikan nilai non-negatif
      S = Math.max(0, S);
      E = Math.max(0, E);
      A = Math.max(0, A);
      R = Math.max(0, R);

      currentTime += stepSize;
    }

    // Simpan hasil pada waktu target
    result.push({
      time: t,
      S: S,
      E: E,
      A: A, // A di model revisi (kecanduan)
      R: R
    });
  }

  return result;
}

// Analisis stabilitas titik keseimbangan
export function analyzeStability(params: RevisedParameters) {
  const R0 = calculateRevisedR0(params);
  const diseaseFree = calculateDiseaseFreeEquilibrium(params);
  const endemic = calculateEndemicEquilibrium(params);
  
  return {
    R0,
    diseaseFreeEquilibrium: diseaseFree,
    endemicEquilibrium: endemic,
    diseaseFreeStable: R0 < 1,
    interpretation: R0 < 1 
      ? "Kecanduan akan hilang dari populasi (disease-free equilibrium stabil)"
      : "Kecanduan akan menjadi endemik dalam populasi (endemic equilibrium stabil)"
  };
}

// Estimasi waktu ke equilibrium
export function estimateTimeToEquilibrium(params: RevisedParameters): number {
  const kE = params.sigma + params.delta + params.mu;
  const kI = params.gamma + params.theta + params.mu;
  
  // Eigenvalue dominan untuk konvergensi
  const lambda_dominant = Math.min(params.mu, kE, kI);
  
  // Waktu karakteristik (95% konvergensi)
  return 3 / lambda_dominant;
}
