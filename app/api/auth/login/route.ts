import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MongoClient, Db } from 'mongodb';
import clientPromise from '@/lib/mongodb';

// Définition des clés secrètes pour le JWT
const SECRET_KEY = process.env.JWT_SECRET || 'super-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh-secret';

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connecter un utilisateur existant
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
 *         description: Authentifié avec succès
 *       401:
 *         description: Identifiants invalides
 *       500:
 *         description: Erreur interne du serveur
 */
export async function POST(req: Request) {
  try {
    // Extraction des données du corps de la requête
    const { username, password } = await req.json();

    // Connexion à la base de données
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    // Rechercher l'utilisateur dans la base de données
    const user = await db.collection('users').findOne({ username });

    // Vérification des identifiants
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Génération des tokens JWT
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ username }, REFRESH_SECRET, { expiresIn: '7d' });

    // Création de la réponse avec stockage des tokens dans les cookies
    const response = NextResponse.json({ message: 'Authenticated', jwt: token });
    response.cookies.set('token', token, { httpOnly: true, secure: true, path: '/' });
    response.cookies.set('refreshToken', refreshToken, { httpOnly: true, secure: true, path: '/' });

    return response;
  } catch (error: any) {
    // Gestion des erreurs internes du serveur
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
