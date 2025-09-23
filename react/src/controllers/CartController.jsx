import CartModel from '../models/CartModel';

const cart = new CartModel();

const CartController = {
  addToCart: (product) => cart.addItem(product),
  removeFromCart: (productId) => cart.removeItem(productId),
  clearCart: () => cart.clearCart(),
  getCartItems: () => cart.getItems(),
  getCartTotal: () => cart.getTotal(),
};

export default CartController;
