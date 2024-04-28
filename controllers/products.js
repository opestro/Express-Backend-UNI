const { Produit } = require('../models/product');
const { Category } = require('../models/category');
const mongoose = require('mongoose');
const multer = require('multer');

// Définition des types de fichiers autorisés pour l'upload d'images
const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

// Configuration du stockage des fichiers avec multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('Type de fichier image invalide');

        if(isValid) {
            uploadError = null
        }
      cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        
      // Génération du nom de fichier en remplaçant les espaces par des tirets et en ajoutant un timestamp pour éviter les doublons
      const fileName = file.originalname.split(' ').join('-');
      const extension = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})

// Options d'upload pour multer
const uploadOptions = multer({ storage: storage })

const productsController = {
  getAllProducts: async (req, res) => {
    try {
      let filter = {};
      if (req.query.categories) {
        filter = { categorie: req.query.categories.split(',') }
      }

      // Récupération de la liste des produits avec filtrage par catégories et population des données de catégorie associées
      const productList = await Produit.find(filter).populate('categorie');

      if (!productList) {
        res.status(500).json({ success: false })
      }
      res.send(productList);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits :", error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getProductById: async (req, res) => {
    try {
      // Récupération d'un produit par son ID avec population des données de catégorie associées
      const product = await Produit.findById(req.params.id).populate('categorie');

      if (!product) {
        res.status(404).json({ success: false, message: "Produit non trouvé" })
      }
      res.send(product);
    } catch (error) {
      console.error("Erreur lors de la récupération du produit par son ID :", error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createProduct: async (req, res) => {
    try {
      // Recherche de la catégorie par ID
      const category = await Category.findById(req.body.category);
      if (!category) return res.status(400).send('Catégorie invalide')

      const file = req.file;
      if (!file) return res.status(400).send('Aucune image dans la requête')

      // Nom du fichier et chemin de base pour l'URL de l'image
      const fileName = file.filename
      const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
      let product = new Produit({
        nom: req.body.nom,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${basePath}${fileName}`,// "http://localhost:3000/public/upload/image-2323232"
        brand: req.body.brand,
        quantitéEnStock: req.body.quantitéEnStock,
        notation: req.body.notation,
        nombreDavis: req.body.nombreDavis,
        estMisEnAvant: req.body.estMisEnAvant,
        dateCreation: req.body.dateCreation,
        category: req.body.category,
      })

      // Sauvegarde du produit
      product = await product.save();

      if (!product)
        return res.status(500).send('Le produit ne peut pas être créé')

      res.send(product);
    } catch (error) {
      console.error("Erreur lors de la création du produit :", error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateProduct: async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('ID de produit invalide')
      }
      const category = await Category.findById(req.body.category);
      if (!category) return res.status(400).send('Catégorie invalide')

      // Mise à jour du produit par son ID
      const product = await Produit.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      )

      if (!product)
        return res.status(404).send('Le produit ne peut pas être mis à jour!')

      res.send(product);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du produit :", error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      // Suppression d'un produit par son ID
      const product = await Produit.findByIdAndRemove(req.params.id);
      if (product) {
        return res.status(200).json({ success: true, message: 'Le produit est supprimé !' })
      } else {
        return res.status(404).json({ success: false, message: "Produit non trouvé !" })
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du produit :", error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getProductCount: async (req, res) => {
    try {
      // Comptage total des produits
      const productCount = await Produit.countDocuments();
      res.send({ productCount });
    } catch (error) {
      console.error("Erreur lors de l'obtention du nombre de produits :", error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getFeaturedProducts: async (req, res) => {
    try {
      const count = req.params.count ? req.params.count : 0
      // Récupération des produits en vedette avec limite
      const products = await Produit.find({ estMisEnAvant: true }).limit(+count);
      res.send(products);
    } catch (error) {
      console.error("Erreur lors de l'obtention des produits en vedette :", error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateProductGallery: async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('ID de produit invalide')
      }
      const files = req.files
      let imagesPaths = [];
      const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

      if (files) {
        // Mappage des chemins d'images pour la galerie
        files.map(file => {
          imagesPaths.push(`${basePath}${file.filename}`);
        })
      }

      // Mise à jour de la galerie d'images du produit
      const product = await Produit.findByIdAndUpdate(
        req.params.id,
        { images: imagesPaths },
        { new: true }
      )

      if (!product)
        return res.status(500).send('La galerie ne peut pas être mise à jour !')

      res.send(product);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la galerie du produit :", error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = productsController;
