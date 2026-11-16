
import express from 'express';
import cors from 'cors';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const orphanageRouter = require('../routes/orphanages.js');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/orphanages', orphanageRouter);

export default app;
