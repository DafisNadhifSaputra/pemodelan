/**
 * REALISTIC EQUILIBRIUM SIMULATOR - UPDATED BERDASARKAN ANALISIS MATEMATIKA
 * 
 * TEMUAN KRITIS:
 * Paper mengklaim ada "disease-free equilibrium" E₀ = (μ₁N/(μ₂+α), 0, 0, 0)
 * NAMUN: Ini TIDAK VALID karena dE/dt = αS ≠ 0 ketika S > 0 dan α > 0
 * 
 * KESIMPULAN MATEMATIKA:
 * - Model SEAR dengan continuous transmission (α > 0) TIDAK memiliki disease-free equilibrium
 * - Hanya endemic equilibrium yang valid secara matematika
 * - Ini mencerminkan realitas: siswa akan terus terpapar game online
 * 
 * IMPLEMENTASI YANG BENAR:
 * - Fokus pada endemic equilibrium untuk semua kondisi
 * - Untuk R₀ < 1: endemic dengan level kecanduan rendah (bukan zero)
 * - Untuk R₀ > 1: endemic dengan level kecanduan tinggi
 */

import type { SearParams, InitialConditions, SimulationDataPoint } from '../types';
import { runSearSimulation } from './seirSimulator';

/**
 * Menjalankan simulasi equilibrium yang realistis dan valid secara matematika
 * 
 * BERDASARKAN TEMUAN: Hanya endemic equilibrium yang valid
 * - Tidak ada disease-free mode karena terbukti tidak valid
 * - Semua kondisi menuju endemic equilibrium dengan level yang berbeda
 */
export const runRealisticEquilibriumSimulation = (
  params: SearParams,
  originalInitialConditions: InitialConditions,
  _totalPopulation: number, // Menggunakan N=176 konstanta dari paper
  duration: number,
  timeStep: number,
  equilibriumType: 'disease-free' | 'endemic' = 'endemic' // Default ke endemic
): SimulationDataPoint[] => {
    // Hitung R0 untuk informasi saja
  const R0 = params.beta / (params.gamma + params.theta + params.mu2);
  
  console.log(`🎯 Realistic Equilibrium: R₀=${R0.toFixed(3)}, menuju endemic equilibrium`);
  console.log(`⚠️  Note: equilibriumType="${equilibriumType}" diabaikan karena hanya endemic yang valid`);
  
  // Semua kondisi menggunakan endemic simulation karena hanya itu yang valid
  return runRealisticEndemicSimulation(params, originalInitialConditions, duration, timeStep);
};

/**
 * SIMULASI ENDEMIC EQUILIBRIUM - SATU-SATUNYA YANG VALID
 * 
 * Berdasarkan temuan matematika: Model SEAR tidak memiliki disease-free equilibrium
 * yang valid karena dE/dt = αS > 0 selama S > 0 dan α > 0.
 * 
 * PENDEKATAN REALISTIS:
 * - Mulai dari weighted average antara kondisi asli dan target teoritis
 * - Gunakan persamaan diferensial asli dari paper
 * - Biarkan sistem natural adjust ke satu-satunya equilibrium yang valid
 */
function runRealisticEndemicSimulation(
  params: SearParams,
  originalInitialConditions: InitialConditions,
  duration: number,
  timeStep: number
): SimulationDataPoint[] {
  
  // Sesuai paper jurnal: Populasi total N = 176 siswa (sampel penelitian)
  const N_PAPER = 176;
  
  // Hitung endemic equilibrium teoritis sesuai rumus paper
  const lambda = params.mu1 * N_PAPER;
  const { mu2, alpha, beta, gamma, theta } = params;
  
  // Formula dari paper jurnal (halaman 97)
  const S_target = lambda / (mu2 + alpha);
  const E_target = (alpha * lambda) / ((mu2 + beta) * (mu2 + alpha));
  const A_target = (beta * alpha * lambda) / ((mu2 + gamma + theta) * (mu2 + beta) * (mu2 + alpha));
  const R_target = ((gamma + theta) * beta * alpha * lambda) / (mu2 * (mu2 + gamma + theta) * (mu2 + beta) * (mu2 + alpha));
  
  // Strategi: Weighted average untuk starting point yang realistis
  // 60% menuju target teoritis, 40% tetap dari kondisi asli
  const weight = 0.6; 
  
  const adjustedInitialConditions: InitialConditions = {
    S0: originalInitialConditions.S0 * (1 - weight) + S_target * weight,
    E0: originalInitialConditions.E0 * (1 - weight) + E_target * weight,
    A0: originalInitialConditions.A0 * (1 - weight) + A_target * weight,
    R0: originalInitialConditions.R0 * (1 - weight) + R_target * weight
  };
    console.log('📊 Realistic Endemic Strategy (Paper-based):');
  console.log('- Menggunakan formula equilibrium dari paper jurnal');
  console.log('- Initial conditions: 60% menuju target teoritis, 40% kondisi asli');
  console.log('- Biarkan sistem natural adjust ke equilibrium yang benar');
  console.log(`- Target teoritis: S=${S_target.toFixed(1)}, E=${E_target.toFixed(1)}, A=${A_target.toFixed(1)}, R=${R_target.toFixed(1)}`);
  
  // Gunakan persamaan SEAR standar yang sama dengan paper
  return runSearSimulation(params, adjustedInitialConditions, N_PAPER, duration, timeStep);
}

/**
 * Analisis seberapa "realistis" hasil equilibrium
 */
export function analyzeRealism(
  normalResult: SimulationDataPoint[],
  equilibriumResult: SimulationDataPoint[]
): {
  convergenceRating: 'excellent' | 'good' | 'moderate' | 'poor';
  realismScore: number; // 0-100
  explanation: string;
} {
  
  const normalFinal = normalResult[normalResult.length - 1];
  const equilibriumFinal = equilibriumResult[equilibriumResult.length - 1];
  
  // Hitung perbedaan total populasi
  const normalTotal = normalFinal.S + normalFinal.E + normalFinal.A + normalFinal.R;
  const equilibriumTotal = equilibriumFinal.S + equilibriumFinal.E + equilibriumFinal.A + equilibriumFinal.R;
  const totalDiff = Math.abs(normalTotal - equilibriumTotal);
  const relativeDiff = (totalDiff / normalTotal) * 100;
  
  // Hitung perbedaan distribusi kompartemen
  const sDiff = Math.abs(normalFinal.S - equilibriumFinal.S);
  const eDiff = Math.abs(normalFinal.E - equilibriumFinal.E);
  const aDiff = Math.abs(normalFinal.A - equilibriumFinal.A);
  const rDiff = Math.abs(normalFinal.R - equilibriumFinal.R);
  const compartmentDiff = (sDiff + eDiff + aDiff + rDiff) / normalTotal * 100;
  
  // Skor realisme (semakin rendah perbedaan, semakin realistis)
  let realismScore = Math.max(0, 100 - relativeDiff * 10 - compartmentDiff);
  realismScore = Math.min(100, realismScore);
  
  // Rating konvergensi
  let convergenceRating: 'excellent' | 'good' | 'moderate' | 'poor';
  let explanation: string;
  
  if (relativeDiff < 2) {
    convergenceRating = 'excellent';
    explanation = 'Kedua simulasi menghasilkan hasil yang hampir identik. Equilibrium simulation berhasil mencapai keseimbangan natural tanpa forcing artificial.';
  } else if (relativeDiff < 5) {
    convergenceRating = 'good';
    explanation = 'Perbedaan kecil yang dapat diterima. Ini menunjukkan equilibrium simulation memberikan starting point yang baik namun tetap realistis.';
  } else if (relativeDiff < 15) {
    convergenceRating = 'moderate';
    explanation = 'Ada perbedaan yang cukup signifikan. Mungkin perlu penyesuaian strategi initial conditions atau durasi simulasi.';
  } else {
    convergenceRating = 'poor';
    explanation = 'Perbedaan besar terdeteksi. Kemungkinan ada masalah dalam implementasi atau parameter yang digunakan.';
  }
  
  return {
    convergenceRating,
    realismScore: Math.round(realismScore),
    explanation
  };
}
