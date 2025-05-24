import numpy as np
from scipy.integrate import odeint

# Model SEIR persis seperti kode Python yang Anda berikan
def seir_model(y, t, mu1, mu2, alpha, beta, gamma, theta):
    S, E, I, R = y
    N = 176  # Konstanta seperti dalam kode asli
    dSdt = mu1 * N - (alpha + mu2) * S
    dEdt = alpha * S - (beta + mu2) * E
    dIdt = beta * E - (gamma + theta + mu2) * I
    dRdt = (gamma + theta) * I - mu2 * R
    return [dSdt, dEdt, dIdt, dRdt]

# Parameter dari kode Python asli
mu1, mu2 = 0.409, 0.097
alpha, beta, gamma, theta = 0.438, 0.102, 0.051, 1.0

# Initial conditions
y0 = [72, 77, 18, 9]
t = np.linspace(0, 36, 360)

# Solve
sol = odeint(seir_model, y0, t, args=(mu1, mu2, alpha, beta, gamma, theta))

print("=== VERIFIKASI KODE PYTHON ASLI ===")
print(f"Month 0: S={y0[0]:.0f}, E={y0[1]:.0f}, I={y0[2]:.0f}, R={y0[3]:.0f}, Total={sum(y0):.0f}")

# Print beberapa milestone
for i, month in enumerate([3.6, 7.2, 18, 36]):
    idx = int(month * 10)  # karena 360 points untuk 36 bulan
    if idx < len(sol):
        S, E, I, R = sol[idx]
        total = S + E + I + R
        print(f"Month {month}: S={S:.0f}, E={E:.0f}, I={I:.0f}, R={R:.0f}, Total={total:.0f}")

print("\n=== HASIL AKHIR (36 BULAN) ===")
S_final, E_final, I_final, R_final = sol[-1]
total_final = S_final + E_final + I_final + R_final
print(f"S = {S_final:.0f}, E = {E_final:.0f}, I = {I_final:.0f}, R = {R_final:.0f}")
print(f"Total = {total_final:.0f}")

# Verifikasi dengan analisis matematik
net_growth_rate = mu1 - mu2
print(f"\nNet growth rate (mu1 - mu2) = {net_growth_rate:.3f}")
if net_growth_rate > 0:
    print("Population will grow exponentially!")
else:
    print("Population will decline or stay constant")
