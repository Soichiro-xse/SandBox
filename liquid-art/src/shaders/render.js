// Full-screen fluid art rendering shaders with bloom

export const fluidDisplayVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export const fluidDisplayFragmentShader = `
  precision highp float;

  uniform sampler2D uDyeMap;
  uniform float uTime;
  uniform float uIntensity;

  varying vec2 vUv;

  vec3 vibrancy(vec3 color) {
    float mx = max(color.r, max(color.g, color.b));
    float mn = min(color.r, min(color.g, color.b));
    float sat = mx > 0.0 ? (mx - mn) / mx : 0.0;
    return mix(color, color * 1.4, 1.0 - sat);
  }

  void main() {
    vec3 dye = texture2D(uDyeMap, vUv).rgb;

    // Boost colors dramatically
    dye *= uIntensity;
    dye = vibrancy(dye);

    // Add subtle background glow based on dye presence
    float energy = length(dye);
    vec3 bgColor = vec3(0.01, 0.01, 0.03);
    vec3 color = max(dye, bgColor);

    // Soft vignette
    float vig = 1.0 - smoothstep(0.4, 1.4, length((vUv - 0.5) * 1.8));
    color *= 0.7 + vig * 0.3;

    // Tone mapping (ACES-ish)
    color = color / (color + vec3(0.6));
    color = pow(color, vec3(1.0 / 2.2));

    gl_FragColor = vec4(color, 1.0);
  }
`;

// Bloom threshold pass
export const bloomThresholdFragmentShader = `
  precision highp float;
  uniform sampler2D uTexture;
  uniform float uThreshold;
  varying vec2 vUv;

  void main() {
    vec3 color = texture2D(uTexture, vUv).rgb;
    float brightness = dot(color, vec3(0.2126, 0.7152, 0.0722));
    vec3 bloom = max(color - vec3(uThreshold), vec3(0.0));
    gl_FragColor = vec4(bloom, 1.0);
  }
`;

// Gaussian blur pass
export const blurFragmentShader = `
  precision highp float;
  uniform sampler2D uTexture;
  uniform vec2 uDirection;
  uniform vec2 uResolution;
  varying vec2 vUv;

  void main() {
    vec2 texelSize = 1.0 / uResolution;
    vec3 result = vec3(0.0);
    float weights[5];
    weights[0] = 0.227027;
    weights[1] = 0.1945946;
    weights[2] = 0.1216216;
    weights[3] = 0.054054;
    weights[4] = 0.016216;

    result += texture2D(uTexture, vUv).rgb * weights[0];
    for (int i = 1; i < 5; i++) {
      vec2 offset = uDirection * texelSize * float(i) * 2.0;
      result += texture2D(uTexture, vUv + offset).rgb * weights[i];
      result += texture2D(uTexture, vUv - offset).rgb * weights[i];
    }
    gl_FragColor = vec4(result, 1.0);
  }
`;

// Final composite (fluid + bloom)
export const compositeFragmentShader = `
  precision highp float;
  uniform sampler2D uScene;
  uniform sampler2D uBloom;
  uniform float uBloomStrength;
  varying vec2 vUv;

  void main() {
    vec3 scene = texture2D(uScene, vUv).rgb;
    vec3 bloom = texture2D(uBloom, vUv).rgb;
    vec3 color = scene + bloom * uBloomStrength;

    gl_FragColor = vec4(color, 1.0);
  }
`;
