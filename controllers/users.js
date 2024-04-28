const { User } = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Obtenir la liste de tous les utilisateurs
exports.getUsers = async (req, res) => {
  try {
    const userList = await User.find();
    if (!userList) {
      return res.status(500).json({ success: false });
    }
    res.send(userList);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error });
  }
};

// Obtenir un utilisateur par son ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) {
      return res.status(404).json({
        message: "L'utilisateur avec l'ID fourni n'a pas été trouvé.",
      });
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

// Enregistrer un nouvel utilisateur
exports.registerUser = async (req, res) => {
  try {
    // Création d'un nouvel utilisateur avec les données fournies dans le corps de la requête
    let user = new User({
      nom: req.body.nom,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10), // Hachage du mot de passe
      téléphone: req.body.téléphone,
      isAdmin: req.body.isAdmin,
      rue: req.body.rue,
      appartement: req.body.appartement,
      codePostal: req.body.codePostal,
      ville: req.body.ville,
      codeMédical: req.body.codeMédical,
    });
    
    // Sauvegarde de l'utilisateur dans la base de données
    user = await user.save();

    // Envoi d'une réponse d'erreur si la création de l'utilisateur échoue
    if (!user) return res.status(400).send("Impossible de créer l'utilisateur !");

    // Envoi des données de l'utilisateur créé
    res.send(user);
  } catch (error) {
    res.status(500).json({ message: 'Une erreur est survenue lors de la création de l\'utilisateur', error: error });
  }
};

// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUserData = req.body; // Données mises à jour fournies dans le corps de la requête

    // Trouver l'utilisateur par son ID et mettre à jour ses détails
    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, { new: true });

    // Vérifier si l'utilisateur a été mis à jour avec succès
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    // Envoi des données de l'utilisateur mis à jour
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Authentification d'un utilisateur
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Rechercher l'utilisateur par email
    const user = await User.findOne({ email });

    // Si l'utilisateur n'est pas trouvé ou si le mot de passe ne correspond pas, envoyer une réponse d'erreur
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe invalide' });
    }

    // Générer un jeton JWT pour l'authentification
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Envoi du jeton et des données de l'utilisateur
    res.status(200).json({ success: true, token, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Trouver l'utilisateur par son ID et le supprimer
    const deletedUser = await User.findByIdAndDelete(userId);

    // Si l'utilisateur n'est pas trouvé, envoyer une réponse d'erreur
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    // Envoyer un message de succès
    res.status(200).json({ success: true, message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Enregistrer un nouvel utilisateur
exports.registerNewUser = async (req, res) => {
  try {
    const userData = req.body; // Données de l'utilisateur pour l'inscription

    // Créer une nouvelle instance d'utilisateur
    const newUser = new User({
      nom: userData.nom,
      email: userData.email,
      passwordHash: bcrypt.hashSync(userData.password, 10),
      téléphone: userData.téléphone,
      isAdmin: userData.isAdmin || false,
      rue: userData.rue,
      appartement: userData.appartement,
      codePostal: userData.codePostal,
      ville: userData.ville,
      codeMédical: userData.codeMédical
    });

    // Sauvegarder le nouvel utilisateur dans la base de données
    const savedUser = await newUser.save();

    // Envoyer les données de l'utilisateur nouvellement créé
    res.status(201).json({ success: true, user: savedUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtenir le nombre d'utilisateurs
exports.getCountOfUsers = async (req, res) => {
  try {
    // Obtenir le nombre d'utilisateurs
    const userCount = await User.countDocuments();

    // Envoyer le nombre d'utilisateurs
    res.status(200).json({ success: true, count: userCount });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

