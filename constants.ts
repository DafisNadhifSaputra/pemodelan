
import type { SeirParams, InitialConditions } from './types';

// Parameter default dari Tabel 2 (halaman 98) paper
// Menggunakan nilai original dari paper (seperti implementasi Python)
// Catatan: Theta ditangani secara terpisah oleh tombol intervensi
export const DEFAULT_PARAMS: Omit<SeirParams, 'theta'> = {
  mu1: 0.409, // Faktor rekrutmen sesuai Tabel 2 paper
  mu2: 0.097, // Laju keluar alami dari setiap kompartemen
  alpha: 0.438, // Laju perpindahan S -> E (individu menjadi terpapar/mencoba game)
  beta: 0.102,  // Laju perpindahan E -> I (individu menjadi terinfeksi/kecanduan)
  gamma: 0.051, // Laju perpindahan I -> R (pemulihan alami tanpa intervensi)
};

// Nilai Theta
export const THETA_WITH_INTERVENTION = 1; // Dari Tabel 2 (Efektivitas pengawasan... θ)
export const THETA_WITHOUT_INTERVENTION = 0; // Diasumsikan untuk skenario "tanpa intervensi"

// Kondisi awal dari deskripsi simulasi di paper (halaman 98)
export const DEFAULT_INITIAL_CONDITIONS: InitialConditions = {
  S0: 72,  // Jumlah awal Susceptible
  E0: 77,  // Jumlah awal Exposed
  A0: 18,  // Jumlah awal Addicted (dulunya I0)
  R0: 9,   // Jumlah awal Recovered
};

export const DEFAULT_SIMULATION_DURATION_MONTHS = 36; // Durasi simulasi default dalam bulan
export const TIME_STEP = 1; // Langkah waktu simulasi (misalnya 1 untuk per bulan)
