useFrame(() => {
  // 1. Reiniciar las fuerzas acumuladas en este cuadro
  particulas.forEach(p => p.fuerza.set(0, 0, 0));

  // --- PARÁMETROS DE GRAVEDAD Y CIMENTACIÓN ---
  const GRAVEDAD = -0.0015; // Aceleración constante hacia el suelo (Eje Y)
  const NIVEL_PISO = -spaceLimit / 2.5; // Plano de cimentación inferior

  // 2. FÍSICA DE RESORTES (Estirar y Encoger la estructura)
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

  // 3. COLISIONES DE MATERIA RÍGIDA (Evitar que los nodos se traspasen)
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

  // 4. INTEGRACIÓN, GRAVEDAD Y CIMENTACIÓN (Mover la geometría)
  particulas.forEach((p, i) => {
    // Aplicamos la aceleración de la gravedad a la velocidad vertical (Y)
    p.velocidad.y += GRAVEDAD;

    // Sumamos las fuerzas estructurales de los resortes
    p.velocidad.add(p.fuerza);
    
    // Fricción ambiental para estabilizar la red y evitar oscilaciones infinitas
    p.velocidad.multiplyScalar(0.85); 
    
    // Actualizamos la posición sumando la velocidad resultante
    p.posicion.add(p.velocidad);

    // --- CIMENTACIÓN: COLISIÓN CONTRA EL PISO ---
    if (p.posicion.y < NIVEL_PISO) {
      p.posicion.y = NIVEL_PISO; // Anclamos la posición exacta al suelo
      p.velocidad.y *= -0.2;     // Rebote amortiguado débil (absorbe el impacto)
      p.velocidad.x *= 0.8;      // Fricción lateral en el suelo
      p.velocidad.z *= 0.8;
    }

    // Rebote en las paredes laterales (Ejes X y Z)
    if (Math.abs(p.posicion.x) > spaceLimit / 2) {
      p.posicion.x = Math.sign(p.posicion.x) * (spaceLimit / 2);
      p.velocidad.x *= -0.5;
    }
    if (Math.abs(p.posicion.z) > spaceLimit / 3) {
      p.posicion.z = Math.sign(p.posicion.z) * (spaceLimit / 3);
      p.velocidad.z *= -0.5;
    }

    // Actualizamos la matriz visual del nodo tridimensional
    dummyNode.position.copy(p.posicion);
    dummyNode.updateMatrix();
    nodosRef.current.setMatrixAt(i, dummyNode.matrix);
  });
  nodosRef.current.instanceMatrix.needsUpdate = true;

  // 5. ACTUALIZAR CILINDROS (Perfiles HSS estables que no parpadean)
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

// Código para integrar dentro de tu componente 3D (ej. GraphScene.jsx)
<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
  <planeGeometry args={[50, 50]} />
  <meshStandardMaterial 
    color="#FFFFFF" 
    roughness={0.0} // Superficie totalmente pulida tipo espejo
    metalness={0.1} // Ligeramente metálico para capturar brillos limpios
    envMapIntensity={1.0}
  />
</mesh>
