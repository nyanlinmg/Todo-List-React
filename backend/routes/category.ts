import express from 'express';
import { prisma } from "../lib/prisma.js";

export const router = express.Router();

router.get("/categories", async(req, res) => {
    const categories = await prisma.category.findMany({
        include: {
            tasks: true
        }
    });

    const total = await categories.length;

    res.status(200).json(categories);
})

router.get("/category/:id", async(req, res)  => {
    const id = Number(req.params.id);

    if(isNaN(id)) {
        return res.status(400).json({msg: 'id must be a number'});
    }

    const category = await prisma.category.findUnique({
        where: {id},
        include: {
            tasks: true
        },  
    });

    return res.status(200).json(category);
});

router.delete("/removeCategory/:id", async(req, res) => {
    try{
        const id = Number(req.params.id);

        if(isNaN(id)){
            return res.json(400).json({msg: "id must be number"});
        }

        const findCategory = await prisma.category.findUnique({
            where: {id}
        });

        if(!findCategory){
            return res.status(404).json({msg: "category not found"});
        }

        const count = await prisma.task.count({
            where: {
                categoryId: id
            }
        })

        if(count > 0){
            return res.status(401).json({msg: "Delete your tasks first , you are not allowed to delete this category."});
        }

        const deleteData = await prisma.category.delete({
            where: {id}
        });

        return res.status(200).json(deleteData);

    }catch(error){
        return res.status(500).json("Somthing went wrong");
    }
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