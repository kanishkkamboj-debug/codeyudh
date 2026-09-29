// ⚔️ Three.js WebGL Scene: Infinity Code Loop, Particle Singularity, 3D Judges Arena & Dioramas
import * as THREE from 'three';

export class BattleScene3D {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x08090c, 0.025);

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 2, 16);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();
    this.isClashing = false;
    this.clashShockwaveRadius = 0;

    this.initLights();
    this.initParticles();
    this.initInfinityLoop();
    this.initJudgesArena();
    this.initTerritoryDioramas();

    window.addEventListener('resize', () => this.onWindowResize());
    this.animate();
  }

  initLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Left warrior light (The Builder - Amber/Gold)
    this.leftLight = new THREE.PointLight(0xf59e0b, 3, 50);
    this.leftLight.position.set(-6, 2, 4);
    this.scene.add(this.leftLight);

    // Right warrior light (The Innovator - Cyan/Blue)
    this.rightLight = new THREE.PointLight(0x00f0ff, 3, 50);
    this.rightLight.position.set(6, 2, 4);
    this.scene.add(this.rightLight);

    // Core clash singularity light
    this.coreLight = new THREE.PointLight(0xffffff, 1, 30);
    this.coreLight.position.set(0, 0, 0);
    this.scene.add(this.coreLight);
  }

  initParticles() {
    const particleCount = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const goldColor = new THREE.Color(0xf59e0b);
    const cyanColor = new THREE.Color(0x00f0ff);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 40;
      positions[i3 + 1] = (Math.random() - 0.5) * 30;
      positions[i3 + 2] = (Math.random() - 0.5) * 40;

      const mixed = Math.random() > 0.5 ? goldColor : cyanColor;
      colors[i3] = mixed.r;
      colors[i3 + 1] = mixed.g;
      colors[i3 + 2] = mixed.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  initInfinityLoop() {
    // Exact poster motif: glowing figure-8 infinity code loop
    const curve = new THREE.Curve();
    curve.getPoint = function (t) {
      const angle = t * Math.PI * 2;
      const scale = 5.5;
      // Lemniscate of Gerono / Bernoulli
      const x = (scale * Math.cos(angle)) / (1 + Math.sin(angle) * Math.sin(angle));
      const y = (scale * Math.sin(angle) * Math.cos(angle)) / (1 + Math.sin(angle) * Math.sin(angle));
      const z = Math.sin(angle * 2) * 0.8;
      return new THREE.Vector3(x, y, z);
    };

    const tubeGeo = new THREE.TubeGeometry(curve, 160, 0.08, 12, true);
    const tubeMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    this.infinityLoop = new THREE.Mesh(tubeGeo, tubeMat);
    this.infinityLoop.position.set(0, 0, 0);
    this.scene.add(this.infinityLoop);

    // Glowing energy nodes on the loop
    const nodeCount = 200;
    const nodeGeo = new THREE.BufferGeometry();
    const nodePos = new Float32Array(nodeCount * 3);
    const nodeCol = new Float32Array(nodeCount * 3);

    for (let i = 0; i < nodeCount; i++) {
      const pt = curve.getPoint(i / nodeCount);
      nodePos[i * 3] = pt.x;
      nodePos[i * 3 + 1] = pt.y;
      nodePos[i * 3 + 2] = pt.z;

      // Half amber, half cyan
      const isAmber = i < nodeCount / 2;
      nodeCol[i * 3] = isAmber ? 1.0 : 0.0;
      nodeCol[i * 3 + 1] = isAmber ? 0.6 : 0.9;
      nodeCol[i * 3 + 2] = isAmber ? 0.1 : 1.0;
    }

    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePos, 3));
    nodeGeo.setAttribute('color', new THREE.BufferAttribute(nodeCol, 3));

    const nodeMat = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.9
    });

    this.loopNodes = new THREE.Points(nodeGeo, nodeMat);
    this.scene.add(this.loopNodes);
  }

  initJudgesArena() {
    this.judgesGroup = new THREE.Group();
    this.judgesGroup.position.set(0, -50, 0); // Positioned offscreen until scrolled/revealed

    // Circular arena base with glowing runic rim
    const baseGeo = new THREE.CylinderGeometry(7, 7.5, 0.6, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x111622,
      roughness: 0.3,
      metalness: 0.8
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    this.judgesGroup.add(base);

    // Outer glowing runic ring
    const ringGeo = new THREE.RingGeometry(7.2, 7.6, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.32;
    this.judgesGroup.add(ring);

    // 4 Monolithic Evaluation Pillars
    this.pillars = [];
    const pillarData = [
      { name: 'INNOVATION', color: 0xf59e0b, angle: 0 },
      { name: 'IMPLEMENTATION', color: 0x00f0ff, angle: Math.PI / 2 },
      { name: 'FUNCTIONALITY', color: 0x10b981, angle: Math.PI },
      { name: 'IMPACT', color: 0xa855f7, angle: (3 * Math.PI) / 2 }
    ];

    pillarData.forEach((p, idx) => {
      const pGroup = new THREE.Group();
      const pGeo = new THREE.BoxGeometry(1.2, 4.5, 1.2);
      const pMat = new THREE.MeshStandardMaterial({
        color: 0x1e2433,
        emissive: p.color,
        emissiveIntensity: 0.3,
        roughness: 0.2,
        metalness: 0.9
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.position.y = 2.25;
      pGroup.add(pMesh);

      // Floating holographic crystal on top
      const crystalGeo = new THREE.OctahedronGeometry(0.5);
      const crystalMat = new THREE.MeshBasicMaterial({
        color: p.color,
        wireframe: true
      });
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      crystal.position.y = 5.2;
      pGroup.add(crystal);

      const rad = 4.8;
      pGroup.position.set(Math.cos(p.angle) * rad, 0.3, Math.sin(p.angle) * rad);
      pGroup.rotation.y = -p.angle;

      this.pillars.push({ group: pGroup, crystal, data: p });
      this.judgesGroup.add(pGroup);
    });

    this.scene.add(this.judgesGroup);
  }

  initTerritoryDioramas() {
    this.dioramasGroup = new THREE.Group();
    this.dioramasGroup.position.set(0, -100, 0);

    // Territory 6: Open Innovation Hypercube / Tesseract
    const cubeGeo = new THREE.BoxGeometry(2, 2, 2);
    const cubeMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    this.tesseract = new THREE.Mesh(cubeGeo, cubeMat);

    const innerGeo = new THREE.OctahedronGeometry(1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      wireframe: true
    });
    this.tesseractInner = new THREE.Mesh(innerGeo, innerMat);
    this.tesseract.add(this.tesseractInner);

    this.dioramasGroup.add(this.tesseract);
    this.scene.add(this.dioramasGroup);
  }

  triggerClashSingularity() {
    this.isClashing = true;
    this.clashShockwaveRadius = 0;
    this.coreLight.intensity = 15;
    this.coreLight.color.setHex(0xffffff);

    // Camera shake
    const origY = this.camera.position.y;
    let shakeCount = 0;
    const shakeInterval = setInterval(() => {
      this.camera.position.x = (Math.random() - 0.5) * 0.8;
      this.camera.position.y = origY + (Math.random() - 0.5) * 0.8;
      shakeCount++;
      if (shakeCount > 15) {
        clearInterval(shakeInterval);
        this.camera.position.set(0, 2, 16);
      }
    }, 30);

    setTimeout(() => {
      this.isClashing = false;
    }, 1200);
  }

  setJudgesArenaVisibility(active) {
    if (active) {
      this.judgesGroup.position.set(0, -1, 0);
    } else {
      this.judgesGroup.position.set(0, -50, 0);
    }
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Rotate infinity loop
    if (this.infinityLoop) {
      this.infinityLoop.rotation.z = Math.sin(time * 0.4) * 0.15;
      this.infinityLoop.rotation.y = time * 0.1;
    }
    if (this.loopNodes) {
      this.loopNodes.rotation.z = Math.sin(time * 0.4) * 0.15;
      this.loopNodes.rotation.y = time * 0.1;
    }

    // Slowly rotate background particle space
    if (this.particles) {
      this.particles.rotation.y = time * 0.03;
      this.particles.rotation.x = Math.sin(time * 0.05) * 0.05;
    }

    // Singularity light decay after clash
    if (this.coreLight.intensity > 1) {
      this.coreLight.intensity = THREE.MathUtils.lerp(this.coreLight.intensity, 1, 0.08);
    }

    // Rotate Judges Arena
    if (this.judgesGroup && this.judgesGroup.position.y > -20) {
      this.judgesGroup.rotation.y += delta * 0.25;
      this.pillars.forEach((p, idx) => {
        p.crystal.rotation.x += delta * 1.5;
        p.crystal.rotation.y += delta * 1.2;
        p.crystal.position.y = 5.2 + Math.sin(time * 2 + idx) * 0.2;
      });
    }

    // Rotate Tesseract
    if (this.tesseract) {
      this.tesseract.rotation.x += delta * 0.5;
      this.tesseract.rotation.y += delta * 0.7;
      this.tesseractInner.rotation.x -= delta * 0.8;
      this.tesseractInner.rotation.z += delta * 0.6;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
