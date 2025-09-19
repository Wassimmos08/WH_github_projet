import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from '../models/ordersModel.js';

export const getOrders = async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await getOrderById(id);
    if (!order) return res.status(404).json({ message: 'Commande non trouvée' });
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const addOrder = async (req, res) => {
  try {
    const { customer_name, address, phone, total } = req.body;
    const newOrder = await createOrder(customer_name, address, phone, total);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const modifyOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_name, address, phone, total } = req.body;
    const updatedOrder = await updateOrder(id, customer_name, address, phone, total);
    if (!updatedOrder) return res.status(404).json({ message: 'Commande non trouvée' });
    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const removeOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteOrder(id);
    res.json({ message: 'Commande supprimée avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
