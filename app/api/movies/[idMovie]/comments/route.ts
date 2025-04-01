import { NextResponse } from 'next/server';
import { MongoClient, Db, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

/**
 * @swagger
 * /api/movies/{idMovie}/comments:
 *   get:
 *     summary: Récupérer les commentaires d'un film
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du film dont on veut récupérer les commentaires
 *     responses:
 *       200:
 *         description: Liste des commentaires récupérée avec succès
 *       400:
 *         description: ID de film invalide
 *       500:
 *         description: Erreur interne du serveur
 */
export async function GET(
  request: Request,
  { params }: { params: { idMovie: string } }
): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    const { idMovie } = params;

    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({ status: 400, message: 'Invalid movie ID' });
    }

    const comments = await db
      .collection('comments')
      .find({ movie_id: new ObjectId(idMovie) })
      .toArray();

    return NextResponse.json({ status: 200, data: comments });
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
 * /api/movies/{idMovie}/comments:
 *   post:
 *     summary: Ajouter un commentaire à un film
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du film auquel ajouter un commentaire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Commentaire ajouté avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
export async function POST(
  request: Request,
  { params }: { params: { idMovie: string } }
): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    const { idMovie } = params;
    const commentData = await request.json();

    const newComment = {
      ...commentData,
      movie_id: new ObjectId(idMovie),
      date: new Date(),
    };

    const result = await db.collection('comments').insertOne(newComment);

    return NextResponse.json({ status: 201, message: 'Comment added', data: result });
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
 * /api/movies/{idMovie}/comments/{idComment}:
 *   put:
 *     summary: Modifier un commentaire
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du commentaire à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Commentaire mis à jour avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
export async function PUT(
  request: Request,
  { params }: { params: { idComment: string } }
): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    const { idComment } = params;
    const updateData = await request.json();

    const result = await db
      .collection('comments')
      .updateOne({ _id: new ObjectId(idComment) }, { $set: updateData });

    return NextResponse.json({ status: 200, message: 'Comment updated', data: result });
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
 * /api/movies/{idMovie}/comments/{idComment}:
 *   delete:
 *     summary: Supprimer un commentaire
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du commentaire à supprimer
 *     responses:
 *       200:
 *         description: Commentaire supprimé avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
export async function DELETE(
  request: Request,
  { params }: { params: { idComment: string } }
): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    const { idComment } = params;

    const result = await db.collection('comments').deleteOne({ _id: new ObjectId(idComment) });

    return NextResponse.json({ status: 200, message: 'Comment deleted', data: result });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
}