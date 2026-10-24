// Vercel Serverless Function: Manejador centralizado de entregas del equipo
// Permite guardar y consultar las respuestas desde cualquier dispositivo (PC, móvil, docente)
// sin problemas de CORS en los navegadores móviles.

module.exports = async function handler(req, res) {
  // Configuración de encabezados CORS abiertos para permitir consultas desde cualquier dispositivo
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Manejo de la solicitud preliminar preflight OPTIONS del navegador
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const STORAGE_ENDPOINT = 'https://extendsclass.com/api/json-storage/bin/adfaadf';

  // GET: Consultar todas las entregas bloqueadas del equipo
  if (req.method === 'GET') {
    try {
      const resp = await fetch(STORAGE_ENDPOINT);
      if (!resp.ok) {
        throw new Error(`Respuesta HTTP ${resp.status} del almacenamiento central`);
      }
      const data = await resp.json();
      return res.status(200).json(data || { entregas: {} });
    } catch (err) {
      console.error('Error al consultar entregas:', err);
      return res.status(200).json({
        proyecto: 'IU Digital de Antioquia - Evidencia 1 Estructura de Datos',
        entregas: {},
        warning: 'Caché fallback activa'
      });
    }
  }

  // POST: Subir y bloquear la respuesta de un integrante
  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (e) {}
      }

      if (!body || !body.id) {
        return res.status(400).json({ error: 'Datos de entrega incompletos (id requerido)' });
      }

      const idIntegrante = String(body.id);
      const r1 = String(body.r1 || '').trim();
      const r2 = String(body.r2 || '').trim();
      const fecha = body.fecha || new Date().toLocaleString('es-CO');

      if (!r1 || !r2) {
        return res.status(400).json({ error: 'Ambas respuestas deben contener texto' });
      }

      // 1. Obtenemos el estado más reciente del almacenamiento central
      let estadoActual = {
        proyecto: 'IU Digital de Antioquia - Evidencia 1 Estructura de Datos',
        asignatura: 'Estructura de Datos',
        equipo: 'Asociación de Floricultores',
        entregas: {}
      };

      try {
        const respConsulta = await fetch(STORAGE_ENDPOINT);
        if (respConsulta.ok) {
          const datosExistentes = await respConsulta.json();
          if (datosExistentes && typeof datosExistentes === 'object') {
            estadoActual = {
              ...estadoActual,
              ...datosExistentes,
              entregas: { ...(datosExistentes.entregas || {}) }
            };
          }
        }
      } catch (e) {
        console.warn('No se pudo consultar estado anterior, iniciando con base:', e);
      }

      // 2. Fusionamos la nueva entrega del integrante
      estadoActual.entregas[idIntegrante] = {
        r1,
        r2,
        fecha
      };
      estadoActual.ultimaActualizacion = new Date().toISOString();

      // 3. Guardamos el estado consolidado en el almacenamiento central
      const respGuardado = await fetch(STORAGE_ENDPOINT, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(estadoActual)
      });

      if (!respGuardado.ok) {
        throw new Error(`Fallo al guardar en almacenamiento HTTP ${respGuardado.status}`);
      }

      return res.status(200).json({
        success: true,
        mensaje: `Entrega #${idIntegrante} bloqueada y guardada con éxito en la nube`,
        entregas: estadoActual.entregas
      });
    } catch (err) {
      console.error('Error al guardar entrega en la nube:', err);
      return res.status(500).json({ error: err.message || 'Error interno del servidor' });
    }
  }

  return res.status(405).json({ error: 'Método HTTP no permitido' });
};
