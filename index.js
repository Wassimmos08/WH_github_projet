import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';
import pool from './services/pgAdminConfig.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // accès public images

// Multer config
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage });

// GET all dishes
app.get('/dishes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM dishes');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET dish by id
app.get('/dishes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM dishes WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Plat non trouvé' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST create dish
app.post('/dishes', upload.single('image'), async (req, res) => {
  const { name, price, category } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const result = await pool.query(
      'INSERT INTO dishes (name, price, image, category) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, price, image, category]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT update dish
app.put('/dishes/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, price, category } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    // On récupère le plat existant pour garder l'ancienne image si aucune nouvelle n'est uploadée
    const existingDish = await pool.query('SELECT * FROM dishes WHERE id = $1', [id]);
    if (existingDish.rows.length === 0) return res.status(404).json({ message: 'Plat non trouvé' });

    const imgToUse = image || existingDish.rows[0].image;

    const result = await pool.query(
      'UPDATE dishes SET name = $1, price = $2, image = $3, category = $4 WHERE id = $5 RETURNING *',
      [name, price, imgToUse, category, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE dish
app.delete('/dishes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM dishes WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Plat non trouvé' });
    res.json({ message: 'Plat supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Serveur sur http://localhost:${PORT}`));
