// Variabel Status Game AU
let affectionLevel = 50;

// Update Jam Realtime HP
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('clock').innerText = `${hours}:${minutes}`;
}
setInterval(updateClock, 1000);
updateClock();

const chatBody = document.getElementById('chatBody');
const interactiveArea = document.getElementById('interactiveArea');
const typingIndicator = document.getElementById('typingIndicator');

// Efek Suara Sederhana dengan Web Audio API
function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'send') {
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'receive') {
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    }
  } catch (e) {
    // Abaikan error audio jika browser memblokir autoplays
  }
}

// Fungsi Kirim Pesan dari Player
function sendMessage(text, choiceId) {
  playSound('send');
  appendMessage(text, 'me');

  // Sembunyikan pilihan
  interactiveArea.style.display = 'none';

  // Tampilkan indikator mengetik
  setTimeout(() => {
    typingIndicator.style.display = 'flex';
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 600);

  // Simulasi balasan dari karakter AU
  setTimeout(() => {
    typingIndicator.style.display = 'none';
    handleReply(choiceId);
  }, 2200);
}

function appendMessage(text, sender) {
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}`;
  msgDiv.innerHTML = `${text}<div class="time-stamp">${time}</div>`;
  
  chatBody.appendChild(msgDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Menampilkan Popup Notifikasi HP
function showNotification(text) {
  const banner = document.getElementById('notifBanner');
  document.getElementById('notifText').innerText = text;
  banner.classList.add('show');
  setTimeout(() => {
    banner.classList.remove('show');
  }, 3000);
}

// Update Meteran Affection
function updateAffection(change) {
  affectionLevel = Math.max(0, Math.min(100, affectionLevel + change));
  document.getElementById('affectionFill').style.width = `${affectionLevel}%`;
  document.getElementById('affectionText').innerText = `${affectionLevel}%`;
}

// Alur Cerita AU Interaktif
function handleReply(choiceId) {
  playSound('receive');

  if (choiceId === 1) {
    updateAffection(10);
    appendMessage('Pelan-pelan aja, gak usah buru-buru. Aku udah pesenin Hot Americano kesukaan kamu kok ☕☺️', 'other');
    showNotification('Jimin: Pelan-pelan aja, gak usah buru-buru...');
    
    setTimeout(() => {
      showNewChoices([
        { text: 'Aww makasih ya! 5 menit lagi nyampe.', id: 3 },
        { text: 'Jangan lupa pesen Croffle-nya juga!', id: 4 }
      ]);
    }, 1200);

  } else if (choiceId === 2) {
    updateAffection(15);
    appendMessage('Lho, udah nyampe?! Aku di lantai 2 dekat jendela, yang pakai coat hitam! Sini naik 🖐️', 'other');
    showNotification('Jimin: Aku di lantai 2 dekat jendela...');

    setTimeout(() => {
      showNewChoices([
        { text: 'Oke, aku jalan ke atas sekarang!', id: 5 },
        { text: 'Tunggu di situ, jangan kabur!', id: 6 }
      ]);
    }, 1200);

  } else if (choiceId === 3 || choiceId === 5) {
    updateAffection(10);
    appendMessage('Siap! Aku udah ngeliat kamu dari atas nih. Ditunggu ya ❤️', 'other');

  } else if (choiceId === 4 || choiceId === 6) {
    updateAffection(5);
    appendMessage('Haha iya-iya tenang aja, udah aku pesenin semuanya. Langsung ke sini ya!', 'other');
  }
}

// Menampilkan Opsi Pilihan Baru
function showNewChoices(options) {
  interactiveArea.innerHTML = '';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerText = opt.text;
    btn.onclick = () => sendMessage(opt.text, opt.id);
    interactiveArea.appendChild(btn);
  });
  interactiveArea.style.display = 'flex';
}

// Reset Storyline AU
function resetStory() {
  affectionLevel = 50;
  document.getElementById('affectionFill').style.width = '50%';
  document.getElementById('affectionText').innerText = '50%';
  
  chatBody.innerHTML = `
    <div class="message other">
      Kamu udah nyampe Hongdae belum? Aku udah nunggu di café biasa nih ☕
      <div class="time-stamp">19:00</div>
    </div>
  `;

  showNewChoices([
    { text: '1. "Bentar lagi nyampe! Macet banget..."', id: 1 },
    { text: '2. "Aku udah di depan! Kamu di mana?"', id: 2 }
  ]);
}
