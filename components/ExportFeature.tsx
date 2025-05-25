import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import type { SearParams, InitialConditions, SimulationDataPoint } from '../types';
import { ArrowDownTrayIcon, PhotoIcon, TableCellsIcon, DocumentTextIcon } from './icons';

interface ExportFeatureProps {
  params: SearParams;
  initialConditions: InitialConditions;
  simulationData: SimulationDataPoint[];
  hasIntervention: boolean;
  currentR0: number;
}

const ExportFeature: React.FC<ExportFeatureProps> = ({
  params,
  initialConditions,
  simulationData,
  hasIntervention,
  currentR0
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportConfiguration = () => {
    const config = {
      timestamp: new Date().toISOString(),
      parameters: params,
      initialConditions,
      hasIntervention,
      currentR0,
      metadata: {
        version: '1.0',
        description: 'SEAR Model Configuration for Online Game Addiction'
      }
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sear-config-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportSimulationData = () => {
    const csvHeaders = ['Time (Months)', 'Susceptible', 'Exposed', 'Addicted', 'Recovered'];
    const csvRows = simulationData.map(point => [
      point.time.toFixed(2),
      point.S.toFixed(2),
      point.E.toFixed(2),
      point.A.toFixed(2),
      point.R.toFixed(2)
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sear-simulation-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportReport = () => {
    const lastPoint = simulationData[simulationData.length - 1];
    const totalFinal = lastPoint.S + lastPoint.E + lastPoint.A + lastPoint.R;
    const totalInitial = initialConditions.S0 + initialConditions.E0 + initialConditions.A0 + initialConditions.R0;

    const report = `LAPORAN SIMULASI MODEL SEAR
Kecanduan Game Online
Generated: ${new Date().toLocaleString('id-ID')}

=== KONFIGURASI MODEL ===
Parameter:
- μ₁ (Faktor Rekrutmen): ${params.mu1}
- μ₂ (Laju Keluar Alami): ${params.mu2}
- α (Laju Paparan): ${params.alpha}
- β (Laju Infeksi/Kecanduan): ${params.beta}
- γ (Laju Pemulihan Alami): ${params.gamma}
- θ (Faktor Intervensi): ${params.theta}

Kondisi Awal:
- Susceptible: ${initialConditions.S0}
- Exposed: ${initialConditions.E0}
- Addicted: ${initialConditions.A0}
- Recovered: ${initialConditions.R0}
- Total: ${totalInitial}

Intervensi: ${hasIntervention ? 'Aktif' : 'Tidak Aktif'}

=== HASIL SIMULASI ===
R₀ (Basic Reproduction Number): ${currentR0.toFixed(3)}
Status Epidemi: ${currentR0 < 1 ? 'Terkendali (R₀ < 1)' : 'Tidak Terkendali (R₀ ≥ 1)'}

Kondisi Akhir (Bulan ${simulationData[simulationData.length - 1].time}):
- Susceptible: ${Math.round(lastPoint.S)} (${(lastPoint.S/totalFinal*100).toFixed(1)}%)
- Exposed: ${Math.round(lastPoint.E)} (${(lastPoint.E/totalFinal*100).toFixed(1)}%)
- Addicted: ${Math.round(lastPoint.A)} (${(lastPoint.A/totalFinal*100).toFixed(1)}%)
- Recovered: ${Math.round(lastPoint.R)} (${(lastPoint.R/totalFinal*100).toFixed(1)}%)
- Total: ${Math.round(totalFinal)}

Perubahan dari Kondisi Awal:
- Susceptible: ${Math.round(lastPoint.S - initialConditions.S0)} (${((lastPoint.S - initialConditions.S0)/initialConditions.S0*100).toFixed(1)}%)
- Exposed: ${Math.round(lastPoint.E - initialConditions.E0)} (${((lastPoint.E - initialConditions.E0)/initialConditions.E0*100).toFixed(1)}%)
- Addicted: ${Math.round(lastPoint.A - initialConditions.A0)} (${((lastPoint.A - initialConditions.A0)/initialConditions.A0*100).toFixed(1)}%)
- Recovered: ${Math.round(lastPoint.R - initialConditions.R0)} (${((lastPoint.R - initialConditions.R0)/initialConditions.R0*100).toFixed(1)}%)

=== INTERPRETASI ===
${currentR0 < 1 
  ? 'Model menunjukkan bahwa dengan parameter dan intervensi saat ini, kecanduan game online dapat dikendalikan. Populasi yang kecanduan cenderung menurun dari waktu ke waktu.'
  : 'Model menunjukkan bahwa kecanduan game online akan terus menyebar dengan parameter saat ini. Diperlukan intervensi yang lebih kuat atau perubahan parameter untuk mengendalikan penyebaran kecanduan.'
}

${hasIntervention 
  ? 'Intervensi aktif membantu meningkatkan laju pemulihan individu yang kecanduan.'
  : 'Tanpa intervensi, pemulihan hanya bergantung pada faktor alami, yang umumnya lebih lambat.'
}
`;

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sear-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const exportChartAsImage = async () => {
    setIsExporting(true);
    try {
      const chartElement = document.getElementById('simulation-chart');
      if (!chartElement) {
        alert('Chart tidak ditemukan');
        return;
      }

      const canvas = await html2canvas(chartElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      canvas.toBlob((blob: Blob | null) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `sear-chart-${new Date().toISOString().split('T')[0]}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    } catch (error) {
      console.error('Error exporting chart:', error);
      alert('Gagal mengexport chart sebagai gambar');
    } finally {
      setIsExporting(false);
    }
  };

  const exportOptions = [
    {
      id: 'config',
      title: 'Konfigurasi',
      description: 'Export pengaturan parameter (JSON)',
      icon: <DocumentTextIcon className="w-5 h-5" />,
      action: exportConfiguration,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'data',
      title: 'Data Simulasi',
      description: 'Export data hasil simulasi (CSV)',
      icon: <TableCellsIcon className="w-5 h-5" />,
      action: exportSimulationData,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'report',
      title: 'Laporan Lengkap',
      description: 'Export laporan analisis (TXT)',
      icon: <DocumentTextIcon className="w-5 h-5" />,
      action: exportReport,
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      id: 'chart',
      title: 'Chart Image',
      description: 'Export grafik sebagai gambar (PNG)',
      icon: <PhotoIcon className="w-5 h-5" />,
      action: exportChartAsImage,
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  if (simulationData.length === 0) return null;

  return (
    <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-200 dark:border-slate-600">
      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center">
        <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
        Export Hasil
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {exportOptions.map((option) => (
          <button
            key={option.id}
            onClick={option.action}
            disabled={isExporting}
            className={`${option.color} text-white text-xs font-medium py-2 px-3 rounded-md transition-colors duration-200 flex items-center justify-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed`}
            title={option.description}
          >
            {option.icon}
            <span className="hidden sm:inline">{option.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExportFeature;
