# MFLIX API - Refonte du socle SERVEUR/BDD

## Description du projet

Ce projet consiste en la refonte du socle SERVEUR/BDD de l'application "MFLIX", une application fictive de type "Allociné" fournissant des informations cinématographiques en ligne. L'objectif principal est de migrer les bases de données existantes du client, initialement hébergées sur des serveurs physiques, vers le cloud en utilisant MongoDB Atlas. L'application conserve son interface frontale inchangée et communique avec le nouveau socle via une API REST.

## Fonctionnalités principales

* API RESTful pour la gestion des films, commentaires et cinémas.
* Utilisation de MongoDB Atlas pour le stockage des données dans le cloud.
* Authentification sécurisée des utilisateurs via JWT et Refresh Tokens.
* Documentation Swagger pour faciliter l'utilisation de l'API.
* Déploiement sur Vercel pour une mise en ligne rapide et efficace.

## Stack technique

* **Framework:** Next.js 15.2.4
* **Base de données:** MongoDB Atlas
* **Authentification:** JSON Web Tokens (JWT), bcryptjs
* **Documentation:** Swagger UI, next-swagger-doc
* **Déploiement:** Vercel

## Architecture cloud

L'architecture cloud de ce projet est basée sur les services suivants :

* **MongoDB Atlas:** Un service de base de données cloud géré pour MongoDB, offrant une évolutivité et une sécurité accrues.
* **Vercel:** Une plateforme de déploiement cloud pour les applications Next.js, permettant un déploiement rapide et une mise à l'échelle automatique.

## Installation et configuration

1.  Clonez le dépôt GitHub :

    ```bash
    git clone [https://github.com/votre-nom-utilisateur/votre-repo.git](https://github.com/votre-nom-utilisateur/votre-repo.git)
    cd votre-repo
    ```

2.  Installez les dépendances :

    ```bash
    npm install
    ```

3.  Configurez les variables d'environnement dans un fichier `.env.local` :

    ```
    MONGODB_URI=votre-uri-mongodb-atlas
    JWT_SECRET=votre-secret-jwt
    REFRESH_SECRET=votre-secret-refresh
    ```

4.  Lancez le serveur de développement :

    ```bash
    npm run dev
    ```

5.  Accédez à la documentation Swagger à l'adresse suivante : `http://localhost:3000/api-doc`

## Endpoints de l'API

* `/api/movies` (GET) : Récupérer tous les films
* `/api/movies/:idMovie` (GET, POST, PUT, DELETE) : Récupérer, ajouter, modifier ou supprimer un film via son ID
* `/api/movies/:idMovie/comments` (GET) : Récupérer les commentaires d'un film
* `/api/movies/:idMovie/comments/:idComment` (GET, POST, PUT, DELETE) : Récupérer, ajouter, modifier ou supprimer un commentaire d'un film
* `/api/theaters` (GET) : Récupérer tous les cinémas
* `/api/theaters/:idTheater` (GET, POST, PUT, DELETE) : Récupérer, ajouter, modifier ou supprimer un cinéma via son ID
* `/api/auth/signup` (POST) : Inscrire un nouvel utilisateur
* `/api/auth/login` (POST) : Connecter un utilisateur existant
* `/api/auth/logout` (POST) : Déconnecter un utilisateur
* `/api/auth/refresh` (GET) : Rafraîchir le token d'accès

## Déploiement sur Vercel

1.  Créez un compte sur [Vercel](https://vercel.com/).
2.  Connectez votre compte GitHub à Vercel.
3.  Importez votre projet depuis GitHub.
4.  Configurez les variables d'environnement dans les paramètres de votre projet Vercel.
5.  Déployez votre application.

## Améliorations futures

* Ajout de tests unitaires pour améliorer la qualité du code.
* Implémentation de schémas de validation pour sécuriser les données.
* Amélioration de l'interface utilisateur.
* Mise en place d'une pagination pour les listes de données volumineuses.

## Auteur

Emma RUFFET
