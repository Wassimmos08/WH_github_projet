import express from 'express';
import cors from 'cors';
import pool from './services/pgAdminConfig.js'; 
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.json('Hello World');
});
app.post('/ajouter', async (req, res) => {
  try {
    const { name, price, image, category } = req.body;

    const result = await pool.query(
      'INSERT INTO dishes (name, price, image, category) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, price, image, category]
    );

    res.status(201).json({
      message: 'Plat ajouté avec succès',
      dish: result.rows[0],
    });
  } catch (error) {
    console.error('Erreur ajout plat:', error); 
    res.status(500).json({ error: 'Erreur serveur' });
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
