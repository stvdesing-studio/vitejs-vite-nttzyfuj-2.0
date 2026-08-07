/**
 * ARCHIVO: STVMathEngine.js
 * Propósito: Motor matemático base para álgebra lineal, vectores y matrices de rigidez.
 * Sustento para la propagación de flujos y resolución de sistemas K * u = F.
 */

export class STVMathEngine {
    /**
     * Calcula la matriz de rigidez local simplificada para un elemento tipo barra (arista).
     * @param {number} longitud - Distancia entre nodos
     * @param {number} rigidezaxial (EA/L) - Propiedad mecánica del perfil
     * @returns {Array} Matriz 2x2 representativa
     */
    static calcularMatrizRigidezElemento(longitud, rigidezAxial) {
      const k = rigidezAxial / (longitud > 0 ? longitud : 1);
      return [
        [ k, -k],
        [-k,  k]
      ];
    }
  
    /**
     * Multiplica una matriz global por un vector de desplazamientos (K * u)
     * @param {Array<Array<number>>} matrizK - Matriz de rigidez global
     * @param {Array<number>} vectorU - Vector de desplazamientos
     * @returns {Array<number>} Vector de fuerzas resultantes (F)
     */
    static multiplicarMatrizVector(matrizK, vectorU) {
      return matrizK.map(fila => 
        fila.reduce((suma, elementoK, j) => suma + elementoK * vectorU[j], 0)
      );
    }
  }
  