const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');

router.get(`/`, ordersController.getAllOrders);
router.get(`/:id`, ordersController.getOrderById);
router.post('/', ordersController.createOrder);
router.put('/:id', ordersController.updateOrder);
router.delete('/:id', ordersController.deleteOrder);
router.get('/get/totalsales', ordersController.getTotalSales);
router.get(`/get/count`, ordersController.getOrderCount);
router.get(`/get/userorders/:userid`, ordersController.getUserOrders);

module.exports = router;