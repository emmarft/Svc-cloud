import { NextResponse } from 'next/server';
import { MongoClient, Db, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

/**
 * @swagger
 * /api/theaters:
 *   get:
 *     summary: Récupérer la liste de tous les théâtres et cinémas
 *     tags:
 *       - Theaters
 *     responses:
 *       200:
 *         description: Liste récupérée avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
export async function GET(): Promise<NextResponse> {
    try {
        const client: MongoClient = await clientPromise;
        const db: Db = client.db('sample_mflix');
        const theaters = await db.collection('theaters').find({}).toArray();

        return NextResponse.json({ status: 200, data: theaters });
    } catch (error: any) {
        return NextResponse.json({
            status: 500,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
}

/**
 * @swagger
 * /api/theaters:
 *   post:
 *     summary: Ajouter un théâtre ou un cinéma
 *     tags:
 *       - Theaters
 *     responses:
 *       201:
 *         description: Théâtre ajouté avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
export async function POST(request: Request): Promise<NextResponse> {
    try {
        const client: MongoClient = await clientPromise;
        const db: Db = client.db('sample_mflix');
        const body = await request.json();
        const result = await db.collection('theaters').insertOne(body);
        return NextResponse.json({ status: 201, message: 'Théâtre ajouté', data: result.insertedId });
    } catch (error: any) {
        return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
    }
}

/**
 * @swagger
 * /api/theaters/{idTheater}:
 *   put:
 *     summary: Modifier un théâtre ou un cinéma par son ID
 *     tags:
 *       - Theaters
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Théâtre mis à jour avec succès
 *       400:
 *         description: ID invalide
 *       500:
 *         description: Erreur interne du serveur
 */
export async function PUT(
    request: Request, 
    { params }: { params: Promise<{ idTheater: string }> }
): Promise<NextResponse> {
    const { idTheater } = await params;
    try {
        const client: MongoClient = await clientPromise;
        const db: Db = client.db('sample_mflix');
        const body = await request.json();

        if (!ObjectId.isValid(idTheater)) {
            return NextResponse.json({ status: 400, message: 'Invalid theater ID' });
        }

        await db.collection('theaters').updateOne({ _id: new ObjectId(idTheater) }, { $set: body });
        return NextResponse.json({ status: 200, message: 'Théâtre mis à jour' });
    } catch (error: any) {
        return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
    }
}

/**
 * @swagger
 * /api/theaters/{idTheater}:
 *   delete:
 *     summary: Supprimer un théâtre ou un cinéma par son ID
 *     tags:
 *       - Theaters
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Théâtre supprimé avec succès
 *       400:
 *         description: ID invalide
 *       500:
 *         description: Erreur interne du serveur
 */
export async function DELETE(
    request: Request, 
    { params }: { params: Promise<{ idTheater: string }> }
): Promise<NextResponse> {
    const { idTheater } = await params;
    try {
        const client: MongoClient = await clientPromise;
        const db: Db = client.db('sample_mflix');

        if (!ObjectId.isValid(idTheater)) {
            return NextResponse.json({ status: 400, message: 'Invalid theater ID' });
        }

        await db.collection('theaters').deleteOne({ _id: new ObjectId(idTheater) });
        return NextResponse.json({ status: 200, message: 'Théâtre supprimé' });
    } catch (error: any) {
        return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
    }
}