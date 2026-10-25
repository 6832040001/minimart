/* ===================================================================
   BELL MINI MART - Interactive Logic & UI Controller
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileMenu();
  initFlashCountdown();
  initPromoFilter();
  initBranchTabs();
  initStoreStatus();
  initContactForm();
  initDeployUrlHelper();
});

/* -------------------------------------------------------------------
   1. Theme Toggle (Dark / Light Mode)
   ------------------------------------------------------------------- */
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (!themeBtn) return;

  const savedTheme = localStorage.getItem('bell_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(themeBtn, savedTheme);

  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('bell_theme', newTheme);
    updateThemeIcon(themeBtn, newTheme);
    showToast(`เปลี่ยนเป็นโหมด ${newTheme === 'dark' ? 'มืด (Dark Mode)' : 'สว่าง (Light Mode)'} เรียบร้อยแล้ว`);
  });
}

function updateThemeIcon(btn, theme) {
  btn.innerHTML = theme === 'dark' 
    ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'
    : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
}

/* -------------------------------------------------------------------
   2. Mobile Navigation Menu
   ------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');
  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('show');
    });
  });
}

/* -------------------------------------------------------------------
   3. Flash Sale Countdown Timer
   ------------------------------------------------------------------- */
function initFlashCountdown() {
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');
  if (!hoursEl || !minsEl || !secsEl) return;

  // Set target to end of today or 18 hours ahead
  let targetTime = new Date();
  targetTime.setHours(23, 59, 59, 999);

  function update() {
    const now = new Date();
    let diff = targetTime - now;

    if (diff <= 0) {
      targetTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
      diff = targetTime - now;
    }

    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(mins).padStart(2, '0');
    secsEl.textContent = String(secs).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* -------------------------------------------------------------------
   4. Promotion Category Filter
   ------------------------------------------------------------------- */
function initPromoFilter() {
  const tabs = document.querySelectorAll('.promo-tabs .tab-btn');
  const cards = document.querySelectorAll('.promo-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* -------------------------------------------------------------------
   5. Branch Tabs & Interactive Map Switcher
   ------------------------------------------------------------------- */
const branchMapUrls = {
  branch1: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.610813735706!2d100.55938477590867!3d13.741999997576575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29ee15e61298d%3A0xea28a2a829da49a4!2zQXNva2UgU3VraHVtdml0IDIxLCDguIHguKPguLjguIfguYDguJfguJ7guKHguKvguLLguJnguITguKM!5e0!3m2!1sth!2sth!4v1700000000000!5m2!1sth!2sth",
  branch2: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3874.5292671043743!2d100.55959147590978!3d13.816223795123985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29cfbc355aaab%3A0xb3e6488d08cb5f44!2z4Lir4LmJ4Liy4LmA4Lii4LiB4Lil4Liy4LiU4Lie4Lij4LmJ4Liy4LinLCDguIHguKPguLjguIfguYDguJfguJ7guKHguKvguLLguJnguITguKM!5e0!3m2!1sth!2sth!4v1700000000001!5m2!1sth!2sth",
  branch3: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3877.065839215015!2d100.67843817590697!3d13.64696119965384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d5fe6b7ee72f7%3A0xb9ceb9b187515152!2zTWVnYSBCYW5nbmEsIOC4luC4meC4meC4muC4suC4h-C4meC4suC4leC4o-C4suC4lCDguKrguKHguXguKPguJvguKPguLDguIHguLLguKM!5e0!3m2!1sth!2sth!4v1700000000002!5m2!1sth!2sth"
};

const branchNames = {
  branch1: "สาขาที่ 1: อโศก - สุขุมวิท 21 (BTS อโศก)",
  branch2: "สาขาที่ 2: แยกลาดพร้าว (ตรงข้ามเซ็นทรัลลาดพร้าว)",
  branch3: "สาขาที่ 3: บางนา - เมกา (กม.8)"
};

function initBranchTabs() {
  const branchPills = document.querySelectorAll('.branch-pill');
  const branchCards = document.querySelectorAll('.branch-card');
  const mapIframe = document.getElementById('map-iframe');
  const mapTitle = document.getElementById('current-map-title');

  branchPills.forEach(pill => {
    pill.addEventListener('click', () => {
      branchPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const targetBranch = pill.getAttribute('data-branch');

      // Highlight the targeted branch card
      branchCards.forEach(card => {
        if (card.id === targetBranch) {
          card.style.transform = 'translateY(-8px) scale(1.02)';
          card.style.borderColor = 'var(--primary)';
          card.style.boxShadow = 'var(--shadow-hover)';
        } else {
          card.style.transform = 'none';
          card.style.borderColor = 'var(--border-color)';
          card.style.boxShadow = 'var(--shadow-md)';
        }
      });

      // Update Map Iframe
      if (mapIframe && branchMapUrls[targetBranch]) {
        mapIframe.src = branchMapUrls[targetBranch];
      }
      if (mapTitle && branchNames[targetBranch]) {
        mapTitle.textContent = branchNames[targetBranch];
      }

      showToast(`แสดงตำแหน่งแผนที่: ${branchNames[targetBranch]}`);
    });
  });
}

/* -------------------------------------------------------------------
   6. Live Store Hours Status (เวลาเปิด-ปิดตามเวลาจริง)
   ------------------------------------------------------------------- */
function initStoreStatus() {
  const branch2Status = document.getElementById('b2-status');
  if (!branch2Status) return;

  const now = new Date();
  const currentHour = now.getHours();

  // Branch 2 is open 06:00 - 24:00 (Open when hour >= 6 and < 24)
  const isOpen = currentHour >= 6 && currentHour < 24;

  if (isOpen) {
    branch2Status.className = 'status-pill open';
    branch2Status.innerHTML = '<span class="pulse-dot"></span> ขณะนี้เปิดให้บริการ (ปิด 24:00 น.)';
  } else {
    branch2Status.className = 'status-pill';
    branch2Status.style.background = '#fee2e2';
    branch2Status.style.color = '#b91c1c';
    branch2Status.innerHTML = '🔴 ขณะนี้ปิดให้บริการ (เปิด 06:00 น.)';
  }
}

/* -------------------------------------------------------------------
   7. Contact Form Handler
   ------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('cf-name').value.trim();
    const phone = document.getElementById('cf-phone').value.trim();
    const branch = document.getElementById('cf-branch').value;
    const message = document.getElementById('cf-message').value.trim();

    if (!name || !phone || !message) {
      showToast('⚠️ กรุณากรอกชื่อ เบอร์โทรศัพท์ และข้อความให้ครบถ้วน');
      return;
    }

    // Success response
    showToast(`✅ ขอบคุณคุณ ${name}! ระบบได้รับข้อความแล้ว สาขา ${branch} จะติดต่อกลับโดยเร็ว`);
    form.reset();
  });
}

/* -------------------------------------------------------------------
   8. Deploy Helper (Interactive GitHub Pages URL Generator)
   ------------------------------------------------------------------- */
function initDeployUrlHelper() {
  const input = document.getElementById('gh-username-input');
  const urlDisplay = document.getElementById('gh-pages-url');
  const copyBtn = document.getElementById('copy-url-btn');
  const openBtn = document.getElementById('open-url-btn');

  if (!input || !urlDisplay) return;

  function updateUrl() {
    const username = input.value.trim().toLowerCase() || 'your-username';
    const finalUrl = `https://${username}.github.io/minimart/`;
    urlDisplay.textContent = finalUrl;
    if (openBtn) {
      openBtn.href = finalUrl;
    }
  }

  input.addEventListener('input', updateUrl);

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const url = urlDisplay.textContent;
      navigator.clipboard.writeText(url).then(() => {
        showToast('📋 คัดลอก GitHub Pages URL สำเร็จ!');
      });
    });
  }
}

/* -------------------------------------------------------------------
   9. Helper: Show Toast Notification
   ------------------------------------------------------------------- */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Global helper for copy buttons
window.copyText = function(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`📋 คัดลอก ${label} (${text}) เรียบร้อยแล้ว`);
  });
};
