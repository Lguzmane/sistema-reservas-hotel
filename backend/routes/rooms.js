import { Router } from 'express';
import { pool } from '../db.js';
const router = Router();

// GET /api/rooms?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/', async (req, res) => {
  const { from, to } = req.query;
  try {
    if (!from || !to) {
      const all = await pool.query(
        'SELECT * FROM habitaciones WHERE activa = true ORDER BY numero'
      );
      return res.json(all.rows);
    }

    const q = `
      SELECT * FROM habitaciones h
      WHERE h.activa = true
        AND h.id NOT IN (
          SELECT habitacion_id FROM reservas r
          WHERE NOT (r.fecha_fin <= $1 OR r.fecha_inicio >= $2)
        )
      ORDER BY h.numero;
    `;
    const { rows } = await pool.query(q, [from, to]);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error listando habitaciones' });
  }
});

export default router;
