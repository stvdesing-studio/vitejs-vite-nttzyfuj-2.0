import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const NUM_NODOS = 50; 
const DISTANCIA_CONEXION = 9.0;
const MAX_CONEXIONES = 4;
const LONGITUD_BLOQUE = 60; 
// Velocidad del túnel dinámico
const VELOCIDAD_AVANCE = 3.0; 

// MATERIAL OBSIDIANA: Negro absoluto y pulido espejo
const materialObsidiana = new THREE.MeshPhysicalMaterial({
  color: "#000000",
  roughness: 0.0,
  metalness: 1.0,
  clearcoat: 1.0,
  clearcoatRoughness: 0.0
});

const { posicionesBase, conexiones } = (() => {
  const pos = [];
  for (let i = 0; i < NUM_NODOS; i++) {
    const z = (Math.random() * LONGITUD_BLOQUE) - (LONGITUD_BLOQUE / 2);
    // Distribución contenida para no desbordar los límites de la pantalla
    const x = (Math.random() - 0.5) * 20;
    const y = (Math.random() - 0.5) * 12 + 2; 
    pos.push(new THREE.Vector3(x, y, z));
  }

  const uniones = [];
  const contadores = new Array(NUM_NODOS).fill(0);
  for (let i = 0; i < NUM_NODOS; i++) {
    for (let j = i + 1; j < NUM_NODOS; j++) {
      if (pos[i].distanceTo(pos[j]) < DISTANCIA_CONEXION && contadores[i] < MAX_CONEXIONES && contadores[j] < MAX_CONEXIONES) {
        uniones.push({ origen: i, destino: j });
        contadores[i]++;
        contadores[j]++;
      }
    }
  }
  return { posicionesBase: pos, conexiones: uniones };
})();

export const BloqueLattice = ({ offsetInicialZ }) => {
  const grupoRef = useRef();
  const nodosRef = useRef();
  const cilindrosRef = useRef();

  const dummyNodo = useMemo(() => new THREE.Object3D(), []);
  const dummyCilindro = useMemo(() => new THREE.Object3D(), []);
  const vectorDir = useMemo(() => new THREE.Vector3(), []);
  const vectorArriba = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  useFrame((state, delta) => {
    const tiempo = state.clock.getElapsedTime() * 0.4;

    // MOTOR EN TÚNEL DINÁMICO (Cinta de correr)
    grupoRef.current.position.z += VELOCIDAD_AVANCE * delta;

    if (grupoRef.current.position.z > LONGITUD_BLOQUE) {
      grupoRef.current.position.z -= LONGITUD_BLOQUE * 2;
    }

    const zGlobalBloque = grupoRef.current.position.z;
    const posicionesActuales = [];

    posicionesBase.forEach((posBase, i) => {
      // Respiración estructural sutil
      const offsetX = Math.sin(tiempo + posBase.y * 0.1) * 0.2;
      const offsetY = Math.cos(tiempo + posBase.x * 0.1) * 0.2;
      const offsetZ = Math.sin(tiempo + posBase.z * 0.1) * 0.2;

      const posActual = new THREE.Vector3(
        posBase.x + offsetX,
        posBase.y + offsetY,
        posBase.z + offsetZ
      );
      posicionesActuales.push(posActual);
      dummyNodo.position.copy(posActual);

      // ESCALA CONTROLADA: Límite máximo de 1.4 para evitar el efecto de "columnas deformes"
      const zAbsoluta = posActual.z + zGlobalBloque;
      const escala = THREE.MathUtils.clamp(((zAbsoluta + 35) / 50) * 1.4, 0.2, 1.4);
      dummyNodo.scale.set(escala, escala, escala);

      dummyNodo.updateMatrix();
      nodosRef.current.setMatrixAt(i, dummyNodo.matrix);
    });
    nodosRef.current.instanceMatrix.needsUpdate = true;

    conexiones.forEach((conexion, i) => {
      const p1 = posicionesActuales[conexion.origen];
      const p2 = posicionesActuales[conexion.destino];

      const centroX = (p1.x + p2.x) / 2;
      const centroY = (p1.y + p2.y) / 2;
      const centroZ = (p1.z + p2.z) / 2;
      dummyCilindro.position.set(centroX, centroY, centroZ);

      vectorDir.subVectors(p2, p1);
      const longitud = vectorDir.length();
      vectorDir.normalize();

      dummyCilindro.quaternion.setFromUnitVectors(vectorArriba, vectorDir);
      dummyCilindro.scale.set(1, longitud, 1);
      dummyCilindro.updateMatrix();

      cilindrosRef.current.setMatrixAt(i, dummyCilindro.matrix);
    });
    cilindrosRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={grupoRef} position={[0, 0, offsetInicialZ]}>
      {/* Nodos de proporciones equilibradas */}
      <instancedMesh ref={nodosRef} args={[null, null, NUM_NODOS]} material={materialObsidiana}>
        <sphereGeometry args={[0.25, 32, 32]} />
      </instancedMesh>
      {/* Tensores de perfil masivo (Radio 0.06 en lugar del 0.02 original) */}
      <instancedMesh ref={cilindrosRef} args={[null, null, conexiones.length]} material={materialObsidiana}>
        <cylinderGeometry args={[0.06, 0.06, 1, 16]} />
      </instancedMesh>
    </group>
  );
};

