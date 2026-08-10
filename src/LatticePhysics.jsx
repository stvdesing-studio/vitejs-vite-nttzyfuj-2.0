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
        fuerza: new THREE.Vector3(0, 0, 0) // Nuevo vector para acumular físicas
      });
    }

    const conexiones = [];
    // Conectamos los nodos cercanos para formar la estructura base
    for (let i = 0; i < numNodos; i++) {
      for (let j = i + 1; j < numNodos; j++) {
        const distanciaInicial = pos[i].posicion.distanceTo(pos[j].posicion);
        if (distanciaInicial < maxDistance) {
          conexiones.push({
            origen: pos[i],
            destino: pos[j],
            // Guardamos su longitud original para que el resorte intente mantenerla
            longitudIdeal: distanciaInicial 
          });
        }
      }
    }

    return { particulas: pos, uniones: conexiones };
  }, [numNodos, maxDistance, spaceLimit]);
