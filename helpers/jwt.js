var { expressjwt: jwt } = require("express-jwt");

// Fonction middleware pour l'authentification JWT
function authJwt() {
  // Récupération du secret JWT et de l'URL de l'API depuis les variables d'environnement
  const secret = process.env.secret;
  const api = process.env.API_URL;

  // Middleware ExpressJWT pour la gestion de l'authentification JWT

  return jwt({
    secret, // Utilisation du secret pour signer et vérifier les tokens JWT
    algorithms: ["HS256"], // Utilisation de l'algorithme HS256 pour le JWT
    isRevoked: isRevoked, // Fonction pour vérifier si un token JWT est révoqué ou non
  }).unless({
    // Définition des chemins qui ne nécessitent pas d'authentification JWT
    path: [
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] }, // Les fichiers uploadés peuvent être accédés publiquement
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] }, // Les produits peuvent être consultés publiquement
      { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] }, // Les catégories peuvent être consultées publiquement
      { url: /\/api\/v1\/orders(.*)/, methods: ["GET", "OPTIONS", "POST"] }, // Les commandes peuvent être consultées ou créées sans authentification
      `${api}/users/login`, // La route de connexion n'a pas besoin d'authentification
      `${api}/users/register`, // La route d'enregistrement n'a pas besoin d'authentification
    ],
  });
}

// Fonction asynchrone pour vérifier si un token JWT est révoqué ou non
async function isRevoked(req, payload, done) {
  // Vérification si l'utilisateur n'est pas un administrateur
  if (!payload.isAdmin) {
    done(null, true); // Si l'utilisateur n'est pas un administrateur, le token est considéré comme révoqué
  }

  done(); // Si l'utilisateur est un administrateur, le token est valide
}

module.exports = authJwt; // Exportation de la fonction middleware d'authentification JWT
