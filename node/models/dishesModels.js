import {
  getAllDishes,
  getDishById,
  createDish,
  updateDish,
  deleteDish,
} from '../models/dishesModel.js';

export const getDishes = async (req, res) => {
  try {
    const dishes = await getAllDishes();
    res.json(dishes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getDish = async (req, res) => {
  try {
    const { id } = req.params;
    const dish = await getDishById(id);
    if (!dish) return res.status(404).json({ message: 'Plat non trouvé' });
    res.json(dish);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const addDish = async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const newDish = await createDish(name, price, image, category);
    res.status(201).json(newDish);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const modifyDish = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const updatedDish = await updateDish(id, name, price, image, category);
    if (!updatedDish) return res.status(404).json({ message: 'Plat non trouvé' });
    res.json(updatedDish);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const removeDish = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteDish(id);
    res.json({ message: 'Plat supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
