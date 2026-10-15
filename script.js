/* ==========================================================================
   SCRIPT.JS - HTML, CSS & JAVASCRIPT DASAR (SMP/MTs KELAS VIII & IX)
   Fitur:
   1. Navigasi SPA 6 Menu Utama (Single Page Application)
   2. Sub-menu Tab Materi (A s/d G - Termasuk JavaScript Dasar)
   3. Web Lab 3 Tab: HTML, CSS & JavaScript
   4. Aktivitas 1: Tebak Tag HTML
   5. Aktivitas 2: Cocokkan HTML dan Fungsinya (Matching Game)
   6. Aktivitas 3: Pilih CSS yang Tepat
   7. Aktivitas 4: Simulasi Web Sederhana (3-Panel Live Code & Preview)
   8. Aktivitas 5: Simulasi Logika JavaScript (prompt() + if)
   9. Mini Project: Checklist Interaktif Profil Siswa (LocalStorage)
   10. Kuis Interaktif 10 Soal Berjenjang (HTML, CSS & JS)
   11. Virtual Console & Interactive JS Runners
   12. Sistem Progres Belajar Terintegrasi (LocalStorage)
   ========================================================================== */

// --- SOUND SYNTHESIZER (WEB AUDIO API) ---
function playAudioTone(type) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15); // G5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'error') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
      osc.frequency.setValueAtTime(196, ctx.currentTime + 0.1); // G3
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'complete') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.45);
    }
  } catch (e) {
    // Audio otomatis dibatasi sebelum interaksi
  }
}

/* ==========================================================================
   1. SISTEM PROGRES BELAJAR (LOCALSTORAGE)
   ========================================================================== */
const PROGRESS_STORAGE_KEY = 'smp_web_dev_progress_v2';

let studentProgress = {
  visitedSections: ['beranda'],
  materiOpened: [],
  act1Done: false,
  act2Done: false,
  act3Done: false,
  act4Done: false,
  actJsDone: false,
  checklistChecked: [],
  quizBestScore: 0
};

function loadProgress() {
  try {
    const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (saved) {
      studentProgress = Object.assign(studentProgress, JSON.parse(saved));
    }
  } catch (e) {
    console.warn('Gagal memuat localStorage:', e);
  }
  updateGlobalProgressDisplay();
}

function saveProgress() {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(studentProgress));
  } catch (e) {
    console.warn('Gagal menyimpan localStorage:', e);
  }
  updateGlobalProgressDisplay();
}

function calculateProgressPercent() {
  let total = 0;

  // 7 Topik Materi (A s/d G) @ 4 poin = 28 poin
  const materiCount = (studentProgress.materiOpened || []).length;
  total += Math.min(28, materiCount * 4);

  // 5 Aktivitas @ 7 poin = 35 poin
  if (studentProgress.act1Done) total += 7;
  if (studentProgress.act2Done) total += 7;
  if (studentProgress.act3Done) total += 7;
  if (studentProgress.act4Done) total += 7;
  if (studentProgress.actJsDone) total += 7;

  // Checklist Mini Project (10 item @ 1.7 poin) = 17 poin
  const checkedCount = (studentProgress.checklistChecked || []).length;
  total += Math.min(17, checkedCount * 1.7);

  // Skor Kuis (hingga 20 poin)
  if (studentProgress.quizBestScore > 0) {
    total += Math.round((studentProgress.quizBestScore / 100) * 20);
  }

  return Math.min(100, Math.round(total));
}

function updateGlobalProgressDisplay() {
  const pct = calculateProgressPercent();
  const bar = document.getElementById('globalProgressBar');
  const text = document.getElementById('globalProgressPercent');
  if (bar) bar.style.width = pct + '%';
  if (text) text.innerText = pct + '%';
}

function recordProgressItem(type, id) {
  if (type === 'section') {
    if (!studentProgress.visitedSections.includes(id)) {
      studentProgress.visitedSections.push(id);
    }
  } else if (type === 'materi') {
    if (!studentProgress.materiOpened.includes(id)) {
      studentProgress.materiOpened.push(id);
    }
  }
  saveProgress();
}

/* ==========================================================================
   2. NAVIGASI SINGLE-PAGE (6 MENU UTAMA)
   ========================================================================== */
function navigateTo(sectionId) {
  if (sectionId === 'weblab') sectionId = 'html-css';
  const navMenu = document.getElementById('mainNav');
  if (navMenu) navMenu.classList.remove('show');

  const sections = document.querySelectorAll('.page-section');
  sections.forEach(sec => sec.classList.remove('active'));

  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => {
    if (btn.getAttribute('data-section') === sectionId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  recordProgressItem('section', sectionId);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
  const navMenu = document.getElementById('mainNav');
  if (navMenu) {
    navMenu.classList.toggle('show');
  }
}

/* ==========================================================================
   3. SUB-MENU MATERI PEMBELAJARAN (A s/d G)
   ========================================================================== */
function switchMateriTab(panelId) {
  const tabs = document.querySelectorAll('.materi-tab-btn');
  tabs.forEach(tab => {
    if (tab.getAttribute('onclick') && tab.getAttribute('onclick').includes(panelId)) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  const panels = document.querySelectorAll('.materi-content-panel');
  panels.forEach(panel => {
    if (panel.id === panelId) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });

  recordProgressItem('materi', panelId);
  window.scrollTo({ top: 180, behavior: 'smooth' });
}

function openMateriSub(panelId) {
  navigateTo('materi');
  setTimeout(() => {
    switchMateriTab(panelId);
  }, 50);
}

// Virtual runner handled by selectJsPreset & runJsPreset below

/* ==========================================================================
   4. WEB LAB KARTU (HTML, CSS & JAVASCRIPT)
   ========================================================================== */
function switchLabTab(type) {
  const btnHtml = document.getElementById('btnLabHtml');
  const btnCss = document.getElementById('btnLabCss');
  const btnJs = document.getElementById('btnLabJs');

  const secHtml = document.getElementById('labHtmlSection');
  const secCss = document.getElementById('labCssSection');
  const secJs = document.getElementById('labJsSection');

  [btnHtml, btnCss, btnJs].forEach(b => b && b.classList.remove('active'));
  [secHtml, secCss, secJs].forEach(s => s && s.classList.remove('active'));

  if (type === 'html') {
    if (btnHtml) btnHtml.classList.add('active');
    if (secHtml) secHtml.classList.add('active');
  } else if (type === 'css') {
    if (btnCss) btnCss.classList.add('active');
    if (secCss) secCss.classList.add('active');
  } else if (type === 'js') {
    if (btnJs) btnJs.classList.add('active');
    if (secJs) secJs.classList.add('active');
  }
}

function demoLabPrompt() {
  const hobi = prompt('Apa hobi favoritmu saat ini?', 'Membaca Buku');
  if (hobi !== null && hobi.trim() !== '') {
    playAudioTone('success');
    alert(`Hebat! Variabel hobi sekarang bernilai: "${hobi}"\nBuka konsol untuk melihat output console.log().`);
    console.log(`[Lab Siswa] Hobi tersimpan: ${hobi}`);
  }
}

/* ==========================================================================
   5. MENU AKTIVITAS TAB SWITCHER
   ========================================================================== */
function switchActivityTab(actId) {
  const tabs = document.querySelectorAll('.act-tab-btn');
  tabs.forEach(tab => {
    if (tab.getAttribute('onclick') && tab.getAttribute('onclick').includes(actId)) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  const panels = document.querySelectorAll('.activity-panel');
  panels.forEach(p => {
    if (p.id === actId) {
      p.classList.add('active');
    } else {
      p.classList.remove('active');
    }
  });
}

/* ==========================================================================
   6. AKTIVITAS 1: TEBAK TAG HTML (8 SOAL)
   ========================================================================== */
const act1Questions = [
  {
    prompt: 'Tag apa yang digunakan untuk membuat judul utama paling besar pada halaman web?',
    options: ['<p>', '<h1>', '<img>', '<table>'],
    correct: 1,
    explanation: 'Tag <h1> adalah heading level 1, yaitu judul paling utama dan paling besar.'
  },
  {
    prompt: 'Tag apa yang digunakan untuk membuat sebuah paragraf teks bacaan?',
    options: ['<p>', '<a>', '<ul>', '<h1>'],
    correct: 0,
    explanation: 'Tag <p> merupakan singkatan dari Paragraph, digunakan untuk menyusun paragraf teks.'
  },
  {
    prompt: 'Tag apa yang digunakan untuk membuat tautan atau link ke halaman web lain?',
    options: ['<link>', '<href>', '<a>', '<url>'],
    correct: 2,
    explanation: 'Tag <a> (Anchor) digunakan bersama atribut href untuk membuat link yang dapat diklik.'
  },
  {
    prompt: 'Tag apa yang digunakan untuk menampilkan gambar atau foto pada halaman web?',
    options: ['<image>', '<picture>', '<photo>', '<img>'],
    correct: 3,
    explanation: 'Tag <img> digunakan untuk memuat gambar dengan atribut src sebagai lokasi berkasnya.'
  },
  {
    prompt: 'Tag apa yang digunakan untuk membuat daftar dengan tanda titik (bullet)?',
    options: ['<ol>', '<ul>', '<li>', '<list>'],
    correct: 1,
    explanation: 'Tag <ul> (Unordered List) menghasilkan daftar dengan simbol titik (bullet).'
  },
  {
    prompt: 'Tag apa yang digunakan untuk membuat daftar dengan urutan angka atau nomor?',
    options: ['<ol>', '<ul>', '<number>', '<dl>'],
    correct: 0,
    explanation: 'Tag <ol> (Ordered List) otomatis memberikan penomoran urut 1, 2, 3 pada butir daftar.'
  },
  {
    prompt: 'Tag apa yang digunakan untuk membuat baris di dalam sebuah tabel?',
    options: ['<table>', '<td>', '<th>', '<tr>'],
    correct: 3,
    explanation: 'Tag <tr> singkatan dari Table Row, digunakan untuk membuat baris mendatar pada tabel.'
  },
  {
    prompt: 'Tag apa yang digunakan untuk membuat sel isi data di dalam tabel?',
    options: ['<td>', '<th>', '<tr>', '<data>'],
    correct: 0,
    explanation: 'Tag <td> singkatan dari Table Data, digunakan untuk mengisi data di setiap kolom baris.'
  }
];

let act1CurrentIndex = 0;
let act1Score = 0;

function renderAct1Question() {
  const q = act1Questions[act1CurrentIndex];
  const counter = document.getElementById('act1Counter');
  const prompt = document.getElementById('act1Prompt');
  const grid = document.getElementById('act1OptionsGrid');
  const feedback = document.getElementById('act1Feedback');
  const nextBtn = document.getElementById('act1NextBtn');
  const restartBtn = document.getElementById('act1RestartBtn');

  if (counter) counter.innerText = `Soal ${act1CurrentIndex + 1} dari ${act1Questions.length}`;
  if (prompt) prompt.innerHTML = `"${q.prompt}"`;
  if (feedback) feedback.style.display = 'none';
  if (nextBtn) nextBtn.style.display = 'none';
  if (restartBtn) restartBtn.style.display = 'none';

  if (grid) {
    grid.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `<span class="opt-prefix">${letters[idx]}</span> <code>${escapeHtml(opt)}</code>`;
      btn.onclick = () => handleAct1Answer(idx);
      grid.appendChild(btn);
    });
  }
}

function handleAct1Answer(selectedIndex) {
  const q = act1Questions[act1CurrentIndex];
  const grid = document.getElementById('act1OptionsGrid');
  const btns = grid.querySelectorAll('.option-btn');
  const feedback = document.getElementById('act1Feedback');
  const feedbackIcon = document.getElementById('act1FeedbackIcon');
  const feedbackTitle = document.getElementById('act1FeedbackTitle');
  const feedbackText = document.getElementById('act1FeedbackText');
  const nextBtn = document.getElementById('act1NextBtn');
  const restartBtn = document.getElementById('act1RestartBtn');

  btns.forEach(b => b.setAttribute('disabled', 'true'));

  const isCorrect = (selectedIndex === q.correct);

  if (isCorrect) {
    btns[selectedIndex].classList.add('correct');
    act1Score += 10;
    playAudioTone('success');
    if (feedback) {
      feedback.className = 'feedback-box correct';
      feedbackIcon.innerText = '✅';
      feedbackTitle.innerText = 'Jawaban Tepat!';
      feedbackText.innerText = q.explanation;
      feedback.style.display = 'flex';
    }
  } else {
    btns[selectedIndex].classList.add('wrong');
    btns[q.correct].classList.add('correct');
    playAudioTone('error');
    if (feedback) {
      feedback.className = 'feedback-box wrong';
      feedbackIcon.innerText = '❌';
      feedbackTitle.innerText = 'Kurang Tepat';
      feedbackText.innerText = `Jawaban yang benar adalah ${q.options[q.correct]}. ${q.explanation}`;
      feedback.style.display = 'flex';
    }
  }

  const scoreDisplay = document.getElementById('act1ScoreDisplay');
  if (scoreDisplay) scoreDisplay.innerText = act1Score;

  if (act1CurrentIndex < act1Questions.length - 1) {
    if (nextBtn) nextBtn.style.display = 'inline-flex';
  } else {
    studentProgress.act1Done = true;
    saveProgress();
    playAudioTone('complete');
    if (restartBtn) restartBtn.style.display = 'inline-flex';
  }
}

function nextAct1Question() {
  if (act1CurrentIndex < act1Questions.length - 1) {
    act1CurrentIndex++;
    renderAct1Question();
  }
}

function restartAct1() {
  act1CurrentIndex = 0;
  act1Score = 0;
  const scoreDisplay = document.getElementById('act1ScoreDisplay');
  if (scoreDisplay) scoreDisplay.innerText = 0;
  renderAct1Question();
}

/* ==========================================================================
   7. AKTIVITAS 2: COCOKKAN HTML DAN FUNGSINYA (MATCHING GAME)
   ========================================================================== */
const act2Pairs = [
  { id: 'h1', tag: '<h1>', func: 'Membuat judul utama' },
  { id: 'p', tag: '<p>', func: 'Membuat paragraf' },
  { id: 'a', tag: '<a>', func: 'Membuat link tautan' },
  { id: 'img', tag: '<img>', func: 'Menampilkan gambar' },
  { id: 'ul', tag: '<ul>', func: 'Membuat daftar' },
  { id: 'table', tag: '<table>', func: 'Membuat tabel' }
];

let act2SelectedLeft = null;
let act2SelectedRight = null;
let act2MatchedPairs = [];

function initAct2Game() {
  act2SelectedLeft = null;
  act2SelectedRight = null;
  act2MatchedPairs = [];

  const leftCol = document.getElementById('act2LeftColumn');
  const rightCol = document.getElementById('act2RightColumn');
  const countDisplay = document.getElementById('act2MatchedCount');
  const completeBox = document.getElementById('act2CompleteBox');

  if (countDisplay) countDisplay.innerText = 0;
  if (completeBox) completeBox.style.display = 'none';

  if (!leftCol || !rightCol) return;

  while (leftCol.children.length > 1) leftCol.removeChild(leftCol.lastChild);
  while (rightCol.children.length > 1) rightCol.removeChild(rightCol.lastChild);

  const shuffledRight = [...act2Pairs].sort(() => Math.random() - 0.5);

  act2Pairs.forEach(item => {
    const card = document.createElement('div');
    card.className = 'match-card';
    card.id = `left-${item.id}`;
    card.innerHTML = `<code>${escapeHtml(item.tag)}</code>`;
    card.onclick = () => handleAct2LeftClick(item.id);
    leftCol.appendChild(card);
  });

  shuffledRight.forEach(item => {
    const card = document.createElement('div');
    card.className = 'match-card';
    card.id = `right-${item.id}`;
    card.innerText = item.func;
    card.onclick = () => handleAct2RightClick(item.id);
    rightCol.appendChild(card);
  });
}

function handleAct2LeftClick(id) {
  if (act2MatchedPairs.includes(id)) return;
  document.querySelectorAll('#act2LeftColumn .match-card').forEach(c => c.classList.remove('selected'));

  const card = document.getElementById(`left-${id}`);
  if (card) card.classList.add('selected');
  act2SelectedLeft = id;
  checkAct2Match();
}

function handleAct2RightClick(id) {
  if (act2MatchedPairs.includes(id)) return;
  document.querySelectorAll('#act2RightColumn .match-card').forEach(c => c.classList.remove('selected'));

  const card = document.getElementById(`right-${id}`);
  if (card) card.classList.add('selected');
  act2SelectedRight = id;
  checkAct2Match();
}

function checkAct2Match() {
  if (!act2SelectedLeft || !act2SelectedRight) return;

  const leftCard = document.getElementById(`left-${act2SelectedLeft}`);
  const rightCard = document.getElementById(`right-${act2SelectedRight}`);

  if (act2SelectedLeft === act2SelectedRight) {
    act2MatchedPairs.push(act2SelectedLeft);
    playAudioTone('success');

    if (leftCard) {
      leftCard.classList.remove('selected');
      leftCard.classList.add('matched');
      leftCard.innerHTML += ' ✅';
    }
    if (rightCard) {
      rightCard.classList.remove('selected');
      rightCard.classList.add('matched');
      rightCard.innerText += ' ✅';
    }

    const countDisplay = document.getElementById('act2MatchedCount');
    if (countDisplay) countDisplay.innerText = act2MatchedPairs.length;

    act2SelectedLeft = null;
    act2SelectedRight = null;

    if (act2MatchedPairs.length === act2Pairs.length) {
      studentProgress.act2Done = true;
      saveProgress();
      playAudioTone('complete');
      const completeBox = document.getElementById('act2CompleteBox');
      if (completeBox) completeBox.style.display = 'block';
    }
  } else {
    playAudioTone('error');
    if (leftCard) leftCard.classList.add('error-shake');
    if (rightCard) rightCard.classList.add('error-shake');

    setTimeout(() => {
      if (leftCard) leftCard.classList.remove('error-shake', 'selected');
      if (rightCard) rightCard.classList.remove('error-shake', 'selected');
      act2SelectedLeft = null;
      act2SelectedRight = null;
    }, 450);
  }
}

function resetAct2Game() {
  initAct2Game();
}

/* ==========================================================================
   8. AKTIVITAS 3: PILIH CSS YANG TEPAT (8 SOAL)
   ========================================================================== */
const act3Questions = [
  {
    prompt: 'Kamu ingin membuat teks judul menjadi berwarna merah.',
    options: ['color: red;', 'font-size: red;', 'background: text;', 'border: red;'],
    correct: 0,
    explanation: 'Properti color: red; digunakan khusus untuk mengubah warna teks tulisan.'
  },
  {
    prompt: 'Kamu ingin mengubah warna latar belakang halaman web menjadi biru muda.',
    options: ['background-color: lightblue;', 'color: lightblue;', 'page-color: lightblue;', 'border-color: lightblue;'],
    correct: 0,
    explanation: 'background-color adalah properti yang benar untuk mewarnai latar belakang elemen/halaman.'
  },
  {
    prompt: 'Kamu ingin mengubah ukuran teks judul utama menjadi 32 piksel.',
    options: ['text-size: 32px;', 'font-size: 32px;', 'font-weight: 32px;', 'height: 32px;'],
    correct: 1,
    explanation: 'font-size digunakan untuk mengatur besar kecilnya ukuran tulisan dalam satuan piksel (px).'
  },
  {
    prompt: 'Kamu ingin memosisikan teks judul tepat berada di tengah layar.',
    options: ['text-align: center;', 'margin: center;', 'align-items: middle;', 'position: center;'],
    correct: 0,
    explanation: 'text-align: center; digunakan untuk mengatur perataan teks agar berada di posisi tengah.'
  },
  {
    prompt: 'Kamu ingin memberi bingkai garis tepi hitam setebal 2px di sekeliling kotak.',
    options: ['outline: 2px solid;', 'border: 2px solid black;', 'margin: 2px solid black;', 'box: 2px black;'],
    correct: 1,
    explanation: 'border: 2px solid black; menggabungkan ketebalan (2px), model garis (solid), dan warna (black).'
  },
  {
    prompt: 'Kamu ingin memberi jarak LUAR antara satu kartu dengan kartu di sebelahnya.',
    options: ['padding: 20px;', 'margin: 20px;', 'width: 20px;', 'border: 20px;'],
    correct: 1,
    explanation: 'Margin adalah jarak bagian LUAR suatu elemen dengan elemen lain di sekitarnya.'
  },
  {
    prompt: 'Kamu ingin memberi jarak DALAM antara teks dengan garis pinggir kotak tombol.',
    options: ['margin: 15px;', 'padding: 15px;', 'border: 15px;', 'font-size: 15px;'],
    correct: 1,
    explanation: 'Padding adalah jarak antara ISI tulisan dengan batas pinggir bingkai elemen.'
  },
  {
    prompt: 'Kamu ingin menentukan lebar sebuah kotak kartu sebesar 300 piksel.',
    options: ['height: 300px;', 'width: 300px;', 'size: 300px;', 'font-size: 300px;'],
    correct: 1,
    explanation: 'width digunakan untuk menentukan ukuran lebar mendatar suatu elemen web.'
  }
];

let act3CurrentIndex = 0;
let act3Score = 0;

function renderAct3Question() {
  const q = act3Questions[act3CurrentIndex];
  const counter = document.getElementById('act3Counter');
  const prompt = document.getElementById('act3Prompt');
  const grid = document.getElementById('act3OptionsGrid');
  const feedback = document.getElementById('act3Feedback');
  const nextBtn = document.getElementById('act3NextBtn');
  const restartBtn = document.getElementById('act3RestartBtn');

  if (counter) counter.innerText = `Soal ${act3CurrentIndex + 1} dari ${act3Questions.length}`;
  if (prompt) prompt.innerHTML = `"${q.prompt}"`;
  if (feedback) feedback.style.display = 'none';
  if (nextBtn) nextBtn.style.display = 'none';
  if (restartBtn) restartBtn.style.display = 'none';

  if (grid) {
    grid.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `<span class="opt-prefix">${letters[idx]}</span> <code>${escapeHtml(opt)}</code>`;
      btn.onclick = () => handleAct3Answer(idx);
      grid.appendChild(btn);
    });
  }
}

function handleAct3Answer(selectedIndex) {
  const q = act3Questions[act3CurrentIndex];
  const grid = document.getElementById('act3OptionsGrid');
  const btns = grid.querySelectorAll('.option-btn');
  const feedback = document.getElementById('act3Feedback');
  const feedbackIcon = document.getElementById('act3FeedbackIcon');
  const feedbackTitle = document.getElementById('act3FeedbackTitle');
  const feedbackText = document.getElementById('act3FeedbackText');
  const nextBtn = document.getElementById('act3NextBtn');
  const restartBtn = document.getElementById('act3RestartBtn');

  btns.forEach(b => b.setAttribute('disabled', 'true'));

  const isCorrect = (selectedIndex === q.correct);

  if (isCorrect) {
    btns[selectedIndex].classList.add('correct');
    act3Score += 10;
    playAudioTone('success');
    if (feedback) {
      feedback.className = 'feedback-box correct';
      feedbackIcon.innerText = '✅';
      feedbackTitle.innerText = 'Tepat Sekali!';
      feedbackText.innerText = q.explanation;
      feedback.style.display = 'flex';
    }
  } else {
    btns[selectedIndex].classList.add('wrong');
    btns[q.correct].classList.add('correct');
    playAudioTone('error');
    if (feedback) {
      feedback.className = 'feedback-box wrong';
      feedbackIcon.innerText = '❌';
      feedbackTitle.innerText = 'Belum Tepat';
      feedbackText.innerText = `Jawaban yang tepat adalah ${q.options[q.correct]}. ${q.explanation}`;
      feedback.style.display = 'flex';
    }
  }

  const scoreDisplay = document.getElementById('act3ScoreDisplay');
  if (scoreDisplay) scoreDisplay.innerText = act3Score;

  if (act3CurrentIndex < act3Questions.length - 1) {
    if (nextBtn) nextBtn.style.display = 'inline-flex';
  } else {
    studentProgress.act3Done = true;
    saveProgress();
    playAudioTone('complete');
    if (restartBtn) restartBtn.style.display = 'inline-flex';
  }
}

function nextAct3Question() {
  if (act3CurrentIndex < act3Questions.length - 1) {
    act3CurrentIndex++;
    renderAct3Question();
  }
}

function restartAct3() {
  act3CurrentIndex = 0;
  act3Score = 0;
  const scoreDisplay = document.getElementById('act3ScoreDisplay');
  if (scoreDisplay) scoreDisplay.innerText = 0;
  renderAct3Question();
}

/* ==========================================================================
   9. AKTIVITAS 4: SIMULASI WEB SEDERHANA (LIVE CODE & PREVIEW)
   ========================================================================== */
const simState = {
  hasTitle: true,
  hasPara: true,
  hasImg: false,
  hasList: false,

  colorBlue: true,
  sizeBig: true,
  centerAlign: false,
  bgLightblue: false
};

function toggleSimHtml(type) {
  if (type === 'title') simState.hasTitle = !simState.hasTitle;
  if (type === 'para')  simState.hasPara  = !simState.hasPara;
  if (type === 'img')   simState.hasImg   = !simState.hasImg;
  if (type === 'list')  simState.hasList  = !simState.hasList;

  updateSimButtons();
  updateSimulatorOutput();
  playAudioTone('success');
  studentProgress.act4Done = true;
  saveProgress();
}

function toggleSimCss(type) {
  if (type === 'color')  simState.colorBlue   = !simState.colorBlue;
  if (type === 'size')   simState.sizeBig     = !simState.sizeBig;
  if (type === 'center') simState.centerAlign = !simState.centerAlign;
  if (type === 'bg')     simState.bgLightblue = !simState.bgLightblue;

  updateSimButtons();
  updateSimulatorOutput();
  playAudioTone('success');
  studentProgress.act4Done = true;
  saveProgress();
}

function updateSimButtons() {
  setChipActive('btnSimTitle', simState.hasTitle);
  setChipActive('btnSimPara', simState.hasPara);
  setChipActive('btnSimImg', simState.hasImg);
  setChipActive('btnSimList', simState.hasList);

  setChipActive('btnSimColor', simState.colorBlue);
  setChipActive('btnSimSize', simState.sizeBig);
  setChipActive('btnSimCenter', simState.centerAlign);
  setChipActive('btnSimBg', simState.bgLightblue);
}

function setChipActive(btnId, isActive) {
  const btn = document.getElementById(btnId);
  if (btn) {
    if (isActive) btn.classList.add('active');
    else btn.classList.remove('active');
  }
}

function updateSimulatorOutput() {
  let htmlCode = '';
  let renderHtml = '';

  if (simState.hasTitle) {
    htmlCode += '<h1>Profil Saya</h1>\n';
    renderHtml += '<h1 class="sim-h1">Profil Saya</h1>';
  }
  if (simState.hasPara) {
    htmlCode += '<p>Nama saya Andi.</p>\n';
    renderHtml += '<p class="sim-p">Nama saya Andi.</p>';
  }
  if (simState.hasImg) {
    htmlCode += '<img src="foto.jpg" alt="Foto Andi">\n';
    renderHtml += '<div class="sim-img-box">🖼️ [Foto: foto.jpg]</div>';
  }
  if (simState.hasList) {
    htmlCode += '<ul>\n    <li>Membaca</li>\n    <li>Olahraga</li>\n</ul>\n';
    renderHtml += '<ul class="sim-ul"><li>Membaca</li><li>Olahraga</li></ul>';
  }

  if (htmlCode === '') {
    htmlCode = '<!-- Halaman web masih kosong -->';
    renderHtml = '<div style="color: #94a3b8; font-style: italic; text-align: center; padding: 20px;">Silakan klik tombol HTML di atas untuk menambahkan elemen!</div>';
  }

  let cssRules = [];
  if (simState.colorBlue)   cssRules.push('    color: blue;');
  if (simState.sizeBig)     cssRules.push('    font-size: 24px;');
  if (simState.centerAlign) cssRules.push('    text-align: center;');

  let cssCode = '';
  if (cssRules.length > 0 && simState.hasTitle) {
    cssCode += 'h1 {\n' + cssRules.join('\n') + '\n}\n\n';
  }

  if (simState.bgLightblue) {
    cssCode += 'body {\n    background-color: lightblue;\n}';
  }

  if (cssCode.trim() === '') {
    cssCode = '/* Belum ada gaya CSS yang diterapkan */';
  }

  const htmlCodeElem = document.getElementById('simHtmlCodeText');
  const cssCodeElem = document.getElementById('simCssCodeText');
  if (htmlCodeElem) htmlCodeElem.innerText = htmlCode;
  if (cssCodeElem) cssCodeElem.innerText = cssCode;

  const viewport = document.getElementById('simBrowserViewport');
  const inner = document.getElementById('simViewportInner');

  if (inner) inner.innerHTML = renderHtml;

  if (viewport) {
    viewport.style.backgroundColor = simState.bgLightblue ? '#e0f2fe' : '#ffffff';
  }

  const renderedH1 = document.querySelector('#simViewportInner .sim-h1');
  if (renderedH1) {
    renderedH1.style.color = simState.colorBlue ? '#2563eb' : '#0f172a';
    renderedH1.style.fontSize = simState.sizeBig ? '24px' : '18px';
    renderedH1.style.textAlign = simState.centerAlign ? 'center' : 'left';
    renderedH1.style.marginBottom = '6px';
  }

  const renderedP = document.querySelector('#simViewportInner .sim-p');
  if (renderedP) {
    renderedP.style.textAlign = simState.centerAlign ? 'center' : 'left';
    renderedP.style.color = '#334155';
    renderedP.style.fontSize = '15px';
    renderedP.style.marginBottom = '10px';
  }

  const renderedImg = document.querySelector('#simViewportInner .sim-img-box');
  if (renderedImg) {
    renderedImg.style.background = '#fef08a';
    renderedImg.style.color = '#854d0e';
    renderedImg.style.padding = '8px 14px';
    renderedImg.style.borderRadius = '6px';
    renderedImg.style.fontWeight = 'bold';
    renderedImg.style.fontSize = '12px';
    renderedImg.style.display = 'inline-block';
    renderedImg.style.marginBottom = '10px';
    if (simState.centerAlign) {
      renderedImg.style.display = 'block';
      renderedImg.style.margin = '0 auto 10px auto';
      renderedImg.style.width = 'fit-content';
    }
  }

  const renderedUl = document.querySelector('#simViewportInner .sim-ul');
  if (renderedUl) {
    renderedUl.style.paddingLeft = simState.centerAlign ? '0' : '20px';
    renderedUl.style.listStylePosition = simState.centerAlign ? 'inside' : 'outside';
    renderedUl.style.textAlign = simState.centerAlign ? 'center' : 'left';
    renderedUl.style.color = '#1e293b';
    renderedUl.style.fontSize = '14px';
  }
}

function resetSimulator() {
  simState.hasTitle = true;
  simState.hasPara = true;
  simState.hasImg = false;
  simState.hasList = false;

  simState.colorBlue = true;
  simState.sizeBig = true;
  simState.centerAlign = false;
  simState.bgLightblue = false;

  updateSimButtons();
  updateSimulatorOutput();
}

/* ==========================================================================
   10. AKTIVITAS 5: LOGIKA JAVASCRIPT (PROMPT & IF SEDERHANA) (BARU!)
   ========================================================================== */
function runInteractiveJsActivity() {
  const consoleBox = document.getElementById('actJsConsoleLines');
  if (!consoleBox) return;

  const nama = prompt('Masukkan nama siswa:', 'Ahmad');
  if (nama === null) {
    consoleBox.innerHTML = '<div class="console-line warning-line">&gt; Input nama dibatalkan oleh pengguna.</div>';
    return;
  }

  const nilaiStr = prompt('Masukkan nilai ujian (0 - 100):', '82');
  if (nilaiStr === null) {
    consoleBox.innerHTML = '<div class="console-line warning-line">&gt; Input nilai dibatalkan oleh pengguna.</div>';
    return;
  }

  const nilai = parseInt(nilaiStr, 10);
  const isLulus = (!isNaN(nilai) && nilai >= 75);

  playAudioTone(isLulus ? 'success' : 'error');

  consoleBox.innerHTML = `
    <div class="console-line system-line">[Sistem] Menjalankan cek_kelulusan.js...</div>
    <div class="console-line log-line">&gt; let nama = "${escapeHtml(nama)}";</div>
    <div class="console-line log-line">&gt; let nilai = ${isNaN(nilai) ? 0 : nilai};</div>
    <div class="console-line log-line">&gt; console.log("Memeriksa nilai ${escapeHtml(nama)}...");</div>
    <div class="console-line log-line">&gt; Evaluasi: if (${isNaN(nilai) ? 0 : nilai} &gt;= 75) &rarr; ${isLulus ? 'BENAR (True)' : 'SALAH (False)'}</div>
    <div class="console-line ${isLulus ? 'success-line' : 'warning-line'}">
      &gt; ${isLulus ? 'SELAMAT ' + escapeHtml(nama) + ', KAMU LULUS! 🎉' : 'Semangat ' + escapeHtml(nama) + ', kamu perlu belajar lagi! 📚'}
    </div>
  `;

  studentProgress.actJsDone = true;
  saveProgress();
}

/* ==========================================================================
   11. MINI PROJECT: CHECKLIST INTERAKTIF PROFIL SAYA
   ========================================================================== */
const projectChecklistData = [
  'Membuat judul halaman',
  'Menambahkan nama',
  'Menambahkan paragraf tentang diri',
  'Menambahkan daftar hobi',
  'Menambahkan gambar',
  'Mengubah warna teks',
  'Mengubah background',
  'Mengatur ukuran teks',
  'Memberikan border',
  'Menggunakan padding'
];

function initProjectChecklist() {
  const container = document.getElementById('projectChecklistList');
  if (!container) return;

  container.innerHTML = '';
  const checkedArr = studentProgress.checklistChecked || [];

  projectChecklistData.forEach((label, idx) => {
    const isChecked = checkedArr.includes(idx);
    const item = document.createElement('div');
    item.className = `checklist-item ${isChecked ? 'checked' : ''}`;
    item.onclick = () => toggleChecklistItem(idx);
    item.innerHTML = `
      <div class="check-box-square">${isChecked ? '✓' : ''}</div>
      <span class="item-text">${label}</span>
    `;
    container.appendChild(item);
  });

  updateProjectProgressDisplay();
}

function toggleChecklistItem(idx) {
  if (!studentProgress.checklistChecked) studentProgress.checklistChecked = [];

  const foundIndex = studentProgress.checklistChecked.indexOf(idx);
  if (foundIndex === -1) {
    studentProgress.checklistChecked.push(idx);
    playAudioTone('success');
  } else {
    studentProgress.checklistChecked.splice(foundIndex, 1);
  }

  saveProgress();
  initProjectChecklist();
}

function updateProjectProgressDisplay() {
  const checkedCount = (studentProgress.checklistChecked || []).length;
  const total = projectChecklistData.length;
  const pct = Math.round((checkedCount / total) * 100);

  const textElem = document.getElementById('projectProgressText');
  const barElem = document.getElementById('projectProgressBar');

  if (textElem) textElem.innerText = `${checkedCount} / ${total} Selesai (${pct}%)`;
  if (barElem) barElem.style.width = pct + '%';
}

function resetProjectChecklist() {
  if (confirm('Apakah kamu yakin ingin mereset seluruh checklist proyek?')) {
    studentProgress.checklistChecked = [];
    saveProgress();
    initProjectChecklist();
  }
}

function switchSampleTab(tabType) {
  const btnHtml = document.getElementById('btnSampleHtml');
  const btnCss = document.getElementById('btnSampleCss');
  const btnPrev = document.getElementById('btnSamplePreview');

  const viewHtml = document.getElementById('sampleHtmlView');
  const viewCss = document.getElementById('sampleCssView');
  const viewPrev = document.getElementById('samplePreviewView');

  [btnHtml, btnCss, btnPrev].forEach(b => b && b.classList.remove('active'));
  [viewHtml, viewCss, viewPrev].forEach(v => v && v.classList.remove('active'));

  if (tabType === 'html') {
    if (btnHtml) btnHtml.classList.add('active');
    if (viewHtml) viewHtml.classList.add('active');
  } else if (tabType === 'css') {
    if (btnCss) btnCss.classList.add('active');
    if (viewCss) viewCss.classList.add('active');
  } else {
    if (btnPrev) btnPrev.classList.add('active');
    if (viewPrev) viewPrev.classList.add('active');
  }
}

/* ==========================================================================
   12. MENU KUIS: 10 SOAL BERJENJANG (HTML, CSS & JAVASCRIPT)
   ========================================================================== */
const quizQuestions = [
  {
    question: 'Bahasa yang digunakan untuk membuat struktur atau kerangka isi sebuah halaman web adalah...',
    options: ['CSS', 'HTML', 'Excel', 'Photoshop'],
    correct: 1, // HTML
    explanation: 'HTML (HyperText Markup Language) berfungsi membuat struktur dan kerangka isi halaman web.'
  },
  {
    question: 'Properti CSS yang digunakan untuk mengubah warna teks tulisan adalah...',
    options: ['font-size', 'background-color', 'color', 'margin'],
    correct: 2, // color
    explanation: 'Properti "color" digunakan khusus untuk mengatur warna huruf atau teks tulisan.'
  },
  {
    question: 'Di dalam JavaScript, kata kunci yang digunakan untuk membuat variabel penyimpan data adalah...',
    options: ['make', 'let', 'box', 'set'],
    correct: 1, // let
    explanation: 'Kata kunci "let" (atau const) digunakan di JavaScript untuk membuat variabel baru.'
  },
  {
    question: 'Bagian dokumen HTML yang berisi semua isi halaman yang terlihat oleh pengguna di layar adalah...',
    options: ['<head>', '<title>', '<body>', '<meta>'],
    correct: 2, // <body>
    explanation: 'Semua elemen teks, gambar, dan tombol yang ingin ditampilkan diletakkan di dalam tag <body>.'
  },
  {
    question: 'Fungsi JavaScript yang digunakan untuk mencetak pesan atau catatan ke konsol browser adalah...',
    options: ['print.text()', 'console.log()', 'popup.show()', 'screen.write()'],
    correct: 1, // console.log()
    explanation: 'console.log() mencetak pesan atau isi variabel ke layar konsol browser pengembang.'
  },
  {
    question: 'Fungsi JavaScript yang memunculkan kotak dialog popup untuk meminta masukan ketikan pengguna adalah...',
    options: ['prompt()', 'alert()', 'input()', 'ask()'],
    correct: 0, // prompt()
    explanation: 'prompt() memunculkan kotak dialog dengan tempat mengetikkan data masukan.'
  },
  {
    question: 'Di dalam CSS, jarak bagian LUAR suatu elemen dengan elemen lain di sekitarnya disebut...',
    options: ['Padding', 'Border', 'Margin', 'Width'],
    correct: 2, // Margin
    explanation: 'Margin adalah jarak bagian luar elemen, sedangkan Padding adalah jarak bagian dalam.'
  },
  {
    question: 'Perhatikan kode CSS berikut: h1 { text-align: center; }. Efek dari kode tersebut adalah...',
    options: [
      'Membuat judul berwarna hijau',
      'Membuat judul berada di posisi tengah',
      'Membuat judul bergaris bawah',
      'Membuat judul menjadi lebih kecil'
    ],
    correct: 1, // tengah
    explanation: 'text-align: center; memosisikan perataan teks berada tepat di tengah.'
  },
  {
    question: 'Struktur percabangan di JavaScript yang digunakan untuk mengecek apakah suatu kondisi terpenuhi adalah...',
    options: ['loop', 'if', 'function', 'switch-case-while'],
    correct: 1, // if
    explanation: 'Struktur "if" digunakan untuk menjalankan perintah hanya jika suatu syarat/kondisi bernilai benar.'
  },
  {
    question: 'Perhatikan kode: if (nilai >= 75) { console.log("Lulus"); }. Jika nilai = 80, pesan yang muncul adalah...',
    options: [
      '"Lulus"',
      'Tidak ada pesan sama sekali',
      '"Gagal"',
      'Error program'
    ],
    correct: 0, // "Lulus"
    explanation: 'Karena 80 lebih besar dari 75, maka kondisi bernilai Benar dan mencetak "Lulus".'
  }
];

let quizCurrentIndex = 0;
let quizScore = 0;

function renderQuizQuestion() {
  const q = quizQuestions[quizCurrentIndex];
  const stepText = document.getElementById('quizStepText');
  const progressBar = document.getElementById('quizProgressBar');
  const currentScoreText = document.getElementById('quizCurrentScore');
  const questionText = document.getElementById('quizQuestionText');
  const optionsList = document.getElementById('quizOptionsList');
  const feedbackBox = document.getElementById('quizFeedbackBox');

  if (stepText) stepText.innerText = `${quizCurrentIndex + 1} / ${quizQuestions.length}`;
  if (progressBar) progressBar.style.width = `${((quizCurrentIndex + 1) / quizQuestions.length) * 100}%`;
  if (currentScoreText) currentScoreText.innerText = quizScore;
  if (questionText) questionText.innerText = `"${q.question}"`;
  if (feedbackBox) feedbackBox.style.display = 'none';

  if (optionsList) {
    optionsList.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt-btn';
      btn.innerHTML = `<span class="opt-prefix">${letters[idx]}</span> <span>${escapeHtml(opt)}</span>`;
      btn.onclick = () => handleQuizAnswer(idx);
      optionsList.appendChild(btn);
    });
  }
}

function handleQuizAnswer(selectedIndex) {
  const q = quizQuestions[quizCurrentIndex];
  const list = document.getElementById('quizOptionsList');
  const btns = list.querySelectorAll('.quiz-opt-btn');
  const feedbackBox = document.getElementById('quizFeedbackBox');
  const feedbackIcon = document.getElementById('quizFeedbackIcon');
  const feedbackTitle = document.getElementById('quizFeedbackTitle');
  const feedbackExpl = document.getElementById('quizFeedbackExplanation');
  const nextBtn = document.getElementById('quizNextBtn');

  btns.forEach(b => b.setAttribute('disabled', 'true'));

  const isCorrect = (selectedIndex === q.correct);

  if (isCorrect) {
    btns[selectedIndex].classList.add('correct');
    quizScore += 10;
    playAudioTone('success');
    if (feedbackBox) {
      feedbackIcon.innerText = '✅';
      feedbackTitle.innerText = 'Jawaban Benar!';
      feedbackTitle.style.color = '#15803d';
      feedbackExpl.innerText = q.explanation;
      feedbackBox.style.display = 'block';
    }
  } else {
    btns[selectedIndex].classList.add('wrong');
    btns[q.correct].classList.add('correct');
    playAudioTone('error');
    if (feedbackBox) {
      const letters = ['A', 'B', 'C', 'D'];
      feedbackIcon.innerText = '❌';
      feedbackTitle.innerText = 'Jawaban Kurang Tepat';
      feedbackTitle.style.color = '#b91c1c';
      feedbackExpl.innerText = `Jawaban yang benar adalah (${letters[q.correct]}) ${q.options[q.correct]}. ${q.explanation}`;
      feedbackBox.style.display = 'block';
    }
  }

  const scoreText = document.getElementById('quizCurrentScore');
  if (scoreText) scoreText.innerText = quizScore;

  if (quizCurrentIndex === quizQuestions.length - 1) {
    if (nextBtn) nextBtn.innerText = 'Lihat Hasil Akhir Kuis 🏆';
  } else {
    if (nextBtn) nextBtn.innerText = 'Lanjut ke Soal Berikutnya &rarr;';
  }
}

function nextQuizQuestion() {
  if (quizCurrentIndex < quizQuestions.length - 1) {
    quizCurrentIndex++;
    renderQuizQuestion();
  initCodeEditor();
  initDedenCaseStudy();
  } else {
    showQuizResult();
  }
}

function showQuizResult() {
  const playScreen = document.getElementById('quizPlayScreen');
  const resultScreen = document.getElementById('quizResultScreen');
  const scoreNum = document.getElementById('resultScoreNum');
  const badgeIcon = document.getElementById('resultBadgeIcon');
  const categoryChip = document.getElementById('resultCategoryChip');
  const summaryMsg = document.getElementById('resultSummaryMessage');

  if (playScreen) playScreen.style.display = 'none';
  if (resultScreen) resultScreen.style.display = 'block';
  if (scoreNum) scoreNum.innerText = quizScore;

  let category = '';
  let icon = '';
  let msg = '';

  if (quizScore >= 90) {
    category = 'Sangat Baik 🏆';
    icon = '🏆';
    msg = 'Luar biasa sekali! Kamu sudah sangat menguasai konsep HTML, CSS, dan JavaScript dasar. Pertahankan prestasimu!';
  } else if (quizScore >= 80) {
    category = 'Baik 👍';
    icon = '👍';
    msg = 'Bagus sekali! Pemahamanmu mengenai trio pembuatan web sudah mantap dan siap membuat halaman web interaktif.';
  } else if (quizScore >= 70) {
    category = 'Cukup 🙂';
    icon = '🙂';
    msg = 'Cukup bagus! Kamu sudah memahami konsep dasar. Buka kembali menu rangkuman untuk memperkuat materi.';
  } else {
    category = 'Perlu Belajar Lagi 📚';
    icon = '📚';
    msg = 'Jangan patah semangat! Coding butuh latihan. Yuk baca kembali materi dan coba simulator interaktifnya!';
  }

  if (badgeIcon) badgeIcon.innerText = icon;
  if (categoryChip) categoryChip.innerText = `Kategori: ${category}`;
  if (summaryMsg) summaryMsg.innerText = msg;

  playAudioTone('complete');

  if (quizScore > (studentProgress.quizBestScore || 0)) {
    studentProgress.quizBestScore = quizScore;
  }
  saveProgress();
}

function restartQuiz() {
  quizCurrentIndex = 0;
  quizScore = 0;

  const playScreen = document.getElementById('quizPlayScreen');
  const resultScreen = document.getElementById('quizResultScreen');
  if (playScreen) playScreen.style.display = 'block';
  if (resultScreen) resultScreen.style.display = 'none';

  renderQuizQuestion();
}

/* ==========================================================================
   UTILITAS HELPER
   ========================================================================== */
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


/* ==========================================================================
   MENU 4: LOGIKA EDITOR KODE HTML INTERAKTIF (PLAYGROUND SISWA)
   ========================================================================== */

let currentEditorTemplateKey = 'dasar';


/* ==========================================================================
   STUDI KASUS: BIODATA MTSN 5 SUMEDANG (DEDEN JULIANDI)
   ========================================================================== */

const DEDEN_HTML_RAW = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Belajar HTML</title>
</head>
<body>
    <h1>Biodata</h1>
    <p>Saya Deden Juliandi siswa kelas 9 di MTsN 5 Sumedang </p>
    <a href="https://chatgpt.com/" target="_blank">Masuk ChatGpt</a><br>
    <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=500" alt="Foto Kamad MTsN 5 Sumedang" width="10%">
    <br>
    <br>
    <h3>Hobbi : </h3>
    <ul>
        <li>Badminton</li>
        <li>Baca Buku</li>
        <li>Menyanyi</li>
    </ul>
    <h3>Cita-Cita : </h3>
    <ol>
        <li>CEO Media Grup</li>
        <li>Chef</li>
    </ol>
    <h3>Riwayat Pendidikan : </h3>
    <table border="1">
        <tr>
            <th>No</th>
            <th>Nama Sekolah</th>
            <th>Tahun</th>
        </tr>
        <tr>
            <td>1</td>
            <td>TK. Bhayangkari 1</td>
            <td>2012-2014</td>
        </tr>
        <tr>
            <td>2</td>
            <td>SDN Ujungjaya 1</td>
            <td>2014-2020</td>
        </tr>
    </table>
    <br>
    <br>
    <form>
        <label>Nama : </label>
        <input type="text"><br>
        <label>Kelas : </label>
        <input type="text"><br>
        <label>Alamat : </label>
        <input type="text"><br>
        <button type="submit">Kirim</button>
    </form>

    <p>Merapihkan Form</p>
    <form>
        <table>
            <tr>
                <td>Nama</td>
                <td>:</td>
                <td><input type="text"></td>
            </tr>
            <tr>
                <td>Kelas</td>
                <td>:</td>
                <td><input type="text"></td>
            </tr>
            <tr>
                <td>Alamat</td>
                <td>:</td>
                <td><input type="text"></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td><button type="submit">Kirim</button></td>
            </tr>
        </table>
    </form>

</body>
</html>`;

const DEDEN_JS_CODE = `/* ==========================================================================
   SCRIPT.JS - LOGIKA & AKSI INTERAKTIF PADA BIODATA DEDEN JULIANDI
   ========================================================================== */

// 1. Aksi Menyapa Pengunjung dengan prompt() dan Manipulasi Teks DOM
function sapaDeden() {
    let namaPengunjung = prompt("Halo! Siapa namamu?");
    if (namaPengunjung && namaPengunjung.trim() !== "") {
        let kotakSapa = document.getElementById("teksSapaan");
        kotakSapa.innerHTML = "👋 Halo <strong>" + namaPengunjung + "</strong>! Salam hangat dari Deden Juliandi siswa kelas 9 MTsN 5 Sumedang. Senang berkenalan denganmu! 😊";
        kotakSapa.style.display = "block";
    }
}

// 2. Aksi Saklar Mode Gelap / Terang (Dark Mode Toggle via JavaScript)
function gantiModeGelap() {
    let kartu = document.getElementById("kartuBiodata");
    kartu.classList.toggle("mode-gelap");
    
    let tombol = document.getElementById("btnDarkToggle");
    if (kartu.classList.contains("mode-gelap")) {
        tombol.innerHTML = "☀️ Mode Terang";
    } else {
        tombol.innerHTML = "🌙 Mode Gelap";
    }
}

// 3. Aksi Menambah Hobi Baru secara Dinamis ke dalam Daftar (ul)
function tambahHobi() {
    let hobiBaru = prompt("Masukkan hobi baru yang ingin kamu tambahkan:");
    if (hobiBaru && hobiBaru.trim() !== "") {
        let listHobi = document.getElementById("daftarHobi");
        let itemBaru = document.createElement("li");
        itemBaru.innerText = hobiBaru;
        listHobi.appendChild(itemBaru);
        alert("Hobi '" + hobiBaru + "' berhasil ditambahkan ke daftar! 🏸");
    }
}

// 4. Aksi Konfirmasi Sebelum Membuka Tautan ChatGPT
function konfirmasiChatGpt() {
    return confirm("Kamu akan membuka AI ChatGPT untuk berdiskusi materi pelajaran bersama Deden. Buka tautan sekarang?");
}

// 5. Aksi Validasi & Pengolahan Formulir Pendaftaran dengan if...else
function kirimFormulir(event) {
    event.preventDefault(); // Mencegah reload halaman
    
    let nama = document.getElementById("inputNama").value;
    let kelas = document.getElementById("inputKelas").value;
    let alamat = document.getElementById("inputAlamat").value;
    let alertBox = document.getElementById("formAlert");
    
    // Logika Pengambilan Keputusan dengan if...else
    if (nama.trim() === "" || kelas.trim() === "" || alamat.trim() === "") {
        alertBox.className = "alert-box alert-warning";
        alertBox.innerHTML = "⚠️ <strong>Perhatian:</strong> Harap lengkapi semua kolom (Nama, Kelas, dan Alamat)!";
        alertBox.style.display = "block";
    } else {
        alertBox.className = "alert-box alert-success";
        alertBox.innerHTML = "✅ <strong>Pendaftaran Sukses!</strong> Terima kasih <strong>" + nama + "</strong> (" + kelas + ") dari " + alamat + ". Data berhasil disimpan di sistem MTsN 5 Sumedang!";
        alertBox.style.display = "block";
    }
}`;

const DEDEN_CSS_CODE = `/* ==========================================================================
   STYLE.CSS UNTUK MEMPERCANTIK BIODATA DEDEN JULIANDI (MTSN 5 SUMEDANG)
   ========================================================================== */

/* 1. Atur Dasar Halaman (Background lembut & font bersih) */
body {
    background-color: #f0f4f8;
    font-family: 'Segoe UI', Arial, sans-serif;
    color: #334155;
    line-height: 1.6;
    margin: 0;
    padding: 30px 15px;
}

/* Wadah Utama Kartu Biodata */
#kartuBiodata {
    background-color: #ffffff;
    max-width: 650px;
    margin: 0 auto;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
    transition: background-color 0.3s ease, color 0.3s ease;
}

/* 2. Judul Utama Biodata */
h1 {
    color: #1e3a8a;
    font-size: 28px;
    margin-top: 0;
    margin-bottom: 8px;
    border-bottom: 3px solid #3b82f6;
    padding-bottom: 8px;
    display: inline-block;
}

/* Sub-Judul (Hobbi, Cita-Cita, Riwayat Pendidikan) */
h3 {
    color: #0f172a;
    font-size: 18px;
    margin-top: 24px;
    margin-bottom: 10px;
}

/* Paragraf Keterangan */
p {
    font-size: 15px;
    color: #475569;
}

/* 3. Bilah Tombol Aksi Interaktif JavaScript */
.actions-bar {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin: 14px 0 20px;
}

.btn-action {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: bold;
    font-size: 13px;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
}

.btn-greet {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: white;
    box-shadow: 0 4px 10px rgba(37, 99, 235, 0.25);
}
.btn-greet:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(37, 99, 235, 0.35);
}

.btn-dark {
    background: #1e293b;
    color: white;
    border: 1px solid #475569;
}
.btn-dark:hover {
    background: #0f172a;
}

.btn-add {
    background: #fef3c7;
    color: #b45309;
    border: 1px solid #fde68a;
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
    margin-left: 10px;
}
.btn-add:hover {
    background: #fde68a;
}

/* Kotak Sapaan Dinamis yang Muncul dari JS */
.greeting-box {
    background: #eff6ff;
    border-left: 4px solid #2563eb;
    padding: 12px 16px;
    border-radius: 6px;
    margin: 12px 0 16px;
    color: #1e40af;
    font-size: 14px;
}

/* 4. Menyulap Link Menjadi Tombol ChatGPT Keren */
a.btn-chatgpt {
    display: inline-block;
    background-color: #10a37f;
    color: #ffffff;
    text-decoration: none;
    padding: 9px 18px;
    border-radius: 8px;
    font-weight: bold;
    font-size: 14px;
    box-shadow: 0 4px 10px rgba(16, 163, 127, 0.25);
    transition: all 0.2s ease;
    margin: 8px 0 16px;
}

a.btn-chatgpt:hover {
    background-color: #0d8a6a;
    transform: translateY(-2px);
}

/* 5. Mempercantik Gambar Kamad */
img {
    width: 140px;
    height: auto;
    border-radius: 12px;
    border: 3px solid #ffffff;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    display: block;
    margin: 10px 0;
    background: #e2e8f0;
}

/* 6. Menata List Hobi & Cita-Cita */
ul {
    background-color: #fffbeb;
    border-left: 4px solid #f59e0b;
    padding: 12px 30px;
    border-radius: 8px;
    margin: 8px 0 16px;
}

ol {
    background-color: #f0fdf4;
    border-left: 4px solid #10b981;
    padding: 12px 30px;
    border-radius: 8px;
    margin: 8px 0 16px;
}

li {
    margin-bottom: 6px;
    font-weight: 500;
}

/* 7. Merombak Tabel Riwayat Pendidikan */
table {
    width: 100%;
    border-collapse: collapse;
    background: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    margin: 12px 0 20px;
    border: 1px solid #e2e8f0;
}

th, td {
    padding: 10px 14px;
    text-align: left;
    border: 1px solid #e2e8f0;
}

th {
    background-color: #1e3a8a;
    color: #ffffff;
    font-weight: 600;
}

tr:nth-child(even) {
    background-color: #f8fafc;
}

/* 8. Mempercantik Formulir Masukan */
form {
    background: #f8fafc;
    padding: 20px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    margin-bottom: 25px;
}

label {
    font-weight: 600;
    font-size: 13.5px;
    color: #334155;
}

input[type="text"] {
    padding: 8px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    font-size: 14px;
    margin-top: 4px;
    margin-bottom: 12px;
    width: 100%;
    box-sizing: border-box;
}

input[type="text"]:focus {
    border-color: #2563eb;
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

button[type="submit"] {
    background-color: #2563eb;
    color: #ffffff;
    border: none;
    padding: 9px 20px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
}

button[type="submit"]:hover {
    background-color: #1d4ed8;
}

/* Alert Notifikasi Validasi Form */
.alert-box {
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 13.5px;
    margin-top: 14px;
    display: none;
}

.alert-warning {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #991b1b;
}

.alert-success {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #166534;
}

/* Form dengan Tabel */
form table {
    border: none;
    margin: 0;
    background: transparent;
}

form table td {
    border: none;
    padding: 6px 4px;
}

form table input[type="text"] {
    margin: 0;
}

/* 9. ATURAN TEMA MODE GELAP (DARK MODE) DARI JAVASCRIPT */
#kartuBiodata.mode-gelap {
    background-color: #0f172a !important;
    color: #f8fafc !important;
}

#kartuBiodata.mode-gelap h1 {
    color: #60a5fa !important;
    border-bottom-color: #3b82f6 !important;
}

#kartuBiodata.mode-gelap h3 {
    color: #93c5fd !important;
}

#kartuBiodata.mode-gelap p {
    color: #cbd5e1 !important;
}

#kartuBiodata.mode-gelap ul,
#kartuBiodata.mode-gelap ol {
    background-color: #1e293b !important;
    color: #f1f5f9 !important;
}

#kartuBiodata.mode-gelap table {
    background-color: #1e293b !important;
    border-color: #334155 !important;
    color: #f8fafc !important;
}

#kartuBiodata.mode-gelap th {
    background-color: #1e3a8a !important;
    border-color: #334155 !important;
}

#kartuBiodata.mode-gelap td {
    border-color: #334155 !important;
    color: #cbd5e1 !important;
}

#kartuBiodata.mode-gelap tr:nth-child(even) {
    background-color: #172033 !important;
}

#kartuBiodata.mode-gelap form {
    background-color: #1e293b !important;
    border-color: #334155 !important;
}

#kartuBiodata.mode-gelap label {
    color: #94a3b8 !important;
}

#kartuBiodata.mode-gelap input[type="text"] {
    background-color: #0f172a !important;
    border-color: #475569 !important;
    color: #f8fafc !important;
}`;

const DEDEN_FULL_COMBO = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Biodata Siswa MTsN 5 Sumedang (Trio Web)</title>
    <style>
` + DEDEN_CSS_CODE + `
    </style>
</head>
<body>
    <div id="kartuBiodata">
        
        <!-- Header & Judul Biodata -->
        <h1>Biodata Siswa</h1>
        <p>Saya Deden Juliandi siswa kelas 9 di MTsN 5 Sumedang.</p>

        <!-- Aksi 1 & 2: Tombol Interaktif Sapa & Mode Gelap -->
        <div class="actions-bar">
            <button type="button" class="btn-action btn-greet" onclick="sapaDeden()">
                👋 Sapa Deden!
            </button>
            <button type="button" class="btn-action btn-dark" id="btnDarkToggle" onclick="gantiModeGelap()">
                🌙 Mode Gelap
            </button>
        </div>

        <!-- Kotak Sapaan yang Dikendalikan oleh JavaScript -->
        <div id="teksSapaan" class="greeting-box" style="display: none;"></div>

        <!-- Aksi 4: Link ChatGPT dengan Konfirmasi JavaScript -->
        <a href="https://chatgpt.com/" class="btn-chatgpt" target="_blank" onclick="return konfirmasiChatGpt()">
            🤖 Masuk ChatGPT &rarr;
        </a>
        <br>
        
        <!-- Foto Kamad MTsN 5 Sumedang -->
        <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=500" alt="Foto Kamad MTsN 5 Sumedang" width="10%">
        <br>

        <!-- Aksi 3: Hobbi dengan Tombol Tambah Hobi Dinamis -->
        <h3>
            Hobbi : 
            <button type="button" class="btn-add" onclick="tambahHobi()">➕ Tambah Hobbi</button>
        </h3>
        <ul id="daftarHobi">
            <li>Badminton</li>
            <li>Baca Buku</li>
            <li>Menyanyi</li>
        </ul>

        <!-- Cita-Cita -->
        <h3>Cita-Cita : </h3>
        <ol>
            <li>CEO Media Grup</li>
            <li>Chef</li>
        </ol>

        <!-- Riwayat Pendidikan -->
        <h3>Riwayat Pendidikan : </h3>
        <table border="1">
            <tr>
                <th>No</th>
                <th>Nama Sekolah</th>
                <th>Tahun</th>
            </tr>
            <tr>
                <td>1</td>
                <td>TK. Bhayangkari 1</td>
                <td>2012-2014</td>
            </tr>
            <tr>
                <td>2</td>
                <td>SDN Ujungjaya 1</td>
                <td>2014-2020</td>
            </tr>
        </table>
        <br>

        <!-- Aksi 5: Formulir Masukan dengan Validasi JavaScript -->
        <h3>Formulir Pendaftaran Ekskul :</h3>
        <form onsubmit="kirimFormulir(event)">
            <label for="inputNama">Nama : </label>
            <input type="text" id="inputNama" placeholder="Contoh: Deden Juliandi"><br>
            
            <label for="inputKelas">Kelas : </label>
            <input type="text" id="inputKelas" placeholder="Contoh: 9A"><br>
            
            <label for="inputAlamat">Alamat : </label>
            <input type="text" id="inputAlamat" placeholder="Contoh: Sumedang"><br>
            
            <button type="submit">Kirim Pendaftaran 🚀</button>
            <div id="formAlert" class="alert-box"></div>
        </form>

        <p><strong>Merapihkan Form dengan Tabel :</strong></p>
        <form onsubmit="alert('Data form tabel berhasil dikirim!'); return false;">
            <table>
                <tr>
                    <td>Nama</td>
                    <td>:</td>
                    <td><input type="text" placeholder="Masukkan nama..."></td>
                </tr>
                <tr>
                    <td>Kelas</td>
                    <td>:</td>
                    <td><input type="text" placeholder="Masukkan kelas..."></td>
                </tr>
                <tr>
                    <td>Alamat</td>
                    <td>:</td>
                    <td><input type="text" placeholder="Masukkan alamat..."></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td><button type="submit">Kirim Data</button></td>
                </tr>
            </table>
        </form>

    </div>

    <!-- SCRIPT JAVASCRIPT AKSI INTERAKTIF -->
    <script>
` + DEDEN_JS_CODE + `
    </script>
</body>
</html>`;

const EDITOR_TEMPLATES = {
  deden: DEDEN_FULL_COMBO,

  dasar: `<!DOCTYPE html>
<html>
<head>
  <title>Latihan HTML Siswa</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 24px;
      line-height: 1.6;
      color: #334155;
    }
    h1 {
      color: #2563eb;
      margin-bottom: 8px;
    }
    .badge {
      background-color: #dbeafe;
      color: #1e40af;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: bold;
      display: inline-block;
      margin-bottom: 12px;
    }
  </style>
</head>
<body>
  <div class="badge">Informatika SMP</div>
  <h1>Halo, Dunia Web! 👋</h1>
  <p>Selamat datang di halaman web pertamaku.</p>
  <p>Saya sedang belajar membuat website dengan HTML dan CSS di kelas Informatika SMP/MTs.</p>
</body>
</html>`,

  teks: `<!DOCTYPE html>
<html>
<head>
  <title>Latihan Heading dan Paragraf</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 24px;
      color: #1e293b;
      line-height: 1.6;
    }
    h1 {
      color: #0284c7;
      border-bottom: 2px solid #0284c7;
      padding-bottom: 6px;
    }
    h2 {
      color: #0d9488;
      margin-top: 20px;
    }
    h3 {
      color: #475569;
    }
    .stabilo {
      background-color: #fef08a;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <h1>Judul Utama Artikel (H1)</h1>
  <p>Ini adalah paragraf pengantar. HTML sangat mudah dan menyenangkan untuk dipelajari.</p>

  <h2>Subjudul Bab Pembelajaran (H2)</h2>
  <p>Kita bisa memberi penekanan pada teks dengan tag khusus seperti <strong>teks tebal (strong)</strong>, <em>teks miring (em)</em>, atau <span class="stabilo">stabilo kuning</span>.</p>

  <h3>Sub-sub Bab Rincian (H3)</h3>
  <p>Setiap dokumen web tersusun dari paragraf-paragraf yang rapi dan terstruktur.</p>
</body>
</html>`,

  media: `<!DOCTYPE html>
<html>
<head>
  <title>Latihan Gambar dan Link</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 24px;
      color: #334155;
    }
    .card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 18px;
      max-width: 360px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.06);
    }
    img {
      width: 100%;
      border-radius: 8px;
      margin-bottom: 12px;
    }
    .btn {
      display: inline-block;
      background-color: #2563eb;
      color: white;
      padding: 9px 18px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: bold;
      margin-top: 12px;
    }
    .btn:hover {
      background-color: #1d4ed8;
    }
  </style>
</head>
<body>
  <h2>Menyisipkan Media &amp; Tautan</h2>
  
  <div class="card">
    <!-- Gambar -->
    <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500" alt="Belajar Pemrograman">
    <h3>Belajar Pemrograman Web</h3>
    <p>Komputer dan internet membuka pintu wawasan baru bagi generasi muda penerus bangsa.</p>
    <!-- Tautan Link -->
    <a href="https://id.wikipedia.org/wiki/HTML" target="_blank" class="btn">Pelajari Lebih Lanjut &rarr;</a>
  </div>
</body>
</html>`,

  tabel: `<!DOCTYPE html>
<html>
<head>
  <title>Latihan Tabel Nilai Siswa</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 24px;
      color: #1e293b;
    }
    h2 {
      color: #0284c7;
      margin-bottom: 14px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 10px 14px;
      text-align: left;
    }
    th {
      background-color: #0284c7;
      color: white;
      font-weight: bold;
    }
    tr:nth-child(even) {
      background-color: #f8fafc;
    }
    .skor {
      color: #16a34a;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <h2>Daftar Nilai Siswa Informatika</h2>
  <table>
    <tr>
      <th>No</th>
      <th>Nama Siswa</th>
      <th>Materi</th>
      <th>Nilai</th>
    </tr>
    <tr>
      <td>1</td>
      <td>Ahmad Budi</td>
      <td>HTML Dasar</td>
      <td class="skor">95</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Siti Rahma</td>
      <td>CSS Dasar</td>
      <td class="skor">90</td>
    </tr>
    <tr>
      <td>3</td>
      <td>Dedi Pratama</td>
      <td>JavaScript Dasar</td>
      <td class="skor">88</td>
    </tr>
  </table>
</body>
</html>`,

  form: `<!DOCTYPE html>
<html>
<head>
  <title>Latihan Formulir Masukan</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 24px;
      background-color: #f8fafc;
    }
    .form-box {
      background: white;
      padding: 24px;
      border-radius: 12px;
      max-width: 360px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    h2 {
      margin-top: 0;
      color: #1e293b;
      font-size: 19px;
    }
    label {
      display: block;
      margin-top: 12px;
      font-size: 13px;
      font-weight: bold;
      color: #475569;
    }
    input, select {
      width: 100%;
      box-sizing: border-box;
      padding: 9px 12px;
      margin-top: 5px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 14px;
    }
    input:focus, select:focus {
      border-color: #2563eb;
      outline: none;
    }
    button {
      width: 100%;
      margin-top: 18px;
      padding: 11px;
      background-color: #16a34a;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: bold;
      font-size: 15px;
      cursor: pointer;
    }
    button:hover {
      background-color: #15803d;
    }
  </style>
</head>
<body>
  <div class="form-box">
    <h2>Pendaftaran Klub Coding</h2>
    <form onsubmit="alert('Selamat! Pendaftaran berhasil dikirim.'); return false;">
      <label for="nama">Nama Lengkap:</label>
      <input type="text" id="nama" placeholder="Contoh: Andi Pratama" required>

      <label for="kelas">Kelas:</label>
      <select id="kelas">
        <option>Kelas 8A</option>
        <option>Kelas 8B</option>
        <option>Kelas 9A</option>
        <option>Kelas 9B</option>
      </select>

      <label for="cita">Cita-Cita:</label>
      <input type="text" id="cita" placeholder="Contoh: Ingin membuat web sendiri">

      <button type="submit">Kirim Pendaftaran 🚀</button>
    </form>
  </div>
</body>
</html>`,

  kosong: `<!DOCTYPE html>
<html>
<head>
  <title>Latihan Mandiri</title>
  <style>
    /* Tuliskan aturan CSS di sini */
    body {
      font-family: Arial, sans-serif;
      padding: 24px;
      color: #333333;
    }
  </style>
</head>
<body>
  <!-- Tuliskan tag HTML Anda di sini -->
  
</body>
</html>`
};

const EDITOR_CHALLENGES = {
  1: `<!DOCTYPE html>
<html>
<head>
  <title>Tantangan 1: Biodata Diri</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 24px;
      line-height: 1.6;
    }
    h1 {
      color: #2563eb;
      margin-top: 0;
    }
    .profile-card {
      background-color: #f1f5f9;
      padding: 20px;
      border-radius: 10px;
      border-left: 6px solid #2563eb;
      max-width: 450px;
    }
  </style>
</head>
<body>
  <!-- ========================================================
       MISI TANTANGAN 1:
       1. Gantilah teks [Nama Kamu] dengan nama lengkapmu sendiri.
       2. Gantilah kelas dan asal sekolahmu pada paragraf di bawah.
       3. Tuliskan satu kalimat moto hidup favoritmu!
       ======================================================== -->
  <div class="profile-card">
    <h1>[Nama Kamu]</h1>
    <p>Kelas: <strong>VIII A</strong> | Asal: <strong>SMP Cerdas Mandiri</strong></p>
    <p>Moto Hidup: <em>"Belajar coding hari ini untuk menciptakan inovasi masa depan!"</em></p>
  </div>
</body>
</html>`,

  2: `<!DOCTYPE html>
<html>
<head>
  <title>Tantangan 2: Hobi dan Makanan</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 24px;
      color: #1e293b;
    }
    h2 {
      color: #d97706;
      margin-top: 0;
    }
    ul {
      background: #fffbeb;
      padding: 16px 36px;
      border-radius: 8px;
      border-left: 4px solid #f59e0b;
      margin-bottom: 24px;
    }
    ol {
      background: #f0fdf4;
      padding: 16px 36px;
      border-radius: 8px;
      border-left: 4px solid #10b981;
    }
    li {
      margin-bottom: 6px;
    }
  </style>
</head>
<body>
  <!-- ========================================================
       MISI TANTANGAN 2:
       1. Ubah dan lengkapi 3 hobi favoritmu di dalam tag <ul> (bullet titik).
       2. Ubah dan urutkan 3 makanan terlezat di dalam tag <ol> (nomor urut).
       ======================================================== -->
  <h2>🎯 3 Hobi Favoritku (Unordered List)</h2>
  <ul>
    <li>Membaca buku teknologi &amp; sains</li>
    <li>Bermain bulutangkis di sore hari</li>
    <li>Belajar coding HTML dan CSS</li>
  </ul>

  <h2>🍜 3 Makanan Terfavorit (Ordered List)</h2>
  <ol>
    <li>Nasi Goreng Spesial Telur</li>
    <li>Sate Ayam Bumbu Kacang</li>
    <li>Bakso Urat Hangat Gurih</li>
  </ol>
</body>
</html>`,

  3: `<!DOCTYPE html>
<html>
<head>
  <title>Tantangan 3: Jadwal Pelajaran</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 24px;
      color: #1e293b;
    }
    h2 {
      color: #4f46e5;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
    }
    th, td {
      border: 1px solid #94a3b8;
      padding: 10px 14px;
      text-align: center;
    }
    th {
      background-color: #4f46e5;
      color: white;
      font-weight: bold;
    }
    tr:nth-child(even) {
      background-color: #f8fafc;
    }
  </style>
</head>
<body>
  <!-- ========================================================
       MISI TANTANGAN 3:
       Lengkapi baris jadwal di bawah ini dengan mata pelajaran favoritmu!
       ======================================================== -->
  <h2>📅 Jadwal Pelajaran Favorit</h2>
  <table>
    <tr>
      <th>Hari</th>
      <th>Jam Ke</th>
      <th>Mata Pelajaran</th>
      <th>Ruangan</th>
    </tr>
    <tr>
      <td>Senin</td>
      <td>1 - 2</td>
      <td>Informatika (Pemrograman Web)</td>
      <td>Lab Komputer</td>
    </tr>
    <tr>
      <td>Rabu</td>
      <td>3 - 4</td>
      <td>Matematika</td>
      <td>Kelas 8A</td>
    </tr>
    <tr>
      <td>Jumat</td>
      <td>1 - 2</td>
      <td>Bahasa Inggris</td>
      <td>Kelas 8A</td>
    </tr>
  </table>
</body>
</html>`
};

/* Deteksi tag HTML tak tertutup */
function validateHtmlTags(code) {
  const tagsToCheck = ['html', 'head', 'body', 'h1', 'h2', 'h3', 'p', 'table', 'tr', 'th', 'td', 'ul', 'ol', 'form'];
  const missingClosing = [];
  const missingOpening = [];

  for (const tag of tagsToCheck) {
    const openRegex = new RegExp(`<${tag}(\\s+[^>]*)?>`, 'gi');
    const closeRegex = new RegExp(`</${tag}>`, 'gi');
    const openCount = (code.match(openRegex) || []).length;
    const closeCount = (code.match(closeRegex) || []).length;

    if (openCount > closeCount) {
      missingClosing.push(`<${tag}>`);
    } else if (closeCount > openCount) {
      missingOpening.push(`</${tag}>`);
    }
  }

  if (missingClosing.length > 0) {
    return {
      status: 'warning',
      title: 'Periksa Tag Penutup:',
      message: `Perhatian: Tag ${missingClosing.join(', ')} sepertinya belum ditutup dengan tag penutup pasangannya (contoh: <code>&lt;/${missingClosing[0].replace(/[<>]/g, '')}&gt;</code>).`
    };
  }

  if (missingOpening.length > 0) {
    return {
      status: 'warning',
      title: 'Tag Penutup Berlebih:',
      message: `Ditemukan tag penutup ${missingOpening.join(', ')} tanpa tag pembuka yang sesuai.`
    };
  }

  return {
    status: 'success',
    title: 'Kode Berhasil Dijalankan! ✨',
    message: 'Semua tag berpasangan telah ditutup dengan rapi. Hasil halaman web tampil seketika di panel sebelah kanan.'
  };
}

/* Update Info Baris & Karakter */
function updateEditorStats() {
  const textarea = document.getElementById('htmlCodeInput');
  const statsElem = document.getElementById('editorCodeStats');
  if (!textarea || !statsElem) return;

  const text = textarea.value;
  const lines = text.split('\n').length;
  const chars = text.length;

  statsElem.innerText = `Baris: ${lines} | Karakter: ${chars}`;
}

/* Jalankan Kode ke Iframe */
function runHtmlEditorCode() {
  const textarea = document.getElementById('htmlCodeInput');
  const iframe = document.getElementById('htmlEditorPreview');
  const helperBox = document.getElementById('htmlHelperBox');
  const helperTitle = document.getElementById('helperTitle');
  const helperMsg = document.getElementById('helperMsg');
  const helperIcon = document.getElementById('helperIcon');

  if (!textarea || !iframe) return;

  const code = textarea.value;
  iframe.srcdoc = code;

  const check = validateHtmlTags(code);

  if (helperBox) {
    if (check.status === 'warning') {
      helperBox.className = 'editor-helper-box helper-warning';
      if (helperIcon) helperIcon.innerText = '⚠️';
      playAudioTone('error');
    } else {
      helperBox.className = 'editor-helper-box helper-success';
      if (helperIcon) helperIcon.innerText = '✅';
      playAudioTone('success');
    }
    if (helperTitle) helperTitle.innerText = check.title;
    if (helperMsg) helperMsg.innerHTML = check.message;
  }

  updateEditorStats();
  recordProgressItem('editor', 'run_code');
}

/* Muat Template Snippet */
function loadEditorTemplate(templateKey) {
  currentEditorTemplateKey = templateKey;
  const textarea = document.getElementById('htmlCodeInput');
  if (!textarea) return;

  if (EDITOR_TEMPLATES[templateKey]) {
    textarea.value = EDITOR_TEMPLATES[templateKey];
  }

  // Update snippet button styling
  const snipBtns = document.querySelectorAll('.snippet-btn');
  snipBtns.forEach(btn => {
    if (btn.id === `snip-${templateKey}`) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  runHtmlEditorCode();
}

/* Muat Tantangan Koding */
function loadEditorChallenge(num) {
  const textarea = document.getElementById('htmlCodeInput');
  if (!textarea) return;

  if (EDITOR_CHALLENGES[num]) {
    textarea.value = EDITOR_CHALLENGES[num];
  }

  // Remove active from templates
  const snipBtns = document.querySelectorAll('.snippet-btn');
  snipBtns.forEach(btn => btn.classList.remove('active'));

  runHtmlEditorCode();

  // Scroll smoothly to editor
  const workspace = document.querySelector('.editor-split-workspace');
  if (workspace) {
    workspace.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  recordProgressItem('editor', `challenge_${num}`);
}

/* Reset Kode */
function resetEditorCode() {
  loadEditorTemplate(currentEditorTemplateKey);
  showToastNotification('Kode berhasil dikembalikan ke contoh awal! 🔄');
}

/* Bersihkan Editor */
function clearEditorCode() {
  const textarea = document.getElementById('htmlCodeInput');
  const iframe = document.getElementById('htmlEditorPreview');
  const helperBox = document.getElementById('htmlHelperBox');
  const helperTitle = document.getElementById('helperTitle');
  const helperMsg = document.getElementById('helperMsg');
  const helperIcon = document.getElementById('helperIcon');

  if (textarea) textarea.value = '';
  if (iframe) iframe.srcdoc = '';

  if (helperBox) {
    helperBox.className = 'editor-helper-box helper-info';
    if (helperIcon) helperIcon.innerText = '💡';
    if (helperTitle) helperTitle.innerText = 'Editor Bersih:';
    if (helperMsg) helperMsg.innerText = 'Lembar kerja telah dikosongkan. Silakan ketik kode baru atau pilih template latihan di atas!';
  }

  updateEditorStats();
  showToastNotification('Editor berhasil dikosongkan 🧹');
}

/* Salin Kode */
function copyEditorCode() {
  const textarea = document.getElementById('htmlCodeInput');
  if (!textarea || !textarea.value) {
    showToastNotification('Tidak ada kode untuk disalin');
    return;
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(textarea.value).then(() => {
      showToastNotification('Kode berhasil disalin ke clipboard! 📋');
      playAudioTone('success');
    }).catch(() => {
      fallbackCopyText(textarea);
    });
  } else {
    fallbackCopyText(textarea);
  }
}

function fallbackCopyText(textarea) {
  textarea.select();
  document.execCommand('copy');
  showToastNotification('Kode berhasil disalin! 📋');
}

/* Toast Notification Mini */
function showToastNotification(message) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.right = '24px';
    toast.style.background = '#1e293b';
    toast.style.color = '#ffffff';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '30px';
    toast.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
    toast.style.fontSize = '14px';
    toast.style.fontWeight = 'bold';
    toast.style.zIndex = '9999';
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    document.body.appendChild(toast);
  }

  toast.innerText = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
  }, 2400);
}

/* Inisialisasi Editor */
function initCodeEditor() {
  const textarea = document.getElementById('htmlCodeInput');
  if (!textarea) return;

  // Intercept Tab key in textarea
  textarea.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = this.selectionStart;
      const end = this.selectionEnd;

      this.value = this.value.substring(0, start) + '  ' + this.value.substring(end);
      this.selectionStart = this.selectionEnd = start + 2;
      updateEditorStats();
    }
  });

  textarea.addEventListener('input', function() {
    updateEditorStats();
  });

  // Load default template
  if (!textarea.value.trim()) {
    loadEditorTemplate('dasar');
  } else {
    runHtmlEditorCode();
  }
}


/* ==========================================================================
   FUNGSI INTERAKTIF STUDI KASUS DEDEN JULIANDI
   ========================================================================== */

function initDedenCaseStudy() {
  const iframeAfter = document.getElementById('iframeCaseAfter');
  const iframeBefore = document.getElementById('iframeCaseBefore');

  if (iframeAfter) {
    iframeAfter.srcdoc = DEDEN_FULL_COMBO;
  }
  if (iframeBefore) {
    iframeBefore.srcdoc = DEDEN_HTML_RAW;
  }
}

function switchDedenCaseTab(tabKey) {
  const tabs = ['after', 'before', 'html', 'css', 'js'];
  
  tabs.forEach(t => {
    const btn = document.getElementById(`btnShowcase${t.charAt(0).toUpperCase() + t.slice(1)}`);
    const panel = document.getElementById(`panelCase${t.charAt(0).toUpperCase() + t.slice(1)}`);
    
    if (btn) {
      if (t === tabKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
    
    if (panel) {
      if (t === tabKey) {
        panel.style.display = 'block';
        panel.classList.add('active');
      } else {
        panel.style.display = 'none';
        panel.classList.remove('active');
      }
    }
  });

  if (tabKey === 'after') {
    const iframeAfter = document.getElementById('iframeCaseAfter');
    if (iframeAfter && !iframeAfter.srcdoc) iframeAfter.srcdoc = DEDEN_FULL_COMBO;
  } else if (tabKey === 'before') {
    const iframeBefore = document.getElementById('iframeCaseBefore');
    if (iframeBefore && !iframeBefore.srcdoc) iframeBefore.srcdoc = DEDEN_HTML_RAW;
  }
}

function openDedenInEditor() {
  navigateTo('editor');
  loadEditorTemplate('deden');
  showToastNotification('Kode Biodata MTsN 5 Sumedang berhasil dimuat di Editor! 🏫');
}

function copyDedenCode(type) {
  const textToCopy = type === 'html' ? DEDEN_HTML_RAW : (type === 'css' ? DEDEN_CSS_CODE : DEDEN_JS_CODE);
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToastNotification(`Kode ${type.toUpperCase()} berhasil disalin ke clipboard! 📋`);
      playAudioTone('success');
    }).catch(() => {
      fallbackCopyRawText(textToCopy);
    });
  } else {
    fallbackCopyRawText(textToCopy);
  }
}

function fallbackCopyRawText(text) {
  const tempInput = document.createElement('textarea');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  showToastNotification('Kode berhasil disalin! 📋');
}


/* ==========================================================================
   INISIALISASI SAAT HALAMAN SELESAI DIMUAT
   ========================================================================== */
window.addEventListener('DOMContentLoaded', () => {
  loadProgress();
  renderAct1Question();
  initAct2Game();
  renderAct3Question();
  updateSimButtons();
  updateSimulatorOutput();
  initProjectChecklist();
  renderQuizQuestion();

  console.log('Media Pembelajaran Informatika SMP/MTs "HTML, CSS & JavaScript Dasar" Siap Digunakan!');
});

// ==========================================================================
// VIRTUAL CONSOLE SIMULATOR (MATERI G)
// ==========================================================================
let currentJsPresetId = 1;

const JS_PRESETS = {
  1: {
    code: `let nama = "Andi";
let nilaiTugas = 80;
let nilaiUjian = 90;
let rataRata = (nilaiTugas + nilaiUjian) / 2;

console.log("Nama: " + nama);
console.log("Nilai Rata-rata: " + rataRata);`,
    run: () => [
      '> let nama = "Andi";',
      '> let nilaiTugas = 80;',
      '> let nilaiUjian = 90;',
      '> let rataRata = (80 + 90) / 2;',
      '✨ Nama: Andi',
      '✨ Nilai Rata-rata: 85'
    ]
  },
  2: {
    code: `let nilai = 85;

if (nilai >= 75) {
    console.log("Status: LULUS! 🎉");
    console.log("Selamat, pertahankan prestasimu!");
} else {
    console.log("Status: REMEDIAL 📚");
}`,
    run: () => [
      '> let nilai = 85;',
      '> Memeriksa: if (85 >= 75) -> BENAR (true)',
      '🎉 Status: LULUS! 🎉',
      '✨ Selamat, pertahankan prestasimu!'
    ]
  },
  3: {
    code: `let namaSiswa = "Deden Juliandi";
let asalSekolah = "MTsN 5 Sumedang";

console.log("Halo! Saya " + namaSiswa);
console.log("Saya siswa " + asalSekolah);
alert("Salam hangat dari " + namaSiswa + "! 👋");`,
    run: () => {
      alert("Salam hangat dari Deden Juliandi (MTsN 5 Sumedang)! 👋");
      return [
        '> let namaSiswa = "Deden Juliandi";',
        '> let asalSekolah = "MTsN 5 Sumedang";',
        '👋 Halo! Saya Deden Juliandi',
        '🏫 Saya siswa MTsN 5 Sumedang',
        '📢 Kotak dialog alert() berhasil dipicu!'
      ];
    }
  }
};

function selectJsPreset(id) {
  currentJsPresetId = id;
  for (let i = 1; i <= 3; i++) {
    const btn = document.getElementById(`btnJsPreset${i}`);
    if (btn) {
      if (i === id) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  }
  const display = document.getElementById('jsPresetCodeDisplay');
  if (display && JS_PRESETS[id]) {
    display.innerText = JS_PRESETS[id].code;
  }
}

function runJsPreset() {
  const output = document.getElementById('jsConsoleOutput');
  if (!output || !JS_PRESETS[currentJsPresetId]) return;

  playAudioTone('success');
  const lines = JS_PRESETS[currentJsPresetId].run();
  output.innerHTML = '';
  lines.forEach(l => {
    const lineDiv = document.createElement('div');
    lineDiv.className = 'term-line ' + (l.startsWith('>') ? 'info-line' : 'success-line');
    lineDiv.innerText = l;
    output.appendChild(lineDiv);
  });
}

function clearJsConsole() {
  const output = document.getElementById('jsConsoleOutput');
  if (output) {
    output.innerHTML = '<div class="term-line info-line">> Konsol dibersihkan. Siap menerima perintah...</div>';
  }
}