import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import EstructuraAristides from '../engine/EstructuraAristides';

const STVDashboard = () => {
  const [materialActivo, setMaterialActivo] = useState('Columnas HSS Negro Mate');
  const [datosEstructurales, setDatosEstructurales] = useState(null);
  const [cargando, setCargando] = useState(false);
  
  // Nuevo Estado: Almacena el texto que escribes para Arístides
  const [promptUsuario, setPromptUsuario] = useState('');

  const opcionesMateriales = [
    'Columnas HSS Negro Mate',
    'Superficies de Concreto',
    'Paneles de Madera Alta Veta'
  ];

  const procesarSintesis = async () => {
    // Si no hay texto, usamos un requerimiento por defecto por seguridad
    const peticion = promptUsuario.trim() !== '' 
      ? promptUsuario 
      : "Genera un marco estructural base de 5x5 metros con 4 metros de altura.";

    setCargando(true);
    try {
      const respuesta = await fetch('http://localhost:3010/api/sintetizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requerimientoCliente: peticion })
      });
      
      const datos = await respuesta.json();
      
      if(datos.geometria) {
         setDatosEstructurales(datos.geometria);
      }
    } catch (error) {
      console.error("[Error Estructural] Falla de conexión con Node.js:", error);
    }
    setCargando(false);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#0a0a0a', color: '#ffffff', fontFamily: 'sans-serif' }}>
      
      {/* PANEL LATERAL IZQUIERDO */}
      <div style={{ width: '300px', borderRight: '1px solid #222', padding: '30px 20px', display: 'flex', flexDirection: 'column', backgroundColor: '#050505', zIndex: 20 }}>
        <h2 style={{ fontSize: '18px', letterSpacing: '3px', color: '#00FFFF', textTransform: 'uppercase', margin: '0 0 5px 0' }}>STV Engine</h2>
        <p style={{ fontSize: '11px', color: '#666', letterSpacing: '1px', marginBottom: '40px', textTransform: 'uppercase' }}>Stage 2: Identidad Física</p>
        
        <h3 style={{ fontSize: '13px', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px', color: '#888', letterSpacing: '2px' }}>SISTEMAS CONSTRUCTIVOS</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {opcionesMateriales.map((material) => (
            <button 
              key={material}
              onClick={() => setMaterialActivo(material)}
              style={{
                backgroundColor: materialActivo === material ? 'rgba(0, 255, 255, 0.08)' : 'transparent',
                border: `1px solid ${materialActivo === material ? '#00FFFF' : '#222'}`,
                color: materialActivo === material ? '#00FFFF' : '#aaa',
                padding: '12px 15px', textAlign: 'left', fontSize: '13px', cursor: 'pointer', borderRadius: '4px', transition: 'all 0.2s ease', outline: 'none'
              }}
            >
              {material}
            </button>
          ))}
        </div>
      </div>

      {/* ÁREA DE VISUALIZACIÓN PRINCIPAL */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4f7f9' }}>
         <div style={{ position: 'absolute', top: '25px', right: '30px', fontSize: '11px', color: '#888', letterSpacing: '2px', zIndex: 10 }}>
            {cargando ? "SINTETIZANDO..." : "ESQUEMA TÉCNICO // LÍNEAS CERSETA"}
         </div>
         
         <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
            <Canvas camera={{ position: [10, 8, 15], fov: 45 }}>
              <color attach="background" args={['#f4f7f9']} />
              <fog attach="fog" args={['#f4f7f9', 15, 35]} />
              <ambientLight intensity={1} />
              <OrbitControls makeDefault target={[0, 2, 0]} />

              <EstructuraAristides datosIA={datosEstructurales} />

              <Grid position={[0, 0, 0]} args={[50, 50]} cellSize={1} cellThickness={1} cellColor="#e0e5ec" sectionSize={5} sectionThickness={1.5} sectionColor="#c8d0da" fadeDistance={30} fadeStrength={1} />
            </Canvas>
         </div>
      </div>

      {/* PANEL LATERAL DERECHO */}
      <div style={{ width: '300px', borderLeft: '1px solid #222', padding: '30px 20px', display: 'flex', flexDirection: 'column', backgroundColor: '#050505', zIndex: 20 }}>
        <h3 style={{ fontSize: '13px', marginBottom: '30px', color: '#888', letterSpacing: '2px' }}>PARÁMETROS DE ENTORNO F2</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: '#666', marginBottom: '8px', letterSpacing: '1px' }}>1. TABLERO BASE</label>
            <select style={{ width: '100%', padding: '10px', backgroundColor: '#111', color: '#aaa', border: '1px solid #333', borderRadius: '4px', outline: 'none' }}>
              <option>Esquema Técnico Cerseta</option>
            </select>
          </div>

          {/* NUEVO INPUT DE COMANDOS PARA ARÍSTIDES */}
          <div style={{ marginTop: '10px' }}>
            <label style={{ display: 'block', fontSize: '10px', color: '#00FFFF', marginBottom: '8px', letterSpacing: '1px' }}>2. CONSOLA DE DISEÑO</label>
            <textarea 
              value={promptUsuario}
              onChange={(e) => setPromptUsuario(e.target.value)}
              placeholder="Ej: Necesito una estructura de 12 metros de largo, 6 de ancho y 4 de altura..."
              style={{ 
                width: '100%', height: '80px', padding: '10px', backgroundColor: '#111', 
                color: '#fff', border: '1px solid #00FFFF', borderRadius: '4px', 
                outline: 'none', resize: 'none', fontSize: '12px' 
              }}
            />
          </div>

        </div>
        
        <button 
          onClick={procesarSintesis}
          disabled={cargando}
          style={{ backgroundColor: cargando ? '#555' : '#00FFFF', color: cargando ? '#aaa' : '#000000', padding: '15px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', border: 'none', borderRadius: '4px', cursor: cargando ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease', marginTop: '15px' }}
        >
          {cargando ? 'PROCESANDO...' : 'SINTETIZAR ENTORNO F2'}
        </button>
      </div>

    </div>
  );
};

export default STVDashboard;
