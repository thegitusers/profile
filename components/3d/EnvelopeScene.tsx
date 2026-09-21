"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function Envelope({ mouse }: { mouse: { x: number; y: number } }) {
  const groupRef = useRef<THREE.Group>(null!);
  const flapRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.12;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y, 
        mouse.x * 0.6, 
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x, 
        mouse.y * -0.3, 
        0.05
      );
    }
    if (flapRef.current) {
      flapRef.current.rotation.x = THREE.MathUtils.lerp(
        flapRef.current.rotation.x,
        -0.6 + mouse.y * 0.15,
        0.08
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Envelope body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 1.9, 0.18]} />
        <meshPhongMaterial color="#f8f8f8" shininess={6} specular="#111" />
      </mesh>

      {/* Envelope flap (top triangle-ish) */}
      <group ref={flapRef} position={[0, 0.95, 0.05]} rotation={[-0.6, 0, 0]}>
        <mesh castShadow>
          <coneGeometry args={[1.5, 0.9, 3, 1, true]} />
          <meshPhongMaterial color="#111111" side={THREE.DoubleSide} shininess={4} />
        </mesh>
      </group>

      {/* Subtle seal / stamp accent */}
      <mesh position={[0.9, 0.2, 0.12]} rotation={[0, 0, 0.6]} castShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.04, 32]} />
        <meshPhongMaterial color="#1f1f1f" />
      </mesh>

      {/* Small floating paper plane accents */}
      <mesh position={[-2.2, 1.4, -1]} rotation={[0.8, 0.6, 0.3]} scale={0.6}>
        <planeGeometry args={[0.9, 0.6]} />
        <meshPhongMaterial color="#e5e5e5" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

interface EnvelopeSceneProps {
  className?: string;
}

export default function EnvelopeScene({ className = "" }: EnvelopeSceneProps) {
  const [mouse, setMouse] = React.useState({ x: 0, y: 0 });

  return (
    <div 
      className={`canvas-container w-full h-full min-h-[380px] ${className}`}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMouse({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
        });
      }}
      onPointerLeave={() => setMouse({ x: 0, y: 0 })}
    >
      <Canvas
        camera={{ position: [0, 0.8, 6.2], fov: 46 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 10, -4]} intensity={1.3} castShadow />
        <pointLight position={[-4, -2, 3]} intensity={0.3} />

        <React.Suspense fallback={null}>
          <Envelope mouse={mouse} />
          <ContactShadows 
            position={[0, -1.8, 0]} 
            opacity={0.18} 
            scale={9} 
            blur={3} 
            far={5.5} 
          />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
