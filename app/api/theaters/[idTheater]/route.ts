import { NextResponse } from 'next/server';
import { MongoClient, Db, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

/**
 * @swagger
 * /api/theaters/{idTheater}:
 *   get:
 *     summary: Récupérer un théâtre par son ID
 *     tags:
 *       - Theaters
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du théâtre à récupérer
 *     responses:
 *       200:
 *         description: Théâtre récupéré avec succès
 *       400:
 *         description: ID de théâtre invalide
 *       404:
 *         description: Théâtre non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
export async function GET(
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

        const theater = await db.collection('theaters').findOne({ _id: new ObjectId(idTheater) });

        if (!theater) {
            return NextResponse.json({ status: 404, message: 'Theater not found' });
        }

        return NextResponse.json({ status: 200, data: theater });
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
 * /api/theaters/{idTheater}:
 *   post:
 *     summary: Ajouter un nouveau théâtre
 *     tags:
 *       - Theaters
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du théâtre à ajouter
 *     responses:
 *       201:
 *         description: Théâtre créé avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
export async function POST(
    request: Request,
    { params }: { params: Promise<{ idTheater: string }> }
): Promise<NextResponse> {
    const { idTheater } = await params;
    try {
        const client: MongoClient = await clientPromise;
        const db: Db = client.db('sample_mflix');
        const theaterData = await request.json();

        const result = await db.collection('theaters').insertOne({
            ...theaterData,
            _id: new ObjectId(idTheater),
        });

        return NextResponse.json({ status: 201, message: 'Theater created', data: result });
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
 * /api/theaters/{idTheater}:
 *   put:
 *     summary: Modifier un théâtre existant
 *     tags:
 *       - Theaters
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du théâtre à modifier
 *     responses:
 *       200:
 *         description: Théâtre modifié avec succès
 *       400:
 *         description: ID de théâtre invalide
 *       404:
 *         description: Théâtre non trouvé
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
        const theaterData = await request.json();

        if (!ObjectId.isValid(idTheater)) {
            return NextResponse.json({ status: 400, message: 'Invalid theater ID' });
        }

        const result = await db
            .collection('theaters')
            .updateOne({ _id: new ObjectId(idTheater) }, { $set: theaterData });

        return NextResponse.json({ status: 200, message: 'Theater updated', data: result });
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
 * /api/theaters/{idTheater}:
 *   delete:
 *     summary: Supprimer un théâtre
 *     tags:
 *       - Theaters
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du théâtre à supprimer
 *     responses:
 *       200:
 *         description: Théâtre supprimé avec succès
 *       400:
 *         description: ID de théâtre invalide
 *       404:
 *         description: Théâtre non trouvé
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

        const result = await db.collection('theaters').deleteOne({ _id: new ObjectId(idTheater) });

        return NextResponse.json({ status: 200, message: 'Theater deleted', data: result });
    } catch (error: any) {
        return NextResponse.json({
            status: 500,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
}
