
const express = require('express');
const router = express.Router();

// Import the supplier controller
const supplierController = require('../controllers/supplier');

// Define routes
router.get('/', supplierController.obtenirListeFournisseurs);
router.get('/:id', supplierController.obtenirFournisseurParId);
router.post('/', supplierController.enregistrerFournisseur);
router.put('/:id', supplierController.mettreÀJourFournisseur);
router.delete('/:id', supplierController.supprimerFournisseur);
router.post("/:id/note", supplierController.addNoteAndComment);
router.post("/:id/note", supplierController.addNoteAndComment);
module.exports = router;
