import React from 'react';
// Importamos tu Dashboard conectado
import STVDashboard from './components/STVDashboard';

function App() {
  // Le decimos a la aplicación que renderice el Dashboard principal
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <STVDashboard />
    </div>
  );
}

export default App;
