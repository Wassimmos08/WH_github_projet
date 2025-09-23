export default class CartModel {
  constructor() {
    this.items = [];
  }

  addItem(product) {
    const existingItem = this.items.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
  }

  clearCart() {
    this.items = [];
  }

  getItems() {
    return this.items;
  }

  getTotal() {
    return this.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }
}
