// Water surface rendering shaders

export const waterVertexShader = `
  uniform sampler2D uHeightMap;
  uniform sampler2D uVelocityMap;
  uniform float uDisplacement;
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vHeight;
  varying vec2 vVelocity;

  void main() {
    vUv = uv;

    // Sample height from fluid sim
    vec4 heightData = texture2D(uHeightMap, uv);
    float height = (heightData.r + heightData.g + heightData.b) * 0.333;
    vHeight = height;

    // Sample velocity for effects
    vVelocity = texture2D(uVelocityMap, uv).xy;

    // Compute normal from height map
    float texel = 1.0 / 512.0;
    float hL = texture2D(uHeightMap, uv - vec2(texel, 0.0)).r;
    float hR = texture2D(uHeightMap, uv + vec2(texel, 0.0)).r;
    float hD = texture2D(uHeightMap, uv - vec2(0.0, texel)).r;
    float hU = texture2D(uHeightMap, uv + vec2(0.0, texel)).r;

    vec3 n = normalize(vec3(hL - hR, 2.0 * texel, hD - hU));
    vNormal = normalMatrix * n;

    // Displace vertex
    vec3 pos = position;
    pos.y += height * uDisplacement;

    // Add subtle ambient waves
    pos.y += sin(pos.x * 3.0 + uTime * 0.5) * 0.02;
    pos.y += sin(pos.z * 2.5 + uTime * 0.3) * 0.015;

    vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const waterFragmentShader = `
  precision highp float;

  uniform vec3 uDeepColor;
  uniform vec3 uShallowColor;
  uniform vec3 uFresnelColor;
  uniform vec3 uSpecularColor;
  uniform vec3 uLightDir;
  uniform vec3 uCameraPos;
  uniform float uTime;
  uniform float uFresnelPower;
  uniform float uSpecularPower;
  uniform samplerCube uEnvMap;
  uniform float uEnvMapIntensity;
  uniform sampler2D uDyeMap;
  uniform float uDyeIntensity;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vHeight;
  varying vec2 vVelocity;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(uCameraPos - vWorldPos);
    vec3 lightDir = normalize(uLightDir);

    // Fresnel effect
    float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), uFresnelPower);

    // Depth-based color mixing
    float depth = smoothstep(-0.1, 0.5, vHeight);
    vec3 waterColor = mix(uDeepColor, uShallowColor, depth);

    // Dye color from fluid sim
    vec3 dye = texture2D(uDyeMap, vUv).rgb;
    waterColor = mix(waterColor, dye * 1.5, uDyeIntensity * length(dye));

    // Specular highlight
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), uSpecularPower);

    // Reflection via environment map
    vec3 reflectDir = reflect(-viewDir, normal);
    vec3 envColor = textureCube(uEnvMap, reflectDir).rgb * uEnvMapIntensity;

    // Caustics pattern
    float caustic1 = sin(vUv.x * 30.0 + uTime * 1.2) * sin(vUv.y * 30.0 + uTime * 0.8);
    float caustic2 = sin(vUv.x * 25.0 - uTime * 0.9) * sin(vUv.y * 35.0 + uTime * 1.1);
    float caustics = max(0.0, (caustic1 + caustic2) * 0.15) * (1.0 - depth);

    // Compose
    vec3 color = waterColor;
    color = mix(color, uFresnelColor, fresnel * 0.6);
    color += envColor * fresnel * 0.4;
    color += uSpecularColor * spec * 1.5;
    color += vec3(caustics * 0.3, caustics * 0.5, caustics * 0.7);

    // Velocity-based shimmer
    float shimmer = length(vVelocity) * 0.1;
    color += shimmer * uSpecularColor * 0.3;

    // Subtle vignette from edges
    float vignette = 1.0 - smoothstep(0.3, 0.8, length(vUv - 0.5));
    color *= 0.8 + vignette * 0.2;

    // Tone mapping
    color = color / (color + vec3(1.0));
    color = pow(color, vec3(1.0 / 2.2));

    gl_FragColor = vec4(color, 0.92 + fresnel * 0.08);
  }
`;

export const displayShader = {
  uniforms: {
    uTexture: { value: null },
    uIntensity: { value: 1.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    precision highp float;
    uniform sampler2D uTexture;
    uniform float uIntensity;
    varying vec2 vUv;

    void main() {
      vec3 color = texture2D(uTexture, vUv).rgb * uIntensity;
      gl_FragColor = vec4(color, 1.0);
    }
  `,
};
