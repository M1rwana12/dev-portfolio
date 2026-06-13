import { useThree, useFrame } from '@react-three/fiber';
import { input } from './input';

const Z_START = 9;
const Z_END = -205;

/**
 * Веде камеру вперед по -Z пропорційно прогресу скролу (плавний lerp),
 * додає мʼякий параллакс від курсора. Жодних React-ререндерів.
 */
export default function CameraRig() {
  const camera = useThree((s) => s.camera);

  useFrame((_, dt) => {
    const k = Math.min(dt * 2.2, 1);
    const targetZ = Z_START + (Z_END - Z_START) * input.scroll;
    camera.position.z += (targetZ - camera.position.z) * k;

    const tx = input.mx * 1.0;
    const ty = -input.my * 0.7;
    camera.position.x += (tx - camera.position.x) * k;
    camera.position.y += (ty - camera.position.y) * k;

    // легкий нахил погляду до курсора
    camera.rotation.y += (-input.mx * 0.05 - camera.rotation.y) * k;
    camera.rotation.x += (input.my * 0.035 - camera.rotation.x) * k;
  });

  return null;
}
