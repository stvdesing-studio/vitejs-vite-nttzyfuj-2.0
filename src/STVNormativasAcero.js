/**
 * ARCHIVO: STVNormativasAcero.js
 * Propósito: Base de datos completa con tablas de pesos y perfiles de acero (HSS, PTR, IPR).
 * Vinculado a estándares de ingeniería y cuantificación de materiales.
 */

// 1. TABLA DE PERFILES HSS (Tubulares Rectangulares y Cuadrados)
export const STV_TABLA_PESOS_HSS = {
    "HSS_8X4_1_4": { descripcion: "HSS 8x4 in (Cal. 1/4)", peso_kg_m: 23.90, normativa: "AISC 360" },
    "HSS_6X4_3_16": { descripcion: "HSS 6x4 in (Cal. 3/16)", peso_kg_m: 16.50, normativa: "AISC 360" },
    "HSS_4X4_1_4": { descripcion: "HSS 4x4 in (Cal. 1/4)", peso_kg_m: 18.20, normativa: "AISC 360" }
  };
  
  // 2. TABLA DE PERFILES PTR (Perfiles Tubulares Rectangulares / Comerciales)
  export const STV_TABLA_PESOS_PTR = {
    "PTR_2X2_C14": { descripcion: "PTR 2x2 in (Calibre 14)", peso_kg_m: 4.70, tipo: "Cuadrado" },
    "PTR_3X3_C11": { descripcion: "PTR 3x3 in (Calibre 11)", peso_kg_m: 11.20, tipo: "Cuadrado" },
    "PTR_4X2_C11": { descripcion: "PTR 4x2 in (Calibre 11)", peso_kg_m: 10.40, tipo: "Rectangular" },
    "PTR_6X2_C3_16": { descripcion: "PTR 6x2 in (Calibre 3/16)", peso_kg_m: 18.50, tipo: "Rectangular" }
  };
  
  // 3. TABLA DE PERFILES IPR (Vigas IPR de Patín Ancho)
  export const STV_TABLA_PESOS_IPR = {
    "IPR_8X10": { descripcion: "Viga IPR 8 x 10", peso_kg_m: 14.90, peralte_in: 8 },
    "IPR_10X15": { descripcion: "Viga IPR 10 x 15", peso_kg_m: 22.30, peralte_in: 10 },
    "IPR_12X19": { descripcion: "Viga IPR 12 x 19", peso_kg_m: 28.30, peralte_in: 12 }
  };
  
  /**
   * Función unificada para consultar el peso lineal (kg/m) de cualquier perfil
   * @param {string} categoria - 'HSS', 'PTR' o 'IPR'
   * @param {string} clave - Clave exacta del perfil
   */
  export function obtenerPesoPerfil(categoria, clave) {
    let tabla;
    if (categoria === 'HSS') tabla = STV_TABLA_PESOS_HSS;
    else if (categoria === 'PTR') tabla = STV_TABLA_PESOS_PTR;
    else if (categoria === 'IPR') tabla = STV_TABLA_PESOS_IPR;
    else return 0;
  
    const perfil = tabla[clave];
    if (!perfil) {
      console.warn(`STV Warning: Perfil ${clave} no encontrado en la categoría ${categoria}.`);
      return 0;
    }
    return perfil.peso_kg_m;
  }
  