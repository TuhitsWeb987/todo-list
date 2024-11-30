import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
    try {
        const {text, completed} = await request.json()
        const todo = await prisma.todo.create({
            data: {
                text,
                completed
            }
        })

        return NextResponse.json({message: "Tâche ajouté avec succès", todo}, {status: 201})
        
    } catch(error) {
        console.error('Une erreur API route est surnvenue')
        return NextResponse.json({error: "Une erreur est survenue"}, {status: 500})
    }
    
}

export async function GET(request: NextRequest) {
    try {
        const todos = await prisma.todo.findMany();
        return NextResponse.json({message: "Tâches récupérés avec succès" ,todos}, { status: 200 });

    } catch (error) {
        console.error('Une erreur API route est surnvenue', error);
        return NextResponse.json({ error: "Une erreur API route est surnvenue" }, { status: 500 });
    }
}