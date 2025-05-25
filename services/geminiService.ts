import { GoogleGenerativeAI } from "@google/generative-ai";
import html2canvas from 'html2canvas';
import type { SearParams, InitialConditions, SimulationDataPoint, AiInterpretationResponse } from '../types';
import { paperFullText, paperTitle, aiAnalysisInstructions, compartmentDiagram, graphicVisualization } from '../paperContent';

function getSimulationSummary(simulationData: SimulationDataPoint[], duration: number): string {
  if (!simulationData || simulationData.length === 0) {
    return "Data simulasi tidak tersedia.";
  }

  const finalState = simulationData[simulationData.length - 1];
  const peakAddicted = simulationData.reduce((max, point) => point.A > max.A ? point : max, simulationData[0]);
  
  let summary = `Di akhir simulasi (${duration} bulan):\n`;
  summary += `- Susceptible (S): ${Math.round(finalState.S)}\n`;
  summary += `- Exposed (E): ${Math.round(finalState.E)}\n`;
  summary += `- Addicted (A): ${Math.round(finalState.A)}\n`;
  summary += `- Recovered (R): ${Math.round(finalState.R)}\n`;
  summary += `Puncak individu kecanduan (A) adalah ${Math.round(peakAddicted.A)} pada bulan ke-${peakAddicted.time}.\n`;

  return summary;
}

// Function to capture chart as base64 image
async function captureChartAsImage(chartElementId: string = 'simulation-chart'): Promise<string | null> {
  try {
    const chartElement = document.getElementById(chartElementId);
    if (!chartElement) {
      console.error('Chart element not found');
      return null;
    }

    const canvas = await html2canvas(chartElement, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher quality
      allowTaint: true,
      useCORS: true,
      logging: false
    });

    return canvas.toDataURL('image/jpeg', 0.8);
  } catch (error) {
    console.error('Error capturing chart:', error);
    return null;
  }
}

// New function for AI chart analysis with vision
export async function getAiChartAnalysis(
  params: SearParams,
  initialConditions: InitialConditions,
  simulationData: SimulationDataPoint[],
  r0: number,
  nInitial: number,
  hasIntervention: boolean,
  durationMonths: number,
  chartElementId?: string,
  responseLength: 'singkat' | 'sedang' | 'panjang' = 'sedang'
): Promise<AiInterpretationResponse> {
  const apiKey = "AIzaSyBcVgXj2SdTzq8e-dV8gWZOGWr9sM3vqnw";

  if (!apiKey) {
    return { 
      success: false, 
      error: "Kunci API Gemini tidak dikonfigurasi." 
    };
  }

  try {
    // Capture chart as image
    const chartImage = await captureChartAsImage(chartElementId);
    
    if (!chartImage) {
      // Fallback to text-only analysis if chart capture fails
      return await getAiInterpretation(params, initialConditions, simulationData, r0, nInitial, hasIntervention, durationMonths, undefined, responseLength);
    }

    // Konfigurasi generasi berdasarkan panjang respon
    const getGenerationConfig = (length: 'singkat' | 'sedang' | 'panjang') => {
      switch (length) {
        case 'singkat':
          return {
            temperature: 0.1,
            maxOutputTokens: 4096,
            topP: 0.8,
            topK: 20
          };
        case 'sedang':
          return {
            temperature: 0.6,
            maxOutputTokens: 6096,
            topP: 0.9,
            topK: 40
          };
        case 'panjang':
          return {
            temperature: 0.7,
            maxOutputTokens: 12000,
            topP: 0.9,
            topK: 40
          };
        default:
          return {
            temperature: 0.6,
            maxOutputTokens: 6096,
            topP: 0.9,
            topK: 40
          };
      }
    };

    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({ 
      model: 'gemini-2.5-flash-preview-05-20', // Updated to latest Gemini 2.0 Flash
      generationConfig: getGenerationConfig(responseLength)
    });

    const simulationSummary = getSimulationSummary(simulationData, durationMonths);

    // Template prompt berdasarkan panjang respon
    const getChartPromptTemplate = (length: 'singkat' | 'sedang' | 'panjang') => {
      // Konteks jurnal lengkap untuk analisis grafik
      const chartJournalContext = `
KONTEKS JURNAL PENELITIAN LENGKAP - ${paperTitle}:

${paperFullText}

${compartmentDiagram}

${graphicVisualization}

RINGKASAN MATEMATIS KUNCI UNTUK ANALISIS GRAFIK:

1. SISTEM PERSAMAAN DIFERENSIAL:
   - dS/dt = Λ - (α + μ₂)S
   - dE/dt = αS - (β + μ₂)E  
   - dA/dt = βE - (γ + θ + μ₂)A
   - dR/dt = (γ + θ)A - μ₂R

2. PARAMETER EMPIRIS DARI PENELITIAN SMP NEGERI 3 MAKASSAR:
   - α = 0.438 (laju paparan game)
   - β = 0.102 (laju transisi ke kecanduan)
   - γ = 0.051 (laju pemulihan alami)
   - μ₁ = 0.409 (laju rekrutmen)
   - μ₂ = 0.097 (laju keluar alami)
   - θ = 1 (dengan intervensi) atau 0 (tanpa intervensi)

3. HASIL PENELITIAN EMPIRIS:
   - R₀ penelitian = 0.089 (< 1, tidak ada penularan)
   - Tanpa intervensi: 200 siswa kecanduan dalam 36 bulan
   - Dengan intervensi: hanya 26 siswa kecanduan dalam 36 bulan
   - Populasi awal penelitian: 176 siswa (S₀=72, E₀=77, A₀=18, R₀=9)

4. ASUMSI MODEL DARI PENELITIAN:
   - Model berlaku untuk siswa SMP dengan akses game online
   - Intervensi meliputi pengawasan orang tua dan bimbingan konseling
   - Efektivitas intervensi terbukti sangat signifikan
`;

      const baseInfo = `
**Data Konteks Simulasi Saat Ini:**
- Parameter $\\alpha$ (paparan): ${params.alpha.toFixed(3)}
- Parameter $\\beta$ (kecanduan): ${params.beta.toFixed(3)}
- Parameter $\\gamma$ (pemulihan alami): ${params.gamma.toFixed(3)}
- Parameter $\\mu_1$ (rekrutmen): ${params.mu1.toFixed(3)}
- Parameter $\\mu_2$ (keluar alami): ${params.mu2.toFixed(3)}
- Intervensi $\\theta$: ${hasIntervention ? 'Aktif ($\\theta = 1$)' : 'Tidak Aktif ($\\theta = 0$)'}
- $R_0$: ${r0.toFixed(3)}
- Durasi: ${durationMonths} bulan
- Populasi awal: ${nInitial}

${simulationSummary}
`;

      switch (length) {
        case 'singkat':
          return `
ANALISIS RINGKAS GRAFIK MODEL SEAR KECANDUAN GAME ONLINE

${chartJournalContext}

Anda adalah seorang ahli epidemiologi. Berikan analisis SINGKAT dan PADAT dari grafik simulasi dalam Bahasa Indonesia.

${baseInfo}

**INSTRUKSI SINGKAT:**
Analisis grafik secara ringkas dengan 3 section utama menggunakan format Markdown dan LaTeX:

## 1. Pola Visual Kurva
Deskripsikan tren utama setiap kurva S(t), E(t), A(t), R(t) secara singkat.

## 2. Titik Kritis
Identifikasi waktu puncak kecanduan A(t) dan dinamika utama.

## 3. Interpretasi & Rekomendasi
Analisis $R_0$ dan saran strategis berdasarkan pola grafik.

**FORMAT:** Maksimal 400 kata, gunakan $LaTeX$ untuk matematika.
`;

        case 'sedang':
          return `
ANALISIS GRAFIK MODEL SEAR KECANDUAN GAME ONLINE

${chartJournalContext}

Anda adalah seorang ahli epidemiologi matematika. Analisis grafik simulasi dengan fokus pada HASIL NUMERIK dan ALASAN MATEMATIS mengapa kurva berperilaku seperti yang terlihat.

${baseInfo}

**INSTRUKSI ANALISIS GRAFIK:**

## 1. Analisis Kurva Berdasarkan Data Simulasi

### 1.1 Kurva Addicted A(t) [Merah] - UTAMA
- **Pola:** Apakah A(t) naik monoton, ada puncak, atau turun dari simulasi?
- **Nilai Kunci:** Berapa A(0), A(puncak), A(36 bulan)?
- **Alasan:** Mengapa pola ini terjadi? Analisis $\\frac{dA}{dt} = \\beta E(t) - (\\gamma + \\theta + \\mu_2)A(t)$

### 1.2 Kurva Susceptible S(t) [Biru]
- **Tren:** Naik/turun/stabil dari ${initialConditions.S0}?
- **Mekanisme:** Balance $\\mu_1 N$ (rekrutmen) vs $(\\alpha + \\mu_2)S$ (outflow)

### 1.3 Kurva Exposed E(t) [Kuning] 
- **Bentuk:** Linear, sigmoid, atau eksponensial?
- **Dinamika:** $\\alpha S(t)$ (inflow) vs $(\\beta + \\mu_2)E(t)$ (outflow)

### 1.4 Kurva Recovered R(t) [Hijau]
- **Pertumbuhan:** Linear atau eksponensial?
- **Efek Intervensi:** ${hasIntervention ? 'Dampak $(\\gamma + \\theta)A(t)$ vs $\\gamma A(t)$' : 'Hanya $\\gamma A(t)$ - pemulihan alami'}

## 2. Titik Kritis dan Transisi

### 2.1 Puncak Kecanduan
- **Kapan:** Bulan berapa A(t) mencapai maksimum?
- **Mengapa:** Kapan $\\beta E(t) = (\\gamma + \\theta + \\mu_2)A(t)$?
- **Dampak:** Berapa persen populasi terkena kecanduan maksimal?

### 2.2 Crossover Points
- Kapan R(t) > A(t) (recovery dominan)?
- Kapan S(t) = E(t) (equilibrium paparan)?

## 3. Dinamika Model dan R₀

### 3.1 Interpretasi R₀ = ${r0.toFixed(3)}
- **Makna:** ${r0 > 1 ? 'Kecanduan menyebar (>1)' : 'Kecanduan berkurang (<1)'}
- **Validasi:** Apakah pola grafik A(t) sesuai prediksi R₀?

### 3.2 Alur Transisi
- **S→E:** Laju $\\alpha S$ - seberapa cepat paparan?
- **E→A:** Laju $\\beta E$ - seberapa cepat jadi kecanduan?  
- **A→R:** Laju $(\\gamma + \\theta) A$ - seberapa efektif pemulihan?

## 4. Interpretasi Hasil dan Implikasi

### 4.1 Efektivitas Intervensi (dari Grafik)
${hasIntervention ? 
'- **Dengan θ=1:** Bagaimana kurva A(t) dan R(t) berbeda?\\n- **Akselerasi:** Seberapa cepat intervensi mempercepat pemulihan?' : 
'- **Tanpa θ:** Bagaimana A(t) berkembang tanpa intervensi?\\n- **Konsekuensi:** Apa dampak jangka panjang tanpa treatment?'}

### 4.2 Rekomendasi Berdasarkan Grafik
- **Target Intervensi:** Parameter mana yang paling berpengaruh pada bentuk kurva?
- **Timing:** Kapan waktu optimal memulai intervensi berdasarkan pola kurva?
- **Monitoring:** Indikator kurva mana yang harus dipantau ketat?

**FOKUS:** Jelaskan APA yang terlihat di grafik secara numerik dan MENGAPA secara matematis. Hindari teori umum, fokus pada hasil simulasi spesifik ini.
`;

        case 'panjang':
          return `
ANALISIS MENDALAM GRAFIK MODEL SEAR KECANDUAN GAME ONLINE

${chartJournalContext}

Anda adalah seorang ahli epidemiologi matematika. Berikan analisis MENDALAM dan FOKUS pada hasil simulasi dalam grafik. JANGAN BERTELE-TELE. Fokus pada ALASAN MATEMATIS dan FISIK mengapa kurva berperilaku seperti yang terlihat.

${baseInfo}

**INSTRUKSI ANALISIS GRAFIK MENDALAM:**

## 1. ANALISIS KURVA BERDASARKAN HASIL SIMULASI AKTUAL

### 1.1 Kurva Addicted A(t) [MERAH] - ANALISIS UTAMA
**WAJIB ANALISIS DETAIL:**
- Berapa nilai puncak A(t) dan kapan terjadi?
- Mengapa puncak terjadi di waktu tersebut? Jelaskan dengan $\\frac{dA}{dt} = \\beta E(t) - (\\gamma + \\theta + \\mu_2)A(t)$
- Kapan $\\frac{dA}{dt} = 0$ dan mengapa?
- Bagaimana bentuk kurva setelah puncak? Eksponensial decay atau linear?
- Berapa nilai A(36 bulan) dan bandingkan dengan A(0)?

### 1.2 Kurva Susceptible S(t) [BIRU]
**ANALISIS BERDASARKAN DATA:**
- Apakah S(t) naik atau turun dari bulan 0-36?
- Berapa persen penurunan/kenaikan total?
- Mengapa tren ini terjadi? Analisis $\\frac{dS}{dt} = \\mu_1 N - (\\alpha + \\mu_2)S(t)$
- Kapan S(t) mencapai equilibrium (jika ada)?

### 1.3 Kurva Exposed E(t) [KUNING]
**FOKUS PADA PERILAKU AKTUAL:**
- Bentuk kurva: naik monoton, sigmoid, atau ada puncak?
- Berapa nilai maksimum E(t) dan kapan tercapai?
- Mengapa E(t) berperilaku demikian? Analisis balance $\\alpha S(t)$ vs $(\\beta + \\mu_2)E(t)$

### 1.4 Kurva Recovered R(t) [HIJAU]
**ANALISIS PERTUMBUHAN:**
- Apakah R(t) tumbuh linear atau eksponensial?
- Berapa laju pertumbuhan R(t) di akhir simulasi?
- Mengapa laju ini terjadi? Hubungkan dengan $(\\gamma + \\theta)A(t)$

## 2. PERBANDINGAN DENGAN/TANPA INTERVENSI

**JIKA ADA DATA KEDUA SKENARIO:**
- Berapa perbedaan A(36) antara θ=0 vs θ=1?
- Berapa bulan lebih cepat puncak A(t) dengan intervensi?
- Bagaimana bentuk kurva R(t) berbeda antara kedua skenario?
- Kapan crossover point R(t) > A(t) pada masing-masing skenario?

## 3. ALASAN MATEMATIS DETAIL

### 3.1 Mengapa Puncak A(t) Terjadi?
- Jelaskan mengapa $\\beta E(t)$ awalnya > $(\\gamma + \\theta + \\mu_2)A(t)$
- Kapan dan mengapa kondisi berbalik menjadi $\\beta E(t)$ < $(\\gamma + \\theta + \\mu_2)A(t)$?
- Peran E(t) dalam menentukan timing puncak A(t)

### 3.2 Dinamika Sistem Post-Peak
- Mengapa A(t) turun eksponensial setelah puncak?
- Bagaimana feedback mechanism antara A(t) → R(t) → pengurangan pool S(t)?
- Stabilitas jangka panjang: menuju equilibrium atau oscillation?

### 3.3 Efek Intervensi θ=1
- Mengapa intervensi tidak langsung menurunkan A(t)?
- Lag effect: berapa bulan sebelum dampak terlihat signifikan?
- Mekanisme accelerated recovery: mengapa $(\\gamma + \\theta)$ lebih efektif daripada γ saja?

## 4. IMPLIKASI DARI HASIL NUMERIK SPESIFIK

### 4.1 Beban Kecanduan (Disease Burden)
- Hitung area under curve A(t) untuk total person-months kecanduan
- Berapa persen populasi yang pernah mengalami kecanduan?
- Peak prevalence vs cumulative incidence

### 4.2 Efektivitas Intervensi
- Reduction ratio: A_max(θ=0) / A_max(θ=1)
- Time to control: kapan A(t) < threshold tertentu?
- Recovery acceleration factor dari kurva R(t)

## 5. PREDIKSI JANGKA PANJANG

### 5.1 Asimptotik Behavior
- Menuju steady state mana: Disease-free atau Endemic?
- Berapa A(∞), E(∞), S(∞), R(∞)?
- Time to equilibrium berdasarkan tren kurva

### 5.2 Sensitivity Analysis
- Parameter mana yang paling berpengaruh pada bentuk kurva?
- Critical threshold untuk θ agar A(t) turun monoton

**FOKUS UTAMA:** Jelaskan SECARA SPESIFIK apa yang terjadi di grafik, MENGAPA terjadi secara matematis, dan APA IMPLIKASINYA. Jangan bertele-tele dengan teori umum - analisis DATA SIMULASI yang TERLIHAT di grafik!
`;

        default:
          return getChartPromptTemplate('sedang');
      }
    };

    const prompt = getChartPromptTemplate(responseLength);

    // Convert base64 to the format Gemini expects
    const base64Data = chartImage.split(',')[1];
    
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: 'image/jpeg'
        }
      }
    ]);

    const response = await result.response;
    
    console.log('Gemini Vision response object:', response);
    
    // Additional validation for response structure  
    if (!response) {
      throw new Error('Vision response object is null or undefined');
    }
    
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error('No candidates in vision response');
    }
    
    const candidate = response.candidates[0];
    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      throw new Error('No content parts in vision candidate');
    }
    
    // Check for safety filter blocks in vision response
    if (candidate.finishReason === 'SAFETY') {
      throw new Error('Vision content was blocked by safety filters');
    }
    
    if (candidate.finishReason === 'RECITATION') {
      throw new Error('Vision content was blocked due to recitation policy');
    }
    
    let text = '';
    try {
      text = response.text();
      console.log('Successfully extracted vision text using response.text()');
    } catch (textError) {
      console.error('Error getting text from vision response:', textError);
      // Try alternative method to get text
      if (response.candidates && response.candidates.length > 0 && response.candidates[0].content) {
        const parts = response.candidates[0].content.parts;
        if (parts && parts.length > 0 && parts[0].text) {
          text = parts[0].text;
          console.log('Successfully extracted vision text using alternative method');
        }
      }
    }
    
    console.log('Extracted vision text:', text);
    
    if (text && text.trim().length > 0) {
      return { success: true, interpretation: text };
    } else {
      console.error('No text content in vision response:', response);
      return { success: false, error: "Tidak ada respons teks dari AI Vision. Response kosong atau tidak valid." };
    }
  } catch (error: any) {
    console.error("Gemini Vision API error:", error);
    let errorMessage = "Gagal menghubungi layanan AI Gemini Vision.";
    
    // Check for safety filter blocks
    if (error.message && error.message.includes('SAFETY')) {
      return { 
        success: false, 
        error: "Konten diblokir oleh filter keamanan AI Vision. Coba dengan parameter yang berbeda." 
      };
    }
    
    // Check for rate limit/quota errors
    if (error.status === 429) {
      return { 
        success: false, 
        error: "Batas kuota API Gemini Vision telah tercapai. Silakan coba lagi nanti." 
      };
    }
    
    // Model not found errors
    if (error.status === 404) {
      return { 
        success: false, 
        error: "Model AI Vision tidak ditemukan atau tidak tersedia." 
      };
    }
    
    // API Key errors
    if (error.status === 400 && error.message && error.message.includes("API_KEY")) {
      return { 
        success: false, 
        error: "API Key tidak valid atau tidak memiliki akses ke model Vision." 
      };
    }
    
    if (error.message) {
        errorMessage += ` Detail: ${error.message}`;
    }
    return { success: false, error: errorMessage };
  }
}

export async function getAiInterpretation(
  params: SearParams,
  initialConditions: InitialConditions,
  simulationData: SimulationDataPoint[],
  r0: number,
  nInitial: number,
  hasIntervention: boolean,
  durationMonths: number,
  customPrompt?: string,
  responseLength: 'singkat' | 'sedang' | 'panjang' = 'sedang'
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
  const modelName = 'gemini-2.5-flash-preview-05-20'; // Updated to latest Gemini 2.0 Flash

  const simulationSummary = getSimulationSummary(simulationData, durationMonths);

  // Konteks jurnal lengkap untuk AI
  const journalContext = `
KONTEKS JURNAL PENELITIAN LENGKAP - ${paperTitle}:

${paperFullText}

RINGKASAN MATEMATIS KUNCI:

1. DEFINISI MODEL SEAR:
   - S (Susceptible): Individu rentan yang belum terpapar game online
   - E (Exposed): Individu yang telah mencoba game online namun belum kecanduan
   - A (Addicted): Individu yang mengalami kecanduan game online dengan gejala merugikan
   - R (Recovered): Individu yang telah pulih dan memiliki resistensi

2. SISTEM PERSAMAAN DIFERENSIAL:
   - dS/dt = Λ - (α + μ₂)S
   - dE/dt = αS - (β + μ₂)E  
   - dA/dt = βE - (γ + θ + μ₂)A
   - dR/dt = (γ + θ)A - μ₂R
   Dimana Λ = μ₁ × N (laju rekrutmen baru)

3. PARAMETER KUNCI DARI PENELITIAN:
   - α: Laju transisi S→E (paparan game) = 0.438
   - β: Laju transisi E→A (menjadi kecanduan) = 0.102
   - γ: Laju pemulihan alami A→R = 0.051
   - θ: Efektivitas intervensi (0=tanpa, 1=dengan intervensi)
   - μ₁: Laju rekrutmen populasi baru = 0.409
   - μ₂: Laju keluar alami = 0.097

4. BASIC REPRODUCTION NUMBER DARI PENELITIAN:
   R₀ = β/(γ + θ + μ₂) = 0.089 (< 1, menunjukkan tidak ada penularan)
   - R₀ > 1: Kecanduan menyebar dan menjadi endemik
   - R₀ < 1: Kecanduan menghilang secara alami

5. HASIL PENELITIAN EMPIRIS:
   - Tanpa intervensi: Kecanduan mencapai 200 siswa dalam 36 bulan
   - Dengan intervensi: Kecanduan turun menjadi 26 siswa dalam 36 bulan
   - Efektivitas intervensi sangat signifikan dalam mengurangi beban kecanduan

6. TITIK KESEIMBANGAN:
   - E₀ (bebas kecanduan): Stabil dengan eigenvalue negatif
   - E_ε (dengan kecanduan): Juga stabil dalam kondisi tertentu

7. IMPLIKASI PRAKTIS BERDASARKAN PENELITIAN:
   - Pengawasan orang tua sangat efektif
   - Program bimbingan konseling menurunkan kecanduan secara signifikan
   - Seminar edukasi dampak game online diperlukan
   - Model dapat digunakan untuk perencanaan kebijakan sekolah
`;

  // Konfigurasi generasi berdasarkan panjang respon
  const getGenerationConfig = (length: 'singkat' | 'sedang' | 'panjang') => {
    switch (length) {
      case 'singkat':
        return {
          temperature: 0.2,
          maxOutputTokens: 4096,
          topP: 0.8,
          topK: 20
        };
      case 'sedang':
        return {
          temperature: 0.3,
          maxOutputTokens: 6096,
          topP: 0.8,
          topK: 30
        };
      case 'panjang':
        return {
          temperature: 0.5,
          maxOutputTokens: 12000,
          topP: 0.9,
          topK: 40
        };
      default:
        return {
          temperature: 0.3,
          maxOutputTokens: 6096,
          topP: 0.8,
          topK: 30
        };
    }
  };

  // Template prompt berdasarkan panjang respon
  const getPromptTemplate = (length: 'singkat' | 'sedang' | 'panjang') => {
    const baseInfo = `
**1. Parameter Model:**
- Laju Paparan ($\\alpha$): ${params.alpha.toFixed(3)}
- Laju Kecanduan ($\\beta$): ${params.beta.toFixed(3)}
- Laju Pemulihan Alami ($\\gamma$): ${params.gamma.toFixed(3)}
- Status Intervensi: ${hasIntervention ? 'Aktif ($\\theta = 1$)' : 'Tidak Aktif ($\\theta = 0$)'}

**2. Kondisi Awal:**
- Susceptible ($S_0$): ${initialConditions.S0}
- Exposed ($E_0$): ${initialConditions.E0}
- Addicted ($A_0$): ${initialConditions.A0}
- Recovered ($R_0$): ${initialConditions.R0}
- Total Populasi Awal: ${nInitial}

**3. Hasil Simulasi (${durationMonths} bulan):**
- Basic Reproduction Number ($R_0$): ${r0.toFixed(3)}
${simulationSummary}
`;

    switch (length) {
      case 'singkat':
        return `${journalContext}

${baseInfo}

**INSTRUKSI:**
Berikan analisis singkat dan padat (maksimal 3 section) dalam format Markdown dengan LaTeX:

## Interpretasi $R_0$ dan Dinamika
Analisis nilai $R_0 = \\frac{\\beta}{\\gamma + \\theta + \\mu_2}$ dan dinamika utama.

## Dampak Intervensi
${hasIntervention ? 'Efektivitas intervensi dalam mengurangi kecanduan.' : 'Dampak tidak adanya intervensi.'}

## Rekomendasi Utama
Saran strategis berdasarkan hasil simulasi.

**FORMAT:** Gunakan **bold**, *italic*, dan $LaTeX$ untuk matematika. Maksimal 500 kata.
`;

      case 'sedang':
        return `${journalContext}

${baseInfo}

**INSTRUKSI ANALISIS SIMULASI:**
Berikan analisis FOKUS pada hasil simulasi menggunakan format Markdown yang jelas. Jelaskan apa yang terjadi dalam simulasi dan mengapa.

## 1. Hasil Simulasi Model SEAR

### 1.1 Perjalanan Kecanduan A(t)
- **Nilai Awal vs Akhir:** A(0) = ${initialConditions.A0} → A(36 bulan) = ?
- **Pola Kurva:** Apakah A(t) naik monoton, mencapai puncak, atau turun?
- **Alasan Matematis:** Mengapa pola ini terjadi berdasarkan $\\frac{dA}{dt} = \\beta E(t) - (\\gamma + \\theta + \\mu_2)A(t)$?

### 1.2 Dinamika Populasi Susceptible S(t)
- **Tren:** Bagaimana S(t) berubah dari ${initialConditions.S0} selama 36 bulan?
- **Mekanisme:** Balance antara rekrutmen $\\mu_1 N$ dan outflow $(\\alpha + \\mu_2)S$

### 1.3 Transisi E(t) dan Pemulihan R(t)
- **Exposed:** Bagaimana E(t) berkembang dari ${initialConditions.E0}?
- **Recovery:** Laju pemulihan R(t) dari ${initialConditions.R0}
- **Efek Intervensi:** ${hasIntervention ? 'Dampak θ=1 pada akselerasi pemulihan' : 'Pemulihan hanya mengandalkan γ alami'}

## 2. Analisis Basic Reproduction Number

### 2.1 Interpretasi R₀ = ${r0.toFixed(3)}
- **Makna:** $R_0 = \\frac{\\beta}{\\gamma + \\theta + \\mu_2} = \\frac{${params.beta.toFixed(3)}}{${(params.gamma + (hasIntervention ? 1 : 0) + params.mu2).toFixed(3)}} = ${r0.toFixed(3)}$
- **Implikasi:** ${r0 > 1 ? 'Kecanduan akan menyebar (R₀ > 1)' : 'Kecanduan akan berkurang (R₀ < 1)'}
- **Validasi:** Apakah hasil simulasi konsisten dengan prediksi R₀?

## 3. Dampak Parameter dan Intervensi

### 3.1 Evaluasi Parameter
- **α (paparan):** ${params.alpha.toFixed(3)} vs penelitian 0.438 - dampak pada laju S→E
- **β (kecanduan):** ${params.beta.toFixed(3)} vs penelitian 0.102 - dampak pada laju E→A  
- **γ (pemulihan):** ${params.gamma.toFixed(3)} vs penelitian 0.051 - dampak pada A→R

### 3.2 Efektivitas Intervensi
**${hasIntervention ? 'DENGAN INTERVENSI:' : 'TANPA INTERVENSI:'}**
- ${hasIntervention ? 'θ=1 meningkatkan recovery rate dari γ menjadi (γ+θ)' : 'Hanya mengandalkan recovery rate γ alami'}
- **Perbandingan:** Penelitian menunjukkan pengurangan dari 200 → 26 kecanduan dalam 36 bulan
- **Hasil Simulasi:** Bagaimana prediksi simulasi anda dibandingkan penelitian?

## 4. Dinamika Transisi S→E→A→R

### 4.1 Alur Transisi
- **S→E:** Laju $\\alpha S$ - seberapa cepat paparan game online?
- **E→A:** Laju $\\beta E$ - seberapa cepat berkembang menjadi kecanduan?
- **A→R:** Laju $(\\gamma + \\theta) A$ - seberapa efektif pemulihan?

### 4.2 Bottleneck Analysis
- Mana tahap yang menjadi bottleneck dalam proses kecanduan?
- Parameter mana yang paling berpengaruh pada hasil akhir?

## 5. Prediksi dan Rekomendasi

### 5.1 Proyeksi Jangka Panjang
- **Equilibrium:** Menuju bebas kecanduan atau endemik?
- **Time Scale:** Berapa lama untuk mencapai keseimbangan?

### 5.2 Strategi Intervensi
- **Pencegahan:** Fokus menurunkan α (paparan) atau β (transisi ke kecanduan)?
- **Treatment:** Meningkatkan γ (pemulihan alami) atau θ (intervensi)?
- **Timing:** Kapan waktu optimal memulai intervensi?

**FOKUS:** Analisis hasil simulasi spesifik anda dengan explanation matematis yang jelas. Gunakan data numerik aktual dari simulasi untuk mendukung analisis.
`;

      case 'panjang':
        return `${journalContext}

${baseInfo}

**INSTRUKSI ANALISIS MENDALAM HASIL SIMULASI:**

Berikan analisis FOKUS pada hasil simulasi yang spesifik. JANGAN BERTELE-TELE dengan teori umum. Analisis APA yang terjadi di simulasi ini dan MENGAPA secara matematis dan fisik.

## 1. ANALISIS HASIL SIMULASI SPESIFIK

### 1.1 Perjalanan Kecanduan A(t)
**BERDASARKAN HASIL SIMULASI:**
- Nilai awal A(0) = ${initialConditions.A0}, berapa A(36 bulan)?
- Apakah A(t) naik monoton, ada puncak, atau turun?
- Jika ada puncak: kapan terjadi dan berapa nilai maksimumnya?
- **ALASAN MATEMATIS:** Mengapa pola ini terjadi? Analisis $\\frac{dA}{dt} = \\beta E(t) - (\\gamma + \\theta + \\mu_2)A(t)$

### 1.2 Dinamika Susceptible S(t)
**ANALISIS NUMERIK:**
- S(0) = ${initialConditions.S0}, bagaimana tren S(t) selama 36 bulan?
- Berapa persen populasi yang masih susceptible di akhir simulasi?
- **PENJELASAN FISIK:** Mengapa S(t) berperilaku demikian? Kompetisi antara $\\mu_1 N$ (rekrutmen) vs $(\\alpha + \\mu_2)S$ (keluar dari S)

### 1.3 Proses Exposed → Addicted
**DETAIL TRANSISI:**
- E(0) = ${initialConditions.E0}, bagaimana E(t) berkembang?
- Berapa lama rata-rata seseorang di kompartemen E sebelum menjadi A?
- **MEKANISME:** Mengapa tidak semua E langsung menjadi A? Peran $\\beta$ dan $\\mu_2$

### 1.4 Pemulihan R(t)
**ANALISIS RECOVERY:**
- R(0) = ${initialConditions.R0}, berapa total yang pulih di bulan 36?
- Apakah laju pemulihan meningkat seiring waktu atau konstan?
- **EFEK INTERVENSI:** ${hasIntervention ? 'Bagaimana θ=1 mempercepat R(t)? Jelaskan $(\\gamma + \\theta)A(t)$ vs $\\gamma A(t)$' : 'Tanpa intervensi, mengapa R(t) tumbuh lambat? Analisis $\\gamma A(t)$ saja'}

## 2. BASIC REPRODUCTION NUMBER R₀ = ${r0.toFixed(3)}

### 2.1 Interpretasi Nilai R₀
**MAKNA EPIDEMIOLOGI:**
- R₀ = ${r0.toFixed(3)} ${r0 > 1 ? '> 1: Kecanduan akan menyebar dan menjadi endemik' : '< 1: Kecanduan akan berkurang dan hilang secara alami'}
- **PERHITUNGAN:** $R_0 = \\frac{\\beta}{\\gamma + \\theta + \\mu_2} = \\frac{${params.beta.toFixed(3)}}{${params.gamma.toFixed(3)} + ${hasIntervention ? '1' : '0'} + ${params.mu2.toFixed(3)}} = ${r0.toFixed(3)}$

### 2.2 Konsekuensi R₀ pada Hasil Simulasi
**VALIDASI DENGAN SIMULASI:**
- Apakah hasil simulasi A(t) konsisten dengan prediksi R₀?
- ${r0 > 1 ? 'Mengapa kecanduan terus meningkat meski ada pemulihan?' : 'Mengapa kecanduan berkurang meski ada paparan baru?'}
- Waktu untuk mencapai keseimbangan berdasarkan R₀

## 3. EFEK PARAMETER PADA HASIL AKTUAL

### 3.1 Sensitivitas Parameter
**DAMPAK PADA SIMULASI:**
- $\\alpha$ = ${params.alpha.toFixed(3)}: Seberapa cepat S → E? Bandingkan dengan nilai penelitian 0.438
- $\\beta$ = ${params.beta.toFixed(3)}: Seberapa cepat E → A? Bandingkan dengan nilai penelitian 0.102  
- $\\gamma$ = ${params.gamma.toFixed(3)}: Laju pemulihan alami, bandingkan dengan 0.051

### 3.2 Validasi dengan Data Empiris
**PERBANDINGAN KUANTITATIF:**
- Penelitian: tanpa intervensi → 200 kecanduan dalam 36 bulan
- Penelitian: dengan intervensi → 26 kecanduan dalam 36 bulan  
- **SIMULASI ANDA:** Berapa prediksi kecanduan pada bulan 36?
- Apakah tren simulasi sesuai dengan temuan penelitian?

## 4. ANALISIS INTERVENSI θ

### 4.1 Mekanisme Kerja Intervensi
**${hasIntervention ? 'DENGAN INTERVENSI (θ=1)' : 'TANPA INTERVENSI (θ=0)'}:**
- ${hasIntervention ? 'Bagaimana θ=1 mengubah persamaan $\\frac{dA}{dt}$? Efek pada laju pemulihan $(\\gamma + 1)A$' : 'Tanpa intervensi, hanya mengandalkan γA untuk pemulihan alami'}
- **DAMPAK NUMERIK:** ${hasIntervention ? 'Recovery rate meningkat dari γ=0.051 menjadi (γ+θ)=1.051' : 'Recovery rate tetap rendah di γ=0.051'}

### 4.2 Timing dan Efektivitas
**ANALISIS TEMPORAL:**
- ${hasIntervention ? 'Berapa bulan setelah implementasi baru terlihat dampak signifikan?' : 'Tanpa intervensi, kapan A(t) mencapai plateau atau terus naik?'}
- **COST-EFFECTIVENESS:** Berapa person-months kecanduan yang dicegah?

## 5. PREDIKSI JANGKA PANJANG

### 5.1 Equilibrium Analysis
**STEADY STATE:**
- Menuju keseimbangan bebas kecanduan (A*=0) atau endemik (A*>0)?
- Berapa proporsi akhir: S*, E*, A*, R*?
- **TIME TO EQUILIBRIUM:** Berapa tahun untuk mencapai 95% nilai equilibrium?

### 5.2 Scenario Planning
**IMPLIKASI KEBIJAKAN:**
- Apa yang terjadi jika intervensi dihentikan di bulan 24?
- Berapa minimal θ yang diperlukan untuk R₀ < 1?
- **THRESHOLD ANALYSIS:** Critical point untuk kontrol kecanduan

## 6. REKOMENDASI BERDASARKAN HASIL SIMULASI

### 6.1 Strategi Berbasis Evidence
**BERDASARKAN HASIL NUMERIK:**
- Parameter mana yang paling efektif untuk diintervensi?
- Timing optimal untuk memulai program pencegahan
- **RESOURCE ALLOCATION:** Fokus pada pencegahan (↓α) atau treatment (↑γ,θ)?

### 6.2 Monitoring Key Indicators
**EARLY WARNING SYSTEM:**
- Indikator mana yang perlu dipantau ketat?
- Threshold values untuk trigger intervention
- **ADAPTIVE STRATEGY:** Kapan intensitas intervensi bisa dikurangi?

**FOKUS UTAMA:** Analisis mendalam HASIL SIMULASI SPESIFIK anda, bukan teori umum. Jelaskan APA yang terjadi secara numerik dan MENGAPA secara matematis/fisik. Berikan insight praktis berdasarkan data simulasi aktual.
`;

      default:
        return getPromptTemplate('sedang');
    }
  };

  // Jika ada custom prompt (untuk chat), gunakan itu. Jika tidak, gunakan prompt berdasarkan panjang respon
  const prompt = customPrompt || getPromptTemplate(responseLength);

  try {
    const generationConfig = getGenerationConfig(responseLength);
    const model = ai.getGenerativeModel({ 
      model: modelName,
      generationConfig
    });
    
    let result;
    let response;
    let text = '';
    
    try {
      result = await model.generateContent(prompt);
      response = await result.response;
      
      console.log('Gemini response object:', response);
      
      // Additional validation for response structure
      if (!response) {
        throw new Error('Response object is null or undefined');
      }
      
      if (!response.candidates || response.candidates.length === 0) {
        throw new Error('No candidates in response');
      }
      
      const candidate = response.candidates[0];
      if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
        throw new Error('No content parts in candidate');
      }
      
      // Check for safety filter blocks
      if (candidate.finishReason === 'SAFETY') {
        throw new Error('Content was blocked by safety filters');
      }
      
      if (candidate.finishReason === 'RECITATION') {
        throw new Error('Content was blocked due to recitation policy');
      }
      
      try {
        text = response.text();
        console.log('Successfully extracted text using response.text()');
      } catch (textError) {
        console.error('Error getting text from response:', textError);
        // Try alternative method to get text
        if (response.candidates && response.candidates.length > 0 && response.candidates[0].content) {
          const parts = response.candidates[0].content.parts;
          if (parts && parts.length > 0 && parts[0].text) {
            text = parts[0].text;
            console.log('Successfully extracted text using alternative method');
          }
        }
      }
    } catch (primaryError: any) {
      console.warn('Primary model failed, trying fallback models:', primaryError);
      
      // Try fallback models
      const modelsToTry = ['gemini-2.5-flash-preview-05-20'];
      
      for (const fallbackModelName of modelsToTry) {
        try {
          console.log(`Trying fallback model: ${fallbackModelName}`);
          const fallbackModel = ai.getGenerativeModel({ 
            model: fallbackModelName,
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 2048,
              topP: 0.8,
              topK: 30
            }
          });
          
          result = await fallbackModel.generateContent(prompt);
          response = await result.response;
          
          try {
            text = response.text();
          } catch (textError) {
            if (response.candidates && response.candidates.length > 0 && response.candidates[0].content) {
              const parts = response.candidates[0].content.parts;
              if (parts && parts.length > 0 && parts[0].text) {
                text = parts[0].text;
              }
            }
          }
          
          if (text && text.trim().length > 0) {
            console.log(`Successfully got response from fallback model: ${fallbackModelName}`);
            break;
          }
        } catch (fallbackError) {
          console.error(`Fallback model ${fallbackModelName} failed:`, fallbackError);
          continue;
        }
      }
      
      if (!text || text.trim().length === 0) {
        throw primaryError; // Throw original error if all fallbacks fail
      }
    }
    
    console.log('Extracted text:', text);
    
    if (text && text.trim().length > 0) {
      return { success: true, interpretation: text };
    } else {
      console.error('No text content in response:', response);
      return { success: false, error: "Tidak ada respons teks dari AI. Response kosong atau tidak valid." };
    }
  } catch (error: any) {
    console.error("Gemini API error:", error);
    let errorMessage = "Gagal menghubungi layanan AI Gemini.";
    
    // Check for safety filter blocks
    if (error.message && error.message.includes('SAFETY')) {
      return { 
        success: false, 
        error: "Konten diblokir oleh filter keamanan AI. Coba dengan parameter yang berbeda." 
      };
    }
    
    // Check for rate limit/quota errors specifically
    if (error.status === 429) {
      return { 
        success: false, 
        error: "Batas kuota API Gemini telah tercapai. Silakan coba lagi nanti (error: 429 Too Many Requests)." 
      };
    }
    
    // Model not found errors
    if (error.status === 404 && error.message && error.message.includes("models")) {
      return { 
        success: false, 
        error: "Model AI tidak ditemukan. Mungkin nama model telah berubah atau tidak tersedia (error: 404)." 
      };
    }
    
    // API Key errors
    if (error.status === 400 && error.message && error.message.includes("API_KEY")) {
      return { 
        success: false, 
        error: "API Key tidak valid atau tidak memiliki akses ke model yang diminta." 
      };
    }
    
    // General error handling
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
