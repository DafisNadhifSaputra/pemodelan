
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { SeirParams, InitialConditions, SimulationDataPoint, AiInterpretationResponse } from '../types';

function getSimulationSummary(simulationData: SimulationDataPoint[], duration: number): string {
  if (!simulationData || simulationData.length === 0) {
    return "Data simulasi tidak tersedia.";
  }

  const finalState = simulationData[simulationData.length - 1];
  const peakInfected = simulationData.reduce((max, point) => point.I > max.I ? point : max, simulationData[0]);
  
  let summary = `Di akhir simulasi (${duration} bulan):\n`;
  summary += `- Susceptible (S): ${Math.round(finalState.S)}\n`;
  summary += `- Exposed (E): ${Math.round(finalState.E)}\n`;
  summary += `- Infected (I): ${Math.round(finalState.I)}\n`;
  summary += `- Recovered (R): ${Math.round(finalState.R)}\n`;
  summary += `Puncak individu terinfeksi/kecanduan (I) adalah ${Math.round(peakInfected.I)} pada bulan ke-${peakInfected.time}.\n`;

  return summary;
}

export async function getAiInterpretation(
  params: SeirParams,
  initialConditions: InitialConditions,
  simulationData: SimulationDataPoint[],
  r0: number,
  nInitial: number,
  hasIntervention: boolean,
  durationMonths: number,
  customPrompt?: string
): Promise<AiInterpretationResponse> {
  // API Key di-hardcode sesuai permintaan pengguna
  const apiKey = "AIzaSyBcVgXj2SdTzq8e-dV8gWZOGWr9sM3vqnw";

  if (!apiKey) {
    // Fallback ini seharusnya tidak pernah tercapai karena API Key di-hardcode
    return { 
      success: false, 
      error: "Kunci API Gemini tidak dikonfigurasi (internal)." 
    };
  }

  const ai = new GoogleGenerativeAI(apiKey);
  const modelName = 'gemini-1.5-flash';

  const simulationSummary = getSimulationSummary(simulationData, durationMonths);

  // Jika ada custom prompt (untuk chat), gunakan itu. Jika tidak, gunakan prompt default
  const prompt = customPrompt || `
Anda adalah seorang ahli epidemiologi dan analis data. Tugas Anda adalah memberikan interpretasi singkat (2-4 paragraf) dalam Bahasa Indonesia mengenai simulasi model SEIR untuk kecanduan game online.

Konteks:
Model ini menggambarkan penyebaran kecanduan game online di kalangan siswa, berdasarkan penelitian "Model SEIR Kecanduan Game Online pada Siswa di SMP Negeri 3 Makassar".

Data Simulasi Saat Ini:
1. Parameter Model:
   - Faktor Rekrutmen (μ1): ${params.mu1.toFixed(3)} (proporsi N_awal per bulan menjadi Susceptible baru)
   - Laju Keluar Alami (μ2): ${params.mu2.toFixed(3)} (proporsi per bulan keluar dari sistem)
   - Laju Paparan (α): ${params.alpha.toFixed(3)} (proporsi S menjadi E per bulan)
   - Laju Infeksi/Kecanduan (β): ${params.beta.toFixed(3)} (proporsi E menjadi I per bulan)
   - Laju Pemulihan Alami (γ): ${params.gamma.toFixed(3)} (proporsi I menjadi R per bulan tanpa intervensi)
   - Status Intervensi (Pengawasan & Konseling): ${hasIntervention ? 'Aktif' : 'Tidak Aktif'}
   - Faktor Pemulihan dengan Intervensi (θ): ${params.theta.toFixed(3)} (jika intervensi aktif, menambah laju pemulihan I menjadi R)

2. Kondisi Awal Populasi:
   - Susceptible (S0): ${initialConditions.S0}
   - Exposed (E0): ${initialConditions.E0}
   - Infected/Kecanduan (I0): ${initialConditions.I0}
   - Recovered/Pulih (R0): ${initialConditions.R0}
   - Total Populasi Awal (N_awal): ${nInitial}

3. Hasil Utama Simulasi (${durationMonths} bulan):
   - Bilangan Reproduksi Dasar (R₀): ${r0.toFixed(3)}
   - Ringkasan Tren Grafik:
     ${simulationSummary}

Instruksi Interpretasi:
Berikan analisis yang jelas dan ringkas dalam Bahasa Indonesia. Fokus pada:
- Makna dari nilai R₀ saat ini dalam konteks penyebaran kecanduan game online.
- Bagaimana kombinasi parameter saat ini (terutama α, β, γ, dan θ jika intervensi aktif) mempengaruhi bentuk kurva S, E, I, R dan hasil akhir simulasi seperti yang terlihat pada ringkasan tren.
- Kesimpulan utama yang bisa ditarik dari simulasi ini terkait potensi penyebaran atau pengendalian kecanduan game online pada populasi siswa ini dengan parameter yang diberikan.
- Jika intervensi (θ > 0) aktif, jelaskan secara spesifik bagaimana hal tersebut memengaruhi dinamika model dibandingkan jika tidak aktif.

Gunakan bahasa yang mudah dipahami namun tetap mempertahankan nuansa ilmiah. Hindari jargon teknis yang berlebihan tanpa penjelasan.
Format output sebagai teks biasa, paragraf per paragraf.
`;

  try {
    const model = ai.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (text) {
      return { success: true, interpretation: text };
    } else {
      return { success: false, error: "Tidak ada respons teks dari AI." };
    }
  } catch (error: any) {
    console.error("Gemini API error:", error);
    let errorMessage = "Gagal menghubungi layanan AI Gemini.";
    if (error.message) {
        errorMessage += ` Detail: ${error.message}`;
    }
    if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
        errorMessage = `Gemini API Error: ${error.response.data.error.message}`;
    } else if (error.status && error.statusText) {
        errorMessage += ` (Status: ${error.status} ${error.statusText})`;
    }
    return { success: false, error: errorMessage };
  }
}
