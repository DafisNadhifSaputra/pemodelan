import React, { useState, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { BookOpenIcon, ArrowLeftIcon } from './icons';
import { runSearSimulation } from '../services/seirSimulator';
import ThemeToggle from './ThemeToggle';
import type { SearParams, SimulationDataPoint } from '../types';
import { DEFAULT_PARAMS, DEFAULT_INITIAL_CONDITIONS, THETA_WITH_INTERVENTION, THETA_WITHOUT_INTERVENTION, SIMULATION_DURATION_MONTHS, TIME_STEP } from '../constants';
import LazyLoadWrapper from './LazyLoadWrapper';
import { ChartSkeleton } from './Skeleton';

// Lazy load SimulationChart untuk performa yang lebih baik
import { lazy } from 'react';
const SimulationChart = lazy(() => import('./SimulationChart'));

interface JournalPageProps {
  onBack: () => void;
}

const JournalPage: React.FC<JournalPageProps> = ({ onBack }) => {
  const [simulationWithIntervention, setSimulationWithIntervention] = useState<SimulationDataPoint[]>([]);
  const [simulationWithoutIntervention, setSimulationWithoutIntervention] = useState<SimulationDataPoint[]>([]);
  const [showSimulations, setShowSimulations] = useState(false);
  // Calculate R0 for both scenarios - corrected formula as per paper
  const calculateR0 = (params: SearParams): number => {
    if ((params.gamma + params.theta + params.mu2) === 0) return Infinity;
    return params.beta / (params.gamma + params.theta + params.mu2);
  };

  const paramsWithIntervention = { ...DEFAULT_PARAMS, theta: THETA_WITH_INTERVENTION };
  const paramsWithoutIntervention = { ...DEFAULT_PARAMS, theta: THETA_WITHOUT_INTERVENTION };
  
  const r0WithIntervention = calculateR0(paramsWithIntervention);
  const r0WithoutIntervention = calculateR0(paramsWithoutIntervention);

  const N_initial = DEFAULT_INITIAL_CONDITIONS.S0 + DEFAULT_INITIAL_CONDITIONS.E0 + DEFAULT_INITIAL_CONDITIONS.A0 + DEFAULT_INITIAL_CONDITIONS.R0;  useEffect(() => {
    if (showSimulations) {
      // Run simulations for comparison
      const dataWithIntervention = runSearSimulation(
        paramsWithIntervention, 
        DEFAULT_INITIAL_CONDITIONS, 
        N_initial, 
        SIMULATION_DURATION_MONTHS, 
        TIME_STEP
      );
      const dataWithoutIntervention = runSearSimulation(
        paramsWithoutIntervention, 
        DEFAULT_INITIAL_CONDITIONS, 
        N_initial, 
        SIMULATION_DURATION_MONTHS, 
        TIME_STEP
      );
      
      setSimulationWithIntervention(dataWithIntervention);
      setSimulationWithoutIntervention(dataWithoutIntervention);
    }
  }, [showSimulations, N_initial]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-6">        {/* Header */}        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={onBack}
              className="flex items-center space-x-2 text-slate-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Kembali ke Simulasi</span>
            </button>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                <BookOpenIcon className="w-6 h-6" />
                <span className="font-medium">Jurnal Penelitian</span>
              </div>
              <ThemeToggle />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-slate-800 dark:text-gray-100 mb-2">
            Model SEAR untuk Analisis Kecanduan Game Online
          </h1>
          <p className="text-slate-600 dark:text-gray-300">
            Pemodelan Matematika Dinamika Kecanduan Game Online Menggunakan Model Epidemiologi SEAR
          </p>
        </div>        {/* Abstract */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-gray-100 mb-4 flex items-center">
            <span className="w-2 h-8 bg-blue-500 rounded mr-3"></span>
            Abstract
          </h2>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-slate-700 dark:text-gray-300 leading-relaxed mb-4">
              Penelitian ini membahas model matematika SEAR kecanduan game online. Data yang digunakan adalah data primer 
              berupa jumlah siswa SMP Negeri 3 Makassar yang kecanduan game online yang diperoleh dengan cara membagikan 
              angket kepada siswa. Penelitian ini dimulai dari membangun model SEAR kecanduan game online, menentukan 
              titik keseimbangan, menganalisis kestabilan titik keseimbangan, menentukan nilai bilangan reproduksi dasar (R₀), 
              melakukan simulasi model menggunakan software Maple, dan menginterpretasikan hasil simulasi.
            </p>
            <p className="text-slate-700 dark:text-gray-300 leading-relaxed mb-4">
              Dalam artikel ini diperoleh model matematika SEAR kecanduan game online; dua titik keseimbangan, yaitu titik 
              keseimbangan bebas kecanduan dan titik keseimbangan kecanduan; kestabilan titik keseimbangan bebas kecanduan 
              dan kecanduan; serta bilangan reproduksi dasar R₀ = 0,089 yang menunjukkan bahwa tidak terjadi penularan 
              kecanduan dari satu individu ke individu lain.
            </p>
            <p className="text-slate-700 dark:text-gray-300 leading-relaxed">
              <strong>Kata kunci:</strong> Model Matematika, Kecanduan Game Online, Model SEAR.
            </p>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-gray-100 mb-6 flex items-center">
            <span className="w-2 h-8 bg-green-500 rounded mr-3"></span>
            Pendahuluan
          </h2>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-slate-700 dark:text-gray-300 leading-relaxed mb-4">
              Perkembangan teknologi berupa internet memberikan manfaat yang sangat besar bagi kemajuan di segala bidang 
              kehidupan. Hari ke hari internet menyuguhkan banyak penawaran yang menarik, alih-alih menggunakan internet 
              untuk menyelesaikan tugas atau pekerjaan, kenyataannya banyak yang beralih pada game online.
            </p>
            <p className="text-slate-700 dark:text-gray-300 leading-relaxed mb-4">
              Game online adalah permainan yang dimainkan secara online via internet. Game dengan fasilitas online via 
              internet menawarkan fasilitas lebih dibandingkan dengan game biasa karena pemain bisa berkomunikasi dengan 
              pemain lain di seluruh penjuru dunia melalui chatting.
            </p>
            <p className="text-slate-700 dark:text-gray-300 leading-relaxed mb-4">
              Di Indonesia, fenomena bermain game sudah banyak melibatkan remaja. Menurut lembaga riset pemasaran asal 
              Amsterdam, Newzoo, pada tahun 2017 terdapat 43,7 juta gamer (56% diantaranya merupakan laki-laki) di Indonesia. 
              Jumlah pemain game di Indonesia terbanyak di Asia Tenggara.
            </p>
            <p className="text-slate-700 dark:text-gray-300 leading-relaxed">
              Bermain game online memang kegiatan yang mengasikkan, dapat mengisi waktu luang dan menghilangkan stres, 
              namun jika intensitas bermain game tidak dibatasi maka dapat membuat individu kecanduan. Kecanduan adalah 
              suatu aktivitas atau substansi yang dilakukan berulang-ulang dan dapat menimbulkan dampak negatif.
            </p>
          </div>
        </div>

        {/* Methodology */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-gray-100 mb-6 flex items-center">
            <span className="w-2 h-8 bg-purple-500 rounded mr-3"></span>
            Metodologi Penelitian
          </h2>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-slate-700 dark:text-gray-300 leading-relaxed mb-4">
              Penelitian yang dilakukan merupakan jenis penelitian kajian teori dan terapan, yaitu dengan mengkaji 
              literatur-literatur mengenai pemodelan matematika serta kecanduan game online. Data yang digunakan 
              dalam penelitian ini adalah data primer jumlah siswa SMP Negeri 3 Makassar.
            </p>
            
            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Populasi dan Sampel</h3>
            <p className="text-slate-700 dark:text-gray-300 leading-relaxed mb-4">
              Populasi dalam penelitian ini adalah seluruh siswa SMP Negeri 3 Makassar tahun ajaran 2018/2019 yang 
              berjumlah 1194 siswa. Penarikan sampel dilakukan dengan teknik acak atau random sampling, sehingga 
              jumlah sampel yang digunakan berjumlah 176 siswa yang terdiri dari siswa kelas 7 dan kelas 8.
            </p>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Langkah Penelitian</h3>
            <ol className="text-slate-700 dark:text-gray-300 space-y-2 mb-4">
              <li>1. Membangun model SEAR kecanduan game online dengan menentukan asumsi, variabel, dan parameter</li>
              <li>2. Menganalisis model SEAR dengan menentukan titik keseimbangan dan kestabilan</li>
              <li>3. Menentukan bilangan reproduksi dasar (R₀)</li>
              <li>4. Melakukan simulasi model menggunakan software Maple</li>
              <li>5. Menganalisis dan menginterpretasikan hasil simulasi</li>
            </ol>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Asumsi Model</h3>
            <ul className="text-slate-700 dark:text-gray-300 space-y-2">
              <li>• Terdapat siswa yang memiliki dan tidak memiliki game online di gadgetnya</li>
              <li>• Laju siswa yang tidak memiliki game online di gadgetnya dianggap konstan</li>
              <li>• Siswa yang masuk kelas berpotensi kecanduan adalah mereka yang memiliki game online</li>
              <li>• Siswa yang masuk kelas mencoba bermain adalah mereka yang mulai bermain dengan intensitas normal</li>
              <li>• Siswa kecanduan jika diberikan penanganan berupa pengawasan dan konseling akan sembuh</li>
            </ul>
          </div>
        </div>

        {/* Simulation Results Section */}        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-gray-100 mb-6 flex items-center">
            <span className="w-2 h-8 bg-emerald-500 rounded mr-3"></span>
            Hasil Simulasi Model
          </h2>          <div className="mb-6">
            <button
              onClick={() => setShowSimulations(!showSimulations)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showSimulations ? 'Sembunyikan Simulasi' : 'Tampilkan Simulasi'}
            </button>
          </div>

          {showSimulations && (
            <div className="space-y-8">              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border-l-4 border-red-500">
                  <h3 className="font-bold text-red-800 dark:text-red-300 mb-2">Tanpa Intervensi (θ = 0)</h3>
                  <p className="text-sm text-slate-700 dark:text-gray-300 mb-2">R₀ = {r0WithoutIntervention.toFixed(3)}</p>
                  <p className="text-sm text-slate-600 dark:text-gray-400">
                    {r0WithoutIntervention > 1 ? 'Kecanduan akan menyebar dan menjadi endemik' : 'Kecanduan akan menghilang dari populasi'}
                  </p>
                  <div className="mt-2 text-xs text-red-700 dark:text-red-300">
                    Hanya mengandalkan pemulihan alami (γ = {DEFAULT_PARAMS.gamma})
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500">
                  <h3 className="font-bold text-green-800 dark:text-green-300 mb-2">Dengan Intervensi (θ = 1)</h3>
                  <p className="text-sm text-slate-700 dark:text-gray-300 mb-2">R₀ = {r0WithIntervention.toFixed(3)}</p>
                  <p className="text-sm text-slate-600 dark:text-gray-400">
                    {r0WithIntervention > 1 ? 'Kecanduan masih dapat menyebar' : 'Intervensi berhasil mengurangi penyebaran'}
                  </p>
                  <div className="mt-2 text-xs text-green-700 dark:text-green-300">
                    Pemulihan alami + intervensi efektif (γ + θ = {DEFAULT_PARAMS.gamma + THETA_WITH_INTERVENTION})
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Analisis Perbandingan:</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Pengurangan R₀ dari {r0WithoutIntervention.toFixed(3)} menjadi {r0WithIntervention.toFixed(3)} 
                  ({((1 - r0WithIntervention/r0WithoutIntervention) * 100).toFixed(1)}% pengurangan) 
                  menunjukkan efektivitas intervensi dalam mengendalikan penyebaran kecanduan.
                </p>
              </div>              {simulationWithoutIntervention.length > 0 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-gray-100 mb-4 bg-red-100 dark:bg-red-900/20 p-3 rounded-lg">
                      📈 Simulasi Tanpa Intervensi (θ = 0)
                    </h3>                    <div className="bg-slate-50 dark:bg-gray-700 p-4 rounded-lg border-2 border-red-200 dark:border-red-600">
                      <div className="h-[400px] w-full">
                       
                          <SimulationChart data={simulationWithoutIntervention} hasIntervention={false} />
                      
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-slate-600 dark:text-gray-300 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                      <strong>Observasi:</strong> Populasi kecanduan (A) mencapai puncak tinggi dan bertahan lama tanpa intervensi.
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-gray-100 mb-4 bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
                      📉 Simulasi Dengan Intervensi (θ = 1)
                    </h3>                    <div className="bg-slate-50 dark:bg-gray-700 p-4 rounded-lg border-2 border-green-200 dark:border-green-600">
                      <div className="h-[400px] w-full">
                       
                          <SimulationChart data={simulationWithIntervention} hasIntervention={true} />
                        
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-slate-600 dark:text-gray-300 bg-green-50 dark:bg-green-900/20 p-2 rounded">
                      <strong>Observasi:</strong> Intervensi secara signifikan mengurangi puncak kecanduan dan mempercepat pemulihan.
                    </div>
                  </div><div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-600">
                    <h4 className="font-bold text-slate-800 dark:text-gray-100 mb-3">🎯 Kesimpulan Simulasi</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="font-medium text-red-700 dark:text-red-300">Tanpa Intervensi:</div>
                        <ul className="text-slate-600 dark:text-gray-300 space-y-1 ml-4">
                          <li>• Puncak kecanduan lebih tinggi</li>
                          <li>• Durasi epidemi lebih lama</li>
                          <li>• Pemulihan hanya mengandalkan γ</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <div className="font-medium text-green-700 dark:text-green-300">Dengan Intervensi:</div>
                        <ul className="text-slate-600 dark:text-gray-300 space-y-1 ml-4">
                          <li>• Puncak kecanduan lebih rendah</li>
                          <li>• Pemulihan lebih cepat</li>
                          <li>• Efek gabungan γ + θ</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>        {/* Model Description */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-gray-100 mb-6 flex items-center">
            <span className="w-2 h-8 bg-green-500 rounded mr-3"></span>
            Model SEAR
          </h2>
          
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-slate-700 dark:text-gray-300 leading-relaxed mb-6">
              Model SEAR membagi populasi menjadi empat kompartemen berdasarkan status kecanduan game online:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border-l-4 border-blue-500">
                <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2">S - Susceptible (Rentan)</h3>
                <p className="text-slate-700 dark:text-gray-300">
                  Individu yang belum terpapar game online namun memiliki potensi untuk menjadi kecanduan
                </p>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border-l-4 border-yellow-500">
                <h3 className="font-bold text-yellow-800 dark:text-yellow-300 mb-2">E - Exposed (Terpapar)</h3>
                <p className="text-slate-700 dark:text-gray-300">
                  Individu yang telah mencoba bermain game online namun belum menunjukkan tanda-tanda kecanduan
                </p>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border-l-4 border-red-500">
                <h3 className="font-bold text-red-800 dark:text-red-300 mb-2">A - Addicted (Kecanduan)</h3>
                <p className="text-slate-700 dark:text-gray-300">
                  Individu yang mengalami kecanduan game online dengan gejala-gejala yang merugikan
                </p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border-l-4 border-green-500">
                <h3 className="font-bold text-green-800 dark:text-green-300 mb-2">R - Recovered (Pulih)</h3>
                <p className="text-slate-700 dark:text-gray-300">
                  Individu yang telah pulih dari kecanduan dan memiliki resistensi terhadap kecanduan kembali
                </p>
              </div>
            </div>          </div>
        </div>

        {/* Compartment Diagram */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-gray-100 mb-6 flex items-center">
            <span className="w-2 h-8 bg-indigo-500 rounded mr-3"></span>
            Diagram Kompartemen SEAR
          </h2>
          
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-slate-700 dark:text-gray-300 leading-relaxed mb-6">
              Diagram berikut menunjukkan alur perpindahan antar kompartemen dalam model SEAR dengan 
              parameter laju transisi dan feedback loop untuk intervensi:
            </p>
            
            {/* SVG Diagram */}
            <div className="flex justify-center mb-8">
              <div className="bg-slate-50 dark:bg-gray-700/50 p-8 rounded-xl border-2 border-slate-200 dark:border-gray-600">
                <svg 
                  width="800" 
                  height="400" 
                  viewBox="0 0 800 400"
                  className="w-full h-auto max-w-4xl"
                  style={{ maxHeight: '400px' }}
                >
                  {/* Background */}
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto"
                      className="fill-slate-700 dark:fill-gray-300"
                    >
                      <polygon points="0 0, 10 3.5, 0 7" />
                    </marker>
                    
                    <marker
                      id="arrowhead-red"
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto"
                      className="fill-red-600"
                    >
                      <polygon points="0 0, 10 3.5, 0 7" />
                    </marker>

                    <linearGradient id="compartmentGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" className="stop-color-slate-100 dark:stop-color-gray-600" />
                      <stop offset="100%" className="stop-color-slate-200 dark:stop-color-gray-700" />
                    </linearGradient>
                  </defs>
                  
                  {/* Compartments */}
                  {/* S Compartment */}
                  <g>
                    <rect
                      x="80" y="180" width="120" height="80"
                      rx="8"
                      className="fill-blue-100 dark:fill-blue-900/30 stroke-blue-500 dark:stroke-blue-400"
                      strokeWidth="3"
                    />
                    <text
                      x="140" y="215"
                      className="fill-blue-800 dark:fill-blue-200 text-2xl font-bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      S
                    </text>
                    <text
                      x="140" y="235"
                      className="fill-blue-700 dark:fill-blue-300 text-sm"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      Susceptible
                    </text>
                  </g>

                  {/* E Compartment */}
                  <g>
                    <rect
                      x="260" y="180" width="120" height="80"
                      rx="8"
                      className="fill-yellow-100 dark:fill-yellow-900/30 stroke-yellow-500 dark:stroke-yellow-400"
                      strokeWidth="3"
                    />
                    <text
                      x="320" y="215"
                      className="fill-yellow-800 dark:fill-yellow-200 text-2xl font-bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      E
                    </text>
                    <text
                      x="320" y="235"
                      className="fill-yellow-700 dark:fill-yellow-300 text-sm"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      Exposed
                    </text>
                  </g>

                  {/* A Compartment */}
                  <g>
                    <rect
                      x="440" y="180" width="120" height="80"
                      rx="8"
                      className="fill-red-100 dark:fill-red-900/30 stroke-red-500 dark:stroke-red-400"
                      strokeWidth="3"
                    />
                    <text
                      x="500" y="215"
                      className="fill-red-800 dark:fill-red-200 text-2xl font-bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      A
                    </text>
                    <text
                      x="500" y="235"
                      className="fill-red-700 dark:fill-red-300 text-sm"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      Addicted
                    </text>
                  </g>

                  {/* R Compartment */}
                  <g>
                    <rect
                      x="620" y="180" width="120" height="80"
                      rx="8"
                      className="fill-green-100 dark:fill-green-900/30 stroke-green-500 dark:stroke-green-400"
                      strokeWidth="3"
                    />
                    <text
                      x="680" y="215"
                      className="fill-green-800 dark:fill-green-200 text-2xl font-bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      R
                    </text>
                    <text
                      x="680" y="235"
                      className="fill-green-700 dark:fill-green-300 text-sm"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      Recovered
                    </text>
                  </g>

                  {/* Flow Arrows and Labels */}
                  {/* Inflow to S */}
                  <g>
                    <line
                      x1="20" y1="220" x2="75" y2="220"
                      className="stroke-slate-700 dark:stroke-gray-300"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                    <text
                      x="47" y="210"
                      className="fill-slate-700 dark:fill-gray-300 text-sm font-semibold"
                      textAnchor="middle"
                    >
                      μ₁N
                    </text>
                  </g>

                  {/* S to E */}
                  <g>
                    <line
                      x1="205" y1="220" x2="255" y2="220"
                      className="stroke-slate-700 dark:stroke-gray-300"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                    <text
                      x="230" y="210"
                      className="fill-slate-700 dark:fill-gray-300 text-sm font-semibold"
                      textAnchor="middle"
                    >
                      α
                    </text>
                  </g>

                  {/* E to A */}
                  <g>
                    <line
                      x1="385" y1="220" x2="435" y2="220"
                      className="stroke-slate-700 dark:stroke-gray-300"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                    <text
                      x="410" y="210"
                      className="fill-slate-700 dark:fill-gray-300 text-sm font-semibold"
                      textAnchor="middle"
                    >
                      β
                    </text>
                  </g>

                  {/* A to R (natural recovery) */}
                  <g>
                    <line
                      x1="565" y1="220" x2="615" y2="220"
                      className="stroke-slate-700 dark:stroke-gray-300"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                    <text
                      x="590" y="210"
                      className="fill-slate-700 dark:fill-gray-300 text-sm font-semibold"
                      textAnchor="middle"
                    >
                      γ
                    </text>
                  </g>

                  {/* Feedback loop (intervention) A to R */}
                  <g>
                    <path
                      d="M 500 175 Q 590 120 680 175"
                      className="stroke-red-600 dark:stroke-red-400 fill-none"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead-red)"
                    />
                    <text
                      x="590" y="140"
                      className="fill-red-600 dark:fill-red-400 text-sm font-semibold"
                      textAnchor="middle"
                    >
                      θ
                    </text>
                    <text
                      x="590" y="155"
                      className="fill-red-600 dark:fill-red-400 text-xs"
                      textAnchor="middle"
                    >
                      (Intervensi)
                    </text>
                  </g>

                  {/* Outflows (μ₂) */}
                  {/* S outflow */}
                  <g>
                    <line
                      x1="140" y1="265" x2="140" y2="310"
                      className="stroke-slate-700 dark:stroke-gray-300"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                    <text
                      x="150" y="295"
                      className="fill-slate-700 dark:fill-gray-300 text-sm"
                    >
                      μ₂
                    </text>
                  </g>

                  {/* E outflow */}
                  <g>
                    <line
                      x1="320" y1="265" x2="320" y2="310"
                      className="stroke-slate-700 dark:stroke-gray-300"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                    <text
                      x="330" y="295"
                      className="fill-slate-700 dark:fill-gray-300 text-sm"
                    >
                      μ₂
                    </text>
                  </g>

                  {/* A outflow */}
                  <g>
                    <line
                      x1="500" y1="265" x2="500" y2="310"
                      className="stroke-slate-700 dark:stroke-gray-300"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                    <text
                      x="510" y="295"
                      className="fill-slate-700 dark:fill-gray-300 text-sm"
                    >
                      μ₂
                    </text>
                  </g>

                  {/* R outflow */}
                  <g>
                    <line
                      x1="680" y1="265" x2="680" y2="310"
                      className="stroke-slate-700 dark:stroke-gray-300"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                    <text
                      x="690" y="295"
                      className="fill-slate-700 dark:fill-gray-300 text-sm"
                    >
                      μ₂
                    </text>
                  </g>

                  {/* Title */}
                  <text
                    x="400" y="40"
                    className="fill-slate-800 dark:fill-gray-200 text-lg font-bold"
                    textAnchor="middle"
                  >
                    Model SEAR: Dinamika Kecanduan Game Online
                  </text>

                  {/* Legend */}
                  <g>
                    <rect
                      x="50" y="340" width="700" height="45"
                      rx="6"
                      className="fill-slate-100 dark:fill-gray-700/50 stroke-slate-300 dark:stroke-gray-600"
                      strokeWidth="1"
                    />
                    <text
                      x="60" y="358"
                      className="fill-slate-700 dark:fill-gray-300 text-sm font-semibold"
                    >
                      Keterangan:
                    </text>
                    <text
                      x="60" y="375"
                      className="fill-slate-600 dark:fill-gray-400 text-xs"
                    >
                      α: Laju paparan | β: Laju kecanduan | γ: Laju pemulihan alami | θ: Efektivitas intervensi | μ₁: Rekrutmen | μ₂: Keluar alami
                    </text>
                  </g>
                </svg>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">
                Interpretasi Diagram:
              </h4>
              <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                <li>• <strong>Alur Utama:</strong> S → E → A → R (pengembangan dan pemulihan kecanduan)</li>
                <li>• <strong>Rekrutmen:</strong> μ₁N menambah individu baru ke kompartemen S</li>
                <li>• <strong>Keluar Alami:</strong> μ₂ mewakili individu yang keluar dari setiap kompartemen</li>
                <li>• <strong>Intervensi:</strong> θ memberikan jalur pemulihan tambahan langsung dari A ke R</li>
                <li>• <strong>Feedback Loop:</strong> Garis merah menunjukkan efek intervensi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mathematical Model */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-gray-100 mb-6 flex items-center">
            <span className="w-2 h-8 bg-purple-500 rounded mr-3"></span>
            Model Matematika
          </h2>
          
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-slate-700 dark:text-gray-300 leading-relaxed mb-6">
              Dinamika perpindahan antar kompartemen dimodelkan menggunakan sistem persamaan diferensial 
              biasa (ODE) sebagai berikut, dengan N = S + E + A + R adalah total siswa yang diteliti:
            </p>
            
            <div className="bg-slate-50 dark:bg-gray-700 p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-slate-800 dark:text-gray-100 mb-4">Sistem Persamaan Diferensial:</h3>
              
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded border-l-4 border-blue-500">
                  <BlockMath math="\frac{dS}{dt} = \mu_1 N - (\alpha + \mu_2)S" />
                  <p className="text-sm text-slate-600 dark:text-gray-400 mt-2">Perubahan populasi Susceptible</p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-4 rounded border-l-4 border-yellow-500">
                  <BlockMath math="\frac{dE}{dt} = \alpha S - (\beta + \mu_2)E" />
                  <p className="text-sm text-slate-600 dark:text-gray-400 mt-2">Perubahan populasi Exposed</p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-4 rounded border-l-4 border-red-500">
                  <BlockMath math="\frac{dA}{dt} = \beta E - (\gamma + \theta + \mu_2)A" />
                  <p className="text-sm text-slate-600 dark:text-gray-400 mt-2">Perubahan populasi Addicted (menggunakan A untuk Addicted)</p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-4 rounded border-l-4 border-green-500">
                  <BlockMath math="\frac{dR}{dt} = (\gamma + \theta)A - \mu_2 R" />
                  <p className="text-sm text-slate-600 dark:text-gray-400 mt-2">Perubahan populasi Recovered</p>
                </div>
              </div>
              
              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Dimana:</h4>
                <BlockMath math="\mu_1 \cdot N" />
                <p className="text-sm text-blue-700 dark:text-blue-300">adalah laju rekrutmen baru ke dalam populasi</p>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">📝 Catatan Adaptasi Model</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Model asli menggunakan "I" untuk Infected, namun dalam konteks kecanduan game online, 
                kami menggunakan "A" untuk Addicted agar lebih sesuai dengan terminologi kecanduan behavioral.
              </p>
            </div>
          </div>
        </div>        {/* Parameters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-gray-100 mb-6 flex items-center">
            <span className="w-2 h-8 bg-orange-500 rounded mr-3"></span>
            Parameter Model
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-gray-100 mb-4">Parameter Transisi</h3>
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <InlineMath math="\alpha" />
                    <span className="text-sm text-slate-600 dark:text-gray-300">0.438</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-gray-300">Laju transisi dari Susceptible ke Exposed</p>
                </div>
                
                <div className="bg-slate-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <InlineMath math="\beta" />
                    <span className="text-sm text-slate-600 dark:text-gray-300">0.102</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-gray-300">Laju transisi dari Exposed ke Addicted</p>
                </div>
                
                <div className="bg-slate-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <InlineMath math="\gamma" />
                    <span className="text-sm text-slate-600 dark:text-gray-300">0.051</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-gray-300">Laju pemulihan alami dari Addicted ke Recovered</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-gray-100 mb-4">Parameter Demografis</h3>
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <InlineMath math="\mu_1" />
                    <span className="text-sm text-slate-600 dark:text-gray-300">0.409</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-gray-300">Laju rekrutmen populasi baru</p>
                </div>
                
                <div className="bg-slate-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <InlineMath math="\mu_2" />
                    <span className="text-sm text-slate-600 dark:text-gray-300">0.097</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-gray-300">Laju keluar alami dari setiap kompartemen</p>
                </div>
                
                <div className="bg-slate-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <InlineMath math="\theta" />
                    <span className="text-sm text-slate-600 dark:text-gray-300">0 atau 1</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-gray-300">Efektivitas intervensi pemulihan</p>
                </div>
              </div>
            </div>
          </div>
        </div>{/* Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-gray-100 mb-6 flex items-center">
            <span className="w-2 h-8 bg-indigo-500 rounded mr-3"></span>
            Analisis Model
          </h2>
          
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-4">Titik Keseimbangan</h3>
            <p className="text-slate-700 dark:text-gray-300 leading-relaxed mb-4">
              Model SEAR memiliki dua titik keseimbangan yang diperoleh dengan mengatur semua turunan sama dengan nol:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Titik Keseimbangan Bebas Kecanduan (E₀)</h4>
                <div className="text-sm space-y-1">
                  <BlockMath math="E_0 = \left(\frac{\mu_1 N}{\mu_2+\alpha}, 0, 0, 0\right)" />
                </div>
                <p className="text-xs text-slate-600 dark:text-gray-400 mt-2">Tidak ada individu yang kecanduan</p>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border-l-4 border-red-500">
                <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">Titik Keseimbangan Kecanduan (E*)</h4>
                <div className="text-sm space-y-1">
                  <BlockMath math="E^* = (S^*, E^*, A^*, R^*)" />
                </div>
                <p className="text-xs text-slate-600 dark:text-gray-400 mt-2">Kecanduan persisten dalam populasi</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-4">Analisis Kestabilan</h3>
            <p className="text-slate-700 dark:text-gray-300 leading-relaxed mb-4">
              Kestabilan titik keseimbangan ditentukan melalui analisis matriks Jacobian dan nilai eigen:
            </p>
            
            <div className="bg-slate-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-slate-800 dark:text-gray-100 mb-2">Matriks Jacobian untuk E₀:</h4>
              <BlockMath math="J(E_0) = \begin{pmatrix} -\alpha - \mu_2 & 0 & 0 & 0 \\ \alpha & -\beta - \mu_2 & 0 & 0 \\ 0 & \beta & -\gamma - \theta - \mu_2 & 0 \\ 0 & 0 & \gamma + \theta & -\mu_2 \end{pmatrix}" />
            </div>

            <p className="text-slate-700 dark:text-gray-300 leading-relaxed mb-4">
              Nilai eigen: λ₁ = -α - μ₂, λ₂ = -β - μ₂, λ₃ = -γ - θ - μ₂, λ₄ = -μ₂. 
              Karena semua parameter bernilai positif, semua nilai eigen negatif, sehingga kedua titik keseimbangan stabil.
            </p>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-4">Basic Reproduction Number</h3>
            <p className="text-slate-700 dark:text-gray-300 leading-relaxed mb-4">
              Basic reproduction number <InlineMath math="R_0" /> menggunakan metode next generation matrix:
            </p>
            
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg mb-6">
              <BlockMath math="R_0 = \frac{\beta}{\gamma + \theta + \mu_2}" />
              <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-2">
                Berdasarkan penelitian asli: R₀ = 0,089 &lt; 1, menunjukkan tidak ada penularan kecanduan
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border-l-4 border-red-500">
                <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">Jika <InlineMath math="R_0 > 1" /></h4>
                <p className="text-slate-700 dark:text-gray-300">Kecanduan akan menyebar dan menjadi endemik dalam populasi</p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Jika <InlineMath math="R_0 < 1" /></h4>
                <p className="text-slate-700 dark:text-gray-300">Kecanduan akan menghilang dari populasi secara alami</p>
              </div>
            </div>
          </div>
        </div>

        {/* Results and Discussion */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-gray-100 mb-6 flex items-center">
            <span className="w-2 h-8 bg-orange-500 rounded mr-3"></span>
            Hasil dan Pembahasan
          </h2>
          
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-4">Parameter Model dari Penelitian Asli</h3>
            <p className="text-slate-700 dark:text-gray-300 leading-relaxed mb-4">
              Berdasarkan data dari 176 siswa SMP Negeri 3 Makassar, diperoleh nilai parameter sebagai berikut:
            </p>
            
            <div className="bg-slate-50 dark:bg-gray-700 p-6 rounded-lg mb-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="font-bold text-slate-800 dark:text-gray-100">μ₁ = 0,409</div>
                  <div className="text-sm text-slate-600 dark:text-gray-400">Laju rekrutmen</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-slate-800 dark:text-gray-100">μ₂ = 0,097</div>
                  <div className="text-sm text-slate-600 dark:text-gray-400">Laju keluar alami</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-slate-800 dark:text-gray-100">α = 0,438</div>
                  <div className="text-sm text-slate-600 dark:text-gray-400">S → E</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-slate-800 dark:text-gray-100">β = 0,102</div>
                  <div className="text-sm text-slate-600 dark:text-gray-400">E → A</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-slate-800 dark:text-gray-100">γ = 0,051</div>
                  <div className="text-sm text-slate-600 dark:text-gray-400">Pemulihan alami</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-slate-800 dark:text-gray-100">θ = 1</div>
                  <div className="text-sm text-slate-600 dark:text-gray-400">Efektivitas intervensi</div>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-4">Kondisi Awal Simulasi</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <div className="font-bold text-blue-800 dark:text-blue-300">S(0) = 72</div>
                <div className="text-sm text-slate-600 dark:text-gray-400">Berpotensi</div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-center">
                <div className="font-bold text-yellow-800 dark:text-yellow-300">E(0) = 77</div>
                <div className="text-sm text-slate-600 dark:text-gray-400">Mencoba</div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
                <div className="font-bold text-red-800 dark:text-red-300">A(0) = 18</div>
                <div className="text-sm text-slate-600 dark:text-gray-400">Kecanduan</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                <div className="font-bold text-green-800 dark:text-green-300">R(0) = 9</div>
                <div className="text-sm text-slate-600 dark:text-gray-400">Pulih</div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-4">Hasil Simulasi Maple</h3>
            <p className="text-slate-700 dark:text-gray-300 leading-relaxed mb-4">
              Simulasi menggunakan software Maple menunjukkan perbedaan signifikan antara skenario dengan dan tanpa intervensi:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border-l-4 border-red-500">
                <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">Tanpa Penanganan (θ = 0)</h4>
                <ul className="text-sm text-slate-700 dark:text-gray-300 space-y-1">
                  <li>• Kecanduan mencapai ~200 orang (36 bulan)</li>
                  <li>• Pemulihan hanya ~95 orang</li>
                  <li>• Bergantung pada pemulihan alami saja</li>
                </ul>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Dengan Penanganan (θ = 1)</h4>
                <ul className="text-sm text-slate-700 dark:text-gray-300 space-y-1">
                  <li>• Kecanduan turun menjadi ~26 orang</li>
                  <li>• Pemulihan meningkat hingga ~250 orang</li>
                  <li>• Pengawasan + konseling efektif</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">💡 Temuan Kunci</h4>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Pengurangan 87% dalam jumlah kecanduan (200 → 26) dan peningkatan 163% dalam pemulihan (95 → 250) 
                menunjukkan efektivitas luar biasa dari intervensi terstruktur.
              </p>
            </div>
          </div>
        </div>

        {/* Intervention Analysis */}        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-gray-100 mb-6 flex items-center">
            <span className="w-2 h-8 bg-teal-500 rounded mr-3"></span>
            Analisis Intervensi
          </h2>
          
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-slate-700 dark:text-gray-300 leading-relaxed mb-6">
              Parameter <InlineMath math="\theta" /> memodelkan efektivitas intervensi dalam membantu 
              pemulihan individu yang kecanduan. Nilai ini dapat diinterpretasikan sebagai:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3">
                  <InlineMath math="\theta = 0" /> (Tanpa Intervensi)
                </h3>
                <ul className="text-slate-700 dark:text-gray-300 space-y-2">
                  <li>• Tidak ada program intervensi aktif</li>
                  <li>• Pemulihan hanya bergantung pada mekanisme alami</li>
                  <li>• Tingkat kecanduan cenderung lebih tinggi</li>
                  <li>• Durasi kecanduan lebih lama</li>
                </ul>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <h3 className="font-bold text-green-800 dark:text-green-300 mb-3">
                  <InlineMath math="\theta = 1" /> (Dengan Intervensi)
                </h3>
                <ul className="text-slate-700 dark:text-gray-300 space-y-2">
                  <li>• Program intervensi efektif diterapkan</li>
                  <li>• Konseling, terapi, dan dukungan sosial</li>
                  <li>• Tingkat pemulihan meningkat signifikan</li>
                  <li>• Pencegahan kekambuhan lebih baik</li>
                </ul>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-4">Rekomendasi Intervensi</h3>
            <p className="text-slate-700 dark:text-gray-300 leading-relaxed mb-4">
              Berdasarkan hasil simulasi model, rekomendasi solusi untuk mengurangi kecanduan game online:
            </p>
            
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">1. Pengawasan Orang Tua</h4>
                <p className="text-slate-700 dark:text-gray-300 text-sm">
                  Pihak sekolah menghimbau orang tua agar senantiasa mengawasi anaknya dalam bermain game online.
                </p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-500">
                <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">2. Program Bimbingan dan Konseling</h4>
                <p className="text-slate-700 dark:text-gray-300 text-sm">
                  Memberdayakan program bimbingan dan konseling bagi siswa yang mulai kecanduan maupun yang telah kecanduan.
                </p>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border-l-4 border-orange-500">
                <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">3. Edukasi dan Seminar</h4>
                <p className="text-slate-700 dark:text-gray-300 text-sm">
                  Mengadakan seminar kepada orang tua siswa tentang game online dan masalah yang akan ditimbulkannya.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Conclusion */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-gray-100 mb-6 flex items-center">
            <span className="w-2 h-8 bg-rose-500 rounded mr-3"></span>
            Kesimpulan
          </h2>
          
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-slate-700 dark:text-gray-300 leading-relaxed mb-4">
              Model SEAR memberikan kerangka kerja yang komprehensif untuk memahami dinamika kecanduan 
              game online dalam populasi. Hasil analisis menunjukkan bahwa:
            </p>
            
            <ol className="text-slate-700 dark:text-gray-300 space-y-3 mb-6">
              <li>
                <strong>1. Model Matematika:</strong> Sistem persamaan diferensial SEAR berhasil menggambarkan 
                dinamika transisi antar kompartemen kecanduan game online.
              </li>
              <li>
                <strong>2. Titik Keseimbangan:</strong> Model menghasilkan dua titik keseimbangan yang stabil - 
                bebas kecanduan dan endemik kecanduan.
              </li>
              <li>
                <strong>3. Bilangan Reproduksi:</strong> R₀ = 0,089 &lt; 1 menunjukkan tidak ada penularan 
                kecanduan antarindividu pada kondisi penelitian.
              </li>
              <li>
                <strong>4. Efektivitas Intervensi:</strong> Parameter θ = 1 memberikan dampak luar biasa 
                dengan pengurangan 87% kecanduan dan peningkatan 163% pemulihan.
              </li>
            </ol>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Implikasi Praktis</h3>
              <p className="text-slate-700 dark:text-gray-300">
                Model ini dapat digunakan oleh pembuat kebijakan untuk merancang strategi intervensi 
                yang optimal dalam mengatasi masalah kecanduan game online di kalangan remaja. 
                Kombinasi pengawasan orang tua, bimbingan konseling, dan edukasi terbukti sangat efektif.
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
              <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">Kontribusi Penelitian</h3>
              <p className="text-slate-700 dark:text-gray-300 text-sm">
                Penelitian ini merupakan adaptasi pertama model epidemiologi SEIR untuk kasus kecanduan behavioral, 
                memberikan perspektif baru dalam pemodelan matematika masalah sosial di era digital.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
