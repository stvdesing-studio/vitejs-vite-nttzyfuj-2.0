/**
 * ARCHIVO: fisicaWorker.js
 * Propósito: Hilo de ejecución secundario (Web Worker) para cálculos pesados
 * de propagación de red sin afectar los 60 FPS del motor gráfico.
 */

self.onmessage = function (e) {
    const { tipo, datos } = e.data;
  
    if (tipo === "INICIAR_SIMULACION") {
      // Aquí podemos procesar iteraciones matemáticas, matrices de rigidez o flujos
      const resultadosSimulacion = datos.map((nodo, index) => {
        // Ejemplo de cálculo numérico independiente
        return {
          id: index,
          fuerzaPropagada: Math.sin(nodo.x) * 1.5
        };
      });
  
      // Devolvemos los resultados calculados al hilo principal
      self.postMessage({
        tipo: "RESULTADO_FISICA",
        datos: resultadosSimulacion
      });
    }
  };
  