// Importation du modèle Supplier et des modules bcrypt et jwt
const { Supplier } = require('../models/supplier');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Obtention de la liste des fournisseurs sans le mot de passe
const obtenirListeFournisseurs = async (req, res) => {
    try {
        // Recherche de tous les fournisseurs et exclusion du champ passwordHash
        const listeFournisseurs = await Supplier.find().select('-passwordHash');
        // Vérification si la liste des fournisseurs est vide
        if (!listeFournisseurs) {
            return res.status(500).json({ success: false });
        }
        // Envoi de la liste des fournisseurs en réponse
        res.send(listeFournisseurs);
    } catch (error) {
        // Gestion des erreurs
        res.status(500).json({ success: false, error: error });
    }
};

// Obtention d'un seul fournisseur sans le mot de passe
const obtenirFournisseurParId = async (req, res) => {
    try {
        // Recherche du fournisseur par son ID et exclusion du champ passwordHash
        const fournisseur = await Supplier.findById(req.params.id).select('-passwordHash');
        // Vérification si le fournisseur est introuvable
        if (!fournisseur) {
            return res.status(404).json({ message: 'Le fournisseur avec l\'ID fourni n\'a pas été trouvé.' });
        }
        // Envoi du fournisseur en réponse
        res.status(200).send(fournisseur);
    } catch (error) {
        // Gestion des erreurs
        res.status(500).json({ message: 'Une erreur est survenue lors de la récupération du fournisseur', error: error });
    }
};

// Enregistrement d'un nouvel fournisseur
const enregistrerFournisseur = async (req, res) => {
    try {
        // Création d'un nouvel fournisseur avec cryptage du mot de passe
        let fournisseur = new Supplier({
            nom: req.body.nom,
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 10),
            téléphone: req.body.téléphone,
            registreDeCommerce: req.body.registreDeCommerce,
        });
        // Enregistrement du nouvel fournisseur dans la base de données
        fournisseur = await fournisseur.save();
        // Vérification si le fournisseur n'a pas été créé avec succès
        if (!fournisseur) return res.status(400).send('Impossible de créer l\'fournisseur !');
        // Envoi du fournisseur créé en réponse
        res.send(fournisseur);
    } catch (error) {
        // Gestion des erreurs
        res.status(500).json({ message: 'Une erreur est survenue lors de la création du fournisseur', error: error });
    }
};

// Mise à jour des détails de fournisseur
const mettreÀJourFournisseur = async (req, res) => {
    try {
        // Recherche de l'existence du fournisseur par son ID
        const fournisseurExist = await Supplier.findById(req.params.id);
        let nouveauMotDePasse;
        // Vérification si un nouveau mot de passe a été fourni
        if (req.body.password) {
            // Cryptage du nouveau mot de passe
            nouveauMotDePasse = bcrypt.hashSync(req.body.password, 10);
        } else {
            // Utilisation de l'ancien mot de passe
            nouveauMotDePasse = fournisseurExist.passwordHash;
        }
        // Mise à jour des détails du fournisseur dans la base de données
        const fournisseur = await Supplier.findByIdAndUpdate(
            req.params.id,
            {
                nom: req.body.nom,
                email: req.body.email,
                passwordHash: nouveauMotDePasse,
                téléphone: req.body.téléphone,
                registreDeCommerce: req.body.registreDeCommerce,
            },
            { new: true }
        );
        // Vérification si le fournisseur n'a pas été mis à jour avec succès
        if (!fournisseur) return res.status(400).send('Impossible de mettre à jour l\'fournisseur !');
        // Envoi du fournisseur mis à jour en réponse
        res.send(fournisseur);
    } catch (error) {
        // Gestion des erreurs
        res.status(500).json({ message: 'Une erreur est survenue lors de la mise à jour du fournisseur', error: error });
    }
};

// Connexion via l'e-mail et le mot de passe
const connexionFournisseur = async (req, res) => {
    try {
        // Recherche du fournisseur par son e-mail
        const fournisseur = await Supplier.findOne({ email: req.body.email });
        // Vérification si le fournisseur n'a pas été trouvé
        if (!fournisseur) return res.status(400).send('L\'fournisseur n\'a pas été trouvé');
        // Vérification de la correspondance du mot de passe
        if (fournisseur && bcrypt.compareSync(req.body.password, fournisseur.passwordHash)) {
            // Génération d'un jeton JWT pour la connexion réussie
            const token = jwt.sign(
                { userId: fournisseur.id },
                process.env.secret,
                { expiresIn: '1d' }
            );
            // Envoi du fournisseur et du jeton en réponse
            res.status(200).send({ fournisseur: fournisseur.email, token: token });
        } else {
            // Envoi d'un message d'erreur si le mot de passe est incorrect
            res.status(400).send('Le mot de passe est incorrect !');
        }
    } catch (error) {
        // Gestion des erreurs
        res.status(500).json({ message: 'Une erreur est survenue lors de la connexion du fournisseur', error: error });
    }
};

// Suppression d'un fournisseur
const supprimerFournisseur = async (req, res) => {
    try {
        const fournisseur = await Supplier.findByIdAndRemove(req.params.id);
        if (fournisseur) {
            return res.status(200).json({ success: true, message: 'Le fournisseur a été supprimé !' });
        } else {
            return res.status(404).json({ success: false, message: 'Fournisseur non trouvé !' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error });
    }
};

// Ajout d'une note et d'un commentaire au fournisseur
async function addNoteAndComment(req, res) {
    try {
        // Extraction de l'ID du fournisseur des paramètres de la requête
        const supplierId = req.params.id;

        // Recherche du fournisseur par ID
        const supplier = await Supplier.findById(supplierId);

        // Si le fournisseur n'est pas trouvé, renvoie une réponse 404 Introuvable
        if (!supplier) {
            return res.status(404).json({ success: false, message: 'Fournisseur non trouvé' });
        }

        // Extraction de la note et du commentaire du corps de la requête
        const { note, comment } = req.body;

        // Ajout de la note et du commentaire au tableau de notes et de commentaires du fournisseur
        supplier.notes.push({ note, comment });

        // Enregistrement du document fournisseur mis à jour
        const updatedSupplier = await supplier.save();

        // Renvoie une réponse de succès avec le document fournisseur mis à jour
        res.status(200).json({ success: true, message: 'Note et commentaire ajoutés avec succès', supplier: updatedSupplier });
    } catch (error) {
        // Gestion des erreurs et renvoie une réponse 500 Erreur Interne du Serveur
        res.status(500).json({ success: false, error: error.message });
    }
}

// Obtention des notes et des commentaires
const getNotesAndComments = async (req, res) => {
    try {
        // Extraction de l'ID du fournisseur des paramètres de la requête
        const supplierId = req.params.id;

        // Recherche du fournisseur par ID
        const supplier = await Supplier.findById(supplierId);

        // Si le fournisseur n'est pas trouvé, renvoie une réponse 404 Introuvable
        if (!supplier) {
            return res.status(404).json({ success: false, message: 'Fournisseur non trouvé' });
        }

        // Renvoie les notes et les commentaires du fournisseur
        res.status(200).json({ success: true, notes: supplier.notes });
    } catch (error) {
        // Gestion des erreurs et renvoie une réponse 500 Erreur Interne du Serveur
        res.status(500).json({ success: false, error: error.message });
    }
};

// Exportation des fonctions du contrôleur
module.exports = {
    obtenirListeFournisseurs,
    obtenirFournisseurParId,
    enregistrerFournisseur,
    mettreÀJourFournisseur,
    connexionFournisseur,
    addNoteAndComment,
    getNotesAndComments,
    supprimerFournisseur
};

