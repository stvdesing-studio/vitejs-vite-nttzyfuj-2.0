import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, MeshReflectorMaterial, Grid } from '@react-three/drei';
import { BloqueLattice } from './LatticePhysics';

const LaboratorioLattice = () => {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}>
      {/* FOV en 50 previene fugas de perspectiva extremas en los bordes */}
      <Canvas camera={{ position: [0, 1, 15], fov: 50, near: 0.1, far: 80 }}>
        
        <fog attach="fog" args={['#000000', 8, 40]} />

        <ambientLight intensity={0.25} />
        <directionalLight position={[0, 15, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[10, -3, 5]} intensity={6.0} color="#ffb700" distance={25} />
        <spotLight position={[15, -8, 10]} intensity={4.0} color="#ffaa00" penumbra={1} angle={0.5} />

        <Environment preset="studio" />

        {/* INYECCIÓN DEL TÚNEL DINÁMICO */}
        <BloqueLattice offsetInicialZ={0} />
        <BloqueLattice offsetInicialZ={-60} />

        {/* PISO REFLECTANTE */}
        <mesh position={[0, -10, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[120, 120]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={1024}
            mixBlur={1}
            mixStrength={50}
            roughness={0.02}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#010101"
            metalness={0.9}
          />
        </mesh>

        {/* LÍNEAS TÉCNICAS ÁMBAR SOBRE EL PISO */}
        <Grid
          position={[0, -9.9, 0]}
          args={[120, 120]}
          cellSize={2}
          cellThickness={1}
          cellColor="#ffb700"
          sectionSize={10}
          sectionThickness={1.5}
          sectionColor="#ff8800"
          fadeDistance={40}
          fadeStrength={1.5}
        />

      </Canvas>
    </div>
  );
};

export default LaboratorioLattice;
