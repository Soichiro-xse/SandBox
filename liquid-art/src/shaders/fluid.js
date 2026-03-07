// GPU-based fluid simulation shaders
// Based on Navier-Stokes equations for incompressible fluid

export const advectionShader = {
  uniforms: {
    uVelocity: { value: null },
    uSource: { value: null },
    texelSize: { value: null },
    dt: { value: 0.016 },
    dissipation: { value: 0.98 },
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
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 texelSize;
    uniform float dt;
    uniform float dissipation;
    varying vec2 vUv;

    void main() {
      vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
      gl_FragColor = dissipation * texture2D(uSource, coord);
    }
  `,
};

export const divergenceShader = {
  uniforms: {
    uVelocity: { value: null },
    texelSize: { value: null },
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
    uniform sampler2D uVelocity;
    uniform vec2 texelSize;
    varying vec2 vUv;

    void main() {
      float L = texture2D(uVelocity, vUv - vec2(texelSize.x, 0.0)).x;
      float R = texture2D(uVelocity, vUv + vec2(texelSize.x, 0.0)).x;
      float T = texture2D(uVelocity, vUv + vec2(0.0, texelSize.y)).y;
      float B = texture2D(uVelocity, vUv - vec2(0.0, texelSize.y)).y;
      float div = 0.5 * (R - L + T - B);
      gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
    }
  `,
};

export const pressureShader = {
  uniforms: {
    uPressure: { value: null },
    uDivergence: { value: null },
    texelSize: { value: null },
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
    uniform sampler2D uPressure;
    uniform sampler2D uDivergence;
    uniform vec2 texelSize;
    varying vec2 vUv;

    void main() {
      float L = texture2D(uPressure, vUv - vec2(texelSize.x, 0.0)).x;
      float R = texture2D(uPressure, vUv + vec2(texelSize.x, 0.0)).x;
      float T = texture2D(uPressure, vUv + vec2(0.0, texelSize.y)).x;
      float B = texture2D(uPressure, vUv - vec2(0.0, texelSize.y)).x;
      float divergence = texture2D(uDivergence, vUv).x;
      float pressure = (L + R + B + T - divergence) * 0.25;
      gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
    }
  `,
};

export const gradientSubtractShader = {
  uniforms: {
    uPressure: { value: null },
    uVelocity: { value: null },
    texelSize: { value: null },
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
    uniform sampler2D uPressure;
    uniform sampler2D uVelocity;
    uniform vec2 texelSize;
    varying vec2 vUv;

    void main() {
      float L = texture2D(uPressure, vUv - vec2(texelSize.x, 0.0)).x;
      float R = texture2D(uPressure, vUv + vec2(texelSize.x, 0.0)).x;
      float T = texture2D(uPressure, vUv + vec2(0.0, texelSize.y)).x;
      float B = texture2D(uPressure, vUv - vec2(0.0, texelSize.y)).x;
      vec2 velocity = texture2D(uVelocity, vUv).xy;
      velocity.xy -= vec2(R - L, T - B);
      gl_FragColor = vec4(velocity, 0.0, 1.0);
    }
  `,
};

export const splatShader = {
  uniforms: {
    uTarget: { value: null },
    point: { value: null },
    color: { value: null },
    radius: { value: 0.01 },
    aspectRatio: { value: 1.0 },
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
    uniform sampler2D uTarget;
    uniform vec2 point;
    uniform vec3 color;
    uniform float radius;
    uniform float aspectRatio;
    varying vec2 vUv;

    void main() {
      vec2 p = vUv - point;
      p.x *= aspectRatio;
      float d = dot(p, p);
      float splat = exp(-d / radius);
      vec3 base = texture2D(uTarget, vUv).xyz;
      gl_FragColor = vec4(base + splat * color, 1.0);
    }
  `,
};

export const curlShader = {
  uniforms: {
    uVelocity: { value: null },
    texelSize: { value: null },
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
    uniform sampler2D uVelocity;
    uniform vec2 texelSize;
    varying vec2 vUv;

    void main() {
      float L = texture2D(uVelocity, vUv - vec2(texelSize.x, 0.0)).y;
      float R = texture2D(uVelocity, vUv + vec2(texelSize.x, 0.0)).y;
      float T = texture2D(uVelocity, vUv + vec2(0.0, texelSize.y)).x;
      float B = texture2D(uVelocity, vUv - vec2(0.0, texelSize.y)).x;
      float vorticity = R - L - T + B;
      gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
    }
  `,
};

export const vorticityShader = {
  uniforms: {
    uVelocity: { value: null },
    uCurl: { value: null },
    texelSize: { value: null },
    curl: { value: 30.0 },
    dt: { value: 0.016 },
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
    uniform sampler2D uVelocity;
    uniform sampler2D uCurl;
    uniform vec2 texelSize;
    uniform float curl;
    uniform float dt;
    varying vec2 vUv;

    void main() {
      float L = texture2D(uCurl, vUv - vec2(texelSize.x, 0.0)).x;
      float R = texture2D(uCurl, vUv + vec2(texelSize.x, 0.0)).x;
      float T = texture2D(uCurl, vUv + vec2(0.0, texelSize.y)).x;
      float B = texture2D(uCurl, vUv - vec2(0.0, texelSize.y)).x;
      float C = texture2D(uCurl, vUv).x;
      vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
      force /= length(force) + 0.0001;
      force *= curl * C;
      force.y *= -1.0;
      vec2 velocity = texture2D(uVelocity, vUv).xy;
      velocity += force * dt;
      velocity = min(max(velocity, -1000.0), 1000.0);
      gl_FragColor = vec4(velocity, 0.0, 1.0);
    }
  `,
};
