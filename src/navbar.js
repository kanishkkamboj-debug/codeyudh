// ⚔️ CODE YUDH — Hanging Battlefield HUD Navbar & Command Palette (Ctrl+K)
import { battleAudio } from './audio.js';

export function initNavbar() {
  const navLinks = document.querySelectorAll('.hud-nav .hud-link');
  const mobileToggle = document.getElementById('hud-mobile-toggle');
  const hudNav = document.getElementById('hud-nav');
  const searchBtn = document.getElementById('hud-search-btn');
  const searchModal = document.getElementById('battle-search-modal');
  const searchInput = document.getElementById('battle-search-input');
  const searchResults = document.getElementById('search-results-container');
  const searchClose = document.getElementById('search-modal-close');

  // 1. Smooth Scroll Navigation for Top Bar Links
  const hudLogo = document.querySelector('.hud-logo');
  if (hudLogo) {
    hudLogo.addEventListener('click', (e) => {
      e.preventDefault();
      battleAudio.playSlash();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      const targetEl = document.querySelector(href);
      if (targetEl) {
        if (hudNav) hudNav.classList.remove('mobile-open');
        if (mobileToggle) mobileToggle.classList.remove('active');

        battleAudio.playSlash();

        const navbar = document.querySelector('.top-hud-bar');
        const navbarHeight = navbar ? navbar.offsetHeight + 18 : 60;
        const targetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: 'smooth'
        });

        // Set active immediately for fast feedback
        navLinks.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });

  // 2. Mobile Menu Toggle
  if (mobileToggle && hudNav) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      hudNav.classList.toggle('mobile-open');
      mobileToggle.classList.toggle('active');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!hudNav.contains(e.target) && !mobileToggle.contains(e.target)) {
        hudNav.classList.remove('mobile-open');
        mobileToggle.classList.remove('active');
      }
    });
  }

  // 3. Scroll Spy — Dynamic Active Pill Highlight
  const sections = [
    { id: 'about-section', selector: 'a[href="#about-section"]' },
    { id: 'scrolls-anchor', selector: 'a[href="#scrolls-anchor"]' },
    { id: 'battlefields-section', selector: 'a[href="#battlefields-section"]' },
    { id: 'arsenal-section', selector: 'a[href="#arsenal-section"]' },
    { id: 'chronicle-section', selector: 'a[href="#chronicle-section"]' },
    { id: 'faq-section', selector: 'a[href="#faq-section"]' }
  ];

  const updateActiveNav = () => {
    const scrollPos = window.scrollY + 200;
    let currentId = '';

    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i].id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.pageYOffset;
        if (top <= scrollPos) {
          currentId = sections[i].id;
          break;
        }
      }
    }

    if (!currentId && sections.length > 0) {
      currentId = sections[0].id;
    }

    navLinks.forEach((link) => {
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // 3. Search Index Database
  const battleIndex = [
    {
      title: 'The Battle Mission',
      desc: '24-Hour Hybrid Hackathon Overview & Details',
      category: 'Overview',
      icon: '<svg class="inline-icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
      target: '#about-section'
    },
    {
      title: 'Day 01: The Call to Battle',
      desc: 'Online PPT Proposal Screening & Judgement Criteria',
      category: 'Scrolls',
      icon: '<svg class="inline-icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
      target: '#scrolls-anchor',
      action: () => {
        const el = document.getElementById('scrolls-anchor');
        if (el) window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
      }
    },
    {
      title: 'Day 02: The Grand Arena',
      desc: '24-Hour Offline Hackathon, Live Stations & Mentorship',
      category: 'Scrolls',
      icon: '<svg class="inline-icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      target: '#scrolls-anchor',
      action: () => {
        const el = document.getElementById('scrolls-anchor');
        if (el) window.scrollTo({ top: el.offsetTop + (el.offsetHeight - window.innerHeight) * 0.9, behavior: 'smooth' });
      }
    },
    {
      title: 'AI & Intelligence Frontier',
      desc: 'Autonomous Agents, LLMs & Deep Learning Track',
      category: 'Track 01',
      icon: '<svg class="inline-icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/></svg>',
      target: '#battlefields-section'
    },
    {
      title: 'Web3 & Decentralized Citadel',
      desc: 'Smart Contracts, DeFi, Zero-Knowledge & Blockchain Track',
      category: 'Track 02',
      icon: '<svg class="inline-icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
      target: '#battlefields-section'
    },
    {
      title: 'FinTech & Algorithmic Bastion',
      desc: 'High-Frequency Systems, Fraud Detection & Payments Track',
      category: 'Track 03',
      icon: '<svg class="inline-icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
      target: '#battlefields-section'
    },
    {
      title: 'Cyber Warfare & Defense',
      desc: 'Zero-Trust, Threat Hunting & Secure Infrastructure Track',
      category: 'Track 04',
      icon: '<svg class="inline-icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
      target: '#battlefields-section'
    },
    {
      title: 'HealthTech & Bio-Cybernetics',
      desc: 'AI Diagnostics, Medical IoT & Wearable Health Track',
      category: 'Track 05',
      icon: '<svg class="inline-icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 5v14"/></svg>',
      target: '#battlefields-section'
    },
    {
      title: 'Open Innovation Realm',
      desc: 'Disruptive Software Breakthroughs & Wildcard Ideas',
      category: 'Track 06',
      icon: '<svg class="inline-icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
      target: '#battlefields-section'
    },
    {
      title: 'Weapons Arsenal & Tech Stack',
      desc: 'TensorFlow, Next.js, PyTorch, Solidity, Rust & Docker',
      category: 'Arsenal',
      icon: '<svg class="inline-icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
      target: '#arsenal-section'
    },
    {
      title: 'Chronicle & Timeline',
      desc: 'Registration Deadline, PPT Review & Final 24h Schedule',
      category: 'Timeline',
      icon: '<svg class="inline-icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      target: '#chronicle-section'
    },
    {
      title: 'War Tablets & Rules (FAQ)',
      desc: 'Eligibility, Team Composition (3-4 Members) & Logistics',
      category: 'FAQ',
      icon: '<svg class="inline-icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      target: '#faq-section'
    },
    {
      title: 'Register Squad — Enter Battle',
      desc: 'Register your 3–4 warrior squad for Code Yudh',
      category: 'Action',
      icon: '<svg class="inline-icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>',
      target: null,
      action: () => {
        const regModal = document.getElementById('reg-modal');
        if (regModal) regModal.classList.add('active');
      }
    }
  ];

  let selectedIndex = 0;
  let currentFiltered = [...battleIndex];

  const renderResults = (items) => {
    if (!searchResults) return;
    currentFiltered = items;
    selectedIndex = 0;

    if (items.length === 0) {
      searchResults.innerHTML = `
        <div class="search-empty">
          <span><svg class="inline-icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span> No matching battle artifacts found.
        </div>
      `;
      return;
    }

    searchResults.innerHTML = items
      .map(
        (item, idx) => `
        <div class="search-result-item ${idx === 0 ? 'selected' : ''}" data-index="${idx}">
          <div class="search-item-icon">${item.icon}</div>
          <div class="search-item-info">
            <div class="search-item-title">${item.title}</div>
            <div class="search-item-desc">${item.desc}</div>
          </div>
          <div class="search-item-badge">${item.category}</div>
        </div>
      `
      )
      .join('');

    // Attach click listeners to items
    const renderedItems = searchResults.querySelectorAll('.search-result-item');
    renderedItems.forEach((el) => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-index'), 10);
        executeItem(currentFiltered[idx]);
      });
      el.addEventListener('mouseenter', () => {
        renderedItems.forEach((r) => r.classList.remove('selected'));
        el.classList.add('selected');
        selectedIndex = parseInt(el.getAttribute('data-index'), 10);
      });
    });
  };

  const executeItem = (item) => {
    if (!item) return;
    closeSearch();
    battleAudio.playSlash();

    if (item.action) {
      item.action();
    }

    if (item.target) {
      const el = document.querySelector(item.target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const openSearch = () => {
    if (!searchModal) return;
    searchModal.classList.add('active');
    battleAudio.playWhoosh();
    renderResults(battleIndex);
    if (searchInput) {
      searchInput.value = '';
      setTimeout(() => searchInput.focus(), 50);
    }
  };

  const closeSearch = () => {
    if (!searchModal) return;
    searchModal.classList.remove('active');
  };

  // Keyboard shortcut listener: CTRL + K or CMD + K
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if (searchModal && searchModal.classList.contains('active')) {
        closeSearch();
      } else {
        openSearch();
      }
    }

    if (e.key === 'Escape' && searchModal && searchModal.classList.contains('active')) {
      closeSearch();
    }

    // Modal Arrow keys navigation
    if (searchModal && searchModal.classList.contains('active')) {
      const renderedItems = searchResults ? searchResults.querySelectorAll('.search-result-item') : [];
      if (!renderedItems.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % renderedItems.length;
        renderedItems.forEach((r, idx) => {
          r.classList.toggle('selected', idx === selectedIndex);
        });
        renderedItems[selectedIndex]?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + renderedItems.length) % renderedItems.length;
        renderedItems.forEach((r, idx) => {
          r.classList.toggle('selected', idx === selectedIndex);
        });
        renderedItems[selectedIndex]?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executeItem(currentFiltered[selectedIndex]);
      }
    }
  });

  // Search input filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (!query) {
        renderResults(battleIndex);
        return;
      }

      const filtered = battleIndex.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.desc.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
      );
      renderResults(filtered);
    });
  }

  // Search trigger buttons
  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openSearch();
    });
  }

  if (searchClose) {
    searchClose.addEventListener('click', closeSearch);
  }

  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) {
        closeSearch();
      }
    });
  }
}
