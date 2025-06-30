// Initialize Firebase
const db = firebase.database();

document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop();
  if (!page || page === 'index.html') initIndex();
});

async function initIndex() {
  // Load announcement
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

  // Enter room
  document.getElementById('enterRoom').onclick = async () => {
    const code = document.getElementById('roomCode').value.trim().toUpperCase();
    document.getElementById('loginError').innerText = '';
    if (!code) {
      document.getElementById('loginError').innerText = 'الرجاء إدخال الرمز';
      return;
    }
    try {
      const data = await fetch('data/codes.json').then(r => r.json());
      if (!data.codes.includes(code)) {
        document.getElementById('loginError').innerText = 'رمز غير صالح';
      } else {
        window.location = `player.html?room=${code}`;
      }
    } catch (e) {
      document.getElementById('loginError').innerText = 'خطأ في التحقق';
      console.error(e);
    }
  };
}