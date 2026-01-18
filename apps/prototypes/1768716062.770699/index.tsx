import React, { useState } from 'react';

interface LoginFormProps {
  onSubmit?: (email: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit?.(email, password);
      console.log('Login submitted:', { email, password });
    }
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
    },
    form: {
      backgroundColor: 'white',
      padding: '40px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '400px',
    },
    title: {
      margin: '0 0 30px 0',
      fontSize: '24px',
      fontWeight: 600,
      color: '#333',
      textAlign: 'center' as const,
    },
    inputGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: 500,
      color: '#555',
    },
    input: {
      width: '100%',
      padding: '12px',
      fontSize: '14px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      boxSizing: 'border-box' as const,
      transition: 'border-color 0.3s',
      outline: 'none',
    },
    inputError: {
      borderColor: '#ef4444',
    },
    error: {
      color: '#ef4444',
      fontSize: '12px',
      marginTop: '4px',
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      marginTop: '10px',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Login</h2>
        
        <div style={styles.inputGroup}>
          <label htmlFor="email" style={styles.label}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              ...styles.input,
              ...(errors.email ? styles.inputError : {}),
            }}
            placeholder="Enter your email"
          />
          {errors.email && <div style={styles.error}>{errors.email}</div>}
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="password" style={styles.label}>
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              ...styles.input,
              ...(errors.password ? styles.inputError : {}),
            }}
            placeholder="Enter your password"
          />
          {errors.password && <div style={styles.error}>{errors.password}</div>}
        </div>

        <button
          type="submit"
          style={styles.button}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = styles.button.backgroundColor;
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;