import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { GraphScene } from './components/GraphScene';

export default function App() {
  // Estado para alternar la visibilidad de los paneles laterales (True = Visible, False = Oculto)
  const [panelsVisible, setPanelsVisible] = useState(false);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', backgroundColor: '#F4F4F4', overflow: 'hidden' }}>
      
      {/* --- BOTÓN FLOTANTE SUTIL (Esquina Superior Izquierda) --- */}
      <button 
        onClick={() => setPanelsVisible(!panelsVisible)}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.25)', // Alta opacidad/translúcido estilo HUD
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(0, 229, 255, 0.4)',
          color: '#111',
          padding: '10px 16px',
          fontSize: '12px',
          fontFamily: 'monospace',
          letterSpacing: '1px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
        }}
      >
        {panelsVisible ? '[ OCNULTAR HUBS ]' : '[ + MENÚ / SISTEMAS ]'}
      </button>

      {/* --- PANTALLA CENTRAL (100% Ancho y Alto) --- */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        <Canvas camera={{ position: [0, 5, 15], fov: 45 }}>
          <color attach="background" args={['#F4F4F4']} />
          <Environment preset="city" />
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 20, 10]} intensity={1.5} />
          
          <GraphScene />

          <OrbitControls makeDefault enableDamping dampingFactor={0.05} />
        </Canvas>
      </div>

      {/* --- PANELES LATERALES RETRÁCTILES (HUDs Flotantes traslúcidos) --- */}
      {panelsVisible && (
        <div style={{
          position: 'absolute',
          top: '70px',
          left: '20px',
          display: 'flex',
          gap: '15px',
          zIndex: 999,
          pointerEvents: 'none' // Permite interactuar con el canvas detrás si es necesario
        }}>
          {/* Panel Izquierdo: STV Engine */}
          <div style={{
            pointerEvents: 'auto',
            width: '280px',
            background: 'rgba(240, 244, 248, 0.75)', // Opacidad alta para ver el fondo
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            padding: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            fontFamily: 'monospace'
          }}>
            <h3 style={{ fontSize: '14px', color: '#00E5FF', margin: '0 0 10px 0' }}>STV ENGINE</h3>
            <p style={{ fontSize: '11px', color: '#333' }}>Control de sistemas constructivos y normativas activas.</p>
          </div>

          {/* Panel Derecho: Parámetros F2 */}
          <div style={{
            pointerEvents: 'auto',
            width: '280px',
            background: 'rgba(240, 244, 248, 0.75)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            padding: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            fontFamily: 'monospace'
          }}>
            <h3 style={{ fontSize: '14px', color: '#00E5FF', margin: '0 0 10px 0' }}>PARÁMETROS F2</h3>
            <p style={{ fontSize: '11px', color: '#333' }}>Consola de diseño paramétrico e instrucciones de taller.</p>
          </div>
        </div>
      )}

    </div>
  );
}
