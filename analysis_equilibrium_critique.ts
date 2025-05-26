/**
 * ANALISIS KRITIK TITIK KESEIMBANGAN "BEBAS KECANDUAN" DALAM PAPER
 * 
 * MASALAH YANG DITEMUKAN:
 * Paper mengklaim ada "titik keseimbangan bebas kecanduan" E₀ = (μ₁N/(μ₂+α), 0, 0, 0)
 * 
 * NAMUN, ini TIDAK MUNGKIN menjadi equilibrium karena:
 * - Jika E = 0, maka dE/dt = αS - (β + μ₂) × 0 = αS
 * - Karena S = μ₁N/(μ₂+α) > 0, maka dE/dt = αS > 0
 * - Artinya E akan NAIK dari 0, bukan tetap di 0!
 * 
 * KESIMPULAN: 
 * Titik E₀ yang diklaim paper BUKAN equilibrium yang valid secara matematika.
 * Model SEAR dengan transmission α > 0 tidak bisa memiliki true disease-free equilibrium.
 */

import { DEFAULT_PARAMS, THETA_WITH_INTERVENTION, THETA_WITHOUT_INTERVENTION } from './constants';
import type { SearParams } from './types';

/**
 * Fungsi untuk menganalisis apakah suatu titik benar-benar equilibrium
 */
function analyzeEquilibriumPoint(
  params: SearParams,
  S: number, 
  E: number, 
  A: number, 
  R: number,
  N: number = 176
): {
  isEquilibrium: boolean;
  derivatives: { dS: number; dE: number; dA: number; dR: number };
  explanation: string;
} {
  
  const lambda = params.mu1 * N;
  
  // Hitung derivatives pada titik ini
  const dS = lambda - (params.alpha + params.mu2) * S;
  const dE = params.alpha * S - (params.beta + params.mu2) * E;
  const dA = params.beta * E - (params.gamma + params.theta + params.mu2) * A;
  const dR = (params.gamma + params.theta) * A - params.mu2 * R;
  
  const tolerance = 1e-6;
  const isEquilibrium = Math.abs(dS) < tolerance && 
                       Math.abs(dE) < tolerance && 
                       Math.abs(dA) < tolerance && 
                       Math.abs(dR) < tolerance;
  
  let explanation = '';
  if (!isEquilibrium) {
    explanation = `BUKAN equilibrium karena: `;
    if (Math.abs(dS) >= tolerance) explanation += `dS/dt=${dS.toFixed(4)} ≠ 0; `;
    if (Math.abs(dE) >= tolerance) explanation += `dE/dt=${dE.toFixed(4)} ≠ 0; `;
    if (Math.abs(dA) >= tolerance) explanation += `dA/dt=${dA.toFixed(4)} ≠ 0; `;
    if (Math.abs(dR) >= tolerance) explanation += `dR/dt=${dR.toFixed(4)} ≠ 0; `;
  } else {
    explanation = 'Valid equilibrium: semua derivatives = 0';
  }
  
  return {
    isEquilibrium,
    derivatives: { dS, dE, dA, dR },
    explanation
  };
}

/**
 * Test titik "bebas kecanduan" yang diklaim paper
 */
function testPaperClaimedDiseaseFreeEquilibrium() {
  console.log('\n🔍 TESTING PAPER\'S CLAIMED "DISEASE-FREE" EQUILIBRIUM');
  console.log('=' .repeat(80));
  
  // Test dengan parameter tanpa intervensi (θ = 0)
  const paramsNoIntervention: SearParams = {
    ...DEFAULT_PARAMS,
    theta: THETA_WITHOUT_INTERVENTION
  };
  
  // Test dengan parameter dengan intervensi (θ = 1)  
  const paramsWithIntervention: SearParams = {
    ...DEFAULT_PARAMS,
    theta: THETA_WITH_INTERVENTION
  };
  
  const N = 176;
  
  // Titik "bebas kecanduan" yang diklaim paper: E₀ = (μ₁N/(μ₂+α), 0, 0, 0)
  const testScenarios = [
    { name: 'TANPA Intervensi (θ=0)', params: paramsNoIntervention },
    { name: 'DENGAN Intervensi (θ=1)', params: paramsWithIntervention }
  ];
  
  testScenarios.forEach(scenario => {
    console.log(`\n📊 SCENARIO: ${scenario.name}`);
    console.log('-'.repeat(50));
    
    const params = scenario.params;
    const R0 = params.beta / (params.gamma + params.theta + params.mu2);
    
    // Titik yang diklaim paper sebagai "disease-free equilibrium"
    const S_paper = (params.mu1 * N) / (params.mu2 + params.alpha);
    const E_paper = 0;
    const A_paper = 0;
    const R_paper = 0;
    
    console.log(`R₀ = ${R0.toFixed(3)} (${R0 > 1 ? 'ENDEMIC' : 'DISEASE-FREE'})`);
    console.log(`Titik yang diklaim paper: E₀ = (${S_paper.toFixed(1)}, ${E_paper}, ${A_paper}, ${R_paper})`);
    
    // Analisis apakah benar-benar equilibrium
    const analysis = analyzeEquilibriumPoint(params, S_paper, E_paper, A_paper, R_paper, N);
    
    console.log(`\n❌ HASIL ANALISIS: ${analysis.explanation}`);
    console.log(`Derivatives pada titik ini:`);
    console.log(`- dS/dt = ${analysis.derivatives.dS.toFixed(4)}`);
    console.log(`- dE/dt = ${analysis.derivatives.dE.toFixed(4)} ← MASALAH: TIDAK NOL!`);
    console.log(`- dA/dt = ${analysis.derivatives.dA.toFixed(4)}`);
    console.log(`- dR/dt = ${analysis.derivatives.dR.toFixed(4)}`);
    
    if (!analysis.isEquilibrium) {
      console.log(`\n🚨 KESIMPULAN: Titik yang diklaim paper BUKAN equilibrium yang valid!`);
      if (analysis.derivatives.dE > 0) {
        console.log(`   Karena dE/dt = αS = ${params.alpha} × ${S_paper.toFixed(1)} = ${analysis.derivatives.dE.toFixed(4)} > 0`);
        console.log(`   Artinya E akan NAIK dari 0, bukan tetap di 0!`);
      }
    }
  });
}

/**
 * Mencari TRUE equilibrium points yang benar-benar valid secara matematika
 */
function findTrueEquilibriumPoints() {
  console.log('\n🎯 MENCARI TRUE EQUILIBRIUM POINTS YANG VALID');
  console.log('=' .repeat(80));
  
  const params: SearParams = {
    ...DEFAULT_PARAMS,
    theta: THETA_WITHOUT_INTERVENTION
  };
  
  const N = 176;
  const R0 = params.beta / (params.gamma + params.theta + params.mu2);
  
  console.log(`Parameter: α=${params.alpha}, β=${params.beta}, γ=${params.gamma}, θ=${params.theta}, μ₁=${params.mu1}, μ₂=${params.mu2}`);
  console.log(`R₀ = ${R0.toFixed(3)}`);
  
  console.log('\n📝 UNTUK EQUILIBRIUM, SEMUA DERIVATIVES HARUS = 0:');
  console.log('dS/dt = μ₁N - (α + μ₂)S = 0  →  S* = μ₁N/(α + μ₂)');
  console.log('dE/dt = αS - (β + μ₂)E = 0   →  E* = αS*/(β + μ₂)');
  console.log('dA/dt = βE - (γ + θ + μ₂)A = 0  →  A* = βE*/(γ + θ + μ₂)');
  console.log('dR/dt = (γ + θ)A - μ₂R = 0  →  R* = (γ + θ)A*/μ₂');
  
  // Hitung equilibrium yang benar
  const lambda = params.mu1 * N;
  const S_true = lambda / (params.mu2 + params.alpha);
  const E_true = (params.alpha * S_true) / (params.beta + params.mu2);
  const A_true = (params.beta * E_true) / (params.gamma + params.theta + params.mu2);
  const R_true = ((params.gamma + params.theta) * A_true) / params.mu2;
  
  console.log(`\n✅ TRUE EQUILIBRIUM POINT:`);
  console.log(`S* = ${S_true.toFixed(2)}`);
  console.log(`E* = ${E_true.toFixed(2)} ← TIDAK NOL! (berbeda dengan klaim paper)`);
  console.log(`A* = ${A_true.toFixed(2)} ← TIDAK NOL! (ada kecanduan endemic)`);
  console.log(`R* = ${R_true.toFixed(2)}`);
  console.log(`Total = ${(S_true + E_true + A_true + R_true).toFixed(2)} (harus ≈ ${N})`);
  
  // Verifikasi
  const verification = analyzeEquilibriumPoint(params, S_true, E_true, A_true, R_true, N);
  console.log(`\n✅ VERIFIKASI: ${verification.explanation}`);
  
  return {
    S: S_true,
    E: E_true, 
    A: A_true,
    R: R_true,
    isValid: verification.isEquilibrium
  };
}

/**
 * Analisis mengapa model SEAR tidak bisa memiliki disease-free equilibrium
 */
function explainWhyNoDiseaseFreeEquilibrium() {
  console.log('\n🧠 PENJELASAN: MENGAPA MODEL SEAR TIDAK BISA DISEASE-FREE?');
  console.log('=' .repeat(80));
  
  console.log(`
MASALAH FUNDAMENTAL DALAM MODEL SEAR:

1. MODEL MEMILIKI CONTINUOUS TRANSMISSION:
   - Selama ada individu Susceptible (S > 0) dan parameter α > 0
   - Akan selalu ada transisi S → E (paparan game)
   - Ini berbeda dengan model epidemi klasik yang membutuhkan kontak dengan Infected
   
2. TIDAK ADA KONDISI "BEBAS KECANDUAN" SEJATI:
   - Model mengasumsikan siswa akan terus terpapar game online (α > 0)
   - Bahkan tanpa individu kecanduan, siswa susceptible akan menjadi exposed
   - Ini mencerminkan realitas: game online tersedia terus-menerus
   
3. EQUILIBRIUM YANG VALID HANYA ENDEMIC:
   - Satu-satunya equilibrium yang valid secara matematika adalah endemic
   - E* > 0, A* > 0 (selalu ada yang exposed dan addicted)
   - Ini sesuai dengan R₀ > 1 untuk parameter paper
   
4. INTERPRETASI REALISTIS:
   - Model menggambarkan situasi di mana game online sudah menjadi bagian lingkungan
   - "Disease-free" tidak realistis karena siswa akan terus terpapar teknologi
   - Fokus seharusnya pada mengendalikan tingkat kecanduan, bukan menghilangkannya
  `);
}

/**
 * Implikasi untuk implementasi equilibrium simulator
 */
function discussSimulatorImplications() {
  console.log('\n💡 IMPLIKASI UNTUK EQUILIBRIUM SIMULATOR');
  console.log('=' .repeat(80));
  
  console.log(`
KESIMPULAN UNTUK IMPLEMENTASI:

1. ❌ TIDAK PERLU "DISEASE-FREE" MODE:
   - Karena model SEAR tidak memiliki disease-free equilibrium yang valid
   - Mode "disease-free" dalam equilibrium simulator sebaiknya dihapus atau diperbaiki
   
2. ✅ FOKUS PADA ENDEMIC EQUILIBRIUM:
   - Hanya endemic equilibrium yang valid secara matematika
   - Implementasi harus fokus pada konvergensi ke endemic state
   
3. 🔄 PERBAIKAN REALISTIC SIMULATOR:
   - Hapus fungsi runRealisticDiseaseFreeSimulation
   - Atau modifikasi untuk mencapai "minimal addiction" bukan "zero addiction"
   
4. 📊 INTERPRETASI YANG BENAR:
   - R₀ < 1: Kecanduan berkurang tapi tidak hilang total
   - R₀ > 1: Kecanduan menyebar dan stabil pada level tinggi
   - Intervensi (θ) mengurangi level endemic, bukan menghilangkan
  `);
}

// MAIN EXECUTION
const runAnalysis = () => {
  console.log('🔬 ANALISIS KRITIS TITIK KESEIMBANGAN PAPER JURNAL');
  console.log('Menganalisis klaim "titik keseimbangan bebas kecanduan" dalam paper');
  console.log('dan mengapa hal ini tidak valid secara matematika.\n');
  
  testPaperClaimedDiseaseFreeEquilibrium();
  const trueEquilibrium = findTrueEquilibriumPoints();
  explainWhyNoDiseaseFreeEquilibrium();
  discussSimulatorImplications();
  
  console.log('\n🎯 RINGKASAN TEMUAN UTAMA:');
  console.log('=' .repeat(50));
  console.log('❌ Paper keliru mengklaim ada "disease-free equilibrium"');
  console.log('✅ Hanya endemic equilibrium yang valid secara matematika'); 
  console.log('💡 Model mencerminkan realitas: game online selalu ada di lingkungan');
  console.log('🔄 Perlu perbaikan implementasi equilibrium simulator');
  
  return trueEquilibrium;
};

// Export untuk testing
export { 
  runAnalysis, 
  testPaperClaimedDiseaseFreeEquilibrium, 
  findTrueEquilibriumPoints,
  analyzeEquilibriumPoint 
};

// Jalankan analisis
runAnalysis();
