import React from 'react';
import { Edges, Html } from '@react-three/drei';

const PerfilHSS = ({ position, args }) => (
  <mesh position={position}>
    <boxGeometry args={args} />
    <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    <Edges color="#00FFFF" linewidth={2} />
  </mesh>
);

const EstructuraAristides = ({ datosIA }) => {
  const parametros = datosIA || {
    largo: 5.0,
    ancho: 5.0,
    altura: 4.0,
    pesoEstimadoKg: 440.0,
    perfilColumnas: 'HSS 4x4x1/4',
    perfilVigas: 'HSS 6x4x1/4'
  };

  const { largo, ancho, altura, pesoEstimadoKg, perfilColumnas, perfilVigas } = parametros;
  
  const extraerPulgadas = (perfil) => {
    const coincidencia = perfil?.match(/(\d+)x/);
    return coincidencia ? parseInt(coincidencia[1]) * 0.0254 : 0.20;
  };

  const grosorColumna = extraerPulgadas(perfilColumnas);
  const grosorVigaAlto = extraerPulgadas(perfilVigas);
  const grosorVigaAncho = grosorColumna;

  return (
    <group position={[0, 0, 0]}>
      {/* INYECCIÓN DE LA FUENTE ORBITRON Y HUD TRANSPARENTE */}
      <Html position={[0, altura + 1.5, 0]} center>
        <div>
          {/* Importación dinámica de Google Fonts para Orbitron */}
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&display=swap');
            .hud-orbitron {
              font-family: 'Orbitron', sans-serif !important;
            }
          `}</style>

          <div className="hud-orbitron" style={{
            /* Fondo con opacidad muy baja (translúcido/trasparente) y efecto cristal */
            background: 'rgba(0, 10, 20, 0.35)', 
            border: '1px solid rgba(0, 255, 255, 0.6)', 
            padding: '15px', 
            color: '#00FFFF', 
            fontSize: '11px', 
            letterSpacing: '1.5px',
            textTransform: 'uppercase', 
            backdropFilter: 'blur(2px)',
            boxShadow: '0 0 15px rgba(0, 255, 255, 0.15)',
            minWidth: '230px'
          }}>
            <div style={{ borderBottom: '1px solid rgba(0, 255, 255, 0.4)', paddingBottom: '6px', marginBottom: '6px', fontWeight: '700', textShadow: '0 0 8px rgba(0,255,255,0.8)' }}>
              MÓDULO: ARÍSTIDES V1
            </div>
            <div style={{ color: '#e0ffff', marginBottom: '4px', textShadow: '0 0 5px rgba(0,255,255,0.5)' }}>ESTADO: {datosIA ? 'SINTETIZADO (IA)' : 'MÓDULO BASE'}</div>
            <div style={{ color: '#b0e0e6', marginBottom: '3px' }}>DIMENSIONES: {ancho}M X {largo}M X {altura}M</div>
            <div style={{ color: '#b0e0e6', marginBottom: '3px' }}>COLUMNAS: {perfilColumnas}</div>
            <div style={{ color: '#b0e0e6', marginBottom: '3px' }}>VIGAS: {perfilVigas}</div>
            <div style={{ color: '#ffffff', marginTop: '6px', borderTop: '1px dotted rgba(0,255,255,0.4)', paddingTop: '6px', fontWeight: '700', textShadow: '0 0 8px rgba(0,255,255,0.8)' }}>
              PESO TOTAL: {pesoEstimadoKg} KG
            </div>
          </div>
        </div>
      </Html>

      {/* COLUMNAS */}
      <PerfilHSS position={[-ancho / 2, altura / 2, -largo / 2]} args={[grosorColumna, altura, grosorColumna]} />
      <PerfilHSS position={[ancho / 2, altura / 2, -largo / 2]} args={[grosorColumna, altura, grosorColumna]} />
      <PerfilHSS position={[-ancho / 2, altura / 2, largo / 2]} args={[grosorColumna, altura, grosorColumna]} />
      <PerfilHSS position={[ancho / 2, altura / 2, largo / 2]} args={[grosorColumna, altura, grosorColumna]} />

      {/* VIGAS LONGITUDINALES */}
      <PerfilHSS position={[-ancho / 2, altura, 0]} args={[grosorVigaAncho, grosorVigaAlto, largo - grosorColumna]} />
      <PerfilHSS position={[ancho / 2, altura, 0]} args={[grosorVigaAncho, grosorVigaAlto, largo - grosorColumna]} />
      
      {/* VIGAS TRANSVERSALES */}
      <PerfilHSS position={[0, altura, -largo / 2]} args={[ancho + grosorColumna, grosorVigaAlto, grosorVigaAncho]} />
      <PerfilHSS position={[0, altura, largo / 2]} args={[ancho + grosorColumna, grosorVigaAlto, grosorVigaAncho]} />
    </group>
  );
};

export default EstructuraAristides;
