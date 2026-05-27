import express from 'express';

const app = express();

import cors from 'cors';
app.use(cors());

app.use(express.json());
app.use(express.urlencoded());

import { router as categoryRouter } from './routes/category.js';
app.use(categoryRouter);

import { router as taskRouter } from './routes/task.js';
app.use(taskRouter);

app.listen(8800, () => {
    console.log("Api running at 8800...")
})