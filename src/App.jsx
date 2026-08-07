import React, { useState } from 'react';
import LaboratorioLattice from './LaboratorioLattice';
import STVDashboard from './components/STVDashboard';

function App() {
  const [iniciado, setIniciado] = useState(false);

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden', backgroundColor: '#000000', position: 'relative' }}>
      
      {!iniciado ? (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          
          {/* CAPA 1: IMAGEN DE FONDO */}
          {/* Si el ícono de imagen rota sigue saliendo, verifica que el nombre del archivo en la carpeta 'public' sea idéntico a src="/132150.png" */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
            <img src="/132150.png" alt="Fondo STV" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* CAPA 2: ESTRUCTURA 3D */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2, pointerEvents: 'none' }}>
            <LaboratorioLattice />
          </div>

          {/* CAPA 3: BOTÓN DE INICIO */}
          <button 
            onClick={() => setIniciado(true)}
            style={{
              position: 'absolute', bottom: '5%', right: '5%', width: '250px', height: '100px', zIndex: 3,
              background: 'transparent', border: 'none', cursor: 'pointer', outline: 'none'
            }}
            title="Iniciar Motor STV"
          />
        </div>
      ) : (
        <STVDashboard />
      )}
    </div>
  );
}

export default App;
