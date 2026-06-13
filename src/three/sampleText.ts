/**
 * Семплює точки з контуру тексту через offscreen-canvas.
 * Повертає Float32Array (xyz) із `count` точок, відцентрованих навколо 0,
 * у світових одиницях шириною ~`spread`.
 */
export function sampleText(
  text: string,
  count: number,
  spread = 14,
  zJitter = 0.6,
): Float32Array {
  const cw = 512;
  const ch = 256;
  const canvas = document.createElement('canvas');
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#fff';
  ctx.font = '700 200px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, cw / 2, ch / 2 + 8);

  const data = ctx.getImageData(0, 0, cw, ch).data;
  const hits: number[] = [];
  // крок 2px достатньо щільний і швидкий
  for (let y = 0; y < ch; y += 2) {
    for (let x = 0; x < cw; x += 2) {
      if (data[(y * cw + x) * 4 + 3] > 128) hits.push(x, y);
    }
  }

  const out = new Float32Array(count * 3);
  const pairs = hits.length / 2;
  const sx = spread / cw;

  for (let i = 0; i < count; i++) {
    let px: number;
    let py: number;
    if (pairs > 0) {
      const k = (Math.floor(Math.random() * pairs) * 2) | 0;
      px = hits[k];
      py = hits[k + 1];
    } else {
      px = Math.random() * cw;
      py = Math.random() * ch;
    }
    out[i * 3] = (px - cw / 2) * sx + (Math.random() - 0.5) * 0.06;
    out[i * 3 + 1] = -(py - ch / 2) * sx + (Math.random() - 0.5) * 0.06;
    out[i * 3 + 2] = (Math.random() - 0.5) * zJitter;
  }

  return out;
}

/** Випадкова сфера радіуса R — стартова хмара для intro-морфу. */
export function sampleSphere(count: number, r = 11): Float32Array {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const rad = r * (0.7 + Math.random() * 0.3);
    out[i * 3] = rad * Math.sin(phi) * Math.cos(theta);
    out[i * 3 + 1] = rad * Math.sin(phi) * Math.sin(theta);
    out[i * 3 + 2] = rad * Math.cos(phi);
  }
  return out;
}
