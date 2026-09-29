// ⚔️ Master Battle Scroll Engine: Dual Unsealing Mechanics, 24-Hour War Clock, Weapons Arsenal & FAQ
import confetti from 'canvas-confetti';
import { battleAudio } from './audio.js';

export class ScrollManager {
  constructor(battleScene) {
    this.battleScene = battleScene;
    this.day1Unsealed = false;
    this.day2ChainsRemaining = 3;
    this.activeStation = 'build';

    this.initDay1Unseal();
    this.initDay2Chains();
    this.initBattleClock();
    this.initArsenalStrikes();
    this.initFAQTablets();
  }

  // --- DAY 01: ROYAL WAX SEAL SLASH ---
  initDay1Unseal() {
    const seal = document.getElementById('day1-wax-seal');
    const scroll1 = document.getElementById('day1-scroll');

    if (!seal || !scroll1) return;

    seal.addEventListener('click', (e) => {
      if (this.day1Unsealed) return;
      this.day1Unsealed = true;

      battleAudio.playSlash();
      battleAudio.playUnroll();

      // Golden particle burst from seal
      const rect = seal.getBoundingClientRect();
      confetti({
        particleCount: 50,
        spread: 70,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight
        },
        colors: ['#f59e0b', '#fbbf24', '#d97706', '#ffffff']
      });

      scroll1.classList.add('unsealed');

      // Scroll smoothly to Day 1 details
      setTimeout(() => {
        scroll1.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 350);
    });
  }

  // --- DAY 02: 3-CHAIN BREAK MECHANIC ---
  initDay2Chains() {
    const chainLinks = document.querySelectorAll('.chain-item');
    const scroll2 = document.getElementById('day2-scroll');
    const chainPrompt = document.getElementById('chains-prompt-sub');

    if (!scroll2 || !chainLinks.length) return;

    chainLinks.forEach((chain) => {
      chain.addEventListener('click', () => {
        if (chain.classList.contains('broken')) return;

        chain.classList.add('broken');
        this.day2ChainsRemaining--;

        battleAudio.playChainBreak();

        // Chain sparks
        const rect = chain.getBoundingClientRect();
        confetti({
          particleCount: 25,
          spread: 45,
          origin: {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight
          },
          colors: ['#00f0ff', '#38bdf8', '#94a3b8', '#ffffff']
        });

        if (this.day2ChainsRemaining > 0) {
          if (chainPrompt) {
            chainPrompt.textContent = `⚔️ SLASH REMAINING CHAINS: ${this.day2ChainsRemaining} LEFT`;
          }
        } else {
          // All 3 chains broken! Explosive Unseal!
          battleAudio.playClash();
          battleAudio.playUnroll();

          confetti({
            particleCount: 120,
            spread: 100,
            origin: {
              x: (rect.left + rect.width / 2) / window.innerWidth,
              y: (rect.top + rect.height / 2) / window.innerHeight
            },
            colors: ['#00f0ff', '#f59e0b', '#ffffff', '#38bdf8']
          });

          scroll2.classList.add('unsealed');
          if (this.battleScene) {
            this.battleScene.setJudgesArenaVisibility(true);
          }

          setTimeout(() => {
            scroll2.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 350);
        }
      });
    });
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
          toast.innerHTML = `<span style="color:#00f0ff;">&gt; WEAPON DISCHARGED [${techName}]</span><br><code>${snippet}</code>`;
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
          colors: ['#00f0ff', '#f59e0b']
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
}
