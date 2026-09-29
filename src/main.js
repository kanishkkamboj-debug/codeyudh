// ⚔️ CODE YUDH: Master Application Entry Point
import './style.css';
import confetti from 'canvas-confetti';
import { battleAudio } from './audio.js';
import { SwordCursor } from './swordCursor.js';
import { BattleScene3D } from './battleScene3D.js';
import { ScrollManager } from './scrollManager.js';
import { initNavbar } from './navbar.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize 3D WebGL Background
  const battleScene = new BattleScene3D('three-canvas-container');

  // 2. Initialize 3D Cyber-Sword Cursor
  const swordCursor = new SwordCursor();

  // 3. Initialize Master Battle Scroll Engine
  const scrollManager = new ScrollManager(battleScene);

  // 4. Initialize Hanging Battlefield Navbar & Command Palette
  initNavbar();

  // 4. Video Clash & Boom Transition System
  const video = document.getElementById('cinematic-video');
  const introEl = document.getElementById('cinematic-intro');
  const flashEl = document.getElementById('boom-flash');
  const triggerBoomBtn = document.getElementById('trigger-boom-btn');
  const skipBtn = document.getElementById('skip-intro-btn');
  const soundToggle = document.getElementById('sound-toggle-btn');

  let isBoomExecuted = false;

  // Sound Toggle Button (Icon Only)
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      battleAudio.ensureContext();
      const isMuted = battleAudio.toggleMute();
      soundToggle.classList.toggle('is-muted', isMuted);
      soundToggle.innerHTML = isMuted
        ? '<svg class="inline-icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>'
        : '<svg class="inline-icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>';
    });
  }

  // Ensure Video Plays Immediately
  if (video) {
    video.play().catch(() => {
      console.log('Autoplay deferred until user gesture');
    });

    // Time listener: video clashes and creates the glowing circuit boom at ~4.4s
    video.addEventListener('timeupdate', () => {
      if (!isBoomExecuted && video.currentTime >= 4.4) {
        executeBoom();
      }
    });

    video.addEventListener('ended', () => {
      if (!isBoomExecuted) {
        executeBoom();
      }
    });
  }

  // The Singularity Clash "BOOM"
  const executeBoom = () => {
    if (isBoomExecuted) return;
    isBoomExecuted = true;

    // 1. Sound synthesis
    battleAudio.ensureContext();
    battleAudio.playClash();

    // 2. White-Hot Plasma Singularity Flash
    if (flashEl) {
      flashEl.classList.add('active');
      setTimeout(() => {
        flashEl.classList.remove('active');
      }, 200);
    }

    // 3. Shockwave Confetti & Spark Radiance (White, Gold, Amber, Cyan)
    confetti({
      particleCount: 150,
      spread: 120,
      origin: { x: 0.5, y: 0.5 },
      colors: ['#ffffff', '#ffe600', '#facc15', '#ffd700']
    });

    // 4. Three.js Camera Shake and Singularity Light Pulse
    battleScene.triggerClashSingularity();

    // 5. Sword Cursor Slash Burst
    swordCursor.triggerSlash(window.innerWidth / 2, window.innerHeight / 2, Math.PI / 4);
    swordCursor.triggerSlash(window.innerWidth / 2, window.innerHeight / 2, -Math.PI / 4);

    // 6. Transition from Video to Landing Page
    setTimeout(() => {
      if (introEl) {
        introEl.classList.add('hidden');
      }
      if (video) {
        video.pause();
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 250);
  };

  if (triggerBoomBtn) {
    triggerBoomBtn.addEventListener('click', executeBoom);
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', executeBoom);
  }
});
