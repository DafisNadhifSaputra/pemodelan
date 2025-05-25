import { GoogleGenerativeAI } from "@google/generative-ai";
import html2canvas from 'html2canvas';
import type { SearParams, InitialConditions, SimulationDataPoint, AiInterpretationResponse } from '../types';
import { paperFullText, paperTitle, compartmentDiagram, graphicVisualization } from '../paperContent';

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
            temperature: 0.2,
            maxOutputTokens: 4096,
            topP: 0.8,
            topK: 20
          };
        case 'sedang':
          return {
            temperature: 0.4,
            maxOutputTokens: 6096,
            topP: 0.9,
            topK: 40
          };
        case 'panjang':
          return {
            temperature: 0.7,
            maxOutputTokens: 15000,
            topP: 0.9,
            topK: 40
          };
        default:
          return {
            temperature: 0.4,
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
**PENTING: MODEL TELAH DIPERBARUI DARI SEIR KE SEAR**
Jurnal asli menggunakan terminologi SEIR (Susceptible-Exposed-Infected-Recovered), namun dalam aplikasi ini model telah diperbarui menjadi SEAR (Susceptible-Exposed-Addicted-Recovered) untuk lebih tepat menggambarkan konteks kecanduan game online. Komparten "I" (Infected) sekarang menjadi "A" (Addicted).

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
   - Tanpa intervensi: 200 siswa kecanduan dalam ${durationMonths} bulan
   - Dengan intervensi: hanya 26 siswa kecanduan dalam ${durationMonths} bulan
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
`;        case 'sedang':
          return `
ANALISIS GRAFIK MODEL SEAR KECANDUAN GAME ONLINE

${chartJournalContext}

Anda adalah ahli epidemiologi matematika. Analisis grafik dengan fokus pada HASIL SIMULASI AKTUAL dan penjelasan matematis mengapa kurva berperilaku seperti yang terlihat.

${baseInfo}

**INSTRUKSI:** Analisis berdasarkan data numerik dari grafik dan berikan penjelasan matematis yang jelas.

## 1. Analisis Kurva Berdasarkan Data Simulasi

### Kurva Addicted A(t) [Merah] - UTAMA
- **Pola:** Dari grafik, apakah A(t) naik monoton, ada puncak, atau turun?
- **Nilai Kunci:** A(0)=${initialConditions.A0} → A(puncak)=? → A(36)=?
- **Alasan:** Mengapa pola ini terjadi? Analisis $\\frac{dA}{dt} = \\beta E(t) - (\\gamma + \\theta + \\mu_2)A(t)$

### Kurva Susceptible S(t) [Biru]
- **Tren:** S(0)=${initialConditions.S0} → naik/turun/stabil?
- **Mekanisme:** Balance $\\mu_1 N$ (rekrutmen) vs $(\\alpha + \\mu_2)S$ (outflow)

### Kurva Exposed E(t) [Kuning]
- **Bentuk:** Linear, sigmoid, atau eksponensial dari E(0)=${initialConditions.E0}?
- **Dinamika:** $\\alpha S(t)$ (inflow) vs $(\\beta + \\mu_2)E(t)$ (outflow)

### Kurva Recovered R(t) [Hijau]
- **Pertumbuhan:** R(0)=${initialConditions.R0} → linear atau eksponensial?
- **Efek Intervensi:** ${hasIntervention ? 'Dampak $(\\gamma+1)A(t)$ vs $\\gamma A(t)$' : 'Hanya $\\gamma A(t)$ - pemulihan alami'}

## 2. Titik Kritis dan R₀=${r0.toFixed(3)}

### Puncak Kecanduan
- **Kapan:** Bulan berapa A(t) mencapai maksimum?
- **Mengapa:** Kapan $\\beta E(t) = (\\gamma + \\theta + \\mu_2)A(t)$?

### Interpretasi R₀
- **Makna:** ${r0 > 1 ? 'Kecanduan menyebar (>1)' : 'Kecanduan berkurang (<1)'}
- **Validasi:** Apakah pola grafik A(t) sesuai prediksi R₀?

## 3. Dinamika dan Intervensi

### Efektivitas Intervensi
${hasIntervention ? 
'- **θ=1:** Bagaimana kurva A(t) dan R(t) berbeda dengan θ=0?\\n- **Akselerasi:** Seberapa cepat intervensi mempercepat pemulihan?' : 
'- **θ=0:** Bagaimana A(t) berkembang tanpa intervensi?\\n- **Konsekuensi:** Dampak jangka panjang tanpa treatment?'}

### Rekomendasi
- **Target:** Parameter mana yang paling berpengaruh pada bentuk kurva?
- **Timing:** Kapan waktu optimal intervensi berdasarkan pola kurva?

**FOKUS:** Analisis DATA dari grafik dengan penjelasan matematis mengapa kurva berperilaku demikian.
`;

        case 'panjang':
          return `
ANALISIS MENDALAM GRAFIK MODEL SEAR KECANDUAN GAME ONLINE

${chartJournalContext}

Anda adalah ahli epidemiologi matematika. Analisis grafik dengan fokus UTAMA pada HASIL SIMULASI SPESIFIK dan ALASAN MATEMATIS mengapa kurva berperilaku seperti yang terlihat.

${baseInfo}

**INSTRUKSI:** Analisis kurva berdasarkan DATA AKTUAL dari grafik, bukan teori umum. Fokus pada angka-angka spesifik dan penjelasan matematis yang tepat.

## 1. Analisis Kurva Berdasarkan Data Grafik

### Kurva Addicted A(t) [MERAH] - PRIORITAS UTAMA
- **Nilai Numerik:** A(0)=${initialConditions.A0} → A(puncak)=? pada bulan? → A(36)=?
- **Bentuk Kurva:** Naik monoton/ada puncak/turun eksponensial?
- **Alasan Matematis:** Mengapa pola ini? Analisis $\\frac{dA}{dt} = \\beta E(t) - (\\gamma + \\theta + \\mu_2)A(t)$
- **Alasan Fisik/Epidemiologi:** Secara perilaku siswa SMP, mengapa kecanduan game berkembang dengan pola seperti ini? Faktor psikologis dan sosial apa yang menyebabkan tren kurva?
- **Turning Point:** Kapan $\\beta E(t) = (\\gamma + \\theta + \\mu_2)A(t)$ dan mengapa di waktu itu terjadi perubahan perilaku siswa?

### Kurva Susceptible S(t) [BIRU]
- **Tren Numerik:** S(0)=${initialConditions.S0} → S(36)=? (naik/turun berapa persen?)
- **Mekanisme Matematis:** Balance $\\mu_1 N$ vs $(\\alpha + \\mu_2)S$ - mana yang dominan?
- **Alasan Fisik:** Mengapa siswa rentan bertambah/berkurang? Apa yang terjadi di lingkungan sekolah yang mempengaruhi kerentanan?
- **Stabilitas:** Menuju equilibrium $S^* = \\frac{\\mu_1 N}{\\alpha + \\mu_2}$?

### Kurva Exposed E(t) [KUNING]
- **Pola Data:** E(0)=${initialConditions.E0} → E(maksimal)=? → E(36)=?
- **Dinamika Matematis:** $\\alpha S(t)$ (inflow) vs $(\\beta + \\mu_2)E(t)$ (outflow) - crossover kapan?
- **Alasan Fisik:** Mengapa tidak semua siswa terpapar langsung menjadi kecanduan? Faktor resistensi psikologis apa yang berperan?

### Kurva Recovered R(t) [HIJAU]
- **Laju Pertumbuhan:** R(0)=${initialConditions.R0} → R(36)=? (linear/eksponensial?)
- **Efek Intervensi Matematis:** ${hasIntervention ? '$(\\gamma+1)A(t)$ vs $\\gamma A(t)$ - berapa kali lebih cepat?' : 'Hanya $\\gamma A(t)$ - mengapa lambat?'}
- **Alasan Fisik:** ${hasIntervention ? 'Bagaimana konseling, pengawasan orang tua, dan dukungan sosial secara konkret membantu siswa pulih dari kecanduan?' : 'Mengapa pemulihan alami sangat sulit tanpa bantuan? Hambatan psikologis apa yang dialami siswa?'}

## 2. Analisis Matematis Mendalam

### Basic Reproduction Number R₀=${r0.toFixed(3)}
- **Validasi Grafik:** ${r0 > 1 ? 'Mengapa A(t) naik meski R₀>1?' : 'Apakah A(t) turun sesuai R₀<1?'}
- **Threshold Effect:** Kapan sistem berubah perilaku?

### Dinamika Fase
- **Fase Awal:** Dominasi $\\beta E(t)$ → pertumbuhan A(t)
- **Fase Puncak:** Transisi $\\beta E(t) ≈ (\\gamma+\\theta+\\mu_2)A(t)$
- **Fase Akhir:** Dominasi pemulihan → penurunan A(t)

## 3. Interpretasi Hasil Spesifik

### Efektivitas Intervensi dari Grafik
${hasIntervention ? 
'- **θ=1 Impact:** Berapa bulan lebih cepat A(t) turun?\\n- **Recovery Boost:** Laju R(t) meningkat berapa kali lipat?' : 
'- **Tanpa Intervensi:** A(t) plateau di level berapa?\\n- **Konsekuensi:** Berapa total kecanduan dalam ${durationMonths} bulan?'}

### Titik Kritis
- **Peak Time:** Kapan A(t) maksimal dan mengapa di waktu itu?
- **Crossover:** Kapan R(t) > A(t) (recovery dominan)?
- **Equilibrium:** Tren menuju steady state seperti apa?

## 4. Implikasi Praktis dari Data

### Burden of Disease
- **Total Kecanduan:** Area under curve A(t) = berapa person-months?
- **Peak Prevalence:** Maksimal berapa persen populasi kecanduan simultan?

### Strategi Berbasis Data
- **Timing Optimal:** Kapan memulai intervensi berdasarkan tren E(t)?
- **Target Parameter:** Mana yang lebih efektif: ↓α, ↓β, atau ↑γ?

**FOKUS:** Analisis DATA NUMERIK dari grafik dengan penjelasan matematis mengapa kurva berperilaku demikian. Hindari teori umum, fokus pada HASIL SIMULASI SPESIFIK.
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
**PENTING: MODEL TELAH DIPERBARUI DARI SEIR KE SEAR**
Jurnal asli menggunakan terminologi SEIR (Susceptible-Exposed-Infected-Recovered), namun dalam aplikasi ini model telah diperbarui menjadi SEAR (Susceptible-Exposed-Addicted-Recovered) untuk lebih tepat menggambarkan konteks kecanduan game online. Komparten "I" (Infected) sekarang menjadi "A" (Addicted).

KONTEKS JURNAL PENELITIAN LENGKAP - ${paperTitle}:

${paperFullText}

${compartmentDiagram}

${graphicVisualization}

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
   - Tanpa intervensi: Kecanduan mencapai 200 siswa dalam ${durationMonths} bulan
   - Dengan intervensi: Kecanduan turun menjadi 26 siswa dalam ${durationMonths} bulan
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
          temperature: 0.4,
          maxOutputTokens: 6096,
          topP: 0.8,
          topK: 30
        };
      case 'panjang':
        return {
          temperature: 0.7,
          maxOutputTokens: 15000,
          topP: 0.9,
          topK: 40
        };
      default:
        return {
          temperature: 0.4,
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

**INSTRUKSI:** Analisis fokus pada HASIL SIMULASI dengan penjelasan matematis yang jelas dan konkret.

## 1. Hasil Simulasi Model SEAR

### 1.1 Dinamika Kecanduan A(t)
- **Nilai Awal vs Akhir:** A(0) = ${initialConditions.A0} → A(${durationMonths} bulan) = [hasil simulasi]
- **Pola Kurva:** Naik monoton/ada puncak/menurun - dan mengapa?
- **Alasan Matematis:** Analisis $\\frac{dA}{dt} = \\beta E(t) - (\\gamma + \\theta + \\mu_2)A(t)$ berdasarkan data

### 1.2 Populasi Susceptible S(t)
- **Tren:** S(0) = ${initialConditions.S0} → S(${durationMonths}) = ? (perubahan berapa persen?)
- **Mekanisme:** Balance $\\mu_1 N$ = ${(params.mu1 * nInitial).toFixed(1)} vs $(\\alpha + \\mu_2)S$

### 1.3 Transisi dan Pemulihan
- **Exposed:** E(0) = ${initialConditions.E0} → bagaimana berkembang?
- **Recovery:** R(0) = ${initialConditions.R0} → laju pemulihan aktual
- **Efek Intervensi:** ${hasIntervention ? 'θ=1 meningkatkan recovery rate $(\\gamma+1)$ = ' + (params.gamma + 1).toFixed(3) : 'Hanya γ = ' + params.gamma.toFixed(3) + ' (pemulihan alami)'}

## 2. Basic Reproduction Number R₀ = ${r0.toFixed(3)}

### 2.1 Interpretasi Matematis
- **Perhitungan:** $R_0 = \\frac{${params.beta.toFixed(3)}}{${(params.gamma + (hasIntervention ? 1 : 0) + params.mu2).toFixed(3)}} = ${r0.toFixed(3)}$
- **Makna:** ${r0 > 1 ? 'Kecanduan menyebar (R₀ > 1)' : 'Kecanduan berkurang (R₀ < 1)'}
- **Validasi:** Apakah hasil simulasi A(t) konsisten dengan prediksi R₀?

## 3. Efektivitas Parameter dan Intervensi

### 3.1 Perbandingan Parameter
- **α (paparan):** ${params.alpha.toFixed(3)} vs penelitian 0.438 → dampak S→E
- **β (kecanduan):** ${params.beta.toFixed(3)} vs penelitian 0.102 → dampak E→A
- **γ (pemulihan):** ${params.gamma.toFixed(3)} vs penelitian 0.051 → dampak A→R

### 3.2 Dampak Intervensi
**${hasIntervention ? 'DENGAN INTERVENSI' : 'TANPA INTERVENSI'}:**
- Recovery rate: ${hasIntervention ? (params.gamma + 1).toFixed(3) + ' (meningkat ' + ((1 + params.gamma)/params.gamma).toFixed(1) + 'x)' : params.gamma.toFixed(3) + ' (hanya alami)'}
- **Benchmark:** Penelitian menunjukkan pengurangan 200 → 26 kecanduan (87%)

## 4. Dinamika Sistem dan Prediksi

### 4.1 Alur Transisi
- **S→E:** Laju $\\alpha S$ = ${params.alpha.toFixed(3)} × S(t)
- **E→A:** Laju $\\beta E$ = ${params.beta.toFixed(3)} × E(t)
- **A→R:** Laju $(\\gamma + \\theta)A$ = ${(params.gamma + (hasIntervention ? 1 : 0)).toFixed(3)} × A(t)

### 4.2 Proyeksi Jangka Panjang
- **Equilibrium:** Menuju bebas kecanduan atau endemik?
- **Time Scale:** Berapa bulan untuk stabilisasi?

## 5. Rekomendasi Berdasarkan Simulasi

### 5.1 Strategi Intervensi
- **Pencegahan:** ${params.alpha > 0.2 ? 'Prioritas menurunkan α (paparan)' : 'α sudah optimal, fokus lain'}
- **Treatment:** ${params.gamma < 0.1 ? 'Tingkatkan γ atau θ (pemulihan)' : 'Recovery rate memadai'}
- **Timing:** Kapan memulai intervensi berdasarkan tren E(t)?

**FOKUS:** Analisis HASIL SIMULASI SPESIFIK dengan penjelasan matematis konkret berdasarkan data numerik aktual.
`;

      case 'panjang':
        return `${journalContext}

${baseInfo}

**INSTRUKSI:** Analisis FOKUS pada hasil simulasi spesifik. Berikan insight mendalam berdasarkan DATA NUMERIK aktual dari simulasi dengan ALASAN MATEMATIS dan FISIK/EPIDEMIOLOGI mengapa pola tersebut terjadi.

## 1. Hasil Simulasi dan Interpretasi Data

### 1.1 Dinamika Kecanduan A(t)
**DATA SIMULASI:**
- A(0) = ${initialConditions.A0} → A(${durationMonths} bulan) = [nilai dari simulasi]
- **Pola Kurva:** Apakah naik monoton, ada puncak, atau menurun?
- **Puncak:** Jika ada, kapan terjadi dan berapa nilai maksimumnya?
- **Alasan Matematis:** Mengapa $\\frac{dA}{dt} = \\beta E(t) - (\\gamma + \\theta + \\mu_2)A(t)$ menghasilkan pola ini?
- **Alasan Fisik/Epidemiologi:** Secara perilaku siswa, mengapa kecanduan berkembang/menurun dengan pola seperti ini? Apa faktor psikologis dan sosial yang menyebabkan tren kurva A(t)?

### 1.2 Populasi Susceptible S(t)
**TREN NUMERIK:**
- S(0) = ${initialConditions.S0} → S(${durationMonths}) = ?
- **Perubahan:** Naik/turun berapa persen selama simulasi?
- **Mekanisme Matematis:** Balance antara rekrutmen $\\mu_1 N$ = ${(params.mu1 * nInitial).toFixed(1)} vs outflow $(\\alpha + \\mu_2)S$
- **Alasan Fisik:** Mengapa siswa rentan (S) bertambah/berkurang? Faktor apa dalam lingkungan sekolah yang mempengaruhi kerentanan siswa terhadap game online?

### 1.3 Transisi Exposed → Addicted
**ANALISIS E(t):**
- E(0) = ${initialConditions.E0} → pola E(t) selama ${durationMonths} bulan
- **Residence Time:** Berapa lama rata-rata di kompartemen E?
- **Conversion Rate:** Berapa persen E yang menjadi A?
- **Alasan Fisik:** Mengapa tidak semua siswa yang terpapar (E) langsung menjadi kecanduan (A)? Faktor psikologis apa yang menentukan transisi E→A pada siswa SMP?

### 1.4 Pemulihan R(t)
**RECOVERY DYNAMICS:**
- R(0) = ${initialConditions.R0} → total recovery di bulan ${durationMonths}
- **Laju Pemulihan:** ${hasIntervention ? 'Dengan θ=1: $(\\gamma+1)A = ' + (params.gamma + 1).toFixed(3) + 'A$' : 'Tanpa intervensi: $\\gamma A = ' + params.gamma.toFixed(3) + 'A$'}
- **Alasan Fisik:** ${hasIntervention ? 'Bagaimana konseling, pengawasan orang tua, dan dukungan sosial secara konkret membantu pemulihan siswa dari kecanduan?' : 'Mengapa pemulihan alami sangat lambat tanpa intervensi? Apa hambatan psikologis yang dialami siswa kecanduan?'}

## 2. Basic Reproduction Number R₀ = ${r0.toFixed(3)}

### 2.1 Interpretasi Numerik
**PERHITUNGAN:** $R_0 = \\frac{\\beta}{\\gamma + \\theta + \\mu_2} = \\frac{${params.beta.toFixed(3)}}{${(params.gamma + (hasIntervention ? 1 : 0) + params.mu2).toFixed(3)}} = ${r0.toFixed(3)}$

**IMPLIKASI:**
- ${r0 > 1 ? 'R₀ > 1: Kecanduan akan menyebar dan menjadi endemik' : 'R₀ < 1: Kecanduan akan berkurang dan hilang secara alami'}
- **Validasi:** Apakah hasil simulasi A(t) konsisten dengan prediksi R₀?

### 2.2 Threshold Analysis
- **Critical Value:** R₀ = 1 tercapai ketika $\\gamma + \\theta + \\mu_2 = \\beta$ = ${params.beta.toFixed(3)}
- **Current Status:** ${r0 > 1 ? 'Perlu intervensi lebih kuat untuk R₀ < 1' : 'Sistem stabil, kecanduan terkontrol'}

## 3. Efektivitas Intervensi

### 3.1 Dampak Parameter θ
**${hasIntervention ? 'DENGAN INTERVENSI (θ=1)' : 'TANPA INTERVENSI (θ=0)'}:**
- Recovery rate: ${hasIntervention ? (params.gamma + 1).toFixed(3) : params.gamma.toFixed(3)} (${hasIntervention ? 'meningkat ' + ((1/params.gamma)).toFixed(1) + 'x' : 'hanya pemulihan alami'})
- **R₀ Impact:** Dari ${((params.beta)/(params.gamma + params.mu2)).toFixed(3)} → ${r0.toFixed(3)}

### 3.2 Perbandingan dengan Penelitian Empiris
**VALIDASI HASIL:**
- **Penelitian:** Tanpa intervensi → 200 kecanduan/${durationMonths} bulan
- **Penelitian:** Dengan intervensi → 26 kecanduan/${durationMonths} bulan (87% pengurangan)
- **SIMULASI ANDA:** Prediksi A(${durationMonths}) = ? (berapa persen pengurangan?)

## 4. Analisis Parameter vs Penelitian

### 4.1 Sensitivitas Parameter
**PERBANDINGAN DENGAN NILAI EMPIRIS:**
- α (paparan): Anda=${params.alpha.toFixed(3)} vs Penelitian=0.438 → dampak pada laju S→E
- β (kecanduan): Anda=${params.beta.toFixed(3)} vs Penelitian=0.102 → dampak pada laju E→A
- γ (pemulihan): Anda=${params.gamma.toFixed(3)} vs Penelitian=0.051 → dampak pada A→R

### 4.2 Implikasi Perubahan Parameter
- **Jika α lebih tinggi:** Paparan game lebih cepat, S→E dipercepat
- **Jika β lebih tinggi:** Transisi ke kecanduan lebih cepat
- **Jika γ lebih tinggi:** Pemulihan alami lebih efektif

## 5. Dinamika Sistem dan Prediksi

### 5.1 Time-to-Event Analysis
**MILESTONE SIMULASI:**
- **Time to Peak:** Kapan A(t) mencapai maksimum?
- **Recovery Overtake:** Kapan R(t) > A(t)?
- **Equilibrium:** Berapa bulan untuk mencapai steady state?

### 5.2 Steady State Analysis
**EQUILIBRIUM VALUES:**
- $S^* = \\frac{\\mu_1 N}{\\alpha + \\mu_2}$ = ${((params.mu1 * nInitial)/(params.alpha + params.mu2)).toFixed(1)}
- $A^*$ bergantung pada R₀: ${r0 < 1 ? 'menuju 0 (bebas kecanduan)' : 'positif (endemik)'}

## 6. Rekomendasi Berdasarkan Hasil Simulasi

### 6.1 Strategi Optimal
**BERDASARKAN DATA NUMERIK:**
- **Prevention Focus:** ${params.alpha > 0.2 ? 'Prioritas menurunkan α (paparan game)' : 'α sudah rendah, fokus parameter lain'}
- **Treatment Focus:** ${params.gamma < 0.1 ? 'Tingkatkan γ (pemulihan alami) atau θ (intervensi)' : 'Recovery rate memadai'}

### 6.2 Policy Implications
**TIMING INTERVENSI:**
- **Early Intervention:** Mulai saat E(t) mencapai threshold tertentu
- **Monitoring:** Pantau A(t) dan R(t) sebagai indikator utama
- **Resource Allocation:** ${hasIntervention ? 'Pertahankan θ=1 untuk efektivitas optimal' : 'Implementasi θ=1 dapat mengurangi kecanduan hingga ' + (100*(1-26/200)).toFixed(0) + '%'}

**FOKUS:** Analisis HASIL SIMULASI SPESIFIK dengan angka-angka aktual dan penjelasan matematis mengapa pola tersebut terjadi. Berikan insight praktis berdasarkan data numerik dari simulasi anda.
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
