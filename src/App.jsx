import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { GraphScene } from './components/GraphScene';
import { useSpecificationTree } from './components/SpecificationTree';
import { Leva } from 'leva';

export default function App() {
  const [panelsVisible, setPanelsVisible] = useState(false);
  const [promptUsuario, setPromptUsuario] = useState('');
  const [cargandoAristides, setCargandoAristides] = useState(false);
  const [geometriaAristides, setGeometriaAristides] = useState(null);
  
  const parametrosLeva = useSpecificationTree();

  // Función para conectar con el servidor Express
  const solicitarSintesisAAristides = async (e) => {
    e.preventDefault();
    if (!promptUsuario.trim()) return;

    setCargandoAristides(true);
    try {
      const response = await fetch('http://localhost:3010/api/sintetizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requerimientoCliente: promptUsuario }),
      });

      const data = await response.json();
      if (data && data.geometria) {
        setGeometriaAristides(data.geometria);
      }
    } catch (error) {
      console.error('Error comunicando con Arístides:', error);
    } finally {
      setCargandoAristides(false);
    }
  };

  // Mezclamos los parámetros: Si Arístides responde, sobrescribe las opciones de Leva
  const parametrosFinales = {
    ...parametrosLeva,
    numNodos: geometriaAristides ? Math.round(geometriaAristides.largo * 10) : parametrosLeva.numNodos,
    spaceLimit: geometriaAristides ? geometriaAristides.ancho : parametrosLeva.spaceLimit,
    perfilActivo: geometriaAristides ? geometriaAristides.perfilColumnas : parametrosLeva.perfilActivo,
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      
      <Leva 
        theme={{ 
          colors: { elevation1: '#0D0C0C', elevation2: '#424343', accent1: '#B9FD09', accent2: '#028189', highlight1: '#E3F804' },
          radii: { sm: '0px', md: '0px', lg: '0px' } 
        }} 
        flat={true} titleBar={{ drag: false, title: 'STV PIPELINE // F2' }}
      />

      <button 
        onClick={() => setPanelsVisible(!panelsVisible)}
        style={{
          position: 'absolute', top: '20px', left: '20px', zIndex: 1000,
          background: 'rgba(13, 12, 12, 0.65)', backdropFilter: 'blur(10px)',
          border: '1px solid #B9FD09', color: '#B9FD09', padding: '10px 18px',
          fontSize: '11px', fontWeight: 300, letterSpacing: '1.5px', cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(185, 253, 9, 0.15)', transition: 'all 0.3s ease'
        }}
      >
        {panelsVisible ? '[ OCULTAR SISTEMAS ]' : '[ + STV ENGINE ]'}
      </button>

      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        <Canvas camera={{ position: [0, 5, 15], fov: 45 }}>
          <color attach="background" args={['#FFFFFF']} />
          <Environment preset="city" />
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 20, 10]} intensity={1.5} />
          
          <GraphScene {...parametrosFinales} />

          <OrbitControls makeDefault enableDamping dampingFactor={0.05} />
        </Canvas>
      </div>

      {panelsVisible && (
        <div style={{ position: 'absolute', top: '75px', left: '20px', display: 'flex', gap: '15px', zIndex: 999, pointerEvents: 'none' }}>
          
          {/* Consola de Inteligencia Arístides */}
          <div style={{ pointerEvents: 'auto', width: '320px', background: 'rgba(13, 12, 12, 0.88)', backdropFilter: 'blur(14px)', border: '1px solid #028189', padding: '20px', color: '#F4F4F4' }}>
            <h3 style={{ fontSize: '12px', color: '#B9FD09', margin: '0 0 10px 0', letterSpacing: '1px' }}>ARÍSTIDES CORE</h3>
            
            <form onSubmit={solicitarSintesisAAristides} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <textarea
                value={promptUsuario}
                onChange={(e) => setPromptUsuario(e.target.value)}
                placeholder="Ingresar requerimiento (Ej: Genera una estructura ligera translúcida...)"
                rows={3}
                style={{ background: '#1A1A1A', border: '1px solid #424343', color: '#FFF', padding: '8px', fontSize: '11px', resize: 'none' }}
              />
              <button type="submit" disabled={cargandoAristides} style={{ background: '#B9FD09', color: '#0D0C0C', border: 'none', padding: '8px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                {cargandoAristides ? ' SINTETIZANDO...' : 'SINTETIZAR ENTORNO F2'}
              </button>
            </form>

            {geometriaAristides && (
              <div style={{ marginTop: '12px', fontSize: '9px', color: '#E3F804', borderTop: '1px solid #424343', paddingTop: '8px' }}>
                <div>PERFIL ASIGNADO: {geometriaAristides.perfilColumnas}</div>
                <div>PESO EST.: {geometriaAristides.pesoEstimadoKg} KG</div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
