import React, { useState } from 'react';

const STVDashboard = () => {
  const [paletaTablero, setPaletaTablero] = useState("Negro Acero Sólido (RAL 9005)");
  const [perimetroEstructura, setPerimetroEstructura] = useState("Blanco Arquitectónico + Sombra Volumétrica");
  const [acentoLuminioco, setAcentoLuminioco] = useState("LED Cautivo Ámbar / Oro Cálido");
  const [nivelRender, setNivelRender] = useState("Ray-Traced High Fidelity (Fotorrealista)");

  const handleSintetizar = () => {
    console.log("Configuración Fase 2 Aplicada:", {
      paletaTablero,
      perimetroEstructura,
      acentoLuminioco,
      nivelRender
    });
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      width: '100vw', 
      backgroundColor: '#0b0b0b', 
      margin: 0, 
      padding: 0, 
      overflow: 'hidden', 
      fontFamily: "'Orbitron', sans-serif", 
      color: '#FFFFFF' 
    }}>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&display=swap');
        * { font-family: 'Orbitron', sans-serif; box-sizing: border-box; }
      `}</style>

      {/* CABECERA */}
      <header style={{ 
        borderBottom: '1px solid #222', 
        padding: '20px 30px', 
        backgroundColor: '#111111', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end', 
        flexShrink: 0, 
        zIndex: 10,
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '900', letterSpacing: '4px', color: '#FFFFFF' }}>STV | STUDIO</h1>
          <p style={{ margin: '5px 0 0 0', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '2px' }}>Cognitive Structural Intelligence V2.0</p>
        </div>
      </header>

      {/* CUERPO CENTRAL */}
      <div style={{ display: 'flex', flex: 1, padding: '20px', gap: '20px', minHeight: 0, overflow: 'hidden' }}>
        
        {/* PANEL IZQUIERDO: VIEWPORT TÉCNICO CAD */}
        <div style={{ 
          flex: 1, 
          backgroundColor: '#0e0e0e', 
          borderRadius: '12px', 
          border: '1px solid #222', 
          overflow: 'hidden', 
          position: 'relative', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.9), 0 8px 24px rgba(0,0,0,0.6)' 
        }}>
          <div style={{ 
            position: 'absolute', 
            width: '100%', 
            height: '100%', 
            backgroundImage: 'linear-gradient(to right, #161616 1px, transparent 1px), linear-gradient(to bottom, #161616 1px, transparent 1px)', 
            backgroundSize: '40px 40px', 
            opacity: 0.4 
          }}></div>
          
          <div style={{ zIndex: 2, textAlign: 'center', color: '#777' }}>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '3px', margin: 0 }}>Viewport Fase 2 Activo</p>
            <span style={{ fontSize: '9px', color: '#555' }}>Paleta Integrada: Negro Sólido / Perímetro Blanco / Acento LED</span>
          </div>
        </div>

        {/* PANEL DERECHO: CONTROLES DE LA FASE 2 Y RENDERIZADO */}
        <div style={{ 
          width: '380px', 
          backgroundColor: '#121212', 
          borderRadius: '12px', 
          border: '1px solid #222', 
          padding: '25px', 
          display: 'flex', 
          flexDirection: 'column', 
          boxShadow: '0 8px 24px rgba(0,0,0,0.7)', 
          flexShrink: 0,
          overflowY: 'auto'
        }}>
          <h2 style={{ 
            fontWeight: '700', 
            borderBottom: '2px solid #333', 
            paddingBottom: '10px', 
            margin: '0 0 20px 0', 
            fontSize: '12px', 
            letterSpacing: '2px', 
            textTransform: 'uppercase', 
            color: '#FFFFFF' 
          }}>
            Parámetros de Entorno F2
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            {/* INPUT 1: Tablero Base */}
            <div style={{ padding: '12px', backgroundColor: '#181818', borderRadius: '8px', border: '1px solid #282828', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)' }}>
              <label style={{ display: 'block', color: '#888', fontSize: '9px', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '1px' }}>
                1. Tablero Base (Negro Mate)
              </label>
              <select 
                value={paletaTablero}
                onChange={(e) => setPaletaTablero(e.target.value)}
                style={{ width: '100%', background: '#111', color: '#FFF', border: '1px solid #333', padding: '8px', borderRadius: '4px', fontSize: '11px', outline: 'none' }}
              >
                <option value="Negro Acero Sólido (RAL 9005)">Negro Acero Sólido (RAL 9005)</option>
                <option value="Negro Grafito Texturizado">Negro Grafito Texturizado</option>
              </select>
            </div>

            {/* INPUT 2: Perímetro */}
            <div style={{ padding: '12px', backgroundColor: '#181818', borderRadius: '8px', border: '1px solid #282828', boxShadow: '0 4px 10px rgba(255,255,255,0.03)' }}>
              <label style={{ display: 'block', color: '#888', fontSize: '9px', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '1px' }}>
                2. Perímetro (Blanco + Sombra Volumétrica)
              </label>
              <select 
                value={perimetroEstructura}
                onChange={(e) => setPerimetroEstructura(e.target.value)}
                style={{ width: '100%', background: '#111', color: '#FFF', border: '1px solid #333', padding: '8px', borderRadius: '4px', fontSize: '11px', outline: 'none' }}
              >
                <option value="Blanco Arquitectónico + Sombra Volumétrica">Blanco Arquitectónico + Sombra Volumétrica</option>
                <option value="Blanco Puro Brillante">Blanco Puro Brillante</option>
              </select>
            </div>

            {/* INPUT 3: Acento Lumínico */}
            <div style={{ padding: '12px', backgroundColor: '#181818', borderRadius: '8px', border: '1px solid #282828' }}>
              <label style={{ display: 'block', color: '#888', fontSize: '9px', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '1px' }}>
                3. Acento Lumínico (Color de Vida)
              </label>
              <select 
                value={acentoLuminioco}
                onChange={(e) => setAcentoLuminioco(e.target.value)}
                style={{ width: '100%', background: '#111', color: '#FFF', border: '1px solid #333', padding: '8px', borderRadius: '4px', fontSize: '11px', outline: 'none' }}
              >
                <option value="LED Cautivo Ámbar / Oro Cálido">LED Cautivo Ámbar / Oro Cálido</option>
                <option value="Petrol Teal / Cian Profundo">Petrol Teal / Cian Profundo</option>
              </select>
            </div>

            {/* INPUT 4: Nivel de Renderizado */}
            <div style={{ padding: '12px', backgroundColor: '#181818', borderRadius: '8px', border: '1px solid #00D9FF33' }}>
              <label style={{ display: 'block', color: '#00D9FF', fontSize: '9px', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '1px', fontWeight: 'bold' }}>
                4. Nivel de Renderizado
              </label>
              <select 
                value={nivelRender}
                onChange={(e) => setNivelRender(e.target.value)}
                style={{ width: '100%', background: '#111', color: '#00D9FF', border: '1px solid #00D9FF55', padding: '8px', borderRadius: '4px', fontSize: '11px', outline: 'none', fontWeight: 'bold' }}
              >
                <option value="Ray-Traced High Fidelity (Fotorrealista)">Ray-Traced High Fidelity (Fotorrealista)</option>
                <option value="Realtime Preview (Borrador Rápido)">Realtime Preview (Borrador Rápido)</option>
                <option value="Cinematic Portra 400 Emulation">Cinematic Portra 400 Emulation</option>
              </select>
            </div>

          </div>

          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <button
              onClick={handleSintetizar}
              style={{ 
                width: '100%', 
                backgroundColor: '#FFFFFF', 
                color: '#000000', 
                padding: '14px', 
                fontSize: '11px', 
                fontWeight: '900', 
                textTransform: 'uppercase', 
                letterSpacing: '2px', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 15px rgba(255,255,255,0.2)'
              }}
              onMouseOver={(e) => { e.target.style.backgroundColor = '#00D9FF'; e.target.style.boxShadow = '0 4px 15px rgba(0,217,255,0.4)'; }}
              onMouseOut={(e) => { e.target.style.backgroundColor = '#FFFFFF'; e.target.style.boxShadow = '0 4px 15px rgba(255,255,255,0.2)'; }}
            >
              Sintetizar Entorno F2
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default STVDashboard;