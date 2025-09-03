import React, { useState, FormEvent } from 'react';
import { supabase } from '@zoroaster/shared/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
import styles from './LoginPage.module.css';

type FormMessage = {
  text: string;
  type: 'success' | 'error' | 'info';
};

type PasswordStrength = {
  text: string;
  className: string;
};

const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [message, setMessage] = useState<FormMessage | null>(null);
  const [loading, setLoading] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupDisplayName, setSignupDisplayName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);

  const navigate = useNavigate();

  const showMessage = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage({ text, type });
    const timer = setTimeout(() => setMessage(null), 6000);
    return () => clearTimeout(timer);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      showMessage('Please enter both email and password', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;
      
      showMessage('Login successful! Redirecting...', 'success');
      navigate('/');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';
      showMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    
    if (signupPassword !== confirmPassword) {
      showMessage('Passwords do not match', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            display_name: signupDisplayName,
          },
        },
      });

      if (error) throw error;
      
      showMessage('Account created! Please check your email to confirm your account.', 'success');
      setActiveTab('login');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account';
      showMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const checkPasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength(null);
      return;
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (password.length >= 12) score++;

    const strengthLevels = [
      { text: 'Weak', className: 'weak' },
      { text: 'Fair', className: 'fair' },
      { text: 'Good', className: 'good' },
      { text: 'Strong', className: 'strong' },
      { text: 'Very Strong', className: 'very-strong' }
    ];

    const level = Math.min(score, strengthLevels.length - 1);
    setPasswordStrength(strengthLevels[level]);
  };

  // Sacred symbols for floating animation
  const sacredSymbols = ['☽', '☿', '♃', '⊙', '♆', '⚯', '☯', '✧', '◊', '⬟'];

  // Debug: log styles object to see if CSS modules are working
  console.log('LoginPage styles object:', styles);

  return (
    <div 
      className={styles.body} 
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        background: "linear-gradient(135deg, #8B4513 0%, #CD853F 25%, #DEB887 50%, #F4A460 75%, #D2691E 100%)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999
      }}
    >
      {/* Sacred floating symbols */}
      <div className={styles.sacredSymbols}>
        {Array.from({ length: 12 }, (_, i) => (
          <div 
            key={i}
            className={styles.symbol}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              fontSize: `${1.5 + Math.random()}em`
            }}
          >
            {sacredSymbols[Math.floor(Math.random() * sacredSymbols.length)]}
          </div>
        ))}
      </div>

      {/* Main portal container */}
      <div 
        className={styles.portalContainer}
        style={{
          background: "linear-gradient(145deg, #F5DEB3, #DEB887, #D2B48C)",
          border: "8px solid #8B4513",
          borderRadius: "20px",
          padding: "50px",
          width: "500px",
          maxWidth: "90vw",
          position: "relative",
          zIndex: 10,
          boxShadow: "0 0 50px rgba(139, 69, 19, 0.4), inset 0 0 30px rgba(245, 222, 179, 0.3)",
          maxHeight: "90vh",
          overflowY: "auto"
        }}
      >
        {/* Decorative corner ornaments */}
        <div className={`${styles.cornerOrnament} ${styles.topLeft}`}></div>
        <div className={`${styles.cornerOrnament} ${styles.topRight}`}></div>
        <div className={`${styles.cornerOrnament} ${styles.bottomLeft}`}></div>
        <div className={`${styles.cornerOrnament} ${styles.bottomRight}`}></div>

        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Zoroasterverse</h1>
          <p className={styles.subtitle}>Sacred Portal of Ancient Wisdom</p>
        </div>

        {/* Sacred quote */}
        <div className={styles.sacredQuote}>
          "Truth is best (of all that is) good. As desired, what is being desired is truth for him who (represents) the best truth."
        </div>

        {/* Messages */}
        {message && (
          <div className={`${styles.message} ${styles[message.type]} ${styles.show}`}>
            {message.text}
          </div>
        )}

        {/* Tab system */}
        <div className={styles.tabContainer}>
          <button
            className={`${styles.tab} ${activeTab === 'login' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('login')}
            type="button"
          >
            Sacred Entry
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'signup' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('signup')}
            type="button"
          >
            Join the Light
          </button>
        </div>

        {/* Login Form */}
        <div className={`${styles.formContainer} ${activeTab === 'login' ? styles.activeForm : ''}`}>
          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="loginEmail">Sacred Email</label>
              <input
                className={styles.formInput}
                type="email"
                id="loginEmail"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Enter your sacred email"
                required
                disabled={loading}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="loginPassword">Sacred Password</label>
              <input
                className={styles.formInput}
                type="password"
                id="loginPassword"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter your sacred password"
                required
                disabled={loading}
              />
            </div>
            <button 
              type="submit" 
              className={styles.actionBtn}
              disabled={loading}
            >
              {loading ? 'Entering Sacred Realm...' : 'Enter Sacred Realm'}
            </button>
            <div className={styles.secondaryActions}>
              <Link to="/forgot-password">Forgotten Sacred Words?</Link>
            </div>
          </form>
        </div>

        {/* Signup Form */}
        <div className={`${styles.formContainer} ${activeTab === 'signup' ? styles.activeForm : ''}`}>
          <form onSubmit={handleSignup}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="signupDisplayName">Sacred Name</label>
              <input
                className={styles.formInput}
                type="text"
                id="signupDisplayName"
                value={signupDisplayName}
                onChange={(e) => setSignupDisplayName(e.target.value)}
                placeholder="Enter your sacred name"
                required
                disabled={loading}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="signupEmail">Sacred Email</label>
              <input
                className={styles.formInput}
                type="email"
                id="signupEmail"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="your.sacred@email.com"
                required
                disabled={loading}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="signupPassword">Sacred Password</label>
              <input
                className={styles.formInput}
                type="password"
                id="signupPassword"
                value={signupPassword}
                onChange={(e) => {
                  setSignupPassword(e.target.value);
                  checkPasswordStrength(e.target.value);
                }}
                placeholder="Create a sacred password"
                required
                disabled={loading}
              />
              {passwordStrength && (
                <div className={`${styles.passwordStrength} ${styles.visible}`}>
                  <div className={`${styles.strengthBar} ${styles[`strength${passwordStrength.className.charAt(0).toUpperCase() + passwordStrength.className.slice(1)}`]}`}></div>
                  <div className={styles.strengthText}>
                    Sacred Power: {passwordStrength.text}
                  </div>
                </div>
              )}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="confirmPassword">Confirm Sacred Password</label>
              <input
                className={styles.formInput}
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your sacred password"
                required
                disabled={loading}
              />
            </div>
            <button 
              type="submit" 
              className={styles.actionBtn}
              disabled={loading}
            >
              {loading ? 'Joining Sacred Realm...' : 'Join Sacred Realm'}
            </button>
          </form>
        </div>

        {/* Sacred methods (Social Login) */}
        <div className={styles.sacredMethods}>
          <div className={styles.sacredTitle}>Sacred Methods</div>
          <div className={styles.sacredButtons}>
            <button
              className={styles.sacredBtn}
              onClick={() => showMessage('Google sacred connection is not yet available', 'warning')}
              disabled={loading}
            >
              Google Light
            </button>
            <button
              className={styles.sacredBtn}
              onClick={() => showMessage('GitHub sacred connection is not yet available', 'warning')}
              disabled={loading}
            >
              GitHub Wisdom
            </button>
          </div>
        </div>

        {/* Loading spinner */}
        {loading && (
          <div className={`${styles.loading} ${loading ? styles.showLoading : ''}`}>
            <span className={styles.spinner}></span>
            Connecting to Sacred Realm...
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;