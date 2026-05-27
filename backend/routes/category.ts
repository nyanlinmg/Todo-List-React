import express from 'express';
import { prisma } from "../lib/prisma.js";

export const router = express.Router();

router.get("/categories", async(req, res) => {
    const categories = await prisma.category.findMany({
        include: {
            tasks: true
        }
    });

    res.status(200).json(categories);
})

router.post("/addCategory", async (req, res) => {
    const name = req.body?.name;

    if(!name) {
        return res.status(400).json({msg: 'name is required'});
    }

    try {
        const category = await prisma.category.create({
            data: {
                name
            }
        })

        return res.status(201).json(category);
    } catch(e) {
        res.json(400).json({msg: 'something went wrong'});
    }
})