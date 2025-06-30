// assets/script.js

const db = firebase.database();

document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop();
  if (!page || page === 'index.html') initIndex();
  if (page === 'player.html') initPlayer();
  if (page === 'viewer.html') initViewer();
  if (page === 'admin.html') initAdmin();
});

// Index page
async function initIndex() {
  try {
    const res = await fetch('data/announcement.json');
    const ann = await res.json();
    if (ann.title) {
      document.getElementById('annTitle').innerText = ann.title;
      document.getElementById('annText').innerText = ann.text;
      document.getElementById('annLink').href = ann.url;
      document.getElementById('annButton').innerText = ann.button;
      document.getElementById('announcementCard').classList.remove('hidden');
    }
  } catch {}

  document.getElementById('enterRoom').onclick = async () => {
    const code = document.getElementById('roomCode').value.trim().toUpperCase();
    const data = await fetch('data/codes.json').then(r => r.json());
    if (!data.codes.includes(code)) {
      document.getElementById('loginError').innerText = 'رمز غير صالح';
      return;
    }
    window.location = `player.html?room=${code}`;
  };
}

// Player page
function initPlayer() {
  const params = new URLSearchParams(window.location.search);
  const room = params.get('room');
  if (!room) return alert('لا يوجد رمز غرفة');

  document.getElementById('lobby').classList.remove('hidden');
  document.getElementById('roomIdDisplay').innerText = room;

  const playersRef = db.ref(`rooms/${room}/players`);
  let name = '';
  while (!name) name = prompt('اكتب اسمك للانضمام');
  playersRef.child(name).set({ joinedAt: Date.now() });

  playersRef.on('value', snap => {
    const ul = document.getElementById('playerList');
    ul.innerHTML = '';
    const keys = [];
    snap.forEach(ch => {
      keys.push(ch.key);
      const li = document.createElement('li');
      li.innerText = ch.key;
      ul.appendChild(li);
    });
    if (keys[0] === name) {
      document.getElementById('startBtn').classList.remove('hidden');
    }
  });

  document.getElementById('inviteBtn').onclick = () => {
    const url = `${window.location.origin}/player.html?room=${room}`;
    navigator.clipboard.writeText(url);
    alert('تم نسخ رابط الدعوة');
  };

  document.getElementById('startBtn').onclick = () => {
    db.ref(`rooms/${room}/state`).set('drawing');
  };
}

// Viewer page
function initViewer() {
  const params = new URLSearchParams(window.location.search);
  const room = params.get('room');
  const canvas = document.getElementById('viewCanvas');
  const ctx = canvas.getContext('2d');
  db.ref(`rooms/${room}/drawing`).on('child_added', snap => {
    const { x, y, type } = snap.val();
    if (type === 'start') {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  });
}

// Admin page
function initAdmin() {
  let validCodes = [];
  const codesRef = 'data/codes.json';

  async function loadCodes() {
    validCodes = await fetch(codesRef).then(r => r.json()).then(d => d.codes);
    renderCodes();
  }
  function renderCodes() {
    const ul = document.getElementById('codesList');
    ul.innerHTML = '';
    validCodes.forEach(c => {
      const li = document.createElement('li');
      li.innerText = c;
      ul.appendChild(li);
    });
  }
  loadCodes();

  document.getElementById('genCodesBtn').onclick = () => {
    const type = document.getElementById('codeType').value;
    const count = parseInt(document.getElementById('codeCount').value);
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0; i < count; i++) {
      let code;
      do {
        code = type + Array.from({length:6}, () => charset[Math.floor(Math.random()*charset.length)]).join('');
      } while (validCodes.includes(code));
      validCodes.push(code);
    }
    renderCodes();
  };

  document.getElementById('copyCodesBtn').onclick = () => {
    navigator.clipboard.writeText(validCodes.join('\n'));
    alert('تم نسخ الرموز');
  };
  document.getElementById('downloadCodesBtn').onclick = () => {
    const blob = new Blob([JSON.stringify({codes:validCodes},null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'codes.json'; a.click();
    URL.revokeObjectURL(url);
  };

  document.getElementById('updateAnnBtn').onclick = () => {
    const ann = {
      title: document.getElementById('annTitleInput').value,
      text: document.getElementById('annTextInput').value,
      url: document.getElementById('annLinkInput').value,
      button: document.getElementById('annButtonInput').value
    };
    const blob = new Blob([JSON.stringify(ann,null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'announcement.json'; a.click();
    URL.revokeObjectURL(url);
  };
}