import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// вузли-«острівці» вздовж траси польоту; повз них пролітає камера
const NODES: { pos: [number, number, number]; scale: number; speed: number }[] = [
  { pos: [-14, 7, -92], scale: 2.7, speed: 0.3 },
  { pos: [14, -7, -150], scale: 3.8, speed: -0.22 },
  { pos: [-9, 8, -210], scale: 3.4, speed: 0.26 },
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
      {/* каркас — світиться під bloom */}
      <mesh>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#ffb224" wireframe transparent opacity={0.85} />
      </mesh>
      {/* ядро */}
      <mesh scale={0.42}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#ff7a18" />
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
