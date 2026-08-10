// Define estas constantes al inicio de tu componente o motor matemático
const GRAVEDAD = -0.002; // Fuerza constante hacia abajo
const PISO = -spaceLimit / 3; // Límite inferior (Cimentación)
const AMORTIGUACION_SUELO = -0.5; // Pérdida de energía al rebotar
const FRICCION_SUELO = 0.8; // Resistencia lateral al tocar el piso

// Dentro de tu useFrame, en el ciclo donde actualizas las posiciones:
particulas.forEach((p, i) => {
  // 1. Aplicar la fuerza de gravedad a la velocidad vertical
  p.velocidad.y += GRAVEDAD;

  // 2. Mover el nodo según su nueva velocidad
  p.posicion.add(p.velocidad);

  // 3. Fricción ambiental (resistencia del aire/estructura para dar estabilidad)
  p.velocidad.multiplyScalar(0.99);

  // 4. Lógica de Cimentación (Colisión con el suelo)
  if (p.posicion.y < PISO) {
    p.posicion.y = PISO; // Evitar que el nodo traspase el suelo
    p.velocidad.y *= AMORTIGUACION_SUELO; // Rebote realista perdiendo fuerza
    
    // Fricción lateral: los nodos se detienen horizontalmente al tocar el piso
    p.velocidad.x *= FRICCION_SUELO;
    p.velocidad.z *= FRICCION_SUELO;
  }

  // 5. Rebote en paredes (para mantenerlos dentro de los límites espaciales horizontales)
  if (Math.abs(p.posicion.x) > spaceLimit / 2) p.velocidad.x *= -1;
  if (Math.abs(p.posicion.z) > spaceLimit / 3) p.velocidad.z *= -1;
  // Nota: Eliminamos la condición de rebote en el techo (Y positivo) para que la gravedad actúe con naturalidad.

  // 6. Actualización de la matriz visual
  dummyNode.position.copy(p.posicion);
  dummyNode.updateMatrix();
  nodosRef.current.setMatrixAt(i, dummyNode.matrix);
});
