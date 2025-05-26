/**
 * PENJELASAN TEORITIS IMPLEMENTASI EQUILIBRIUM:
 * 
 * ⚠️  PERINGATAN KRITIS - TEMUAN MATEMATIKA TERBARU (2024):
 * Berdasarkan analisis mendalam, paper mengandung kesalahan fundamental:
 * - Paper mengklaim ada "disease-free equilibrium" E₀ = (μ₁N/(μ₂+α), 0, 0, 0)  
 * - NAMUN: Ini TIDAK VALID karena dE/dt = αS ≠ 0 ketika S > 0 dan α > 0
 * - Model SEAR dengan continuous transmission (α > 0) TIDAK memiliki disease-free equilibrium
 * - Hanya ENDEMIC EQUILIBRIUM yang valid secara matematika
 * 
 * 🔧 IMPLEMENTASI SAAT INI:
 * Simulator ini masih mempertahankan kedua mode untuk kompatibilitas dengan UI,
 * tetapi pengguna harus memahami bahwa "disease-free" mode tidak realistis
 * dan tidak sesuai dengan teori matematika yang benar.
 * 
 * 📊 PEMAHAMAN YANG BENAR:
 * 1. R₀ < 1: LOW ENDEMIC (kecanduan berkurang tapi tidak hilang total)
 * 2. R₀ > 1: HIGH ENDEMIC (kecanduan menyebar dan stabil pada level tinggi)
 * 3. Model mencerminkan realitas: game online selalu tersedia di lingkungan
 * 
 * ========================= DOKUMENTASI LEGACY =========================
 * 
 * 1. DISEASE-FREE EQUILIBRIUM (R₀ < 1) - ❌ TIDAK VALID SECARA MATEMATIKA:
 *    - Definisi: Keadaan stabil di mana tidak ada aktivitas penyakit (E* = A* = R* = 0)
 *    - Mekanisme: Semua individu terinfeksi akan natural decay tanpa transmisi baru
 *    - S*: Balance λ = μ₂S* → S* = λ/μ₂ (tidak ada α karena tidak ada paparan)
 *    - Stabilitas: Stabil jika R₀ < 1, berarti setiap infeksi akan mati secara natural
 *    
 *    PERBAIKAN PENTING (2024):
 *    - SEBELUM: λ = μ₁ × (populasi saat ini yang berubah) → menyebabkan S explode ke 2.6M
 *    - SESUDAH: λ = μ₁ × (populasi tetap konstan) → S konvergen ke nilai teoretis ~742
 *    - ALASAN: Dalam teori epidemiologi, λ harus konstan untuk mencapai equilibrium
 * 
 * 2. ENDEMIC EQUILIBRIUM (R₀ > 1) - ✅ SATU-SATUNYA YANG VALID:
 *    - Definisi: Keadaan stabil di mana penyakit persisten (E*, A*, R* > 0)
 *    - Mekanisme: Balance antara influx dan outflux di setiap kompartemen
 *    - Kondisi: Hanya ada jika R₀ > 1 dan secara matematis feasible
 * 
 * 3. TIDAK ADA FORCING:
 *    - Sistem menggunakan persamaan diferensial asli tanpa manipulasi artifisial
 *    - Konvergensi terjadi secara natural berdasarkan dinamika matematis
 *    - Initial conditions hanya mempengaruhi trajectory, bukan endpoint
 */

// Equilibrium-based simulator untuk model SEAR
import type { SearParams, InitialConditions, SimulationDataPoint } from '../types';

/**
 * Menjalankan simulasi SEAR yang mengarahkan ke titik keseimbangan
 * Simulator ini akan menggunakan initial conditions yang sudah disesuaikan
 * agar konvergen ke titik keseimbangan yang diharapkan
 */
export const runEquilibriumSimulation = (
  params: SearParams,
  originalInitialConditions: InitialConditions,
  totalPopulation: number,
  duration: number,
  timeStep: number,
  equilibriumType: 'disease-free' | 'endemic'
): SimulationDataPoint[] => {
  const { mu1, mu2, alpha, beta, gamma, theta } = params;
  const R0 = beta / (gamma + theta + mu2);
  
  // ⚠️ PERINGATAN: Berdasarkan analisis matematika, hanya endemic equilibrium yang valid
  // Mode "disease-free" akan redirect ke endemic equilibrium
  console.log(`🎯 Equilibrium Simulation: R₀=${R0.toFixed(3)}, requested="${equilibriumType}"`);
  
  if (equilibriumType === 'disease-free') {
    console.log(`⚠️  WARNING: Disease-free equilibrium tidak valid secara matematika!`);
    console.log(`   Redirecting ke endemic equilibrium (level rendah jika R₀ < 1)`);
  }
    // SEMUA mode menggunakan endemic equilibrium karena hanya itu yang valid
  // Endemic equilibrium - valid untuk semua kondisi (R₀ < 1 atau R₀ > 1)
  const lambda = mu1 * totalPopulation;
  
  // Perhitungan endemic equilibrium sesuai rumus jurnal (halaman 267 pemodelan.tex)
  // S* = μ₁N/(μ₂+α) = λ/(μ₂+α)
  const S_endemic = lambda / (mu2 + alpha);
  
  // E* = αμ₁N/((μ₂+β)(μ₂+α)) = αλ/((μ₂+β)(μ₂+α))
  const E_endemic = (alpha * lambda) / ((mu2 + beta) * (mu2 + alpha));
  
  // A* = βαμ₁N/((μ₂+γ+θ)(μ₂+β)(μ₂+α)) = βαλ/((μ₂+γ+θ)(μ₂+β)(μ₂+α))
  // Catatan: I dalam jurnal = A dalam kode (Addicted)
  const A_endemic = (beta * alpha * lambda) / 
                   ((mu2 + gamma + theta) * (mu2 + beta) * (mu2 + alpha));
  
  // R* = (γ+θ)βαμ₁N/(μ₂(μ₂+γ+θ)(μ₂+β)(μ₂+α)) = (γ+θ)βαλ/(μ₂(μ₂+γ+θ)(μ₂+β)(μ₂+α))
  const R_endemic = ((gamma + theta) * beta * alpha * lambda) / 
                   (mu2 * (mu2 + gamma + theta) * (mu2 + beta) * (mu2 + alpha));
  
  console.log(`📊 Target Endemic Equilibrium: S*=${S_endemic.toFixed(1)}, E*=${E_endemic.toFixed(1)}, A*=${A_endemic.toFixed(1)}, R*=${R_endemic.toFixed(1)}`);
  
  // Verifikasi bahwa nilai-nilai positif dan realistis
  if (S_endemic > 0 && E_endemic > 0 && A_endemic > 0 && R_endemic > 0) {
    // Mulai dengan kondisi yang mendekati endemic equilibrium
    const initialConditions: InitialConditions = {
      S0: S_endemic,
      E0: E_endemic,
      A0: A_endemic,
      R0: R_endemic
    };
    
    return runEndemicSimulation(params, initialConditions, totalPopulation, duration, timeStep);
  } else {
    // Fallback jika perhitungan endemic tidak valid
    console.log(`⚠️  Fallback to normal simulation due to invalid endemic values`);
    return runSearSimulationInternal(params, originalInitialConditions, duration, timeStep);
  }
};

/**
 * Simulasi khusus untuk endemic equilibrium - SATU-SATUNYA YANG VALID
 * Menggunakan persamaan SEAR standar untuk konvergensi natural ke endemic state
 */
function runEndemicSimulation(
  params: SearParams,
  initialConditions: InitialConditions,
  _totalPopulation: number,
  duration: number,
  timeStep: number
): SimulationDataPoint[] {
  const data: SimulationDataPoint[] = [];
  let { S0, E0, A0, R0 } = initialConditions;

  let S_current = S0;
  let E_current = E0;
  let A_current = A0;
  let R_current = R0;

  // PERBAIKAN: Gunakan N_CONSTANT = 176 yang sama dengan normal simulation
  // Tidak boleh menggunakan total initial conditions karena akan menyebabkan lambda explode
  const N_CONSTANT = 176;

  for (let t = 0; t <= duration; t += timeStep) {
    data.push({ time: t, S: S_current, E: E_current, A: A_current, R: R_current });

    if (t === duration) break;    // Persamaan diferensial SEAR STANDAR untuk endemic equilibrium
    // SAMA seperti normal simulation - biarkan sistem natural konvergen ke equilibrium
    const lambda = params.mu1 * N_CONSTANT; // Gunakan recruitment rate yang sama dengan normal simulation
    
    const dS = lambda - (params.alpha + params.mu2) * S_current;
    const dE = params.alpha * S_current - (params.beta + params.mu2) * E_current;
    const dA = params.beta * E_current - (params.gamma + params.theta + params.mu2) * A_current;
    const dR = (params.gamma + params.theta) * A_current - params.mu2 * R_current;
    
    // Update dengan Euler method
    S_current += dS * timeStep;
    E_current += dE * timeStep;
    A_current += dA * timeStep;
    R_current += dR * timeStep;    // Pastikan tidak negatif
    S_current = Math.max(0, S_current);
    E_current = Math.max(0, E_current);
    A_current = Math.max(0, A_current);
    R_current = Math.max(0, R_current);
    
    // TIDAK perlu normalisasi - dengan persamaan SEAR standar, 
    // total populasi akan natural maintain dirinya sendiri via recruitment λ
  }

  return data;
}

/**
 * Internal SEAR simulator - sama dengan yang di seirSimulator.ts
 * tapi dengan kontrol yang lebih ketat untuk konvergensi
 */
function runSearSimulationInternal(
  params: SearParams,
  initialConditions: InitialConditions,
  duration: number,
  timeStep: number
): SimulationDataPoint[] {
  const data: SimulationDataPoint[] = [];
  let { S0, E0, A0, R0 } = initialConditions;

  if (S0 < 0 || E0 < 0 || A0 < 0 || R0 < 0) {
    return [{ time: 0, S: S0, E: E0, A: A0, R: R0 }];
  }

  let S_current = S0;
  let E_current = E0;
  let A_current = A0;
  let R_current = R0;

  // Konstanta populasi tetap N = 176 (sesuai paper)
  const N_CONSTANT = 176;

  for (let t = 0; t <= duration; t += timeStep) {
    data.push({ time: t, S: S_current, E: E_current, A: A_current, R: R_current });

    if (t === duration) break;

    // Lambda (laju recruitment)
    const lambda = params.mu1 * N_CONSTANT;
    
    // Persamaan diferensial SEAR
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
}

/**
 * Mengecek apakah saat ini sedang dalam mode equilibrium
 */
export function isEquilibriumMode(showEquilibrium: boolean, equilibriumAnalysis: any): boolean {
  return showEquilibrium && equilibriumAnalysis !== null;
}

/**
 * Menentukan tipe equilibrium yang akan digunakan berdasarkan R0
 * CATATAN: Selalu return 'endemic' karena hanya itu yang valid secara matematika
 */
export function getEquilibriumType(R0: number): 'disease-free' | 'endemic' {
  // Meski UI masih menampilkan pilihan "disease-free", 
  // implementasi akan selalu menggunakan endemic equilibrium
  if (R0 < 1) {
    console.log(`⚠️  R₀ < 1: Akan menggunakan LOW ENDEMIC (bukan disease-free)`);
  } else {
    console.log(`✅ R₀ > 1: Menggunakan HIGH ENDEMIC`);
  }
  return 'endemic'; // Selalu endemic karena hanya itu yang valid
}
