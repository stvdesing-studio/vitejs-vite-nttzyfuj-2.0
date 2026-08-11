/**
 * ARCHIVO: STVDatabaseMerger.js
 * Propósito: Fusionar múltiples arrays de ProductItems (HSS, PTR, Placas, Pernos) 
 * en un Diccionario de acceso instantáneo (O(1)) para el motor de Arístides.
 */

// Aquí importaremos los JSON que estás cargando
import perfilesParte1 from './STV_Material_Database_ProductItem.json';
import perfilesParte2 from './STV_Material_Database_ProductItem_2.json';
// import placasYPernos from './STV_Placas_Base.json'; <-- (A la espera de tu archivo)

export const construirCatalogoMaestro = () => {
  const catalogoUnificado = {};
  
  // Arreglo temporal con todas las bases de datos cargadas hasta ahora
  const todasLasBases = [perfilesParte1, perfilesParte2];

  todasLasBases.forEach(baseDatos => {
    baseDatos.forEach(item => {
      // Usamos el 'id' (ej. "prod-mx-ptr-4x4-c14") como llave única
      if (item && item.id) {
        catalogoUnificado[item.id] = item;
      }
    });
  });

  console.log(`[STV Indexer] Catálogo maestro ensamblado. Total de elementos: ${Object.keys(catalogoUnificado).length}`);
  return catalogoUnificado;
};

// Uso futuro: const DB_STV = construirCatalogoMaestro();
// Búsqueda instantánea: DB_STV["prod-mx-ptr-4x4-c14"].weightKg
