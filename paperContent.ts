
export const paperTitle = "Model SEAR Kecanduan Game Online pada Siswa di SMP Negeri 3 Makassar";

// Diagram kompartemen SEAR
export const compartmentDiagram = `
DIAGRAM KOMPARTEMEN MODEL SEAR KECANDUAN GAME ONLINE:

              Λ = μ₁N (Rekrutmen siswa dengan akses game)
                        ↓
    [S] ――α――→ [E] ――β――→ [A] ――γ+θ――→ [R]
     ↓         ↓         ↓           ↓
    μ₂        μ₂        μ₂          μ₂

KETERANGAN:
- S (Susceptible): Siswa berpotensi kecanduan game online
- E (Exposed): Siswa yang mulai bermain game online  
- A (Addicted): Siswa kecanduan game online
- R (Recovered): Siswa yang pulih/berhenti bermain

PARAMETER:
- α = 0.438: Laju paparan S→E 
- β = 0.102: Laju kecanduan E→I
- γ = 0.051: Laju pemulihan alami I→R
- θ = 0 atau 1: Efektivitas intervensi
- μ₂ = 0.097: Laju keluar dari sistem

R₀ = β/(γ + θ + μ₂) = 0.689 (tanpa intervensi), 0.089 (dengan intervensi)
`;

// Visualisasi grafik dari jurnal penelitian
export const graphicVisualization = `
GRAFIK SIMULASI MODEL SEAR:

Gambar 2 - Tanpa Intervensi:
- Kurva Susceptible (biru): Naik dari 72 → 135 siswa
- Kurva Exposed (kuning): Naik dari 77 → 290 siswa  
- Kurva Addicted (merah): Naik dari 18 → 200 siswa
- Kurva Recovered (hijau): Naik dari 9 → 95 siswa

Gambar 3 - Dengan Intervensi:
- Kurva Susceptible (biru): Sama, naik dari 72 → 135 siswa
- Kurva Exposed (kuning): Sama, naik dari 77 → 290 siswa
- Kurva Addicted (merah): Puncak di bulan 8 (~30), turun ke 26 siswa
- Kurva Recovered (hijau): Naik tajam dari 9 → 250 siswa

Dampak Intervensi:
- Kecanduan turun 87% (200 → 26 siswa)
- Pemulihan naik 163% (95 → 250 siswa)
`;

// Instruksi khusus untuk AI analisis mendalam (hanya untuk opsi "panjang")
export const aiAnalysisInstructions = `
INSTRUKSI ANALISIS MENDALAM UNTUK AI (HANYA OPSI PANJANG):

1. ANALISIS ASIMPTOTIK KURVA:
- Jelaskan perilaku asimptotik setiap kurva (S, E, I, R) menuju nilai steady state
- Berikan nilai asimptot: S(∞), E(∞), I(∞), R(∞) untuk kedua skenario
- Analisis waktu konvergensi dan laju pendekatan ke steady state
- Jelaskan mengapa kurva mencapai saturasi atau keseimbangan

2. ALASAN NAIK/TURUN KURVA:
- Kurva Susceptible (S): Mengapa naik meski ada outflow? (karena rekrutmen μ₁N > losses)
- Kurva Exposed (E): Mengapa sigmoid? (balance antara inflow dari S dan outflow ke I)
- Kurva Addicted (I): 
  * Tanpa intervensi: Mengapa terus naik? (inflow β·E > outflow (γ+μ₂)·I)
  * Dengan intervensi: Mengapa puncak lalu turun? (θ=1 meningkatkan outflow drastis)
- Kurva Recovered (R): 
  * Tanpa intervensi: Mengapa pertumbuhan lambat? (hanya γ·I sebagai inflow)
  * Dengan intervensi: Mengapa eksponensial? ((γ+θ)·I meningkat signifikan)

3. TITIK KRITIS & TRANSISI:
- Jelaskan mengapa puncak I terjadi di bulan 8 dengan intervensi
- Analisis crossover point R>I (mengapa di bulan 15?)
- Efek delayed response dari intervensi (why not immediate?)

4. DAMPAK PARAMETER:
- Pengaruh θ=1 terhadap stabilitas sistem
- Sensitivitas R₀ terhadap perubahan parameter intervensi
- Implikasi praktis dari R₀ < 1 dalam konteks kecanduan game

5. INTERPRETASI MATEMATIKA:
- Hubungan eigenvalue dengan kecepatan konvergensi
- Makna fisik dari matriks Jacobian dalam konteks kecanduan
- Analisis bifurkasi dan critical threshold untuk intervensi
`;

export const paperFullText = `
<div>
<h1>Halaman 1</h1>
<p>
Jurnal Sainsmat, Maret 2020, Halaman 91-102<br/>
ISSN 2579-5686 (Online) ISSN 2086-6755 (Cetak)<br/>
http://ojs.unm.ac.id/index.php/sainsmat<br/>
Vol. IX, No. 1
</p>
<h2>Model SEAR Kecanduan Game Online pada Siswa di SMP Negeri 3 Makassar</h2>
<p><strong>SEAR Model of Online Game Addiction on Students in Junior High School 3 Makassar</strong></p>
<p>Syafruddin Side¹)*, Nurul Azizah Muzakir¹), Dian Pebriani¹), Syana Nurul Utari²)</p>
<p>
¹ Jurusan Matematika/ Program Studi Matematika, Universitas Negeri Makassar<br/>
² Jurusan Psikologi / Program Studi Psikologi, Universitas Negeri Makassar
</p>
<p>Received 11th March 2020 / Accepted 24th March 2020</p>
<h3>ABSTRAK</h3>
<p>
Penelitian ini membahas model matematika SEAR kecanduan game online. Data yang digunakan adalah data primer berupa jumlah siswa SMP Negeri 3 Makassar yang kecanduan game online yang diperoleh dengan cara membagikan angket kepada siswa. Penelitian ini dimulai dari membangun model SEAR kecanduan game online, menentukan titik keseimbangan, menganalisis kestabilan titik keseimbangan, menentukan nilai bilangan reproduksi dasar \\( R_0 \\), melakukan simulasi model menggunakan software Maple, dan menginterpretasikan hasil simulasi. Dalam artikel ini diperoleh model matematika SEAR kecanduan game online; dua titik keseimbangan, yaitu titik keseimbangan bebas kecanduan dan titik keseimbangan kecanduan; kestabilan titik keseimbangan bebas kecanduan dan kecanduan; serta bilangan reproduksi dasar \\( R_0 = 0,089 \\) yang menunjukkan bahwa tidak terjadi penularan kecanduan dari satu individu ke individu lain.
</p>
<p><strong>Kata kunci:</strong> Model Matematika, Kecanduan Game Online, Model SEAR.</p>
<h3>ABSTRACT</h3>
<p>
This research discuss a SEAR mathematical model of online game addiction. The data used is primary data of the number of students in Junior High School 3 Makassar who are addicted to online game which obtained by share the questionnaires to students. This research starts from constructing a SEAR model of online game addiction, determining the equilibrium point, analysing the stability of equilibrium point, determining the basic reproduction number (\\( R_0 \\)), doing a simulation of model using Maple, and interpreting the result of the simulation. In this paper we obtained a SEAR mathematical model of online game addiction; two equilibrium points which are addiction free and addiction equilibrium point; the stability of addiction free and addiction equilibrium; and the basic reproduction value \\( R_0 = 0,089 \\) indicates that there is no transmission of addiction from one individual to another.
</p>
<p><strong>Keywords:</strong> Mathematical Model, Game Online Addiction, SEAR Model</p>
<p>
*Korespondensi:<br/>
email: syafruddin@unm.ac.id
</p>
<p style="text-align:right;">91</p>

<h1>Halaman 2</h1>
<p>Model SEAR Kecanduan Game Online pada Siswa di SMP Negeri 3 Makassar</p>
<h3>PENDAHULUAN</h3>
<p>
Perkembangan teknologi berupa internet memberikan manfaat yang sangat besar bagi kemajuan di segala bidang kehidupan. Hari kehari internet menyuguhkan banyak penawaran yang menarik, alih-alih menggunakan internet untuk menyelesaikan tugas atau pekerjaan, kenyataannya banyak yang beralih pada game online (Prastyo, dkk, 2017).
</p>
<p>
Game online adalah permaian yang dimainkan secara online via internet (Syahran, 2015). Game dengan fasilitas online via internet menawarkan fasilitas lebih dibandingkan dengan game biasa (seperti video game) kerena pemain bisa berkomunikasi dengan pemain lain diseluruh penjuru dunia melalui chating (Syahran, 2015).
</p>
<p>
Di Indonesia, fenomena bermain game sudah banyak melibatkan remaja. Game online mendapatkan sambutan yang luar biasa, terutama bagi remaja yang duduk di bangku SMP maupun SMA.Menurut lembaga riset pemasaran asal Amsterdam, Newzoo, pada tahun 2017 terdapat 43,7 juta gamer (56% diantaranya merupakan laki-laki) di Indonesia. Jumlah pemain game di Indonesia terbanyak di Asia Tenggara, yang bermain game di telepon genggam, personal computer, dan laptop (Jaya, 2012).
</p>
<p>
Bermain game online memang kegiatan yang mengasikkan, dapat mengisi waktu luang dan menghilangkan stres, namun jika intensitas bermain game tidak dibatasi maka dapat membuat individu kecanduan.Santoso dan Purnomo (2017) mengatakan bahwa kecanduan adalah suatu aktivitas atau substansi yang dilakukan berulang-ulang dan dapat menimbulkan dampak negatif. Kecanduangame online ditandai oleh sejauh mana seseorangbermaingamesecaraberlebihan yang dapat berpengaruh negatif bagi pemain game tersebut (Prastyo, dkk, 2017).
</p>
<p>
Terdapat beberapa kasus penyimpangan yang dilakukan oleh pelajar disebabkan oleh kecanduan game online diantaranya berbohong kepada orang tua, bolos sekolah hanya untuk main game di warnet hingga mencuri uang agar bisa bermain game online.Lebih lanjut, OrganisasiKesehatan Dunia atauWorld Health Organizations (WHO) menetapkan kecanduan game ke dalam versiter baru International Statistical Classification of Diseases (ICD) sebagai penyakit gangguan mental untuk pertama kalinya. Dalam versi terbaru ICD-11, WHO menyebut bahwa kecanduan game merupakan disorders due to addictive behavior atau gangguan yang disebabkan oleh kebiasaan atau kecanduan (Putri, 2018).
</p>
<p>
Dengan adanya masalah mengenai kecanduan game online, maka perlu ditemukan penyelesaian dari masalah tersebut. Salah satu cara yaitu dengan membuatkan model matematika. Model matematika merupakan sekumpulan persamaan atau pertidaksamaan yang mengungkapkan perilaku suatu permasalahan yang nyata. Model matematika dibuat berdasarkan asumsi-asumsi. Model matematika yang telah dibentuk akan dilakukan analisis, agar model yang dibuat representatif terhadap permasalahan yang dibahas (Maesaroh, 2013; Side, dkk, 2016).
</p>
<p>
Model SEAR merupakan salah satu model matematikaepidemiologi yang membagi populasi menjadi empat subpopulasi, yaitu sub populasi individu berpotensi
</p>
<p style="text-align:right;">92</p>

<h1>Halaman 3</h1>
<p>Side (2020)</p>
<p>
(Susceptible), sub populasi individu terdeteksi penyakit tetapi belum terinfeksi (Exposed), subpopulasi individu kecanduan (Addicted), dan subpopulasi individu sembuh dari penyakit (Recovered) (Ansar, 2018).
</p>
<p>
Beberapa peneliti telah mengkaji model SEAR pada penularan penyakit maupun permasalahan mengenai kecanduan game online (Side, dkk, 2017; Ermilatni, 2016; Side, 2015; Syahran, 2015). Belum ada peneliti yang membuat model matematika SEAR pada kasus permasalahan sosial seperti kecanduan game online. Maka dari itu, penulis tertarik untuk mengkaji masalah kecanduan game online menggunakan model matematika SEAR, dimana terdapat empat subpopulasi yaitu subpopulasi Susceptible atau berpotensi kecanduan game online, subpopulasi Exposed atau mencoba bermain game online, subpopulasi Addicted atau kecanduan game online, dan subpopulasi Recovered atau tidak lagi bermain game online.
</p>
<p>
Tujuan dari penelitian ini adalah untuk membuat model matematika SEAR untuk kasus kecanduan game online pada siswa di SMP Negeri 3 Makassar, mengetahui titik keseimbangan model dan analisis kestabilan titik keseimbangan model, melakukan simulasi model dan menginterpretasikannya, serta mengetahui solusi dari masalah kecanduan game online pada siswa di SMP Negeri 3 Makassar.
</p>
<h3>Titik Keseimbangan Sistem</h3>
<p>
Titik keseimbangan adalah sebuah keadaan dari suatu sistem yang tidak berubah terhadap waktu. Jika sistem dinamika diuraikan dalam persamaan diferensial, maka titik keseimbangan dapat diperoleh dengan mengambil turunan pertama yang sama dengan nol.
</p>
<p>
Definisi 1.1 (Toaha, dkk, 2014) Titik [A]( x [A]in [A]mathbb{R}^n [A]) disebut titik keseimbangan (equilibrium point) dari [A]( [A]dot{x} = f(x) [A]) jika memenuhi [A]( f(x) = 0 [A]), dimana
$$ f(x) = [A]begin{pmatrix} f_1(x_1, x_2, [A]dots, x_n) [A][A] f_2(x_1, x_2, [A]dots, x_n) [A][A] [A]vdots [A][A] f_n(x_1, x_2, [A]dots, x_n) [A]end{pmatrix} $$
</p>
<h3>Analisis Kestabilan Titik Keseimbangan</h3>
<p>
Tinjau sistem PD non-linear orde n sebagai berikut<br/>
$$ [A]dot{x}_i = Ax + f_i(x_1, x_2, [A]dots, x_n) [A]quad [A]quad (1) $$
dimana [A]( i= 1,2, [A]dots, n [A])
</p>
<p>
Langkah awal penyelesaian persamaan (1) yakni dengan mencari titik keseimbangan. Misalkan diperoleh titik keseimbangan [A]( (x_1^*, x_2^*, [A]dots, x_n^*) [A]), maka langkah selanjutnya mencari matriks Jacobiannya. Misalkan<br/>
[A]( G_i (X_1, X_2, [A]dots, X_n) = Ax + f_i(x_1, x_2, [A]dots, x_n) [A]), matriks Jacobiannya adalah
$$ A = [A]begin{pmatrix} [A]frac{[A]partial G_1}{[A]partial x_1} & [A]cdots & [A]frac{[A]partial G_1}{[A]partial x_n} [A][A] [A]vdots & [A]ddots & [A]vdots [A][A] [A]frac{[A]partial G_n}{[A]partial x_1} & [A]cdots & [A]frac{[A]partial G_n}{[A]partial x_n} [A]end{pmatrix} $$
</p>
<p style="text-align:right;">93</p>

<h1>Halaman 4</h1>
<p>Model SEAR Kecanduan Game Online pada Siswa di SMP Negeri 3 Makassar</p>
<p>
Selanjutnya substitusi titik keseimbangan pada matriks Jacobi, maka diperoleh sistem yang linear sebagai berikut,<br/>
$$ [A]dot{U}_i = A(x_1^*, x_2^*, [A]dots, x_n^*)U $$
</p>
<p>
Penentuan kestabilan titik keseimbangan diperoleh dengan melihat nilai eigennya, yaitu [A]( [A]lambda_i [A]) dengan [A]( i= 1,2, [A]dots, n [A]) yang diperoleh dari [A]( [A]det([A]lambda I – A) = 0 [A])
</p>
<p>Secara umum kestabilan titik keseimbangan mempunyai dua perilaku, yaitu:</p>
<p>1. Stabil jika</p>
<p>   a. [A]( Re([A]lambda_i) < 0 [A]) untuk setiap [A](i[A]), atau</p>
<p>   b. Terdapat [A]( Re([A]lambda_j) = 0 [A]) untuk sebarang [A](j[A]) dan [A]( Re([A]lambda_i) < 0 [A]) untuk setiap [A]( i [A]neq j [A]).</p>
<p>2. Tidak stabil jika terdapat paling sedikit satu [A](i[A]) sehingga [A]( Re([A]lambda_i) > 0 [A]) (Toaha, 2014).</p>
<h3>Bilangan Reproduksi Dasar</h3>
<p>
Bilangan reproduksi dasar merupakan bilangan yang menunjukkan jumlah individu berpotensi yang dapat kecanduan game online yang disebabkan oleh satu individu kecanduan game online. Secara umum bilangan reproduksi dasar \\( R_0 \\) mempunyai tiga kemungkinan, yaitu:
</p>
<p>1. Jika [A]( R_0 < 1 [A]), maka kecanduan akan menghilang.</p>
<p>2. Jika [A]( R_0 = 1 [A]), maka kecanduan akan menetap.</p>
<p>3. Jika [A]( R_0 > 1 [A]), maka kecanduan akan menular</p>
<h3>METODE</h3>
<p>
Penelitian yang dilakukan merupakan jenis penelitian kajian teori dan terapan, yaitu dengan mengkaji literatur-literatur mengenai pemodelan matematika serta kecanduan game online. Data yang digunakan dalam penelitian ini adalah data primer jumlah siswa SMP Negeri 3 Makassar yang berpotensikecanduan, mulaibermain, kecanduan, dan berhentibermaingame online. Populasi dalam penelitian ini adalah seluruh siswa SMP Negeri 3 Makassar tahun ajaran 2018/2019 yang berjumlah 1194 siswa. Melihat banyaknya populasi penelitian, maka perlu ditarik sampel penelitian. Penarikan sampel dilakukan dengan teknik acak atau random sampling, yaitu mengacak kelas populasi. Pengacakan dilakukan karena semua kelas populasi homogen, sehingga jumlah sampel yang digunakan dalam penelitian ini berjumlah 176 siswa yang terdiri dari siswa kelas 7 dan kelas 8.
</p>
<p>Langkah-langkah yang dilakukan dalam penelitian ini adalah sebagai berikut</p>
<p>1. Membangun model SEAR kecanduan game online.</p>
<p>   a. Menentukan asumsi, variabel, dan parameter yang digunakan untuk model SEAR.</p>
<p>   b. Membentuk model SEAR kecanduan game online.</p>
<p>2. Menganalisis model SEAR kecanduan game online.</p>
<p>   a. Menentukan titik keseimbangan model SEAR.</p>
<p>   b. Menentukan jenis kestabilan titik keseimbangan berdasarkan nilai eigen.</p>
<p>   c. Menentukan bilangan reproduksi dasar (\\( R_0 \\)).</p>
<p style="text-align:right;">94</p>

<h1>Halaman 5</h1>
<p>Side (2020)</p>
<p>3. Melakukan simulasi model SEAR kecanduan game online menggunakan software Maple.</p>
<p>   a. Mengumpulkan data siswa SMP Negeri 3 Makassar yang kecanduan game online dengan cara membagikan angket kepada siswa.</p>
<p>   b. Menginput data siswa kecanduan game online.</p>
<p>   c. Menginput hasil analisis model ke dalam software.</p>
<p>   d. Menganalisis hasil simulasi.</p>
<p>   e. Menarik kesimpulan.</p>
<h3>HASIL DAN PEMBAHASAN</h3>
<h4>model SEAR Kecanduan Game Online</h4>
<p>
Dalam penelitian ini, populasi dalam model dibagi menjadi empat kelas, yaitu kelas Susceptible (S) yaitu berpotensi kecanduan game online, kelas Exposed (E) yaitu mencoba bermain game online, kelas Addicted (A) yaitu kecanduan game online, dan kelas Recovered (R) yaitu berhenti bermain game online.
</p>
<p>Terdapat beberapa asumsi yang digunakan dalam membuat model, yaitu</p>
<p>1. Terdapat siswa yang memiliki game online di gadgetnya dan tidak memiliki game online di gadgetnya.</p>
<p>2. Laju siswa yang tidak memiliki game online di gadgetnya dianggap konstan.</p>
<p>3. Siswa yang masuk kelas berpotensi kecanduan (Susceptible) adalah mereka memiliki game online di gadgetnya.</p>
<p>4. Siswa yang masuk kelas mencoba bermain game online (Exposed) adalah mereka yang mulai bermain game online dengan intensitas waktu yang normal (maksimal 2-3 jam sehari) atas dasar kemauan sendiri.</p>
<p>5. Siswa yang masuk kelas kecanduan (Addicted) adalah mereka yang secara terus menerus bermain game online; tidak akan berhenti bermain hingga merasa puas; tidak bisa lepas dari bermain game online; tidak menghiraukan masalah kesehatan seperti waktu tidur, kebersihan badan maupun pola makan; tidak menghiraukan hubungan interpersonalnya.</p>
<p>6. Siswa yang masuk kelasberhenti bermain game online (Recovered) adalah mereka yang sadar akan dampak negatif bermain game online secara berlebihan dan mencari aktivitas lain yang lebih positif dan bermanfaat.</p>
<p>7. Siswa yang kecanduan jika diberikan penanganan berupa pengawasan orang tua serta bimbingan dan konseling akan sembuh.</p>
<p style="text-align:right;">95</p>

<h1>Halaman 6</h1>
<p>model SEAR Kecanduan Game Online pada Siswa di SMP Negeri 3 Makassar</p>
<p>Skema model SEAR kecanduan game online dapat dilihat pada Gambar 1.</p>
<p>[Diagram Skema model SEAR]</p>
<p>
$$ [A]Lambda [A]rightarrow [S] [A]xrightarrow{[A]alpha} [E] [A]xrightarrow{[A]beta} [I] [A]xrightarrow{[A]gamma+[A]theta} [R] $$
$$ [A]quad [A]quad [A]downarrow [A]mu_2 [A]quad [A]quad [A]downarrow [A]mu_2 [A]quad [A]quad [A]downarrow [A]mu_2 [A]quad [A]quad [A]quad [A]downarrow [A]mu_2 $$
<p>Gambar 1. Skema model SEAR kecanduan game online</p>
<p>
Gambar 1. juga dapat ditafsirkan ke dalam model matematika yang merupakan persamaan diferensial nonlinear seperti berikut (dimana [A]( [A]Lambda = [A]mu_1 N [A]) ):
</p>
<div>
$$ [A]frac{dS}{dt} = [A]Lambda - ([A]alpha + [A]mu_2)S $$
$$ [A]frac{dE}{dt} = [A]alpha S - ([A]beta + [A]mu_2)E $$
$$ [A]frac{dI}{dt} = [A]beta E - ([A]gamma + [A]theta + [A]mu_2)I [A]quad [A]quad (1) $$
$$ [A]frac{dR}{dt} = ([A]gamma + [A]theta)I - [A]mu_2 R $$
</div>
<p>Tabel 1. Variabel dan parameter dalam model SEAR kecanduan game online</p>
<p>
<strong>Variabel / Parameter | Keterangan</strong><br/>
S | Jumlah siswa yang berpotensi kecanduan bermain game online<br/>
E | Jumlah siswa yang mencoba bermain game online<br/>
I | Jumlah siswa yang kecanduan bermain game online<br/>
R | Jumlah siswa yang tidak lagi bermain game online<br/>
[A]( [A]mu_1 [A]) | Laju siswa yang memiliki game online di gadgetnya (faktor rekrutmen untuk [A]( [A]Lambda [A]))<br/>
[A]( [A]mu_2 [A]) | Laju siswa yang tidak memiliki game online di gadgetnya / laju keluar alami<br/>
[A]( [A]alpha [A]) | Laju perpindahan siswa dari kelas berpotensi kecanduan (susceptible) ke kelas mencoba bermain (exposed)<br/>
[A]( [A]beta [A]) | Laju perpindahan siswa dari kelas mencoba bermain (exposed) ke kelas kecanduan (addicted)<br/>
[A]( [A]gamma [A]) | Laju perpindahan siswa dari kelas kecanduan (addicted) ke kelas tidak lagi bermain (recovered) secara alami<br/>
[A]( [A]theta [A]) | Efektivitas pengawasan orang tua serta program bimbingan dan konseling pada siswa (laju pemulihan tambahan karena intervensi)
</p>
<p>dimana N = S+E+I+R adalah total siswa yang diteliti.</p>
<p style="text-align:right;">96</p>

<h1>Halaman 7</h1>
<p>Side (2020)</p>
<h4>Analisis model SEAR Kecanduan Game Online</h4>
<h5>Penentuan titik keseimbangan</h5>
<p>
Akan dicari titik keseimbangan berdasarkan sistem persamaan (1). Titik keseimbangan terjadi pada saat [A]( ([A]frac{dS}{dt}, [A]frac{dE}{dt}, [A]frac{dI}{dt}, [A]frac{dR}{dt}) = (0,0,0,0) [A]). Sistem persamaan (1) memiliki dua titik keseimbangan, yaitu titik keseimbangan bebas kecanduan [A]( E_0 [A]) dan titik keseimbangan kecanduan [A]( E_[A]epsilon [A]). Titik keseimbangan bebas kecanduan diperoleh dengan asumsi bahwa E = 0 dan I = 0 yang berarti tidak ada individu yang kecanduan dan tidak ada penanganan. Berdasarkan sistem persamaan (1), diperoleh titik keseimbangan bebas kecanduan [A]( E_0(S, E, I, R) = ([A]frac{[A]mu_1 N}{[A]mu_2+[A]alpha}, 0,0,0) [A]). Untuk titik keseimbangan kecanduan, diperoleh [A]( E_[A]epsilon(S, E, I, R) = (S^*, E^*, I^*, R^*) [A]) dimana [A]( S^* = [A]frac{[A]mu_1 N}{[A]mu_2+[A]alpha} [A]), [A]( E^* = [A]frac{[A]alpha [A]mu_1 N}{([A]mu_2+[A]beta)([A]mu_2+[A]alpha)} [A]), [A]( I^* = [A]frac{[A]beta [A]alpha [A]mu_1 N}{([A]mu_2+[A]gamma+[A]theta)([A]mu_2+[A]beta)([A]mu_2+[A]alpha)} [A]), [A]( R^* = [A]frac{([A]gamma+[A]theta)[A]beta [A]alpha [A]mu_1 N}{[A]mu_2([A]mu_2+[A]gamma+[A]theta)([A]mu_2+[A]beta)([A]mu_2+[A]alpha)} [A])
</p>
<h5>Penentuan jenis kestabilan titik keseimbangan</h5>
<p>
Jenis kestabilan titikkeseimbangan bebas kecanduan [A]( E_0 [A]) diperoleh dengan melakukan pelinearan pada sistem persamaan (1) disekitar [A]( E_0 [A]), sehingga diperoleh matriks Jacobian sebagai berikut.
$$ J(E_0) = [A]begin{pmatrix} -([A]alpha+[A]mu_2) & 0 & 0 & 0 [A][A] [A]alpha & -([A]beta+[A]mu_2) & 0 & 0 [A][A] 0 & [A]beta & -([A]gamma+[A]theta+[A]mu_2) & 0 [A][A] 0 & 0 & [A]gamma+[A]theta & -[A]mu_2 [A]end{pmatrix} $$
</p>
<p>
Untuk mengetahui kestabilan [A]( E_0 [A]), maka dicari nilai eigen dari matiks [A]( J(E_0) [A]) dengan menentukan [A]( [A]det(J(E_0) - [A]lambda I) = 0 [A]), dimana [A]( [A]lambda [A]) adalah nilai eigen dan I adalah matriks identitas.
</p>
<p>
Diperoleh nilai eigen yaitu [A]( [A]lambda_1, [A]lambda_2, [A]lambda_3, [A]lambda_4 [A]) dengan [A]( [A]lambda_1 = -([A]alpha+[A]mu_2) [A]), [A]( [A]lambda_2 = -([A]beta+[A]mu_2) [A]), [A]( [A]lambda_3 = -([A]gamma+[A]theta+[A]mu_2) [A]), [A]( [A]lambda_4 = -[A]mu_2 [A]). Karena [A]( [A]alpha, [A]mu_2, [A]beta, [A]gamma, [A]theta [A]) bernilai positif maka bagian real dari keempat nilai eigen tersebut adalah negatif sehingga titik keseimbangan bebas kecanduan [A]( E_0 [A]) bersifat stabil.
</p>
<p>
Selanjutnya menentukan jenis kestabilan titik keseimbangan kecanduan [A]( E_[A]epsilon [A]) dengan cara yang sama seperti menentukan jenis kestabilan titikkeseimbanganbebas kecanduan [A]( E_0 [A]). Sehingga diperoleh nilai eigen yang juga menunjukkan bahwa bagian real dari keempat nilai eigen tersebut adalah negatif (dengan asumsi tertentu), sehingga titik keseimbangan kecanduan [A]( E_[A]epsilon [A]) bersifat stabil.
</p>
<p style="text-align:right;">97</p>

<h1>Halaman 8</h1>
<p>model SEAR Kecanduan Game Online pada Siswa di SMP Negeri 3 Makassar</p>
<h5>Bilangan reproduksi dasar</h5>
<p>
Bilangan reproduksi dasar dapat ditentukan menggunakan metode next generation matrix dari sistem persamaan (1). Pada model matematika tersebut, kelas kecanduan game online adalah addicted (A) sehingga persamaan diferensial yang digunakan adalah:<br/>
$$ [A]frac{dI}{dt} = [A]beta E - ([A]gamma + [A]theta + [A]mu_2)I $$
</p>
<p>
Misalkan [A]( [A]mathcal{F} = [A]beta E [A]) (laju infeksi baru) dan [A]( [A]mathcal{V} = ([A]gamma + [A]theta + [A]mu_2)I [A]) (laju transisi keluar dari I). Linearized F and V matrices for the next generation method are: <br/>
[A]( F = [A]begin{pmatrix} 0 & [A]beta [A][A] 0 & 0 [A]end{pmatrix} [A]), [A]( V = [A]begin{pmatrix} [A]gamma + [A]theta + [A]mu_2 & 0 [A][A] 0 & [A]text{some_val_for_E_eq} [A]end{pmatrix} [A]). The paper simplifies this for R0 as: <br/>
F (representing new infections into I) = [A]( [A]beta [A]). V (representing transfers out of I) = [A]( [A]gamma + [A]mu_2 + [A]theta [A]).
Maka, \\( R_0 \\) dihitung dari [A]( FV^{-1} [A]).
</p>
<p>
Secara sederhana seperti yang ditulis di paper:<br/>
Misalkan [A]( [A]phi = [A]beta E [A]) dan [A]( [A]psi = ([A]gamma + [A]theta + [A]mu_2)I [A]). F (laju infeksi baru) = [A]( [A]beta [A]), V (laju keluar dari I) = [A]( [A]gamma + [A]mu_2 + [A]theta [A]). Maka [A]( V^{-1} = [A]frac{1}{[A]gamma+[A]mu_2+[A]theta} [A]).
</p>
<p>
Next generation matrix [A]( K = FV^{-1} [A]).
</p>
<p>Maka diperoleh $$ R_0 = [A]frac{[A]beta}{[A]gamma+[A]theta+[A]mu_2} $$</p>
<h4>Simulasi model SEAR Kecanduan Game Online</h4>
<p>
Simulasi dilakukan menggunakan software Maple 18 dan dengan memberikan nilai untuk masing-masing parameter. Nilai-nilai parameter yang diambil sehingga diperoleh [A]( R_0 = 0,089 < 1 [A]) disajikan pada Tabel2. [A]( R_0 < 1 [A]) mengindikasikan bahwa tidak terjadi penularan kecanduan dari satu individu ke individu lain. Selanjutnya diberikan nilai awal siswa yang masuk kelas berpotensi S(0) adalah 72 siswa, siswa yang masuk kelas mencoba bermain E(0) adalah 77 siswa, siswa yang masuk kelompok kecanduan I(0) adalah 18 siswa, dan siswa yang masuk kelompok tidak lagi bermain R(0) adalah 9 siswa. Total siswa yang diteliti (N) adalah 176.
</p>
<p>Tabel 2. Nilai parameter dalam model SEAR kecanduan game online</p>
<p>
<strong>Parameter | Nilai</strong><br/>
[A]( [A]mu_1 [A]) | 0,409<br/>
[A]( [A]mu_2 [A]) | 0,097<br/>
[A]( [A]alpha [A])  | 0,438<br/>
[A]( [A]beta [A])  | 0,102<br/>
[A]( [A]gamma [A])  | 0,051<br/>
[A]( [A]theta [A])  | 1
</p>
<p>Sumber: Hasil olahan data Tahun 2019</p>
<p>Simulasi model SEAR tanpa pengawasan orang tua serta program bimbingan dan konseling dapat dilihat pada Gambar 2 sebagai berikut.</p>
<p style="text-align:right;">98</p>

<h1>Halaman 9</h1>
<p>Side (2020)</p>
<p>[Gambar 2. Plot model SEAR tanpa pengawasan orang tua serta bimbingan dan konseling pada siswa]</p>
<p>
Pada Gambar 2. terlihat bahwa jumlah siswa yang berpotensi kecanduan pada awal pengamatan adalah 72 orang dan diperkirakan akan bertambah setiap bulannya hingga bulan ke 36 mencapai kurang lebih 135 orang. Jumlah siswa yang mencoba bermain game online pada awal pengamatan adalah 77 orang dan diperkirakan akan bertambah setiap bulannya hingga bulan ke 36 mencapai kurang lebih 290 orang. Jumlah siswa yang kecanduan game online pada awal pengamatan adalah 18 orang dan diperkirakan akan bertambah setiap bulannya hingga bulan ke 36 mencapai 200 orang. Jumlah siswa yang tidak lagi bermain game online pada awal pengamatan adalah 9 orang dan diperkirakan akan bertambah setiap bulannya hingga bulan ke 36 mencapai kurang lebih 95 orang.
</p>
<p>Simulasi model SEAR dengan pengawasan orang tua serta program bimbingan dan konseling dapat dilihat pada Gambar 3 sebagai berikut.</p>
<p>[Gambar 3. Plot model SEAR dengan pengawasan orang tua serta bimbingan dan konseling pada siswa]</p>
<p style="text-align:right;">99</p>

<h1>Halaman 10</h1>
<p>model SEAR Kecanduan Game Online pada Siswa di SMP Negeri 3 Makassar</p>
<p>
Pada Gambar 3. terlihat bahwa jumlah siswa yang berpotensi kecanduan pada awal pengamatan adalah 72 orang dan diperkirakan akan bertambah setiap bulannya hingga bulan ke 36 mencapai kurang lebih 135 orang. Jumlah siswa yang mencoba bermain game online pada awal pengamatan adalah 77 orang dan diperkirakan akan bertambah setiap bulannya hingga bulan ke 36 mencapai kurang lebih 290 orang. Jumlah siswa yang kecanduan game online pada awal pengamatan adalah 18 orang dan jumlahnya akan menurun pada bulan ke 2, tetapi jumlah siswa yang kecanduan akan bertambah pada bulan berikutnya hingga bulan ke 36 mencapai 26 orang. Jumlah siswa yang tidak lagi bermain game online pada awal pengamatan adalah 9 orang dan diperkirakan akan bertambah setiap bulannya hingga bulan ke 36 mencapai kurang lebih 250 orang. Hal ini menunjukkan bahwa terjadi penurunan jumlah siswa yang kecanduan game online jika diberikan penanganan berupa pengawasan orang tua serta bimbingan dan konseling oleh guru kepada siswa yang kecanduan, dan meningkatkan jumlah siswa yang tidak lagi bermain game online.
</p>
<h4>Solusi Masalah Kecanduan Game Online pada Siswa di SMP Negeri 3 Makassar</h4>
<p>
Berdasarkan hasil simulasi model SEAR kecanduan game online, untuk mengurangi jumlah siswa SMP Negeri 3 Makassar yang kecanduan game online, solusi yang peneliti tawarkan bagi pihak sekolah berupa rekomendasi, yaitu
</p>
<p>1. Pihak sekolah menghimbau orang tua siswa agar senantiasa mengawasi anaknya dalam bermain game online.</p>
<p>2. Pihak sekolah memberdayakan program bimbingan dan konseling bagi para siswa baik yang merasa dirinya mulai kecanduan maupun yang telah kecanduan.</p>
<p>3. Pihak sekolah mengadakan seminar kepada orang tua siswa tentang game online dan masalah yang akan ditimbulkannya.</p>
<h3>KESIMPULAN</h3>
<p>Berdasarkan pembahasan yang telah dilakukan, diperoleh kesimpulan sebagai berikut</p>
<p>
1. Model matematika SEAR kecanduan game online dapat dinyatakan sebagai berikut
<div>
$$ [A]frac{dS}{dt} = [A]mu_1 N - ([A]alpha + [A]mu_2)S $$
$$ [A]frac{dE}{dt} = [A]alpha S - ([A]beta + [A]mu_2)E $$
$$ [A]frac{dI}{dt} = [A]beta E - ([A]gamma + [A]theta + [A]mu_2)I $$
$$ [A]frac{dR}{dt} = ([A]gamma + [A]theta)I - [A]mu_2 R $$
</div>
</p>
<p>
2. Model matematika SEAR kecanduan game online menghasilkan dua titik keseimbangan, yaitu titik keseimbangan bebas kecanduan dan titik keseimbangan kecanduan yang keduanya bersifat stabil.
</p>
<p>
3. Setelah melakukan simulasi model, diperoleh plot model tanpa penanganan dan dengan penanganan dan terdapat perbedaan pada jumlah siswa yang kecanduan game online dan tidak lagi bermain game online dari kedua simulasi model. Jika tidak ada penanganan sama sekali, diperkirakan jumlah siswa yang kecanduan tiga
</p>
<p style="text-align:right;">100</p>

<h1>Halaman 11</h1>
<p>Side (2020)</p>
<p>
tahun mendatang mencapai 200 orang dan jumlah siswa yang sadar akan dampak negatif bermain game online secara berlebihan dan memilih untuk tidak lagi bermain mencapai 95 orang. Berbeda jika diberi penanganan berupa pengawasan serta bimbingan dan konseling ke guru, jumlah siswa yang kecanduan tiga tahun mendatang menurun hingga mencapai 26 orang dan jumlah siswa yang sadar akan dampak negatif bermain game online secara berlebihan dan memilih untuk tidak lagi bermain meningkat menjadi 250 orang. Hal ini menunjukkan bahwa pengawasan orang tua serta bimbingan dan konseling sangat efektif untuk mengurangi jumlah siswa yang kecanduan serta meningkatkan jumlah siswa yang berhenti bermain game online.
</p>
<p>
4. Solusi permasalahan kecanduan game online pada siswa di SMP Negeri 3 Makassar yang peneliti tawarkan adalah rekomendasi untuk pihak sekolah dalam upaya mengurangi jumlah siswa yang kecanduan game online yaitu berupa pengawasan orang tua, program bimbingan dan konseling yang diberikan oleh guru kepada siswa, dan mengadakan seminar kepada siswa tentang game online dan masalah yang akan ditimbulkannya.
</p>
<h3>UCAPAN TERIMA KASIH</h3>
<p>
Ucapan terima kasih diberikan kepada pihak Jurusan Matematika Univeristas Negeri Makassar dan pihak pemberi dana penelitian yaitu Kemristekdikti.
</p>
<h3>DAFTAR PUSTAKA</h3>
<p>
Ansar A. 2018. Pemodelan Matematika SEAR dengan Vaksinasi pada Penyebaran Penyakit Malaria (Studi Kasus: Kabupaten Merauke). [Skripsi]. Makassar: Universitas Negeri Makassar.
</p>
<p>
Ermilatni E. 2016. Model Matematika SEAR untuk Kontrol Campak dengan Pengaruh Vaksinasi di Kabupaten Bulukumba. [Skripsi]. Makassar: Universitas Negeri Makassar.
</p>
<p>
Jaya ES. 2012. WHO Tetapkan Kecanduan Game Sebagai Gangguan Mental, Bagaimana “Gamer” Indonesia Bisa Sembuh?. https://theconversation.com/who-tetapkan-kecanduan-game-sebagai-gangguan-mental-bagaimana-gamer-indonesia-bisa-sembuh-99029. Diakses tanggal4 Desember 2018.
</p>
<p>
Maesaroh U. 2013. Model Matematika untuk Kontrol Campak Menggunakan Vaksinasi. [Skripsi]. Yogyakarta: Universitas Islam Negeri SunanKalijaga.
</p>
<p>
PrastyoY, EosinaP, FatimahF. 2017. Pembagian Tingkat Kecanduan Game Online Menggunakan K-Means Clustering serta Korelasinya terhadap Prestasi Akademik. Jurnal Universitas Negeri Yogyakarta, 2, 138-148.
</p>
<p style="text-align:right;">101</p>

<h1>Halaman 12</h1>
<p>model SEAR Kecanduan Game Online pada Siswa di SMP Negeri 3 Makassar</p>
<p>
Putri GS. 2018. WHO Resmi Tetapkan Kecanduan Game Sebagai Gangguan Mental. https://sains.kompas.com/read/2018/06/19/192900123/who-resmi-tetapkan-kecanduan-game-sebagai-gangguan-mental. Diakses tanggal 10 Juni 2019.
</p>
<p>
Santoso YRK, & Purnomo JT. 2017. Hubungan Kecanduan Game Online terhadap Penyesuaian Sosial pada Remaja. Jurnal Humaniora Yayayasan Bina Darma, 4, 27-44.
</p>
<p>
Side, S. 2015. model SEAR pada Penularan Hepatitis B. Jurnal Scientific Pinisi, 1, 97-102.
</p>
<p>
Side S, Sanusi W, Setiawan, NF. 2016. Analisis dan Simulasi Model SITR pada Penyebaran Penyakit Tuberkulosis di Kota Makassar. Jurnal Sainsmat, 5, 191-204.
</p>
<p>
SideS, Irwan, MulbarU, SanusiW. 2017. SEAR Model Simukation for Hepatitis B. Proceeding the 3rd Electric and Green Material International Conference (EGM) 2017.
</p>
<p>
Syahran, R. 2015. Ketergantungan Online Game dan Penanganannya. Jurnal Psikologi Pendidikan dan Konseling, 1, 84-92.
</p>
<p>
Toaha, Khaeruddin, Mansyur. 2014. Model SIR Untuk Penyebaran Penyakit Flu Burung. Jurnal Matematika, Statistika, & Komputasi, 10, 82-91.
</p>
<p style="text-align:right;">102</p>
</div>
`;
