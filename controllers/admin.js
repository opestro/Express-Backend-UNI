const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Admin } = require("../models/admin");
const { User } = require("../models/user");
const { Supplier } = require("../models/supplier");

// Fonction de connexion pour les administrateurs
exports.login = async (req, res) => {
  try {
    console.log("test")
    // Recherche d'un administrateur par son adresse e-mail
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) {
      // Si aucun administrateur n'est trouvé, renvoyer une erreur
      return res.status(400).send("Administrateur non trouvé");
    }
    // Vérification du mot de passe
    if (admin && bcrypt.compareSync(req.body.password, admin.passwordHash)) {
      // Création d'un jeton JWT en cas d'authentification réussie
      const token = jwt.sign(
        {
          adminId: admin._id,
          isAdmin: true,
        },
        process.env.secret,
        { expiresIn: "1d" }
      );
      // Envoi de la réponse avec le jeton JWT et l'e-mail de l'administrateur
      res.status(200).send({ admin: admin.email, token: token });
    } else {
      // Si le mot de passe est incorrect, renvoyer une erreur
      res.status(400).send("Mot de passe incorrect");
    }
  } catch (error) {
    // Gestion des erreurs
    res.status(500).json({ message: "Une erreur est survenue", error: error });
  }
};

// Fonction pour accepter un fournisseur
exports.acceptSupplier = async (req, res) => {
  try {
    // Recherche du fournisseur par son ID
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      // Si aucun fournisseur n'est trouvé, renvoyer une erreur
      return res.status(404).json({ message: "Fournisseur non trouvé" });
    }
    // Mise à jour du statut du fournisseur en fonction d'une condition
    if (supplier.registreDeCommerce === "valide") {
      supplier.status = "accepté";
    } else {
      supplier.status = "refusé";
    }
    // Sauvegarde des modifications apportées au fournisseur
    await supplier.save();
    // Envoi d'une réponse indiquant que le statut du fournisseur a été mis à jour avec succès
    res.status(200).json({ message: "Statut du fournisseur mis à jour avec succès" });
  } catch (error) {
    // Gestion des erreurs
    res.status(500).json({ message: "Une erreur est survenue", error: error });
  }
};

// Fonction pour accepter un utilisateur
exports.acceptUser = async (req, res) => {
  try {
    // Recherche de l'utilisateur par son ID
    const user = await User.findById(req.params.id);
    if (!user) {
      // Si aucun utilisateur n'est trouvé, renvoyer une erreur
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    // Mise à jour du statut de l'utilisateur en fonction d'une condition
    if (user.codeMédical === "valide") {
      user.status = "accepté";
    } else {
      user.status = "refusé";
    }
    // Sauvegarde des modifications apportées à l'utilisateur
    await user.save();
    // Envoi d'une réponse indiquant que le statut de l'utilisateur a été mis à jour avec succès
    res.status(200).json({ message: "Statut de l'utilisateur mis à jour avec succès" });
  } catch (error) {
    // Gestion des erreurs
    res.status(500).json({ message: "Une erreur est survenue", error: error });
  }
};

// Fonction pour interdire un utilisateur
exports.banUser = async (req, res) => {
  try {
    // Recherche de l'utilisateur par son ID
    const user = await User.findById(req.params.id);
    if (!user) {
      // Si aucun utilisateur n'est trouvé, renvoyer une erreur
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    // Mise à jour du statut de l'utilisateur pour l'interdire
    user.status = "interdit";
    // Sauvegarde des modifications apportées à l'utilisateur
    await user.save();
    // Envoi d'une réponse indiquant que l'utilisateur a été interdit avec succès
    res.status(200).json({ message: "Utilisateur interdit avec succès" });
  } catch (error) {
    // Gestion des erreurs
    res.status(500).json({ message: "Une erreur est survenue", error: error });
  }
};

