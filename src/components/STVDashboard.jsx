import React, { useState } from 'react';
import STVTranslator from '../engine/STVTranslator.jsx';
import ThreeJSCanvas from './ThreeJSCanvas.jsx';

const STVDashboard = () => {
    const [instruccion, setInstruccion] = useState("");
    const [cargando, setCargando] = useState(false);
    const [estadoEstructural, setEstadoEstructural] = useState(null);

    const handleGenerar = async () => {
        if (!instruccion.trim()) return;
        setCargando(true);

        try {
            const resultado = await STVTranslator(instruccion);
            if (resultado && resultado.parametros) {
                setEstadoEstructural(resultado.parametros);
                setInstruccion("");
            }
        } catch (error) {
            console.error("Error estructural:", error);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#F5F5F5] text-black font-mono relative overflow-hidden">
            <header className="border-b border-[#292929] pb-3 mb-2 flex justify-between items-end p-4">
                <div>
                    <h1 className="text-2xl font-black tracking-widest uppercase">STV ATTENTION ENGINE</h1>
                    <p className="text-xs text-[#00E5FF]">COGNITIVE STRUCTURAL INTELLIGENCE V2.0</p>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Lienzo 3D */}
                <div className="w-3/4 h-full border-r border-black shadow-[10px_0_30px_rgba(0,0,0,0.1)]">
                    <ThreeJSCanvas estadoEstructural={estadoEstructural} />
                </div>

                {/* Panel lateral de datos técnicos */}
                <div className="w-1/4 h-full bg-white p-4 flex flex-col gap-4 overflow-y-auto">
                    <h2 className="font-bold border-b border-black pb-1">VIABILIDAD TÉCNICA</h2>
                    
                    {estadoEstructural ? (
                        <div className="text-sm flex flex-col gap-3">
                            <div>
                                <span className="block text-gray-500 text-xs">MATERIAL</span>
                                <span className="font-bold">{estadoEstructural.perfil}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 text-xs">APOYOS</span>
                                <span className="font-bold">{estadoEstructural.cantidadColumnas} Columnas / {estadoEstructural.alturaColumna}m Altura</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 text-xs">ESTABILIDAD</span>
                                <span className="font-bold text-green-700">{estadoEstructural.estabilidad}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 text-xs">CRITERIO</span>
                                <span className="font-bold">{estadoEstructural.normativa} / {estadoEstructural.soldadura}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-400">
                            Esperando ingreso de datos estructurales...
                        </div>
                    )}
                </div>
            </div>

            {/* Consola de Entrada */}
            <div className="p-4 bg-[#fafafa] border-t border-black">
                <div className="flex gap-2">
                    <input
                        type="text"
                        className="flex-1 border border-black p-2 outline-none bg-transparent"
                        placeholder="Ejemplo: Generar marco estructural de 10 metros..."
                        value={instruccion}
                        onChange={(e) => setInstruccion(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerar()}
                    />
                    <button
                        onClick={handleGenerar}
                        disabled={cargando}
                        className="bg-black text-white px-6 py-2 font-bold uppercase disabled:bg-gray-400 hover:bg-gray-800 transition-colors"
                    >
                        {cargando ? 'Sintetizando...' : 'Sintetizar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default STVDashboard;