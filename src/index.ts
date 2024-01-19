import express from 'express';
import cors from 'cors';
import productsRouter from './routes/productsRouter';
import usersRouter from './routes/usersRouter';
import { connectToDatabase } from './db';

const app = express();

app.use(cors());
app.use(express.json());

connectToDatabase();

app.use('/products', productsRouter);
app.use('/users', usersRouter);

const port = 3000;

app.listen(port, () => console.log(`Listening on port: ${port}`));
