/**
 * ARCHIVO: STVGestorMaterialidad.js
 * Propósito: Gestor de estados y puente de datos con el Catálogo Maestro STV.
 * Extrae las propiedades físicas y geométricas para futuras simulaciones FEA.
 */

import { STV_MATRIZ_MATERIALIDAD } from './STV_CatalogoMaestro';

export class STVGestorMaterialidad {
  constructor(perfilSeleccionado = "HSS_VIGA_8X4_1_4_VOLADO") {
    // Vinculación directa con la verdad constructiva del catálogo
    this.perfilBase = STV_MATRIZ_MATERIALIDAD.SISTEMA_RIGIDO[perfilSeleccionado];
    this.cimentacionBase = STV_MATRIZ_MATERIALIDAD.SISTEMA_CIMENTACION.PLACA_BASE_CON_ANCLAS;
  }

  /**
   * Obtiene las propiedades físicas del perfil activo (Peso, Fluencia, Inercia)
   */
  obtenerPropiedadesFisicas() {
    if (!this.perfilBase) {
      console.warn("Advertencia STV: Perfil no encontrado en la matriz. Usando valores por defecto.");
      return { peso_kg_m: 23.90, limite_fluencia_MPa: 317 };
    }
    return this.perfilBase.fisica;
  }

  /**
   * Obtiene las reglas geométricas y de diseño asociadas al componente
   */
  obtenerReglasConstructivas() {
    return this.perfilBase ? this.perfilBase.reglas : {};
  }

  /**
   * Valida la pureza estructural (Ej: Verifica si un volado intenta usar elementos prohibidos)
   */
  auditarEstructura(tipoEstructura, tieneTensores) {
    if (tipoEstructura === "VOLADO" && tieneTensores === true) {
      return "ERROR STV: Un volado de acero debe ser imponente y libre de tensores.";
    }
    return "Estructura viable y validada.";
  }
}

// Exportamos una instancia lista para usar en la aplicación
export const gestorMaterialesSTV = new STVGestorMaterialidad();
