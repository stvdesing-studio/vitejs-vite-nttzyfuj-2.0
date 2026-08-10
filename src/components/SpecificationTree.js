// 1. IMPORTACIONES
// Asegúrate de usar 'import' en minúscula para evitar errores de compilación en JavaScript.
import { useControls, folder } from 'leva';

// Importamos la base de datos maestra. 
// Verifica que la ruta '../engine/STV_CatalogoMaestro' sea exacta según la estructura de tus carpetas.
import { STV_CATALOGO } from '../engine/STV_CatalogoMaestro';

/**
 * HOOK: useSpecificationTree
 * Propósito: Genera un panel de control interactivo (HUD) en la pantalla.
 * Extrae los valores y los devuelve como un objeto reactivo que actualizará el lienzo 3D en tiempo real.
 */
export const useSpecificationTree = () => {
  // Extraemos automáticamente los nombres de los perfiles (claves) de la base de datos.
  // Esto devuelve un arreglo de textos, por ejemplo: ["HSS_8X4_1_4_NEGRO", "HSS_4X4_CHARTREUSE"]
  const opcionesPerfiles = Object.keys(STV_CATALOGO);

  // useControls crea la interfaz gráfica y devuelve el estado actual de cada variable.
  return useControls('STV SPECIFICATION TREE', {
    
    // Carpeta 1: Controla la cantidad y distribución de los elementos en el espacio
    '1. Matriz Espacial': folder({
      numNodos: { value: 120, min: 10, max: 300, step: 1, label: 'Nodos Activos' },
      spaceLimit: { value: 12, min: 5, max: 30, step: 1, label: 'Límite Volumen' }
    }),

    // Carpeta 2: Controla las tolerancias y dimensiones físicas para las transferencias de carga
    '2. Propiedades Físicas': folder({
      maxDistance: { value: 3.5, min: 1.0, max: 10.0, step: 0.1, label: 'Alcance Unión' },
      hssRadius: { value: 0.015, min: 0.005, max: 0.05, step: 0.001, label: 'Radio HSS' }
    }),

    // Carpeta 3: Menú dinámico conectado a la realidad constructiva (Catálogo Maestro)
    '3. Sistema Constructivo': folder({
      perfilActivo: { 
        options: opcionesPerfiles, // Poblamos el menú desplegable con el arreglo de llaves
        label: 'Perfil / Material' 
      }
    }),

    // Carpeta 4: Ajustes visuales para la presentación
    '4. Tolerancias': folder({
      showNodes: { value: true, label: 'Ver Nodos' }
    })
    
  });
};
