// ========== Smooth Scroll ==========
document.querySelectorAll('.smooth-scroll').forEach(anchor => {
  if (anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
        // إغلاق وضع التركيز إن وُجد
        document.querySelector('.focus-overlay')?.remove();
      }
    });
  }
});

// ========== Floating CTA ==========
const floatingCTA = document.getElementById('floatingCTA');
const footer = document.querySelector('.footer');

if (floatingCTA && footer) {
  window.addEventListener('scroll', () => {
    const footerTop = footer.offsetTop;
    const ctaHeight = floatingCTA.offsetHeight;
    const scrollBottom = window.scrollY + window.innerHeight;
    
    // إذا كان أسفل الصفحة قريب من الفوتر
    if (scrollBottom > footerTop - 200) {
      floatingCTA.style.opacity = '0';
      floatingCTA.style.pointerEvents = 'none';
    }
    // إذا كان المستخدم في منتصف الصفحة (ليس قريبًا من الأعلى أو الفوتر)
    else if (window.scrollY > 600) {
      floatingCTA.style.opacity = '1';
      floatingCTA.style.pointerEvents = 'auto';
    }
    // إذا كان في الأعلى
    else {
      floatingCTA.style.opacity = '0';
      floatingCTA.style.pointerEvents = 'none';
    }
  });
}

// ========== تأثير الهيدر ==========
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.08)';
    } else {
      header.style.boxShadow = 'none';
    }
  });
}

// ========== التفاعل على البطاقات ==========
document.querySelectorAll('.interactive-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const angleY = (x - centerX) / 20;
    const angleX = (centerY - y) / 20;
    card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.03, 1.03, 1.03)`;
    
    const light = document.createElement('div');
    light.classList.add('card-light');
    light.style.position = 'absolute';
    light.style.top = '0';
    light.style.left = '0';
    light.style.width = '100%';
    light.style.height = '100%';
    light.style.borderRadius = 'inherit';
    light.style.pointerEvents = 'none';
    light.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(110, 231, 183, 0.25), transparent 80%)`;
    card.style.overflow = 'hidden';
    card.style.position = 'relative';
    const oldLight = card.querySelector('.card-light');
    if (oldLight) oldLight.remove();
    card.appendChild(light);
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    const light = card.querySelector('.card-light');
    if (light) light.remove();
  });
});

// ========== Scroll Indicators ==========
// Top Indicator
function updateScrollIndicators() {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  
  const indicator = document.querySelector('.scroll-indicator');
  if (indicator) indicator.style.width = scrollPercent + '%';
  
  const percentBadge = document.querySelector('.scroll-percent');
  if (percentBadge) percentBadge.textContent = Math.min(100, Math.round(scrollPercent)) + '%';
}

// Side Indicator
window.addEventListener('scroll', () => {
  const sideIndicator = document.querySelector('.scroll-side-indicator');
  if (sideIndicator) {
    const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    sideIndicator.style.opacity = 0.3 + (scrollPercent * 0.7);
  }
});

window.addEventListener('scroll', updateScrollIndicators);
window.addEventListener('resize', updateScrollIndicators);
document.addEventListener('DOMContentLoaded', updateScrollIndicators);

// ========== Custom Cursor ==========
if (!window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 900px)').matches) {
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  const follower = document.createElement('div');
  follower.className = 'custom-cursor follower';
  document.body.appendChild(cursor);
  document.body.appendChild(follower);
  
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    follower.style.left = e.clientX + 'px';
    follower.style.top = e.clientY + 'px';
  });
  
  document.querySelectorAll('a, button, .interactive-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
      cursor.style.opacity = '1';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.opacity = '0.7';
    });
  });
}

// ========== Stats Animation ==========
function animateStats() {
  const stats = document.querySelectorAll('.stat-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const item = entry.target;
        const target = parseFloat(item.getAttribute('data-target'));
        const duration = parseInt(item.getAttribute('data-duration')) || 2000;
        const statNumber = item.querySelector('.stat-number');
        let start = null;
        const step = (timestamp) => {
          if (!start) start = timestamp;
          const progress = timestamp - start;
          const percentage = Math.min(progress / duration, 1);
          const easeOut = 1 - Math.pow(1 - percentage, 3);
          const value = target * easeOut;
          if (target % 1 === 0) {
            statNumber.textContent = Math.round(value);
          } else {
            statNumber.textContent = value.toFixed(1);
          }
          if (progress < duration) {
            requestAnimationFrame(step);
          }
        };
        requestAnimationFrame(step);
        observer.unobserve(item);
      }
    });
  }, { threshold: 0.3 });
  stats.forEach(stat => observer.observe(stat));
}

// ========== Gallery Lightbox ==========
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const src = item.getAttribute('data-src');
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <span class="lightbox-close">&times;</span>
      <img src="${src}" alt="صورة مكبرة">
    `;
    document.body.appendChild(lightbox);
    setTimeout(() => lightbox.classList.add('active'), 10);
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
      lightbox.classList.remove('active');
      setTimeout(() => document.body.removeChild(lightbox), 300);
    });
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        setTimeout(() => document.body.removeChild(lightbox), 300);
      }
    });
  });
});

// ========== Contact Form ==========
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('تم إرسال رسالتك! سنرد عليك قريبًا.', 'success');
    contactForm.reset();
  });
}

// ========== Chat Widget ==========
const chatToggle = document.getElementById('chatToggle');
const chatBox = document.getElementById('chatBox');
const closeChat = document.getElementById('closeChat');
const chatInput = document.getElementById('chatInput');
const sendChat = document.getElementById('sendChat');
const chatMessages = document.getElementById('chatMessages');

if (chatToggle) {
  chatToggle.addEventListener('click', () => {
    chatBox.classList.toggle('active');
  });
  closeChat.addEventListener('click', () => {
    chatBox.classList.remove('active');
  });
  sendChat.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
}

function sendMessage() {
  const text = chatInput.value.trim();
  if (text) {
    addMessage(text, 'user');
    chatInput.value = '';
    setTimeout(() => {
      const responses = [
        'شكرًا لرسالتك! فريق الدعم سيتواصل معك قريبًا.',
        'هل لديك أي سؤال آخر؟',
        'نقدر تواصلك معنا!'
      ];
      addMessage(responses[Math.floor(Math.random() * responses.length)], 'bot');
    }, 1000);
  }
}

function addMessage(text, sender) {
  const msg = document.createElement('div');
  msg.className = `message ${sender}`;
  msg.textContent = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ========== Toasts ==========
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 3000);
}

const toastStyle = document.createElement('style');
toastStyle.textContent = `
  .toast {
    position: fixed;
    bottom: 90px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    color: white;
    font-family: 'Tajawal', sans-serif;
    font-weight: 600;
    z-index: 9999;
    opacity: 1;
    transition: opacity 0.3s;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
  .toast-success { background: var(--accent); }
  .toast-error { background: #ef4444; }
  .toast-info { background: #3b82f6; }
`;
document.head.appendChild(toastStyle);

// ========== Focus Mode ==========
document.querySelectorAll('.focus-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const sectionId = btn.getAttribute('data-section');
    const section = document.getElementById(sectionId);
    if (!section) return;
    const clone = section.cloneNode(true);
    clone.className = 'focused-section';
    const overlay = document.createElement('div');
    overlay.className = 'focus-overlay';
    overlay.appendChild(clone);
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });
    const closeOnEsc = (e) => {
      if (e.key === 'Escape') {
        overlay.remove();
        document.removeEventListener('keydown', closeOnEsc);
      }
    };
    document.addEventListener('keydown', closeOnEsc);
  });
});

// ========== Presentation Mode ==========
let presentationInterval = null;
const sections = [
  '.hero',
  '#features',
  '#gallery',
  '#stats',
  '#testimonials',
  '#pricing',
  '#faq',
  '#signup',
  '#contact' ,
  '.footer'
];let currentSectionIndex = 0;

document.getElementById('presentationBtn')?.addEventListener('click', () => {
  const btn = document.getElementById('presentationBtn');
  if (presentationInterval) {
    clearInterval(presentationInterval);
    presentationInterval = null;
    btn.classList.remove('playing');
    btn.innerHTML = '<i class="fas fa-play-circle"></i>';
  } else {
    btn.classList.add('playing');
    btn.innerHTML = '<i class="fas fa-pause-circle"></i>';
    presentNextSection();
    presentationInterval = setInterval(presentNextSection, 5000);
  }
});

function presentNextSection() {
  const target = document.querySelector(sections[currentSectionIndex]);
  if (target) {
    window.scrollTo({
      top: target.offsetTop - 80,
      behavior: 'smooth'
    });
    currentSectionIndex = (currentSectionIndex + 1) % sections.length;
  }
}

// ========== Keyboard Navigation ==========
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    window.scrollBy({ top: -window.innerHeight * 0.8, behavior: 'smooth' });
  } else if (e.key === 'c' || e.key === 'C') {
    e.preventDefault();
    document.getElementById('chatBox')?.classList.toggle('active');
  } else if (e.key === 'p' || e.key === 'P') {
    e.preventDefault();
    document.getElementById('presentationBtn')?.click();
  } else if (e.key === 'Escape') {
    document.querySelector('.focus-overlay')?.remove();
    document.getElementById('chatBox')?.classList.remove('active');
  }
});

// ========== Live Stats ==========
function updateLiveStats() {
  const visitors = document.getElementById('visitorsCount');
  const rating = document.getElementById('rating');
  if (visitors) {
    const count = Math.floor(Math.random() * 31) + 20;
    visitors.textContent = count;
  }
  if (rating) {
    const r = 95 + Math.floor(Math.random() * 5);
    rating.textContent = r + '%';
  }
}
setInterval(updateLiveStats, 8000);
updateLiveStats();

// ========== PWA ==========
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(console.error);
  });
}

// ========== Theme Toggle ==========
const themeToggle = document.getElementById('themeToggle');
const themeColorMeta = document.querySelector('meta[name="theme-color"]');

function initTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  const icon = themeToggle?.querySelector('i');
  if (icon) {
    icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
  }
  if (themeColorMeta) {
    themeColorMeta.setAttribute('content', isDark ? '#0f172a' : '#fdfdfd');
  }
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    const icon = themeToggle.querySelector('i');
    if (icon) {
      icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    }
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', isDark ? '#0f172a' : '#fdfdfd');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('theme')) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }
  } else if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
  }
  initTheme();
  animateStats();
});

// ========== Leaflet Map ==========
if (document.getElementById('map')) {
  // تأجيل التنفيذ حتى يكتمل التحميل
  setTimeout(() => {
    const map = L.map('map').setView([24.7136, 46.6753], 13); // الرياض
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    L.marker([24.7136, 46.6753]).addTo(map)
      .bindPopup('مكتبنا في قلب الرياض')
      .openPopup();
  }, 100);
}