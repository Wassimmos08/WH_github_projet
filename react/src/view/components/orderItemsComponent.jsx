// Fixed OrderItemsComponent.js
import React, { useState, useEffect } from 'react';

const OrderItemsComponent = () => {
    const [items, setItems] = useState([]);
    const API_URL = 'http://localhost:5000';

    useEffect(() => {
        fetch(`${API_URL}/order-items/get`)  // Fixed template literal
        .then(res => res.json())
        .then(data => setItems(data.order_items || data))  // Added fallback
        .catch(err => console.error('Error fetching order items:', err));  // Fixed quote
    }, []);

    return (
        <div>
            <h2>Order Items</h2>
            <ul>
                {items.map(item => (
                    <li key={item.id}>
                        Order #{item.order_id}: {item.dish_name} x{item.quantity} - {item.price}€
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderItemsComponent;