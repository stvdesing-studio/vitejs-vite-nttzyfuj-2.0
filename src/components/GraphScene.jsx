import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
// Asegúrate de que esta ruta apunte correctamente a tu diccionario
import { cyanMaterial, blackGlassMaterial } from '../DiccionarioMateriales';

export const GraphScene = ({ 
  numNodos, 
  maxDistance, 
  spaceLimit, 
  hssRadius, 
  showNodes, 
  glassOpacity 
}) => {
  // --- PARTE 1: CONFIGURACIÓN Y MEMORIA ---
  const nodosRef = useRef();
  const cilindrosRef = useRef();

  // Generamos los Nodos y sus Uniones Fijas iniciales
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

  const dummyNode = useMemo(() => new THREE.Object3D(), []);
  const dummyEdge = useMemo(() => new THREE.Object3D(), []);
  const midPoint = useMemo(() => new THREE.Vector3(), []);

  const cylinderGeometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(hssRadius, hssRadius, 1, 8);
    geo.rotateX(Math.PI / 2);
    return geo;
  }, [hssRadius]);

  useMemo(() => {
    blackGlassMaterial.opacity = glassOpacity;
  }, [glassOpacity]);


  // --- PARTE 2: EL MOTOR (AQUÍ VA EXACTAMENTE EL USEFRAME) ---
  // Este bloque siempre va después de declarar las variables, pero antes del "return"
  useFrame(() => {
    // 1. Reiniciar las fuerzas acumuladas
    particulas.forEach(p => p.fuerza.set(0, 0, 0));

    // 2. FÍSICA DE RESORTES (Estirar y Encoger)
    const TENSION = 0.05; 
    
    uniones.forEach(union => {
      const { origen, destino, longitudIdeal } = union;
      const vectorDireccion = new THREE.Vector3().subVectors(destino.posicion, origen.posicion);
      const distanciaActual = vectorDireccion.length();
      const deformacion = distanciaActual - longitudIdeal;
      
      vectorDireccion.normalize().multiplyScalar(deformacion * TENSION);
      
      origen.fuerza.add(vectorDireccion);
      destino.fuerza.sub(vectorDireccion);
    });

    // 3. COLISIONES DE MATERIA RÍGIDA
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

    // 4. INTEGRACIÓN (Mover la geometría)
    particulas.forEach((p, i) => {
      p.velocidad.add(p.fuerza);
      p.velocidad.multiplyScalar(0.85); // Fricción
      p.posicion.add(p.velocidad);

      // Límites de la caja
      if (Math.abs(p.posicion.x) > spaceLimit / 2) p.posicion.x = Math.sign(p.posicion.x) * (spaceLimit / 2);
      if (Math.abs(p.posicion.y) > spaceLimit / 2) p.posicion.y = Math.sign(p.posicion.y) * (spaceLimit / 2);
      if (Math.abs(p.posicion.z) > spaceLimit / 3) p.posicion.z = Math.sign(p.posicion.z) * (spaceLimit / 3);

      dummyNode.position.copy(p.posicion);
      dummyNode.updateMatrix();
      nodosRef.current.setMatrixAt(i, dummyNode.matrix);
    });
    nodosRef.current.instanceMatrix.needsUpdate = true;

    // 5. ACTUALIZAR CILINDROS (Las conexiones físicas)
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


  // --- PARTE 3: EL RENDERIZADO (DIBUJAR EN PANTALLA) ---
  // Este bloque "return" es obligatorio en cualquier componente de React
  return (
    <group>
      <instancedMesh 
        ref={nodosRef} 
        args={[null, null, numNodos]} 
        material={cyanMaterial}
        visible={showNodes}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
      </instancedMesh>
      
      <instancedMesh 
        ref={cilindrosRef} 
        args={[cylinderGeometry, blackGlassMaterial, uniones.length > 0 ? uniones.length : 1000]} 
      />
    </group>
  );
};
