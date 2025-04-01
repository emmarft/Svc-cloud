import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'super-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh-secret';

/**
 * @swagger
 * /api/auth/refresh:
 *   get:
 *     summary: Rafraîchir le token d'accès
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Token rafraîchi avec succès
 *       401:
 *         description: Aucun token de rafraîchissement fourni
 *       403:
 *         description: Token de rafraîchissement invalide
 */
export async function GET(req: Request) {
    try {
        // Récupérer les cookies de la requête
        const cookieHeader = req.headers.get('cookie');
        if (!cookieHeader) {
            return NextResponse.json({ error: 'No cookies provided' }, { status: 401 });
        }

        // Extraire le cookie du refreshToken
        const refreshTokenCookie = cookieHeader
            .split(';')
            .find((cookie) => cookie.trim().startsWith('refreshToken='));

        if (!refreshTokenCookie) {
            return NextResponse.json({ error: 'No refresh token provided' }, { status: 401 });
        }

        // Récupérer la valeur du refreshToken
        const refreshToken = refreshTokenCookie.split('=')[1];

        // Vérifier et décoder le refreshToken
        const decoded: any = jwt.verify(refreshToken, REFRESH_SECRET);

        // Générer un nouveau token d'accès valide pour 15 minutes
        const newToken = jwt.sign({ username: decoded.username }, SECRET_KEY, { expiresIn: '15m' });

        // Réponse avec le nouveau token et mise à jour du cookie
        const response = NextResponse.json({ token: newToken });
        response.cookies.set('token', newToken, { httpOnly: true, secure: true, path: '/' });

        return response;
    } catch (error: any) {
        return NextResponse.json({ error: 'Invalid refresh token' }, { status: 403 });
    }
}
