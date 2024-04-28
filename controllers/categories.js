const { Category } = require("../models/category");

// Fonction pour récupérer toutes les catégories
exports.getAllCategories = async (req, res) => {
  try {
    // Récupération de la liste de toutes les catégories
    const categoryList = await Category.find();
    // Vérification de l'existence de catégories
    if (!categoryList) {
      return res.status(500).json({ success: false });
    }
    // Envoi de la liste des catégories
    res.send(categoryList);
  } catch (error) {
    // Gestion des erreurs
    res.status(500).json({ success: false, error: error });
  }
};

// Fonction pour récupérer une catégorie par son ID
exports.getCategoryById = async (req, res) => {
  try {
    // Recherche de la catégorie par son ID
    const category = await Category.findById(req.params.id);
    // Vérification de l'existence de la catégorie
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "La catégorie avec cet identifiant n'existe pas",
      });
    }
    // Envoi de la catégorie
    res.send(category);
  } catch (error) {
    // Gestion des erreurs
    res.status(500).json({ success: false, error: error });
  }
};

// Fonction pour mettre à jour une catégorie
exports.updateCategory = async (req, res) => {
  try {
    // Mise à jour de la catégorie avec les données fournies
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
      },
      { new: true }
    );
    // Vérification de la mise à jour de la catégorie
    if (!category) {
      return res.status(400).send("La catégorie ne peut pas être mise à jour");
    }
    // Envoi de la catégorie mise à jour
    res.send(category);
  } catch (error) {
    // Gestion des erreurs
    res.status(500).json({ success: false, error: error });
  }
};

// Fonction pour créer une nouvelle catégorie
exports.createCategory = async (req, res) => {
  try {
    // Création d'une nouvelle catégorie avec les données fournies
    let category = new Category({
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    });
    category = await category.save();
    // Vérification de la création de la catégorie
    if (!category) {
      return res.status(400).send("La catégorie ne peut pas être créée");
    }
    // Envoi de la catégorie créée
    res.send(category);
  } catch (error) {
    // Gestion des erreurs
    res.status(500).json({ success: false, error: error });
  }
};

// Fonction pour supprimer une catégorie
exports.deleteCategory = async (req, res) => {
  try {
    // Suppression de la catégorie par son ID
    const category = await Category.findByIdAndDelete(req.params.id);
    // Vérification de la suppression de la catégorie
    if (category) {
      return res
        .status(200)
        .json({ success: true, message: "La catégorie a été supprimée" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Catégorie non trouvée" });
    }
  } catch (error) {
    // Gestion des erreurs
    return res.status(400).json({ success: false, error: error });
  }
};
