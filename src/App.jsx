import React from 'react';
// El "./" significa "busca en esta misma carpeta la subcarpeta components"
import STVDashboard from './components/STVDashboard.jsx';

function App() {
  return (
    <div className="w-screen h-screen m-0 p-0 overflow-hidden">
      <STVDashboard />
    </div>
  );
}

export default App;
