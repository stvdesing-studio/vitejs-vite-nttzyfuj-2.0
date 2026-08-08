import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { cyanMaterial, blackGlassMaterial } from '../DiccionarioMateriales';


// Recibimos los parámetros dinámicos en los props
export const GraphScene = ({ numNodos, maxDistance, spaceLimit }) => {
  const nodosRef = useRef();
  const cilindrosRef = useRef();

  const MAX_CONEXIONES = (numNodos * (numNodos - 1)) / 2; 

  // useMemo ahora vigila [numNodos, spaceLimit]. 
  // Si los cambias en la UI, se recalculan las posiciones base.
  const particulas = useMemo(() => {
    const temp = [];
    for (let i = 0; i < numNodos; i++) {
      temp.push({
        posicion: new THREE.Vector3(
          (Math.random() - 0.5) * spaceLimit,
          (Math.random() - 0.5) * spaceLimit,
          (Math.random() - 0.5) * (spaceLimit / 1.5)
        ),
        velocidad: new THREE.Vector3(
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.015
        )
      });
    }
    return temp;
  }, [numNodos, spaceLimit]); // <-- Dependencias paramétricas

  const dummyNode = useMemo(() => new THREE.Object3D(), []);
  const dummyEdge = useMemo(() => new THREE.Object3D(), []);
  const midPoint = useMemo(() => new THREE.Vector3(), []);

  const cylinderGeometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.015, 0.015, 1, 8);
    geo.rotateX(Math.PI / 2);
    return geo;
  }, []);

  useFrame(() => {
    let edgeCount = 0;

    // 1. Actualizar posiciones de los Nodos
    particulas.forEach((p, i) => {
      p.posicion.add(p.velocidad);

      // Usamos el spaceLimit paramétrico para el rebote
      if (Math.abs(p.posicion.x) > spaceLimit / 2) p.velocidad.x *= -1;
      if (Math.abs(p.posicion.y) > spaceLimit / 2) p.velocidad.y *= -1;
      if (Math.abs(p.posicion.z) > spaceLimit / 3) p.velocidad.z *= -1;

      dummyNode.position.copy(p.posicion);
      dummyNode.updateMatrix();
      nodosRef.current.setMatrixAt(i, dummyNode.matrix);
    });
    
    nodosRef.current.instanceMatrix.needsUpdate = true;

    // 2. Calcular las conexiones usando numNodos y maxDistance paramétricos
    for (let i = 0; i < numNodos; i++) {
      for (let j = i + 1; j < numNodos; j++) {
        const p1 = particulas[i].posicion;
        const p2 = particulas[j].posicion;
        const distancia = p1.distanceTo(p2);

        if (distancia < maxDistance) {
          midPoint.addVectors(p1, p2).multiplyScalar(0.5);
          dummyEdge.position.copy(midPoint);
          dummyEdge.lookAt(p2);
          dummyEdge.scale.set(1, 1, distancia);
          
          dummyEdge.updateMatrix();
          cilindrosRef.current.setMatrixAt(edgeCount, dummyEdge.matrix);
          edgeCount++;
        }
      }
    }

    cilindrosRef.current.count = edgeCount;
    cilindrosRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={nodosRef} args={[null, null, numNodos]} material={cyanMaterial}>
        <sphereGeometry args={[0.08, 16, 16]} />
      </instancedMesh>
      
      <instancedMesh ref={cilindrosRef} args={[cylinderGeometry, blackGlassMaterial, MAX_CONEXIONES]} />
    </group>
  );
};