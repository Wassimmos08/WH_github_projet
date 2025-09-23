// Fixed DishesComponent.js
import React, { useState, useEffect } from 'react';

const DishesComponent = () => {
    const [dishes, setDishes] = useState([]);
    const API_URL = 'http://localhost:5000';

    useEffect(() => {
        fetch(`${API_URL}/dishes/get`)  // Fixed template literal
        .then(res => res.json())
        .then(data => setDishes(data))
        .catch(err => console.error('Error fetching dishes:', err));
    }, []);  // Fixed: comma instead of Chinese character

    return (
        <div>
            <h2>Dishes</h2>
            <ul>
                {dishes.map(dish => (
                    <li key={dish.id}>  {/* Fixed: proper JSX syntax */}
                        {dish.name} - {dish.price}€ - {dish.category}
                        {dish.image && (
                            <div>
                                <img src={`${API_URL}${dish.image}`} alt={dish.name} width="100" />  {/* Fixed template literal */}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DishesComponent;  // Added missing export