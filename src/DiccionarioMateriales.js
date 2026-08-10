/**
 * ARCHIVO: DiccionarioMateriales.js
 * Propósito: Almacenar los datos físicos reales (2026) para inyectarlos en la física de Three.js
 */

// 1. BASE DE DATOS DE MATERIALES (JSON)
// Aquí registramos la sinergia absoluta de los pesos reales.
export const STV_Catalogo = {
    "PTR_6x2_CAL12": {
        tipo: "Perfil Tubular Rectangular",
        dimensiones: "6x2 pulgadas",
        calibre: 12,
        longitud_metros: 6.00,
        peso_total_kg: 54.00, // Tu dato real cuantificable
        colorHex: "#292929"
    },
    "HSS_4x4_1_4": {
        tipo: "Hollow Structural Section",
        dimensiones: "4x4 pulgadas",
        espesor_pulgadas: "1/4",
        longitud_metros: 6.00,
        peso_total_kg: 72.50,
        colorHex: "#1a1a1a"
    },
    "PANEL_CRISTAL_10MM": {
        tipo: "Cristal Templado",
        dimensiones: "800x400 mm",
        espesor_mm: 10,
        peso_total_kg: 8.00,
        colorHex: "#e0e0e0"
    }
};

// 2. FUNCIÓN NORMALIZADORA DE FÍSICA
/**
 * Convierte el peso real en kilogramos a un factor de resistencia (Inercia) para Three.js.
 * @param {number} pesoKg - El peso real extraído de STV_Catalogo.
 * @param {number} pesoMaximoReferencia - El objeto más pesado posible en tu sistema (ej. 100kg) para crear una escala.
 * @returns {number} Un valor de fricción/inercia (ej. 0.05 a 0.95)
 */
export const calcularInerciaVisual = (pesoKg, pesoMaximoReferencia = 100) => {
    // Si el objeto pesa 54kg, la relación será 0.54
    let relacionMasa = pesoKg / pesoMaximoReferencia;
    
    // Aseguramos que el valor nunca sea mayor a 0.95 para que el objeto no se quede "congelado"
    // y nunca sea menor a 0.05 para que no se mueva a velocidad luz.
    let factorInercia = Math.min(Math.max(relacionMasa, 0.05), 0.95);
    
    // Mientras más pesado (mayor factorInercia), el número resultante es más bajo,
    // lo que en la fórmula Lerp (interpolación) de Three.js significa un movimiento más lento y pesado.
    let multiplicadorFisico = 1.0 - factorInercia;

    return multiplicadorFisico;
};

// Ejemplo de uso para la consola o para enviar a tu InstancedMesh:
// const miPieza = STV_Catalogo["PTR_6x2_CAL12"];
// const inerciaThreeJS = calcularInerciaVisual(miPieza.peso_total_kg);
// console.log(`La pieza pesa ${miPieza.peso_total_kg}kg. Su inercia en la Lattice será de: ${inerciaThreeJS}`);
import * as THREE from 'three';

// Material Esferas: Cristal Cian
export const cyanMaterial = new THREE.MeshPhysicalMaterial({
  color: "#00E5FF",
  emissive: "#00C8FF",
  emissiveIntensity: 0.35,
  transmission: 0.82,
  thickness: 1.4,
  roughness: 0.03,
  metalness: 0,
  ior: 1.52,
  clearcoat: 1,
  clearcoatRoughness: 0.01
});

// Material Cilindros (Conexiones): Cristal Negro
export const blackGlassMaterial = new THREE.MeshPhysicalMaterial({
  color: "#090909",
  transmission: 0.90,
  opacity: 0.55,
  transparent: true,
  thickness: 0.6,
  roughness: 0.02,
  metalness: 0,
  ior: 1.52,
  clearcoat: 1,
  clearcoatRoughness: 0.01
});
