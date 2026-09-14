const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getOrders, 
  updateOrderStatus, addOrder, getAllOrders
} = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/', getOrders);
router.put('/:id/status', updateOrderStatus);
router.put('/:id', updateOrderStatus);

module.exports = router;