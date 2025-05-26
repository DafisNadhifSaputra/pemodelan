import { DEFAULT_PARAMS, THETA_WITH_INTERVENTION } from './constants';

// Parameter untuk R₀ < 1
const params = {
  ...DEFAULT_PARAMS,
  theta: THETA_WITH_INTERVENTION // θ = 1
};

console.log('=== PARAMETER ANALYSIS FOR R₀ < 1 CASE ===');
console.log('Parameters:', params);

// Hitung R₀
const R0 = params.beta / (params.gamma + params.theta + params.mu2);
console.log(`R₀ = β/(γ + θ + μ₂) = ${params.beta}/(${params.gamma} + ${params.theta} + ${params.mu2}) = ${R0.toFixed(4)}`);

// Hitung teoretis disease-free equilibrium
const totalPop = 176; // N_CONSTANT
const lambda = params.mu1 * totalPop;
const S_df = lambda / params.mu2; // Disease-free: S* = λ/μ₂
console.log(`\nDisease-free equilibrium:`);
console.log(`λ = μ₁ × N = ${params.mu1} × ${totalPop} = ${lambda.toFixed(3)}`);
console.log(`S* = λ/μ₂ = ${lambda.toFixed(3)}/${params.mu2} = ${S_df.toFixed(1)}`);
console.log(`E* = A* = R* = 0`);
console.log(`Total* = ${S_df.toFixed(1)}`);

// Analisis mengapa normal simulation tidak konvergen
console.log(`\n=== CONVERGENCE ANALYSIS ===`);
console.log(`Dengan S ≈ 134.5 (nilai yang ditemukan di simulasi):`);

const S_observed = 134.5;
const inflow_to_E = params.alpha * S_observed;
const outflow_from_E = params.beta + params.mu2; // rate constant
console.log(`Inflow ke E: α × S = ${params.alpha} × ${S_observed} = ${inflow_to_E.toFixed(3)}/month`);
console.log(`Outflow rate dari E: β + μ₂ = ${params.beta} + ${params.mu2} = ${outflow_from_E.toFixed(3)}/month`);

// Untuk equilibrium: inflow = outflow × E*
const E_equilibrium_at_S134 = inflow_to_E / outflow_from_E;
console.log(`Equilibrium E pada S=134.5: ${inflow_to_E.toFixed(3)}/${outflow_from_E.toFixed(3)} = ${E_equilibrium_at_S134.toFixed(1)}`);

console.log(`\n⚠️  MASALAH DITEMUKAN:`);
console.log(`Normal simulation stuck di S=134.5, bukan S*=${S_df.toFixed(1)}`);
console.log(`Pada S=134.5, sistem masih menghasilkan E ≈ ${E_equilibrium_at_S134.toFixed(1)} > 0`);
console.log(`Padahal seharusnya S → ${S_df.toFixed(1)} dan E → 0`);

// Cek mengapa S tidak naik ke S*
console.log(`\n=== ANALISIS KOMPARTEMEN S ===`);
const dS_at_S134 = lambda - (params.alpha + params.mu2) * S_observed;
console.log(`dS/dt pada S=134.5: λ - (α + μ₂)S = ${lambda.toFixed(3)} - (${params.alpha} + ${params.mu2}) × ${S_observed}`);
console.log(`dS/dt = ${lambda.toFixed(3)} - ${(params.alpha + params.mu2).toFixed(3)} × ${S_observed} = ${dS_at_S134.toFixed(3)}`);

if (Math.abs(dS_at_S134) < 0.01) {
  console.log(`✅ S hampir di equilibrium (dS/dt ≈ 0)`);
  console.log(`Tetapi nilai equilibrium SALAH karena S* seharusnya = λ/μ₂ = ${S_df.toFixed(1)}`);
} else {
  console.log(`❌ S tidak di equilibrium, seharusnya masih berubah`);
}

// Solusi yang benar
console.log(`\n=== SOLUSI TEORITIS ===`);
console.log(`Untuk R₀ < 1, disease-free equilibrium:`);
console.log(`- dS/dt = 0 → λ = μ₂S* → S* = λ/μ₂ = ${S_df.toFixed(1)}`);
console.log(`- dE/dt = 0 → αS* = (β + μ₂)E* → E* = αS*/(β + μ₂)`);
console.log(`- Tetapi karena R₀ < 1, infeksi akan hilang → E* = 0`);
console.log(`- Hal ini terjadi ketika tidak ada recruitment baru ke E, atau α → 0 secara efektif`);
