import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Play, Pause, RotateCw, Sliders, ZoomIn, ZoomOut, Info, Layers, Sparkles, Compass, 
  Activity, AlertTriangle, Camera, Download, SlidersHorizontal, ChevronDown, ChevronUp, 
  Maximize2, FileSpreadsheet, FileText, Eye, ShieldAlert, Box, Droplets, HardDrive, 
  CheckCircle2, ArrowRight, Calculator, Coins
} from "lucide-react";
import { Point3D, Edge } from "../lib/geometry";
import {
  STV_TABLA_PESOS_HSS,
  STV_TABLA_PESOS_PTR,
  STV_TABLA_PESOS_IPR,
  evaluarResistenciaElemento,
  LIMITE_FLUENCIA_ACERO_HSS_MPa
} from "../utils/STVNormativasAcero";
import { ProductItem } from "../types";
import { comprehensiveMaterialsDB } from "../data/materialsDB";

// --- FUNCIÓN MATEMÁTICA INTEGRADA ---
export function calcularPesoRealEstructura(edges: Edge[], points: Point3D[]): number {
  let pesoTotalKg = 0;
  edges.forEach((edge) => {
    const uIdx = edge.u !== undefined ? edge.u : (edge as any).source;
    const vIdx = edge.v !== undefined ? edge.v : (edge as any).target;
    const p1 = points[uIdx];
    const p2 = points[vIdx];
    if (p1 && p2) {
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dz = p2.z - p1.z;
      const longitudMetros = Math.sqrt(dx * dx + dy * dy + dz * dz) * 12.0;
      
      // Usamos un peso promedio de 23.90 kg/m (HSS 8x4 1/4)
      pesoTotalKg += longitudMetros * 23.90;
    }
  });
  return Number((pesoTotalKg / 1000).toFixed(3)); // Retorna Toneladas
}

interface Blueprint3DViewerProps {
  points: Point3D[];
  edges: Edge[];
  simulationParams?: {
    windForce: number; // km/h
    appliedLoad: number; // Tons
    materialName: string;
    elasticModulus: number; // GPa
    yieldStrength: number; // MPa
    materialDensity: number; // g/cm³
    complexity: number;
  };
  appliedLoadVal?: number;
  deflectionFactor?: number;
  yieldStrengthMpa?: number;
  style: string;
  title: string;
  onSelectNode?: (index: number | null) => void;
  totalCost?: number;
  products?: ProductItem[];
  volatilityFactor?: number;
  onNavigateToCatalog?: () => void;
}

export default function Blueprint3DViewer({
  points,
  edges,
  simulationParams,
  appliedLoadVal: propAppliedLoad,
  deflectionFactor: propDeflectionFactor,
  yieldStrengthMpa: propYieldStrength,
  style,
  title,
  onSelectNode,
  totalCost = 0,
  products = comprehensiveMaterialsDB,
  volatilityFactor = 1.0,
  onNavigateToCatalog
}: Blueprint3DViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [pitch, setPitch] = useState<number>(-0.38);
  const [yaw, setYaw] = useState<number>(0.65);
  const [zoom, setZoom] = useState<number>(1.15);
  const [projection, setProjection] = useState<"perspective" | "orthogonal">("perspective");
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  
  const [environmentTheme, setEnvironmentTheme] = useState<"blanco" | "petroleo">("blanco");

  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [motorSpeed, setMotorSpeed] = useState<number>(0.004);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [showNodeIds, setShowNodeIds] = useState<boolean>(false);
  const [showGroundGrid, setShowGroundGrid] = useState<boolean>(true);
  const [showFoundation, setShowFoundation] = useState<boolean>(true);
  const [deflectionCycle, setDeflectionCycle] = useState<number>(0);
  const [showBendingMoments, setShowBendingMoments] = useState<boolean>(true);
  const [showStressColors, setShowStressColors] = useState<boolean>(true);
  const [isHudTransparent, setIsHudTransparent] = useState<boolean>(true);

  const [showVolumetric3D, setShowVolumetric3D] = useState<boolean>(true);
  const [showExplodedHub, setShowExplodedHub] = useState<boolean>(false);
  const [explodedOffset, setExplodedOffset] = useState<number>(0.45);
  const [showTechnicalCallouts, setShowTechnicalCallouts] = useState<boolean>(true);
  const [showBOMTable, setShowBOMTable] = useState<boolean>(false);

  const [topHubOpen, setTopHubOpen] = useState<boolean>(true);
  const [leftHubOpen, setLeftHubOpen] = useState<boolean>(false);
  const [rightHubOpen, setRightHubOpen] = useState<boolean>(false);

  const [activeMaterialPreset, setActiveMaterialPreset] = useState<"acero" | "cristal" | "madera">("acero");

  const [isExpandedMode, setIsExpandedMode] = useState<boolean>(false);
  const [isFullScreenMode, setIsFullScreenMode] = useState<boolean>(false);
  const [mouseSensitivity, setMouseSensitivity] = useState<number>(1.0);
  const [show360Pad, setShow360Pad] = useState<boolean>(true);

  const dynamicTakeoff = useMemo(() => {
    const activeProducts = (products && products.length > 0) ? products : comprehensiveMaterialsDB;
    const factor = volatilityFactor || 1.0;

    let totalMeters = 0;
    edges.forEach((edge) => {
      const uIdx = edge.u !== undefined ? edge.u : (edge as any).source;
      const vIdx = edge.v !== undefined ? edge.v : (edge as any).target;
      const p1 = points[uIdx];
      const p2 = points[vIdx];
      if (p1 && p2) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dz = p2.z - p1.z;
        totalMeters += Math.sqrt(dx * dx + dy * dy + dz * dz) * 12.0;
      }
    });
    if (totalMeters === 0) totalMeters = edges.length * 6.0;

    const tramos6m = Math.max(1, Math.ceil(totalMeters / 6.0));
    const baseNodes = Math.max(2, points.filter((p) => p.y >= 0.35 || p.id === "0" || p.id === "1" || p.id.includes("BASE")).length);

    const steelProduct = activeProducts.find((p) => p.id === "prod-mx-006" || p.name.includes("HSS") || p.family === "Acero Estructural") || activeProducts[0];
    const plateProduct = activeProducts.find((p) => p.id === "prod-mx-009" || p.name.includes("Placa")) || activeProducts[1];
    const boltProduct = activeProducts.find((p) => p.id === "prod-mx-010" || p.name.includes("Perno")) || activeProducts[2];
    const concreteProduct = activeProducts.find((p) => p.id === "prod-mx-011" || p.name.includes("Concreto")) || activeProducts[3];
    const rebarProduct = activeProducts.find((p) => p.id === "prod-mx-005" || p.name.includes("Varilla")) || activeProducts[4];
    const glassProduct = activeProducts.find((p) => p.id === "prod-mx-012" || p.name.includes("Cristal")) || activeProducts[5];
    const woodProduct = activeProducts.find((p) => p.id === "prod-mx-013" || p.name.includes("Madera")) || activeProducts[6];

    const items = [
      {
        code: "D01", name: steelProduct?.name || "Perfil HSS Cuadrado 4x4", category: "Estructura Principal",
        qty: tramos6m, unit: "Tramo 6m", product: steelProduct,
        unitPrice: (steelProduct?.priceMXN || 3350) * factor, subtotal: tramos6m * ((steelProduct?.priceMXN || 3350) * factor),
        spec: `${totalMeters.toFixed(1)}m de perfil calculados del 3D`
      },
      {
        code: "D02", name: plateProduct?.name || "Placa de Asiento F1554", category: "Cimentación / Nudos",
        qty: baseNodes, unit: "Piezas", product: plateProduct,
        unitPrice: (plateProduct?.priceMXN || 1250) * factor, subtotal: baseNodes * ((plateProduct?.priceMXN || 1250) * factor),
        spec: `Placa base 8"x8"x3/4" en ${baseNodes} apoyo(s)`
      },
      {
        code: "D03", name: boltProduct?.name || "Perno Estructural A325 5/8\"", category: "Anclajes y Tornillería",
        qty: baseNodes * 4, unit: "Piezas", product: boltProduct,
        unitPrice: (boltProduct?.priceMXN || 85) * factor, subtotal: (baseNodes * 4) * ((boltProduct?.priceMXN || 85) * factor),
        spec: `4 pernos A325 por cada placa base`
      },
      {
        code: "D04", name: concreteProduct?.name || "Concreto f'c=250 kg/cm²", category: "Cimentación Aislada",
        qty: parseFloat((baseNodes * 0.864).toFixed(2)), unit: "m³", product: concreteProduct,
        unitPrice: (concreteProduct?.priceMXN || 2450) * factor, subtotal: (baseNodes * 0.864) * ((concreteProduct?.priceMXN || 2450) * factor),
        spec: `Zapatas aisladas 1.2x1.2x0.6m`
      },
      {
        code: "D05", name: rebarProduct?.name || "Varilla Corrugada No.3", category: "Refuerzo Estructural",
        qty: baseNodes * 2, unit: "Tramo 12m", product: rebarProduct,
        unitPrice: (rebarProduct?.priceMXN || 185) * factor, subtotal: (baseNodes * 2) * ((rebarProduct?.priceMXN || 185) * factor),
        spec: `Parrilla de armado en zapatas`
      },
      {
        code: "D06", name: glassProduct?.name || "Panel Cristal Templado 10mm", category: "Cerramiento Tectónico",
        qty: Math.max(4, Math.round(edges.length * 1.5)), unit: "m²", product: glassProduct,
        unitPrice: (glassProduct?.priceMXN || 1850) * factor, subtotal: Math.max(4, Math.round(edges.length * 1.5)) * ((glassProduct?.priceMXN || 1850) * factor),
        spec: `Fachada / Paneles transparentes`
      },
      {
        code: "D07", name: woodProduct?.name || "Panel Madera Roble Macizo 20mm", category: "Cerramiento Secundario",
        qty: Math.max(3, Math.round(edges.length * 1.2)), unit: "m²", product: woodProduct,
        unitPrice: (woodProduct?.priceMXN || 1650) * factor, subtotal: Math.max(3, Math.round(edges.length * 1.2)) * ((woodProduct?.priceMXN || 1650) * factor),
        spec: `Alistonado de roble estructural`
      }
    ];

    const nominalValueMXN = items.reduce((sum, item) => sum + item.subtotal, 0);
    const allMapped = items.every((i) => i.product && i.unitPrice > 0);

    return { items, nominalValueMXN, isCoherent: allMapped, volatilityFactor: factor, totalMeters, baseNodes };
  }, [points, edges, products, volatilityFactor]);

  const lastTouchDist = useRef<number | null>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const isDragging = useRef<boolean>(false);
  const lastMouseX = useRef<number>(0);
  const lastMouseY = useRef<number>(0);

  useEffect(() => {
    if (!isRotating) return;
    let animId: number;
    const tick = () => {
      setYaw((prev) => (prev + motorSpeed) % (2 * Math.PI));
      setDeflectionCycle((prev) => (prev + 0.08) % (2 * Math.PI));
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isRotating, motorSpeed]);

  const windForceVal = simulationParams?.windForce ?? propDeflectionFactor ?? 20;
  const appliedLoadVal = simulationParams?.appliedLoad ?? propAppliedLoad ?? 10;
  const E = simulationParams?.elasticModulus ?? 200;
  const yieldStrength = simulationParams?.yieldStrength ?? propYieldStrength ?? 317;

  const deflectionFactor = E > 0 ? (windForceVal * windForceVal * 0.004 + appliedLoadVal * 12) / (E * 0.22) : 0;
  const maxDeflectionMm = Number(deflectionFactor.toFixed(1));
  const stressEstimateMpa = Number((appliedLoadVal * 16 + windForceVal * windForceVal * 0.0055).toFixed(1));

  // --- AQUÍ ESTÁ INYECTADA LA FUNCIÓN DE CÁLCULO DE PESO REAL ---
  const totalWeightTons = calcularPesoRealEstructura(edges, points) + appliedLoadVal;
  
  const foundationCompressionMpa = Number((totalWeightTons * 9.81 / (points.length * 0.35 + 1.2)).toFixed(2));
  const factorOfSafety = stressEstimateMpa > 0 ? yieldStrength / stressEstimateMpa : 99;
  const isUnsafe = factorOfSafety < 1.1;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const centerX = width / 2 + panX;
    const centerY = height / 2 + panY;

    const isDarkPetroleo = environmentTheme === "petroleo";
    const bgColor = isDarkPetroleo ? "#002B30" : "#F8F7F4";
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    const project = (pt: Point3D, reflectionMirror = false): { x: number; y: number; zDepth: number } => {
      const isBase = pt.id.includes("BASE") || pt.y >= 0.45;
      const swayOffset = isBase ? 0 : Math.sin(deflectionCycle + pt.y * 4) * (deflectionFactor * 0.003);
      const sagOffset = isBase ? 0 : (appliedLoadVal * 0.005 * (0.5 - pt.y));

      const px = pt.x + swayOffset;
      const rawY = pt.y + sagOffset;
      const py = reflectionMirror ? (1.0 - rawY) : rawY;
      const pz = pt.z;

      const cosX = Math.cos(pitch);
      const sinX = Math.sin(pitch);
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);

      const x1 = px * cosY - pz * sinY;
      const z1 = px * sinY + pz * cosY;
      const y2 = py * cosX - z1 * sinX;
      const z2 = py * sinX + z1 * cosX;

      const scaleFactor = zoom * 140;

      if (projection === "orthogonal") {
        return { x: centerX + x1 * scaleFactor, y: centerY + y2 * scaleFactor, zDepth: z2 };
      } else {
        const d = 3.6;
        const perspective = d / (d + z2);
        return { x: centerX + x1 * scaleFactor * perspective, y: centerY + y2 * scaleFactor * perspective, zDepth: z2 };
      }
    };

    if (showGroundGrid) {
      ctx.save();
      const gridSize = 6;
      const gridSpacing = 0.45;
      const groundY = 0.50;

      const cornerNW = project({ x: -gridSize * gridSpacing, y: groundY, z: -gridSize * gridSpacing, id: "plane-nw" });
      const cornerNE = project({ x: gridSize * gridSpacing, y: groundY, z: -gridSize * gridSpacing, id: "plane-ne" });
      const cornerSE = project({ x: gridSize * gridSpacing, y: groundY, z: gridSize * gridSpacing, id: "plane-se" });
      const cornerSW = project({ x: -gridSize * gridSpacing, y: groundY, z: gridSize * gridSpacing, id: "plane-sw" });

      ctx.fillStyle = isDarkPetroleo ? "rgba(139, 255, 0, 0.09)" : "rgba(139, 255, 0, 0.12)";
      ctx.beginPath();
      ctx.moveTo(cornerNW.x, cornerNW.y);
      ctx.lineTo(cornerNE.x, cornerNE.y);
      ctx.lineTo(cornerSE.x, cornerSE.y);
      ctx.lineTo(cornerSW.x, cornerSW.y);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "#8BFF00";
      ctx.lineWidth = 2.0;
      ctx.stroke();
      ctx.restore();
    }

    const projectedPoints = points.map(pt => project(pt, false));

    const sortedEdgesWithIdx = edges.map((edge, idx) => {
      const uPt = projectedPoints[edge.u !== undefined ? edge.u : (edge as any).source];
      const vPt = projectedPoints[edge.v !== undefined ? edge.v : (edge as any).target];
      const zDepth = (uPt && vPt) ? (uPt.zDepth + vPt.zDepth) / 2 : 0;
      return { edge, idx, zDepth };
    }).sort((a, b) => b.zDepth - a.zDepth);

    sortedEdgesWithIdx.forEach(({ edge }) => {
      const p1 = projectedPoints[edge.u !== undefined ? edge.u : (edge as any).source];
      const p2 = projectedPoints[edge.v !== undefined ? edge.v : (edge as any).target];
      if (!p1 || !p2) return;

      let strokeWidth = 2.5;
      let strokeColor = isDarkPetroleo ? "#FFFFFF" : "#1C1C1C";

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    });

    projectedPoints.forEach((p, i) => {
      if (!p) return;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.5, 0, 2 * Math.PI);
      ctx.fillStyle = isDarkPetroleo ? "#00FFFF" : "#004F56";
      ctx.fill();
    });

  }, [points, edges, pitch, yaw, zoom, projection, showGroundGrid, deflectionCycle, panX, panY, environmentTheme, totalWeightTons, isUnsafe]);

  return (
    <div className="relative w-full flex items-center justify-center overflow-hidden aspect-[16/10] bg-white border border-[#1a1a1a]">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute top-3 left-3 bg-[#1a1a1a] text-[#8BFF00] px-3 py-1 font-mono text-xs font-bold uppercase border border-[#8BFF00]">
        Visor 3D Inicializado
      </div>
      <div className="absolute bottom-3 left-3 bg-white text-[#1a1a1a] px-3 py-1 font-mono text-xs font-bold border border-[#1a1a1a]">
        PESO REAL CALCULADO: {totalWeightTons.toFixed(2)} TONELADAS
      </div>
    </div>
  );
}

