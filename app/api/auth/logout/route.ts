import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Déconnecter un utilisateur
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Déconnecté avec succès
 */
export async function POST() {
    // Création de la réponse JSON confirmant la déconnexion
    const response = NextResponse.json({ message: 'Logged out' });

    // Suppression des cookies en les vidant et en définissant maxAge à 0
    response.cookies.set('token', '', { httpOnly: true, secure: true, path: '/', maxAge: 0 });
    response.cookies.set('refreshToken', '', { httpOnly: true, secure: true, path: '/', maxAge: 0 });

    // Retourner la réponse
    return response;
}
