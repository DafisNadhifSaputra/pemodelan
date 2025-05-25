import { GoogleGenerativeAI } from "@google/generative-ai";
import html2canvas from 'html2canvas';
import type { SearParams, InitialConditions, SimulationDataPoint, AiInterpretationResponse } from '../types';

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
  chartElementId?: string
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
      return await getAiInterpretation(params, initialConditions, simulationData, r0, nInitial, hasIntervention, durationMonths);
    }

    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({ 
      model: 'gemini-2.5-flash-preview-05-20', // Updated to latest Gemini 2.0 Flash
      generationConfig: {
        temperature: 0.6, // Kreativitas sedang untuk analisis yang koheren namun informatif
        maxOutputTokens: 8192, // Cukup untuk analisis detail dengan LaTeX
        topP: 0.9,
        topK: 40
      }
    });

    const simulationSummary = getSimulationSummary(simulationData, durationMonths);

    const prompt = `
ANALISIS GRAFIK MODEL SEAR KECANDUAN GAME ONLINE

Anda adalah seorang ahli epidemiologi dan analis data yang memahami model SEAR. Analisis grafik simulasi ini dengan detail dalam Bahasa Indonesia.

**Data Konteks Simulasi:**
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

**INSTRUKSI ANALISIS GRAFIK:**

Berikan analisis menggunakan format Markdown dan notasi LaTeX untuk matematika. Struktur respons dengan heading dan subheading yang jelas.

## 1. Analisis Visual Kurva
Deskripsikan bentuk dan pola setiap kurva:
- $S(t)$ (Susceptible): [analisis kurva biru]
- $E(t)$ (Exposed): [analisis kurva kuning] 
- $A(t)$ (Addicted): [analisis kurva merah]
- $R(t)$ (Recovered): [analisis kurva hijau]

## 2. Titik Kritis dan Transisi
Identifikasi kapan:
- Kurva $A(t)$ mencapai puncak
- Kurva $S(t)$ menurun paling cepat
- Kurva $R(t)$ mulai dominan
- Titik ekuilibrium (jika ada)

## 3. Dinamika Model SEAR
Jelaskan transisi $S \\rightarrow E \\rightarrow A \\rightarrow R$:
- Laju paparan: $\\alpha S$
- Laju kecanduan: $\\beta E$ 
- Laju pemulihan: $(\\gamma + \\theta) A$

## 4. Interpretasi Epidemiologi
- Analisis nilai $R_0 = \\frac{\\beta}{\\gamma + \\theta + \\mu_2}$
- Dampak intervensi pada dinamika populasi
- Prediksi jangka panjang

## 5. Rekomendasi Kebijakan
Berdasarkan pola grafik, berikan saran untuk:
- Strategi pencegahan
- Program intervensi
- Monitoring populasi

Gunakan notasi matematika LaTeX yang tepat dan format Markdown untuk struktur yang jelas.
`;

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
KONTEKS JURNAL PENELITIAN - MODEL SEAR KECANDUAN GAME ONLINE:

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

3. PARAMETER KUNCI:
   - α: Laju transisi S→E (paparan game)
   - β: Laju transisi E→A (menjadi kecanduan)
   - γ: Laju pemulihan alami A→R
   - θ: Efektivitas intervensi (0=tanpa, 1=dengan intervensi)
   - μ₁: Laju rekrutmen populasi baru
   - μ₂: Laju keluar alami

4. BASIC REPRODUCTION NUMBER:
   R₀ = (αβ)/((β + μ₂)(γ + θ + μ₂))
   - R₀ > 1: Kecanduan menyebar dan menjadi endemik
   - R₀ < 1: Kecanduan menghilang secara alami

5. ANALISIS INTERVENSI:
   - θ = 0: Tidak ada program intervensi, pemulihan hanya alami
   - θ = 1: Program konseling, terapi, dan dukungan sosial aktif
   - Intervensi meningkatkan laju pemulihan secara signifikan

6. IMPLIKASI PRAKTIS:
   - Model membantu perencaan kebijakan kesehatan mental
   - Dapat memprediksi dampak intervensi pada populasi
   - Berguna untuk strategi pencegahan kecanduan game online
`;

  // Konfigurasi generasi berdasarkan panjang respon
  const getGenerationConfig = (length: 'singkat' | 'sedang' | 'panjang') => {
    switch (length) {
      case 'singkat':
        return {
          temperature: 0.2,
          maxOutputTokens: 3072,
          topP: 0.8,
          topK: 20
        };
      case 'sedang':
        return {
          temperature: 0.3,
          maxOutputTokens: 6072,
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
          maxOutputTokens: 6072,
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

**INSTRUKSI PENTING:**
WAJIB gunakan format Markdown yang benar dengan struktur berikut. Pastikan menggunakan notasi LaTeX untuk matematika:

## 1. Analisis Basic Reproduction Number ($R_0$)

Interpretasi nilai $R_0 = \\frac{\\beta}{\\gamma + \\theta + \\mu_2}$ dan implikasinya terhadap penyebaran kecanduan.

## 2. Dinamika Transisi Kompartemen

Analisis bagaimana individu berpindah: $S \\xrightarrow{\\alpha} E \\xrightarrow{\\beta} A \\xrightarrow{\\gamma + \\theta} R$

## 3. Dampak Parameter Terhadap Simulasi

Evaluasi bagaimana setiap parameter memengaruhi bentuk kurva dan hasil akhir.

## 4. Evaluasi Intervensi

${hasIntervention ? 'Analisis efektivitas intervensi ($\\theta = 1$) berdasarkan teori model SEAR.' : 'Dampak tidak adanya intervensi ($\\theta = 0$) pada dinamika populasi.'}

## 5. Rekomendasi Strategis

Saran berdasarkan hasil simulasi untuk:
- **Pencegahan**: Mengurangi paparan ($\\alpha$)
- **Intervensi**: Meningkatkan pemulihan ($\\gamma + \\theta$)
- **Monitoring**: Parameter kunci yang perlu dipantau

**FORMAT REQUIREMENTS:**
- Gunakan heading dengan ## untuk section utama
- Gunakan **bold** untuk emphasis penting
- Gunakan notasi LaTeX dengan $ untuk inline math dan $$ untuk block math
- Gunakan bullet points dengan - untuk list
- Berikan analisis ilmiah yang mudah dipahami dan terstruktur
`;

      case 'panjang':
        return `${journalContext}

${baseInfo}

**INSTRUKSI KOMPREHENSIF:**
Berikan analisis mendalam dan lengkap dengan struktur Markdown yang rapi dan notasi LaTeX:

## 1. Analisis Mendalam Basic Reproduction Number ($R_0$)

### 1.1 Interpretasi Matematis
Jelaskan secara detail perhitungan $R_0 = \\frac{\\beta}{\\gamma + \\theta + \\mu_2}$ dan konteks epidemiologi.

### 1.2 Implikasi Threshold
Analisis kriteria $R_0 > 1$ vs $R_0 < 1$ dan konsekuensinya pada penyebaran kecanduan.

### 1.3 Perbandingan dengan Literatur
Bandingkan dengan nilai $R_0$ dalam studi epidemiologi kecanduan lainnya.

## 2. Dinamika Kompartemen dan Transisi

### 2.1 Alur Transisi $S \\rightarrow E \\rightarrow A \\rightarrow R$
Jelaskan detail setiap transisi dengan persamaan diferensial.

### 2.2 Analisis Steady State
Tentukan titik kesetimbangan jangka panjang sistem.

### 2.3 Faktor-faktor yang Mempengaruhi Transisi
Analisis bagaimana perubahan parameter memengaruhi laju transisi.

## 3. Evaluasi Parameter dan Sensitivitas

### 3.1 Analisis Sensitivitas Parameter
Evaluasi dampak perubahan $\\alpha$, $\\beta$, $\\gamma$, $\\mu_1$, $\\mu_2$ pada dinamika.

### 3.2 Validasi dengan Data Empiris
Bandingkan hasil simulasi dengan data epidemiologi sebenarnya.

### 3.3 Uncertainty Quantification
Diskusikan ketidakpastian dalam estimasi parameter.

## 4. Analisis Intervensi Komprehensif

### 4.1 Mekanisme Intervensi ($\\theta$)
${hasIntervention ? 
'Jelaskan detail bagaimana intervensi bekerja: konseling, terapi kelompok, program rehabilitasi.' : 
'Analisis konsekuensi tidak adanya intervensi terstruktur.'}

### 4.2 Cost-Effectiveness Analysis
Evaluasi efektivitas biaya dari program intervensi.

### 4.3 Optimal Timing Intervention
Tentukan waktu optimal untuk memulai intervensi.

## 5. Implikasi Kesehatan Masyarakat

### 5.1 Burden of Disease
Hitung beban penyakit kecanduan game online pada populasi.

### 5.2 Health Economics Impact
Analisis dampak ekonomi kesehatan jangka pendek dan panjang.

### 5.3 Population-level Strategies
Strategi pencegahan tingkat populasi berdasarkan model.

## 6. Rekomendasi Policy dan Implementasi

### 6.1 Evidence-based Policy Recommendations
Rekomendasi kebijakan berdasarkan bukti dari simulasi.

### 6.2 Implementation Framework
Kerangka implementasi program intervensi.

### 6.3 Monitoring and Evaluation
Sistem monitoring dan evaluasi program.

## 7. Limitasi dan Future Research

### 7.1 Model Limitations
Diskusikan batasan model SEAR dalam konteks kecanduan game.

### 7.2 Future Research Directions
Saran untuk penelitian lanjutan dan pengembangan model.

**FORMAT REQUIREMENTS:**
- Gunakan sub-heading dengan ### untuk detail
- Sertakan persamaan matematis dalam display math: $$equation$$
- Gunakan tabel jika diperlukan dengan format Markdown
- Minimal 1500 kata dengan analisis mendalam
- Referensi teori epidemiologi dan psikologi yang relevan
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
