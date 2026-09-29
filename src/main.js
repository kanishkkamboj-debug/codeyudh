// ⚔️ CODE YUDH: Master Application Entry Point
import './style.css';
import confetti from 'canvas-confetti';
import { battleAudio } from './audio.js';
import { SwordCursor } from './swordCursor.js';
import { BattleScene3D } from './battleScene3D.js';
import { ScrollManager } from './scrollManager.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize 3D WebGL Background
  const battleScene = new BattleScene3D('three-canvas-container');

  // 2. Initialize 3D Cyber-Sword Cursor
  const swordCursor = new SwordCursor();

  // 3. Initialize Master Battle Scroll Engine
  const scrollManager = new ScrollManager(battleScene);

  // 4. Video Clash & Boom Transition System
  const video = document.getElementById('cinematic-video');
  const introEl = document.getElementById('cinematic-intro');
  const flashEl = document.getElementById('boom-flash');
  const triggerBoomBtn = document.getElementById('trigger-boom-btn');
  const skipBtn = document.getElementById('skip-intro-btn');
  const soundToggle = document.getElementById('sound-toggle-btn');

  let isBoomExecuted = false;

  // Sound Toggle Button
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      battleAudio.ensureContext();
      const isMuted = battleAudio.toggleMute();
      soundToggle.innerHTML = isMuted ? '🔇 SOUND: OFF' : '🔊 SOUND: ON';
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
      colors: ['#ffffff', '#f59e0b', '#fbbf24', '#00f0ff', '#38bdf8']
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
