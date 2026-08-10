import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 1. Importamos la función generadora de materiales desde tu Catálogo Maestro
import { generarMaterialThreeJS } from '../STV_CatalogoMaestro';

export const GraphScene = ({ 
  numNodos, 
  maxDistance, 
  spaceLimit, 
  hssRadius, 
  showNodes, 
  perfilActivo // 2. Recibimos la selección del menú de Leva
}) => {
  const nodosRef = useRef();
  const cilindrosRef = useRef();

  // Nivel dinámico del piso basado en el límite espacial
  const nivelCimentacion = -spaceLimit / 2.5;

  // Generamos la matriz inicial de partículas y uniones
  const { particulas, uniones } = useMemo(() => {
    const pos = [];
    for (let i = 0; i < numNodos; i++) {
      pos.push({
        id: i,
        posicion: new THREE.Vector3(
          (Math.random() - 0.5) * spaceLimit,
          (Math.random() - 0.5) * spaceLimit,
          (Math.random() - 0.5) * (spaceLimit / 1.5)
        ),
        velocidad: new THREE.Vector3(0, 0, 0),
        fuerza: new THREE.Vector3(0, 0, 0)
      });
    }

    const conexiones = [];
    for (let i = 0; i < numNodos; i++) {
      for (let j = i + 1; j < numNodos; j++) {
        const distanciaInicial = pos[i].posicion.distanceTo(pos[j].posicion);
        if (distanciaInicial < maxDistance) {
          conexiones.push({
            origen: pos[i],
            destino: pos[j],
            longitudIdeal: distanciaInicial 
          });
        }
      }
    }

    return { particulas: pos, uniones: conexiones };
  }, [numNodos, maxDistance, spaceLimit]);

  // Variables auxiliares para actualización de matrices
  const dummyNode = useMemo(() => new THREE.Object3D(), []);
  const dummyEdge = useMemo(() => new THREE.Object3D(), []);
  const midPoint = useMemo(() => new THREE.Vector3(), []);

  const cylinderGeometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(hssRadius, hssRadius, 1, 8);
    geo.rotateX(Math.PI / 2);
    return geo;
  }, [hssRadius]);

  // 3. GENERACIÓN DINÁMICA DE MATERIALES
  // Cada vez que 'perfilActivo' cambie en Leva, Three.js recalculará el material
  const materialEstructural = useMemo(() => {
    return generarMaterialThreeJS(perfilActivo);
  }, [perfilActivo]);

  // Material estático por defecto para los nodos (Esferas)
  const materialNodos = useMemo(() => {
    return new THREE.MeshStandardMaterial({ 
      color: '#00E5FF', 
      roughness: 0.2, 
      metalness: 0.8 
    });
  }, []);

  // 4. MOTOR DE FÍSICA (Idéntico a tu versión estable)
  useFrame(() => {
    particulas.forEach(p => p.fuerza.set(0, 0, 0));

    const GRAVEDAD = -0.0015; 
    const TENSION = 0.05; 
    
    // Ley de Hooke (Resortes)
    uniones.forEach(union => {
      const { origen, destino, longitudIdeal } = union;
      const vectorDireccion = new THREE.Vector3().subVectors(destino.posicion, origen.posicion);
      const distanciaActual = vectorDireccion.length();
      const deformacion = distanciaActual - longitudIdeal;
      vectorDireccion.normalize().multiplyScalar(deformacion * TENSION);
      origen.fuerza.add(vectorDireccion);
      destino.fuerza.sub(vectorDireccion);
    });

    // Prevención de penetración rígida
    const limiteColision = hssRadius * 5.0; 
    for (let i = 0; i < numNodos; i++) {
      for (let j = i + 1; j < numNodos; j++) {
        const p1 = particulas[i];
        const p2 = particulas[j];
        const vectorDireccion = new THREE.Vector3().subVectors(p1.posicion, p2.posicion);
        const distancia = vectorDireccion.length();
        if (distancia < limiteColision && distancia > 0) {
          const solapamiento = limiteColision - distancia;
          vectorDireccion.normalize().multiplyScalar(solapamiento * 0.5);
          p1.fuerza.add(vectorDireccion);
          p2.fuerza.sub(vectorDireccion);
        }
      }
    }

    // Integración de velocidad, gravedad y cimentación
    particulas.forEach((p, i) => {
      p.velocidad.y += GRAVEDAD;
      p.velocidad.add(p.fuerza);
      p.velocidad.multiplyScalar(0.85); 
      p.posicion.add(p.velocidad);

      // Límite de cimentación vertical
      if (p.posicion.y < nivelCimentacion) {
        p.posicion.y = nivelCimentacion; 
        p.velocidad.y *= -0.2;     
        p.velocidad.x *= 0.8;      
        p.velocidad.z *= 0.8;
      }

      // Límites de muros contenedores laterales
      if (Math.abs(p.posicion.x) > spaceLimit / 2) {
        p.posicion.x = Math.sign(p.posicion.x) * (spaceLimit / 2);
        p.velocidad.x *= -0.5;
      }
      if (Math.abs(p.posicion.z) > spaceLimit / 3) {
        p.posicion.z = Math.sign(p.posicion.z) * (spaceLimit / 3);
        p.velocidad.z *= -0.5;
      }

      dummyNode.position.copy(p.posicion);
      dummyNode.updateMatrix();
      nodosRef.current.setMatrixAt(i, dummyNode.matrix);
    });
    nodosRef.current.instanceMatrix.needsUpdate = true;

    // Actualización de malla instanciada para perfiles estructurales
    uniones.forEach((union, index) => {
      midPoint.addVectors(union.origen.posicion, union.destino.posicion).multiplyScalar(0.5);
      dummyEdge.position.copy(midPoint);
      dummyEdge.lookAt(union.destino.posicion);
      const distancia = union.origen.posicion.distanceTo(union.destino.posicion);
      dummyEdge.scale.set(1, 1, distancia);
      dummyEdge.updateMatrix();
      cilindrosRef.current.setMatrixAt(index, dummyEdge.matrix);
    });
    cilindrosRef.current.count = uniones.length;
    cilindrosRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* 5. CIMENTACIÓN VISUAL (Piso Reflectante) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, nivelCimentacion, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.0} metalness={0.1} />
      </mesh>

      {/* Renderizado de Nodos */}
      <instancedMesh ref={nodosRef} args={[null, materialNodos, numNodos]} visible={showNodes}>
        <sphereGeometry args={[0.08, 16, 16]} />
      </instancedMesh>
      
      {/* 6. RENDERIZADO DE PERFILES HSS (Usando el material del catálogo) */}
      <instancedMesh 
        ref={cilindrosRef} 
        args={[cylinderGeometry, materialEstructural, uniones.length > 0 ? uniones.length : 1000]} 
      />
    </group>
  );
};
