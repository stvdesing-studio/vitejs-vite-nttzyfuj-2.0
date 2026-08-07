import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

// --- CONFIGURACIÓN ESTRUCTURAL ---
const NUM_NODOS = 50; // Densidad ideal para limpieza visual
const DISTANCIA_CONEXION = 5.0;
const MAX_CONEXIONES = 4; 
const RADIO_VOLUMEN = 9;

const EstructuraLattice = () => {
  const nodosRef = useRef();
  const cilindrosRef = useRef();

  // GENERACIÓN DE TOPOLOGÍA ASIMÉTRICA Y LIMPIA
  const { posicionesBase, conexiones } = useMemo(() => {
    const posiciones = [];
    for (let i = 0; i < NUM_NODOS; i++) {
      const x = (Math.random() - 0.5) * RADIO_VOLUMEN;
      const y = (Math.random() - 0.5) * RADIO_VOLUMEN;
      const z = (Math.random() - 0.5) * RADIO_VOLUMEN;
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
  const posicionesAnimadas = useMemo(() => new Array(NUM_NODOS).fill(null).map(() => new THREE.Vector3()), []);

  // MATERIALES: ACERO NEGRO PULIDO Y BRILLANTE (Estilo STV Studio)
  const materialNodos = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#020202",       // Negro absoluto
    roughness: 0.05,        // Superficie ultra pulida
    metalness: 1.0,         // Comportamiento metálico puro
    clearcoat: 1.0,         // Barniz de alto brillo
    clearcoatRoughness: 0.05
  }), []);

  const materialCilindros = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#0a0a0a",
    roughness: 0.1,
    metalness: 0.9,
    clearcoat: 0.8
  }), []);

  // CICLO DE ANIMACIÓN CINÉTICA
  useFrame((state) => {
    const tiempo = state.clock.getElapsedTime();

    // Actualizamos posiciones de las esferas (Nodos)
    posicionesBase.forEach((pos, i) => {
      const offsetX = Math.sin(tiempo * 0.15 + pos.y) * 0.3;
      const offsetY = Math.cos(tiempo * 0.2 + pos.x) * 0.2;
      const offsetZ = Math.sin(tiempo * 0.15 + pos.z) * 0.3;

      const vec = posicionesAnimadas[i];
      vec.set(pos.x + offsetX, pos.y + offsetY, pos.z + offsetZ);

      dummyNodo.position.copy(vec);
      dummyNodo.updateMatrix();
      nodosRef.current.setMatrixAt(i, dummyNodo.matrix);
    });
    nodosRef.current.instanceMatrix.needsUpdate = true;

    // Actualizamos orientación y escala de los perfiles (Cilindros)
    conexiones.forEach((conexion, i) => {
      const p1 = posicionesAnimadas[conexion.origen];
      const p2 = posicionesAnimadas[conexion.destino];

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
      {/* RÓTULAS / NODOS */}
      <instancedMesh ref={nodosRef} args={[null, null, NUM_NODOS]} material={materialNodos}>
        <sphereGeometry args={[0.18, 32, 32]} />
      </instancedMesh>

      {/* PERFILES / CILINDROS */}
      <instancedMesh ref={cilindrosRef} args={[null, null, conexiones.length]} material={materialCilindros}>
        <cylinderGeometry args={[0.035, 0.035, 1, 16]} />
      </instancedMesh>
    </group>
  );
};

// ENTORNO VISUAL CON ILUMINACIÓN DE ESTUDIO
const LaboratorioVisual = () => {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#FFFFFF' }}>
      <Canvas camera={{ position: [0, 0, 18], fov: 45 }}>
        <color attach="background" args={['#FFFFFF']} />
        
        {/* Iluminación de estudio para realzar brillos especulares */}
        <ambientLight intensity={1.2} />
        <directionalLight position={[15, 20, 15]} intensity={2.5} />
        <directionalLight position={[-15, -10, -15]} intensity={0.8} />
        
        <Environment preset="studio" />
        <EstructuraLattice />
        
        <OrbitControls makeDefault enableDamping dampingFactor={0.05} autoRotate autoRotateSpeed={0.4} />
      </Canvas>
    </div>
  );
};

export default LaboratorioVisual;
