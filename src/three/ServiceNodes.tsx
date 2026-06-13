import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// вузли-«острівці» вздовж траси польоту; повз них пролітає камера
// вузли зміщені праворуч і вглиб — у зоні заголовка (зліва) їх немає,
// головна домінанта там лишається одна (частинки)
const NODES: { pos: [number, number, number]; scale: number; speed: number }[] = [
  { pos: [12, 7, -150], scale: 3.0, speed: 0.3 },
  { pos: [17, -8, -188], scale: 3.6, speed: -0.22 },
  { pos: [-13, 9, -212], scale: 3.4, speed: 0.26 },
];

function Node({ pos, scale, speed }: (typeof NODES)[number]) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * speed;
      ref.current.rotation.x += dt * speed * 0.4;
    }
  });
  return (
    <group ref={ref} position={pos} scale={scale}>
      {/* каркас — світиться під bloom, але приглушений, щоб лишатись у фоні */}
      <mesh>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#ffb224" wireframe transparent opacity={0.5} fog />
      </mesh>
      {/* ядро */}
      <mesh scale={0.38}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#d98e00" fog />
      </mesh>
    </group>
  );
}

export default function ServiceNodes() {
  return (
    <>
      {NODES.map((n, i) => (
        <Node key={i} {...n} />
      ))}
    </>
  );
}
