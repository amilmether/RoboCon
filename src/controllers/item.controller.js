const Item = require('../models/item.model');
const asyncHandler = require('../middlewares/asyncHandler');

/**
 * Item controllers — straightforward, easy to read and modify.
 * Flow: request -> validation middleware -> controller -> model -> JSON response.
 * We intentionally keep responses consistent (success flag, data/message) to make client handling predictable.
 */

exports.createItem = asyncHandler(async (req, res) => {
  // Accepts { name, description, price, quantity }
  const { name, description, price, quantity } = req.body;

  const item = await Item.create({ name, description, price, quantity });

  // Return created resource and a short message that is easy for humans to read
  res.status(201).json({ success: true, message: 'Item created', data: item });
});

exports.getItems = asyncHandler(async (req, res) => {
  // Return latest items first
  const items = await Item.find().sort({ createdAt: -1 });
  res.json({ success: true, data: items, meta: { count: items.length } });
});

exports.getItemById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const item = await Item.findById(id);
  if (!item) return res.status(404).json({ success: false, message: 'We couldn\'t find an item with that ID' });

  res.json({ success: true, data: item });
});

exports.updateItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const item = await Item.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!item) return res.status(404).json({ success: false, message: 'No item was found to update' });
  res.json({ success: true, message: 'Item updated', data: item });
});

exports.deleteItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = await Item.findByIdAndDelete(id);
  if (!item) return res.status(404).json({ success: false, message: 'Nothing to delete — item not found' });

  // Return the deleted item so clients can confirm what was removed
  res.json({ success: true, message: 'Item deleted', data: item });
});
