// Vercel Serverless Function: Conexión oficial con Google Firebase Realtime Database
// Base de datos oficial: https://evidencia-floricultores-default-rtdb.firebaseio.com

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const FIREBASE_BASE = 'https://evidencia-floricultores-default-rtdb.firebaseio.com/entregas';

  // GET: Consultar todas las entregas bloqueadas del equipo
  if (req.method === 'GET') {
    try {
      const resp = await fetch(`${FIREBASE_BASE}.json`, { cache: 'no-store' });
      const rawData = await resp.json();

      let entregas = {};
      if (Array.isArray(rawData)) {
        rawData.forEach((item, idx) => {
          if (item && item.r1 && item.r2) {
            entregas[String(idx)] = item;
          }
        });
      } else if (rawData && typeof rawData === 'object') {
        for (const [k, v] of Object.entries(rawData)) {
          if (v && v.r1 && v.r2) {
            entregas[String(k)] = v;
          }
        }
      }

      return res.status(200).json({
        proyecto: 'IU Digital de Antioquia - Evidencia 1 Estructura de Datos',
        asignatura: 'Estructura de Datos',
        equipo: 'Asociación de Floricultores',
        entregas
      });
    } catch (err) {
      console.error('Error al consultar Firebase:', err);
      return res.status(200).json({
        entregas: {},
        errorMessage: err.message
      });
    }
  }

  // POST: Subir y bloquear la respuesta de un integrante en Firebase
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

      // Guardamos directamente en la ruta /entregas/[id].json en Firebase
      const targetUrl = `${FIREBASE_BASE}/${idIntegrante}.json`;
      const respFirebase = await fetch(targetUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ r1, r2, fecha })
      });

      if (!respFirebase.ok) {
        throw new Error(`Firebase respondió con error HTTP ${respFirebase.status}`);
      }

      const guardado = await respFirebase.json();

      return res.status(200).json({
        success: true,
        mensaje: `Entrega #${idIntegrante} bloqueada y guardada con éxito en Google Firebase`,
        registro: guardado
      });
    } catch (err) {
      console.error('Error al guardar en Firebase:', err);
      return res.status(500).json({ error: err.message || 'Error interno del servidor' });
    }
  }

  return res.status(405).json({ error: 'Método HTTP no permitido' });
};
