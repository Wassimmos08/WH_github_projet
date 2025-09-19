

const client = require('./pgAdminConfig')

async function createTables() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL");

    // Your CREATE TABLE queries here
    const dishesQuery = `
      CREATE TABLE dishes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  price DECIMAL(10,2),
  image VARCHAR(255),
  category VARCHAR(50)
);
      `;

     const ordersQuery =`     CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customer_name VARCHAR(100),
  address VARCHAR(255),
  phone VARCHAR(20),
  total DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

      const itemsQuery=`CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT,
  dish_id INT,
  quantity INT,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (dish_id) REFERENCES dishes(id)
);
`;
    

    await client.query(query);
    console.log("Tables created successfully!");

  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
    console.log("Disconnected from PostgreSQL");
  }
}

createTables();


