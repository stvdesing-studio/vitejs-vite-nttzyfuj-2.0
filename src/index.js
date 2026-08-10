import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3010;

app.use(cors());
app.use(express.json());

// Conexión al cliente de IA
const ai = new GoogleGenAI({});

// =====================================================================
// EL NUEVO CEREBRO DE ARÍSTIDES (Capacidad "Boot" JSON)
// =====================================================================
const ARISTIDES_SYSTEM_PROMPT = `
Eres Arístides, Arquitecto Jefe de la Matriz STV Sovereign Engine.
Tu función es recibir instrucciones de diseño y devolver ÚNICAMENTE un objeto JSON válido con los parámetros estructurales exactos.
Prioriza siempre sistemas arquitectónicos industriales y minimalistas utilizando perfiles de acero HSS negro mate, concreto y maderas de alta veta. 
NO uses vigas IPR, utiliza exclusivamente perfiles estructurales tubulares (HSS).
No uses formato Markdown, no saludes, no expliques. Devuelve estrictamente esta estructura JSON:
{
  "largo": numero,
  "ancho": numero,
  "altura": numero,
  "perfilColumnas": "texto",
  "perfilVigas": "texto",
  "pesoEstimadoKg": numero
}
`;

// Ruta principal para recibir la orden de síntesis del frontend
app.post('/api/sintetizar', async (req, res) => {
  try {
    const { requerimientoCliente } = req.body;
    
    if (!requerimientoCliente) {
      return res.status(400).json({ error: 'Se requiere un input de diseño.' });
    }

    console.log(`[Arístides Boot] Evaluando: "${requerimientoCliente}"`);

    // El motor cognitivo genera la estructura
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: requerimientoCliente,
      config: { 
        systemInstruction: ARISTIDES_SYSTEM_PROMPT, 
        // Temperatura baja para respuestas clínicas, matemáticas y predecibles
        temperature: 0.1 
      },
    });

    // Limpieza de seguridad: Eliminamos cualquier bloque markdown accidental (```json)
    let textoLimpio = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Parseamos el texto a un objeto JavaScript real
    const datosEstructurales = JSON.parse(textoLimpio);

    // Devolvemos el código listo para ser renderizado en el Canvas 3D
    res.json({
      origen: 'Arístides Core',
      geometria: datosEstructurales
    });

  } catch (error) {
    console.error('[Error de Matriz] Arístides no pudo formatear el JSON:', error);
    res.status(500).json({ error: 'Fallo crítico en la síntesis del JSON estructural.' });
  }
});

app.listen(PORT, () => {
  console.log(`[Sovereign Engine] Arístides Core con capacidad BOOT activo en puerto ${PORT}`);
});
