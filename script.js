/* =============================================================
   GUESS THE CRYPTOGRAPH — script.js
   Isi file:
   1. DATA LEVEL & PENGATURAN  (ganti pesan/kunci di sini saja)
   2. LOGIKA CIPHER SANDI    (enkripsi, dekripsi, normalisasi)
   3. SELF-TEST CIPHER          (dicek otomatis tiap halaman dibuka)
   4. PROGRES TERSIMPAN         (localStorage: koin, bintang, rekam jejak)
   5. LOGIKA GAME               (tebakan, hint, skor, bintang)
   6. UTILITAS TAMPILAN         (layar, transisi, efek koin)
   7. LAYAR LOADING
   8. PETA HARTA KARUN          (level sebagai pulau + kapal berlayar)
   9. LAYAR GAME                (sandi, tebakan, hint, animasi dekripsi)
  11. SUARA                     (musik, efek, senyap, volume)
  12. POPUP & EVENT
   ============================================================= */


/* -------------------------------------------------------------
   1. DATA LEVEL & PENGATURAN

   Jawaban sengaja DISAMARKAN (base64 + dibalik) supaya tidak
   terbaca sekilas kalau file ini dibuka. Ini bukan pengamanan
   sungguhan — tetap bisa dibongkar lewat F12.

   Cara membuat level baru: buka halaman game, tekan F12 > Console,
   ketik:   sembunyi("PESAN BARU")   lalu   sembunyi("KUNCI")
   Salin hasilnya ke kolom p (pesan) dan k (kunci) di bawah.
   Kunci hanya boleh huruf A–Z. Kunci makin panjang = makin sulit.
   Ciphertext tidak ditulis manual — dihitung otomatis.
   ------------------------------------------------------------- */
const sembunyi = (teks) => btoa(String(teks).split("").reverse().join(""));
const buka = (kode) => atob(kode).split("").reverse().join("");

const LEVEL_DATA = [
  {
    title: "Pelabuhan Tortuga",
    category: "Titipan sang bajak laut",
    points: 100,
    story: [
      "Tortuga malam ini riuh: gelas beradu, dadu berguling, seseorang menyanyi sumbang di atas meja. Di pojok dermaga, kau menemukan Janggut Merah, bajak laut paling dicari di tujuh lautan, tertidur di atas tong kayu. Napasnya berbau rum, minuman manis dan pedas dari tebu yang dibakar.",
      "Botol di tangannya sudah kosong. Sebelum kau sempat membangunkannya, ia membuka sebelah mata dan menyelipkan gulungan sandi ke tanganmu. \"Cuma rum yang bikin lidahku jujur,\" gumamnya. \"Jadi, itulah kata kunci sandi ini. Bukalah, lalu temui orang yang masih kupercaya.\" Ia pun mendengkur lagi."
    ],
    nudge: "Kesukaan Janggut Merah.",
    p: "SUFERUsgSUQgVVRBUyBBVEFNIElTIElVTUVU",
    k: "TVVS",
  },
  {
    title: "Kedai Si Mata Satu",
    category: "Petunjuk dari sang pemilik kedai",
    points: 130,
    story: [
      "Kedai Si Mata Satu hampir kosong ketika kau masuk. Sang pemilik hanya mengelap gelas sambil melirik ke kolong meja bar, tempat sebuah peti kayu besar berengsel besi terkunci rapat. Sudah bertahun-tahun tak ada yang boleh menyentuhnya.",
      "\"Janggut Merah menitipkan sesuatu padaku,\" katanya setelah membaca gulunganmu. \"Sandi berikutnya terkunci dengan kata yang sama seperti benda yang kujaga ini: peti. Isinya selalu emas, kadang rahasia.\" Ia mengangguk ke arah pelabuhan. \"Kalau kau sudah selesai, ada kapal yang menunggumu.\""
    ],
    nudge: "Yang selalu dijaga Si Mata Satu.",
    p: "QVJBVFUgRUsgSEFMSUdSRVAgTkFEIExBUEFLIElLSUFO",
    k: "SVRFUA==",
  },
  {
    title: "Geladak Kapal",
    category: "Peringatan untuk awak",
    points: 160,
    story: [
      "Kapal itu bernama Camar Retak, dan badai baru saja lewat saat kau naik. Awak berlarian menambal papan dan menguras air. Sang Nakhoda berdiri di bawah tiang tertinggi, menunjuk lembaran kain putih lebar yang masih berkibar walau robek di sana-sini.",
      "\"Tanpa layar itu, kapal ini cuma kayu besar yang hanyut ke mana ombak suka!\" serunya. Di bahunya, seekor burung warna-warni berkoar, \"Belok ke timur! Belok ke timur!\" Nakhoda menghela napas dan menyodorkan gulunganmu. \"Sandi itu terkunci dengan kata layar. Bacalah, sebelum aku salah dengar lagi.\""
    ],
    nudge: "Andalan sang Nakhoda di tiang kapal.",
    p: "T0VCIEdOVVJVQiBBWUFDUkVQIE5BR05BSg==",
    k: "UkFZQUw=",
  },
  {
    title: "Lautan Kabut",
    category: "Petunjuk arah",
    points: 200,
    story: [
      "Kau menurut dan berlayar ke utara, menjauhi arah yang disebut si burung. Malamnya kabut turun begitu tebal sampai ujung haluan pun tak kelihatan. Bintang lenyap, dan para awak mulai berbisik soal kapal hantu.",
      "Hanya Nakhoda tua yang tetap tenang, menggenggam sebuah kompas kuningan. Jarum kecilnya bergetar, bergeser, lalu berhenti di arah yang sama, tak peduli seberapa kencang kapal oleng. \"Kalau semuanya gelap,\" katanya, \"percayalah pada kompas. Itu juga kata kunci sandimu.\""
    ],
    nudge: "Penuntun Nakhoda saat semuanya gelap.",
    p: "UkFKQUYgSUFQTUFTIEFSQVRVIEdOQVROSUIgSVRVS0k=",
    k: "U0FQTU9L",
  },
  {
    title: "Pulau Tengkorak",
    category: "Lokasi harta",
    points: 250,
    story: [
      "Fajar menyingkap bayangan sebuah pulau berbentuk tengkorak. Tanpa banyak kata, awak menurunkan jangkar dari haluan. Rantai berderak panjang sebelum terdengar \"byur\" yang dalam.",
      "Kapal berhenti bergoyang, tertahan di tempatnya meski arus menarik kuat. \"Kita sampai,\" bisik Nakhoda. \"Jangkar itulah yang menahan kita tetap di tempat. Sama seperti sandi terakhir ini, dia menjaga rahasia Janggut Merah agar tak hanyut. Jangkar, kata kuncinya.\" Di tanganmu, gulungan terakhir bergetar tertiup angin pantai."
    ],
    nudge: "Penahan kapal di dekat pulau.",
    p: "QVBBTEVLIE5PSE9QIElSQUQgSEFLR05BTCBBR0lUIElMQUc=",
    k: "UkFLR05BSg==",
  },
];

/* Dipakai seluruh game: plaintext & key hanya hidup di memori. */
const LEVELS = LEVEL_DATA.map((l) => ({
  title: l.title,
  category: l.category,
  story: l.story,
  nudge: l.nudge,
  points: l.points,
  plaintext: buka(l.p),
  key: buka(l.k),
}));

/* Pengaturan skor.
   startCoins  : koin bekal di awal permainan
   hintCost    : koin yang dibayar dari dompet untuk Hint 1, 2, 3, 4
                 (hint tidak bisa dibuka kalau koin kurang)
   starBonus   : bonus koin untuk tiap bintang ekstra (tanpa petunjuk,
                 sekali tebak benar). Selesai level = 1 bintang. */
const CONFIG = {
  startCoins: 30,
  hintCost: [10, 20, 30, 60],
  starBonus: 30,
};


/* Daftar suara (folder sounds/). Ganti nama file di sini kalau mau
   memakai suara lain. File yang tidak ada akan dilewati tanpa error.
   Level volume tiap file sudah diseimbangkan, jadi gain = 1.
   Pengaturan volume pemain (penggeser) mengalikan semuanya. */
const AUDIO = {
  files: {
    musik: "sounds/musik.mp3",   // musik latar (di-loop)
    ombak: "sounds/ombak.mp3",   // ombak saat berpindah layar
    koin: "sounds/koin.mp3",     // koin bertambah
    salah: "sounds/salah.mp3",   // tebakan salah
    sukses: "sounds/sukses.mp3", // level selesai
    menang: "sounds/menang.mp3", // peti harta terbuka
  },
  gain: { musik: 1, ombak: 1, koin: 1, salah: 1, sukses: 1, menang: 1 },
  defaultVolume: 0.7,
};

/* -------------------------------------------------------------
   2. LOGIKA CIPHER SANDI
   Rumus (huruf A=0 … Z=25):
     Enkripsi : C = (P + K) mod 26
     Dekripsi : P = (C − K + 26) mod 26
   Aturan:
   - Semua huruf diubah ke kapital.
   - Karakter selain A–Z (spasi, angka, tanda baca) tidak diubah
     dan TIDAK memakai huruf kunci (indeks kunci tidak maju).
   ------------------------------------------------------------- */
const A_CODE = 65; // kode ASCII huruf 'A'

/** Ambil huruf A–Z saja, kapital. "Rum Tua!" -> "RUMTUA" */
function onlyLetters(text) {
  return String(text).toUpperCase().replace(/[^A-Z]/g, "");
}

/** true kalau karakter (1 huruf) adalah A–Z kapital. */
function isLetter(ch) {
  return ch >= "A" && ch <= "Z";
}

/**
 * Inti cipher. direction = +1 (enkripsi) atau -1 (dekripsi).
 * Mengembalikan teks hasil (kapital, non-huruf dibiarkan).
 */
function shiftCipher(text, key, direction) {
  const k = onlyLetters(key);
  if (k.length === 0) throw new Error("Kata kunci harus berisi huruf A–Z.");

  let keyIndex = 0;
  let result = "";
  for (const ch of String(text).toUpperCase()) {
    if (!isLetter(ch)) {
      result += ch; // spasi & tanda baca lewat apa adanya
      continue;
    }
    const p = ch.charCodeAt(0) - A_CODE;                    // 0..25
    const shift = k.charCodeAt(keyIndex % k.length) - A_CODE;
    const c = (p + direction * shift + 26) % 26;             // +26 agar tidak negatif
    result += String.fromCharCode(c + A_CODE);
    keyIndex++;
  }
  return result;
}

const encrypt = (text, key) => shiftCipher(text, key, +1);
const decrypt = (text, key) => shiftCipher(text, key, -1);


/* -------------------------------------------------------------
   3. SELF-TEST CIPHER
   Contoh baku: ATTACKATDAWN + LEMON = LXFOPVEFRNHR
   Hasil tampil di Console browser (F12).
   ------------------------------------------------------------- */
function runCipherTests() {
  const cases = [
    // [plaintext, key, ciphertext yang diharapkan]
    ["ATTACKATDAWN", "LEMON", "LXFOPVEFRNHR"],
    ["ATTACK AT DAWN", "LEMON", "LXFOPV EF RNHR"], // spasi tidak makan kunci
    ["HELLO", "KEY", "RIJVS"],
    ["attack at dawn", "lemon", "LXFOPV EF RNHR"], // huruf kecil -> kapital
    ["ZZZ", "B", "AAA"],                           // wrap-around Z -> A
    ["AYO, KE-77!", "B", "BZP, LF-77!"],           // tanda baca & angka aman
  ];

  let pass = 0;
  for (const [plain, key, expected] of cases) {
    const enc = encrypt(plain, key);
    const dec = decrypt(enc, key);
    const ok = enc === expected && dec === plain.toUpperCase();
    if (ok) pass++;
    else console.error("❌ Uji gagal:", { plain, key, expected, enc, dec });
  }

  // Semua level harus bisa dienkripsi lalu didekripsi balik.
  LEVELS.forEach((lv, i) => {
    const back = decrypt(encrypt(lv.plaintext, lv.key), lv.key);
    if (back === lv.plaintext.toUpperCase()) pass++;
    else console.error(`❌ Level ${i + 1} tidak bolak-balik dengan benar`, lv);
  });

  const total = cases.length + LEVELS.length;
  const allOk = pass === total;
  (allOk ? console.log : console.warn)(
    `🏴‍☠️ Uji cipher: ${pass}/${total} lulus`
  );
  return allOk;
}


/* -------------------------------------------------------------
   4. PROGRES TERSIMPAN (localStorage)
   Isi: total koin dan rekam jejak tiap level (termasuk bintang).
   Kalau browser menolak localStorage, game tetap jalan
   (hanya saja progres hilang saat halaman ditutup).
   ------------------------------------------------------------- */
const SAVE_KEY = "gtc-progress-v3";
let save = null;

function freshRecord() {
  // hints: hint terbuka · wrong: tebakan salah
  // earned/bonus: koin yang didapat saat level pertama kali selesai
  // spent: koin yang dibayar untuk hint di level ini
  // stars: 0 (belum selesai) sampai 3
  return { done: false, hints: 0, wrong: 0, earned: 0, bonus: 0, spent: 0, stars: 0 };
}

function freshSave() {
  return { score: CONFIG.startCoins, levels: LEVELS.map(freshRecord) };
}

function loadSave() {
  const fresh = freshSave();
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return fresh;
    const d = JSON.parse(raw);
    if (Number.isFinite(d.score)) fresh.score = d.score;
    fresh.levels.forEach((rec, i) => {
      const s = d.levels && d.levels[i];
      if (!s) return;
      rec.done = !!s.done;
      for (const f of ["hints", "wrong", "earned", "bonus", "spent", "stars"]) {
        if (Number.isFinite(s[f])) rec[f] = s[f];
      }
    });
  } catch (e) { /* data rusak → mulai baru */ }
  return fresh;
}

function persist() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) { /* abaikan */ }
}


/* -------------------------------------------------------------
   5. LOGIKA GAME
   ------------------------------------------------------------- */
const state = {
  screen: "loading",
  levelIndex: 0,
  practice: false,    // main ulang level yang sudah selesai (tanpa koin)
  practiceHints: 0,
  solved: false,
  animating: false,
  busy: false,        // sedang transisi layar
};

const currentLevel = () => LEVELS[state.levelIndex];
const currentRec = () => save.levels[state.levelIndex];
const currentCipher = () => encrypt(currentLevel().plaintext, currentLevel().key);

/** Index level pertama yang belum selesai; = jumlah level kalau semua tamat. */
function currentIndex() {
  const i = save.levels.findIndex((l) => !l.done);
  return i === -1 ? LEVELS.length : i;
}
const doneCount = () => save.levels.filter((l) => l.done).length;
const allDone = () => doneCount() === LEVELS.length;
const isUnlocked = (i) => i === 0 || save.levels[i - 1].done;

/**
 * Cek tebakan. Level selesai HANYA jika pemain mengetik PESAN ASLI
 * (hasil dekripsi). Menebak KATA KUNCI-nya benar hanya memberi
 * kabar baik, belum menyelesaikan level (spasi/tanda baca/huruf
 * kecil diabaikan).
 * Return: "plaintext" | "key" | null
 */
function checkGuess(guess) {
  const g = onlyLetters(guess);
  if (!g) return null;
  const lv = currentLevel();
  if (g === onlyLetters(lv.plaintext)) return "plaintext";
  if (g === onlyLetters(lv.key)) return "key";
  return null;
}

/* ----- Hint bertingkat: isi tiap tingkat dihitung dari data level ----- */
function hintText(level, n) {
  const key = onlyLetters(level.key);
  return [
    { label: "Dari cerita", value: level.nudge },
    { label: "Panjang kata kunci", value: `${key.length} huruf` },
    { label: "Huruf pertama kata kunci", value: key[0] },
    { label: "Kata kunci", value: key },
  ][n];
}

/** Deretan 3 bintang (HTML) — `on` bintang menyala. */
const starRow = (on, size = 18) => [0, 1, 2].map((k) =>
  `<svg class="star ${k < on ? "star--on" : "star--off"}" width="${size}" height="${size}" aria-hidden="true"><use href="#i-star"/></svg>`).join("");

const hintCount = () => (state.practice ? state.practiceHints : currentRec().hints);

/** Hadiah level = poin level (hint sudah dibayar langsung dari dompet). */
const currentReward = () => currentLevel().points;

/** Biaya hint berikutnya, dan apakah koin pemain cukup. */
const nextHintCost = () => CONFIG.hintCost[hintCount()];
const canAffordHint = () => state.practice || save.score >= nextHintCost();

/** Bintang level: 1 (selesai) + 1 (tanpa petunjuk) + 1 (tanpa tebakan salah). */
const starsFor = (rec) => 1 + (rec.hints === 0 ? 1 : 0) + (rec.wrong === 0 ? 1 : 0);
const totalStars = () => save.levels.reduce((a, r) => a + (r.done ? r.stars : 0), 0);

/** Skor maksimal teoretis (tanpa hint, tanpa salah) — untuk pangkat akhir. */
function maxPossibleScore() {
  return LEVELS.reduce(
    (sum, lv) => sum + lv.points + 2 * CONFIG.starBonus, 0);
}

function rankFor(score) {
  const ratio = score / maxPossibleScore();
  if (ratio >= 0.85) return "Kapten Legendaris";
  if (ratio >= 0.6) return "Navigator Handal";
  if (ratio >= 0.35) return "Awak Kapal";
  return "Anak Buah Baru";
}


/* -------------------------------------------------------------
   6. UTILITAS TAMPILAN
   ------------------------------------------------------------- */
const $ = (sel) => document.querySelector(sel);
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** Tampilkan satu layar (peta / game), sembunyikan yang lain. */
function showScreen(name) {
  state.screen = name;
  $("#screen-map").hidden = name !== "map";
  $("#screen-game").hidden = name !== "game";
  window.scrollTo(0, 0);
}

/**
 * Transisi: panel laut + gelombang naik menutup layar, `swapFn`
 * mengganti isi layar di baliknya, lalu panel naik keluar.
 */
async function transition(swapFn) {
  const wipe = $("#wipe");
  if (reducedMotion()) { swapFn(); return; }
  playWave();
  wipe.style.transition = "none";
  wipe.style.transform = "translateY(calc(100% + 70px))";
  void wipe.offsetWidth;
  wipe.style.transition = "";
  wipe.style.transform = "translateY(0)";
  await sleep(700);
  swapFn();
  await sleep(450);
  fadeOutWave(800);
  wipe.style.transform = "translateY(calc(-100% - 70px))";
  await sleep(700);
  // Kembalikan ke bawah layar tanpa animasi supaya tepi gelombang tidak tertinggal
  wipe.style.transition = "none";
  wipe.style.transform = "translateY(calc(100% + 70px))";
}

/** Efek denyut pada angka statistik. */
function bump(el) {
  el.classList.remove("bump");
  void el.offsetWidth;
  el.classList.add("bump");
}

function renderStats(animate = false) {
  $("#stat-level").textContent = `${doneCount()}/${LEVELS.length}`;
  $("#stat-score").textContent = save.score;
  $("#stat-stars").textContent = `${totalStars()}/${LEVELS.length * 3}`;
  if (animate) { bump($("#stat-score")); bump($("#stat-stars")); }
}

/** Hujan koin dari tengah elemen `from`. */
function burst(from, count = 14, host = document.body) {
  if (reducedMotion()) return;
  const r = from.getBoundingClientRect();
  const x0 = r.left + r.width / 2, y0 = r.top + r.height / 2;
  for (let i = 0; i < count; i++) {
    const coin = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    coin.setAttribute("class", "coin");
    coin.innerHTML = '<use href="#i-two-coins"/>';
    coin.style.left = x0 + "px";
    coin.style.top = y0 + "px";
    host.appendChild(coin);
    const dx = (Math.random() - 0.5) * 340;
    const up = 90 + Math.random() * 190;
    const spin = (Math.random() - 0.5) * 540;
    coin.animate(
      [
        { transform: "translate(-50%,-50%) scale(0.6)", opacity: 1 },
        { transform: `translate(calc(-50% + ${dx * 0.6}px), calc(-50% - ${up}px)) scale(1.15) rotate(${spin / 2}deg)`, opacity: 1, offset: 0.45 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + 240px)) scale(0.8) rotate(${spin}deg)`, opacity: 0 },
      ],
      { duration: 1100 + Math.random() * 500, easing: "ease-out" }
    ).onfinish = () => coin.remove();
  }
}


/* -------------------------------------------------------------
   6b. SUARA
   - Musik & efek memakai file di folder sounds/ (elemen Audio).
   - Bunyi klik & petunjuk dibuat lewat kode (Web Audio), tanpa file.
   - Pemain bisa senyapkan (tombol / tombol M) dan atur volume.
   - Pengaturan disimpan di browser.
   Browser baru mengizinkan suara setelah pemain menekan sesuatu;
   tombol "Mulai Berlayar" yang memulai musik.
   ------------------------------------------------------------- */
const AUDIO_KEY = "gtc-audio-v1";
const sound = { muted: false, volume: AUDIO.defaultVolume, els: {}, ctx: null, waveTimer: null };
const clamp01 = (n) => Math.min(1, Math.max(0, n));

function loadAudioPrefs() {
  try {
    const d = JSON.parse(localStorage.getItem(AUDIO_KEY) || "{}");
    if (Number.isFinite(d.volume)) sound.volume = clamp01(d.volume);
    sound.muted = !!d.muted;
  } catch (e) { /* pakai bawaan */ }
}
function saveAudioPrefs() {
  try { localStorage.setItem(AUDIO_KEY, JSON.stringify({ volume: sound.volume, muted: sound.muted })); } catch (e) { /* abaikan */ }
}

function initAudio() {
  for (const [name, src] of Object.entries(AUDIO.files)) {
    const a = new Audio();
    a.preload = "auto";
    a.src = src;
    a.loop = name === "musik";
    sound.els[name] = a;
  }
  applyVolume();
}

/** Terapkan volume & status senyap ke semua suara + perbarui tampilan kontrol. */
function applyVolume() {
  const silent = sound.muted || sound.volume === 0;
  for (const [name, a] of Object.entries(sound.els)) {
    a.volume = clamp01(sound.volume * (AUDIO.gain[name] ?? 1));
    a.muted = silent;
  }
  const pct = Math.round(sound.volume * 100);
  $("#sound").classList.toggle("sound--muted", silent);
  $("#btn-mute").setAttribute("aria-pressed", String(silent));
  $("#btn-mute").title = silent ? "Nyalakan suara (M)" : "Senyapkan suara (M)";
  $("#mute-label").textContent = silent ? "Senyap" : "Suara";
  $("#volume").value = pct;
  $("#volume").style.setProperty("--fill", pct + "%");
  $("#vol-pct").textContent = silent ? "—" : pct + "%";
}

function toggleMute() {
  if (sound.volume === 0) sound.volume = AUDIO.defaultVolume; // slider di 0 → nyalakan lagi
  else sound.muted = !sound.muted;
  applyVolume();
  saveAudioPrefs();
}

function setVolume(pct) {
  sound.volume = clamp01(pct / 100);
  if (sound.volume > 0) sound.muted = false; // menggeser slider = menyalakan suara
  applyVolume();
  saveAudioPrefs();
}

/** Efek dari file. Tidak berbunyi saat senyap atau file tidak ada. */
function playSfx(name, delay = 0) {
  const play = () => {
    const a = sound.els[name];
    if (!a || sound.muted || sound.volume === 0) return;
    try { a.currentTime = 0; } catch (e) { /* belum siap */ }
    a.play().catch(() => {});
  };
  if (delay) setTimeout(play, delay); else play();
}

/** Musik latar mulai (dipanggil dari klik pemain). Tetap "jalan" saat senyap. */
function startMusic() {
  const a = sound.els.musik;
  if (a) a.play().catch(() => {});
}

/** Ombak: mulai di titik acak, lalu memudar saat transisi selesai. */
function playWave() {
  const a = sound.els.ombak;
  if (!a || sound.muted || sound.volume === 0) return;
  clearInterval(sound.waveTimer);
  a.volume = clamp01(sound.volume * (AUDIO.gain.ombak ?? 1));
  try { a.currentTime = Math.random() * Math.max(0, (a.duration || 60) - 5); } catch (e) { /* abaikan */ }
  a.play().catch(() => {});
}
function fadeOutWave(ms = 800) {
  const a = sound.els.ombak;
  if (!a || a.paused) return;
  clearInterval(sound.waveTimer);
  const start = a.volume, t0 = performance.now();
  sound.waveTimer = setInterval(() => {
    const t = Math.min(1, (performance.now() - t0) / ms);
    a.volume = clamp01(start * (1 - t));
    if (t >= 1) { clearInterval(sound.waveTimer); a.pause(); }
  }, 40);
}

/** Bunyi pendek buatan kode: "klik" (ketukan) dan "hint" (dua nada naik). */
function blip(kind) {
  if (sound.muted || sound.volume === 0) return;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    sound.ctx = sound.ctx || new Ctx();
    const ctx = sound.ctx;
    if (ctx.state === "suspended") ctx.resume();
    const notes = kind === "hint" ? [[660, 0, 0.12], [990, 0.11, 0.2]] : [[740, 0, 0.06]];
    for (const [freq, at, dur] of notes) {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      const t = ctx.currentTime + at, peak = 0.16 * sound.volume;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    }
  } catch (e) { /* tanpa suara */ }
}


/* -------------------------------------------------------------
   7. LAYAR LOADING
   Game ini lokal (langsung siap), jadi loading-nya animasi
   dekoratif ±3 detik: bar terisi + pesan berganti.
   ------------------------------------------------------------- */
function runLoading() {
  const steps = [
    [0, "Menggulung peta…"],
    [30, "Mengasah kompas…"],
    [60, "Mengisi peti dengan sandi…"],
    [92, "Siap berlayar, Kapten!"],
  ];
  const fill = $("#load-fill"), msg = $("#load-msg"), bar = $(".loading__bar");
  const dur = reducedMotion() ? 500 : 3000;
  return new Promise((resolve) => {
    const t0 = performance.now();
    (function tick(now) {
      const t = Math.min(1, (now - t0) / dur);
      const pct = Math.round(t * 100);
      fill.style.width = pct + "%";
      bar.setAttribute("aria-valuenow", pct);
      msg.textContent = steps.filter(([at]) => pct >= at).pop()[1];
      if (t < 1) requestAnimationFrame(tick); else resolve();
    })(t0);
  });
}

/** Dari loading ke peta (dipicu tombol "Mulai Berlayar"). */
async function startGame() {
  if (state.busy) return;
  state.busy = true;
  startMusic(); // klik pemain = izin browser untuk memutar suara
  renderMap();
  await transition(() => {
    $("#loading").hidden = true;
    $("#app").hidden = false;
    showScreen("map");
  });
  state.busy = false;
  afterMapShown();
  // Pertama kali main: tampilkan "Kisah Kita" otomatis satu kali
  try {
    if (!localStorage.getItem("gtc-intro-v1")) {
      localStorage.setItem("gtc-intro-v1", "1");
      setTimeout(() => { if (!document.querySelector("dialog[open]")) $("#lore").showModal(); }, 700);
    }
  } catch (e) { /* abaikan */ }
}


/* -------------------------------------------------------------
   8. PETA HARTA KARUN
   Tiap level = satu pulau. Jalur putus-putus menghubungkan pulau
   dan berakhir di tanda X. Kapal berlayar ke pulau berikutnya
   setiap level selesai. Peta digambar ulang sebagai SVG; di HP
   dipakai tata letak tegak (portrait), di layar lebar mendatar.
   ------------------------------------------------------------- */
const MAP_LAYOUTS = {
  land: {
    w: 1000, h: 560, nodeR: 36, islandR: 88,
    nodes: [[110, 430], [290, 240], [490, 400], [690, 230], [830, 410]],
    treasure: [915, 120],
    extra: [[70, 110, 52], [560, 100, 46], [330, 500, 40], [960, 500, 36]],
    compass: [790, 40, 150], anchor: [40, 490, 64], skull: [600, 300, 56],
    kraken: [620, 440, 100], wreck: [20, 205, 80], shark: [700, 80, 56],
    names: [["Laut Karang", 150, 540], ["Teluk Bajak Laut", 640, 350], ["Selat Kabut", 440, 110]],
  },
  port: {
    w: 400, h: 680, nodeR: 30, islandR: 64,
    nodes: [[95, 595], [300, 495], [100, 390], [300, 285], [100, 185]],
    treasure: [300, 100],
    extra: [[40, 40, 36], [200, 330, 30]],
    compass: [325, 150, 66], anchor: [20, 460, 48], skull: [190, 215, 44],
    kraken: [255, 570, 100], wreck: [250, 372, 60], shark: [30, 280, 44],
    names: [["Laut Karang", 150, 662], ["Selat Kabut", 110, 80]],
  },
};
const mapLayoutKey = () => (window.innerWidth < 640 ? "port" : "land");
let renderedLayout = null;
const ship = { index: 0 }; // kapal sedang berlabuh di pulau ke-berapa

/** Pembangkit angka acak tetap (seed) supaya pulau tidak berubah-ubah. */
function rng(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/** Bentuk pulau acak yang halus (kurva kuadratik di sekeliling titik). */
function blobPath(cx, cy, r, seed) {
  const rnd = rng(seed), n = 11, pts = [];
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n;
    const rr = r * (0.7 + 0.4 * rnd());
    pts.push([cx + Math.cos(a) * rr * 1.2, cy + Math.sin(a) * rr * 0.85]);
  }
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const f = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
  let d = `M${f(mid(pts[n - 1], pts[0]))}`;
  for (let i = 0; i < n; i++) d += ` Q${f(pts[i])} ${f(mid(pts[i], pts[(i + 1) % n]))}`;
  return d + "Z";
}

/** Jalur melengkung (S) dari titik a ke b. */
function segPath(a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  if (Math.abs(dx) >= Math.abs(dy)) {
    const mx = (a[0] + b[0]) / 2;
    return `M${a[0]} ${a[1]} C${mx} ${a[1]} ${mx} ${b[1]} ${b[0]} ${b[1]}`;
  }
  const my = (a[1] + b[1]) / 2;
  return `M${a[0]} ${a[1]} C${a[0]} ${my} ${b[0]} ${my} ${b[0]} ${b[1]}`;
}

function nodeState(i) {
  if (save.levels[i].done) return "done";
  return isUnlocked(i) ? "current" : "locked";
}

const LEVEL_STARS = (i) => save.levels[i].stars;

function renderMap() {
  const key = mapLayoutKey();
  renderedLayout = key;
  const L = MAP_LAYOUTS[key];
  const pts = [...L.nodes, L.treasure];
  const cur = currentIndex();
  const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  let s = `<svg class="map__svg" viewBox="0 0 ${L.w} ${L.h}" role="group" aria-label="Peta level">`;

  // 1) riak ombak
  const r = rng(11);
  for (let i = 0; i < (key === "land" ? 46 : 34); i++) {
    s += `<path class="map__wave" d="M${(r() * L.w).toFixed(0)} ${(r() * L.h).toFixed(0)} q7 -7 14 0 t14 0"/>`;
  }
  // 2) pulau: pulau level, pulau harta, pulau hiasan
  L.nodes.forEach(([x, y], i) => { s += `<path class="map__island" d="${blobPath(x, y + 6, L.islandR, 31 + i * 7)}"/>`; });
  s += `<path class="map__island" d="${blobPath(L.treasure[0], L.treasure[1] + 8, L.islandR * 0.7, 91)}"/>`;
  L.extra.forEach(([x, y, rad], i) => { s += `<path class="map__island map__island--far" d="${blobPath(x, y, rad, 51 + i * 5)}"/>`; });
  // 3) hiasan: kompas, jangkar, tengkorak, nama tempat
  const [cx, cy, cs] = L.compass, [ax, ay, as] = L.anchor, [sx, sy, ss] = L.skull;
  s += `<use class="map__deco map__deco--compass" href="#i-compass" x="${cx}" y="${cy}" width="${cs}" height="${cs}"/>`;
  s += `<use class="map__deco" href="#i-anchor" x="${ax}" y="${ay}" width="${as}" height="${as}"/>`;
  s += `<use class="map__deco" href="#i-skull-crossed-bones" x="${sx}" y="${sy}" width="${ss}" height="${ss}"/>`;
  const [kx, ky, ks] = L.kraken, [wx, wy, ws] = L.wreck, [fx, fy, fs] = L.shark;
  s += `<use class="map__deco map__deco--sway" href="#i-kraken-tentacle" x="${kx}" y="${ky}" width="${ks}" height="${ks}"/>`;
  s += `<use class="map__deco map__deco--bob" href="#i-sinking-ship" x="${wx}" y="${wy}" width="${ws}" height="${ws}"/>`;
  s += `<use class="map__deco map__deco--fin" href="#i-shark-fin" x="${fx}" y="${fy}" width="${fs}" height="${fs}"/>`;
  L.names.forEach(([t, x, y]) => { s += `<text class="map__place" x="${x}" y="${y}">${esc(t)}</text>`; });

  // 4) jalur putus-putus antar pulau (selesai / aktif / belum)
  for (let i = 0; i < LEVELS.length; i++) {
    const cls = save.levels[i].done ? "seg seg--done" : i === cur ? "seg seg--active" : "seg";
    s += `<path id="seg-${i}" class="${cls}" d="${segPath(pts[i], pts[i + 1])}"/>`;
  }

  // 5) tanda X + peti harta
  const [tx, ty] = L.treasure;
  const shipAtTreasure = ship.index >= LEVELS.length;
  s += `<g transform="translate(${tx} ${ty})"><g class="treasure ${allDone() && shipAtTreasure ? "treasure--open" : ""}" data-node="${LEVELS.length}" tabindex="0" role="button" aria-label="Peti harta"><g class="treasure__inner">` +
    `<path class="treasure__x" d="M-20 -20 L20 20 M20 -20 L-20 20"/>` +
    `<use id="treasure-chest" href="#${shipAtTreasure && allDone() ? "i-open-treasure-chest" : "i-locked-chest"}" x="-28" y="-78" width="56" height="56"/>` +
    `<text class="node__label node__label--center" y="${key === "land" ? 52 : 50}">Harta</text></g></g></g>`;

  // 6) pulau level (tombol)
  L.nodes.forEach(([x, y], i) => {
    const st = nodeState(i);
    const icon = st === "done" ? "i-pirate-flag" : st === "locked" ? "i-locked-chest" : "i-compass";
    const R = L.nodeR, ic = R * 1.1;
    const label = `Level ${i + 1}: ${LEVELS[i].title}` + (st === "locked" ? " (terkunci)" : st === "done" ? " (selesai)" : "");
    const right = key === "port" && x < 200, left = key === "port" && x >= 200;
    const lx = right ? R + 12 : left ? -(R + 12) : 0;
    const ly = key === "port" ? 8 : R + 30;
    const anchor = right ? "start" : left ? "end" : "middle";
    s += `<g transform="translate(${x} ${y})"><g class="node node--${st}" data-node="${i}" tabindex="0" role="button" aria-label="${esc(label)}"><g class="node__inner">` +
      (st === "current" ? `<circle class="node__ring" r="${R + 8}"/>` : "") +
      `<circle class="node__disc" r="${R}"/>` +
      (st === "done" ? [0, 1, 2].map((k) => `<use class="node__star ${k < LEVEL_STARS(i) ? "node__star--on" : ""}" href="#i-star" x="${(k - 1.5) * 22 + 1}" y="${-R - 26}" width="20" height="20"/>`).join("") : "") +
      `<use class="node__icon" href="#${icon}" x="${-ic / 2}" y="${-ic / 2}" width="${ic}" height="${ic}"/>` +
      `<circle class="node__badge" cx="${R * 0.78}" cy="${-R * 0.78}" r="${R * 0.38}"/>` +
      `<text class="node__num" x="${R * 0.78}" y="${-R * 0.78 + 6}">${i + 1}</text>` +
      `<text class="node__label" x="${lx}" y="${ly}" text-anchor="${anchor}">${esc(LEVELS[i].title)}</text>` +
      `</g></g></g>`;
  });

  // 7) kapal
  s += `<g id="ship" class="ship"><g class="ship__inner"><use href="#i-galleon" x="-30" y="-30" width="60" height="60"/></g></g></svg>`;
  $("#map").innerHTML = s;
  placeShip(ship.index);
  setMapMessage();
}

/** Letakkan kapal di atas pulau ke-`idx`; di akhir jalur kapal berlabuh di kiri tanda X. */
function shipOffset() { return MAP_LAYOUTS[renderedLayout].nodeR + 34; }
function placeShip(idx, x, y) {
  const L = MAP_LAYOUTS[renderedLayout];
  if (idx >= LEVELS.length) {
    const [tx, ty] = L.treasure;
    const el = document.getElementById("ship");
    if (el) el.setAttribute("transform", `translate(${tx - 74} ${ty + 12})`);
    return;
  }
  const base = L.nodes[idx];
  const px = x === undefined ? base[0] : x;
  const py = y === undefined ? base[1] : y;
  const el = document.getElementById("ship");
  if (el) el.setAttribute("transform", `translate(${px} ${py - shipOffset()})`);
}

/** Kapal berlayar menyusuri jalur putus-putus dari pulau `from` ke `from+1`. */
function sail(from) {
  return new Promise((resolve) => {
    const path = document.getElementById(`seg-${from}`);
    if (!path || reducedMotion()) return resolve();
    const len = path.getTotalLength();
    const dur = 2000, t0 = performance.now();
    (function step(now) {
      const t = Math.min(1, (now - t0) / dur);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // pelan-cepat-pelan
      const p = path.getPointAtLength(len * e);
      if (from === LEVELS.length - 1) {
        // segmen terakhir: pelan-pelan bergeser ke tempat berlabuh di kiri tanda X
        const off = shipOffset();
        const el = document.getElementById("ship");
        el.setAttribute("transform", `translate(${p.x - 74 * e} ${p.y - off * (1 - e) + 12 * e})`);
      } else placeShip(from, p.x, p.y);
      if (t < 1) requestAnimationFrame(step); else resolve();
    })(t0);
  });
}

function setMapMessage(text) {
  const el = $("#map-msg");
  if (!el) return;
  if (text) { el.textContent = text; el.classList.remove("map-msg--pop"); void el.offsetWidth; el.classList.add("map-msg--pop"); return; }
  el.classList.remove("map-msg--pop");
  el.textContent = allDone()
    ? "Semua sandi terpecahkan! Sentuh tanda X untuk membuka peti."
    : doneCount() === 0
      ? "Pilih pulau pertama untuk mulai berlayar."
      : "Sentuh pulau yang sudah selesai untuk melihat rekam jejakmu.";
}

/** Setelah peta tampil: kalau ada level baru selesai, kapal berlayar. */
async function afterMapShown() {
  const target = currentIndex();
  if (ship.index === target) return;
  state.busy = true;
  if (target === ship.index + 1) {
    setMapMessage("Berlayar ke pulau berikutnya…");
    await sail(ship.index);
  }
  ship.index = target;
  placeShip(target);
  if (target >= LEVELS.length) {
    const chest = document.getElementById("treasure-chest");
    if (chest) chest.setAttribute("href", "#i-open-treasure-chest");
    document.querySelector(".treasure")?.classList.add("treasure--open");
    setMapMessage();
    state.busy = false;
    await sleep(900);
    showVictory();
    return;
  }
  setMapMessage();
  state.busy = false;
}

/** Sentuh pulau / peti di peta. */
function onNodeActivate(i, el) {
  if (state.busy) return;
  if (i === LEVELS.length) {
    if (allDone()) showVictory();
    else setMapMessage("Pecahkan semua sandi dulu untuk membuka peti, Kapten!");
    return;
  }
  if (!isUnlocked(i)) {
    el.classList.remove("node--shake");
    void el.getBoundingClientRect();
    el.classList.add("node--shake");
    setMapMessage(`Pulau ${i + 1} masih terkunci. Selesaikan pulau ${i} dulu!`);
    return;
  }
  if (save.levels[i].done) openRecord(i);
  else enterLevel(i, false);
}


/* -------------------------------------------------------------
   9. LAYAR GAME
   ------------------------------------------------------------- */

/** Ubah teks jadi ubin-ubin huruf, dikelompokkan per kata
    supaya kata tidak terpotong saat layar sempit (HP). */
function renderLetters(container, text) {
  container.innerHTML = "";
  text.split(" ").forEach((word) => {
    const w = document.createElement("span");
    w.className = "word";
    for (const ch of word) {
      const tile = document.createElement("span");
      tile.className = isLetter(ch) ? "tile" : "tile tile--symbol";
      tile.textContent = ch;
      w.appendChild(tile);
    }
    container.appendChild(w);
  });
}

function showFeedback(message, type) {
  const fb = $("#feedback");
  fb.textContent = message;
  fb.className = `feedback feedback--${type}`;
}

/** Satu baris hint di daftar. */
function makeHintItem(n) {
  const { label, value } = hintText(currentLevel(), n);
  const li = document.createElement("li");
  li.className = "hint";
  li.innerHTML = '<span class="hint__label"></span> <strong class="hint__value"></strong><span class="hint__cost"></span>';
  li.querySelector(".hint__label").textContent = `Petunjuk ${n + 1} · ${label}:`;
  li.querySelector(".hint__value").textContent = value;
  li.querySelector(".hint__cost").textContent = state.practice ? "" : `−${CONFIG.hintCost[n]}`;
  return li;
}

function renderHintButtons() {
  const used = hintCount();
  const allUsed = used >= CONFIG.hintCost.length;
  const hint = $("#btn-hint");
  const poor = !allUsed && !canAffordHint();
  hint.disabled = allUsed || state.solved || poor;
  $("#btn-hint-label").textContent = allUsed
    ? "Petunjuk habis"
    : poor
      ? `Koin kurang (butuh ${CONFIG.hintCost[used]})`
      : state.practice
        ? `Minta Petunjuk ${used + 1}`
        : `Minta Petunjuk ${used + 1} (−${CONFIG.hintCost[used]} koin)`;

}

/** Siapkan layar game untuk level `state.levelIndex`. */
function renderLevel() {
  const lv = currentLevel();
  state.solved = false;
  state.animating = false;
  if (state.practice) { state.practiceHints = 0; }

  $("#level-number").textContent = `Level ${state.levelIndex + 1}`;
  $("#level-title").textContent = lv.title;
  $("#badge-practice").hidden = !state.practice;
  renderStory(lv);
  renderLetters($("#cipher-text"), currentCipher());
  $("#cipher-text").classList.remove("glow");
  const input = $("#guess-input");
  input.value = "";
  input.disabled = false;
  $("#btn-guess").disabled = false;
  $("#feedback").textContent = "";
  $("#feedback").className = "feedback";
  $("#btn-next").hidden = true;

  // Hint yang sudah dibuka sebelumnya (dan sudah dibayar) tampil lagi
  const list = $("#hint-list");
  list.innerHTML = "";
  for (let n = 0; n < hintCount(); n++) list.appendChild(makeHintItem(n));
  renderHintButtons();
  renderStats();
}

/** Tampilkan cerita level (tiap elemen array = satu paragraf). */
function renderStory(lv) {
  const box = $("#story-text");
  box.innerHTML = "";
  lv.story.forEach((para, i) => {
    const p = document.createElement("p");
    p.textContent = para;
    p.style.animationDelay = `${0.15 + i * 0.35}s`;
    box.appendChild(p);
  });
}

/** Masuk ke layar game (dari peta). */
async function enterLevel(i, practice) {
  if (state.busy) return;
  state.busy = true;
  state.levelIndex = i;
  state.practice = practice;
  renderLevel();
  await transition(() => showScreen("game"));
  state.busy = false;
  if (window.matchMedia("(pointer: fine)").matches) $("#guess-input").focus();
}

/** Kembali ke peta (tombol "Kembali" atau setelah level selesai). */
async function goToMap() {
  if (state.busy || state.animating) return;
  state.busy = true;
  renderMap();
  await transition(() => showScreen("map"));
  state.busy = false;
  afterMapShown();
}

/** Buka hint berikutnya (hanya saat tombol ditekan). */
function revealHint() {
  if (state.solved || state.animating) return;
  const n = hintCount();
  if (n >= CONFIG.hintCost.length) return;
  if (!canAffordHint()) {
    showFeedback(`Koinmu kurang, Kapten. Petunjuk ini butuh ${CONFIG.hintCost[n]} koin.`, "info");
    return;
  }
  blip("hint");
  if (state.practice) state.practiceHints++;
  else {
    const rec = currentRec();
    save.score -= CONFIG.hintCost[n]; // bayar dari dompet
    rec.spent += CONFIG.hintCost[n];
    rec.hints++;
    persist();
    renderStats();
  }
  $("#hint-list").appendChild(makeHintItem(n));
  renderHintButtons();
}

/**
 * Animasi dekripsi: tiap ubin "berputar" lewat huruf acak lalu
 * berhenti di huruf pesan asli. Berurutan dari kiri ke kanan.
 */
async function animateDecrypt(plaintext) {
  const tiles = [...document.querySelectorAll("#cipher-text .tile")];
  const target = plaintext.toUpperCase().replace(/ /g, ""); // sejajar dengan ubin
  const settle = (tile, i) => {
    tile.textContent = target[i];
    tile.classList.remove("tile--spin");
    tile.classList.add("tile--solved");
  };
  if (reducedMotion()) { tiles.forEach(settle); return; }

  const gap = Math.min(70, 1500 / tiles.length); // total maksimal ±1,5 detik
  await Promise.all(tiles.map(async (tile, i) => {
    await sleep(i * gap);
    if (!isLetter(target[i])) return settle(tile, i);
    tile.classList.add("tile--spin");
    for (let f = 0; f < 8; f++) {
      tile.textContent = ABC[Math.floor(Math.random() * 26)];
      await sleep(55);
    }
    settle(tile, i);
  }));
}

/** Efek salah: kolom tebakan bergetar + ubin berkedip merah. */
function wrongEffect() {
  for (const el of [$("#guess-form"), $("#cipher-text")]) {
    el.classList.remove("shake");
    void el.offsetWidth;
    el.classList.add("shake");
  }
}

const WRONG_LINES = [
  "Arrr, salah! Coba lagi sebelum hiunya datang.",
  "Bukan itu, Kapten! Lautan masih menyimpan rahasianya.",
  "Salah arah! Kompasmu terbalik, ya?",
  "Meriam meleset! Tembak sekali lagi.",
];
let wrongCount = 0;

async function onGuess(event) {
  event.preventDefault();
  if (state.solved || state.animating) return;

  const input = $("#guess-input");
  if (!onlyLetters(input.value)) {
    showFeedback("Tulis dulu tebakanmu, Kapten!", "info");
    return;
  }

  const result = checkGuess(input.value);
  const rec = currentRec();

  // ----- Tebakan salah -----
  if (!result) {
    if (!state.practice) {
      rec.wrong++;
      persist();
      renderStats();
    }
    wrongEffect();
    playSfx("salah");
    showFeedback(
      WRONG_LINES[wrongCount++ % WRONG_LINES.length],
      "error"
    );
    return;
  }

  // ----- Kata kunci benar (belum selesai: pesan lengkap masih harus diketik) -----
  if (result === "key") {
    showFeedback(`Kata kuncinya tepat, Kapten! Sekarang pakai untuk membuka sandi, lalu ketik pesan lengkapnya.`, "success");
    playSfx("sukses");
    input.value = "";
    return;
  }

  // ----- Pesan benar -----
  const lv = currentLevel();
  const practice = state.practice;
  let reward = 0, bonus = 0;
  if (!practice) {
    reward = currentReward();
    rec.stars = starsFor(rec);
    bonus = (rec.stars - 1) * CONFIG.starBonus;
    save.score += reward + bonus;
    rec.done = true;
    rec.earned = reward;
    rec.bonus = bonus;
    persist(); // simpan segera, sebelum animasi
  }
  state.solved = true;
  state.animating = true;
  input.disabled = true;
  $("#btn-guess").disabled = true;
  renderHintButtons();
  showFeedback("Membuka segel sandi…", "info");

  await animateDecrypt(lv.plaintext);

  state.animating = false;
  renderStats(true);
  const starsNow = practice ? 0 : rec.stars;
  const what = "Pesannya";
  showFeedback(
    practice
      ? `Benar lagi! ${what} tepat. Kunci: ${lv.key}`
      : `Yo-ho-ho! ${what} benar! Kunci: ${lv.key} · +${reward} koin` + ` · ${"★".repeat(starsNow)}${"☆".repeat(3 - starsNow)}` + (bonus ? ` · bonus bintang +${bonus}` : ""),
    "success"
  );
  $("#cipher-text").classList.add("glow");
  playSfx("sukses");
  if (!practice) { burst($("#stat-score"), 16); playSfx("koin", 350); }

  const last = !practice && allDone();
  $("#btn-next-label").textContent = practice ? "Kembali ke peta" : last ? "Menuju peti harta" : "Lanjut berlayar";
  $("#btn-next").hidden = false;
  $("#btn-next").focus({ preventScroll: true });
}


/* -------------------------------------------------------------
   12. POPUP & EVENT
   ------------------------------------------------------------- */
let recordIndex = 0;

/** Rekam jejak satu level yang sudah selesai. */
function openRecord(i) {
  const r = save.levels[i], lv = LEVELS[i];
  recordIndex = i;
  $("#rec-title").textContent = `Level ${i + 1} · ${lv.title}`;
  $("#rec-message").textContent = `Pesan: “${lv.plaintext}” · Kunci: ${lv.key}`;
  $("#rec-coins").textContent = r.earned;
  $("#rec-bonus").textContent = r.bonus;
  $("#rec-stars").innerHTML = starRow(r.done ? r.stars : 0, 22);
  $("#rec-hints").textContent = `${r.hints}/${CONFIG.hintCost.length}` + (r.spent ? ` (−${r.spent} koin)` : "");
  $("#rec-wrong").textContent = r.wrong;
  $("#record").showModal();
}

function showVictory() {
  $("#final-score").textContent = save.score;
  $("#final-rank").textContent = rankFor(save.score);
  const dlg = $("#victory");
  if (!dlg.open) dlg.showModal();
  playSfx("menang");
  burst($(".victory__chest"), 30, dlg);
}

async function resetProgress() {
  save = freshSave();
  persist();
  ship.index = 0;
  wrongCount = 0;
  renderStats();
  renderMap();
}

/* Layar penuh (untuk presentasi di kelas). Tombol disembunyikan
   kalau browser tidak mendukung (mis. Safari iPhone). */
function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen().catch(() => {});
}

function closeOnBackdrop(dialog) {
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
}

function initGame() {
  runCipherTests();
  loadAudioPrefs();
  initAudio();
  save = loadSave();
  ship.index = currentIndex();
  renderStats();

  // Loading → tombol mulai
  runLoading().then(() => {
    $("#btn-start").hidden = false;
    $("#btn-start").focus();
  });
  $("#btn-start").addEventListener("click", startGame);

  // Peta: sentuh pulau (klik atau Enter/Spasi)
  const map = $("#map");
  map.addEventListener("click", (e) => {
    const g = e.target.closest("[data-node]");
    if (g) onNodeActivate(+g.dataset.node, g);
  });
  map.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const g = e.target.closest("[data-node]");
    if (g) { e.preventDefault(); onNodeActivate(+g.dataset.node, g); }
  });
  window.addEventListener("resize", () => {
    if (state.screen === "map" && !state.busy && renderedLayout !== mapLayoutKey()) renderMap();
  });

  // Game
  $("#guess-form").addEventListener("submit", onGuess);
  $("#btn-hint").addEventListener("click", revealHint);
  $("#btn-next").addEventListener("click", goToMap);
  $("#btn-back").addEventListener("click", goToMap);
  for (const el of [$("#guess-form"), $("#cipher-text")]) {
    el.addEventListener("animationend", () => el.classList.remove("shake"));
  }

  // Popup
  $("#btn-reset").addEventListener("click", () => $("#confirm").showModal());
  $("#btn-confirm-no").addEventListener("click", () => $("#confirm").close());
  $("#btn-confirm-yes").addEventListener("click", () => { $("#confirm").close(); resetProgress(); });
  $("#btn-replay").addEventListener("click", () => { $("#record").close(); enterLevel(recordIndex, true); });
  $("#btn-close-record").addEventListener("click", () => $("#record").close());
  $("#btn-close-credits").addEventListener("click", () => $("#credits").close());
  $("#btn-credits").addEventListener("click", () => $("#credits").showModal());

  // Kisah Kita: dua tab + tombol tutup
  $("#btn-lore").addEventListener("click", () => $("#lore").showModal());
  $("#btn-close-lore").addEventListener("click", () => $("#lore").close());
  document.querySelectorAll("#lore .tab").forEach((tab) => tab.addEventListener("click", () => {
    document.querySelectorAll("#lore .tab").forEach((t) => {
      const on = t === tab;
      t.classList.toggle("tab--on", on);
      t.setAttribute("aria-selected", on);
      $("#" + t.getAttribute("aria-controls")).hidden = !on;
    });
  }));
  $("#btn-victory-close").addEventListener("click", () => $("#victory").close());
  $("#btn-restart").addEventListener("click", () => { $("#victory").close(); resetProgress(); });
  ["#record", "#lore", "#credits", "#confirm", "#victory"].forEach((s) => closeOnBackdrop($(s)));

  // Suara: tombol senyap, penggeser volume, tombol M, bunyi klik
  $("#btn-mute").addEventListener("click", toggleMute);
  $("#volume").addEventListener("input", (e) => setVolume(+e.target.value));
  document.addEventListener("keydown", (e) => {
    const typing = /^(input|textarea)$/i.test(e.target.tagName) && e.target.type !== "range";
    if ((e.key === "m" || e.key === "M") && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) toggleMute();
  });
  document.addEventListener("click", (e) => {
    // tombol yang punya bunyi sendiri tidak ikut berbunyi klik
    if (e.target.closest("#btn-hint, #btn-guess, #btn-mute, #volume")) return;
    if (e.target.closest("button, .node, .treasure")) blip("klik");
  });

  // Layar penuh
  const fsBtn = $("#btn-fullscreen");
  if (!document.fullscreenEnabled) fsBtn.hidden = true;
  fsBtn.addEventListener("click", toggleFullscreen);
  document.addEventListener("fullscreenchange", () => {
    $("#btn-fullscreen-label").textContent = document.fullscreenElement ? "Keluar" : "Fullscreen";
  });
}

// Jalankan game hanya di browser (bukan saat diuji pakai Node.js)
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", initGame);
}

// Ekspor untuk pengujian otomatis di Node.js (diabaikan oleh browser)
if (typeof module !== "undefined") {
  module.exports = { encrypt, decrypt, onlyLetters, runCipherTests, LEVELS, sembunyi, buka };
}
