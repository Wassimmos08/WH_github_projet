// Fixed HomeView.js
import React from "react";
import "./HomeView.css";

const HomeView = () => {
  return (
    <div className="home-container">
      {" "}
      {/* Fixed bracket */}
      <header className="hero">
        <h1 className="main-heading">WELCOME TO THE CLUB</h1>
        <div className="stars">★ ★ ★</div>
      </header>
      <section className="burger-section">
        <h2 className="sub-heading">
          ORIGINAL SMASH BURGER OF <br /> THE LOWER EAST SIDE
        </h2>
        <img className="burger-image" src="/burger.png" alt="Burger" />
      </section>
    </div>
  );
}; // Fixed: removed extra closing brace

export default HomeView;
