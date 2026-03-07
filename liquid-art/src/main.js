import * as THREE from 'three';
import { FluidSimulation } from './FluidSimulation.js';
import { SoundEngine } from './SoundEngine.js';
import { themes } from './themes.js';
import {
  fluidDisplayVertexShader,
  fluidDisplayFragmentShader,
  bloomThresholdFragmentShader,
  blurFragmentShader,
  compositeFragmentShader,
} from './shaders/render.js';

class LiquidArt {
  constructor() {
    this.currentTheme = 'moonlitLake';
    this.soundEngine = new SoundEngine();
    this.pointers = new Map();
    this.uiVisible = true;
    this.uiTimeout = null;
    this.themePanelOpen = false;
    this.started = false;
    this.autoSplatTimer = 0;
    this.startTime = performance.now();

    this._initRenderer();
    this._initFluidSim();
    this._initFullscreenQuad();
    this._initBloom();
    this._initUI();
    this._initEvents();

    // Start auto-demo immediately (before user interaction)
    this._startAutoDemo();
    this._animate();
  }

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x010108);
    this.renderer.autoClear = false;
    document.getElementById('app').appendChild(this.renderer.domElement);
  }

  _initFluidSim() {
    const isMobile = window.innerWidth < 768;
    const simSize = isMobile ? 128 : 256;
    this.fluidSim = new FluidSimulation(this.renderer, simSize, simSize);
    // Bigger splats, slower dissipation for more visible effects
    this.fluidSim.config.splatRadius = isMobile ? 0.012 : 0.008;
    this.fluidSim.config.dyeDissipation = 0.985;
    this.fluidSim.config.velocityDissipation = 0.99;
    this.fluidSim.config.curl = 35;
  }

  _initFullscreenQuad() {
    this.quadScene = new THREE.Scene();
    this.quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
    this.quadScene.add(this.quad);

    // Main display material
    this.displayMat = new THREE.ShaderMaterial({
      uniforms: {
        uDyeMap: { value: null },
        uTime: { value: 0 },
        uIntensity: { value: 2.5 },
      },
      vertexShader: fluidDisplayVertexShader,
      fragmentShader: fluidDisplayFragmentShader,
      depthTest: false,
      depthWrite: false,
    });

    // Render target for scene (before bloom)
    this.sceneRT = new THREE.WebGLRenderTarget(
      window.innerWidth, window.innerHeight,
      { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat }
    );
  }

  _initBloom() {
    const w = Math.floor(window.innerWidth / 2);
    const h = Math.floor(window.innerHeight / 2);
    const rtOpts = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat };

    this.bloomRT1 = new THREE.WebGLRenderTarget(w, h, rtOpts);
    this.bloomRT2 = new THREE.WebGLRenderTarget(w, h, rtOpts);

    const baseVert = `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`;

    this.thresholdMat = new THREE.ShaderMaterial({
      uniforms: { uTexture: { value: null }, uThreshold: { value: 0.15 } },
      vertexShader: baseVert,
      fragmentShader: bloomThresholdFragmentShader,
      depthTest: false, depthWrite: false,
    });

    this.blurMat = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: null },
        uDirection: { value: new THREE.Vector2(1, 0) },
        uResolution: { value: new THREE.Vector2(w, h) },
      },
      vertexShader: baseVert,
      fragmentShader: blurFragmentShader,
      depthTest: false, depthWrite: false,
    });

    this.compositeMat = new THREE.ShaderMaterial({
      uniforms: {
        uScene: { value: null },
        uBloom: { value: null },
        uBloomStrength: { value: 0.8 },
      },
      vertexShader: baseVert,
      fragmentShader: compositeFragmentShader,
      depthTest: false, depthWrite: false,
    });
  }

  _renderQuad(material, target) {
    this.quad.material = material;
    this.renderer.setRenderTarget(target);
    this.renderer.clear();
    this.renderer.render(this.quadScene, this.quadCamera);
    this.renderer.setRenderTarget(null);
  }

  _startAutoDemo() {
    // Create initial burst of beautiful splats
    const theme = themes[this.currentTheme];
    const colors = theme.splatColors;

    // Central burst
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const r = 0.08;
      const x = 0.5 + Math.cos(angle) * r;
      const y = 0.5 + Math.sin(angle) * r;
      const dx = Math.cos(angle) * 20;
      const dy = Math.sin(angle) * 20;
      const c = colors[i % colors.length];
      this.fluidSim.splat(x, y, dx, dy, { r: c.r * 2, g: c.g * 2, b: c.b * 2 });
    }
  }

  _doAutoSplat() {
    const theme = themes[this.currentTheme];
    const colors = theme.splatColors;
    const time = performance.now() * 0.001;

    // More frequent and dramatic auto splats
    const x = 0.3 + Math.sin(time * 0.7) * 0.2 + Math.sin(time * 1.3) * 0.1;
    const y = 0.3 + Math.cos(time * 0.5) * 0.2 + Math.cos(time * 1.1) * 0.1;
    const dx = Math.sin(time * 1.2) * 15;
    const dy = Math.cos(time * 0.9) * 15;
    const c = colors[Math.floor(Math.random() * colors.length)];
    this.fluidSim.splat(x, y, dx, dy, { r: c.r * 1.5, g: c.g * 1.5, b: c.b * 1.5 });
  }

  _applyTheme(themeName) {
    const theme = themes[themeName];
    if (!theme) return;
    this.currentTheme = themeName;
    this.soundEngine.setTheme(themeName);

    // Splash new theme colors
    const colors = theme.splatColors;
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.3;
      const r = 0.1 + Math.random() * 0.15;
      const x = 0.5 + Math.cos(angle) * r;
      const y = 0.5 + Math.sin(angle) * r;
      const dx = Math.cos(angle) * 25;
      const dy = Math.sin(angle) * 25;
      const c = colors[i % colors.length];
      this.fluidSim.splat(x, y, dx, dy, { r: c.r * 2.5, g: c.g * 2.5, b: c.b * 2.5 });
    }

    document.body.style.background = theme.bgGradient[0];

    document.querySelectorAll('.theme-card').forEach((card) => {
      card.classList.toggle('active', card.dataset.theme === themeName);
    });
  }

  _initUI() {
    // Theme panel
    const panel = document.getElementById('theme-panel');
    Object.entries(themes).forEach(([key, theme]) => {
      const card = document.createElement('div');
      card.className = `theme-card ${key === this.currentTheme ? 'active' : ''}`;
      card.dataset.theme = key;
      card.style.background = theme.cardBg;
      card.innerHTML = `<span class="theme-label">${theme.name}</span>`;
      card.addEventListener('click', () => {
        this._applyTheme(key);
      });
      panel.appendChild(card);
    });

    document.getElementById('btn-theme').addEventListener('click', () => {
      this.themePanelOpen = !this.themePanelOpen;
      document.getElementById('theme-panel').classList.toggle('open', this.themePanelOpen);
      document.getElementById('btn-theme').classList.toggle('active', this.themePanelOpen);
    });

    document.getElementById('btn-sound').addEventListener('click', async () => {
      if (!this.soundEngine.initialized) {
        await this.soundEngine.init();
      }
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

    // Start button - initializes sound and dismisses overlay
    document.getElementById('start-btn').addEventListener('click', async () => {
      await this.soundEngine.init();
      this.started = true;
      document.getElementById('start-screen').classList.add('fade-out');
      setTimeout(() => {
        document.getElementById('start-screen').style.display = 'none';
      }, 800);
      // Big splash on start
      this._burstSplat();
    });
  }

  _burstSplat() {
    const theme = themes[this.currentTheme];
    const colors = theme.splatColors;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const r = 0.05 + Math.random() * 0.2;
      const x = 0.5 + Math.cos(angle) * r;
      const y = 0.5 + Math.sin(angle) * r;
      const dx = Math.cos(angle) * 30 + (Math.random() - 0.5) * 10;
      const dy = Math.sin(angle) * 30 + (Math.random() - 0.5) * 10;
      const c = colors[i % colors.length];
      this.fluidSim.splat(x, y, dx, dy, { r: c.r * 3, g: c.g * 3, b: c.b * 3 });
    }
  }

  _initEvents() {
    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      const w = Math.floor(window.innerWidth / 2);
      const h = Math.floor(window.innerHeight / 2);
      this.sceneRT.setSize(window.innerWidth, window.innerHeight);
      this.bloomRT1.setSize(w, h);
      this.bloomRT2.setSize(w, h);
      this.blurMat.uniforms.uResolution.value.set(w, h);
    });

    const canvas = this.renderer.domElement;

    // Mouse
    canvas.addEventListener('mousedown', (e) => this._onPointerDown(0, e.clientX, e.clientY));
    canvas.addEventListener('mousemove', (e) => this._onPointerMove(0, e.clientX, e.clientY, e.buttons > 0));
    canvas.addEventListener('mouseup', () => this._onPointerUp(0));

    // Touch
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (!this.started) {
        // Auto-start on first touch
        this.started = true;
        this.soundEngine.init();
        document.getElementById('start-screen').classList.add('fade-out');
        setTimeout(() => {
          document.getElementById('start-screen').style.display = 'none';
        }, 800);
      }
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
    const nx = x / window.innerWidth;
    const ny = 1.0 - y / window.innerHeight;
    this.pointers.set(id, { x: nx, y: ny });

    const theme = themes[this.currentTheme];
    const color = theme.splatColors[Math.floor(Math.random() * theme.splatColors.length)];
    // Big, vivid splat on touch
    this.fluidSim.splat(nx, ny, 0, 0, { r: color.r * 3, g: color.g * 3, b: color.b * 3 });
    if (this.soundEngine.initialized) {
      this.soundEngine.playRipple(nx, ny, 0.7);
    }
  }

  _onPointerMove(id, x, y, isDown) {
    const nx = x / window.innerWidth;
    const ny = 1.0 - y / window.innerHeight;

    if (isDown && this.pointers.has(id)) {
      const last = this.pointers.get(id);
      const dx = nx - last.x;
      const dy = ny - last.y;
      const velocity = Math.sqrt(dx * dx + dy * dy);

      if (velocity > 0.0005) {
        const theme = themes[this.currentTheme];
        const color = theme.splatColors[Math.floor(Math.random() * theme.splatColors.length)];
        // More force, more color
        this.fluidSim.splat(nx, ny, dx * 80, dy * 80, {
          r: color.r * 2.5,
          g: color.g * 2.5,
          b: color.b * 2.5,
        });

        if (this.soundEngine.initialized && Math.random() < 0.12) {
          this.soundEngine.playDrag(nx, ny, velocity);
        }
      }
      this.pointers.set(id, { x: nx, y: ny });
    }
  }

  _onPointerUp(id) {
    this.pointers.delete(id);
  }

  _animate() {
    requestAnimationFrame(() => this._animate());

    const time = performance.now() * 0.001;

    // Auto splats (ambient movement)
    this.autoSplatTimer += 1;
    if (this.autoSplatTimer > 30) {
      this.autoSplatTimer = 0;
      this._doAutoSplat();
    }

    // Step fluid simulation
    this.fluidSim.step(0.016);

    // === Render fluid to scene RT ===
    this.displayMat.uniforms.uDyeMap.value = this.fluidSim.getDyeTexture();
    this.displayMat.uniforms.uTime.value = time;
    this._renderQuad(this.displayMat, this.sceneRT);

    // === Bloom pass ===
    // 1. Threshold
    this.thresholdMat.uniforms.uTexture.value = this.sceneRT.texture;
    this._renderQuad(this.thresholdMat, this.bloomRT1);

    // 2. Horizontal blur
    this.blurMat.uniforms.uTexture.value = this.bloomRT1.texture;
    this.blurMat.uniforms.uDirection.value.set(1, 0);
    this._renderQuad(this.blurMat, this.bloomRT2);

    // 3. Vertical blur
    this.blurMat.uniforms.uTexture.value = this.bloomRT2.texture;
    this.blurMat.uniforms.uDirection.value.set(0, 1);
    this._renderQuad(this.blurMat, this.bloomRT1);

    // 4. Second blur pass for smoother bloom
    this.blurMat.uniforms.uTexture.value = this.bloomRT1.texture;
    this.blurMat.uniforms.uDirection.value.set(1, 0);
    this._renderQuad(this.blurMat, this.bloomRT2);

    this.blurMat.uniforms.uTexture.value = this.bloomRT2.texture;
    this.blurMat.uniforms.uDirection.value.set(0, 1);
    this._renderQuad(this.blurMat, this.bloomRT1);

    // === Composite to screen ===
    this.compositeMat.uniforms.uScene.value = this.sceneRT.texture;
    this.compositeMat.uniforms.uBloom.value = this.bloomRT1.texture;
    this.quad.material = this.compositeMat;
    this.renderer.setRenderTarget(null);
    this.renderer.clear();
    this.renderer.render(this.quadScene, this.quadCamera);
  }
}

// Boot
new LiquidArt();
