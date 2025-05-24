
import React from 'react';
import { EquationIcon } from './icons';

const SeirModelInfo: React.FC<{ currentR0: number }> = ({ currentR0 }) => {
  return (
    <div className="space-y-4 text-slate-300">
      <div>
        <h3 className="text-lg font-semibold text-sky-400 mb-2">Bilangan Reproduksi Dasar (R₀)</h3>
        <p className="text-3xl font-bold text-white">{currentR0.toFixed(3)}</p>
        <p className="text-sm mt-1">
          {currentR0 < 1
            ? `R₀ = ${currentR0.toFixed(3)} < 1 mengindikasikan penyebaran kecanduan terkendali atau menurun. Kecanduan akan hilang secara alami dengan parameter saat ini.`
            : currentR0 === 1
            ? `R₀ = ${currentR0.toFixed(3)} = 1 mengindikasikan kecanduan akan menetap pada level yang sama.`
            : `R₀ = ${currentR0.toFixed(3)} > 1 mengindikasikan kecanduan berpotensi menyebar atau menjadi endemik dengan parameter saat ini.`}
        </p>
        <div className="mt-2 text-xs text-slate-400 bg-slate-700/50 p-2 rounded">
          <strong>Interpretasi Sesuai Paper:</strong> Bilangan reproduksi dasar menunjukkan jumlah individu berpotensi kecanduan yang dapat dipengaruhi oleh satu individu yang sudah kecanduan.
        </div>
        <p className="text-xs text-slate-400 mt-1">Dihitung sebagai: β / (γ + θ + μ₂)</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-sky-400 mb-2 flex items-center"><EquationIcon className="w-5 h-5 mr-2" /> Persamaan Model SEIR</h3>
        <div className="space-y-1 text-sm p-3 bg-slate-700/50 rounded-md">
          <p><code className="text-sky-300">dS/dt = Λ - (α + μ₂)S</code></p>
          <p><code className="text-sky-300">dE/dt = αS - (β + μ₂)E</code></p>
          <p><code className="text-sky-300">dI/dt = βE - (γ + θ + μ₂)I</code></p>
          <p><code className="text-sky-300">dR/dt = (γ + θ)I - μ₂R</code></p>
          <p className="text-xs text-slate-400 mt-1">Dimana Λ (Laju Masuk Baru) = μ₁ × N_current</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-sky-400 mb-2">Tentang Model Ini</h3>
        <p className="text-sm">
          Model SEIR (Susceptible, Exposed, Infected, Recovered) ini menyimulasikan dinamika kecanduan game online
          berdasarkan penelitian di SMP Negeri 3 Makassar. Model ini membantu memahami bagaimana berbagai faktor 
          seperti rekrutmen (μ₁), paparan (α), infeksi/kecanduan (β), pemulihan alami (γ), dan intervensi (θ)
          memengaruhi jumlah individu dalam setiap kategori dari waktu ke waktu.
        </p>
        <div className="mt-3 text-xs bg-slate-700/50 p-3 rounded space-y-2">
          <div><strong className="text-sky-300">Expected Results Sesuai Paper:</strong></div>
          <div>• <strong>Tanpa Intervensi:</strong> I mencapai ~200 orang, R mencapai ~95 orang (36 bulan)</div>
          <div>• <strong>Dengan Intervensi:</strong> I turun ke ~26 orang, R meningkat ke ~250 orang (36 bulan)</div>
          <div>• <strong>Populasi Total:</strong> Dapat bertumbuh dari 176 menjadi ~700+ karena recruitment natural (μ₁)</div>
          <div>• <strong>Model ini sekarang mengikuti persamaan paper asli tanpa normalisasi populasi</strong></div>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Berdasarkan "Model SEIR Kecanduan Game Online pada Siswa di SMP Negeri 3 Makassar" - Jurnal Sainsmat, Maret 2020.
        </p>
      </div>
    </div>
  );
};

export default SeirModelInfo;
