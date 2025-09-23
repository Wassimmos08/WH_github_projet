// Fixed OrdersComponent.js
import React, { useEffect, useState } from 'react';

const OrdersComponent = () => {
    const [orders, setOrders] = useState([]);
    const API_URL = 'http://localhost:5000';

    useEffect(() => {
        fetch(`${API_URL}/orders/get`)  // Fixed template literal
        .then(res => res.json())
        .then(data => setOrders(data))
        .catch(err => console.error('Error fetching orders:', err));
    }, []);  // Fixed: comma instead of Chinese character

    return (
        <div>
            <h2>Orders</h2>
            <ul>
                {orders.map(order => (
                    <li key={order.id}>
                        {order.customer_name} | {order.address} | {order.phone} | {new Date(order.created_at).toLocaleDateString()}
                    </li>  // Fixed date display
                ))}
            </ul>
        </div>
    );
};

export default OrdersComponent;