const express = require('express');
const { body, param } = require('express-validator');
const itemController = require('../controllers/item.controller');
const { handleValidation } = require('../middlewares/validate.middleware');

const router = express.Router();

/**
 * Route definitions and request validation
 * - POST /api/items
 * - GET /api/items
 * - GET /api/items/:id
 * - PUT /api/items/:id
 * - DELETE /api/items/:id
 */

// Validation rules — messages written in a friendly tone
const createRules = [
  body('name').isString().trim().notEmpty().withMessage('Please provide a name for the item'),
  body('description').optional().isString().trim(),
  body('price').isFloat({ min: 0 }).withMessage('Offer a price as a positive number (0 or higher)'),
  body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity should be a whole number (0 or higher)'),
  handleValidation,
];

const updateRules = [
  body('name').optional().isString().trim().notEmpty().withMessage('Name must be a non-empty string'),
  body('description').optional().isString().trim(),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a number >= 0'),
  body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be an integer >= 0'),
  handleValidation,
];

const idParamRule = [param('id').isMongoId().withMessage('That ID does not look right'), handleValidation];

router.post('/', createRules, itemController.createItem);
router.get('/', itemController.getItems);
router.get('/:id', idParamRule, itemController.getItemById);
router.put('/:id', idParamRule.concat(updateRules), itemController.updateItem);
router.delete('/:id', idParamRule, itemController.deleteItem);

module.exports = router;
