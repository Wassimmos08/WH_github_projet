import React, { useState } from "react";

const RegisterView = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Use environment variable or default to localhost
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError("Username is required");
      return false;
    }
    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Registration failed');
      }

      setSuccess("Registration successful! Redirecting...");
      
      if (onRegisterSuccess) {
        onRegisterSuccess(data.user, data.token);
      }

      // Reset form
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
      });

    } catch (error) {
      console.error("Registration failed:", error);
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        
        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={styles.successMessage}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <input
              name="username"
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <input
              name="email"
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <input
              name="password"
              type="password"
              placeholder="Password (min. 6 characters)"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              style={styles.input}
              minLength={6}
            />
          </div>

          <div style={styles.formGroup}>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              style={styles.input}
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            style={isSubmitting ? styles.buttonDisabled : styles.button}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {onSwitchToLogin && (
          <div style={styles.switchAuth}>
            <p style={styles.switchText}>Already have an account?</p>
            <button 
              type="button" 
              onClick={onSwitchToLogin}
              style={styles.switchButton}
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: '#f5f5f5'
  },
  card: {
    background: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#333'
  },
  errorMessage: {
    color: '#dc3545',
    background: '#f8d7da',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem'
  },
  successMessage: {
    color: '#155724',
    background: '#d4edda',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem'
  },
  form: {
    width: '100%'
  },
  formGroup: {
    marginBottom: '1rem'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '0.5rem'
  },
  buttonDisabled: {
    width: '100%',
    padding: '0.75rem',
    background: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'not-allowed',
    marginTop: '0.5rem'
  },
  switchAuth: {
    textAlign: 'center',
    marginTop: '1.5rem',
    paddingTop: '1rem',
    borderTop: '1px solid #eee'
  },
  switchText: {
    margin: '0 0 0.5rem 0',
    color: '#666'
  },
  switchButton: {
    background: 'none',
    border: 'none',
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '1rem'
  }
};

export default RegisterView;