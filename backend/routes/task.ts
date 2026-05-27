import express from 'express';
import { prisma } from '../lib/prisma.js';

export const router = express.Router();

router.get('/tasks', async (req, res) => {
    const tasks = await prisma.task.findMany();

    res.status(200).json(tasks);
})

router.post('/tasks', async(req, res) => {
    const newTask = req.body?.task;
    const categoryId = req.body?.categoryId;
    const done = req.body?.done;
    const priority = req.body?.priority;

    if(!newTask || !categoryId) {
        return (
            res.status(400).json({
                msg: "task and category are required"
            })
        )
    }

    try {

        const task = await prisma.task.create({
            data: {
                tasks: newTask,
                categoryId,
                done,
                priority
            }
        })

        return res.status(201).json(task);

    } catch(e) {
        res.status(400).json({msg: "something went wrong"});
    }
})