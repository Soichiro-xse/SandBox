import * as THREE from 'three';
import { FluidSimulation } from './FluidSimulation.js';
import { SoundEngine } from './SoundEngine.js';
import { themes } from './themes.js';
import { waterVertexShader, waterFragmentShader } from './shaders/render.js';

class LiquidArt {
  constructor() {
    this.currentTheme = 'moonlitLake';
    this.soundEngine = new SoundEngine();
    this.pointers = new Map();
    this.lastPointers = new Map();
    this.uiVisible = true;
    this.uiTimeout = null;
    this.themePanelOpen = false;
    this.started = false;

    this._initRenderer();
    this._initFluidSim();
    this._initWaterScene();
    this._initUI();
    this._initEvents();
    this._animate();
  }

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x0a0a1a);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    document.getElementById('app').appendChild(this.renderer.domElement);
  }

  _initFluidSim() {
    const isMobile = window.innerWidth < 768;
    const simSize = isMobile ? 128 : 256;
    this.fluidSim = new FluidSimulation(this.renderer, simSize, simSize);
  }

  _initWaterScene() {
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 2.5, 3.5);
    this.camera.lookAt(0, 0, 0);

    // Environment map for reflections
    this.envMapRT = new THREE.WebGLCubeRenderTarget(256);
    this._generateEnvMap();

    // Water plane
    const theme = themes[this.currentTheme];
    const segments = window.innerWidth < 768 ? 128 : 256;
    const waterGeo = new THREE.PlaneGeometry(6, 6, segments, segments);
    waterGeo.rotateX(-Math.PI / 2);

    this.waterMat = new THREE.ShaderMaterial({
      uniforms: {
        uHeightMap: { value: null },
        uVelocityMap: { value: null },
        uDyeMap: { value: null },
        uDisplacement: { value: 0.3 },
        uTime: { value: 0 },
        uDeepColor: { value: new THREE.Vector3(...theme.deepColor) },
        uShallowColor: { value: new THREE.Vector3(...theme.shallowColor) },
        uFresnelColor: { value: new THREE.Vector3(...theme.fresnelColor) },
        uSpecularColor: { value: new THREE.Vector3(...theme.specularColor) },
        uLightDir: { value: new THREE.Vector3(...theme.lightDir) },
        uCameraPos: { value: this.camera.position },
        uFresnelPower: { value: theme.fresnelPower },
        uSpecularPower: { value: theme.specularPower },
        uEnvMap: { value: this.envMapRT.texture },
        uEnvMapIntensity: { value: theme.envMapIntensity },
        uDyeIntensity: { value: theme.dyeIntensity },
      },
      vertexShader: waterVertexShader,
      fragmentShader: waterFragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
    });

    this.waterMesh = new THREE.Mesh(waterGeo, this.waterMat);
    this.scene.add(this.waterMesh);

    // Particles floating on water
    this._initParticles();

    // Background gradient
    this._updateBackground(theme);
  }

  _generateEnvMap() {
    const scene = new THREE.Scene();
    const cubeCamera = new THREE.CubeCamera(0.1, 100, this.envMapRT);

    // Simple gradient sky for reflections
    const skyGeo = new THREE.SphereGeometry(50, 32, 32);
    const skyMat = new THREE.ShaderMaterial({
      uniforms: {
        uTopColor: { value: new THREE.Color(0x0a1530) },
        uBottomColor: { value: new THREE.Color(0x000510) },
        uStarDensity: { value: 0.98 },
      },
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uTopColor;
        uniform vec3 uBottomColor;
        uniform float uStarDensity;
        varying vec3 vWorldPos;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }

        void main() {
          float y = normalize(vWorldPos).y;
          vec3 color = mix(uBottomColor, uTopColor, max(y, 0.0));

          // Stars
          vec2 grid = floor(vWorldPos.xz * 2.0);
          float star = step(uStarDensity, hash(grid));
          float brightness = hash(grid + 100.0);
          color += star * brightness * 0.5 * step(0.3, y);

          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.BackSide,
    });
    scene.add(new THREE.Mesh(skyGeo, skyMat));

    // Add moon
    const moonGeo = new THREE.SphereGeometry(3, 32, 32);
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xffeedd });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.set(10, 20, -15);
    scene.add(moon);

    cubeCamera.update(this.renderer, scene);
  }

  _initParticles() {
    const count = 200;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = 0.01 + Math.random() * 0.02;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      sizes[i] = 0.5 + Math.random() * 1.5;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x4488ff) },
      },
      vertexShader: `
        attribute float size;
        uniform float uTime;
        varying float vAlpha;
        void main() {
          vec3 pos = position;
          pos.y += sin(pos.x * 2.0 + uTime) * 0.02 + sin(pos.z * 3.0 + uTime * 0.7) * 0.015;
          vAlpha = 0.2 + 0.3 * sin(uTime * 0.5 + pos.x * 3.0);
          vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (200.0 / -mvPos.z);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          float alpha = smoothstep(1.0, 0.0, d) * vAlpha;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.particles = new THREE.Points(geo, mat);
    this.scene.add(this.particles);
  }

  _updateBackground(theme) {
    document.body.style.background = `linear-gradient(180deg, ${theme.bgGradient.join(', ')})`;
    this.renderer.setClearColor(new THREE.Color(theme.bgGradient[0]));
  }

  _applyTheme(themeName) {
    const theme = themes[themeName];
    if (!theme) return;

    this.currentTheme = themeName;

    // Animate uniforms transition
    const u = this.waterMat.uniforms;
    this._lerpVec3(u.uDeepColor.value, theme.deepColor, 0.05);
    this._lerpVec3(u.uShallowColor.value, theme.shallowColor, 0.05);
    this._lerpVec3(u.uFresnelColor.value, theme.fresnelColor, 0.05);
    this._lerpVec3(u.uSpecularColor.value, theme.specularColor, 0.05);
    u.uLightDir.value.set(...theme.lightDir);
    u.uFresnelPower.value = theme.fresnelPower;
    u.uSpecularPower.value = theme.specularPower;
    u.uEnvMapIntensity.value = theme.envMapIntensity;
    u.uDyeIntensity.value = theme.dyeIntensity;

    this._updateBackground(theme);
    this.soundEngine.setTheme(themeName);

    // Update particle color
    const fresnelColor = new THREE.Color(...theme.fresnelColor);
    this.particles.material.uniforms.uColor.value = fresnelColor;

    // Update theme panel
    document.querySelectorAll('.theme-card').forEach((card) => {
      card.classList.toggle('active', card.dataset.theme === themeName);
    });
  }

  _lerpVec3(target, dest, t) {
    target.x += (dest[0] - target.x) * t;
    target.y += (dest[1] - target.y) * t;
    target.z += (dest[2] - target.z) * t;
  }

  _initUI() {
    // Theme panel
    const panel = document.getElementById('theme-panel');
    Object.entries(themes).forEach(([key, theme]) => {
      const card = document.createElement('div');
      card.className = `theme-card ${key === this.currentTheme ? 'active' : ''}`;
      card.dataset.theme = key;
      card.style.background = theme.cardBg;
      card.innerHTML = `
        <span class="theme-label">${theme.name}</span>
        ${!theme.free ? '<span class="lock">🔒</span>' : ''}
      `;
      card.addEventListener('click', () => {
        if (!theme.free) {
          // Show unlock hint
          card.style.transform = 'scale(0.95)';
          setTimeout(() => (card.style.transform = ''), 200);
          return;
        }
        this._applyTheme(key);
      });
      panel.appendChild(card);
    });

    // Buttons
    document.getElementById('btn-theme').addEventListener('click', () => {
      this.themePanelOpen = !this.themePanelOpen;
      document.getElementById('theme-panel').classList.toggle('open', this.themePanelOpen);
      document.getElementById('btn-theme').classList.toggle('active', this.themePanelOpen);
    });

    document.getElementById('btn-sound').addEventListener('click', () => {
      const on = this.soundEngine.toggle();
      document.getElementById('btn-sound').textContent = on ? '♪ On' : '♪ Off';
    });

    document.getElementById('btn-fullscreen').addEventListener('click', () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    });

    // Start button
    document.getElementById('start-btn').addEventListener('click', async () => {
      await this.soundEngine.init();
      this.started = true;
      document.getElementById('start-screen').classList.add('fade-out');
      setTimeout(() => {
        document.getElementById('start-screen').style.display = 'none';
      }, 800);
    });
  }

  _initEvents() {
    // Resize
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const canvas = this.renderer.domElement;

    // Mouse events
    canvas.addEventListener('mousedown', (e) => this._onPointerDown(0, e.clientX, e.clientY));
    canvas.addEventListener('mousemove', (e) => this._onPointerMove(0, e.clientX, e.clientY, e.buttons > 0));
    canvas.addEventListener('mouseup', () => this._onPointerUp(0));

    // Touch events
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      for (const touch of e.changedTouches) {
        this._onPointerDown(touch.identifier, touch.clientX, touch.clientY);
      }
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      for (const touch of e.changedTouches) {
        this._onPointerMove(touch.identifier, touch.clientX, touch.clientY, true);
      }
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
      for (const touch of e.changedTouches) {
        this._onPointerUp(touch.identifier);
      }
    });

    // Auto-hide UI
    canvas.addEventListener('pointermove', () => this._showUI());
  }

  _showUI() {
    const overlay = document.getElementById('ui-overlay');
    overlay.classList.remove('hidden');
    this.uiVisible = true;
    clearTimeout(this.uiTimeout);
    this.uiTimeout = setTimeout(() => {
      if (!this.themePanelOpen) {
        overlay.classList.add('hidden');
        this.uiVisible = false;
      }
    }, 3000);
  }

  _onPointerDown(id, x, y) {
    if (!this.started) return;
    const nx = x / window.innerWidth;
    const ny = 1.0 - y / window.innerHeight;
    this.pointers.set(id, { x: nx, y: ny });
    this.lastPointers.set(id, { x: nx, y: ny });

    const theme = themes[this.currentTheme];
    const color = theme.splatColors[Math.floor(Math.random() * theme.splatColors.length)];
    this.fluidSim.splat(nx, ny, 0, 0, color);
    this.soundEngine.playRipple(nx, ny, 0.7);
  }

  _onPointerMove(id, x, y, isDown) {
    if (!this.started) return;
    const nx = x / window.innerWidth;
    const ny = 1.0 - y / window.innerHeight;

    if (isDown && this.pointers.has(id)) {
      const last = this.pointers.get(id);
      const dx = nx - last.x;
      const dy = ny - last.y;
      const velocity = Math.sqrt(dx * dx + dy * dy);

      if (velocity > 0.001) {
        const theme = themes[this.currentTheme];
        const color = theme.splatColors[Math.floor(Math.random() * theme.splatColors.length)];
        this.fluidSim.splat(nx, ny, dx * 50, dy * 50, color);

        // Throttle sound
        if (Math.random() < 0.15) {
          this.soundEngine.playDrag(nx, ny, velocity);
        }
      }
      this.pointers.set(id, { x: nx, y: ny });
    }
  }

  _onPointerUp(id) {
    this.pointers.delete(id);
    this.lastPointers.delete(id);
  }

  _animate() {
    requestAnimationFrame(() => this._animate());

    const dt = Math.min(this.clock.getDelta(), 0.05);
    const time = this.clock.getElapsedTime();

    // Step fluid simulation
    this.fluidSim.step(dt);

    // Ambient splats (random gentle disturbances)
    if (this.started && Math.random() < 0.02) {
      const theme = themes[this.currentTheme];
      const color = theme.splatColors[Math.floor(Math.random() * theme.splatColors.length)];
      const x = 0.2 + Math.random() * 0.6;
      const y = 0.2 + Math.random() * 0.6;
      this.fluidSim.splat(x, y, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, {
        r: color.r * 0.3,
        g: color.g * 0.3,
        b: color.b * 0.3,
      });
    }

    // Update water material
    this.waterMat.uniforms.uHeightMap.value = this.fluidSim.getDyeTexture();
    this.waterMat.uniforms.uVelocityMap.value = this.fluidSim.getVelocityTexture();
    this.waterMat.uniforms.uDyeMap.value = this.fluidSim.getDyeTexture();
    this.waterMat.uniforms.uTime.value = time;

    // Update particles
    this.particles.material.uniforms.uTime.value = time;

    // Gentle camera sway
    this.camera.position.x = Math.sin(time * 0.1) * 0.15;
    this.camera.position.z = 3.5 + Math.cos(time * 0.08) * 0.1;
    this.camera.lookAt(0, 0, 0);

    // Theme color lerp (smooth transitions)
    const theme = themes[this.currentTheme];
    const u = this.waterMat.uniforms;
    this._lerpVec3(u.uDeepColor.value, theme.deepColor, 0.03);
    this._lerpVec3(u.uShallowColor.value, theme.shallowColor, 0.03);
    this._lerpVec3(u.uFresnelColor.value, theme.fresnelColor, 0.03);
    this._lerpVec3(u.uSpecularColor.value, theme.specularColor, 0.03);

    // Render
    this.renderer.render(this.scene, this.camera);
  }

  _lerpVec3(target, dest, t) {
    target.x += (dest[0] - target.x) * t;
    target.y += (dest[1] - target.y) * t;
    target.z += (dest[2] - target.z) * t;
  }
}

// Boot
new LiquidArt();
