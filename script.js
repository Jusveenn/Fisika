/* =====================================================
   PHYSICS HUB — script.js
   All interactive features for Physics Hub website
   ===================================================== */

'use strict';

/* ===== LOADING SCREEN ===== */
(function initLoading() {
  const screen = document.getElementById('loading-screen');
  const bar    = document.getElementById('loading-bar');
  if (!screen || !bar) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      bar.style.width = '100%';
      setTimeout(() => {
        screen.classList.add('hidden');
        document.body.style.overflow = '';
        // trigger scroll animations after load
        observeScrollAnimations();
        animateHeroStats();
        spawnParticles();
      }, 400);
    }
    bar.style.width = Math.min(progress, 100) + '%';
  }, 80);

  document.body.style.overflow = 'hidden';
})();

/* ===== TOAST NOTIFICATION ===== */
function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `
    <span class="toast-icon" aria-hidden="true">${icons[type] || icons.info}</span>
    <span>${message}</span>
    <button class="toast-close" aria-label="Tutup notifikasi">✕</button>
  `;

  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => removeToast(toast));

  container.appendChild(toast);

  if (duration > 0) {
    setTimeout(() => removeToast(toast), duration);
  }
}

function removeToast(toast) {
  if (!toast || toast.classList.contains('removing')) return;
  toast.classList.add('removing');
  setTimeout(() => toast.remove(), 300);
}

/* ===== THEME TOGGLE ===== */
(function initTheme() {
  const btn  = document.getElementById('theme-toggle');
  const html = document.documentElement;
  const saved = localStorage.getItem('ph-theme') || 'dark';
  html.setAttribute('data-theme', saved);

  btn && btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('ph-theme', next);
    showToast(next === 'dark' ? '🌙 Mode gelap aktif' : '☀️ Mode terang aktif', 'info', 2000);
  });
})();

/* ===== NAVBAR ===== */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const links     = document.querySelectorAll('.nav-link');

  // Scrolled class
  window.addEventListener('scroll', () => {
    navbar && navbar.classList.toggle('scrolled', window.scrollY > 20);
    updateActiveNav();
    toggleBackToTop();
  }, { passive: true });

  // Hamburger
  hamburger && hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close on link click (mobile)
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger && hamburger.classList.remove('open');
      hamburger && hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger && hamburger.classList.remove('open');
    }
  });
})();

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });
}

/* ===== BACK TO TOP ===== */
function toggleBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  btn.classList.toggle('visible', window.scrollY > 400);
}
document.getElementById('back-to-top') &&
  document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

/* ===== SCROLL ANIMATIONS ===== */
function observeScrollAnimations() {
  const els = document.querySelectorAll('.animate-on-scroll');
  if (!window.IntersectionObserver) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }),
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  els.forEach(el => observer.observe(el));
}

/* ===== HERO STAT COUNTER ===== */
function animateHeroStats() {
  document.querySelectorAll('.stat-number[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    let current  = 0;
    const step   = Math.ceil(target / 30);
    const timer  = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 40);
  });
}

/* ===== HERO PARTICLES ===== */
function spawnParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'hero-particle';
    const size = Math.random() * 6 + 3;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      animation-duration:${Math.random()*12+8}s;
      animation-delay:${Math.random()*8}s;
    `;
    container.appendChild(p);
  }
}

/* ===== FOOTER YEAR ===== */
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ===== KEYBOARD SHORTCUTS ===== */
document.addEventListener('keydown', e => {
  // Ctrl+D = theme toggle
  if (e.ctrlKey && e.key === 'd') {
    e.preventDefault();
    document.getElementById('theme-toggle') && document.getElementById('theme-toggle').click();
  }
  // Ctrl+F = focus search
  if (e.ctrlKey && e.key === 'f') {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      e.preventDefault();
      searchInput.focus();
      document.getElementById('materi') && document.getElementById('materi').scrollIntoView({ behavior: 'smooth' });
    }
  }
  // Ctrl+ArrowUp = back to top
  if (e.ctrlKey && e.key === 'ArrowUp') {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // Escape = close mobile menu
  if (e.key === 'Escape') {
    const navLinks = document.getElementById('nav-links');
    const hamburger = document.getElementById('hamburger');
    navLinks && navLinks.classList.remove('open');
    hamburger && hamburger.classList.remove('open');
  }
});

/* =====================================================
   MATERI DATA — 20 bab fisika SMA lengkap
   ===================================================== */
const MATERI_DATA = [
  {
    id: 0, title: 'Besaran dan Satuan', category: 'mekanika',
    content: {
      description: 'Besaran fisika adalah sesuatu yang dapat diukur dan dinyatakan dengan angka serta memiliki satuan. Pemahaman besaran dan satuan merupakan fondasi dari seluruh kajian fisika.',
      concepts: [
        'Besaran Pokok: 7 besaran dasar dalam SI (panjang, massa, waktu, suhu, kuat arus, intensitas cahaya, jumlah zat)',
        'Besaran Turunan: besaran yang diturunkan dari besaran pokok (kecepatan, percepatan, gaya, energi, dll)',
        'Dimensi: cara menyatakan besaran menggunakan besaran pokok dengan simbol tertentu',
        'Angka Penting: angka yang diperoleh dari hasil pengukuran yang bermakna'
      ],
      formulas: [
        { name: 'Dimensi Kecepatan', formula: '[v] = L·T⁻¹' },
        { name: 'Dimensi Percepatan', formula: '[a] = L·T⁻²' },
        { name: 'Dimensi Gaya', formula: '[F] = M·L·T⁻²' },
        { name: 'Dimensi Energi', formula: '[E] = M·L²·T⁻²' }
      ],
      symbols: 'L = panjang (m), M = massa (kg), T = waktu (s), I = kuat arus (A), θ = suhu (K)',
      example: {
        soal: 'Tentukan dimensi dari tekanan (P)! Diketahui tekanan = Gaya / Luas',
        steps: [
          'Gaya memiliki dimensi [F] = M·L·T⁻²',
          'Luas memiliki dimensi [A] = L²',
          'Maka tekanan [P] = [F]/[A] = M·L·T⁻² / L²',
          'Sederhanakan: [P] = M·L⁻¹·T⁻²'
        ],
        jawaban: 'Dimensi tekanan adalah M·L⁻¹·T⁻²'
      },
      summary: 'Besaran pokok ada 7 dalam SI. Besaran turunan diturunkan dari besaran pokok. Dimensi digunakan untuk memeriksa kebenaran suatu persamaan fisika (analisis dimensi).'
    }
  },
  {
    id: 1, title: 'Vektor', category: 'mekanika',
    content: {
      description: 'Vektor adalah besaran fisika yang memiliki besar (nilai) dan arah, berbeda dengan besaran skalar yang hanya memiliki besar. Contoh vektor: perpindahan, kecepatan, gaya, medan listrik.',
      concepts: [
        'Besaran Skalar: hanya memiliki besar (massa, suhu, kecepatan, energi)',
        'Besaran Vektor: memiliki besar dan arah (perpindahan, gaya, percepatan)',
        'Penjumlahan Vektor: metode segitiga, jajargenjang, atau komponen',
        'Perkalian Vektor: dot product (skalar) dan cross product (vektor)'
      ],
      formulas: [
        { name: 'Besar Resultan (dua vektor)', formula: 'R = √(A² + B² + 2AB·cos θ)' },
        { name: 'Komponen X', formula: 'Aₓ = A·cos θ' },
        { name: 'Komponen Y', formula: 'Aᵧ = A·sin θ' },
        { name: 'Besar Vektor dari Komponen', formula: 'A = √(Aₓ² + Aᵧ²)' },
        { name: 'Sudut Vektor', formula: 'θ = arctan(Aᵧ / Aₓ)' }
      ],
      symbols: 'R = resultan, A,B = besar vektor, θ = sudut antara vektor',
      example: {
        soal: 'Dua gaya F₁ = 30 N dan F₂ = 40 N membentuk sudut 90°. Tentukan resultan gaya!',
        steps: [
          'Diketahui: F₁ = 30 N, F₂ = 40 N, θ = 90°',
          'R = √(F₁² + F₂² + 2·F₁·F₂·cos 90°)',
          'cos 90° = 0, sehingga R = √(30² + 40²)',
          'R = √(900 + 1600) = √2500 = 50 N'
        ],
        jawaban: 'Resultan gaya = 50 N'
      },
      summary: 'Vektor memiliki besar dan arah. Penjumlahan vektor bisa dilakukan dengan metode grafis (segitiga/jajargenjang) atau analitik (komponen). Untuk sudut 90°, gunakan teorema Pythagoras.'
    }
  },
  {
    id: 2, title: 'Gerak Lurus', category: 'mekanika',
    content: {
      description: 'Gerak lurus adalah gerak benda di sepanjang lintasan lurus. Dibagi menjadi GLB (kecepatan konstan) dan GLBB (percepatan konstan).',
      concepts: [
        'Jarak: panjang lintasan yang ditempuh (skalar)',
        'Perpindahan: perubahan posisi dari titik awal ke titik akhir (vektor)',
        'Kecepatan rata-rata: perpindahan dibagi waktu',
        'GLB: gerak dengan kecepatan tetap, percepatan = 0',
        'GLBB: gerak dengan percepatan tetap (tidak nol)'
      ],
      formulas: [
        { name: 'Kecepatan Rata-rata', formula: 'v̄ = Δx / Δt' },
        { name: 'GLB — Jarak', formula: 's = v · t' },
        { name: 'GLBB — Kecepatan', formula: 'vₜ = v₀ + a·t' },
        { name: 'GLBB — Jarak', formula: 's = v₀·t + ½·a·t²' },
        { name: 'GLBB — Hubungan v-s', formula: 'vₜ² = v₀² + 2·a·s' }
      ],
      symbols: 'v₀ = kecepatan awal (m/s), vₜ = kecepatan akhir (m/s), a = percepatan (m/s²), t = waktu (s), s = jarak (m)',
      example: {
        soal: 'Sebuah mobil bergerak dengan kecepatan awal 10 m/s dan percepatan 4 m/s². Hitung kecepatan dan jarak setelah 5 detik!',
        steps: [
          'Diketahui: v₀ = 10 m/s, a = 4 m/s², t = 5 s',
          'Kecepatan: vₜ = v₀ + a·t = 10 + 4×5 = 30 m/s',
          'Jarak: s = v₀·t + ½·a·t²',
          's = 10×5 + ½×4×5² = 50 + 50 = 100 m'
        ],
        jawaban: 'Kecepatan = 30 m/s, Jarak = 100 m'
      },
      summary: 'GLB: percepatan nol, jarak = kecepatan × waktu. GLBB: percepatan konstan, gunakan tiga persamaan GLBB. Kecepatan sesaat adalah turunan dari posisi terhadap waktu.'
    }
  },
  {
    id: 3, title: 'Gerak Parabola', category: 'mekanika',
    content: {
      description: 'Gerak parabola adalah gerak dua dimensi yang merupakan gabungan GLB pada arah horizontal dan GLBB pada arah vertikal (pengaruh gravitasi).',
      concepts: [
        'Komponen horizontal: kecepatan tetap (GLB), vₓ = v₀ cos θ',
        'Komponen vertikal: pengaruh gravitasi (GLBB), vᵧ = v₀ sin θ − g·t',
        'Titik tertinggi: vᵧ = 0',
        'Jangkauan horizontal: jarak mendatar saat benda kembali ke ketinggian awal'
      ],
      formulas: [
        { name: 'Kecepatan Horizontal', formula: 'vₓ = v₀·cos θ' },
        { name: 'Kecepatan Vertikal', formula: 'vᵧ = v₀·sin θ − g·t' },
        { name: 'Posisi X', formula: 'x = v₀·cos θ · t' },
        { name: 'Posisi Y', formula: 'y = v₀·sin θ · t − ½·g·t²' },
        { name: 'Tinggi Maksimum', formula: 'H = (v₀·sin θ)² / (2g)' },
        { name: 'Jangkauan Maksimum', formula: 'R = v₀²·sin 2θ / g' }
      ],
      symbols: 'v₀ = kecepatan awal, θ = sudut elevasi, g = 10 m/s², H = tinggi maks, R = jangkauan',
      example: {
        soal: 'Bola dilempar dengan v₀ = 20 m/s pada sudut 30°. Hitung tinggi maksimum dan jangkauan! (g = 10 m/s²)',
        steps: [
          'v₀ₓ = 20 cos 30° = 20 × 0.866 = 17.32 m/s',
          'v₀ᵧ = 20 sin 30° = 20 × 0.5 = 10 m/s',
          'H = v₀ᵧ² / (2g) = 10² / 20 = 5 m',
          'R = v₀²·sin 2(30°) / g = 400 × sin 60° / 10 = 400 × 0.866 / 10 = 34.64 m'
        ],
        jawaban: 'Tinggi maksimum = 5 m, Jangkauan = 34.64 m'
      },
      summary: 'Gerak parabola bisa diurai menjadi dua komponen independen. Jangkauan maksimum terjadi pada θ = 45°. Tinggi maksimum terjadi saat komponen vertikal kecepatan = 0.'
    }
  },
  {
    id: 4, title: 'Gerak Melingkar', category: 'mekanika',
    content: {
      description: 'Gerak melingkar adalah gerak benda pada lintasan berbentuk lingkaran. Benda selalu mengalami percepatan sentripetal yang mengarah ke pusat lingkaran.',
      concepts: [
        'GMB (Gerak Melingkar Beraturan): kelajuan tetap, arah kecepatan berubah',
        'GMBB (Gerak Melingkar Berubah Beraturan): kecepatan sudut berubah',
        'Frekuensi (f): jumlah putaran per detik (Hz)',
        'Periode (T): waktu satu putaran penuh (s)',
        'Kecepatan sudut (ω): sudut yang ditempuh per satuan waktu (rad/s)'
      ],
      formulas: [
        { name: 'Hubungan T dan f', formula: 'T = 1/f' },
        { name: 'Kecepatan Sudut', formula: 'ω = 2π/T = 2πf' },
        { name: 'Kecepatan Linear', formula: 'v = ω·r = 2πr/T' },
        { name: 'Percepatan Sentripetal', formula: 'aₛ = v²/r = ω²·r' },
        { name: 'Gaya Sentripetal', formula: 'Fₛ = m·v²/r = m·ω²·r' }
      ],
      symbols: 'T = periode (s), f = frekuensi (Hz), ω = kecepatan sudut (rad/s), r = jari-jari (m), v = kecepatan linear (m/s)',
      example: {
        soal: 'Sebuah benda bermassa 2 kg bergerak melingkar dengan jari-jari 0.5 m dan kecepatan 4 m/s. Hitung gaya sentripetal!',
        steps: [
          'Diketahui: m = 2 kg, r = 0.5 m, v = 4 m/s',
          'Fₛ = m·v²/r',
          'Fₛ = 2 × 4² / 0.5 = 2 × 16 / 0.5 = 64 N'
        ],
        jawaban: 'Gaya sentripetal = 64 N'
      },
      summary: 'Pada GMB, kelajuan konstan namun arah kecepatan berubah sehingga ada percepatan (sentripetal). Gaya sentripetal selalu mengarah ke pusat dan merupakan gaya resultan yang diperlukan untuk mempertahankan gerak melingkar.'
    }
  },
  {
    id: 5, title: 'Hukum Newton', category: 'mekanika',
    content: {
      description: 'Hukum Newton adalah tiga prinsip fundamental yang mendeskripsikan hubungan antara gaya dan gerak benda. Merupakan dasar dari mekanika klasik.',
      concepts: [
        'Hukum I Newton (Inersia): benda diam tetap diam, benda bergerak tetap bergerak lurus beraturan jika resultan gaya = 0',
        'Hukum II Newton: percepatan benda sebanding dengan resultan gaya dan berbanding terbalik dengan massanya',
        'Hukum III Newton (Aksi-Reaksi): setiap gaya aksi memiliki gaya reaksi yang sama besar dan berlawanan arah',
        'Massa: ukuran inersia benda',
        'Berat: gaya gravitasi bumi pada benda (W = mg)'
      ],
      formulas: [
        { name: 'Hukum I Newton', formula: 'ΣF = 0 ⟹ a = 0' },
        { name: 'Hukum II Newton', formula: 'ΣF = m·a' },
        { name: 'Berat Benda', formula: 'W = m·g' },
        { name: 'Gaya Normal', formula: 'N = m·g·cos θ (bidang miring)' },
        { name: 'Gaya Gesek', formula: 'f = μ·N' }
      ],
      symbols: 'F = gaya (N), m = massa (kg), a = percepatan (m/s²), g = 10 m/s², μ = koefisien gesek, N = gaya normal (N)',
      example: {
        soal: 'Sebuah balok 5 kg didorong dengan gaya 30 N. Koefisien gesek kinetik = 0.2. Hitung percepatan balok! (g = 10 m/s²)',
        steps: [
          'Gaya gesek: f = μ·N = μ·m·g = 0.2 × 5 × 10 = 10 N',
          'ΣF = F − f = 30 − 10 = 20 N',
          'a = ΣF / m = 20 / 5 = 4 m/s²'
        ],
        jawaban: 'Percepatan balok = 4 m/s²'
      },
      summary: 'Hukum I: kesetimbangan (ΣF=0). Hukum II: ΣF=ma (hubungan gaya-massa-percepatan). Hukum III: aksi = reaksi (F_AB = −F_BA). Ketiga hukum ini menjadi dasar mekanika klasik.'
    }
  },
  {
    id: 6, title: 'Usaha dan Energi', category: 'mekanika',
    content: {
      description: 'Usaha adalah hasil kali gaya dengan perpindahan searah gaya. Energi adalah kemampuan melakukan usaha. Teorema usaha-energi menghubungkan keduanya.',
      concepts: [
        'Usaha (W): gaya × perpindahan × cos θ',
        'Energi Kinetik (Ek): energi karena gerak',
        'Energi Potensial Gravitasi (Ep): energi karena ketinggian',
        'Energi Mekanik (Em): jumlah Ek dan Ep',
        'Hukum Kekekalan Energi Mekanik: Em tetap jika tidak ada gaya non-konservatif'
      ],
      formulas: [
        { name: 'Usaha', formula: 'W = F·s·cos θ' },
        { name: 'Energi Kinetik', formula: 'Ek = ½·m·v²' },
        { name: 'Energi Potensial Gravitasi', formula: 'Ep = m·g·h' },
        { name: 'Teorema Usaha-Energi', formula: 'W_total = ΔEk = Ek₂ − Ek₁' },
        { name: 'Kekekalan Energi Mekanik', formula: 'Ek₁ + Ep₁ = Ek₂ + Ep₂' }
      ],
      symbols: 'W = usaha (J), F = gaya (N), s = perpindahan (m), θ = sudut, m = massa (kg), v = kecepatan (m/s), h = tinggi (m)',
      example: {
        soal: 'Benda 2 kg jatuh bebas dari ketinggian 5 m. Hitung kecepatan saat mencapai tanah! (g = 10 m/s²)',
        steps: [
          'Gunakan kekekalan energi mekanik',
          'Ep₁ + Ek₁ = Ep₂ + Ek₂',
          'mgh + 0 = 0 + ½mv²',
          'v² = 2gh = 2 × 10 × 5 = 100',
          'v = 10 m/s'
        ],
        jawaban: 'Kecepatan saat menyentuh tanah = 10 m/s'
      },
      summary: 'Usaha bernilai positif jika gaya searah perpindahan. Energi kinetik bergantung pada kuadrat kecepatan. Hukum kekekalan energi mekanik berlaku jika hanya ada gaya konservatif (gravitasi, pegas).'
    }
  },
  {
    id: 7, title: 'Momentum dan Impuls', category: 'mekanika',
    content: {
      description: 'Momentum adalah ukuran "kuantitas gerak" benda. Impuls adalah perubahan momentum yang disebabkan gaya dalam selang waktu tertentu.',
      concepts: [
        'Momentum (p): massa × kecepatan',
        'Impuls (J): gaya × selang waktu = perubahan momentum',
        'Hukum Kekekalan Momentum: momentum total sistem tetap jika tidak ada gaya luar',
        'Tumbukan elastik: energi kinetik kekal',
        'Tumbukan tidak elastik: energi kinetik tidak kekal',
        'Tumbukan sempurna tidak elastik: benda menyatu setelah tumbukan'
      ],
      formulas: [
        { name: 'Momentum', formula: 'p = m·v' },
        { name: 'Impuls', formula: 'J = F·Δt = Δp' },
        { name: 'Kekekalan Momentum', formula: 'm₁v₁ + m₂v₂ = m₁v₁\' + m₂v₂\'' },
        { name: 'Tumbukan Tidak Elastik Sempurna', formula: 'm₁v₁ + m₂v₂ = (m₁+m₂)·v\'' }
      ],
      symbols: 'p = momentum (kg·m/s), m = massa (kg), v = kecepatan (m/s), J = impuls (N·s), F = gaya (N), Δt = selang waktu (s)',
      example: {
        soal: 'Bola A (0.3 kg, 4 m/s ke kanan) menumbuk bola B (0.2 kg, diam). Jika tumbukan tidak elastik sempurna, hitung kecepatan setelah tumbukan!',
        steps: [
          'Diketahui: m₁=0.3 kg, v₁=4 m/s; m₂=0.2 kg, v₂=0',
          'Gunakan: m₁v₁ + m₂v₂ = (m₁+m₂)·v\'',
          '0.3×4 + 0.2×0 = (0.3+0.2)·v\'',
          '1.2 = 0.5·v\' → v\' = 2.4 m/s'
        ],
        jawaban: 'Kecepatan setelah tumbukan = 2.4 m/s (ke kanan)'
      },
      summary: 'Momentum adalah besaran vektor. Hukum kekekalan momentum berlaku pada sistem terisolasi. Impuls sama dengan perubahan momentum. Tumbukan elastik: Ek kekal; tidak elastik: Ek tidak kekal.'
    }
  },
  {
    id: 8, title: 'Fluida', category: 'mekanika',
    content: {
      description: 'Fluida (zat alir) mencakup zat cair dan gas. Studi fluida meliputi fluida statis (Hukum Pascal, Archimedes) dan fluida dinamis (Bernoulli, Kontinuitas).',
      concepts: [
        'Tekanan: gaya per satuan luas',
        'Tekanan hidrostatik: tekanan zat cair pada kedalaman tertentu',
        'Hukum Pascal: tekanan pada fluida tertutup diteruskan ke semua arah sama besar',
        'Hukum Archimedes: gaya apung = berat fluida yang dipindahkan',
        'Persamaan Kontinuitas: A₁v₁ = A₂v₂ (fluida ideal)',
        'Hukum Bernoulli: P + ½ρv² + ρgh = konstan'
      ],
      formulas: [
        { name: 'Tekanan', formula: 'P = F/A' },
        { name: 'Tekanan Hidrostatik', formula: 'P = ρ·g·h' },
        { name: 'Gaya Archimedes', formula: 'Fₐ = ρ_fluida·g·Vbenda' },
        { name: 'Hukum Pascal', formula: 'F₁/A₁ = F₂/A₂' },
        { name: 'Kontinuitas', formula: 'A₁·v₁ = A₂·v₂' },
        { name: 'Bernoulli', formula: 'P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂' }
      ],
      symbols: 'P = tekanan (Pa), F = gaya (N), A = luas (m²), ρ = massa jenis (kg/m³), h = kedalaman (m), g = 10 m/s², V = volume (m³)',
      example: {
        soal: 'Sebuah benda (V = 0.002 m³) dicelupkan dalam air (ρ = 1000 kg/m³). Hitung gaya apung!',
        steps: [
          'Diketahui: V = 0.002 m³, ρ_air = 1000 kg/m³, g = 10 m/s²',
          'Fₐ = ρ·g·V',
          'Fₐ = 1000 × 10 × 0.002 = 20 N'
        ],
        jawaban: 'Gaya apung = 20 N'
      },
      summary: 'Fluida statis: tekanan, Archimedes, Pascal. Fluida dinamis: kontinuitas (luas × kecepatan = konstan), Bernoulli (kecepatan tinggi = tekanan rendah). Hukum Archimedes menjelaskan fenomena mengapung, melayang, dan tenggelam.'
    }
  },
  {
    id: 9, title: 'Elastisitas', category: 'mekanika',
    content: {
      description: 'Elastisitas adalah kemampuan benda untuk kembali ke bentuk semula setelah gaya yang diberikan dihilangkan. Hukum Hooke mendeskripsikan hubungan antara gaya dan pertambahan panjang.',
      concepts: [
        'Tegangan (σ): gaya per satuan luas penampang',
        'Regangan (ε): perbandingan pertambahan panjang dengan panjang awal',
        'Modulus Elastisitas (E): perbandingan tegangan terhadap regangan',
        'Hukum Hooke: F = k·x (untuk pegas)',
        'Susunan Pegas: seri dan paralel'
      ],
      formulas: [
        { name: 'Tegangan', formula: 'σ = F/A' },
        { name: 'Regangan', formula: 'ε = Δl/l₀' },
        { name: 'Modulus Young', formula: 'E = σ/ε = (F·l₀)/(A·Δl)' },
        { name: 'Hukum Hooke', formula: 'F = k·x' },
        { name: 'Energi Pegas', formula: 'Ep = ½·k·x²' },
        { name: 'Pegas Seri', formula: '1/kₛ = 1/k₁ + 1/k₂' },
        { name: 'Pegas Paralel', formula: 'kₚ = k₁ + k₂' }
      ],
      symbols: 'F = gaya (N), A = luas (m²), Δl = pertambahan panjang (m), l₀ = panjang awal (m), k = konstanta pegas (N/m), x = simpangan (m)',
      example: {
        soal: 'Pegas dengan k = 200 N/m ditarik sejauh 5 cm. Hitung gaya pegas dan energi yang tersimpan!',
        steps: [
          'x = 5 cm = 0.05 m',
          'F = k·x = 200 × 0.05 = 10 N',
          'Ep = ½·k·x² = ½ × 200 × 0.05² = ½ × 200 × 0.0025 = 0.25 J'
        ],
        jawaban: 'Gaya pegas = 10 N, Energi tersimpan = 0.25 J'
      },
      summary: 'Hukum Hooke berlaku dalam batas elastis. Di luar batas elastis, benda mengalami deformasi permanen. Modulus Young mengukur kekakuan material. Pegas seri memiliki konstanta lebih kecil, pegas paralel lebih besar.'
    }
  }
];

// Continue MATERI_DATA — bab 10-19
MATERI_DATA.push(
  {
    id: 10, title: 'Getaran', category: 'gelombang',
    content: {
      description: 'Getaran adalah gerak bolak-balik benda di sekitar posisi kesetimbangan. Contoh: bandul, pegas, membran speaker.',
      concepts: [
        'Simpangan (x): jarak dari posisi kesetimbangan',
        'Amplitudo (A): simpangan maksimum',
        'Periode (T): waktu satu getaran lengkap',
        'Frekuensi (f): jumlah getaran per detik',
        'Frekuensi Sudut (ω): kecepatan sudut dalam getaran'
      ],
      formulas: [
        { name: 'Hubungan T dan f', formula: 'T = 1/f' },
        { name: 'Persamaan Simpangan', formula: 'x = A·sin(ωt + φ₀)' },
        { name: 'Frekuensi Sudut', formula: 'ω = 2π/T = 2πf' },
        { name: 'Periode Bandul', formula: 'T = 2π√(L/g)' },
        { name: 'Periode Pegas', formula: 'T = 2π√(m/k)' },
        { name: 'Kecepatan Getaran', formula: 'v = ω·√(A² − x²)' }
      ],
      symbols: 'A = amplitudo (m), T = periode (s), f = frekuensi (Hz), ω = frekuensi sudut (rad/s), L = panjang bandul (m), k = konstanta pegas (N/m)',
      example: {
        soal: 'Sebuah bandul panjang 1 m berayun dengan amplitudo kecil. Hitung periode dan frekuensinya! (g = 10 m/s²)',
        steps: [
          'T = 2π√(L/g) = 2π√(1/10)',
          'T = 2π × √0.1 = 2π × 0.316 ≈ 1.99 s',
          'f = 1/T ≈ 0.5 Hz'
        ],
        jawaban: 'Periode ≈ 2 s, Frekuensi ≈ 0.5 Hz'
      },
      summary: 'Getaran harmonis sederhana memiliki restoring force (gaya pemulih) yang sebanding dengan simpangan. Periode bandul bergantung panjang dan gravitasi, tidak bergantung massa. Periode pegas bergantung massa dan konstanta pegas.'
    }
  },
  {
    id: 11, title: 'Gelombang', category: 'gelombang',
    content: {
      description: 'Gelombang adalah rambatan energi tanpa perpindahan materi secara permanen. Dibagi menjadi gelombang mekanik dan elektromagnetik, transversal dan longitudinal.',
      concepts: [
        'Gelombang Transversal: arah getar tegak lurus arah rambat (cahaya, gelombang tali)',
        'Gelombang Longitudinal: arah getar sejajar arah rambat (bunyi)',
        'Panjang Gelombang (λ): jarak satu pola gelombang lengkap',
        'Cepat Rambat (v): kecepatan rambatan gelombang',
        'Interferensi, Difraksi, Refleksi, Refraksi: sifat-sifat gelombang'
      ],
      formulas: [
        { name: 'Hubungan Dasar Gelombang', formula: 'v = λ·f = λ/T' },
        { name: 'Persamaan Gelombang', formula: 'y = A·sin(ωt − kx)' },
        { name: 'Bilangan Gelombang', formula: 'k = 2π/λ' },
        { name: 'Gelombang Stasioner (ujung tetap)', formula: 'y = 2A·sin(kx)·cos(ωt)' }
      ],
      symbols: 'v = cepat rambat (m/s), λ = panjang gelombang (m), f = frekuensi (Hz), T = periode (s), k = bilangan gelombang (rad/m)',
      example: {
        soal: 'Gelombang merambat dengan cepat rambat 340 m/s dan frekuensi 170 Hz. Hitung panjang gelombangnya!',
        steps: [
          'v = λ·f → λ = v/f',
          'λ = 340/170 = 2 m'
        ],
        jawaban: 'Panjang gelombang = 2 m'
      },
      summary: 'Gelombang merambatkan energi, bukan materi. Hubungan fundamental: v = λf. Sifat gelombang: dapat dipantulkan, dibiaskan, diinterferensi, dan didifraksi.'
    }
  },
  {
    id: 12, title: 'Bunyi', category: 'gelombang',
    content: {
      description: 'Bunyi adalah gelombang longitudinal mekanik yang merambat melalui medium elastis. Memiliki frekuensi, amplitudo, dan cepat rambat yang bergantung pada medium.',
      concepts: [
        'Bunyi adalah gelombang mekanik (butuh medium)',
        'Cepat rambat bunyi bergantung pada sifat medium',
        'Intensitas bunyi: daya per satuan luas',
        'Taraf intensitas bunyi (TI): dalam satuan desibel (dB)',
        'Efek Doppler: perubahan frekuensi karena gerak relatif sumber dan pendengar',
        'Resonansi: intensitas bunyi maksimum pada frekuensi tertentu'
      ],
      formulas: [
        { name: 'Cepat Rambat Bunyi (udara)', formula: 'v = 331 + 0.6·T m/s' },
        { name: 'Intensitas Bunyi', formula: 'I = P/A' },
        { name: 'Taraf Intensitas', formula: 'TI = 10 log(I/I₀) dB' },
        { name: 'Efek Doppler', formula: 'f\' = f × (v ± vₚ) / (v ∓ vₛ)' },
        { name: 'Kolom Udara (ujung terbuka)', formula: 'L = n·λ/2, n = 1,2,3,...' },
        { name: 'Kolom Udara (ujung tertutup)', formula: 'L = (2n-1)·λ/4, n = 1,2,3,...' }
      ],
      symbols: 'v = cepat rambat (m/s), T = suhu (°C), I = intensitas (W/m²), I₀ = 10⁻¹² W/m², f\' = frekuensi terdengar, vₚ = kecepatan pendengar, vₛ = kecepatan sumber',
      example: {
        soal: 'Sumber bunyi frekuensi 400 Hz bergerak mendekati pendengar diam dengan kecepatan 20 m/s. Hitung frekuensi yang didengar! (v bunyi = 340 m/s)',
        steps: [
          'Sumber mendekati pendengar, gunakan tanda − di denominator',
          'f\' = f × v / (v − vₛ)',
          'f\' = 400 × 340 / (340 − 20)',
          'f\' = 400 × 340 / 320 = 425 Hz'
        ],
        jawaban: 'Frekuensi yang didengar = 425 Hz'
      },
      summary: 'Bunyi butuh medium (tidak dapat merambat di vakum). Cepat rambat bunyi di udara ±340 m/s. Efek Doppler: sumber mendekati → frekuensi naik; menjauh → turun. Taraf intensitas diukur dalam desibel (dB).'
    }
  },
  {
    id: 13, title: 'Cahaya', category: 'gelombang',
    content: {
      description: 'Cahaya adalah gelombang elektromagnetik yang dapat merambat di ruang hampa. Memiliki sifat pemantulan, pembiasan, interferensi, difraksi, dan polarisasi.',
      concepts: [
        'Hukum Pemantulan: sudut datang = sudut pantul',
        'Hukum Snellius (Pembiasan): n₁ sin θ₁ = n₂ sin θ₂',
        'Indeks bias (n): perbandingan cepat cahaya di vakum dengan di medium',
        'Lensa dan cermin: pembentukan bayangan',
        'Dispersi: pemisahan cahaya putih menjadi spektrum warna',
        'Alat optik: mata, lup, mikroskop, teleskop'
      ],
      formulas: [
        { name: 'Hukum Snellius', formula: 'n₁·sin θ₁ = n₂·sin θ₂' },
        { name: 'Indeks Bias', formula: 'n = c/v' },
        { name: 'Persamaan Cermin/Lensa', formula: '1/f = 1/s + 1/s\'' },
        { name: 'Perbesaran Lensa', formula: 'M = s\'/s = h\'/h' },
        { name: 'Kuat Lensa', formula: 'P = 1/f (dioptri, f dalam meter)' }
      ],
      symbols: 'n = indeks bias, θ = sudut (dari normal), c = 3×10⁸ m/s, f = jarak fokus (m), s = jarak benda (m), s\' = jarak bayangan (m), M = perbesaran',
      example: {
        soal: 'Benda di depan lensa cembung pada jarak 20 cm, jarak fokus 10 cm. Tentukan jarak bayangan dan perbesarannya!',
        steps: [
          '1/f = 1/s + 1/s\'',
          '1/10 = 1/20 + 1/s\'',
          '1/s\' = 1/10 − 1/20 = 2/20 − 1/20 = 1/20',
          's\' = 20 cm',
          'M = s\'/s = 20/20 = 1 (bayangan sama besar)'
        ],
        jawaban: 'Jarak bayangan = 20 cm, Perbesaran = 1× (sama besar, nyata, terbalik)'
      },
      summary: 'Cahaya merambat lurus, dapat dipantulkan dan dibiaskan. Lensa cembung/cermin cekung bersifat konvergen. Lensa cekung/cermin cembung bersifat divergen. Persamaan lensa tipis: 1/f = 1/s + 1/s\'.'
    }
  },
  {
    id: 14, title: 'Listrik Statis', category: 'listrik',
    content: {
      description: 'Listrik statis membahas muatan listrik yang diam, gaya Coulomb antar muatan, medan listrik, potensial listrik, dan kapasitor.',
      concepts: [
        'Muatan listrik: positif (proton) dan negatif (elektron)',
        'Hukum Coulomb: gaya tarik atau tolak antar muatan',
        'Medan Listrik (E): gaya per satuan muatan',
        'Potensial Listrik (V): energi potensial per satuan muatan',
        'Kapasitor: komponen penyimpan muatan dan energi listrik'
      ],
      formulas: [
        { name: 'Hukum Coulomb', formula: 'F = k·q₁·q₂/r²' },
        { name: 'Medan Listrik', formula: 'E = F/q = k·Q/r²' },
        { name: 'Potensial Listrik', formula: 'V = k·Q/r' },
        { name: 'Energi Potensial', formula: 'Ep = k·q₁·q₂/r' },
        { name: 'Kapasitansi', formula: 'C = Q/V' },
        { name: 'Energi Kapasitor', formula: 'W = ½·C·V²' }
      ],
      symbols: 'k = 9×10⁹ N·m²/C², q = muatan (C), r = jarak (m), E = medan listrik (N/C), V = potensial (Volt), C = kapasitansi (Farad)',
      example: {
        soal: 'Dua muatan q₁ = 2 μC dan q₂ = 3 μC berjarak 30 cm. Hitung gaya Coulomb!',
        steps: [
          'k = 9×10⁹ N·m²/C²',
          'q₁ = 2×10⁻⁶ C, q₂ = 3×10⁻⁶ C, r = 0.3 m',
          'F = k·q₁·q₂/r² = 9×10⁹ × 2×10⁻⁶ × 3×10⁻⁶ / (0.3)²',
          'F = 9×10⁹ × 6×10⁻¹² / 0.09 = 54×10⁻³ / 0.09 = 0.6 N'
        ],
        jawaban: 'Gaya Coulomb = 0.6 N'
      },
      summary: 'Muatan sejenis tolak-menolak, muatan berlawanan tarik-menarik. Hukum Coulomb mirip hukum gravitasi. Medan listrik adalah vektor, mengarah dari muatan + ke −. Kapasitor menyimpan energi dalam medan listrik.'
    }
  },
  {
    id: 15, title: 'Listrik Dinamis', category: 'listrik',
    content: {
      description: 'Listrik dinamis membahas muatan listrik yang bergerak (arus listrik), rangkaian listrik, hukum Ohm, dan hukum Kirchhoff.',
      concepts: [
        'Arus Listrik (I): muatan yang mengalir per satuan waktu',
        'Tegangan (V): beda potensial listrik',
        'Hambatan (R): kemampuan bahan menghambat arus',
        'Hukum Ohm: V = I·R',
        'Hukum Kirchhoff I (arus): total arus masuk = total arus keluar pada percabangan',
        'Hukum Kirchhoff II (tegangan): jumlah tegangan dalam satu loop = 0'
      ],
      formulas: [
        { name: 'Hukum Ohm', formula: 'V = I·R' },
        { name: 'Daya Listrik', formula: 'P = V·I = I²·R = V²/R' },
        { name: 'Hambatan Seri', formula: 'Rₛ = R₁ + R₂ + R₃...' },
        { name: 'Hambatan Paralel', formula: '1/Rₚ = 1/R₁ + 1/R₂ + ...' },
        { name: 'Energi Listrik', formula: 'W = P·t = V·I·t' },
        { name: 'Hambatan Kawat', formula: 'R = ρ·L/A' }
      ],
      symbols: 'I = arus (A), V = tegangan (V), R = hambatan (Ω), P = daya (W), W = energi (J), ρ = resistivitas (Ω·m), L = panjang kawat (m), A = luas (m²)',
      example: {
        soal: 'Tiga resistor R₁=2Ω, R₂=3Ω, R₃=5Ω dihubungkan seri dengan baterai 20V. Hitung arus dan tegangan pada R₂!',
        steps: [
          'Rₛ = R₁ + R₂ + R₃ = 2 + 3 + 5 = 10 Ω',
          'I = V/Rₛ = 20/10 = 2 A',
          'V_R₂ = I × R₂ = 2 × 3 = 6 V'
        ],
        jawaban: 'Arus = 2 A, Tegangan pada R₂ = 6 V'
      },
      summary: 'Hukum Ohm: V = IR (berlaku pada konduktor ohmik). Hambatan seri: bertambah. Hambatan paralel: berkurang. Daya listrik P = VI. Hukum Kirchhoff digunakan untuk menganalisis rangkaian kompleks.'
    }
  },
  {
    id: 16, title: 'Medan Magnet', category: 'listrik',
    content: {
      description: 'Medan magnet dihasilkan oleh muatan listrik yang bergerak (arus listrik) atau magnet permanen. Gaya magnet bekerja pada muatan bergerak dan kawat berarus.',
      concepts: [
        'Medan magnet (B): vektor yang menggambarkan pengaruh magnet di suatu titik',
        'Hukum Biot-Savart: medan magnet dari elemen arus',
        'Hukum Ampere: ∮B·dl = μ₀·I',
        'Gaya Lorentz: gaya pada muatan bergerak dalam medan magnet',
        'Gaya pada kawat berarus dalam medan magnet'
      ],
      formulas: [
        { name: 'Medan Magnet Kawat Lurus', formula: 'B = μ₀·I / (2π·r)' },
        { name: 'Medan Magnet Solenoida', formula: 'B = μ₀·n·I' },
        { name: 'Gaya Lorentz (muatan)', formula: 'F = q·v·B·sin θ' },
        { name: 'Gaya pada Kawat Berarus', formula: 'F = B·I·L·sin θ' },
        { name: 'Fluks Magnetik', formula: 'Φ = B·A·cos θ' }
      ],
      symbols: 'B = medan magnet (Tesla), μ₀ = 4π×10⁻⁷ T·m/A, I = arus (A), r = jarak (m), n = jumlah lilitan/panjang, q = muatan (C), v = kecepatan (m/s)',
      example: {
        soal: 'Kawat berarus 5 A dalam medan magnet 0.2 T, panjang kawat 1 m, sudut 90°. Hitung gaya pada kawat!',
        steps: [
          'F = B·I·L·sin θ',
          'F = 0.2 × 5 × 1 × sin 90°',
          'F = 0.2 × 5 × 1 × 1 = 1 N'
        ],
        jawaban: 'Gaya pada kawat = 1 N'
      },
      summary: 'Medan magnet dihasilkan arus listrik. Arah medan magnet ditentukan oleh kaidah tangan kanan. Gaya Lorentz tegak lurus kecepatan dan medan magnet. Satuan medan magnet adalah Tesla (T).'
    }
  },
  {
    id: 17, title: 'Induksi Elektromagnetik', category: 'listrik',
    content: {
      description: 'Induksi elektromagnetik adalah fenomena timbulnya GGL (gaya gerak listrik) pada penghantar akibat perubahan fluks magnetik. Dasar dari generator listrik dan transformator.',
      concepts: [
        'Hukum Faraday: GGL induksi sebanding perubahan fluks magnetik',
        'Hukum Lenz: arah arus induksi menentang penyebabnya',
        'GGL Induksi: beda potensial yang timbul akibat induksi',
        'Generator: mengubah energi mekanik menjadi listrik',
        'Transformator: mengubah tegangan AC'
      ],
      formulas: [
        { name: 'Hukum Faraday', formula: 'ε = −N·ΔΦ/Δt' },
        { name: 'GGL pada Kawat Bergerak', formula: 'ε = B·L·v' },
        { name: 'Fluks Magnetik', formula: 'Φ = B·A·cos θ' },
        { name: 'Transformator (ideal)', formula: 'Vₛ/Vₚ = Nₛ/Nₚ = Iₚ/Iₛ' },
        { name: 'Efisiensi Transformator', formula: 'η = (Pₛ/Pₚ) × 100%' }
      ],
      symbols: 'ε = GGL induksi (Volt), N = jumlah lilitan, Φ = fluks magnet (Weber), B = medan magnet (T), A = luas (m²), t = waktu (s)',
      example: {
        soal: 'Kumparan 100 lilitan mengalami perubahan fluks dari 0.5 Wb menjadi 0.1 Wb dalam 2 s. Hitung GGL induksi!',
        steps: [
          'ΔΦ = 0.1 − 0.5 = −0.4 Wb',
          'ε = −N·ΔΦ/Δt = −100 × (−0.4)/2',
          'ε = 100 × 0.4/2 = 20 V'
        ],
        jawaban: 'GGL Induksi = 20 V'
      },
      summary: 'GGL induksi timbul jika ada perubahan fluks magnetik. Hukum Lenz: arus induksi melawan perubahan yang menyebabkannya. Transformator step-up meningkatkan tegangan (Ns>Np), step-down menurunkan tegangan.'
    }
  },
  {
    id: 18, title: 'Arus Bolak-balik', category: 'listrik',
    content: {
      description: 'Arus bolak-balik (AC) adalah arus yang berubah secara periodik terhadap waktu. Lebih efisien untuk transmisi listrik jarak jauh.',
      concepts: [
        'Arus AC: besar dan arah berubah periodik (sinusoidal)',
        'Nilai efektif (rms): nilai DC ekivalen dari arus/tegangan AC',
        'Reaktansi kapasitif (Xc) dan induktif (XL)',
        'Impedansi (Z): hambatan total rangkaian AC',
        'Resonansi seri: terjadi saat XL = XC',
        'Faktor daya: cos φ'
      ],
      formulas: [
        { name: 'Tegangan AC', formula: 'v = Vₘ·sin(ωt)' },
        { name: 'Nilai Efektif', formula: 'Vᵣₘₛ = Vₘ/√2 ≈ 0.707·Vₘ' },
        { name: 'Reaktansi Induktif', formula: 'XL = ω·L = 2πf·L' },
        { name: 'Reaktansi Kapasitif', formula: 'XC = 1/(ω·C) = 1/(2πfC)' },
        { name: 'Impedansi Rangkaian RLC', formula: 'Z = √(R² + (XL−XC)²)' },
        { name: 'Frekuensi Resonansi', formula: 'f₀ = 1/(2π√(LC))' }
      ],
      symbols: 'Vₘ = tegangan puncak (V), ω = frekuensi sudut (rad/s), L = induktansi (H), C = kapasitansi (F), R = hambatan (Ω), Z = impedansi (Ω)',
      example: {
        soal: 'Rangkaian RLC seri: R=30Ω, XL=80Ω, XC=40Ω. Hitung impedansi!',
        steps: [
          'Z = √(R² + (XL−XC)²)',
          'Z = √(30² + (80−40)²)',
          'Z = √(900 + 1600) = √2500 = 50 Ω'
        ],
        jawaban: 'Impedansi = 50 Ω'
      },
      summary: 'Arus AC mengalir dua arah. Nilai efektif = nilai puncak/√2. Pada rangkaian RLC, impedansi minimum saat resonansi (XL=XC). Daya AC = Vᵣₘₛ·Iᵣₘₛ·cos φ.'
    }
  },
  {
    id: 19, title: 'Fisika Modern', category: 'modern',
    content: {
      description: 'Fisika modern mencakup teori relativitas Einstein, fisika kuantum, dan fisika inti. Menggantikan fisika klasik untuk fenomena kecepatan tinggi dan skala atom.',
      concepts: [
        'Teori Relativitas Khusus Einstein: waktu dan panjang bergantung kecepatan',
        'Efek Fotolistrik: cahaya terdiri dari foton (paket energi)',
        'Hipotesis de Broglie: gelombang materi',
        'Model Atom Bohr: elektron mengorbit inti pada lintasan tertentu',
        'Radioaktivitas: peluruhan inti atom tidak stabil',
        'Reaksi Fisi dan Fusi nuklir'
      ],
      formulas: [
        { name: 'Energi Foton', formula: 'E = h·f = h·c/λ' },
        { name: 'Persamaan Fotolistrik', formula: 'Ek_maks = h·f − W₀' },
        { name: 'Gelombang de Broglie', formula: 'λ = h/p = h/(m·v)' },
        { name: 'Energi Relativistik', formula: 'E = m·c²' },
        { name: 'Peluruhan Radioaktif', formula: 'N = N₀·(½)^(t/T½)' },
        { name: 'Defek Massa — Energi Ikat', formula: 'E_ikat = Δm·c²' }
      ],
      symbols: 'h = 6.63×10⁻³⁴ J·s (konstanta Planck), f = frekuensi (Hz), c = 3×10⁸ m/s, W₀ = fungsi kerja (J), m = massa (kg), N = jumlah inti, T½ = waktu paruh',
      example: {
        soal: 'Foton memiliki frekuensi 6×10¹⁴ Hz. Hitung energi foton! (h = 6.63×10⁻³⁴ J·s)',
        steps: [
          'E = h·f',
          'E = 6.63×10⁻³⁴ × 6×10¹⁴',
          'E = 39.78×10⁻²⁰ J',
          'E ≈ 3.98×10⁻¹⁹ J'
        ],
        jawaban: 'Energi foton ≈ 3.98×10⁻¹⁹ J'
      },
      summary: 'Fisika modern lahir awal abad 20. Relativitas: energi dan massa saling convertible. Kuantum: energi terkuantisasi. Efek fotolistrik membuktikan sifat partikel cahaya. Radioaktivitas: peluruhan spontan inti tidak stabil.'
    }
  }
);

/* =====================================================
   MATERI MODULE — Sidebar, Content Render, Progress
   ===================================================== */
const progressState = JSON.parse(localStorage.getItem('ph-progress') || '{}');

function saveProgress() {
  localStorage.setItem('ph-progress', JSON.stringify(progressState));
}

function getCompletedCount() {
  return Object.values(progressState).filter(Boolean).length;
}

function updateProgressUI() {
  const count = getCompletedCount();
  const total = MATERI_DATA.length;
  const pct   = Math.round((count / total) * 100);

  const countEl = document.getElementById('progress-count');
  const barEl   = document.getElementById('progress-bar-fill');
  const barContainer = barEl && barEl.parentElement;

  if (countEl) countEl.textContent = count;
  if (barEl)   barEl.style.width   = pct + '%';
  if (barContainer) {
    barContainer.setAttribute('aria-valuenow', pct);
    barContainer.setAttribute('aria-label', `Progress belajar ${pct}%`);
  }
}

function renderSidebar(filterFn) {
  const list = document.getElementById('sidebar-list');
  if (!list) return;

  const items = filterFn ? MATERI_DATA.filter(filterFn) : MATERI_DATA;
  if (items.length === 0) {
    list.innerHTML = `<li class="empty-state"><div class="empty-state-icon">🔍</div>Tidak ditemukan</li>`;
    return;
  }

  list.innerHTML = items.map(m => `
    <li class="sidebar-item ${progressState[m.id] ? 'completed' : ''}"
        data-id="${m.id}" role="button" tabindex="0"
        aria-label="Bab ${m.id + 1}: ${m.title}${progressState[m.id] ? ' (selesai)' : ''}">
      <span class="sidebar-num">${String(m.id + 1).padStart(2,'0')}</span>
      <span>${m.title}</span>
      <span class="sidebar-check" aria-hidden="true">${progressState[m.id] ? '✅' : '○'}</span>
    </li>
  `).join('');

  list.querySelectorAll('.sidebar-item').forEach(item => {
    const open = () => openMateri(parseInt(item.dataset.id, 10));
    item.addEventListener('click', open);
    item.addEventListener('keydown', e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), open()));
  });
}

function openMateri(id) {
  const m = MATERI_DATA.find(x => x.id === id);
  if (!m) return;

  // Highlight active in sidebar
  document.querySelectorAll('.sidebar-item').forEach(el => {
    el.classList.toggle('active', parseInt(el.dataset.id, 10) === id);
  });

  const welcomeEl = document.getElementById('materi-welcome');
  const detailEl  = document.getElementById('materi-detail');
  if (welcomeEl) welcomeEl.style.display = 'none';
  if (detailEl)  detailEl.style.display  = 'block';

  const c = m.content;
  const formulasHTML = c.formulas.map(f => `
    <div class="formula-box"><strong>${f.name}:</strong> ${f.formula}</div>
  `).join('');

  const stepsHTML = c.example.steps.map((step, i) => `
    <div class="solution-step">
      <span class="step-num" aria-hidden="true">${i+1}</span>
      <span>${step}</span>
    </div>
  `).join('');

  const conceptsHTML = c.concepts.map(con => `<li>${con}</li>`).join('');

  detailEl.innerHTML = `
    <h2>${m.id + 1}. ${m.title}</h2>
    <h3>📌 Deskripsi</h3>
    <p>${c.description}</p>
    <h3>💡 Konsep Utama</h3>
    <ul>${conceptsHTML}</ul>
    <h3>📐 Rumus</h3>
    ${formulasHTML}
    <h3>🔑 Keterangan Simbol</h3>
    <p>${c.symbols}</p>
    <h3>📝 Contoh Soal</h3>
    <div class="example-box">
      <h4>Soal:</h4>
      <p>${c.example.soal}</p>
      <h4>Pembahasan Langkah demi Langkah:</h4>
      ${stepsHTML}
      <h4 style="margin-top:var(--space-4);color:var(--success)">✅ Jawaban: ${c.example.jawaban}</h4>
    </div>
    <div class="summary-box">
      <h3>📋 Ringkasan</h3>
      <p>${c.summary}</p>
    </div>
    <div style="margin-top:var(--space-6); display:flex; align-items:center; gap:var(--space-4); flex-wrap:wrap;">
      <button class="btn ${progressState[id] ? 'btn-success' : 'btn-primary'} mark-done-btn" id="mark-done-btn" data-id="${id}">
        ${progressState[id] ? '✅ Sudah Dipelajari' : '○ Tandai Selesai'}
      </button>
    </div>
    <div class="materi-nav-btns">
      ${id > 0 ? `<button class="btn btn-outline" onclick="openMateri(${id-1})">← Bab Sebelumnya</button>` : '<span></span>'}
      ${id < MATERI_DATA.length-1 ? `<button class="btn btn-primary" onclick="openMateri(${id+1})">Bab Berikutnya →</button>` : '<span></span>'}
    </div>
  `;

  // Mark done handler
  const markBtn = document.getElementById('mark-done-btn');
  markBtn && markBtn.addEventListener('click', () => {
    const mid = parseInt(markBtn.dataset.id, 10);
    progressState[mid] = !progressState[mid];
    saveProgress();
    updateProgressUI();
    renderSidebar(currentSearchFilter);
    openMateri(mid); // re-render
    showToast(progressState[mid] ? `✅ "${m.title}" ditandai selesai!` : `○ Tanda selesai dihapus`, progressState[mid] ? 'success' : 'info');
  });

  // Scroll to top of content
  detailEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ===== SEARCH ===== */
let currentSearchFilter = null;
let searchTimer = null;

function initSearch() {
  const input    = document.getElementById('search-input');
  const clearBtn = document.getElementById('search-clear');
  if (!input) return;

  input.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      const q = input.value.trim().toLowerCase();
      clearBtn && (clearBtn.style.display = q ? 'block' : 'none');

      if (!q) {
        currentSearchFilter = null;
        renderSidebar(null);
        return;
      }
      currentSearchFilter = m => m.title.toLowerCase().includes(q);
      renderSidebar(currentSearchFilter);
    }, 200);
  });

  clearBtn && clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.style.display = 'none';
    currentSearchFilter = null;
    renderSidebar(null);
    input.focus();
  });
}

/* ===== FOOTER MATERI LINKS ===== */
function initFooterMateriLinks() {
  document.querySelectorAll('[data-open-materi]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const id = parseInt(a.dataset.openMateri, 10);
      document.getElementById('materi') && document.getElementById('materi').scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => openMateri(id), 500);
    });
  });
}

// Init materi on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  renderSidebar(null);
  updateProgressUI();
  initSearch();
  initFooterMateriLinks();
});

/* =====================================================
   RUMUS MODULE — Bank Rumus dengan filter dan copy
   ===================================================== */
const RUMUS_DATA = [
  // Mekanika
  { title:'Gerak Lurus Beraturan (GLB)', formula:'s = v · t', symbols:'s=jarak(m), v=kecepatan(m/s), t=waktu(s)', category:'mekanika' },
  { title:'GLBB — Kecepatan', formula:'vₜ = v₀ + a·t', symbols:'v₀=kcpt awal, a=percepatan(m/s²), t=waktu(s)', category:'mekanika' },
  { title:'GLBB — Jarak', formula:'s = v₀·t + ½·a·t²', symbols:'s=jarak(m)', category:'mekanika' },
  { title:'GLBB — Hubungan v-s', formula:'vₜ² = v₀² + 2·a·s', symbols:'persamaan ketiga GLBB', category:'mekanika' },
  { title:'Gaya — Hukum II Newton', formula:'ΣF = m·a', symbols:'F=gaya(N), m=massa(kg), a=percepatan(m/s²)', category:'mekanika' },
  { title:'Berat Benda', formula:'W = m·g', symbols:'W=berat(N), m=massa(kg), g=10 m/s²', category:'mekanika' },
  { title:'Usaha', formula:'W = F·s·cos θ', symbols:'W=usaha(J), F=gaya(N), s=perpindahan(m), θ=sudut', category:'mekanika' },
  { title:'Energi Kinetik', formula:'Ek = ½·m·v²', symbols:'Ek=energi kinetik(J)', category:'mekanika' },
  { title:'Energi Potensial Gravitasi', formula:'Ep = m·g·h', symbols:'h=ketinggian(m)', category:'mekanika' },
  { title:'Momentum', formula:'p = m·v', symbols:'p=momentum(kg·m/s)', category:'mekanika' },
  { title:'Impuls', formula:'J = F·Δt = Δp', symbols:'J=impuls(N·s)', category:'mekanika' },
  { title:'Gaya Sentripetal', formula:'Fₛ = m·v²/r = m·ω²·r', symbols:'r=jari-jari(m)', category:'mekanika' },
  { title:'Tekanan Hidrostatis', formula:'P = ρ·g·h', symbols:'P=tekanan(Pa), ρ=massa jenis(kg/m³)', category:'mekanika' },
  { title:'Hukum Hooke', formula:'F = k·x', symbols:'k=konstanta pegas(N/m), x=simpangan(m)', category:'mekanika' },
  { title:'Resultan Dua Vektor', formula:'R = √(A² + B² + 2AB·cos θ)', symbols:'A,B=besar vektor, θ=sudut antar vektor', category:'mekanika' },
  // Gelombang & Optik
  { title:'Cepat Rambat Gelombang', formula:'v = λ·f', symbols:'v=cepat rambat(m/s), λ=pjg gelombang(m), f=frekuensi(Hz)', category:'gelombang' },
  { title:'Periode Bandul Sederhana', formula:'T = 2π√(L/g)', symbols:'T=periode(s), L=panjang(m), g=gravitasi', category:'gelombang' },
  { title:'Periode Pegas', formula:'T = 2π√(m/k)', symbols:'m=massa(kg), k=konstanta pegas(N/m)', category:'gelombang' },
  { title:'Taraf Intensitas Bunyi', formula:'TI = 10 log(I/I₀) dB', symbols:'I₀=10⁻¹² W/m²', category:'gelombang' },
  { title:'Efek Doppler', formula:"f' = f × (v ± vₚ)/(v ∓ vₛ)", symbols:"f'=frek terdengar, vₚ=kcpt pendengar, vₛ=kcpt sumber", category:'gelombang' },
  { title:'Hukum Snellius', formula:'n₁·sin θ₁ = n₂·sin θ₂', symbols:'n=indeks bias, θ=sudut bias', category:'gelombang' },
  { title:'Persamaan Cermin/Lensa', formula:'1/f = 1/s + 1/s\'', symbols:"f=fokus(m), s=jrk benda, s'=jrk bayangan", category:'gelombang' },
  { title:'Jangkauan Gerak Parabola', formula:'R = v₀²·sin 2θ / g', symbols:'R=jangkauan(m), θ=sudut elevasi', category:'gelombang' },
  // Listrik & Magnet
  { title:'Hukum Coulomb', formula:'F = k·q₁·q₂/r²', symbols:'k=9×10⁹ N·m²/C², q=muatan(C), r=jarak(m)', category:'listrik' },
  { title:'Medan Listrik', formula:'E = k·Q/r²', symbols:'E=medan listrik(N/C)', category:'listrik' },
  { title:'Hukum Ohm', formula:'V = I·R', symbols:'V=tegangan(V), I=arus(A), R=hambatan(Ω)', category:'listrik' },
  { title:'Daya Listrik', formula:'P = V·I = I²·R = V²/R', symbols:'P=daya(W)', category:'listrik' },
  { title:'Hambatan Seri', formula:'Rₛ = R₁ + R₂ + R₃', symbols:'hambatan total bertambah', category:'listrik' },
  { title:'Hambatan Paralel', formula:'1/Rₚ = 1/R₁ + 1/R₂', symbols:'hambatan total berkurang', category:'listrik' },
  { title:'Gaya Lorentz', formula:'F = q·v·B·sin θ', symbols:'B=medan magnet(T), v=kecepatan(m/s)', category:'listrik' },
  { title:'GGL Induksi Faraday', formula:'ε = −N·ΔΦ/Δt', symbols:'ε=GGL(V), N=lilitan, Φ=fluks(Wb)', category:'listrik' },
  { title:'Transformator', formula:'Vₛ/Vₚ = Nₛ/Nₚ', symbols:'V=tegangan, N=jumlah lilitan', category:'listrik' },
  { title:'Impedansi RLC', formula:'Z = √(R² + (XL−XC)²)', symbols:'Z=impedansi(Ω), XL=reaktansi induktif, XC=kapasitif', category:'listrik' },
  // Fisika Modern
  { title:'Energi Foton', formula:'E = h·f = h·c/λ', symbols:'h=6.63×10⁻³⁴ J·s, c=3×10⁸ m/s', category:'modern' },
  { title:'Persamaan Einstein', formula:'E = m·c²', symbols:'m=massa(kg), c=3×10⁸ m/s', category:'modern' },
  { title:'Gelombang de Broglie', formula:'λ = h/p = h/(m·v)', symbols:'p=momentum(kg·m/s)', category:'modern' },
  { title:'Peluruhan Radioaktif', formula:'N = N₀·(½)^(t/T½)', symbols:'N₀=jml inti awal, T½=waktu paruh(s)', category:'modern' },
  { title:'Efek Fotolistrik', formula:'Ek = h·f − W₀', symbols:'W₀=fungsi kerja(J)', category:'modern' }
];

function renderRumus(filter = 'all') {
  const grid = document.getElementById('rumus-grid');
  if (!grid) return;

  const data = filter === 'all' ? RUMUS_DATA : RUMUS_DATA.filter(r => r.category === filter);
  if (data.length === 0) {
    grid.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📭</div>Tidak ada rumus untuk kategori ini.</div>`;
    return;
  }

  const categoryLabel = { mekanika:'Mekanika', gelombang:'Gelombang & Optik', listrik:'Listrik & Magnet', modern:'Fisika Modern' };

  grid.innerHTML = data.map(r => `
    <div class="rumus-card animate-on-scroll">
      <div class="rumus-card-header">
        <span class="rumus-card-title">${r.title}</span>
        <span class="rumus-category-tag">${categoryLabel[r.category] || r.category}</span>
      </div>
      <div class="rumus-formula">${r.formula}</div>
      <div class="rumus-symbols">${r.symbols}</div>
      <button class="rumus-copy-btn" data-formula="${encodeURIComponent(r.formula)}" aria-label="Salin rumus ${r.title}">
        📋 Salin Rumus
      </button>
    </div>
  `).join('');

  // Re-observe scroll animations
  grid.querySelectorAll('.animate-on-scroll').forEach(el => {
    setTimeout(() => el.classList.add('visible'), 50);
  });

  // Copy buttons
  grid.querySelectorAll('.rumus-copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const formula = decodeURIComponent(btn.dataset.formula);
      navigator.clipboard.writeText(formula).then(() => {
        btn.textContent = '✅ Tersalin!';
        btn.classList.add('copied');
        showToast(`Rumus tersalin: ${formula}`, 'success', 2500);
        setTimeout(() => {
          btn.textContent = '📋 Salin Rumus';
          btn.classList.remove('copied');
        }, 2000);
      }).catch(() => {
        showToast('Gagal menyalin. Coba lagi.', 'error');
      });
    });
  });
}

function initRumus() {
  renderRumus('all');
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderRumus(btn.dataset.filter);
    });
  });
}

document.addEventListener('DOMContentLoaded', initRumus);

/* =====================================================
   KALKULATOR MODULE — 9 kalkulator fisika
   ===================================================== */
const CALCULATORS = {
  glb: {
    title: 'Gerak Lurus Beraturan (GLB)',
    desc: 'Hitung jarak, kecepatan, atau waktu untuk gerak dengan kecepatan konstan.',
    formula: 's = v × t',
    inputs: [
      { id:'glb-v', label:'Kecepatan (v)', unit:'m/s', placeholder:'contoh: 20' },
      { id:'glb-t', label:'Waktu (t)',     unit:'s',   placeholder:'contoh: 5'  }
    ],
    resultLabel: 'Jarak (s)',
    resultUnit: 'meter (m)',
    calculate(vals) {
      const v = parseFloat(vals['glb-v']);
      const t = parseFloat(vals['glb-t']);
      if (isNaN(v) || isNaN(t)) return null;
      if (v < 0 || t < 0) return { error: 'Nilai tidak boleh negatif' };
      return { value: (v * t).toFixed(4), label: `Jarak = ${v} × ${t} = ${(v*t).toFixed(4)} m` };
    }
  },
  glbb: {
    title: 'Gerak Lurus Berubah Beraturan (GLBB)',
    desc: 'Hitung jarak dan kecepatan akhir dengan kecepatan awal, percepatan, dan waktu.',
    formula: 'vₜ = v₀ + a·t  |  s = v₀·t + ½·a·t²',
    inputs: [
      { id:'glbb-v0', label:'Kec. Awal (v₀)', unit:'m/s', placeholder:'contoh: 0' },
      { id:'glbb-a',  label:'Percepatan (a)',  unit:'m/s²',placeholder:'contoh: 4' },
      { id:'glbb-t',  label:'Waktu (t)',        unit:'s',   placeholder:'contoh: 5' }
    ],
    resultLabel: 'Jarak (s) dan Kecepatan Akhir (vₜ)',
    resultUnit: 'm dan m/s',
    calculate(vals) {
      const v0 = parseFloat(vals['glbb-v0']);
      const a  = parseFloat(vals['glbb-a']);
      const t  = parseFloat(vals['glbb-t']);
      if ([v0,a,t].some(isNaN)) return null;
      if (t < 0) return { error: 'Waktu tidak boleh negatif' };
      const vt = v0 + a*t;
      const s  = v0*t + 0.5*a*t*t;
      return { value: `vₜ = ${vt.toFixed(3)} m/s\ns = ${s.toFixed(3)} m`, label: `vₜ = v₀ + at | s = v₀t + ½at²` };
    }
  },
  newton: {
    title: 'Hukum II Newton',
    desc: 'Hitung percepatan benda berdasarkan gaya resultan dan massa.',
    formula: 'a = ΣF / m',
    inputs: [
      { id:'nwt-f', label:'Gaya Total (ΣF)', unit:'N',  placeholder:'contoh: 20' },
      { id:'nwt-m', label:'Massa (m)',        unit:'kg', placeholder:'contoh: 4'  }
    ],
    resultLabel: 'Percepatan (a)',
    resultUnit: 'm/s²',
    calculate(vals) {
      const F = parseFloat(vals['nwt-f']);
      const m = parseFloat(vals['nwt-m']);
      if (isNaN(F) || isNaN(m)) return null;
      if (m <= 0) return { error: 'Massa harus lebih dari 0' };
      const a = F / m;
      return { value: a.toFixed(4), label: `a = ${F} / ${m} = ${a.toFixed(4)} m/s²` };
    }
  },
  energi: {
    title: 'Energi Kinetik & Potensial',
    desc: 'Hitung energi kinetik dan energi potensial gravitasi benda.',
    formula: 'Ek = ½·m·v²  |  Ep = m·g·h',
    inputs: [
      { id:'en-m', label:'Massa (m)',      unit:'kg',  placeholder:'contoh: 5'  },
      { id:'en-v', label:'Kecepatan (v)',  unit:'m/s', placeholder:'contoh: 10' },
      { id:'en-h', label:'Ketinggian (h)', unit:'m',   placeholder:'contoh: 3'  }
    ],
    resultLabel: 'Energi Kinetik & Potensial',
    resultUnit: 'Joule (J)',
    calculate(vals) {
      const m = parseFloat(vals['en-m']);
      const v = parseFloat(vals['en-v']);
      const h = parseFloat(vals['en-h']);
      if ([m,v,h].some(isNaN)) return null;
      if (m < 0) return { error: 'Massa tidak boleh negatif' };
      const ek = 0.5 * m * v * v;
      const ep = m * 10 * h;
      return { value: `Ek = ${ek.toFixed(3)} J\nEp = ${ep.toFixed(3)} J`, label: `Ek = ½mv² | Ep = mgh (g=10 m/s²)` };
    }
  },
  momentum: {
    title: 'Momentum & Impuls',
    desc: 'Hitung momentum benda dan impuls yang bekerja.',
    formula: 'p = m·v  |  J = F·Δt',
    inputs: [
      { id:'mom-m',  label:'Massa (m)',    unit:'kg',  placeholder:'contoh: 2'   },
      { id:'mom-v',  label:'Kecepatan (v)',unit:'m/s', placeholder:'contoh: 5'   },
      { id:'mom-f',  label:'Gaya (F)',     unit:'N',   placeholder:'contoh: 10'  },
      { id:'mom-dt', label:'Δt (waktu)',   unit:'s',   placeholder:'contoh: 0.5' }
    ],
    resultLabel: 'Momentum dan Impuls',
    resultUnit: 'kg·m/s dan N·s',
    calculate(vals) {
      const m  = parseFloat(vals['mom-m']);
      const v  = parseFloat(vals['mom-v']);
      const F  = parseFloat(vals['mom-f']);
      const dt = parseFloat(vals['mom-dt']);
      const p  = (!isNaN(m) && !isNaN(v)) ? (m*v) : null;
      const J  = (!isNaN(F) && !isNaN(dt)) ? (F*dt) : null;
      if (p === null && J === null) return null;
      const parts = [];
      if (p !== null) parts.push(`p = ${p.toFixed(3)} kg·m/s`);
      if (J !== null) parts.push(`J = ${J.toFixed(3)} N·s`);
      return { value: parts.join('\n'), label: 'p = mv | J = F·Δt' };
    }
  },
  tekanan: {
    title: 'Tekanan',
    desc: 'Hitung tekanan berdasarkan gaya dan luas bidang tekan.',
    formula: 'P = F / A',
    inputs: [
      { id:'tek-f', label:'Gaya (F)',  unit:'N',  placeholder:'contoh: 100' },
      { id:'tek-a', label:'Luas (A)', unit:'m²', placeholder:'contoh: 0.5' }
    ],
    resultLabel: 'Tekanan (P)',
    resultUnit: 'Pascal (Pa)',
    calculate(vals) {
      const F = parseFloat(vals['tek-f']);
      const A = parseFloat(vals['tek-a']);
      if (isNaN(F) || isNaN(A)) return null;
      if (A <= 0) return { error: 'Luas harus lebih dari 0' };
      const P = F / A;
      return { value: P.toFixed(4), label: `P = ${F} / ${A} = ${P.toFixed(4)} Pa` };
    }
  },
  'massa-jenis': {
    title: 'Massa Jenis',
    desc: 'Hitung massa jenis benda berdasarkan massa dan volumenya.',
    formula: 'ρ = m / V',
    inputs: [
      { id:'mj-m', label:'Massa (m)',   unit:'kg', placeholder:'contoh: 8'   },
      { id:'mj-v', label:'Volume (V)', unit:'m³', placeholder:'contoh: 0.001'}
    ],
    resultLabel: 'Massa Jenis (ρ)',
    resultUnit: 'kg/m³',
    calculate(vals) {
      const m = parseFloat(vals['mj-m']);
      const V = parseFloat(vals['mj-v']);
      if (isNaN(m) || isNaN(V)) return null;
      if (V <= 0) return { error: 'Volume harus lebih dari 0' };
      const rho = m / V;
      return { value: rho.toFixed(4), label: `ρ = ${m} / ${V} = ${rho.toFixed(4)} kg/m³` };
    }
  },
  daya: {
    title: 'Daya',
    desc: 'Hitung daya berdasarkan usaha dan waktu, atau tegangan dan arus.',
    formula: 'P = W/t  atau  P = V·I',
    inputs: [
      { id:'daya-w', label:'Usaha (W)',       unit:'J', placeholder:'contoh: 1000' },
      { id:'daya-t', label:'Waktu (t)',        unit:'s', placeholder:'contoh: 5'    }
    ],
    resultLabel: 'Daya (P)',
    resultUnit: 'Watt (W)',
    calculate(vals) {
      const W = parseFloat(vals['daya-w']);
      const t = parseFloat(vals['daya-t']);
      if (isNaN(W) || isNaN(t)) return null;
      if (t <= 0) return { error: 'Waktu harus lebih dari 0' };
      const P = W / t;
      return { value: P.toFixed(4), label: `P = ${W} / ${t} = ${P.toFixed(4)} W` };
    }
  },
  kalor: {
    title: 'Kalor',
    desc: 'Hitung kalor yang dibutuhkan untuk menaikkan/menurunkan suhu benda.',
    formula: 'Q = m·c·ΔT',
    inputs: [
      { id:'kal-m',  label:'Massa (m)',         unit:'kg',      placeholder:'contoh: 2'   },
      { id:'kal-c',  label:'Kalor Jenis (c)',    unit:'J/(kg·K)',placeholder:'contoh: 4200' },
      { id:'kal-dt', label:'Perubahan Suhu (ΔT)',unit:'K atau °C',placeholder:'contoh: 50' }
    ],
    resultLabel: 'Kalor (Q)',
    resultUnit: 'Joule (J)',
    calculate(vals) {
      const m  = parseFloat(vals['kal-m']);
      const c  = parseFloat(vals['kal-c']);
      const dT = parseFloat(vals['kal-dt']);
      if ([m,c,dT].some(isNaN)) return null;
      if (m < 0 || c < 0) return { error: 'Nilai tidak boleh negatif' };
      const Q = m * c * dT;
      return { value: Q.toFixed(2), label: `Q = ${m} × ${c} × ${dT} = ${Q.toFixed(2)} J` };
    }
  }
};

function buildCalcPanels() {
  const container = document.getElementById('calc-panels');
  if (!container) return;

  container.innerHTML = Object.entries(CALCULATORS).map(([key, calc]) => {
    const inputsHTML = calc.inputs.map(inp => `
      <div class="calc-input-group">
        <label for="${inp.id}">${inp.label} <span class="unit">(${inp.unit})</span></label>
        <input type="number" id="${inp.id}" class="calc-input" placeholder="${inp.placeholder}" step="any" aria-label="${inp.label}" />
      </div>
    `).join('');

    return `
      <div class="calc-panel ${key === 'glb' ? 'active' : ''}" id="calc-panel-${key}" role="tabpanel" aria-labelledby="calc-tab-${key}">
        <h3 class="calc-title">${calc.title}</h3>
        <p class="calc-desc">${calc.desc}</p>
        <div class="calc-formula-display">${calc.formula}</div>
        <div class="calc-inputs">${inputsHTML}</div>
        <div class="calc-buttons">
          <button class="btn btn-primary" data-calc-key="${key}" id="calc-btn-${key}">Hitung →</button>
          <button class="btn btn-ghost" data-calc-reset="${key}">Reset</button>
        </div>
        <div class="calc-result" id="calc-result-${key}">
          <div class="calc-result-value" id="calc-result-value-${key}">—</div>
          <div class="calc-result-label">${calc.resultLabel} (${calc.resultUnit})</div>
        </div>
      </div>
    `;
  }).join('');

  // Tab switching
  document.querySelectorAll('.calc-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.calc;
      document.querySelectorAll('.calc-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
      document.querySelectorAll('.calc-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      tab.setAttribute('aria-selected','true');
      const panel = document.getElementById(`calc-panel-${key}`);
      if (panel) panel.classList.add('active');
    });
  });

  // Calculate buttons
  container.querySelectorAll('[data-calc-key]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key  = btn.dataset.calcKey;
      const calc = CALCULATORS[key];
      if (!calc) return;

      const vals = {};
      calc.inputs.forEach(inp => {
        const el = document.getElementById(inp.id);
        if (el) vals[inp.id] = el.value;
      });

      try {
        const result = calc.calculate(vals);
        const valEl  = document.getElementById(`calc-result-value-${key}`);
        if (!valEl) return;

        if (result === null) {
          valEl.textContent = '⚠ Masukkan semua nilai terlebih dahulu';
          valEl.style.fontSize = '1rem';
          valEl.style.color = 'var(--warning)';
        } else if (result.error) {
          valEl.textContent = '❌ ' + result.error;
          valEl.style.fontSize = '1rem';
          valEl.style.color = 'var(--danger)';
        } else {
          valEl.textContent = result.value;
          valEl.style.fontSize = result.value.includes('\n') ? '1.1rem' : '1.6rem';
          valEl.style.color = 'var(--accent-light)';
          valEl.style.whiteSpace = 'pre-line';
          showToast('Perhitungan selesai!', 'success', 2000);
        }
      } catch (err) {
        console.error('Calc error:', err);
        showToast('Terjadi kesalahan dalam perhitungan.', 'error');
      }
    });
  });

  // Reset buttons
  container.querySelectorAll('[data-calc-reset]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key  = btn.dataset.calcReset;
      const calc = CALCULATORS[key];
      if (!calc) return;
      calc.inputs.forEach(inp => {
        const el = document.getElementById(inp.id);
        if (el) el.value = '';
      });
      const valEl = document.getElementById(`calc-result-value-${key}`);
      if (valEl) {
        valEl.textContent = '—';
        valEl.style.fontSize = '1.6rem';
        valEl.style.color = 'var(--accent-light)';
      }
    });
  });

  // Live calculation on Enter
  container.querySelectorAll('.calc-input').forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        // find and click the calculate btn in the same panel
        const panel = input.closest('.calc-panel');
        if (panel) {
          const calcBtn = panel.querySelector('[data-calc-key]');
          calcBtn && calcBtn.click();
        }
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', buildCalcPanels);

/* =====================================================
   QUIZ MODULE — 10 soal interaktif
   ===================================================== */
const QUIZ_QUESTIONS = [
  {
    q: 'Sebuah mobil bergerak dengan GLB, kecepatan 60 km/jam selama 2 jam. Berapa jaraknya?',
    opts: ['100 km', '120 km', '90 km', '150 km'],
    answer: 1,
    explanation: 's = v × t = 60 × 2 = 120 km. Ingat: v dan t harus dalam satuan yang konsisten.'
  },
  {
    q: 'Massa sebuah benda 10 kg. Jika percepatan gravitasi 10 m/s², berapakah beratnya?',
    opts: ['10 N', '100 N', '50 N', '1000 N'],
    answer: 1,
    explanation: 'W = m × g = 10 × 10 = 100 N. Berat adalah gaya gravitasi pada benda.'
  },
  {
    q: 'Dua muatan q₁ = 1 μC dan q₂ = 4 μC berjarak 0.3 m. Gaya Coulomb antara keduanya... (k = 9×10⁹)',
    opts: ['0.2 N', '0.4 N', '0.6 N', '0.8 N'],
    answer: 1,
    explanation: 'F = kq₁q₂/r² = 9×10⁹ × 10⁻⁶ × 4×10⁻⁶ / 0.09 = 36×10⁻³/0.09 = 0.4 N'
  },
  {
    q: 'Benda 4 kg bergerak dengan kecepatan 3 m/s. Berapakah energi kinetiknya?',
    opts: ['6 J', '12 J', '18 J', '36 J'],
    answer: 2,
    explanation: 'Ek = ½mv² = ½ × 4 × 9 = 18 J'
  },
  {
    q: 'Gelombang merambat dengan frekuensi 50 Hz dan panjang gelombang 4 m. Cepat rambatnya adalah...',
    opts: ['12.5 m/s', '54 m/s', '200 m/s', '46 m/s'],
    answer: 2,
    explanation: 'v = λ × f = 4 × 50 = 200 m/s'
  },
  {
    q: 'Hukum I Newton menyatakan bahwa benda akan tetap diam atau bergerak lurus beraturan jika...',
    opts: ['Resultannya besar', 'Resultan gaya = 0', 'Percepatannya besar', 'Massanya kecil'],
    answer: 1,
    explanation: 'Hukum I Newton (inersia): benda mempertahankan keadaan geraknya jika resultan gaya = 0 (ΣF = 0).'
  },
  {
    q: 'Sebuah pegas dengan k = 400 N/m ditarik 10 cm. Energi yang tersimpan adalah...',
    opts: ['0.2 J', '2 J', '20 J', '200 J'],
    answer: 1,
    explanation: 'Ep = ½kx² = ½ × 400 × 0.1² = ½ × 400 × 0.01 = 2 J'
  },
  {
    q: 'Bandul panjang 0.25 m berayun. Berapakah periodenya? (g = 10 m/s², π² ≈ 10)',
    opts: ['π s', '1 s', '0.5 s', '2 s'],
    answer: 1,
    explanation: 'T = 2π√(L/g) = 2π√(0.25/10) = 2π × 0.158 ≈ 1 s (dengan π²=10: T=2π√(1/40)=2π/6.32≈1 s)'
  },
  {
    q: 'Dalam rangkaian seri dengan R₁=4Ω, R₂=6Ω, dan tegangan 20V. Berapakah arusnya?',
    opts: ['1 A', '2 A', '3 A', '4 A'],
    answer: 1,
    explanation: 'Rₛ = 4 + 6 = 10 Ω. I = V/R = 20/10 = 2 A'
  },
  {
    q: 'Sebuah foton memiliki energi 3.32×10⁻¹⁹ J. Berapakah frekuensinya? (h = 6.63×10⁻³⁴ J·s)',
    opts: ['3×10¹⁴ Hz', '5×10¹⁴ Hz', '2×10¹⁴ Hz', '4×10¹⁴ Hz'],
    answer: 1,
    explanation: 'f = E/h = 3.32×10⁻¹⁹ / 6.63×10⁻³⁴ ≈ 5×10¹⁴ Hz (cahaya tampak)'
  }
];

let quizState = {
  current: 0,
  score: 0,
  answers: [],
  answered: false
};

function initQuiz() {
  const startBtn = document.getElementById('start-quiz-btn');
  startBtn && startBtn.addEventListener('click', startQuiz);
}

function startQuiz() {
  quizState = { current: 0, score: 0, answers: [], answered: false };

  const startEl  = document.getElementById('quiz-start');
  const gameEl   = document.getElementById('quiz-game');
  const resultEl = document.getElementById('quiz-result');

  if (startEl)  startEl.style.display  = 'none';
  if (gameEl)   gameEl.style.display   = 'block';
  if (resultEl) resultEl.style.display = 'none';

  renderQuestion();
}

function renderQuestion() {
  const q   = QUIZ_QUESTIONS[quizState.current];
  const tot = QUIZ_QUESTIONS.length;

  // Update header
  const qCurrent = document.getElementById('q-current');
  const qTotal   = document.getElementById('q-total');
  const progBar  = document.getElementById('quiz-progress-bar');
  const liveScore= document.getElementById('live-score');

  if (qCurrent)  qCurrent.textContent  = quizState.current + 1;
  if (qTotal)    qTotal.textContent    = tot;
  if (progBar)   progBar.style.width   = `${((quizState.current + 1) / tot) * 100}%`;
  if (liveScore) liveScore.textContent = quizState.score;

  // Render question
  const qText   = document.getElementById('question-text');
  const optGrid = document.getElementById('options-grid');
  const nextBtn = document.getElementById('next-quiz-btn');

  if (qText) qText.textContent = `${quizState.current + 1}. ${q.q}`;
  if (nextBtn) nextBtn.style.display = 'none';
  quizState.answered = false;

  if (optGrid) {
    const letters = ['A','B','C','D'];
    optGrid.innerHTML = q.opts.map((opt, i) => `
      <button class="option-btn" data-index="${i}" aria-label="Pilihan ${letters[i]}: ${opt}">
        <span class="option-letter" aria-hidden="true">${letters[i]}</span>
        <span>${opt}</span>
      </button>
    `).join('');

    optGrid.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (quizState.answered) return;
        selectAnswer(parseInt(btn.dataset.index, 10));
      });
    });
  }
}

function selectAnswer(selectedIndex) {
  quizState.answered = true;
  const q = QUIZ_QUESTIONS[quizState.current];
  const correct = selectedIndex === q.answer;

  if (correct) {
    quizState.score++;
    showToast('✅ Benar!', 'success', 1500);
  } else {
    showToast('❌ Kurang tepat', 'error', 1500);
  }

  quizState.answers.push({ selected: selectedIndex, correct });

  // Update button styles
  const optGrid = document.getElementById('options-grid');
  if (optGrid) {
    optGrid.querySelectorAll('.option-btn').forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.answer)    btn.classList.add('correct');
      if (i === selectedIndex && !correct) btn.classList.add('wrong');
    });
  }

  // Update live score
  const liveScore = document.getElementById('live-score');
  if (liveScore) liveScore.textContent = quizState.score;

  // Show next/finish button
  const nextBtn = document.getElementById('next-quiz-btn');
  if (nextBtn) {
    nextBtn.style.display = 'block';
    const isLast = quizState.current === QUIZ_QUESTIONS.length - 1;
    nextBtn.textContent = isLast ? 'Lihat Hasil Quiz →' : 'Soal Berikutnya →';

    // Remove previous listener
    const newBtn = nextBtn.cloneNode(true);
    nextBtn.parentNode.replaceChild(newBtn, nextBtn);
    newBtn.style.display = 'block';
    newBtn.addEventListener('click', () => {
      quizState.current++;
      if (quizState.current >= QUIZ_QUESTIONS.length) {
        showResult();
      } else {
        renderQuestion();
      }
    });
  }
}

function showResult() {
  const gameEl   = document.getElementById('quiz-game');
  const resultEl = document.getElementById('quiz-result');
  if (gameEl)   gameEl.style.display   = 'none';
  if (!resultEl) return;
  resultEl.style.display = 'block';

  const score = quizState.score;
  const total = QUIZ_QUESTIONS.length;
  const pct   = Math.round((score / total) * 100);

  let grade, msg, emoji;
  if (pct >= 90) { grade='A'; msg='Luar biasa! Pemahaman fisikamu sangat baik.'; emoji='🏆'; }
  else if (pct >= 75) { grade='B'; msg='Bagus! Terus tingkatkan kemampuanmu.'; emoji='🌟'; }
  else if (pct >= 60) { grade='C'; msg='Cukup baik, tapi masih perlu banyak latihan.'; emoji='📚'; }
  else { grade='D'; msg='Jangan menyerah! Baca kembali materi dan coba lagi.'; emoji='💪'; }

  const reviewHTML = QUIZ_QUESTIONS.map((q, i) => {
    const ans = quizState.answers[i];
    const isCorrect = ans && ans.correct;
    return `
      <div class="review-item ${isCorrect ? 'correct-item' : 'wrong-item'}">
        <p class="review-q">${i+1}. ${q.q}</p>
        <div class="review-answers">
          <p class="review-your">Jawabanmu: ${ans ? q.opts[ans.selected] : '-'} ${isCorrect ? '✅' : '❌'}</p>
          ${!isCorrect ? `<p class="review-correct-ans">Jawaban benar: ${q.opts[q.answer]} ✅</p>` : ''}
          <p class="review-explanation">💡 ${q.explanation}</p>
        </div>
      </div>
    `;
  }).join('');

  resultEl.innerHTML = `
    <div class="result-score-circle">
      <span class="score-num">${score}</span>
      <span class="score-total">dari ${total}</span>
    </div>
    <p class="result-grade">${emoji} Nilai: ${pct}/100 — Grade ${grade}</p>
    <p class="result-message">${msg}</p>
    <div class="result-actions">
      <button class="btn btn-primary" id="retry-quiz-btn">🔄 Ulangi Quiz</button>
      <button class="btn btn-outline" id="back-to-start-btn">🏠 Kembali</button>
    </div>
    <div class="review-section">
      <h3 class="review-title">📋 Pembahasan Lengkap</h3>
      ${reviewHTML}
    </div>
  `;

  document.getElementById('retry-quiz-btn') && document.getElementById('retry-quiz-btn').addEventListener('click', startQuiz);
  document.getElementById('back-to-start-btn') && document.getElementById('back-to-start-btn').addEventListener('click', () => {
    resultEl.style.display = 'none';
    const startEl = document.getElementById('quiz-start');
    if (startEl) startEl.style.display = 'block';
  });

  resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  showToast(`Quiz selesai! Skor: ${score}/${total} (${pct}%)`, score >= 7 ? 'success' : 'info', 4000);
}

document.addEventListener('DOMContentLoaded', initQuiz);

/* =====================================================
   GLOBAL ERROR HANDLING
   ===================================================== */
window.addEventListener('error', (e) => {
  console.error('Runtime error:', e.message, e.filename, e.lineno);
  // Only show toast for non-trivial errors
  if (e.message && !e.message.includes('Script error')) {
    showToast('Terjadi kesalahan. Silakan muat ulang halaman.', 'error', 5000);
  }
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

/* =====================================================
   SMOOTH SCROLL for anchor links
   ===================================================== */
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const targetId = link.getAttribute('href').slice(1);
  if (!targetId) return;
  const target = document.getElementById(targetId);
  if (target) {
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h')) || 64) - 16;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  }
});

/* =====================================================
   INTERSECTION OBSERVER for lazy animations
   ===================================================== */
// Re-run on dynamic content changes
const animObserver = new MutationObserver(() => {
  document.querySelectorAll('.animate-on-scroll:not(.visible)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 40) el.classList.add('visible');
  });
});
animObserver.observe(document.body, { childList: true, subtree: true });

// Scroll event for manual check
window.addEventListener('scroll', () => {
  document.querySelectorAll('.animate-on-scroll:not(.visible)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) el.classList.add('visible');
  });
}, { passive: true });

/* =====================================================
   INITIALIZATION COMPLETE
   ===================================================== */
console.log('%cPhysics Hub v1.0.0 loaded ⚛', 'color:#3b82f6; font-size:14px; font-weight:bold;');
