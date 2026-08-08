import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useControls, Leva } from 'leva'; // <-- Importamos la UI paramétrica
import { GraphScene } from './components/GraphScene';

const App = () => {
  // Generamos nuestro "Árbol de Especificaciones" paramétrico
  const parametros = useControls('Geometría Estructural', {
    numNodos: { value: 120, min: 10, max: 300, step: 1, label: 'Nodos Base' },
    maxDistance: { value: 3.5, min: 1.0, max: 10.0, step: 0.1, label: 'Alcance Conexión' },
    spaceLimit: { value: 12, min: 5, max: 30, step: 1, label: 'Límite Espacial' }
  });

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#1A1A1A', cursor: 'grab' }}>
      
      {/* Interfaz visual de Leva (El panel flotante) */}
      <Leva theme={{ colors: { elevation1: '#222', elevation2: '#333' } }} />

      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <color attach="background" args={['#1A1A1A']} />
        
        <Environment preset="city" />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 10]} intensity={2} />
        
        {/* Pasamos los datos paramétricos a nuestra estructura */}
        <GraphScene 
          numNodos={parametros.numNodos} 
          maxDistance={parametros.maxDistance} 
          spaceLimit={parametros.spaceLimit} 
        />

        <OrbitControls 
            makeDefault 
            enableDamping 
            dampingFactor={0.05} 
            maxPolarAngle={Math.PI} 
            enablePan={true}
        />
      </Canvas>
    </div>
  );
};

export default App;