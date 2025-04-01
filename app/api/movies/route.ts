import { NextResponse } from 'next/server';
import { Db, MongoClient } from 'mongodb';
import clientPromise from '@/lib/mongodb';

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Récupère tous les films
 *     tags:
 *       - Movies
 *     description: Retourne une liste de films limitée à 10 entrées.
 *     responses:
 *       200:
 *         description: Succès - Retourne une liste de films.
 *       500:
 *         description: Erreur interne du serveur.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    const movies = await db.collection('movies').find({}).limit(10).toArray();
    
    return NextResponse.json({ status: 200, data: movies });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}