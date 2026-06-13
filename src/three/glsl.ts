/**
 * Власні GLSL-примітиви шуму для сцени (без зовнішніх «готових» ефектів).
 * value-noise на хешах + fbm + curl-noise через скінченні різниці
 * векторного потенціалу. Вставляється у фрагмент-шейдери як рядок.
 */

// 3D value-noise + fbm
export const noiseGLSL = /* glsl */ `
  float hash13(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float vnoise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(
        mix(hash13(i + vec3(0.0, 0.0, 0.0)), hash13(i + vec3(1.0, 0.0, 0.0)), f.x),
        mix(hash13(i + vec3(0.0, 1.0, 0.0)), hash13(i + vec3(1.0, 1.0, 0.0)), f.x),
        f.y
      ),
      mix(
        mix(hash13(i + vec3(0.0, 0.0, 1.0)), hash13(i + vec3(1.0, 0.0, 1.0)), f.x),
        mix(hash13(i + vec3(0.0, 1.0, 1.0)), hash13(i + vec3(1.0, 1.0, 1.0)), f.x),
        f.y
      ),
      f.z
    );
  }

  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * vnoise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }
`;

// curl-noise: ротор векторного потенціалу з трьох зсунутих value-noise полів
export const curlGLSL = /* glsl */ `
  vec3 potential(vec3 p) {
    return vec3(
      vnoise(p),
      vnoise(p + vec3(31.4, 17.7, 9.2)),
      vnoise(p + vec3(-19.1, 5.3, 23.8))
    );
  }

  vec3 curlNoise(vec3 p) {
    float e = 0.12;
    vec2 d = vec2(e, 0.0);
    vec3 px0 = potential(p - d.xyy), px1 = potential(p + d.xyy);
    vec3 py0 = potential(p - d.yxy), py1 = potential(p + d.yxy);
    vec3 pz0 = potential(p - d.yyx), pz1 = potential(p + d.yyx);
    float x = (py1.z - py0.z) - (pz1.y - pz0.y);
    float y = (pz1.x - pz0.x) - (px1.z - px0.z);
    float z = (px1.y - px0.y) - (py1.x - py0.x);
    return vec3(x, y, z) / (2.0 * e);
  }
`;
