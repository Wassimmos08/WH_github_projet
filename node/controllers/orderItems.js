import {
  getAllOrderItems,
  getOrderItemById,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
} from '../models/orderItemesModels.js'; // attention à bien respecter le nom de ton fichier

export const getOrderItems = async (req, res) => {
  try {
    const items = await getAllOrderItems();
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await getOrderItemById(id);
    if (!item) return res.status(404).json({ message: 'Article de commande non trouvé' });
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const addOrderItem = async (req, res) => {
  try {
    const { order_id, dish_id, quantity } = req.body;
    const newItem = await createOrderItem(order_id, dish_id, quantity);
    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const modifyOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_id, dish_id, quantity } = req.body;
    const updatedItem = await updateOrderItem(id, order_id, dish_id, quantity);
    if (!updatedItem) return res.status(404).json({ message: 'Article non trouvé' });
    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const removeOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteOrderItem(id);
    res.json({ message: 'Article supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
