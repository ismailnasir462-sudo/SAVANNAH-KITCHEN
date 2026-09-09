const db = require('../config/db');

// GET /api/menu - Fetch all available menu items
exports.getAllMenuItems = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM menu_items ORDER BY created_at DESC`);
    res.json(rows);
  } catch (error) {
    console.error('Fetch Menu Error:', error);
    res.status(500).json({ error: 'Failed to fetch menu items.' });
  }
};

// POST /api/menu - Add a new menu dish
exports.addMenuItem = async (req, res) => {
  try {
    const { 
      name, 
      category, 
      price, 
      description, 
      image_url, 
      prep_time, 
      calories, 
      ingredients, 
      rating 
    } = req.body;

    // Validate required fields
    if (!name || !category || !price || !description) {
      return res.status(400).json({ error: 'Please provide name, category, price, and description.' });
    }

    // Format ingredients safely as a JSON string if provided as an object/array
    const formattedIngredients = typeof ingredients === 'string' 
      ? ingredients 
      : JSON.stringify(ingredients || ["Fresh Ingredients"]);

    // Insert all fields into MySQL
    const [result] = await db.query(
      `INSERT INTO menu_items 
       (name, category, price, rating, description, prep_time, calories, ingredients, image_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, 
        category, 
        price, 
        rating || 5.0, 
        description, 
        prep_time || '15 mins', 
        calories || null, 
        formattedIngredients, 
        image_url || null
      ]
    );

    res.status(201).json({
      message: 'Menu item created successfully!',
      itemId: result.insertId
    });
  } catch (error) {
    console.error('Add Menu Item Error:', error);
    res.status(500).json({ error: 'Failed to create menu item in database.' });
  }
};

// PUT /api/menu/:id - Update an existing dish
exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      category, 
      price, 
      description, 
      image_url, 
      is_available, 
      prep_time, 
      calories, 
      ingredients, 
      rating 
    } = req.body;

    const formattedIngredients = typeof ingredients === 'string' 
      ? ingredients 
      : JSON.stringify(ingredients || ["Fresh Ingredients"]);

    const [result] = await db.query(
      `UPDATE menu_items 
       SET name = ?, category = ?, price = ?, rating = ?, description = ?, 
           prep_time = ?, calories = ?, ingredients = ?, image_url = ?, is_available = ? 
       WHERE id = ?`,
      [
        name, 
        category, 
        price, 
        rating || 5.0, 
        description, 
        prep_time || '15 mins', 
        calories || null, 
        formattedIngredients, 
        image_url || null, 
        is_available ?? true, 
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu item not found.' });
    }

    res.json({ message: 'Menu item updated successfully!' });
  } catch (error) {
    console.error('Update Menu Item Error:', error);
    res.status(500).json({ error: 'Failed to update menu item.' });
  }
};

// DELETE /api/menu/:id - Remove a dish
exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(`DELETE FROM menu_items WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu item not found.' });
    }

    res.json({ message: 'Menu item deleted successfully!' });
  } catch (error) {
    console.error('Delete Menu Item Error:', error);
    res.status(500).json({ error: 'Failed to delete menu item.' });
  }
};