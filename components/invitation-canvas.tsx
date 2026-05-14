"use client";

import { useRef, useEffect, useState, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Text,
  OrbitControls,
  Environment,
  Sparkles,
  ContactShadows,
  Stars,
  Html,
  useTexture
} from "@react-three/drei";
import { useLanguage } from "@/lib/LanguageContext";
import * as THREE from "three";

interface InvitationCanvasProps {
  data?: {
    names: string;
    date: string;
    location?: string;
    tagline?: string;
  };
  onDataChange?: (newData: Partial<InvitationCanvasProps['data']>) => void;
}

function FallingPetals() {
  const texture = useTexture('/textures/flower.png');
  const count = 150; // Much more flowers
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const petals = useMemo(() => {
    return Array.from({ length: count }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 40, // Wider spread
        Math.random() * 40 - 10,    // Vertical range
        (Math.random() - 0.5) * 25
      ),
      speed: 0.005 + Math.random() * 0.01,
    }));
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    petals.forEach((petal, i) => {
      // Smooth constant fall
      petal.pos.y -= petal.speed;
      
      if (petal.pos.y < -18) {
        petal.pos.y = 18;
        petal.pos.x = (Math.random() - 0.5) * 35;
      }
      
      dummy.position.copy(petal.pos);
      dummy.rotation.set(0, 0, 0); 
      dummy.scale.setScalar(0.9); // Uniform size
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial 
        map={texture}
        transparent 
        side={THREE.DoubleSide}
        onBeforeCompile={(shader) => {
          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <map_fragment>',
            `
            #include <map_fragment>
            // Discard black background pixels
            if (diffuseColor.r < 0.1 && diffuseColor.g < 0.1 && diffuseColor.b < 0.1) {
              discard;
            }
            `
          );
        }}
      />
    </instancedMesh>
  );
}

function ParticleVortex() {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const count = 1000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 2 * 10;
      const r = 2.5 + Math.random() * 1.5; // Widened radius
      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = (i / count - 0.5) * 12; // Tallened vortex
      positions[i * 3 + 2] = Math.sin(theta) * r;
    }
    return positions;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.3;
      const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < pos.length / 3; i++) {
        const yIdx = i * 3 + 1;
        pos[yIdx] += 0.01;
        if (pos[yIdx] > 5) pos[yIdx] = -5;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#d4a574"
        size={0.05}
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Rings() {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ringsGroup = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ring1.current) {
      ring1.current.rotation.x = t * 0.5;
      ring1.current.rotation.y = t * 0.3;
    }
    if (ring2.current) {
      ring2.current.rotation.z = t * 0.4;
      ring2.current.rotation.y = -t * 0.2;
    }
    if (ringsGroup.current) {
      ringsGroup.current.rotation.y = Math.sin(t * 0.2) * 0.2;
    }
  });

  return (
    <>
      {/* RINGS ONLY - These rotate and user can move them */}
      <group ref={ringsGroup}>
        <mesh ref={ring1}>
          <torusGeometry args={[2.5, 0.05, 32, 100]} />
          <meshStandardMaterial color="#d4a574" metalness={1} roughness={0.1} />
        </mesh>
        <mesh ref={ring2} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.3, 0.05, 32, 100]} />
          <meshStandardMaterial color="#98a08d" metalness={0.8} roughness={0.2} />
        </mesh>
        <ParticleVortex />
      </group>
    </>
  );
}

function EternalBond({ data, onDataChange }: InvitationCanvasProps) {
  const { t } = useLanguage();
  
  const handleEdit = (field: keyof NonNullable<InvitationCanvasProps['data']>, value: string) => {
    if (onDataChange) {
      onDataChange({ [field]: value });
    }
  };

  return (
    <group>
      {/* 3D Rings */}
      <Rings />

      {/* TEXT OVERLAY - COMPLETELY STATIONARY & EDITABLE */}
      <Html center>
        <div className="flex flex-col items-center justify-center text-center select-none whitespace-nowrap pointer-events-auto px-4 w-full">
          <h1 
            className="text-4xl sm:text-5xl md:text-7xl font-serif text-[#5c6352] font-bold mb-4 outline-none focus:bg-[#98a08d]/5 px-4 rounded-xl transition-all cursor-text"
            contentEditable={!!onDataChange}
            suppressContentEditableWarning
            onBlur={(e) => handleEdit('names', e.currentTarget.textContent || '')}
          >
            {data?.names || t.defaultNames}
          </h1>
          <p className="text-[10px] sm:text-xs md:text-sm tracking-[0.3em] sm:tracking-[0.5em] text-[#98a08d] uppercase mb-6 sm:mb-8 outline-none focus:bg-[#98a08d]/5 px-4 rounded-xl transition-all cursor-text"
            contentEditable={!!onDataChange}
            suppressContentEditableWarning
            onBlur={(e) => handleEdit('tagline', e.currentTarget.textContent || '')}
          >
            {data?.tagline || t.eternalBond}
          </p>
          <div className="space-y-1">
            <p 
              className="text-base sm:text-lg md:text-xl font-medium text-[#5c6352] outline-none focus:bg-[#98a08d]/5 px-2 rounded-md transition-all cursor-text"
              contentEditable={!!onDataChange}
              suppressContentEditableWarning
              onBlur={(e) => handleEdit('date', e.currentTarget.textContent || '')}
            >
              {data?.date || t.defaultDate}
            </p>
            <p 
              className="text-[10px] sm:text-xs md:text-sm tracking-[0.1em] sm:tracking-[0.2em] text-[#98a08d] uppercase outline-none focus:bg-[#98a08d]/5 px-2 rounded-md transition-all cursor-text"
              contentEditable={!!onDataChange}
              suppressContentEditableWarning
              onBlur={(e) => handleEdit('location', e.currentTarget.textContent || '')}
            >
              {data?.location || t.defaultLocation}
            </p>
          </div>
        </div>
      </Html>
    </group>
  );
}

function KineticScene({ data, onDataChange }: InvitationCanvasProps) {
  const { viewport } = useThree();
  const isMobile = viewport.width < 6;
  const scale = isMobile ? viewport.width / 6 : 1;

  return (
    <group scale={scale}>
      <color attach="background" args={["#faf9f6"]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={2.5} color="#fff4e0" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#e0f4ff" />
      <Environment preset="studio" />

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={100} scale={15} size={2} speed={0.4} color="#d4a574" />

      <EternalBond data={data} onDataChange={onDataChange} />
      <FallingPetals />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI * 0.7}
        minPolarAngle={Math.PI * 0.3}
      />
    </group>
  );
}

export function InvitationCanvas({ data, onDataChange }: InvitationCanvasProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <div className="w-full h-full bg-[#faf9f6]" />;

  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing relative">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 35 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <KineticScene data={data} onDataChange={onDataChange} />
        </Suspense>
      </Canvas>
    </div>
  );
}
