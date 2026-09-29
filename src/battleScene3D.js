// Three.js WebGL Scene: Infinity Code Loop, Particle Singularity, 4 Revolving 3D Swords Background
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class BattleScene3D {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000000, 0.022);

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 15);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();
    this.isClashing = false;
    this.clashShockwaveRadius = 0;

    // Orbital swords system state: dynamically centered around the "CODE YUDH" logo
    this.swordObjects = [];
    this.orbitalGroup = new THREE.Group();
    this.scene.add(this.orbitalGroup);

    // Initial radii (will be dynamically calibrated to the logo's bounding dimensions)
    const isMobile = window.innerWidth < 768;
    this.currentRadiusX = isMobile ? 4.5 : 6.8;
    this.currentRadiusY = isMobile ? 2.8 : 3.8;
    this.currentRadiusZ = 3.2;
    this.targetRadiusX = this.currentRadiusX;
    this.targetRadiusY = this.currentRadiusY;
    this.targetRadiusZ = this.currentRadiusZ;
    this.clashMultiplier = 1;

    this.initLights();
    this.initOrbitalSwords();
    this.initParticles();
    this.initJudgesArena();
    this.initTerritoryDioramas();

    window.addEventListener('resize', () => this.onWindowResize());

    this.animate();
  }

  initLights() {
    // High-ambient illumination so swords are luminous and visible against pitch black
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    this.scene.add(ambientLight);

    // Directional key light - Powerful white key light (Top Front Right)
    this.keyLight = new THREE.DirectionalLight(0xffffff, 4.2);
    this.keyLight.position.set(6, 12, 12);
    this.scene.add(this.keyLight);

    // Specular fill light - Strong white fill light (Top Front Left)
    this.fillLight = new THREE.DirectionalLight(0xffffff, 3.4);
    this.fillLight.position.set(-8, 8, 10);
    this.scene.add(this.fillLight);

    // Dynamic blade rim light - Sharp white rim light (Bottom Back)
    this.rimLight = new THREE.DirectionalLight(0xffffff, 2.8);
    this.rimLight.position.set(0, -8, -8);
    this.scene.add(this.rimLight);

    // Side metal reflection lights
    this.leftLight = new THREE.PointLight(0xffffff, 2.2, 40);
    this.leftLight.position.set(-6, 0, 6);
    this.scene.add(this.leftLight);

    this.rightLight = new THREE.PointLight(0xffffff, 2.2, 40);
    this.rightLight.position.set(6, 0, 6);
    this.scene.add(this.rightLight);

    // Singularity center point lights
    this.coreLight = new THREE.PointLight(0xffffff, 1.8, 30);
    this.coreLight.position.set(0, 0, 0);
    this.scene.add(this.coreLight);

    // Core light anchored directly at the center of the logo inside the orbital group
    this.orbitCoreLight = new THREE.PointLight(0xffffff, 2.5, 25);
    this.orbitCoreLight.position.set(0, 0, 0);
    this.orbitalGroup.add(this.orbitCoreLight);
  }

  initOrbitalSwords() {
    const loader = new GLTFLoader();

    const swordFiles = [
      encodeURI('/assets/3d-metal-sword.glb'),
      encodeURI('/assets/3d-metal-sword (1).glb'),
      encodeURI('/assets/3d-metal-sword (2).glb'),
      encodeURI('/assets/3d-metal-sword (3).glb')
    ];

    swordFiles.forEach((fileUrl, index) => {
      loader.load(
        fileUrl,
        (gltf) => {
          const swordModel = gltf.scene;

          // Step 1: Compute bounding box and center pivot at geometry origin
          const box = new THREE.Box3().setFromObject(swordModel);
          const center = new THREE.Vector3();
          box.getCenter(center);
          swordModel.position.sub(center);

          // Step 2: Orientation normalization
          // Models 1 and 2 are aligned along Z axis with hilt at -Z.
          // Rotating around X by -Math.PI / 2 reorients them vertically along Y
          // with hilt at -Y and blade tip pointing at +Y, matching models 0 and 3.
          const size = new THREE.Vector3();
          box.getSize(size);
          if (size.z > size.y) {
            swordModel.rotation.x = -Math.PI / 2;
          }

          // Step 3: Consistent scale (target length ~7.4 units for bigger, imposing presence)
          const maxDim = Math.max(size.x, size.y, size.z);
          const isMobile = window.innerWidth < 768;
          const targetLength = isMobile ? 5.4 : 7.4;
          const scale = targetLength / (maxDim || 1);

          // Step 4: True metallic look with high polish and maximum reflection
          swordModel.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              if (child.material) {
                child.material.metalness = 0.90;
                child.material.roughness = 0.12; // sharp polished chrome reflection
                if (child.material.color) {
                  child.material.color.setHex(0xffffff);
                }
                // Zero out any emissive color so no artificial yellow/tint is applied
                if (child.material.emissive) {
                  child.material.emissive.setHex(0x000000);
                  child.material.emissiveIntensity = 0;
                }
              }
            }
          });

          // Step 5: Dual-pivot hierarchy
          // innerPivot handles axial spin; orbitAnchor handles orbital trajectory
          const innerPivot = new THREE.Group();
          innerPivot.scale.setScalar(scale);
          innerPivot.add(swordModel);

          const orbitAnchor = new THREE.Group();
          orbitAnchor.add(innerPivot);

          this.orbitalGroup.add(orbitAnchor);

          this.swordObjects.push({
            index,
            anchor: orbitAnchor,
            innerPivot,
            model: swordModel,
            baseScale: scale,
            baseAngle: (index * Math.PI) / 2, // 90° spaced evenly in orbital circle
            spinSpeed: 0.75 + index * 0.1,
            floatPhase: index * 1.57,
            orbitRadiusOffset: (index % 2 === 0 ? 0.2 : -0.2)
          });
        },
        undefined,
        (error) => {
          console.warn(`Could not load sword model ${fileUrl}:`, error);
        }
      );
    });
  }

  initParticles() {
    const particleCount = 400;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const whiteStar = new THREE.Color(0xffffff);
    const silverStar = new THREE.Color(0x94a3b8);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 40;
      positions[i3 + 1] = (Math.random() - 0.5) * 30;
      positions[i3 + 2] = (Math.random() - 0.5) * 40;

      const mixed = Math.random() > 0.5 ? whiteStar : silverStar;
      colors[i3] = mixed.r;
      colors[i3 + 1] = mixed.g;
      colors[i3 + 2] = mixed.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }


  initJudgesArena() {
    this.judgesGroup = new THREE.Group();
    this.judgesGroup.position.set(0, -50, 0); // Positioned offscreen until scrolled/revealed

    // 4 Monolithic Evaluation Pillars
    this.pillars = [];
    const pillarData = [
      { name: 'INNOVATION', color: 0xffe600, angle: 0 },
      { name: 'IMPLEMENTATION', color: 0xfacc15, angle: Math.PI / 2 },
      { name: 'FUNCTIONALITY', color: 0xffffff, angle: Math.PI },
      { name: 'IMPACT', color: 0xeab308, angle: (3 * Math.PI) / 2 }
    ];

    pillarData.forEach((p) => {
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

      const rad = 4.8;
      pGroup.position.set(Math.cos(p.angle) * rad, 0, Math.sin(p.angle) * rad);
      pGroup.rotation.y = -p.angle;

      this.pillars.push({ group: pGroup, data: p });
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
      color: 0xffe600,
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

  smoothstep(edge0, edge1, x) {
    const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
    return t * t * (3 - 2 * t);
  }

  updateLogoTracking() {
    const logoEl = document.querySelector('.hero-event-logo');
    if (!logoEl) return;

    const rect = logoEl.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Logo center in screen coordinates
    const logoCenterX = rect.left + rect.width / 2;
    const logoCenterY = rect.top + rect.height / 2;

    // Convert to NDC space (-1 to +1)
    const ndcX = (logoCenterX / window.innerWidth) * 2 - 1;
    const ndcY = -(logoCenterY / window.innerHeight) * 2 + 1;

    // Unproject to z = 0 plane based on camera position and FOV
    const vFovRad = (this.camera.fov * Math.PI) / 180;
    const visibleHeight = 2 * Math.tan(vFovRad / 2) * this.camera.position.z;
    const visibleWidth = visibleHeight * this.camera.aspect;

    const targetWorldX = ndcX * (visibleWidth / 2);
    const targetWorldY = ndcY * (visibleHeight / 2);

    // Calculate current scroll progress (0 at top, 1 at bottom)
    const maxScroll = (document.documentElement.scrollHeight - window.innerHeight) || 1;
    const currentScroll = window.scrollY || window.pageYOffset || 0;
    const targetScrollP = Math.min(Math.max(currentScroll / maxScroll, 0), 1);
    this.scrollProgress = THREE.MathUtils.lerp(this.scrollProgress || 0, targetScrollP, 0.08);

    // At top (scrollProgress = 0), center on the logo.
    // As user scrolls down past the hero, smoothly center in the viewport (0, 0)
    const centerT = this.smoothstep(0.02, 0.20, this.scrollProgress);
    const targetX = THREE.MathUtils.lerp(targetWorldX, 0, centerT);
    const targetY = THREE.MathUtils.lerp(targetWorldY, 0, centerT);

    // Smoothly align the orbital group
    this.orbitalGroup.position.x = THREE.MathUtils.lerp(this.orbitalGroup.position.x, targetX, 0.12);
    this.orbitalGroup.position.y = THREE.MathUtils.lerp(this.orbitalGroup.position.y, targetY, 0.12);

    // Calculate logo dimensions in world coordinates
    const logoWorldW = (rect.width / window.innerWidth) * visibleWidth;
    const isMobile = window.innerWidth < 768;
    const padX = isMobile ? 1.2 : 1.8;
    const depthZ = isMobile ? 3.6 : 4.8;

    if (!this.isClashing) {
      this.targetRadiusX = (logoWorldW / 2) + padX;
      this.targetRadiusZ = depthZ;
    }
  }

  triggerClashSingularity() {
    this.isClashing = true;
    this.clashShockwaveRadius = 0;
    this.coreLight.intensity = 15;
    this.coreLight.color.setHex(0xffffff);

    if (this.orbitCoreLight) {
      this.orbitCoreLight.intensity = 20;
      this.orbitCoreLight.color.setHex(0xffffff);
    }

    // Controlled shockwave surge expanding away from the logo, then returning
    this.targetRadiusX *= 1.45;
    this.targetRadiusZ *= 1.45;
    this.clashMultiplier = 2.8;

    setTimeout(() => {
      this.isClashing = false;
    }, 450);

    // Camera shake
    const origY = this.camera.position.y;
    let shakeCount = 0;
    const shakeInterval = setInterval(() => {
      this.camera.position.x = (Math.random() - 0.5) * 0.6;
      this.camera.position.y = origY + (Math.random() - 0.5) * 0.6;
      shakeCount++;
      if (shakeCount > 15) {
        clearInterval(shakeInterval);
        this.camera.position.set(0, 0, 15);
      }
    }, 30);

    setTimeout(() => {
      this.isClashing = false;
      if (this.orbitCoreLight) {
        this.orbitCoreLight.color.setHex(0xffffff);
      }
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

    // Dynamically track logo position, size, and user scroll progression
    this.updateLogoTracking();

    // Smooth lerp radii
    this.currentRadiusX = THREE.MathUtils.lerp(this.currentRadiusX, this.targetRadiusX, 0.08);
    this.currentRadiusZ = THREE.MathUtils.lerp(this.currentRadiusZ, this.targetRadiusZ, 0.08);

    const p = this.scrollProgress || 0;

    // --- SCROLL-DRIVEN TRANSFORMATION PHASES ---
    // User specification:
    // "on scroll make on sword upside down, then with scroll make it face right then down and slowly enlarging and lastly at end it lies horizontaly rotating"

    let targetRotZ = 0;
    let targetRotX = 0.04;
    let isHorizontalRotating = false;

    if (p < 0.25) {
      // Phase 1: Upright (0) -> Upside Down (Math.PI)
      const t = this.smoothstep(0.04, 0.25, p);
      targetRotZ = t * Math.PI;
      targetRotX = 0.04;
    } else if (p < 0.50) {
      // Phase 2: Upside Down (Math.PI) -> Face Right (Math.PI / 2)
      const t = this.smoothstep(0.25, 0.50, p);
      targetRotZ = Math.PI - t * (Math.PI / 2);
      targetRotX = 0.04;
    } else if (p < 0.75) {
      // Phase 3: Face Right (Math.PI / 2) -> Face Down again (Math.PI)
      const t = this.smoothstep(0.50, 0.75, p);
      targetRotZ = (Math.PI / 2) + t * (Math.PI / 2);
      targetRotX = 0.04;
    } else {
      // Phase 4: Face Down (Math.PI) -> Lies Horizontally (rotX -> Math.PI / 2, rotZ -> Math.PI / 2)
      const t = this.smoothstep(0.75, 1.0, p);
      targetRotZ = Math.PI - t * (Math.PI / 2);
      targetRotX = 0.04 + t * (Math.PI / 2 - 0.04);
      isHorizontalRotating = true;
    }

    // Slowly enlarging with scroll from 1.0x at top to 2.25x at bottom
    const scaleMultiplier = 1.0 + this.smoothstep(0.08, 1.0, p) * 1.25;

    // Transition weight from 360 orbit into center stage
    const orbitBlend = 1.0 - this.smoothstep(0.02, 0.20, p);

    // Other 3 swords smoothly fade away as scroll leaves the hero section
    const otherSwordsFade = 1.0 - this.smoothstep(0.02, 0.18, p);

    // Subtle 3D constellation tilt (when at top)
    this.orbitalGroup.rotation.x = (0.12 + Math.sin(time * 0.25) * 0.04) * orbitBlend;
    this.orbitalGroup.rotation.y = 0;
    this.orbitalGroup.rotation.z = 0;

    const orbitSpeed = 0.38 * this.clashMultiplier;
    this.swordObjects.forEach((sword) => {
      if (sword.index === 0) {
        // --- FOCAL HERO SWORD ---
        // 1. Position: smoothly transitions from logo orbit to viewport center (0, 0, 0)
        const currentAngle = sword.baseAngle + time * orbitSpeed;
        const orbitX = Math.sin(currentAngle) * this.currentRadiusX;
        const orbitZ = Math.cos(currentAngle) * this.currentRadiusZ;
        const orbitY = Math.sin(time * 1.5 + sword.floatPhase) * 0.2;

        sword.anchor.position.x = orbitX * orbitBlend;
        sword.anchor.position.y = orbitY * orbitBlend;
        sword.anchor.position.z = orbitZ * orbitBlend;

        // 2. Scale: slowly enlarging with scroll
        const baseScale = sword.baseScale || 1.0;
        sword.innerPivot.scale.setScalar(baseScale * scaleMultiplier);

        // 3. Orientation:
        // When in orbit (p ~ 0), stands upright facing along orbit.
        // On scroll, executes the requested sequence:
        // upside down -> face right -> face down -> lies horizontally rotating
        const baseRotY = currentAngle + Math.PI / 2;

        if (isHorizontalRotating) {
          const endT = this.smoothstep(0.85, 1.0, p);
          // Lies horizontally (rotX = PI/2, rotZ = PI/2) and rotates in 3D:
          sword.anchor.rotation.x = targetRotX;
          sword.anchor.rotation.z = targetRotZ;
          // Horizontal continuous rotation at the end:
          sword.anchor.rotation.y = time * 1.2 * endT;
          sword.innerPivot.rotation.x = Math.sin(time * 0.8) * 0.12 * endT;
          sword.innerPivot.rotation.y += delta * (1.0 + endT * 1.8);
        } else {
          sword.anchor.rotation.x = THREE.MathUtils.lerp(0.04, targetRotX, 1.0 - orbitBlend);
          sword.anchor.rotation.z = targetRotZ * (1.0 - orbitBlend);
          sword.anchor.rotation.y = THREE.MathUtils.lerp(baseRotY, 0, 1.0 - orbitBlend);
          sword.innerPivot.rotation.y += delta * sword.spinSpeed * this.clashMultiplier;
        }

        sword.anchor.visible = true;
      } else {
        // --- OTHER 3 SWORDS (revolve around logo at top, fade on scroll) ---
        const currentAngle = sword.baseAngle + time * orbitSpeed;
        const x = Math.sin(currentAngle) * this.currentRadiusX;
        const z = Math.cos(currentAngle) * this.currentRadiusZ;
        const y = Math.sin(time * 1.5 + sword.floatPhase) * 0.2;
        sword.anchor.position.set(x, y, z);

        sword.anchor.rotation.z = 0;
        sword.anchor.rotation.x = 0.04;
        sword.anchor.rotation.y = currentAngle + Math.PI / 2;
        sword.innerPivot.rotation.y += delta * sword.spinSpeed * this.clashMultiplier;

        // Fade scale and visibility on scroll
        sword.anchor.scale.setScalar(otherSwordsFade);
        sword.anchor.visible = otherSwordsFade > 0.005;
      }
    });

    // Decay clash multiplier
    if (this.clashMultiplier > 1) {
      this.clashMultiplier = THREE.MathUtils.lerp(this.clashMultiplier, 1, 0.05);
    }

    // Slowly rotate background particle space
    if (this.particles) {
      this.particles.rotation.y = time * 0.03;
      this.particles.rotation.x = Math.sin(time * 0.05) * 0.05;
    }

    // Singularity light decay after clash
    if (this.coreLight.intensity > 0.8) {
      this.coreLight.intensity = THREE.MathUtils.lerp(this.coreLight.intensity, 0.8, 0.08);
    }
    if (this.orbitCoreLight && this.orbitCoreLight.intensity > 1.2) {
      this.orbitCoreLight.intensity = THREE.MathUtils.lerp(this.orbitCoreLight.intensity, 1.2, 0.08);
    }

    // Rotate Judges Arena
    if (this.judgesGroup && this.judgesGroup.position.y > -20) {
      this.judgesGroup.rotation.y += delta * 0.25;
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
