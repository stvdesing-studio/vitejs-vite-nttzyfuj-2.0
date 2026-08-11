import React from 'react';
import STVDashboard from './components/STVDashboard';

function App() {
  return (
    // Forzamos estrictamente el 100% del ancho y alto de la ventana
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#0a0a0a' }}>
      <STVDashboard />
    </div>
  );
}

export default App;
