const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products');

router.get(`/`, productsController.getAllProducts);
router.get(`/:id`, productsController.getProductById);
router.post(`/`, productsController.createProduct);
router.put('/:id', productsController.updateProduct);
router.delete('/:id', productsController.deleteProduct);
router.get(`/get/count`, productsController.getProductCount);
router.get(`/get/featured/:count`, productsController.getFeaturedProducts);
router.put('/gallery-images/:id', productsController.updateProductGallery);

module.exports = router;