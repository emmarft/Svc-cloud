import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MongoClient, Db } from 'mongodb';
import clientPromise from '@/lib/mongodb';

const SECRET_KEY = process.env.JWT_SECRET || 'super-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh-secret';

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Inscrire un nouvel utilisateur
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur inscrit avec succès
 *       400:
 *         description: L'utilisateur existe déjà
 *       500:
 *         description: Erreur interne du serveur
 */
export async function POST(req: Request) {
  try {
    // Extraction des données envoyées par le client
    const { username, password } = await req.json();

    // Connexion à la base de données MongoDB
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    // Vérifier si l'utilisateur existe déjà dans la base de données
    const existingUser = await db.collection('users').findOne({ username });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hasher le mot de passe avant de l'enregistrer
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer le nouvel utilisateur dans la base de données
    await db.collection('users').insertOne({ username, password: hashedPassword });

    // Générer un token d'accès et un token de rafraîchissement
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ username }, REFRESH_SECRET, { expiresIn: '7d' });

    // Réponse avec les tokens stockés dans les cookies
    const response = NextResponse.json({ message: 'User registered successfully' });
    response.cookies.set('token', token, { httpOnly: true, secure: true, path: '/' });
    response.cookies.set('refreshToken', refreshToken, { httpOnly: true, secure: true, path: '/' });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
