const express = require('express');
const router = express.Router();
const { 
  getAllMenuItems, 
  addMenuItem, 
  updateMenuItem, 
  deleteMenuItem 
} = require('../controllers/menuController');

router.get('/', getAllMenuItems);
router.post('/', addMenuItem);
router.put('/:id', updateMenuItem);
router.delete('/:id', deleteMenuItem);

module.exports = router;