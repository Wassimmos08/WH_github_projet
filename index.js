import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';
import pool from './services/pgAdminConfig.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // ← This must come before routes
app.use(express.urlencoded({ extended: true })); // ← Add this for form data
app.use('/uploads', express.static('uploads'));

// Multer for file uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage });

/* =================== DISHES =================== */
app.get('/dishes/get', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM dishes ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/dishes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM dishes WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Plat non trouvé' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/dishes/post', upload.single('image'), async (req, res) => {
  const { name, price, category } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const result = await pool.query(
      'INSERT INTO dishes (name, price, image, category) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, price, image, category]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.put('/dishes/put', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, price, category } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const existingDish = await pool.query('SELECT * FROM dishes WHERE id = $1', [id]);
    if (existingDish.rows.length === 0) return res.status(404).json({ message: 'Plat non trouvé' });

    const imgToUse = image || existingDish.rows[0].image;

    const result = await pool.query(
      'UPDATE dishes SET name = $1, price = $2, image = $3, category = $4 WHERE id = $5 RETURNING *',
      [name, price, imgToUse, category, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.delete('/dishes/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM dishes WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Plat non trouvé' });
    res.json({ message: 'Plat supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/* =================== ORDERS =================== */

// GET all orders
app.get('/orders/get', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET single order with items
app.get('/orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const order = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (order.rows.length === 0) return res.status(404).json({ message: 'Commande non trouvée' });

    const items = await pool.query(`
      SELECT oi.*, d.name, d.price, d.image
      FROM order_items oi
      JOIN dishes d ON oi.dish_id = d.id
      WHERE oi.order_id = $1
    `, [id]);

    res.json({ ...order.rows[0], items: items.rows });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

//post orders
// CREATE a new order (POST)
app.post('/order/post', async (req, res) => {
  const { customer_name, address, phone } = req.body;

  try {
    // Validate required fields
    if (!customer_name || !address || !phone) {
      return res.status(400).json({ 
        error: 'Tous les champs sont requis: customer_name, address, phone' 
      });
    }

    // Insert into database
    const result = await pool.query(
      'INSERT INTO orders (customer_name, address, phone) VALUES ($1, $2, $3) RETURNING *',
      [customer_name, address, phone]
    );

    // Return the created order
    res.status(201).json({
      message: 'Commande créée avec succès',
      order: result.rows[0]
    });

  } catch (error) {
    console.error('Erreur lors de la création:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la création' });
  }
});
//put
app.put('/orders/put', async (req, res) => {
  const { id, customer_name, address, phone } = req.body; // ← Get id from body

  try {
    if (!id || !customer_name || !address || !phone) {
      return res.status(400).json({ error: 'Tous les champs sont requis (id, customer_name, address, phone)' });
    }

    const result = await pool.query(
      'UPDATE orders SET customer_name = $1, address = $2, phone = $3 WHERE id = $4 RETURNING *',
      [customer_name, address, phone, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});



// DELETE order
app.delete('/orders/delete', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM order_items WHERE order_id = $1', [id]);
    const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) return res.status(404).json({ message: 'Commande non trouvée' });
    res.json({ message: 'Commande supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


//post orderitems
// CREATE - Ajouter un item à une commande (POST)
app.post('/order-items/post', async (req, res) => {
  const { order_id, dish_id, quantity } = req.body;

  try {
    if (!order_id || !dish_id || !quantity) {
      return res.status(400).json({ 
        error: 'Tous les champs sont requis: order_id, dish_id, quantity' 
      });
    }
    const result = await pool.query(
      'INSERT INTO order_items (order_id, dish_id, quantity) VALUES ($1, $2, $3) RETURNING *',
      [order_id, dish_id, quantity]
    );
    res.status(201).json({
      message: 'Item ajouté à la commande avec succès',
      order_item: result.rows[0]
    });

  } catch (error) {
    console.error('Erreur lors de l\'ajout:', error);
    res.status(500).json({ error: 'Erreur serveur lors de l\'ajout' });
  }
});
//get ordersitems
// READ - Récupérer tous les items (GET)
app.get('/order-items/get', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT oi.*, d.name as dish_name, d.price 
      FROM order_items oi 
      JOIN dishes d ON oi.dish_id = d.id
    `);

    res.status(200).json({
      message: 'Items récupérés avec succès',
      order_items: result.rows,
      count: result.rowCount
    });

  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération' });
  }
});
//put orderitems
// UPDATE - Modifier la quantité d'un item (PUT)
app.put('/order-items/put', async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    if (!quantity || quantity < 1) {
      return res.status(400).json({ 
        error: 'La quantité est requise et doit être supérieure à 0' 
      });
    }
    const result = await pool.query(
      'UPDATE order_items SET quantity = $1 WHERE id = $2 RETURNING *',
      [quantity, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Item non trouvé' });
    }

    res.status(200).json({
      message: 'Quantité mise à jour avec succès',
      order_item: result.rows[0]
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour' });
  }
});
//delete orderitems
// DELETE - Supprimer un item (DELETE)
app.delete('/order-items/delete', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM order_items WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Item non trouvé' });
    }

    res.status(200).json({
      message: 'Item supprimé avec succès',
      deleted_item: result.rows[0]
    });

  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression' });
  }
});

/* =================== SERVER =================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Serveur lancé sur http://localhost:${PORT}`));
