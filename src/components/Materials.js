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
