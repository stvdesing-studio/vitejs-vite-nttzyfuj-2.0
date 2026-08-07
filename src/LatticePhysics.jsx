import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Componente: DynamicLattice
 * Genera una celosía infinita simulada donde cada nodo posee masa e inercia propia.
 */
const DynamicLattice = ({ gridSize = 10 }) => {
    const meshRef = useRef();
    const totalNodes = gridSize * gridSize * gridSize;

    // 1. CONSTRUCCIÓN DE LA MATRIZ DE DATOS (Física y Visual)
    // useMemo asegura que este cálculo pesado solo se haga una vez al inicio
    const { positions, masses, colors } = useMemo(() => {
        const positions = new Float32Array(totalNodes * 3);
        const masses = new Float32Array(totalNodes);
        
        // El color nos ayudará a denotar visualmente el peso de la pieza
        const colors = new Float32Array(totalNodes * 3);
        const colorLigero = new THREE.Color("#e0e0e0"); // Elemento visual ligero
        const colorPesado = new THREE.Color("#292929"); // Elemento visual denso/pesado

        let i = 0;
        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                for (let z = 0; z < gridSize; z++) {
                    // Posición inicial en el espacio euclidiano
                    positions[i * 3] = (x - gridSize / 2) * 1.5;
                    positions[i * 3 + 1] = (y - gridSize / 2) * 1.5;
                    positions[i * 3 + 2] = (z - gridSize / 2) * 1.5;

                    // Asignación de MASA simulada (valor entre 1 y 10)
                    // Aquí posteriormente conectaremos el algoritmo fractal
                    const currentMass = 1 + Math.random() * 9; 
                    masses[i] = currentMass;

                    // Interpolación visual: Cuanto más masa, más se acerca al color oscuro
                    const mixedColor = colorLigero.clone().lerp(colorPesado, currentMass / 10);
                    colors[i * 3] = mixedColor.r;
                    colors[i * 3 + 1] = mixedColor.g;
                    colors[i * 3 + 2] = mixedColor.b;

                    i++;
                }
            }
        }
        return { positions, masses, colors };
    }, [gridSize]);

    // 2. CICLO DE FÍSICA (Animación Constante)
    useFrame((state, delta) => {
        if (!meshRef.current) return;

        // Aquí es donde inyectaremos la fórmula de inercia y amortiguamiento
        // iterando sobre el array 'masses' para calcular el retraso en el movimiento
        // de las piezas más pesadas hacia su punto 0.
    });

    return (
        // InstancedMesh es crucial para renderizar miles de piezas pesadas
        // utilizando un solo llamado a la tarjeta gráfica.
        <instancedMesh ref={meshRef} args={[null, null, totalNodes]}>
            <boxGeometry args={[0.1, 0.1, 0.1]}>
                <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
            </boxGeometry>
            {/* Roughness alto para absorber la luz y comunicar realidad material */}
            <meshStandardMaterial vertexColors roughness={0.8} metalness={0.2} />
        </instancedMesh>
    );
};

export default DynamicLattice;