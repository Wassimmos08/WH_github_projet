import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Import components
import Navbar from './view/Navbar.jsx'
import HomeView from './view/homeView.jsx'
import loginView from './view/loginView.jsx'
import register from './view/register.jsx'
import DishesComponent from './view/components/dishesComponent.jsx'
import OrdersComponent from './view/components/ordersComponent.jsx'
import OrderItemsComponent from './view/components/orderItemsComponent.jsx'

// Import controllers
import AuthController from './controllers/authControllers.jsx'
import CartController from './controllers/CartController.jsx'

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [user, setUser] = useState(null)
  const [cartItems, setCartItems] = useState([])

  // Authentication handlers
  const handleLogin = (userData) => {
    setUser(userData)
    setCurrentView('dishes')
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentView('home')
    CartController.clearCart()
    setCartItems([])
  }

  const handleRegisterSuccess = (userData) => {
    setUser(userData)
    setCurrentView('dishes')
  }

  const switchToLogin = () => {
    setCurrentView('login')
  }

  // Cart handlers
  const addToCart = (product) => {
    CartController.addToCart(product)
    setCartItems([...CartController.getCartItems()])
  }

  const removeFromCart = (productId) => {
    CartController.removeFromCart(productId)
    setCartItems([...CartController.getCartItems()])
  }

  const clearCart = () => {
    CartController.clearCart()
    setCartItems([])
  }

  // Navigation handlers
  const navigateTo = (view) => {
    setCurrentView(view)
  }

  // Render current view based on state
  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />
      
      case 'dishes':
        return (
          <DishesComponent 
            onAddToCart={addToCart}
            user={user}
          />
        )
      
      case 'orders':
        return user ? <OrdersComponent user={user} /> : <Navigate to="/login" />
      
      case 'order-items':
        return user ? <OrderItemsComponent user={user} /> : <Navigate to="/login" />
      
      case 'login':
        return (
          <div className="auth-container">
            <LoginView 
              onLogin={handleLogin}
              onLogout={handleLogout}
              onSwitchToRegister={() => setCurrentView('register')}
            />
          </div>
        )
      
      case 'register':
        return (
          <div className="auth-container">
            <RegisterView 
              onRegisterSuccess={handleRegisterSuccess}
              onSwitchToLogin={switchToLogin}
            />
          </div>
        )
      
      default:
        return <HomeView />
    }
  }

  return (
    <Router>
      <div className="App">
        {/* Navigation */}
        <Navbar 
          user={user}
          onLogout={handleLogout}
          onNavigate={navigateTo}
          currentView={currentView}
          cartItemsCount={cartItems.length}
        />

        {/* Main Content */}
        <main className="main-content">
          {renderCurrentView()}
        </main>

        {/* Cart Summary (optional - could be a sidebar) */}
        {cartItems.length > 0 && (
          <div className="cart-summary">
            <h3>Cart ({cartItems.length} items)</h3>
            <button onClick={clearCart}>Clear Cart</button>
          </div>
        )}

        {/* Footer */}
        <footer className="app-footer">
          <p>&copy; 2024 Gotham Burger Social Club. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  )
}

export default App