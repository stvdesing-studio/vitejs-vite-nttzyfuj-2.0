/**
 * ARCHIVO: STV_CatalogoMaestro.js
 * Propósito: Base de datos estricta con la "verdad" constructiva.
 * Define las reglas físicas para volados limpios y sistemas textiles.
 */

export const STV_MATRIZ_MATERIALIDAD = {

    // 1. SUPERESTRUCTURA Y VOLADOS (Acero libre, sin tensores)
    SISTEMA_RIGIDO: {
        "HSS_VIGA_8X4_1_4_VOLADO": {
            tipo: "Perfil HSS Rectangular",
            uso_algoritmico: "Volados imponentes (Flexión Pura)",
            geometria: { base_pulgadas: 4, peralte_pulgadas: 8, espesor_pulgadas: 0.250 },
            fisica: { 
                peso_kg_m: 23.90, 
                limite_fluencia_MPa: 317,
                momento_inercia_cm4: 1250, // Clave matemática para evitar la deformación visual
                capacidad_soldadura_raiz_MPa: 480 // Soldadura AWS E70 que sostiene el volado mágico
            },
            reglas: {
                permite_tensores: false // Regla estricta: visualmente libre
            }
        }
    },

    // 2. ARQUITECTURA TEXTIL (Uso exclusivo de tensores)
    SISTEMA_MEMBRANA: {
        "CLEVIS_PERRYBOY_M20": {
            tipo: "Anclaje Articulado (Clevis)",
            uso_algoritmico: "Tensión en perímetro de lonarias",
            geometria: { diametro_pasador_mm: 20 },
            fisica: {
                limite_ruptura_corte_kN: 125 
            },
            reglas: {
                uso_exclusivo: "Solo para transferencia de tensión en membranas"
            }
        },
        "CABLE_ACERO_ESTRUCTURAL_16MM": {
            tipo: "Cable de Acero Inoxidable (1x19)",
            uso_algoritmico: "Tensores de perímetro para velaria",
            fisica: {
                peso_kg_m: 1.25,
                carga_rotura_minima_kN: 210 
            }
        }
    },

    // 3. TRANSFERENCIA A TIERRA
    SISTEMA_CIMENTACION: {
        "PLACA_BASE_CON_ANCLAS": {
            tipo: "Transferencia Acero-Concreto",
            uso_algoritmico: "Soporte de columnas rígidas a nivel 0.00",
            fisica: {
                resistencia_compresion_concreto_fc_MPa: 25, 
                resistencia_traccion_anclas_kN: 145 
            }
        }
    }
};

/**
 * Función para el Worker: Verifica si el diseño viola la pureza del volado.
 * Si un volado intenta usar un clevis, el algoritmo arrojará un error.
 */
export function auditarPurezaEstructural(tipoEstructura, tieneTensores) {
    if (tipoEstructura === "VOLADO" && tieneTensores === true) {
        return "ERROR: Un volado de acero STV debe ser imponente y libre de tensores. Revise el momento de inercia y la soldadura.";
    }
    return "Estructura viable.";
}
