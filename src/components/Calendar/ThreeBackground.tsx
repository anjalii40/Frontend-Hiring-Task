"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { MonthJourneyTheme } from "@/data/monthJourneyThemes";

function seededValue(index: number, offset: number) {
  const value = Math.sin(index * 12.9898 + offset * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function Particles({
  count,
  dark,
  theme,
}: {
  count: number;
  dark: boolean;
  theme: MonthJourneyTheme;
}) {
  const mesh = useRef<THREE.Points>(null!);
  const { mouse } = useThree();
  const intensity = theme.intensity;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const accent = new THREE.Color(dark ? theme.particle : theme.accentHover);
    const soft = new THREE.Color(dark ? theme.particleSoft : theme.accent);

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (seededValue(i, 1) - 0.5) * 14;
      pos[i * 3 + 1] = (seededValue(i, 2) - 0.5) * 10;
      pos[i * 3 + 2] = (seededValue(i, 3) - 0.5) * 6;

      const color = seededValue(i, 4) > 0.52 ? accent : soft;
      col[i * 3 + 0] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }

    return [pos, col];
  }, [count, dark, theme.accent, theme.accentHover, theme.particle, theme.particleSoft]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const arr = mesh.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      arr[ix] += Math.cos(t * (0.22 + intensity * 0.2) + i * 0.9) * (0.001 + intensity * 0.001);
      arr[ix + 1] += Math.sin(t * (0.3 + intensity * 0.28) + i * 1.3) * (0.0016 + intensity * 0.0014);
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.rotation.y = mouse.x * 0.08;
    mesh.current.rotation.x = -mouse.y * 0.05;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={(dark ? 0.03 : 0.038) + intensity * 0.02}
        vertexColors
        transparent
        opacity={(dark ? 0.42 : 0.58) + intensity * (dark ? 0.32 : 0.24)}
        sizeAttenuation
      />
    </points>
  );
}

function EnergyRing({ dark, theme, position }: { dark: boolean; theme: MonthJourneyTheme; position: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    mesh.current.rotation.x = t * (0.12 + theme.intensity * 0.1);
    mesh.current.rotation.z = t * (0.08 + theme.intensity * 0.08);
  });

  return (
    <mesh ref={mesh} position={position}>
      <torusGeometry args={[1.2, 0.01, 12, 90]} />
      <meshBasicMaterial
        color={dark ? theme.particle : theme.accentHover}
        transparent
        opacity={(dark ? 0.14 : 0.24) + theme.intensity * (dark ? 0.2 : 0.18)}
      />
    </mesh>
  );
}

function FlowingMesh({ dark, theme }: { dark: boolean; theme: MonthJourneyTheme }) {
  const mesh = useRef<THREE.Mesh>(null!);
  const { mouse } = useThree();
  const intensity = theme.intensity;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const geometry = mesh.current.geometry as THREE.PlaneGeometry;
    const position = geometry.attributes.position;

    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      position.setZ(
        i,
        Math.sin(x * 0.85 + t * (0.45 + intensity * 0.35)) * (0.04 + intensity * 0.07) +
          Math.cos(y * 1.1 + t * (0.35 + intensity * 0.3)) * (0.03 + intensity * 0.05)
      );
    }

    position.needsUpdate = true;
    mesh.current.rotation.x = -0.85 + mouse.y * 0.04;
    mesh.current.rotation.z = mouse.x * 0.05;
  });

  return (
    <mesh ref={mesh} position={[0, -2.8, -2.8]} rotation={[-0.85, 0, 0]}>
      <planeGeometry args={[13, 5, 36, 14]} />
      <meshBasicMaterial
        color={dark ? theme.particle : theme.accentHover}
        wireframe
        transparent
        opacity={(dark ? 0.08 : 0.16) + intensity * (dark ? 0.16 : 0.18)}
      />
    </mesh>
  );
}

export default function ThreeBackground({
  dark,
  theme,
}: {
  dark: boolean;
  theme: MonthJourneyTheme;
}) {
  const particleCount = Math.round(130 + theme.intensity * 90);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: dark ? 1 : 0.95,
      }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Particles count={particleCount} dark={dark} theme={theme} />
        <FlowingMesh dark={dark} theme={theme} />
        <EnergyRing dark={dark} theme={theme} position={[4, -1.5, -3]} />
        <EnergyRing dark={dark} theme={theme} position={[-4.5, 1.5, -2]} />
      </Canvas>
    </div>
  );
}
