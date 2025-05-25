
export const paperTitle = "Model SEIR Kecanduan Game Online pada Siswa di SMP Negeri 3 Makassar";

// Diagram kompartemen SEIR
export const compartmentDiagram = `
DIAGRAM KOMPARTEMEN MODEL SEIR KECANDUAN GAME ONLINE:

              Λ = μ₁N (Rekrutmen siswa dengan akses game)
                        ↓
    [S] ――α――→ [E] ――β――→ [I] ――γ+θ――→ [R]
     ↓         ↓         ↓           ↓
    μ₂        μ₂        μ₂          μ₂

KETERANGAN:
- S (Susceptible): Siswa berpotensi kecanduan game online
- E (Exposed): Siswa yang mulai bermain game online  
- I (Infected/Addicted): Siswa kecanduan game online
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
GRAFIK SIMULASI MODEL SEIR:

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
<h2>Model SEIR Kecanduan Game Online pada Siswa di SMP Negeri 3 Makassar</h2>
<p><strong>SEIR Model of Online Game Addiction on Students in Junior High School 3 Makassar</strong></p>
<p>Syafruddin Side¹)*, Nurul Azizah Muzakir¹), Dian Pebriani¹), Syana Nurul Utari²)</p>
<p>
¹ Jurusan Matematika/ Program Studi Matematika, Universitas Negeri Makassar<br/>
² Jurusan Psikologi / Program Studi Psikologi, Universitas Negeri Makassar
</p>
<p>Received 11th March 2020 / Accepted 24th March 2020</p>
<h3>ABSTRAK</h3>
<p>
Penelitian ini membahas model matematika SEIR kecanduan game online. Data yang digunakan adalah data primer berupa jumlah siswa SMP Negeri 3 Makassar yang kecanduan game online yang diperoleh dengan cara membagikan angket kepada siswa. Penelitian ini dimulai dari membangun model SEIR kecanduan game online, menentukan titik keseimbangan, menganalisis kestabilan titik keseimbangan, menentukan nilai bilangan reproduksi dasar \\( R_0 \\), melakukan simulasi model menggunakan software Maple, dan menginterpretasikan hasil simulasi. Dalam artikel ini diperoleh model matematika SEIR kecanduan game online; dua titik keseimbangan, yaitu titik keseimbangan bebas kecanduan dan titik keseimbangan kecanduan; kestabilan titik keseimbangan bebas kecanduan dan kecanduan; serta bilangan reproduksi dasar \\( R_0 = 0,089 \\) yang menunjukkan bahwa tidak terjadi penularan kecanduan dari satu individu ke individu lain.
</p>
<p><strong>Kata kunci:</strong> Model Matematika, Kecanduan Game Online, Model SEIR.</p>
<h3>ABSTRACT</h3>
<p>
This research discuss a SEIR mathematical model of online game addiction. The data used is primary data of the number of students in Junior High School 3 Makassar who are addicted to online game which obtained by share the questionnaires to students. This research starts from constructing a SEIR model of online game addiction, determining the equilibrium point, analysing the stability of equilibrium point, determining the basic reproduction number (\\( R_0 \\)), doing a simulation of model using Maple, and interpreting the result of the simulation. In this paper we obtained a SEIR mathematical model of online game addiction; two equilibrium points which are addiction free and addiction equilibrium point; the stability of addiction free and addiction equilibrium; and the basic reproduction value \\( R_0 = 0,089 \\) indicates that there is no transmission of addiction from one individual to another.
</p>
<p><strong>Keywords:</strong> Mathematical Model, Game Online Addiction, SEIR Model</p>
<p>
*Korespondensi:<br/>
email: syafruddin@unm.ac.id
</p>
<p style="text-align:right;">91</p>

<h1>Halaman 2</h1>
<p>Model SEIR Kecanduan Game Online pada Siswa di SMP Negeri 3 Makassar</p>
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
Model SEIR merupakan salah satu model matematikaepidemiologi yang membagi populasi menjadi empat subpopulasi, yaitu sub populasi individu berpotensi
</p>
<p style="text-align:right;">92</p>

<h1>Halaman 3</h1>
<p>Side (2020)</p>
<p>
(Susceptible), sub populasi individu terdeteksi penyakit tetapi belum terinfeksi (Exposed), subpopulasi individu terinfeksi (Infected), dan subpopulasi individu sembuh dari penyakit (Recovered) (Ansar, 2018).
</p>
<p>
Beberapa peneliti telah mengkaji model SEIR pada penularan penyakit maupun permasalahan mengenai kecanduan game online (Side, dkk, 2017; Ermilatni, 2016; Side, 2015; Syahran, 2015). Belum ada peneliti yang membuat model matematika SEIR pada kasus permasalahan sosial seperti kecanduan game online. Maka dari itu, penulis tertarik untuk mengkaji masalah kecanduan game online menggunakan model matematika SEIR, dimana terdapat empat subpopulasi yaitu subpopulasi Susceptible atau berpotensi kecanduan game online, subpopulasi Exposed atau mencoba bermain game online, subpopulasi Infected atau kecanduan game online, dan subpopulasi Recovered atau tidak lagi bermain game online.
</p>
<p>
Tujuan dari penelitian ini adalah untuk membuat model matematika SEIR untuk kasus kecanduan game online pada siswa di SMP Negeri 3 Makassar, mengetahui titik keseimbangan model dan analisis kestabilan titik keseimbangan model, melakukan simulasi model dan menginterpretasikannya, serta mengetahui solusi dari masalah kecanduan game online pada siswa di SMP Negeri 3 Makassar.
</p>
<h3>Titik Keseimbangan Sistem</h3>
<p>
Titik keseimbangan adalah sebuah keadaan dari suatu sistem yang tidak berubah terhadap waktu. Jika sistem dinamika diuraikan dalam persamaan diferensial, maka titik keseimbangan dapat diperoleh dengan mengambil turunan pertama yang sama dengan nol.
</p>
<p>
Definisi 1.1 (Toaha, dkk, 2014) Titik \\( x \\in \\mathbb{R}^n \\) disebut titik keseimbangan (equilibrium point) dari \\( \\dot{x} = f(x) \\) jika memenuhi \\( f(x) = 0 \\), dimana
$$ f(x) = \\begin{pmatrix} f_1(x_1, x_2, \\dots, x_n) \\\\ f_2(x_1, x_2, \\dots, x_n) \\\\ \\vdots \\\\ f_n(x_1, x_2, \\dots, x_n) \\end{pmatrix} $$
</p>
<h3>Analisis Kestabilan Titik Keseimbangan</h3>
<p>
Tinjau sistem PD non-linear orde n sebagai berikut<br/>
$$ \\dot{x}_i = Ax + f_i(x_1, x_2, \\dots, x_n) \\quad \\quad (1) $$
dimana \\( i= 1,2, \\dots, n \\)
</p>
<p>
Langkah awal penyelesaian persamaan (1) yakni dengan mencari titik keseimbangan. Misalkan diperoleh titik keseimbangan \\( (x_1^*, x_2^*, \\dots, x_n^*) \\), maka langkah selanjutnya mencari matriks Jacobiannya. Misalkan<br/>
\\( G_i (X_1, X_2, \\dots, X_n) = Ax + f_i(x_1, x_2, \\dots, x_n) \\), matriks Jacobiannya adalah
$$ A = \\begin{pmatrix} \\frac{\\partial G_1}{\\partial x_1} & \\cdots & \\frac{\\partial G_1}{\\partial x_n} \\\\ \\vdots & \\ddots & \\vdots \\\\ \\frac{\\partial G_n}{\\partial x_1} & \\cdots & \\frac{\\partial G_n}{\\partial x_n} \\end{pmatrix} $$
</p>
<p style="text-align:right;">93</p>

<h1>Halaman 4</h1>
<p>Model SEIR Kecanduan Game Online pada Siswa di SMP Negeri 3 Makassar</p>
<p>
Selanjutnya substitusi titik keseimbangan pada matriks Jacobi, maka diperoleh sistem yang linear sebagai berikut,<br/>
$$ \\dot{U}_i = A(x_1^*, x_2^*, \\dots, x_n^*)U $$
</p>
<p>
Penentuan kestabilan titik keseimbangan diperoleh dengan melihat nilai eigennya, yaitu \\( \\lambda_i \\) dengan \\( i= 1,2, \\dots, n \\) yang diperoleh dari \\( \\det(\\lambda I – A) = 0 \\)
</p>
<p>Secara umum kestabilan titik keseimbangan mempunyai dua perilaku, yaitu:</p>
<p>1. Stabil jika</p>
<p>   a. \\( Re(\\lambda_i) < 0 \\) untuk setiap \\(i\\), atau</p>
<p>   b. Terdapat \\( Re(\\lambda_j) = 0 \\) untuk sebarang \\(j\\) dan \\( Re(\\lambda_i) < 0 \\) untuk setiap \\( i \\neq j \\).</p>
<p>2. Tidak stabil jika terdapat paling sedikit satu \\(i\\) sehingga \\( Re(\\lambda_i) > 0 \\) (Toaha, 2014).</p>
<h3>Bilangan Reproduksi Dasar</h3>
<p>
Bilangan reproduksi dasar merupakan bilangan yang menunjukkan jumlah individu berpotensi yang dapat kecanduan game online yang disebabkan oleh satu individu kecanduan game online. Secara umum bilangan reproduksi dasar \\( R_0 \\) mempunyai tiga kemungkinan, yaitu:
</p>
<p>1. Jika \\( R_0 < 1 \\), maka kecanduan akan menghilang.</p>
<p>2. Jika \\( R_0 = 1 \\), maka kecanduan akan menetap.</p>
<p>3. Jika \\( R_0 > 1 \\), maka kecanduan akan menular</p>
<h3>METODE</h3>
<p>
Penelitian yang dilakukan merupakan jenis penelitian kajian teori dan terapan, yaitu dengan mengkaji literatur-literatur mengenai pemodelan matematika serta kecanduan game online. Data yang digunakan dalam penelitian ini adalah data primer jumlah siswa SMP Negeri 3 Makassar yang berpotensikecanduan, mulaibermain, kecanduan, dan berhentibermaingame online. Populasi dalam penelitian ini adalah seluruh siswa SMP Negeri 3 Makassar tahun ajaran 2018/2019 yang berjumlah 1194 siswa. Melihat banyaknya populasi penelitian, maka perlu ditarik sampel penelitian. Penarikan sampel dilakukan dengan teknik acak atau random sampling, yaitu mengacak kelas populasi. Pengacakan dilakukan karena semua kelas populasi homogen, sehingga jumlah sampel yang digunakan dalam penelitian ini berjumlah 176 siswa yang terdiri dari siswa kelas 7 dan kelas 8.
</p>
<p>Langkah-langkah yang dilakukan dalam penelitian ini adalah sebagai berikut</p>
<p>1. Membangun model SEIR kecanduan game online.</p>
<p>   a. Menentukan asumsi, variabel, dan parameter yang digunakan untuk model SEIR.</p>
<p>   b. Membentuk model SEIR kecanduan game online.</p>
<p>2. Menganalisis model SEIR kecanduan game online.</p>
<p>   a. Menentukan titik keseimbangan model SEIR.</p>
<p>   b. Menentukan jenis kestabilan titik keseimbangan berdasarkan nilai eigen.</p>
<p>   c. Menentukan bilangan reproduksi dasar (\\( R_0 \\)).</p>
<p style="text-align:right;">94</p>

<h1>Halaman 5</h1>
<p>Side (2020)</p>
<p>3. Melakukan simulasi model SEIR kecanduan game online menggunakan software Maple.</p>
<p>   a. Mengumpulkan data siswa SMP Negeri 3 Makassar yang kecanduan game online dengan cara membagikan angket kepada siswa.</p>
<p>   b. Menginput data siswa kecanduan game online.</p>
<p>   c. Menginput hasil analisis model ke dalam software.</p>
<p>   d. Menganalisis hasil simulasi.</p>
<p>   e. Menarik kesimpulan.</p>
<h3>HASIL DAN PEMBAHASAN</h3>
<h4>Model SEIR Kecanduan Game Online</h4>
<p>
Dalam penelitian ini, populasi dalam model dibagi menjadi empat kelas, yaitu kelas Susceptible (S) yaitu berpotensi kecanduan game online, kelas Exposed (E) yaitu mencoba bermain game online, kelas Infected (I) yaitu kecanduan game online, dan kelas Recovered (R) yaitu berhenti bermain game online.
</p>
<p>Terdapat beberapa asumsi yang digunakan dalam membuat model, yaitu</p>
<p>1. Terdapat siswa yang memiliki game online di gadgetnya dan tidak memiliki game online di gadgetnya.</p>
<p>2. Laju siswa yang tidak memiliki game online di gadgetnya dianggap konstan.</p>
<p>3. Siswa yang masuk kelas berpotensi kecanduan (Susceptible) adalah mereka memiliki game online di gadgetnya.</p>
<p>4. Siswa yang masuk kelas mencoba bermain game online (Exposed) adalah mereka yang mulai bermain game online dengan intensitas waktu yang normal (maksimal 2-3 jam sehari) atas dasar kemauan sendiri.</p>
<p>5. Siswa yang masuk kelas kecanduan (Infected) adalah mereka yang secara terus menerus bermain game online; tidak akan berhenti bermain hingga merasa puas; tidak bisa lepas dari bermain game online; tidak menghiraukan masalah kesehatan seperti waktu tidur, kebersihan badan maupun pola makan; tidak menghiraukan hubungan interpersonalnya.</p>
<p>6. Siswa yang masuk kelasberhenti bermain game online (Recovered) adalah mereka yang sadar akan dampak negatif bermain game online secara berlebihan dan mencari aktivitas lain yang lebih positif dan bermanfaat.</p>
<p>7. Siswa yang kecanduan jika diberikan penanganan berupa pengawasan orang tua serta bimbingan dan konseling akan sembuh.</p>
<p style="text-align:right;">95</p>

<h1>Halaman 6</h1>
<p>Model SEIR Kecanduan Game Online pada Siswa di SMP Negeri 3 Makassar</p>
<p>Skema model SEIR kecanduan game online dapat dilihat pada Gambar 1.</p>
<p>[Diagram Skema Model SEIR]</p>
<p>
$$ \\Lambda \\rightarrow [S] \\xrightarrow{\\alpha} [E] \\xrightarrow{\\beta} [I] \\xrightarrow{\\gamma+\\theta} [R] $$
$$ \\quad \\quad \\downarrow \\mu_2 \\quad \\quad \\downarrow \\mu_2 \\quad \\quad \\downarrow \\mu_2 \\quad \\quad \\quad \\downarrow \\mu_2 $$
<p>Gambar 1. Skema model SEIR kecanduan game online</p>
<p>
Gambar 1. juga dapat ditafsirkan ke dalam model matematika yang merupakan persamaan diferensial nonlinear seperti berikut (dimana \\( \\Lambda = \\mu_1 N \\) ):
</p>
<div>
$$ \\frac{dS}{dt} = \\Lambda - (\\alpha + \\mu_2)S $$
$$ \\frac{dE}{dt} = \\alpha S - (\\beta + \\mu_2)E $$
$$ \\frac{dI}{dt} = \\beta E - (\\gamma + \\theta + \\mu_2)I \\quad \\quad (1) $$
$$ \\frac{dR}{dt} = (\\gamma + \\theta)I - \\mu_2 R $$
</div>
<p>Tabel 1. Variabel dan parameter dalam model SEIR kecanduan game online</p>
<p>
<strong>Variabel / Parameter | Keterangan</strong><br/>
S | Jumlah siswa yang berpotensi kecanduan bermain game online<br/>
E | Jumlah siswa yang mencoba bermain game online<br/>
I | Jumlah siswa yang kecanduan bermain game online<br/>
R | Jumlah siswa yang tidak lagi bermain game online<br/>
\\( \\mu_1 \\) | Laju siswa yang memiliki game online di gadgetnya (faktor rekrutmen untuk \\( \\Lambda \\))<br/>
\\( \\mu_2 \\) | Laju siswa yang tidak memiliki game online di gadgetnya / laju keluar alami<br/>
\\( \\alpha \\) | Laju perpindahan siswa dari kelas berpotensi kecanduan (susceptible) ke kelas mencoba bermain (exposed)<br/>
\\( \\beta \\) | Laju perpindahan siswa dari kelas mencoba bermain (exposed) ke kelas kecanduan (infected)<br/>
\\( \\gamma \\) | Laju perpindahan siswa dari kelas kecanduan (infected) ke kelas tidak lagi bermain (recovered) secara alami<br/>
\\( \\theta \\) | Efektivitas pengawasan orang tua serta program bimbingan dan konseling pada siswa (laju pemulihan tambahan karena intervensi)
</p>
<p>dimana N = S+E+I+R adalah total siswa yang diteliti.</p>
<p style="text-align:right;">96</p>

<h1>Halaman 7</h1>
<p>Side (2020)</p>
<h4>Analisis Model SEIR Kecanduan Game Online</h4>
<h5>Penentuan titik keseimbangan</h5>
<p>
Akan dicari titik keseimbangan berdasarkan sistem persamaan (1). Titik keseimbangan terjadi pada saat \\( (\\frac{dS}{dt}, \\frac{dE}{dt}, \\frac{dI}{dt}, \\frac{dR}{dt}) = (0,0,0,0) \\). Sistem persamaan (1) memiliki dua titik keseimbangan, yaitu titik keseimbangan bebas kecanduan \\( E_0 \\) dan titik keseimbangan kecanduan \\( E_\\epsilon \\). Titik keseimbangan bebas kecanduan diperoleh dengan asumsi bahwa E = 0 dan I = 0 yang berarti tidak ada individu yang kecanduan dan tidak ada penanganan. Berdasarkan sistem persamaan (1), diperoleh titik keseimbangan bebas kecanduan \\( E_0(S, E, I, R) = (\\frac{\\mu_1 N}{\\mu_2+\\alpha}, 0,0,0) \\). Untuk titik keseimbangan kecanduan, diperoleh \\( E_\\epsilon(S, E, I, R) = (S^*, E^*, I^*, R^*) \\) dimana \\( S^* = \\frac{\\mu_1 N}{\\mu_2+\\alpha} \\), \\( E^* = \\frac{\\alpha \\mu_1 N}{(\\mu_2+\\beta)(\\mu_2+\\alpha)} \\), \\( I^* = \\frac{\\beta \\alpha \\mu_1 N}{(\\mu_2+\\gamma+\\theta)(\\mu_2+\\beta)(\\mu_2+\\alpha)} \\), \\( R^* = \\frac{(\\gamma+\\theta)\\beta \\alpha \\mu_1 N}{\\mu_2(\\mu_2+\\gamma+\\theta)(\\mu_2+\\beta)(\\mu_2+\\alpha)} \\)
</p>
<h5>Penentuan jenis kestabilan titik keseimbangan</h5>
<p>
Jenis kestabilan titikkeseimbangan bebas kecanduan \\( E_0 \\) diperoleh dengan melakukan pelinearan pada sistem persamaan (1) disekitar \\( E_0 \\), sehingga diperoleh matriks Jacobian sebagai berikut.
$$ J(E_0) = \\begin{pmatrix} -(\\alpha+\\mu_2) & 0 & 0 & 0 \\\\ \\alpha & -(\\beta+\\mu_2) & 0 & 0 \\\\ 0 & \\beta & -(\\gamma+\\theta+\\mu_2) & 0 \\\\ 0 & 0 & \\gamma+\\theta & -\\mu_2 \\end{pmatrix} $$
</p>
<p>
Untuk mengetahui kestabilan \\( E_0 \\), maka dicari nilai eigen dari matiks \\( J(E_0) \\) dengan menentukan \\( \\det(J(E_0) - \\lambda I) = 0 \\), dimana \\( \\lambda \\) adalah nilai eigen dan I adalah matriks identitas.
</p>
<p>
Diperoleh nilai eigen yaitu \\( \\lambda_1, \\lambda_2, \\lambda_3, \\lambda_4 \\) dengan \\( \\lambda_1 = -(\\alpha+\\mu_2) \\), \\( \\lambda_2 = -(\\beta+\\mu_2) \\), \\( \\lambda_3 = -(\\gamma+\\theta+\\mu_2) \\), \\( \\lambda_4 = -\\mu_2 \\). Karena \\( \\alpha, \\mu_2, \\beta, \\gamma, \\theta \\) bernilai positif maka bagian real dari keempat nilai eigen tersebut adalah negatif sehingga titik keseimbangan bebas kecanduan \\( E_0 \\) bersifat stabil.
</p>
<p>
Selanjutnya menentukan jenis kestabilan titik keseimbangan kecanduan \\( E_\\epsilon \\) dengan cara yang sama seperti menentukan jenis kestabilan titikkeseimbanganbebas kecanduan \\( E_0 \\). Sehingga diperoleh nilai eigen yang juga menunjukkan bahwa bagian real dari keempat nilai eigen tersebut adalah negatif (dengan asumsi tertentu), sehingga titik keseimbangan kecanduan \\( E_\\epsilon \\) bersifat stabil.
</p>
<p style="text-align:right;">97</p>

<h1>Halaman 8</h1>
<p>Model SEIR Kecanduan Game Online pada Siswa di SMP Negeri 3 Makassar</p>
<h5>Bilangan reproduksi dasar</h5>
<p>
Bilangan reproduksi dasar dapat ditentukan menggunakan metode next generation matrix dari sistem persamaan (1). Pada model matematika tersebut, kelas kecanduan game online adalah infected (I) sehingga persamaan diferensial yang digunakan adalah:<br/>
$$ \\frac{dI}{dt} = \\beta E - (\\gamma + \\theta + \\mu_2)I $$
</p>
<p>
Misalkan \\( \\mathcal{F} = \\beta E \\) (laju infeksi baru) dan \\( \\mathcal{V} = (\\gamma + \\theta + \\mu_2)I \\) (laju transisi keluar dari I). Linearized F and V matrices for the next generation method are: <br/>
\\( F = \\begin{pmatrix} 0 & \\beta \\\\ 0 & 0 \\end{pmatrix} \\), \\( V = \\begin{pmatrix} \\gamma + \\theta + \\mu_2 & 0 \\\\ 0 & \\text{some_val_for_E_eq} \\end{pmatrix} \\). The paper simplifies this for R0 as: <br/>
F (representing new infections into I) = \\( \\beta \\). V (representing transfers out of I) = \\( \\gamma + \\mu_2 + \\theta \\).
Maka, \\( R_0 \\) dihitung dari \\( FV^{-1} \\).
</p>
<p>
Secara sederhana seperti yang ditulis di paper:<br/>
Misalkan \\( \\phi = \\beta E \\) dan \\( \\psi = (\\gamma + \\theta + \\mu_2)I \\). F (laju infeksi baru) = \\( \\beta \\), V (laju keluar dari I) = \\( \\gamma + \\mu_2 + \\theta \\). Maka \\( V^{-1} = \\frac{1}{\\gamma+\\mu_2+\\theta} \\).
</p>
<p>
Next generation matrix \\( K = FV^{-1} \\).
</p>
<p>Maka diperoleh $$ R_0 = \\frac{\\beta}{\\gamma+\\theta+\\mu_2} $$</p>
<h4>Simulasi Model SEIR Kecanduan Game Online</h4>
<p>
Simulasi dilakukan menggunakan software Maple 18 dan dengan memberikan nilai untuk masing-masing parameter. Nilai-nilai parameter yang diambil sehingga diperoleh \\( R_0 = 0,089 < 1 \\) disajikan pada Tabel2. \\( R_0 < 1 \\) mengindikasikan bahwa tidak terjadi penularan kecanduan dari satu individu ke individu lain. Selanjutnya diberikan nilai awal siswa yang masuk kelas berpotensi S(0) adalah 72 siswa, siswa yang masuk kelas mencoba bermain E(0) adalah 77 siswa, siswa yang masuk kelompok kecanduan I(0) adalah 18 siswa, dan siswa yang masuk kelompok tidak lagi bermain R(0) adalah 9 siswa. Total siswa yang diteliti (N) adalah 176.
</p>
<p>Tabel 2. Nilai parameter dalam model SEIR kecanduan game online</p>
<p>
<strong>Parameter | Nilai</strong><br/>
\\( \\mu_1 \\) | 0,409<br/>
\\( \\mu_2 \\) | 0,097<br/>
\\( \\alpha \\)  | 0,438<br/>
\\( \\beta \\)  | 0,102<br/>
\\( \\gamma \\)  | 0,051<br/>
\\( \\theta \\)  | 1
</p>
<p>Sumber: Hasil olahan data Tahun 2019</p>
<p>Simulasi model SEIR tanpa pengawasan orang tua serta program bimbingan dan konseling dapat dilihat pada Gambar 2 sebagai berikut.</p>
<p style="text-align:right;">98</p>

<h1>Halaman 9</h1>
<p>Side (2020)</p>
<p>[Gambar 2. Plot model SEIR tanpa pengawasan orang tua serta bimbingan dan konseling pada siswa]</p>
<p>
Pada Gambar 2. terlihat bahwa jumlah siswa yang berpotensi kecanduan pada awal pengamatan adalah 72 orang dan diperkirakan akan bertambah setiap bulannya hingga bulan ke 36 mencapai kurang lebih 135 orang. Jumlah siswa yang mencoba bermain game online pada awal pengamatan adalah 77 orang dan diperkirakan akan bertambah setiap bulannya hingga bulan ke 36 mencapai kurang lebih 290 orang. Jumlah siswa yang kecanduan game online pada awal pengamatan adalah 18 orang dan diperkirakan akan bertambah setiap bulannya hingga bulan ke 36 mencapai 200 orang. Jumlah siswa yang tidak lagi bermain game online pada awal pengamatan adalah 9 orang dan diperkirakan akan bertambah setiap bulannya hingga bulan ke 36 mencapai kurang lebih 95 orang.
</p>
<p>Simulasi model SEIR dengan pengawasan orang tua serta program bimbingan dan konseling dapat dilihat pada Gambar 3 sebagai berikut.</p>
<p>[Gambar 3. Plot model SEIR dengan pengawasan orang tua serta bimbingan dan konseling pada siswa]</p>
<p style="text-align:right;">99</p>

<h1>Halaman 10</h1>
<p>Model SEIR Kecanduan Game Online pada Siswa di SMP Negeri 3 Makassar</p>
<p>
Pada Gambar 3. terlihat bahwa jumlah siswa yang berpotensi kecanduan pada awal pengamatan adalah 72 orang dan diperkirakan akan bertambah setiap bulannya hingga bulan ke 36 mencapai kurang lebih 135 orang. Jumlah siswa yang mencoba bermain game online pada awal pengamatan adalah 77 orang dan diperkirakan akan bertambah setiap bulannya hingga bulan ke 36 mencapai kurang lebih 290 orang. Jumlah siswa yang kecanduan game online pada awal pengamatan adalah 18 orang dan jumlahnya akan menurun pada bulan ke 2, tetapi jumlah siswa yang kecanduan akan bertambah pada bulan berikutnya hingga bulan ke 36 mencapai 26 orang. Jumlah siswa yang tidak lagi bermain game online pada awal pengamatan adalah 9 orang dan diperkirakan akan bertambah setiap bulannya hingga bulan ke 36 mencapai kurang lebih 250 orang. Hal ini menunjukkan bahwa terjadi penurunan jumlah siswa yang kecanduan game online jika diberikan penanganan berupa pengawasan orang tua serta bimbingan dan konseling oleh guru kepada siswa yang kecanduan, dan meningkatkan jumlah siswa yang tidak lagi bermain game online.
</p>
<h4>Solusi Masalah Kecanduan Game Online pada Siswa di SMP Negeri 3 Makassar</h4>
<p>
Berdasarkan hasil simulasi model SEIR kecanduan game online, untuk mengurangi jumlah siswa SMP Negeri 3 Makassar yang kecanduan game online, solusi yang peneliti tawarkan bagi pihak sekolah berupa rekomendasi, yaitu
</p>
<p>1. Pihak sekolah menghimbau orang tua siswa agar senantiasa mengawasi anaknya dalam bermain game online.</p>
<p>2. Pihak sekolah memberdayakan program bimbingan dan konseling bagi para siswa baik yang merasa dirinya mulai kecanduan maupun yang telah kecanduan.</p>
<p>3. Pihak sekolah mengadakan seminar kepada orang tua siswa tentang game online dan masalah yang akan ditimbulkannya.</p>
<h3>KESIMPULAN</h3>
<p>Berdasarkan pembahasan yang telah dilakukan, diperoleh kesimpulan sebagai berikut</p>
<p>
1. Model matematika SEIR kecanduan game online dapat dinyatakan sebagai berikut
<div>
$$ \\frac{dS}{dt} = \\mu_1 N - (\\alpha + \\mu_2)S $$
$$ \\frac{dE}{dt} = \\alpha S - (\\beta + \\mu_2)E $$
$$ \\frac{dI}{dt} = \\beta E - (\\gamma + \\theta + \\mu_2)I $$
$$ \\frac{dR}{dt} = (\\gamma + \\theta)I - \\mu_2 R $$
</div>
</p>
<p>
2. Model matematika SEIR kecanduan game online menghasilkan dua titik keseimbangan, yaitu titik keseimbangan bebas kecanduan dan titik keseimbangan kecanduan yang keduanya bersifat stabil.
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
Ansar A. 2018. Pemodelan Matematika SEIR dengan Vaksinasi pada Penyebaran Penyakit Malaria (Studi Kasus: Kabupaten Merauke). [Skripsi]. Makassar: Universitas Negeri Makassar.
</p>
<p>
Ermilatni E. 2016. Model Matematika SEIR untuk Kontrol Campak dengan Pengaruh Vaksinasi di Kabupaten Bulukumba. [Skripsi]. Makassar: Universitas Negeri Makassar.
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
<p>Model SEIR Kecanduan Game Online pada Siswa di SMP Negeri 3 Makassar</p>
<p>
Putri GS. 2018. WHO Resmi Tetapkan Kecanduan Game Sebagai Gangguan Mental. https://sains.kompas.com/read/2018/06/19/192900123/who-resmi-tetapkan-kecanduan-game-sebagai-gangguan-mental. Diakses tanggal 10 Juni 2019.
</p>
<p>
Santoso YRK, & Purnomo JT. 2017. Hubungan Kecanduan Game Online terhadap Penyesuaian Sosial pada Remaja. Jurnal Humaniora Yayayasan Bina Darma, 4, 27-44.
</p>
<p>
Side, S. 2015. Model SEIR pada Penularan Hepatitis B. Jurnal Scientific Pinisi, 1, 97-102.
</p>
<p>
Side S, Sanusi W, Setiawan, NF. 2016. Analisis dan Simulasi Model SITR pada Penyebaran Penyakit Tuberkulosis di Kota Makassar. Jurnal Sainsmat, 5, 191-204.
</p>
<p>
SideS, Irwan, MulbarU, SanusiW. 2017. SEIR Model Simukation for Hepatitis B. Proceeding the 3rd Electric and Green Material International Conference (EGM) 2017.
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
