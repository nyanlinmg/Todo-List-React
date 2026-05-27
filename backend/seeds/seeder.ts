import { faker }  from "@faker-js/faker";
import { prisma } from "../lib/prisma.js";

async function seeder() {
    console.log("Seeding started...");

    let categories : string[] = ['work','study', 'personal', 'shop', 'health']
    
    for (const category of categories ) {
        await prisma.category.create({
            data: {
                name: category
            }
        })
    }

    console.log("finished seeding...");
}

seeder();