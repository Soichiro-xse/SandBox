import * as THREE from 'three';
import {
  advectionShader,
  divergenceShader,
  pressureShader,
  gradientSubtractShader,
  splatShader,
  curlShader,
  vorticityShader,
} from './shaders/fluid.js';

class DoubleFBO {
  constructor(renderer, width, height, options) {
    this.read = this._createFBO(renderer, width, height, options);
    this.write = this._createFBO(renderer, width, height, options);
  }

  _createFBO(renderer, width, height, options) {
    const fbo = new THREE.WebGLRenderTarget(width, height, {
      minFilter: options.filtering || THREE.LinearFilter,
      magFilter: options.filtering || THREE.LinearFilter,
      format: options.format || THREE.RGBAFormat,
      type: options.type || THREE.HalfFloatType,
      depthBuffer: false,
      stencilBuffer: false,
    });
    return fbo;
  }

  swap() {
    [this.read, this.write] = [this.write, this.read];
  }

  dispose() {
    this.read.dispose();
    this.write.dispose();
  }
}

export class FluidSimulation {
  constructor(renderer, simWidth = 256, simHeight = 256) {
    this.renderer = renderer;
    this.simWidth = simWidth;
    this.simHeight = simHeight;

    const texelSize = new THREE.Vector2(1.0 / simWidth, 1.0 / simHeight);
    const fboOpts = { type: THREE.HalfFloatType };

    this.velocity = new DoubleFBO(renderer, simWidth, simHeight, fboOpts);
    this.pressure = new DoubleFBO(renderer, simWidth, simHeight, fboOpts);
    this.dye = new DoubleFBO(renderer, simWidth * 2, simHeight * 2, fboOpts);
    this.divergenceFBO = this._createSingleFBO(simWidth, simHeight, fboOpts);
    this.curlFBO = this._createSingleFBO(simWidth, simHeight, fboOpts);

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
    this.scene.add(this.quad);

    // Create shader materials
    this.advectionMat = this._createMaterial(advectionShader, texelSize);
    this.divergenceMat = this._createMaterial(divergenceShader, texelSize);
    this.pressureMat = this._createMaterial(pressureShader, texelSize);
    this.gradientMat = this._createMaterial(gradientSubtractShader, texelSize);
    this.splatMat = this._createMaterial(splatShader, texelSize);
    this.curlMat = this._createMaterial(curlShader, texelSize);
    this.vorticityMat = this._createMaterial(vorticityShader, texelSize);

    this.config = {
      curl: 30,
      pressureIterations: 20,
      velocityDissipation: 0.98,
      dyeDissipation: 0.97,
      splatRadius: 0.004,
    };
  }

  _createSingleFBO(width, height, options) {
    return new THREE.WebGLRenderTarget(width, height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: options.type || THREE.HalfFloatType,
      depthBuffer: false,
      stencilBuffer: false,
    });
  }

  _createMaterial(shader, texelSize) {
    const mat = new THREE.ShaderMaterial({
      uniforms: JSON.parse(JSON.stringify(shader.uniforms)),
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
      depthTest: false,
      depthWrite: false,
    });
    if (mat.uniforms.texelSize) {
      mat.uniforms.texelSize.value = texelSize;
    }
    return mat;
  }

  _render(material, target) {
    this.quad.material = material;
    this.renderer.setRenderTarget(target);
    this.renderer.render(this.scene, this.camera);
    this.renderer.setRenderTarget(null);
  }

  splat(x, y, dx, dy, color) {
    // Splat velocity
    this.splatMat.uniforms.uTarget.value = this.velocity.read.texture;
    this.splatMat.uniforms.point.value = new THREE.Vector2(x, y);
    this.splatMat.uniforms.color.value = new THREE.Vector3(dx * 10, dy * 10, 0);
    this.splatMat.uniforms.radius.value = this.config.splatRadius;
    this.splatMat.uniforms.aspectRatio.value = this.simWidth / this.simHeight;
    this._render(this.splatMat, this.velocity.write);
    this.velocity.swap();

    // Splat dye
    this.splatMat.uniforms.uTarget.value = this.dye.read.texture;
    this.splatMat.uniforms.color.value = new THREE.Vector3(color.r, color.g, color.b);
    this.splatMat.uniforms.radius.value = this.config.splatRadius * 2;
    this._render(this.splatMat, this.dye.write);
    this.dye.swap();
  }

  step(dt) {
    // Curl
    this.curlMat.uniforms.uVelocity.value = this.velocity.read.texture;
    this._render(this.curlMat, this.curlFBO);

    // Vorticity confinement
    this.vorticityMat.uniforms.uVelocity.value = this.velocity.read.texture;
    this.vorticityMat.uniforms.uCurl.value = this.curlFBO.texture;
    this.vorticityMat.uniforms.curl.value = this.config.curl;
    this.vorticityMat.uniforms.dt.value = dt;
    this._render(this.vorticityMat, this.velocity.write);
    this.velocity.swap();

    // Divergence
    this.divergenceMat.uniforms.uVelocity.value = this.velocity.read.texture;
    this._render(this.divergenceMat, this.divergenceFBO);

    // Pressure solve (Jacobi iteration)
    for (let i = 0; i < this.config.pressureIterations; i++) {
      this.pressureMat.uniforms.uPressure.value = this.pressure.read.texture;
      this.pressureMat.uniforms.uDivergence.value = this.divergenceFBO.texture;
      this._render(this.pressureMat, this.pressure.write);
      this.pressure.swap();
    }

    // Gradient subtraction
    this.gradientMat.uniforms.uPressure.value = this.pressure.read.texture;
    this.gradientMat.uniforms.uVelocity.value = this.velocity.read.texture;
    this._render(this.gradientMat, this.velocity.write);
    this.velocity.swap();

    // Advect velocity
    this.advectionMat.uniforms.uVelocity.value = this.velocity.read.texture;
    this.advectionMat.uniforms.uSource.value = this.velocity.read.texture;
    this.advectionMat.uniforms.dt.value = dt;
    this.advectionMat.uniforms.dissipation.value = this.config.velocityDissipation;
    this._render(this.advectionMat, this.velocity.write);
    this.velocity.swap();

    // Advect dye
    this.advectionMat.uniforms.uVelocity.value = this.velocity.read.texture;
    this.advectionMat.uniforms.uSource.value = this.dye.read.texture;
    this.advectionMat.uniforms.dissipation.value = this.config.dyeDissipation;
    this._render(this.advectionMat, this.dye.write);
    this.dye.swap();
  }

  getDyeTexture() {
    return this.dye.read.texture;
  }

  getVelocityTexture() {
    return this.velocity.read.texture;
  }

  dispose() {
    this.velocity.dispose();
    this.pressure.dispose();
    this.dye.dispose();
    this.divergenceFBO.dispose();
    this.curlFBO.dispose();
  }
}
