import express from 'express';
import { prisma } from '../lib/prisma.js';

export const router = express.Router();

router.get('/tasks', async (req, res) => {
    const tasks = await prisma.task.findMany({
        include: {
            category: true
        }
    });

    res.status(200).json(tasks);
})

router.put("/editTask/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const newTask = req.body?.newTask;
        const categoryId = Number(req.body?.categoryId);

        const task = await prisma.task.update({
            where: {id},
            data: {
                tasks: newTask,
                categoryId
            }
        })

        return res.status(200).json({msg: "Edited new task successfully"});

    }catch(error) {
        console.log(error);
        return res.status(500).json({msg: "Something went wrong"});
    }
})

router.put('/doneTask/:id', async (req, res) => {
    
    try {
        const id = Number(req.params.id);

        const task = await prisma.task.update({
            where: {
                id
            },
            data: {
                done: true
            }
        })

        return res.status(200).json({msg: "Your task is completed..."});

    }catch(error) {
        return res.status(500).json({msg: "Something went wrong"});
    }
})

router.delete('/deleteTask/:id', async (req, res) => {
    try{
        const id = Number(req.params.id);

        const task = await prisma.task.delete({
            where: {
                id
            }
        })

        return res.status(200).json({msg: "Task deleted successfully"});
    } catch (error) {

        res.status(500).json({
            error: "Failed to delete task"
        })
    }
})

router.post('/tasks', async(req, res) => {
    const newTask = req.body?.newtask;
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
            },
            include: {
                category: true 
            }
        })

        return res.status(201).json({
            task,
            msg: "added your task successfully"
        });

    } catch(e) {
        res.status(400).json({msg: "something went wrong"});
    }
})