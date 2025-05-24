import numpy as np
from scipy.integrate import odeint
import matplotlib.pyplot as plt

# Model SEIR dengan konstanta populasi (seperti contoh Python Anda)
def seir_model_fixed_n(y, t, mu1, mu2, alpha, beta, gamma, theta, N):
    S, E, I, R = y
    dSdt = mu1 * N - (alpha + mu2) * S
    dEdt = alpha * S - (beta + mu2) * E
    dIdt = beta * E - (gamma + theta + mu2) * I
    dRdt = (gamma + theta) * I - mu2 * R
    return [dSdt, dEdt, dIdt, dRdt]

# Model SEIR dengan populasi dinamis (implementasi TypeScript kita)
def seir_model_dynamic_n(y, t, mu1, mu2, alpha, beta, gamma, theta):
    S, E, I, R = y
    N_current = S + E + I + R  # Populasi dinamis
    dSdt = mu1 * N_current - (alpha + mu2) * S
    dEdt = alpha * S - (beta + mu2) * E
    dIdt = beta * E - (gamma + theta + mu2) * I
    dRdt = (gamma + theta) * I - mu2 * R
    return [dSdt, dEdt, dIdt, dRdt]

# Parameter dari paper
mu1, mu2 = 0.409, 0.097
alpha, beta, gamma = 0.438, 0.102, 0.051
theta = 1.0  # dengan intervensi

# Kondisi awal
y0 = [72, 77, 18, 9]  # S(0), E(0), I(0), R(0)
N_fixed = 176  # Total populasi tetap

# Waktu simulasi
t = np.linspace(0, 36, 360)

print("=== PERBANDINGAN MODEL ===")
print(f"Parameter: μ1={mu1}, μ2={mu2}, α={alpha}, β={beta}, γ={gamma}, θ={theta}")
print(f"Initial: S={y0[0]}, E={y0[1]}, I={y0[2]}, R={y0[3]}, Total={sum(y0)}")
print()

# Simulasi dengan N tetap (seperti Python code Anda)
sol_fixed = odeint(seir_model_fixed_n, y0, t, args=(mu1, mu2, alpha, beta, gamma, theta, N_fixed))

# Simulasi dengan N dinamis (seperti TypeScript kita)
sol_dynamic = odeint(seir_model_dynamic_n, y0, t, args=(mu1, mu2, alpha, beta, gamma, theta))

# Hasil di bulan ke-36
print("=== HASIL BULAN KE-36 ===")
print("MODEL FIXED N (seperti Python Anda):")
S_f, E_f, I_f, R_f = sol_fixed[-1]
print(f"S={S_f:.0f}, E={E_f:.0f}, I={I_f:.0f}, R={R_f:.0f}, Total={S_f+E_f+I_f+R_f:.0f}")

print("\nMODEL DYNAMIC N (TypeScript kita):")
S_d, E_d, I_d, R_d = sol_dynamic[-1]
print(f"S={S_d:.0f}, E={E_d:.0f}, I={I_d:.0f}, R={R_d:.0f}, Total={S_d+E_d+I_d+R_d:.0f}")

# Test juga dengan parameter monthly (dibagi 12)
print("\n=== TEST DENGAN PARAMETER MONTHLY ===")
mu1_m, mu2_m = 0.409/12, 0.097/12
alpha_m, beta_m, gamma_m = 0.438/12, 0.102/12, 0.051/12
theta_m = 1.0/12

sol_monthly = odeint(seir_model_dynamic_n, y0, t, args=(mu1_m, mu2_m, alpha_m, beta_m, gamma_m, theta_m))
S_m, E_m, I_m, R_m = sol_monthly[-1]
print(f"MONTHLY RATES: S={S_m:.0f}, E={E_m:.0f}, I={I_m:.0f}, R={R_m:.0f}, Total={S_m+E_m+I_m+R_m:.0f}")

# Plot comparison
plt.figure(figsize=(15, 5))

plt.subplot(1, 3, 1)
plt.plot(t, sol_fixed[:, 0], label='S', linewidth=2)
plt.plot(t, sol_fixed[:, 1], label='E', linewidth=2)
plt.plot(t, sol_fixed[:, 2], label='I', linewidth=2)
plt.plot(t, sol_fixed[:, 3], label='R', linewidth=2)
plt.plot(t, np.sum(sol_fixed, axis=1), 'k--', label='Total', linewidth=2)
plt.title('Model Fixed N=176\n(Python code Anda)')
plt.xlabel('Waktu (bulan)')
plt.ylabel('Jumlah Siswa')
plt.legend()
plt.grid(True)

plt.subplot(1, 3, 2)
plt.plot(t, sol_dynamic[:, 0], label='S', linewidth=2)
plt.plot(t, sol_dynamic[:, 1], label='E', linewidth=2)
plt.plot(t, sol_dynamic[:, 2], label='I', linewidth=2)
plt.plot(t, sol_dynamic[:, 3], label='R', linewidth=2)
plt.plot(t, np.sum(sol_dynamic, axis=1), 'k--', label='Total', linewidth=2)
plt.title('Model Dynamic N\n(TypeScript kita - Annual)')
plt.xlabel('Waktu (bulan)')
plt.ylabel('Jumlah Siswa')
plt.legend()
plt.grid(True)

plt.subplot(1, 3, 3)
plt.plot(t, sol_monthly[:, 0], label='S', linewidth=2)
plt.plot(t, sol_monthly[:, 1], label='E', linewidth=2)
plt.plot(t, sol_monthly[:, 2], label='I', linewidth=2)
plt.plot(t, sol_monthly[:, 3], label='R', linewidth=2)
plt.plot(t, np.sum(sol_monthly, axis=1), 'k--', label='Total', linewidth=2)
plt.title('Model Dynamic N\n(TypeScript kita - Monthly)')
plt.xlabel('Waktu (bulan)')
plt.ylabel('Jumlah Siswa')
plt.legend()
plt.grid(True)

plt.tight_layout()
plt.savefig('seir_comparison.png', dpi=150, bbox_inches='tight')
plt.show()
