import { AuuiBanner } from '../../components/AuuiBanner';

import React, { useState } from 'react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password, rememberMe });
    // Add your login logic here
  };

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    card: {
      backgroundColor: 'white',
      padding: '40px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '400px',
    },
    title: {
      margin: '0 0 30px 0',
      fontSize: '28px',
      fontWeight: '600',
      textAlign: 'center',
      color: '#333',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#555',
    },
    input: {
      padding: '12px',
      fontSize: '16px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      outline: 'none',
      transition: 'border-color 0.3s',
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    checkbox: {
      width: '16px',
      height: '16px',
      cursor: 'pointer',
    },
    checkboxLabel: {
      fontSize: '14px',
      color: '#555',
      cursor: 'pointer',
    },
    button: {
      padding: '12px',
      fontSize: '16px',
      fontWeight: '600',
      color: 'white',
      backgroundColor: '#007bff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    forgotPassword: {
      textAlign: 'center',
      marginTop: '15px',
    },
    link: {
      color: '#007bff',
      textDecoration: 'none',
      fontSize: '14px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Login</h1>
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="email">
              Email
            </label>
            <input
              style={styles.input}
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="password">
              Password
            </label>
            <input
              style={styles.input}
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <div style={styles.checkboxContainer}>
            <input
              style={styles.checkbox}
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label style={styles.checkboxLabel} htmlFor="remember">
              Remember me
            </label>
          </div>

          <button
            style={styles.button}
            type="submit"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
          >
            Sign In
          </button>

          <div style={styles.forgotPassword}>
            <a style={styles.link} href="#forgot">
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

const OriginalComponent = LoginPage;

export default function Component(props: any) {
  return (
    <>
      <AuuiBanner galleryUrl="https://app.auui.ai/prototypes/1768856838.081239" />
      <div style={{ marginTop: '40px' }}>
        <OriginalComponent {...props} />
      </div>
    </>
  );
}