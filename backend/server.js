import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import roomsRouter from './routes/rooms.js';
import reservationsRouter from './routes/reservations.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_, res) => res.send('API Hotel OK'));
app.use('/api/rooms', roomsRouter);
app.use('/api/reservations', reservationsRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API escuchando en http://localhost:${port}`));
