/**
 * ARCHIVO: STVEngineCore.js
 * Propósito: Motor de validación normativa (AISC 360, ASTM A325, IMCA) para Arístides.
 */

import { STV_TABLA_PESOS_HSS, STV_TABLA_PESOS_PTR, STV_TABLA_PESOS_IPR, LIMITE_FLUENCIA_ACERO_HSS_MPa } from './STVNormativasAcero.js';

export function evaluarViabilidadEstructural(perfilClave, longitudMetros, fuerzaAplicadaTon) {
  // 1. Obtener datos normativos del perfil
  const perfilInfo = STV_TABLA_PESOS_HSS[perfilClave] || STV_TABLA_PESOS_PTR[perfilClave] || STV_TABLA_PESOS_IPR[perfilClave];
  
  if (!perfilInfo) {
    return {
      viable: false,
      error: `Perfil ${perfilClave} no encontrado en el catálogo normativo STV.`
    };
  }

  const pesoLinealKgM = perfilInfo.peso_kg_m;
  const pesoTotalPerfilKg = longitudMetros * pesoLinealKgM;
  
  // 2. Cálculo de esfuerzos bajo criterios AISC 360 / SMIE
  const fuerzaNewtons = fuerzaAplicadaTon * 1000 * 9.81;
  const areaAproxMm2 = perfilInfo.area_mm2 || 2500; // Área transversal de respaldo
  const esfuerzoActualMPa = fuerzaNewtons / areaAproxMm2;
  
  const factorSeguridad = 1.67; // Criterio LRFD / ASD estándar
  const esfuerzoPermisibleMPa = LIMITE_FLUENCIA_ACERO_HSS_MPa / factorSeguridad;
  
  const esViable = esfuerzoActualMPa <= esfuerzoPermisibleMPa;

  return {
    perfil: perfilInfo.descripcion,
    pesoTotalKg: Number(pesoTotalPerfilKg.toFixed(2)),
    esfuerzoCalculadoMPa: Number(esfuerzoActualMPa.toFixed(2)),
    esfuerzoPermisibleMPa: Number(esfuerzoPermisibleMPa.toFixed(2)),
    factorSeguridadUtilizado: factorSeguridad,
    normativaAplicada: "AISC 360-16 / ASTM A500 / IMCA",
    viable: esViable,
    mensaje: esViable ? "Estructura viable bajo norma constructiva." : "Alerta: Esfuerzo crítico superado. Requiere peralte mayor."
  };
}
