import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';

/**
 * ThreeJSCanvas
 * Lienzo 3D que recibe el 'estadoEstructural' para renderizar visualmente
 * la lógica constructiva.
 */
const ThreeJSCanvas = ({ estadoEstructural }) => {
    return (
        // Canvas es el contenedor principal de Three.js
        <Canvas camera={{ position: [0, 5, 15], fov: 50 }}>
            {/* Iluminación básica para el entorno */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 10]} intensity={1} />
            
            {/* Cuadrícula infinita para dar escala y perspectiva espacial */}
            <Grid 
                infiniteGrid 
                fadeDistance={40} 
                sectionColor="#000000" 
                cellColor="#e0e0e0" 
            />
            
            {/* Controles para poder rotar la cámara con el mouse */}
            <OrbitControls makeDefault />

            {/* Renderizado condicional: Si hay datos estructurales, dibujamos una representación */}
            {estadoEstructural && (
                <mesh position={[0, estadoEstructural.alturaColumna / 2, 0]}>
                    <boxGeometry args={[0.5, estadoEstructural.alturaColumna, 0.5]} />
                    <meshStandardMaterial color="#292929" />
                </mesh>
            )}
        </Canvas>
    );
};

export default ThreeJSCanvas;