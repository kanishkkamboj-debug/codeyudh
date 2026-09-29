// ⚔️ Master Battle Scroll Engine: Horizontal Scroll Track (Day 01 ➔ Day 02), 24-Hour War Clock, Weapons Arsenal & FAQ
import confetti from 'canvas-confetti';
import { battleAudio } from './audio.js';

export class ScrollManager {
  constructor(battleScene) {
    this.battleScene = battleScene;
    this.activeStation = 'build';

    this.initHorizontalScroll();
    this.initBattleClock();
    this.initArsenalStrikes();
    this.initFAQTablets();
    this.initModal();
  }

  // --- HORIZONTAL SCROLL ENGINE (DAY 01 ➔ DAY 02) ---
  initHorizontalScroll() {
    const container = document.getElementById('scrolls-anchor');
    const track = document.getElementById('horizontal-scroll-track');
    const slides = document.querySelectorAll('.scroll-slide');
    const progressBar = document.getElementById('scroll-progress-bar');
    const hintDay1 = document.getElementById('hint-day1');
    const hintDay2 = document.getElementById('hint-day2');

    if (!container || !track || slides.length < 2) return;

    // Keep judges arena hidden offscreen
    if (this.battleScene && typeof this.battleScene.setJudgesArenaVisibility === 'function') {
      this.battleScene.setJudgesArenaVisibility(false);
    }

    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const totalScrollable = container.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1);

      const slide1 = slides[0];
      const slide2 = slides[1];
      const viewportWidth = window.innerWidth;

      // Center Slide 1 when progress = 0
      const slide1Width = slide1.offsetWidth;
      const startX = (viewportWidth - slide1Width) / 2;

      // Center Slide 2 when progress = 1
      const slide2Width = slide2.offsetWidth;
      const endX = (viewportWidth / 2) - (slide2.offsetLeft + slide2Width / 2);

      // Smoothly interpolate between startX (Day 1 centered) and endX (Day 2 centered)
      const currentX = startX + progress * (endX - startX);
      track.style.transform = `translate3d(${currentX}px, 0, 0)`;

      if (progressBar) {
        progressBar.style.width = `${progress * 100}%`;
      }

      if (hintDay1 && hintDay2) {
        if (progress > 0.45) {
          hintDay1.classList.remove('active');
          hintDay2.classList.add('active');
        } else {
          hintDay1.classList.add('active');
          hintDay2.classList.remove('active');
        }
      }
    };

    if (hintDay1) {
      hintDay1.style.pointerEvents = 'auto';
      hintDay1.style.cursor = 'pointer';
      hintDay1.addEventListener('click', () => {
        const containerTop = container.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: containerTop, behavior: 'smooth' });
      });
    }
    if (hintDay2) {
      hintDay2.style.pointerEvents = 'auto';
      hintDay2.style.cursor = 'pointer';
      hintDay2.addEventListener('click', () => {
        const containerTop = container.getBoundingClientRect().top + window.pageYOffset;
        const target = containerTop + container.offsetHeight - window.innerHeight;
        window.scrollTo({ top: target, behavior: 'smooth' });
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(onScroll);
    }
    requestAnimationFrame(onScroll);
  }

  // --- 24-HOUR BATTLE CLOCK & DEVELOPMENT STATIONS ---
  initBattleClock() {
    const stationCards = document.querySelectorAll('.station-card');
    stationCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        battleAudio.playWhoosh();
        stationCards.forEach((c) => c.classList.remove('active'));
        card.classList.add('active');
      });
    });
  }

  // --- TECHNOLOGY ARSENAL: CODE STRIKES ---
  initArsenalStrikes() {
    const weaponCards = document.querySelectorAll('.weapon-card');
    const toast = document.getElementById('code-strike-toast');

    const snippets = {
      'AI / ML': 'const model = new NeuralNetwork(); model.train(battleSet);',
      'GENERATIVE AI': 'const response = await ai.generateSolution({ prompt: problemStatement });',
      'DATA SCIENCE': 'df.groupby("metrics").agg({"feasibility": "mean"});',
      'IoT': 'sensor.on("telemetry", (data) => mesh.broadcast(data));',
      'GEOSPATIAL': 'const map = new GeoMatrix.SpatialIndex(coordinates);',
      'CLOUD': 'terraform.apply({ cluster: "code-yudh-24h", replicas: 64 });',
      'BLOCKCHAIN': 'contract BattleProof { function verifySubmission() external; }',
      'CYBERSECURITY': 'shield.detectIntrusions({ heuristic: "zero-trust" });',
      'WEB': 'export default function App() { return <WarriorArena />; }',
      'MOBILE': 'Flutter.runApp(SquadTacticsApp());',
      'ROBOTICS': 'actuator.servoMove({ angle: 90, velocity: 100 });',
      'VR / AR': 'XRScene.renderHolographicField({ depth: true });',
      'ASSISTIVE TECH': 'voiceEngine.synthesizeAccessibilityStream(hapticFeedback);'
    };

    weaponCards.forEach((card) => {
      card.addEventListener('click', () => {
        battleAudio.playCodeStrike();
        const techName = card.querySelector('.weapon-name')?.textContent.trim();
        const snippet = snippets[techName] || 'code.execute();';

        if (toast) {
          toast.innerHTML = `<span style="color:#ffe600;">&gt; WEAPON DISCHARGED [${techName}]</span><br><code>${snippet}</code>`;
          toast.classList.add('visible');
          setTimeout(() => toast.classList.remove('visible'), 3200);
        }

        const rect = card.getBoundingClientRect();
        confetti({
          particleCount: 15,
          spread: 40,
          origin: {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight
          },
          colors: ['#ffe600', '#ffffff']
        });
      });
    });
  }

  // --- FAQ WAR TABLETS ---
  initFAQTablets() {
    const tablets = document.querySelectorAll('.faq-tablet');
    tablets.forEach((tablet) => {
      tablet.addEventListener('click', () => {
        battleAudio.playSlash();
        const answer = tablet.querySelector('.faq-answer');
        const icon = tablet.querySelector('.faq-toggle-icon');

        if (answer.style.display === 'block') {
          answer.style.display = 'none';
          if (icon) icon.textContent = '+';
        } else {
          answer.style.display = 'block';
          if (icon) icon.textContent = '⚔️';
        }
      });
    });
  }

  // --- REGISTRATION MODAL ---
  initModal() {
    const modal = document.getElementById('reg-modal');
    const openBtns = document.querySelectorAll('.open-reg-modal');
    const closeBtn = document.getElementById('modal-close-btn');

    if (!modal) return;

    openBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        battleAudio.playSlash();
        modal.classList.add('active');
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        battleAudio.playWhoosh();
        modal.classList.remove('active');
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
}
