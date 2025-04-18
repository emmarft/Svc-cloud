import { NextResponse } from 'next/server';
import { MongoClient, Db, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

/**
 * @swagger
 * /api/movies/{idMovie}/comments/{idComment}:
 *   get:
 *     summary: Récupérer un commentaire spécifique d'un film
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du film
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du commentaire
 *     responses:
 *       200:
 *         description: Commentaire récupéré avec succès
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Commentaire non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const idMovie = url.pathname.split('/')[3]; 
  const idComment = url.pathname.split('/')[5];  

  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    if (!ObjectId.isValid(idMovie) || !ObjectId.isValid(idComment)) {
      return NextResponse.json({ status: 400, message: 'Invalid ID' });
    }

    const comment = await db
      .collection('comments')
      .findOne({ _id: new ObjectId(idComment), movie_id: new ObjectId(idMovie) });

    if (!comment) {
      return NextResponse.json({ status: 404, message: 'Comment not found' });
    }

    return NextResponse.json({ status: 200, data: comment });
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
 *         description: L'ID du film
 *     responses:
 *       201:
 *         description: Commentaire ajouté avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ idMovie: string, idComment: string }> }
): Promise<NextResponse> {
  const { idMovie, idComment } = await params;
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    const commentData = await request.json();

    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({ status: 400, message: 'Invalid movie ID' });
    }

    const result = await db.collection('comments').insertOne({
      ...commentData,
      _id: new ObjectId(idComment),
      movie_id: new ObjectId(idMovie),
    });

    return NextResponse.json({ status: 201, message: 'Comment created', data: result });
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
 *     summary: Mettre à jour un commentaire d'un film
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du film
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du commentaire
 *     responses:
 *       200:
 *         description: Commentaire mis à jour avec succès
 *       400:
 *         description: ID invalide
 *       500:
 *         description: Erreur interne du serveur
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ idMovie: string, idComment: string }> }
): Promise<NextResponse> {
  const { idMovie, idComment } = await params;
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    const commentData = await request.json();

    if (!ObjectId.isValid(idMovie) || !ObjectId.isValid(idComment)) {
      return NextResponse.json({ status: 400, message: 'Invalid ID' });
    }

    const result = await db.collection('comments').updateOne(
      { _id: new ObjectId(idComment), movie_id: new ObjectId(idMovie) },
      { $set: commentData }
    );

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
 *     summary: Supprimer un commentaire d'un film
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du film
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du commentaire
 *     responses:
 *       200:
 *         description: Commentaire supprimé avec succès
 *       400:
 *         description: ID invalide
 *       500:
 *         description: Erreur interne du serveur
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ idMovie: string, idComment: string }> }
): Promise<NextResponse> {
  const { idMovie, idComment } = await params;
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    if (!ObjectId.isValid(idMovie) || !ObjectId.isValid(idComment)) {
      return NextResponse.json({ status: 400, message: 'Invalid ID' });
    }

    const result = await db
      .collection('comments')
      .deleteOne({ _id: new ObjectId(idComment), movie_id: new ObjectId(idMovie) });

    return NextResponse.json({ status: 200, message: 'Comment deleted', data: result });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
}
