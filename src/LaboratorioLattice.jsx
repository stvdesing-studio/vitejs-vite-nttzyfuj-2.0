import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

const NUM_NODOS = 75; 
const DISTANCIA_CONEXION = 7.0; 
const MAX_CONEXIONES = 5;
// Velocidad del "acordeón" avanzando hacia la cámara
const VELOCIDAD_AVANCE = 0.035; 

const EstructuraAcordeonRigido = () => {
  const nodosRef = useRef();
  const cilindrosRef = useRef();

  // Generación inicial en forma de cono/embudo
  const { posicionesBase, conexiones } = useMemo(() => {
    const posiciones = [];
    for (let i = 0; i < NUM_NODOS; i++) {
      const z = (Math.random() * 40) - 35; // Profundidad desde el fondo (-35) hasta el frente (5)
      const factorDispersion = Math.abs(z) * 0.35 + 1; 
      const x = (Math.random() - 0.5) * factorDispersion;
      const y = (Math.random() - 0.5) * factorDispersion;
      posiciones.push(new THREE.Vector3(x, y, z));
    }

    const uniones = [];
    const contadorConexiones = new Array(NUM_NODOS).fill(0);

    for (let i = 0; i < NUM_NODOS; i++) {
      for (let j = i + 1; j < NUM_NODOS; j++) {
        const distancia = posiciones[i].distanceTo(posiciones[j]);
        if (distancia < DISTANCIA_CONEXION && contadorConexiones[i] < MAX_CONEXIONES && contadorConexiones[j] < MAX_CONEXIONES) {
          uniones.push({ origen: i, destino: j });
          contadorConexiones[i]++;
          contadorConexiones[j]++;
        }
      }
    }
    return { posicionesBase: posiciones, conexiones: uniones };
  }, []);

  const dummyNodo = useMemo(() => new THREE.Object3D(), []);
  const dummyCilindro = useMemo(() => new THREE.Object3D(), []);
  const vectorDireccion = useMemo(() => new THREE.Vector3(), []);
  const vectorArriba = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  // Acero HSS Negro Piano
  const materialPianoBlack = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#010101",
    roughness: 0.05,
    metalness: 1.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02
  }), []);

  useFrame((state) => {
    const tiempo = state.clock.getElapsedTime() * 0.5; 
    const posicionesActuales = [];

    posicionesBase.forEach((posBase, i) => {
      // 1. AVANCE CONTINUO (Efecto Acordeón)
      posBase.z += VELOCIDAD_AVANCE;
      
      // Reciclaje: Si sale de la pantalla, vuelve al abismo oscuro
      if (posBase.z > 5) {
        posBase.z = -35;
        const factorDispersion = Math.abs(posBase.z) * 0.35 + 1; 
        posBase.x = (Math.random() - 0.5) * factorDispersion;
        posBase.y = (Math.random() - 0.5) * factorDispersion;
      }

      // 2. RESPIRACIÓN RÍGIDA (Mantiene la estructura unida sin que sea gelatina)
      const offsetX = Math.sin(tiempo + posBase.y * 0.05) * 0.3;
      const offsetY = Math.cos(tiempo + posBase.x * 0.05) * 0.3;
      const offsetZ = Math.sin(tiempo + posBase.z * 0.05) * 0.3;
      
      const posActual = new THREE.Vector3(
        posBase.x + offsetX, 
        posBase.y + offsetY, 
        posBase.z + offsetZ
      );
      
      posicionesActuales.push(posActual);
      dummyNodo.position.copy(posActual);

      // 3. ESCALA NO LINEAL (Se hacen más robustos al acercarse a la cámara)
      const escala = THREE.MathUtils.clamp(((posActual.z + 35) / 40) * 1.5, 0.3, 1.5);
      dummyNodo.scale.set(escala, escala, escala);

      dummyNodo.updateMatrix();
      nodosRef.current.setMatrixAt(i, dummyNodo.matrix);
    });
    nodosRef.current.instanceMatrix.needsUpdate = true;

    // Actualización de tensores mecánicos
    conexiones.forEach((conexion, i) => {
      const p1 = posicionesActuales[conexion.origen];
      const p2 = posicionesActuales[conexion.destino];

      const centroX = (p1.x + p2.x) / 2;
      const centroY = (p1.y + p2.y) / 2;
      const centroZ = (p1.z + p2.z) / 2;
      dummyCilindro.position.set(centroX, centroY, centroZ);

      vectorDireccion.subVectors(p2, p1);
      const longitud = vectorDireccion.length();
      vectorDireccion.normalize();
      
      dummyCilindro.quaternion.setFromUnitVectors(vectorArriba, vectorDireccion);
      dummyCilindro.scale.set(1, longitud, 1);
      dummyCilindro.updateMatrix();
      
      cilindrosRef.current.setMatrixAt(i, dummyCilindro.matrix);
    });
    cilindrosRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={nodosRef} args={[null, null, NUM_NODOS]} material={materialPianoBlack}>
        <sphereGeometry args={[0.25, 32, 32]} />
      </instancedMesh>
      <instancedMesh ref={cilindrosRef} args={[null, null, conexiones.length]} material={materialPianoBlack}>
        <cylinderGeometry args={[0.02, 0.02, 1, 16]} />
      </instancedMesh>
    </group>
  );
};

const LaboratorioLattice = () => {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 60, near: 0.1, far: 100 }}>
        
        {/* Niebla para ocultar el reciclaje de nodos en el fondo */}
        <fog attach="fog" args={['#000000', 10, 35]} />

        {/* Iluminación fotográfica de estudio */}
        <ambientLight intensity={0.2} />
        <directionalLight position={[0, 20, 5]} intensity={1.5} color="#ffffff" />
        
        {/* Luz Ámbar que baña la estructura desde la zona de la firma */}
        <pointLight position={[10, -5, 5]} intensity={6.0} color="#ffb700" distance={25} />
        <spotLight position={[15, -10, 10]} intensity={4.0} color="#ffaa00" penumbra={1} angle={0.5} />

        <Environment preset="studio" />
        <EstructuraAcordeonRigido />
      </Canvas>
    </div>
  );
};

export default LaboratorioLattice;
