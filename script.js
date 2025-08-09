document.addEventListener('DOMContentLoaded', () => {
  const contactButton = document.getElementById('viewContactBtn');
  const contactModal = new bootstrap.Modal('#contactModal');
  const copyBtn = document.getElementById('copyEmail');
  const emailLink = document.getElementById('emailLink');
  const yearEl = document.getElementById('year');
  const themeToggle = document.getElementById('themeToggle');
  const skillsWrap = document.getElementById('skills');

  const skills = ['C#', 'C++', 'Python', 'Unity', 'Unreal Engine'];
  skillsWrap.innerHTML = skills.map(s => `<span class="badge skill">${s}</span>`).join('');

  yearEl.textContent = `© ${new Date().getFullYear()}`;
  contactButton.addEventListener('click', () => contactModal.show());

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(emailLink.textContent.trim());
      copyBtn.innerHTML = '<i class="bi bi-check2"></i>';
      setTimeout(() => (copyBtn.innerHTML = '<i class="bi bi-clipboard"></i>'), 1200);
    } catch {
      alert('Copy failed.');
    }
  });

  // ---- Bootstrap Color Mode (ใช้ data-bs-theme ที่ <html>)
  const root = document.documentElement; // <html>
  const saved = localStorage.getItem('theme'); // 'light' | 'dark' | null
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    root.setAttribute('data-bs-theme', 'dark');
  } else {
    root.setAttribute('data-bs-theme', 'light');
  }

  themeToggle.addEventListener('click', () => {
    const now = root.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-bs-theme', now);
    localStorage.setItem('theme', now);
  });
});
// ===== Background carousel + thumbnails (ต่อท้ายไฟล์ ไม่ยุ่งของเดิม) =====
(() => {
  const slides = [
    { title: 'Shaman The Mantra World', src: 'Images/ShamanTheMantraWorld.png' },
    { title: 'Stardust Little Witch',   src: 'Images/StardustLittleWitch.png' }
  ];

  const carouselEl = document.getElementById('bgCarousel');
  if (!carouselEl || slides.length === 0) return;

  const inner = carouselEl.querySelector('.carousel-inner');
  const gameTitle = document.getElementById('gameTitle');

  // สร้างสไลด์เป็นพื้นหลังเต็มจอ
  inner.innerHTML = slides.map((s, i) => `
    <div class="carousel-item ${i === 0 ? 'active' : ''}" data-index="${i}">
      <div class="bg-slide" style="background-image:url('${s.src}')"></div>
    </div>
  `).join('');

  // Bootstrap carousel
  const carousel = new bootstrap.Carousel(carouselEl, { interval: 7000, ride: true, touch: true, pause: false });

  // ตั้งชื่อเกมเริ่มต้น
  gameTitle.textContent = slides[0]?.title || '';

  // Thumbnails
  const track = document.getElementById('thumbTrack');
  track.innerHTML = slides.map((s, i) => `
    <button class="thumb ${i===0?'active':''}" type="button" role="tab" aria-label="Show slide ${i+1}" data-goto="${i}">
      <img src="${s.src}" alt="${s.title}">
    </button>
  `).join('');

  track.addEventListener('click', (e) => {
    const btn = e.target.closest('.thumb');
    if (!btn) return;
    carousel.to(Number(btn.dataset.goto));
  });

  // sync title + active thumb เมื่อสไลด์เปลี่ยน
  function highlightThumb(i){ [...track.children].forEach((el, idx)=>el.classList.toggle('active', idx===i)); }
  function ensureThumbInView(i){
    const el = track.children[i]; if(!el) return;
    const r = el.getBoundingClientRect(), t = track.getBoundingClientRect();
    if (r.left < t.left) track.scrollBy({ left: r.left - t.left - 8, behavior: 'smooth' });
    else if (r.right > t.right) track.scrollBy({ left: r.right - t.right + 8, behavior: 'smooth' });
  }

  carouselEl.addEventListener('slid.bs.carousel', (e) => {
    const idx = e.to ?? [...carouselEl.querySelectorAll('.carousel-item')].findIndex(x => x.classList.contains('active'));
    gameTitle.textContent = slides[idx]?.title || '';
    highlightThumb(idx);
    ensureThumbInView(idx);
  });

  // ปุ่มเลื่อนแถบรูปย่อ
  document.getElementById('thumbPrev').addEventListener('click', () => track.scrollBy({ left: -220, behavior: 'smooth' }));
  document.getElementById('thumbNext').addEventListener('click', () => track.scrollBy({ left:  220, behavior: 'smooth' }));
})();
