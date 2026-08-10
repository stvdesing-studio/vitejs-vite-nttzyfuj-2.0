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
  // Si la IA aún no ha respondido, usamos un módulo base por defecto
  const parametros = datosIA || {
    largo: 5.0,
    ancho: 5.0,
    altura: 4.0,
    pesoEstimadoKg: 440.0
  };

  const { largo, ancho, altura, pesoEstimadoKg } = parametros;
  
  // Grosores paramétricos fijos para el esquema técnico
  const grosorColumna = 0.25;
  const grosorVigaAlto = 0.30;
  const grosorVigaAncho = 0.25;

  return (
    <group position={[0, 0, 0]}>
      {/* Etiqueta de Datos HUD */}
      <Html position={[0, altura + 1, 0]} center>
        <div style={{
          background: 'rgba(0, 5, 10, 0.85)', border: '1px solid #00FFFF', padding: '10px', 
          color: '#00FFFF', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '1px',
          textTransform: 'uppercase', backdropFilter: 'blur(4px)'
        }}>
          <div>ESTADO: {datosIA ? 'SINTETIZADO' : 'MÓDULO BASE'}</div>
          <div style={{ color: '#aaa', marginTop: '4px' }}>PESO ESTRUCTURAL: {pesoEstimadoKg} KG</div>
          <div style={{ color: '#aaa' }}>DIMENSIONES: {ancho}m x {largo}m x {altura}m</div>
        </div>
      </Html>

      {/* COLUMNAS HSS */}
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
