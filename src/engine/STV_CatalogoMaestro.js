import * as THREE from 'three';

// 1. PALETA DE COLORES INSTITUCIONAL STV
export const STV_COLORS = {
  JetBlack: "#0D0C0C",
  ElectricChartreuse: "#B9FD09",
  ClassicTeal: "#028189"
};

// 2. CATÁLOGO MAESTRO DE MATERIALES
export const STV_CATALOGO = {
  "HSS_8X4_1_4_NEGRO": {
    descripcion: "HSS 8x4 in (Cal. 1/4) - Negro Mate",
    visual: {
      colorHex: STV_COLORS.JetBlack,
      roughness: 0.8, 
      metalness: 0.5, 
      transparent: false
    }
  },
  "HSS_4X4_CHARTREUSE": {
    descripcion: "HSS 4x4 in - Electric Chartreuse",
    visual: {
      colorHex: STV_COLORS.ElectricChartreuse,
      roughness: 0.4,
      metalness: 0.8,
      transparent: false
    }
  },
  "GLASS_PANEL_TEAL": {
    descripcion: "Cristal Tecnológico Teal",
    visual: {
      colorHex: STV_COLORS.ClassicTeal,
      roughness: 0.02,     
      metalness: 0.1,
      transparent: true,
      opacity: 0.65,
      transmission: 0.90   
    }
  }
};

// 3. FUNCIÓN GENERADORA DE MATERIALES 3D
export function generarMaterialThreeJS(claveMaterial) {
  const specs = STV_CATALOGO[claveMaterial];
  
  if (!specs) {
    return new THREE.MeshStandardMaterial({ color: 0xff00ff }); // Color de error
  }

  if (specs.visual.transmission) {
    return new THREE.MeshPhysicalMaterial({
      color: specs.visual.colorHex,
      transmission: specs.visual.transmission,
      opacity: specs.visual.opacity,
      transparent: specs.visual.transparent,
      roughness: specs.visual.roughness,
      metalness: specs.visual.metalness,
      ior: 1.52,
    });
  }

  return new THREE.MeshStandardMaterial({
    color: specs.visual.colorHex,
    roughness: specs.visual.roughness,
    metalness: specs.visual.metalness,
    transparent: specs.visual.transparent,
  });
}
