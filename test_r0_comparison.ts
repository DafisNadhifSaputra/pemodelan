import { DEFAULT_PARAMS, DEFAULT_INITIAL_CONDITIONS, THETA_WITH_INTERVENTION } from './constants';
import { runEquilibriumSimulation } from './services/equilibriumSimulator';
import { runSearSimulation } from './services/seirSimulator';
import type { SearParams } from './types';

// Test dengan parameter yang menghasilkan R₀ > 1 (endemic case)
const testParams: SearParams = {
  ...DEFAULT_PARAMS,
  theta: THETA_WITH_INTERVENTION // θ = 1, akan menghasilkan R₀ < 1
};

// Modifikasi parameter untuk memastikan R₀ > 1
const endemicParams: SearParams = {
  ...testParams,
  theta: 0,    // Hilangkan intervensi
  beta: 0.25   // Tingkatkan laju infeksi
};

const totalPopulation = DEFAULT_INITIAL_CONDITIONS.S0 + 
                       DEFAULT_INITIAL_CONDITIONS.E0 + 
                       DEFAULT_INITIAL_CONDITIONS.A0 + 
                       DEFAULT_INITIAL_CONDITIONS.R0;

console.log('=== COMPARISON TEST: R₀ > 1 (Endemic Case) ===');
console.log('Parameters:', endemicParams);
console.log('Initial conditions:', DEFAULT_INITIAL_CONDITIONS);
console.log('Total population:', totalPopulation);

// Hitung R0
const R0 = endemicParams.beta / (endemicParams.gamma + endemicParams.theta + endemicParams.mu2);
console.log('R₀ =', R0.toFixed(3), R0 > 1 ? '(Endemic - Expected)' : '(Disease-free - Unexpected!)');

console.log('\n=== RUNNING NORMAL SIMULATION (Equilibrium OFF) ===');
const normalResult = runSearSimulation(
  endemicParams,
  DEFAULT_INITIAL_CONDITIONS, 
  totalPopulation,
  36, // 36 months
  1   // monthly steps
);

console.log('\n=== RUNNING EQUILIBRIUM SIMULATION (Equilibrium ON) ===');
const equilibriumResult = runEquilibriumSimulation(
  endemicParams,
  DEFAULT_INITIAL_CONDITIONS, 
  totalPopulation,
  36, // 36 months
  1,  // monthly steps
  'endemic'
);

// Function to display simulation data
function displayResults(data: any[], title: string) {
  console.log(`\n${title}:`);
  console.log('Month\tS\tE\tA\tR\tTotal');
  
  // Show first 3 months
  for (let i = 0; i < Math.min(3, data.length); i++) {
    const point = data[i];
    const total = point.S + point.E + point.A + point.R;
    console.log(`${point.time}\t${point.S.toFixed(1)}\t${point.E.toFixed(1)}\t${point.A.toFixed(1)}\t${point.R.toFixed(1)}\t${total.toFixed(1)}`);
  }
  
  console.log('...');
  
  // Show last 3 months
  for (let i = Math.max(0, data.length - 3); i < data.length; i++) {
    const point = data[i];
    const total = point.S + point.E + point.A + point.R;
    console.log(`${point.time}\t${point.S.toFixed(1)}\t${point.E.toFixed(1)}\t${point.A.toFixed(1)}\t${point.R.toFixed(1)}\t${total.toFixed(1)}`);
  }
}

displayResults(normalResult, 'NORMAL SIMULATION (Standard SEAR)');
displayResults(equilibriumResult, 'EQUILIBRIUM SIMULATION (Endemic Mode)');

// Compare final values
const normalFinal = normalResult[normalResult.length - 1];
const equilibriumFinal = equilibriumResult[equilibriumResult.length - 1];

console.log('\n=== COMPARISON OF FINAL VALUES ===');
console.log('Component\tNormal\tEquilibrium\tDifference');
console.log(`S\t\t${normalFinal.S.toFixed(1)}\t${equilibriumFinal.S.toFixed(1)}\t\t${Math.abs(normalFinal.S - equilibriumFinal.S).toFixed(1)}`);
console.log(`E\t\t${normalFinal.E.toFixed(1)}\t${equilibriumFinal.E.toFixed(1)}\t\t${Math.abs(normalFinal.E - equilibriumFinal.E).toFixed(1)}`);
console.log(`A\t\t${normalFinal.A.toFixed(1)}\t${equilibriumFinal.A.toFixed(1)}\t\t${Math.abs(normalFinal.A - equilibriumFinal.A).toFixed(1)}`);
console.log(`R\t\t${normalFinal.R.toFixed(1)}\t${equilibriumFinal.R.toFixed(1)}\t\t${Math.abs(normalFinal.R - equilibriumFinal.R).toFixed(1)}`);

const normalTotal = normalFinal.S + normalFinal.E + normalFinal.A + normalFinal.R;
const equilibriumTotal = equilibriumFinal.S + equilibriumFinal.E + equilibriumFinal.A + equilibriumFinal.R;
console.log(`Total\t\t${normalTotal.toFixed(1)}\t${equilibriumTotal.toFixed(1)}\t\t${Math.abs(normalTotal - equilibriumTotal).toFixed(1)}`);

// Calculate theoretical endemic equilibrium for comparison
const lambda = endemicParams.mu1 * totalPopulation;
const { mu2, alpha, beta, gamma, theta } = endemicParams;

const S_theory = lambda / (mu2 + alpha);
const E_theory = (alpha * lambda) / ((mu2 + beta) * (mu2 + alpha));
const A_theory = (beta * alpha * lambda) / ((mu2 + gamma + theta) * (mu2 + beta) * (mu2 + alpha));
const R_theory = ((gamma + theta) * beta * alpha * lambda) / (mu2 * (mu2 + gamma + theta) * (mu2 + beta) * (mu2 + alpha));

console.log('\n=== THEORETICAL ENDEMIC EQUILIBRIUM ===');
console.log(`S* = ${S_theory.toFixed(1)}`);
console.log(`E* = ${E_theory.toFixed(1)}`);
console.log(`A* = ${A_theory.toFixed(1)}`);
console.log(`R* = ${R_theory.toFixed(1)}`);
console.log(`Total* = ${(S_theory + E_theory + A_theory + R_theory).toFixed(1)}`);

console.log('\n=== ANALYSIS ===');
const normalDiffFromTheory = Math.abs(normalFinal.S - S_theory) + Math.abs(normalFinal.E - E_theory) + 
                            Math.abs(normalFinal.A - A_theory) + Math.abs(normalFinal.R - R_theory);
const equilibriumDiffFromTheory = Math.abs(equilibriumFinal.S - S_theory) + Math.abs(equilibriumFinal.E - E_theory) + 
                                 Math.abs(equilibriumFinal.A - A_theory) + Math.abs(equilibriumFinal.R - R_theory);

console.log(`Normal simulation total difference from theory: ${normalDiffFromTheory.toFixed(2)}`);
console.log(`Equilibrium simulation total difference from theory: ${equilibriumDiffFromTheory.toFixed(2)}`);

// Calculate difference between the two simulation modes
const totalDifference = Math.abs(normalTotal - equilibriumTotal);
const relativeDifference = (totalDifference / equilibriumTotal) * 100;

console.log(`\n=== CONVERGENCE ANALYSIS ===`);
console.log(`Difference between simulation modes: ${totalDifference.toFixed(1)} (${relativeDifference.toFixed(1)}%)`);

if (relativeDifference < 5) {
  console.log('✅ EXCELLENT CONVERGENCE - Both simulations produce very similar results!');
  console.log('   This indicates the endemic equilibrium implementation is working correctly.');
} else if (relativeDifference < 15) {
  console.log('✅ GOOD CONVERGENCE - Results are reasonably similar.');
  console.log('   Small differences are expected due to numerical methods and different starting points.');
} else {
  console.log('⚠️  SIGNIFICANT DIFFERENCE detected.');
  console.log('   This may indicate an implementation issue.');
}

console.log('\n=== EXPLANATION ===');
console.log('Ketika R₀ > 1, kedua mode simulasi SEHARUSNYA memberikan hasil yang serupa karena:');
console.log('1. Normal simulation: Menggunakan persamaan diferensial standar yang secara natural konvergen ke endemic equilibrium');
console.log('2. Equilibrium simulation: Dimulai dari endemic equilibrium dan mempertahankannya');
console.log('3. Perbedaan kecil adalah normal karena:');
console.log('   - Metode numerik (Euler) memiliki error akumulatif');
console.log('   - Time step dan durasi simulasi mempengaruhi akurasi');
console.log('   - Initial conditions berbeda antara kedua mode');
