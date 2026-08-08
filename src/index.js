import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Configuración de rutas para módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 1. Inicializar variables de entorno
dotenv.config();

const app = express();
// Establecemos un puerto único y seguro
const PORT = 3010;

app.use(cors());
app.use(express.json());
app.use(express.static('static'));

// 2. Conectar el cliente de IA (Asegúrate de tener GEMINI_API_KEY en tu archivo .env)
const ai = new GoogleGenAI({});

const ARISTIDES_SYSTEM_PROMPT = `
Eres Arístides, Arquitecto Jefe y Orquestador de la Matriz STV Sovereign Engine.
Tu personalidad es clínica, técnica y elocuente, enfocada en la realidad constructiva.
`;

// =====================================================================
// INTERFAZ TÁCTIL PARA TABLET (Ruta Raíz)
// =====================================================================
app.get('/', (req, res) => {
  const htmlTablet = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sovereign Engine</title>
        <style>
            body { font-family: monospace; background-color: #F5F5F5; padding: 20px; color: #000; }
            textarea { width: 100%; height: 100px; padding: 10px; border: 2px solid #000; margin-bottom: 10px; font-family: monospace; }
            button { background-color: #000; color: #00E5FF; padding: 15px; border: none; font-weight: bold; width: 100%; text-transform: uppercase; margin-bottom: 20px; font-size: 16px; cursor: pointer; }
            button:hover { background-color: #111; }
            #respuesta { background-color: #fff; border: 1px solid #ccc; padding: 15px; min-height: 150px; white-space: pre-wrap; }
        </style>
    </head>
    <body>
        <h2>Módulo de Prueba: Arístides Core</h2>
        <p>Escribe tu instrucción:</p>
        
        <textarea id="inputMensaje">Saludos Arístides. Identifícate y dime cuál es tu enfoque de diseño en esta matriz.</textarea>
        
        <button onclick="enviarMensaje()">Sintetizar (Enviar)</button>
        
        <h3>Respuesta del Motor Cognitivo:</h3>
        <div id="respuesta">Esperando instrucciones...</div>

        <script>
            function enviarMensaje() {
                const mensaje = document.getElementById('inputMensaje').value;
                const cajaRespuesta = document.getElementById('respuesta');
                cajaRespuesta.innerText = "Sintetizando respuesta, por favor espera...";

                fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ mensajeUsuario: mensaje })
                })
                .then(res => res.json())
                .then(data => {
                    cajaRespuesta.innerText = data.textoCrudo || "Error: No se recibió texto.";
                })
                .catch(err => {
                    cajaRespuesta.innerText = "Error de conexión: " + err;
                });
            }
        </script>
    </body>
    </html>
    `;

  res.send(htmlTablet);
});

// =====================================================================
// API DE CONEXIÓN CON ARÍSTIDES (Puerta Trasera)
// =====================================================================
app.post('/api/chat', async (req, res) => {
  try {
    const { mensajeUsuario } = req.body;
    if (!mensajeUsuario)
      return res.status(400).json({ error: 'Mensaje requerido.' });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: mensajeUsuario,
      config: { systemInstruction: ARISTIDES_SYSTEM_PROMPT, temperature: 0.3 },
    });

    res.json({ origen: 'Arístides Core', textoCrudo: response.text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Fallo en motor cognitivo.' });
  }
});

// 4. Encender el servidor
app.listen(PORT, () => {
  console.log(
    `[Sovereign Engine] Arístides Core inicializado en el puerto ${PORT}`
  );
});
