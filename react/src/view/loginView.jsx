// Fixed LoginView.js
import React, { useState } from "react";

export default function LoginView({ onLogin, onLogout, isLoggedIn, currentUser }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    if (isLoggedIn) {
        return (
            <div>
                <h2>Welcome, {currentUser?.email}</h2>  {/* Fixed: use email instead of username */}
                <button onClick={onLogout}>Logout</button>
            </div>
        );
    }

    return (
        <div>
            <h2>Login</h2>
            <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={() => onLogin(email, password)}>Login</button>  {/* Fixed: pass email, not username */}
        </div>
    );
}