import { Router } from 'express';
import { pool } from '../db.js';
const router = Router();

// POST /api/reservations
// body: { nombre, email, habitacion_id, fecha_inicio, fecha_fin }
router.post('/', async (req, res) => {
  const { nombre, email, habitacion_id, fecha_inicio, fecha_fin } = req.body;
  if (!nombre || !email || !habitacion_id || !fecha_inicio || !fecha_fin) {
    return res.status(400).json({ error: 'Faltan campos' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const cRes = await client.query(
      `INSERT INTO clientes (nombre, email)
       VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET nombre = EXCLUDED.nombre
       RETURNING id`,
      [nombre, email]
    );
    const cliente_id = cRes.rows[0].id;

    const disp = await client.query(
      `SELECT 1 FROM reservas
       WHERE habitacion_id = $1
         AND NOT (fecha_fin <= $2 OR fecha_inicio >= $3)
       LIMIT 1`,
      [habitacion_id, fecha_inicio, fecha_fin]
    );
    if (disp.rowCount > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'Habitación no disponible en ese rango' });
    }

    const rRes = await client.query(
      `INSERT INTO reservas (cliente_id, habitacion_id, fecha_inicio, fecha_fin, estado)
       VALUES ($1, $2, $3, $4, 'Pendiente')
       RETURNING id`,
      [cliente_id, habitacion_id, fecha_inicio, fecha_fin]
    );

    await client.query('COMMIT');
    res.status(201).json({ reserva_id: rRes.rows[0].id });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    res.status(500).json({ error: 'Error creando reserva' });
  } finally {
    client.release();
  }
});

export default router;
