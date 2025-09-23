
import React from 'react';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="top-navbar">
            <div className="logo">The Gotham Burger <span>Social Club</span></div>
            <ul className="nav-links">
                <li>Hours & Locations</li>
                <li>Menus</li>
                <li>About</li>
                <li>Private Events</li>
                <li>Events</li>
                <li>Shop</li>
            </ul>
        </nav>
    );
};  // Fixed: removed extra closing brace and parenthesis

export default Navbar;