import { DEFAULT_PARAMS, DEFAULT_INITIAL_CONDITIONS, THETA_WITH_INTERVENTION } from './constants';
import { runEquilibriumSimulation } from './services/equilibriumSimulator';
import { runSearSimulation } from './services/seirSimulator';
import type { SearParams } from './types';

// Test dengan parameter yang menghasilkan R₀ < 1 (disease-free case) - simulasi lebih lama
const diseaseFreeParams: SearParams = {
  ...DEFAULT_PARAMS,
  theta: THETA_WITH_INTERVENTION // θ = 1, akan menghasilkan R₀ < 1
};

const totalPopulation = DEFAULT_INITIAL_CONDITIONS.S0 + 
                       DEFAULT_INITIAL_CONDITIONS.E0 + 
                       DEFAULT_INITIAL_CONDITIONS.A0 + 
                       DEFAULT_INITIAL_CONDITIONS.R0;

console.log('=== EXTENDED COMPARISON TEST: R₀ < 1 (Disease-Free Case) ===');
console.log('Duration: 120 months (10 years) for better convergence');

// Hitung R0
const R0 = diseaseFreeParams.beta / (diseaseFreeParams.gamma + diseaseFreeParams.theta + diseaseFreeParams.mu2);
console.log('R₀ =', R0.toFixed(3), R0 < 1 ? '(Disease-free - Expected)' : '(Endemic - Unexpected!)');

console.log('\n=== RUNNING NORMAL SIMULATION (Equilibrium OFF) ===');
const normalResult = runSearSimulation(
  diseaseFreeParams,
  DEFAULT_INITIAL_CONDITIONS, 
  totalPopulation,
  120, // 120 months = 10 years
  1   // monthly steps
);

console.log('\n=== RUNNING EQUILIBRIUM SIMULATION (Equilibrium ON) ===');
const equilibriumResult = runEquilibriumSimulation(
  diseaseFreeParams,
  DEFAULT_INITIAL_CONDITIONS, 
  totalPopulation,
  120, // 120 months = 10 years
  1,  // monthly steps
  'disease-free'
);

// Function to display key time points
function displayKeyTimePoints(data: any[], title: string) {
  console.log(`\n${title}:`);
  console.log('Month\tS\tE\tA\tR\tTotal');
  
  // Key time points: 0, 12, 36, 60, 120
  const keyTimes = [0, 12, 36, 60, 120];
  
  for (const timePoint of keyTimes) {
    const point = data.find(d => d.time === timePoint);
    if (point) {
      const total = point.S + point.E + point.A + point.R;
      console.log(`${point.time}\t${point.S.toFixed(1)}\t${point.E.toFixed(1)}\t${point.A.toFixed(1)}\t${point.R.toFixed(1)}\t${total.toFixed(1)}`);
    }
  }
}

displayKeyTimePoints(normalResult, 'NORMAL SIMULATION (Standard SEAR)');
displayKeyTimePoints(equilibriumResult, 'EQUILIBRIUM SIMULATION (Disease-Free Mode)');

// Compare final values
const normalFinal = normalResult[normalResult.length - 1];
const equilibriumFinal = equilibriumResult[equilibriumResult.length - 1];

console.log('\n=== COMPARISON OF FINAL VALUES (Month 120) ===');
console.log('Component\tNormal\tEquilibrium\tDifference');
console.log(`S\t\t${normalFinal.S.toFixed(1)}\t${equilibriumFinal.S.toFixed(1)}\t\t${Math.abs(normalFinal.S - equilibriumFinal.S).toFixed(1)}`);
console.log(`E\t\t${normalFinal.E.toFixed(1)}\t${equilibriumFinal.E.toFixed(1)}\t\t${Math.abs(normalFinal.E - equilibriumFinal.E).toFixed(1)}`);
console.log(`A\t\t${normalFinal.A.toFixed(1)}\t${equilibriumFinal.A.toFixed(1)}\t\t${Math.abs(normalFinal.A - equilibriumFinal.A).toFixed(1)}`);
console.log(`R\t\t${normalFinal.R.toFixed(1)}\t${equilibriumFinal.R.toFixed(1)}\t\t${Math.abs(normalFinal.R - equilibriumFinal.R).toFixed(1)}`);

const normalTotal = normalFinal.S + normalFinal.E + normalFinal.A + normalFinal.R;
const equilibriumTotal = equilibriumFinal.S + equilibriumFinal.E + equilibriumFinal.A + equilibriumFinal.R;
console.log(`Total\t\t${normalTotal.toFixed(1)}\t${equilibriumTotal.toFixed(1)}\t\t${Math.abs(normalTotal - equilibriumTotal).toFixed(1)}`);

// Calculate theoretical disease-free equilibrium for comparison
const lambda = diseaseFreeParams.mu1 * totalPopulation;
const S_theory = lambda / diseaseFreeParams.mu2; // Disease-free: S* = λ/μ₂

console.log('\n=== THEORETICAL DISEASE-FREE EQUILIBRIUM ===');
console.log(`S* = ${S_theory.toFixed(1)} (E* = A* = R* = 0)`);

// Calculate difference between the two simulation modes
const totalDifference = Math.abs(normalTotal - equilibriumTotal);
const relativeDifference = (totalDifference / equilibriumTotal) * 100;

console.log(`\n=== CONVERGENCE ANALYSIS ===`);
console.log(`Difference between simulation modes: ${totalDifference.toFixed(1)} (${relativeDifference.toFixed(1)}%)`);

if (relativeDifference < 2) {
  console.log('✅ EXCELLENT CONVERGENCE - Both simulations produce very similar results!');
} else if (relativeDifference < 10) {
  console.log('✅ GOOD CONVERGENCE - Results are reasonably similar.');
} else {
  console.log('⚠️  SIGNIFICANT DIFFERENCE detected.');
}

// Check how close normal simulation got to disease-free state
const normalInfectedTotal = normalFinal.E + normalFinal.A;
console.log(`\n=== DISEASE-FREE CONVERGENCE CHECK ===`);
console.log(`Normal simulation remaining infected (E+A): ${normalInfectedTotal.toFixed(1)}`);
if (normalInfectedTotal < 1) {
  console.log('✅ Normal simulation successfully approached disease-free state');
} else if (normalInfectedTotal < 10) {
  console.log('🔄 Normal simulation approaching disease-free state (needs more time)');
} else {
  console.log('⚠️  Normal simulation has not converged to disease-free state');
}
