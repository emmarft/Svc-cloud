import { NextResponse } from 'next/server';
import { MongoClient, Db, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

/**
 * @swagger
 * /api/movies/{idMovie}:
 *   get:
 *     summary: Récupérer un film par son ID
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du film à récupérer
 *     responses:
 *       200:
 *         description: Film récupéré avec succès
 *       400:
 *         description: ID de film invalide
 *       404:
 *         description: Film non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ idMovie: string }> }
): Promise<NextResponse> {
  const { idMovie } = await params;
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({ status: 400, message: 'Invalid movie ID' });
    }

    const movie = await db
      .collection('movies')
      .findOne({ _id: new ObjectId(idMovie) });

    if (!movie) {
      return NextResponse.json({ status: 404, message: 'Movie not found' });
    }

    return NextResponse.json({ status: 200, data: movie });
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
 * /api/movies/{idMovie}:
 *   post:
 *     summary: Ajouter un nouveau film
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du film à ajouter
 *     responses:
 *       201:
 *         description: Film créé avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ idMovie: string }> }
): Promise<NextResponse> {
  const { idMovie } = await params;
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    const movieData = await request.json();

    // Insérez le nouveau film avec l'ID spécifié
    const result = await db
      .collection('movies')
      .insertOne({ ...movieData, _id: new ObjectId(idMovie) });

    return NextResponse.json({
      status: 201,
      message: 'Movie created',
      data: result,
    });
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
 * /api/movies/{idMovie}:
 *   put:
 *     summary: Mettre à jour un film
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du film à mettre à jour
 *     responses:
 *       200:
 *         description: Film mis à jour avec succès
 *       400:
 *         description: ID de film invalide
 *       500:
 *         description: Erreur interne du serveur
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ idMovie: string }> }
): Promise<NextResponse> {
  const { idMovie } = await params;
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    const movieData = await request.json();

    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({ status: 400, message: 'Invalid movie ID' });
    }

    await db.collection('movies').updateOne(
      { _id: new ObjectId(idMovie) },
      { $set: movieData }
    );

    return NextResponse.json({ status: 200, message: 'Movie updated' });
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
 * /api/movies/{idMovie}:
 *   delete:
 *     summary: Supprimer un film
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du film à supprimer
 *     responses:
 *       200:
 *         description: Film supprimé avec succès
 *       400:
 *         description: ID de film invalide
 *       500:
 *         description: Erreur interne du serveur
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ idMovie: string }> }
): Promise<NextResponse> {
  const { idMovie } = await params;
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({ status: 400, message: 'Invalid movie ID' });
    }

    await db.collection('movies').deleteOne({ _id: new ObjectId(idMovie) });

    return NextResponse.json({ status: 200, message: 'Movie deleted' });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
}