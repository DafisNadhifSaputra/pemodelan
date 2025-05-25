
import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { EquationIcon } from './icons';

const SearModelInfo: React.FC<{ currentR0: number }> = ({ currentR0 }) => {
  return (
    <div className="space-y-4 text-gray-700 dark:text-slate-300">
      <div>
        <h3 className="text-lg font-semibold text-blue-600 dark:text-sky-400 mb-2">Bilangan Reproduksi Dasar (<InlineMath math="R_0" />)</h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{currentR0.toFixed(3)}</p>
        <p className="text-sm mt-1">
          {currentR0 < 1
            ? <>
                <InlineMath math="R_0 = " />{currentR0.toFixed(3)} <InlineMath math="< 1" /> mengindikasikan penyebaran kecanduan terkendali atau menurun. Kecanduan akan hilang secara alami dengan parameter saat ini.
              </>
            : currentR0 === 1
            ? <>
                <InlineMath math="R_0 = " />{currentR0.toFixed(3)} <InlineMath math="= 1" /> mengindikasikan kecanduan akan menetap pada level yang sama.
              </>
            : <>
                <InlineMath math="R_0 = " />{currentR0.toFixed(3)} <InlineMath math="> 1" /> mengindikasikan kecanduan berpotensi menyebar atau menjadi endemik dengan parameter saat ini.
              </>}
        </p>
        <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 p-2 rounded">
          <strong>Interpretasi Sesuai Paper:</strong> Bilangan reproduksi dasar menunjukkan jumlah individu berpotensi kecanduan yang dapat dipengaruhi oleh satu individu yang sudah kecanduan.
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Dihitung sebagai: <InlineMath math="R_0 = \frac{\beta}{\gamma + \theta + \mu_2}" />
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-blue-600 dark:text-sky-400 mb-2 flex items-center"><EquationIcon className="w-5 h-5 mr-2" /> Persamaan Model SEAR</h3>
        <div className="space-y-3 text-sm p-4 bg-slate-100 dark:bg-slate-700/50 rounded-md">
          <div className="space-y-2">
            <div><BlockMath math="\frac{dS}{dt} = \Lambda - (\alpha + \mu_2)S" /></div>
            <div><BlockMath math="\frac{dE}{dt} = \alpha S - (\beta + \mu_2)E" /></div>
            <div><BlockMath math="\frac{dA}{dt} = \beta E - (\gamma + \theta + \mu_2)A" /></div>
            <div><BlockMath math="\frac{dR}{dt} = (\gamma + \theta)A - \mu_2 R" /></div>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-3 pt-2 border-t border-slate-300 dark:border-slate-600">
            <p>Dimana <InlineMath math="\Lambda" /> (Laju Masuk Baru) = <InlineMath math="\mu_1 \times N_{0}" /></p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-blue-600 dark:text-sky-400 mb-2">Tentang Model Ini</h3>
        <p className="text-sm">
          Model SEAR (Susceptible, Exposed, Addicted, Recovered) ini menyimulasikan dinamika kecanduan game online
          berdasarkan penelitian di SMP Negeri 3 Makassar. Model ini membantu memahami bagaimana berbagai faktor 
          seperti rekrutmen (μ₁), paparan (α), kecanduan (β), pemulihan alami (γ), dan intervensi (θ)
          memengaruhi jumlah individu dalam setiap kategori dari waktu ke waktu.
        </p>
        <div className="mt-3 text-xs bg-slate-100 dark:bg-slate-700/50 p-3 rounded space-y-2">
          <div><strong className="text-blue-600 dark:text-sky-300">Expected Results Sesuai Paper:</strong></div>
          <div>• <strong>Tanpa Intervensi:</strong> <InlineMath math="A" /> mencapai ~200 orang, <InlineMath math="R" /> mencapai ~95 orang (36 bulan)</div>
          <div>• <strong>Dengan Intervensi:</strong> <InlineMath math="A" /> turun ke ~26 orang, <InlineMath math="R" /> meningkat ke ~250 orang (36 bulan)</div>
          <div>• <strong>Populasi Total:</strong> Dapat bertumbuh dari 176 menjadi ~700+ karena recruitment natural (<InlineMath math="\mu_1" />)</div>
          <div>• <strong>Model ini sekarang mengikuti persamaan paper asli tanpa normalisasi populasi</strong></div>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
          Berdasarkan "Model SEAR Kecanduan Game Online pada Siswa di SMP Negeri 3 Makassar" - Jurnal Sainsmat, Maret 2020.
        </p>
      </div>
    </div>
  );
};

export default SearModelInfo;
