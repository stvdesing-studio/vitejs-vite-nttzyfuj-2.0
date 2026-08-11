import * as THREE from 'three';

// 1. CATÁLOGO MAESTRO DE MATERIALES
export const STV_CATALOGO = {
  "HSS_4X4_CHARTREUSE": {
    descripcion: "Retícula Chartreuse Neón",
    visual: {
      colorHex: "#B9FD09",
      emissive: "#B9FD09", // Clave para el efecto Neón
      emissiveIntensity: 0.4, // Intensidad del brillo
      roughness: 0.2,
      metalness: 0.6,
      transparent: false
    }
  },
  "HSS_8X4_1_4_NEGRO": {
    descripcion: "Columnas HSS Negro Piano",
    visual: {
      colorHex: "#000000", // Negro puro y absoluto
      emissive: "#000000",
      emissiveIntensity: 0,
      roughness: 0.01,     // Pulido extremo tipo espejo
      metalness: 0.85,     // Alta reflectancia para capturar la luz del entorno
      transparent: false
    }
  },

  "GLASS_PANEL_TEAL": {
    descripcion: "Celosía Cerceta Translúcida",
    visual: {
      colorHex: "#028189",
      emissive: "#000000",
      emissiveIntensity: 0,
      roughness: 0.05,
      metalness: 0.2,
      transparent: true,
      opacity: 0.85,
      transmission: 0.9, // Clave para que la luz lo atraviese
      ior: 1.5
    }
  }
};

// 2. FUNCIÓN GENERADORA DE MATERIALES 3D
export function generarMaterialThreeJS(claveMaterial) {
  const specs = STV_CATALOGO[claveMaterial];
  
  if (!specs) return new THREE.MeshStandardMaterial({ color: 0xff00ff });

  // Si el material tiene transmisión (Cerceta Translúcido)
  if (specs.visual.transmission) {
    return new THREE.MeshPhysicalMaterial({
      color: specs.visual.colorHex,
      transmission: specs.visual.transmission,
      opacity: specs.visual.opacity,
      transparent: specs.visual.transparent,
      roughness: specs.visual.roughness,
      metalness: specs.visual.metalness,
      ior: specs.visual.ior,
    });
  }

  // Materiales Sólidos (Neón y Negro Piano)
  return new THREE.MeshStandardMaterial({
    color: specs.visual.colorHex,
    emissive: specs.visual.emissive,
    emissiveIntensity: specs.visual.emissiveIntensity,
    roughness: specs.visual.roughness,
    metalness: specs.visual.metalness,
    transparent: specs.visual.transparent,
  });
}
