import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import apiRoutes from './routes/index.js';
const app = express();
app.use(cors());
app.use(express.json());
// Main API Router
app.use('/api', apiRoutes);
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.listen(env.PORT, () => {
    console.log(`Secure Backend API running on http://localhost:${env.PORT}`);
});
