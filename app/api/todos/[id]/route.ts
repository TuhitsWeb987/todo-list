import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export async function PUT(request: NextRequest) {

    try {
        const {id, text, completed} = await request.json()
        const todo = await prisma.todo.update({
            where: {id},
            data: {
                text,
                completed
            }
        })
        return NextResponse.json({message: "Tâche modifié avec succès", todo}, {status: 200})
    } catch(error) {
        console.error('Une erreur API route est surnvenue', error);
        return NextResponse.json({ error: "Une erreur API route est surnvenue" }, { status: 500 });
    }
}

export async function DELETE(request:NextRequest, {params}: {params: {id: string}}) {
    try {
        const id = parseInt(params.id)
        const todo = await prisma.todo.delete({
            where: { id }
        })
        return NextResponse.json({
            message: "Tâche supprimée avec succès", todo
        },{status: 200})
    }catch(error) {
        console.error('Une erreur API route est surnvenue', error);
        return NextResponse.json({ error: "Une erreur API route est surnvenue" }, { status: 500 });
    }
}
