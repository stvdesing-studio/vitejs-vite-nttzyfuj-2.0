/**
 * ARCHIVO: STVMetalurgia.js
 * Propósito: Auditor algorítmico de conexiones, anclajes (ACI 318/F1554) y termodinámica de soldaduras (AWS D1.1).
 */

export const auditarConexionBase = (espesorPlacaMm, gradoPlaca, tipoPernoClave) => {
    const reporteAuditoria = {
      aprobado: true,
      alertasCriticas: [],
      especificacionSoldadura: {},
      validacionAnclaje: {}
    };
  
    // 1. VALIDACIÓN DE ANCLAJES (F1554 vs A325)
    if (tipoPernoClave.toUpperCase().includes("A325")) {
      reporteAuditoria.aprobado = false;
      reporteAuditoria.alertasCriticas.push(
        "ERROR ACI 318: Prohibido usar tornillos ASTM A325 / F3125 como pernos de anclaje embebidos. Utilizar ASTM F1554."
      );
    } else if (tipoPernoClave.toUpperCase().includes("F1554")) {
      reporteAuditoria.validacionAnclaje.estatus = "CUMPLE ACI 318";
      if (tipoPernoClave.includes("GR55")) {
        reporteAuditoria.validacionAnclaje.nota = "F1554 Grado 55 detectado. Exigir Suplemento S1 si se requiere soldar placa de arandela (washer plate).";
      } else if (tipoPernoClave.includes("GR105")) {
        reporteAuditoria.validacionAnclaje.nota = "F1554 Grado 105 detectado. PROHIBIDO SOLDAR (Tratado térmicamente).";
      }
    }
  
    // 2. LÓGICA TERMODINÁMICA Y PRECALENTAMIENTO (AWS D1.1 - Prevención HICC)
    let precalentamiento = "";
    if (espesorPlacaMm <= 20) {
      precalentamiento = "No obligatorio (0°C). Si el ambiente es < 0°C, precalentar a 20°C (70°F).";
    } else if (espesorPlacaMm > 20 && espesorPlacaMm <= 38) {
      precalentamiento = "10°C (50°F) Mínimo. Calentamiento ligero requerido.";
    } else if (espesorPlacaMm > 38 && espesorPlacaMm <= 65) {
      precalentamiento = "65°C (150°F) Mínimo. Precalentamiento mandatorio sostenido.";
    } else {
      precalentamiento = "110°C (225°F) Mínimo estricto. Monitorear temperatura interpaso.";
    }
  
    // 3. SELECCIÓN DE CONSUMIBLES (Bajo Hidrógeno)
    let consumible = "E7018 con sufijo H4 o H8 (Bajo Hidrógeno difusible).";
    if (gradoPlaca.toUpperCase().includes("A588") || gradoPlaca.toUpperCase().includes("CORTEN")) {
      consumible = "Electrodos aleados Ni-Cu (ej. E8018-W) para igualar pátina de oxidación y resistencia a corrosión.";
    }
  
    reporteAuditoria.especificacionSoldadura = {
      riesgoHICC: espesorPlacaMm > 38 ? "ALTO" : "MODERADO",
      temperaturaPrecalentamientoAWS: precalentamiento,
      consumibleAprobado: consumible,
      notaGrout: "OBLIGATORIO: Asentar sobre Grout cementicio Non-Shrink para transferencia uniforme de esfuerzos bajo AISC DG1."
    };
  
    return reporteAuditoria;
  };
  
  /**
   * Función geométrica de soldadura de filete (AISC LRFD)
   */
  export const calcularCapacidadCorteFilete = (catetoMm, longitudMm) => {
    // LRFD: phi * 0.60 * Fexx * (0.707 * w) * Lw
    const phi = 0.75;
    const Fexx_MPa = 485; // Para E7018 (70 ksi)
    const gargantaEfectivaMm = 0.707 * catetoMm;
    
    const resistenciaNewtons = phi * (0.60 * Fexx_MPa) * gargantaEfectivaMm * longitudMm;
    return Number((resistenciaNewtons / 1000).toFixed(2)); // Retorna en kN
  };
  