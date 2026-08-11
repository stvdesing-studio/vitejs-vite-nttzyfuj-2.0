// 1. IMPORTACIONES
// IMPORTANTE: 'import' siempre debe ir en minúscula en JavaScript.
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Cargamos las variables de entorno (como tu GEMINI_API_KEY oculta)
dotenv.config();

// 2. CONFIGURACIÓN DEL SERVIDOR
const app = express();
const PORT = 3010;

// Habilitamos CORS para que el frontend (React en puerto 5173) pueda hablar con este backend (puerto 3010)
app.use(cors());
// Habilitamos que el servidor pueda leer cuerpos de peticiones en formato JSON
app.use(express.json());

// 3. INICIALIZACIÓN DE LA IA
// El SDK automáticamente buscará la variable de entorno GEMINI_API_KEY
const ai = new GoogleGenAI({});

// =====================================================================
// EL NUEVO CEREBRO DE ARÍSTIDES (Capacidad "Boot" JSON Sincronizada)
// =====================================================================
// EDUCACIÓN: Las comillas invertidas (`) nos permiten escribir strings multilínea.
// Al ser tan específicos con la estructura JSON, evitamos que la IA responda con texto innecesario.
const ARISTIDES_SYSTEM_PROMPT = `
Eres Arístides, Arquitecto Jefe de la Matriz STV Sovereign Engine.
Tu función es recibir instrucciones de diseño y devolver ÚNICAMENTE un objeto JSON válido con los parámetros estructurales exactos.
Prioriza siempre sistemas arquitectónicos industriales y minimalistas.

REGLA ESTRICTA DE MATERIALES (CRÍTICO):
Para los campos de perfil, DEBES elegir exclusivamente UNA de las siguientes CLAVES EXACTAS de nuestra base de datos, dependiendo del diseño solicitado:
- "HSS_8X4_1_4_NEGRO" (Para estructuras pesadas, firmes o industriales en acero negro mate).
- "HSS_4X4_CHARTREUSE" (Para estructuras ligeras, dinámicas o acentos visuales).
- "GLASS_PANEL_TEAL" (Para requerimientos de cristal, cerramientos o superficies translúcidas).

No uses formato Markdown, no saludes, no expliques. Devuelve estrictamente esta estructura JSON:
{
  "largo": numero,
  "ancho": numero,
  "altura": numero,
  "perfilColumnas": "CLAVE_EXACTA_DEL_CATALOGO",
  "perfilVigas": "CLAVE_EXACTA_DEL_CATALOGO",
  "pesoEstimadoKg": numero
}
`;

// 4. RUTA PRINCIPAL DE SÍNTESIS
app.post('/api/sintetizar', async (req, res) => {
  try {
    // Extraemos lo que el usuario escribió en el Dashboard
    const { requerimientoCliente } = req.body;
    
    if (!requerimientoCliente) {
      return res.status(400).json({ error: 'Se requiere un input de diseño.' });
    }

    console.log(`[Arístides Boot] Evaluando: "${requerimientoCliente}"`);

        // Llamamos a Gemini usando el modelo más reciente y compatible
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash', // ✅ Actualizado a la versión más reciente y compatible
          contents: requerimientoCliente,
          config: { 
            systemInstruction: ARISTIDES_SYSTEM_PROMPT, 
            temperature: 0.1 // Temperatura baja para que sea muy matemático y preciso
          },
        });
    

    // EDUCACIÓN: La IA a veces envuelve el JSON en bloques de código de Markdown (```json ... ```).
    // Las siguientes líneas buscan esos bloques y los eliminan para que JSON.parse() no falle.
    let textoLimpio = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    const datosEstructurales = JSON.parse(textoLimpio);

    console.log('[Arístides Core] Síntesis exitosa:', datosEstructurales);

    // Devolvemos la respuesta al Dashboard de React
    res.json({
      origen: 'Arístides Core',
      geometria: datosEstructurales
    });

  } catch (error) {
    console.error('[Error de Matriz] Fallo en síntesis JSON:', error);
    res.status(500).json({ error: 'Fallo crítico en la síntesis estructural.' });
  }
});

// 5. ENCENDIDO DEL SERVIDOR
app.listen(PORT, () => {
  console.log(`[Sovereign Engine] Arístides Core sincronizado y activo en puerto ${PORT}`);
});
