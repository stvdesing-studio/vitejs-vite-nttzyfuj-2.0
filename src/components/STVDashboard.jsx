import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';

// Importamos la escena 3D y el hook de especificaciones
import { GraphScene } from './GraphScene';
import { useSpecificationTree } from './SpecificationTree';

const STVDashboard = () => {
  // Estados de los Hubs
  const [leftHubOpen, setLeftHubOpen] = useState(true);
  const [rightHubOpen, setRightHubOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('MACRO INSPECTION');
  const [activeTab, setActiveTab] = useState('RESUMEN');

  // Cargamos los parámetros de Leva (se ejecutarán en segundo plano o en un menú oculto)
  const parametrosLeva = useSpecificationTree();

  // Menú lateral basado en tus imágenes de referencia
  const menuItems = [
    'MACRO INSPECTION',
    'AUTHORITY LOOP',
    'THE INEVITABLE VERSION',
    'SYSTEM HANDOFF',
    'DEPLOYMENT PROTOCOL'
  ];

  // Pestañas del panel derecho
  const rightTabs = ['RESUMEN', 'DESPIECE', 'TABLA', 'SPECS', 'DIAG'];

  // Estilos base para el efecto de cristal (Glassmorphism)
  const glassStyle = {
    backgroundColor: 'rgba(15, 20, 25, 0.6)', // Fondo oscuro translúcido
    backdropFilter: 'blur(12px)', // Desenfoque del fondo (Efecto cristal)
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(0, 255, 255, 0.2)', // Borde cyan sutil
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    color: '#ffffff',
    pointerEvents: 'auto' // Permite hacer clic en el panel
  };

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#050505', position: 'relative', overflow: 'hidden', fontFamily: 'sans-serif' }}>
      
      {/* 1. CAPA 3D (Fondo Inmersivo) */}
      <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
          <Canvas camera={{ position: [20, 15, 25], fov: 45 }}>
            {/* 1. Fondo blanco puro absoluto */}
            <color attach="background" args={['#FFFFFF']} />
            
            {/* 2. BRUMA ELIMINADA: Quitamos la etiqueta <fog> para una visión limpia */}
            
            {/* 3. Entorno de estudio para reflejos nítidos en el Negro Piano */}
            <Environment preset="studio" /> 
            <ambientLight intensity={1.5} />
            <OrbitControls makeDefault enableDamping dampingFactor={0.05} />
            
            <GraphScene {...parametrosFinales} />
          </Canvas>
        </div>


      {/* 2. CAPA INTERFAZ HUD (Flotante sobre el 3D) */}
      {/* pointerEvents: 'none' permite que los clics pasen al 3D en las zonas vacías */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, pointerEvents: 'none', display: 'flex', flexDirection: 'column', padding: '20px', boxSizing: 'border-box' }}>
        
        {/* --- TOP BAR --- */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          
          {/* Logo y Canal */}
          <div style={{ ...glassStyle, padding: '15px 25px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ backgroundColor: '#00FFFF', color: '#000', padding: '2px 6px', fontWeight: 'bold', fontSize: '12px', borderRadius: '3px' }}>S.S</span>
              <span style={{ fontWeight: 'bold', letterSpacing: '2px', fontSize: '14px' }}>SYNERGY STUDIO</span>
            </div>
            <span style={{ fontSize: '10px', color: '#888', letterSpacing: '1px' }}>MOTOR INDUSTRIAL V4.8</span>
            <div style={{ marginTop: '10px', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px' }}>
              CANAL DE MANUFACTURA
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: '#B9FD09' }}>
              <div style={{ width: '6px', height: '6px', backgroundColor: '#B9FD09', borderRadius: '50%', boxShadow: '0 0 5px #B9FD09' }}></div>
              SISTEMA_OPERATIVO_V6
            </div>
          </div>

          {/* Overdrive y Protocolo */}
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div style={{ backgroundColor: '#00FFFF', color: '#000', padding: '10px 20px', fontWeight: 'bold', fontSize: '14px', letterSpacing: '1px', borderRadius: '4px', pointerEvents: 'auto', boxShadow: '0 0 15px rgba(0,255,255,0.4)' }}>
              ⚡ OVERDRIVE ACTIVO
            </div>
            <div style={{ ...glassStyle, padding: '10px 20px', borderRadius: '4px', fontSize: '12px', letterSpacing: '2px' }}>
              🔒 CANDADO
            </div>
            <div style={{ ...glassStyle, padding: '10px 20px', borderRadius: '4px', fontSize: '10px', letterSpacing: '2px', textAlign: 'right' }}>
              <span style={{ color: '#888' }}>PROTOCOLO DE DISEÑO</span><br/>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>PRO | RML | <span style={{ color: '#00FFFF' }}>STV MARK1</span></span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', flex: 1 }}>
          
          {/* --- HUB IZQUIERDO (MENÚ) --- */}
          {leftHubOpen && (
            <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {menuItems.map((item, index) => {
                const isActive = activeMenu === item;
                return (
                  <div 
                    key={index} 
                    onClick={() => setActiveMenu(item)}
                    style={{ 
                      ...glassStyle, 
                      padding: '20px', 
                      cursor: 'pointer',
                      borderLeft: isActive ? '4px solid #00FFFF' : '1px solid rgba(0,255,255,0.2)',
                      backgroundColor: isActive ? 'rgba(0, 255, 255, 0.15)' : 'rgba(15, 20, 25, 0.6)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ fontWeight: 'bold', fontSize: '13px', letterSpacing: '1px', color: isActive ? '#00FFFF' : '#FFF' }}>
                      {item}
                    </div>
                    <div style={{ fontSize: '9px', color: '#666', marginTop: '5px', letterSpacing: '1px' }}>
                      CÓDIGO_REF: STV-L0{index + 5}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* --- HUB DERECHO (MÉTRICAS Y EXPORTACIÓN) --- */}
          {rightHubOpen && (
            <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              {/* Panel de Métricas */}
              <div style={{ ...glassStyle, padding: '25px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontSize: '70px', fontWeight: '900', color: '#B9FD09', lineHeight: '1', fontStyle: 'italic' }}>
                    98%
                  </div>
                  <div style={{ fontSize: '20px', color: '#FFF' }}>
                    462kg
                  </div>
                </div>
                <div style={{ fontSize: '11px', letterSpacing: '2px', color: '#888', marginTop: '10px', marginBottom: '20px' }}>
                  NIVEL_INTEGRIDAD_MARK-1
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', gap: '15px', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px' }}>
                  {rightTabs.map(tab => (
                    <div 
                      key={tab} 
                      onClick={() => setActiveTab(tab)}
                      style={{ color: activeTab === tab ? '#00FFFF' : '#666', cursor: 'pointer', backgroundColor: activeTab === tab ? 'rgba(0,255,255,0.1)' : 'transparent', padding: '5px 10px', borderRadius: '3px' }}
                    >
                      {tab}
                    </div>
                  ))}
                </div>

                {/* Material Info */}
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', backgroundColor: '#FFF', borderRadius: '50%' }}></div>
                      <span style={{ fontWeight: 'bold', fontSize: '14px', letterSpacing: '1px' }}>ACERO HSS</span>
                    </div>
                    <div style={{ fontSize: '10px', color: '#00FFFF', marginTop: '5px', letterSpacing: '1px' }}>
                      HSS_4X4_CHARTREUSE
                    </div>
                  </div>
                  <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#FFF' }}>
                    16
                  </div>
                </div>
              </div>

              {/* Botones de Exportación */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}>
                <button style={{ 
                  ...glassStyle, 
                  backgroundColor: 'rgba(0, 255, 255, 0.1)', 
                  border: '1px solid #00FFFF', 
                  color: '#00FFFF', 
                  padding: '15px', 
                  fontSize: '12px', 
                  fontWeight: 'bold', 
                  letterSpacing: '2px', 
                  cursor: 'pointer',
                  textAlign: 'center'
                }}>
                  📊 EXPORTAR EXCEL
                </button>

                <button style={{ 
                  backgroundColor: '#B9FD09', 
                  border: 'none', 
                  color: '#000', 
                  padding: '20px', 
                  fontSize: '16px', 
                  fontWeight: '900', 
                  fontStyle: 'italic',
                  letterSpacing: '1px', 
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxShadow: '0 0 20px rgba(185, 253, 9, 0.4)',
                  pointerEvents: 'auto'
                }}>
                  EXPORTAR EXPEDIENTE<br/>
                  <span style={{ fontSize: '10px', fontWeight: 'normal', letterSpacing: '2px', fontStyle: 'normal' }}>MAESTRO_INDUSTRIAL.PDF</span>
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default STVDashboard;
