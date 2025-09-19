import React, { useState } from "react";
import User from "../models/user";
import LoginView from "../views/LoginView";
 
export default function AuthController() {
  const [user, setUser] = useState(null);
 
  const handleLogin = (email, password) => {
    if (email && password) {
      const newUser = new User(email, password);
      setUser(newUser);
    } else {
      alert("Please enter username and password");
    }
  };
 
  const handleLogout = () => {
    setUser(null);
  };
 
  return (
<LoginView
      isLoggedIn={!!user}
      currentUser={user}
      onLogin={handleLogin}
      onLogout={handleLogout}
    />
  );
}