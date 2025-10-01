import React, { useState, FormEvent } from 'react';
import { supabase } from '@zoroaster/shared';
import { useNavigate, Link } from 'react-router-dom';

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

  // CRITICAL: Fixed login handler with proper error handling and debugging
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      showMessage('Please enter both email and password', 'error');
      return;
    }
    
    console.log('🔑 LoginPage: Attempting sign in for email:', loginEmail);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      console.log('🔍 LoginPage: signInWithPassword result', { 
        hasData: !!data, 
        hasUser: !!data?.user, 
        hasSession: !!data?.session, 
        error: error?.message || 'none' 
      });

      if (error) {
        console.error('❌ LoginPage: Authentication error:', error);
        showMessage(error.message, 'error');
        return;
      }

      if (!data?.user || !data?.session) {
        console.error('❌ LoginPage: No user or session data returned');
        showMessage('Login failed - no session created', 'error');
        return;
      }

      console.log('✅ LoginPage: Login successful, redirecting to home page');
      showMessage('Login successful! Redirecting...', 'success');
      
      // Small delay to ensure auth state propagates before navigation
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 500);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';
      console.error('❌ LoginPage: Unexpected error:', errorMessage);
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
    
    console.log('🆕 LoginPage: Attempting signup for email:', signupEmail);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            display_name: signupDisplayName,
          },
        },
      });

      if (error) {
        console.error('❌ LoginPage: Signup error:', error);
        showMessage(error.message, 'error');
        return;
      }

      console.log('✅ LoginPage: Signup successful');
      showMessage('Account created! Please check your email to confirm your account.', 'success');
      setActiveTab('login');
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account';
      console.error('❌ LoginPage: Signup error:', errorMessage);
      showMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    console.log('🔑 LoginPage: Attempting Google OAuth login');
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth/callback',
        },
      });

      if (error) {
        console.error('❌ LoginPage: Google login error:', error);
        showMessage(error.message, 'error');
      } else {
        console.log('✅ LoginPage: Google OAuth initiated');
      }
      // No direct navigation here, as Supabase will handle the redirect
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with Google';
      console.error('❌ LoginPage: Google login error:', errorMessage);
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

  // Inline styles for Persian/Zoroastrian theme
  const containerStyle: React.CSSProperties = {
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
    zIndex: 9999,
    overflow: "auto",
  };

  const portalStyle: React.CSSProperties = {
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
    overflowY: "auto",
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: "'Cinzel', serif",
    fontSize: "3em",
    fontWeight: 700,
    color: "#8B4513",
    textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
    marginBottom: "15px",
    letterSpacing: "3px",
    textAlign: "center",
  };

  const subtitleStyle: React.CSSProperties = {
    fontFamily: "'Cormorant Garamond', serif",
    color: "#A0522D",
    fontSize: "1.4em",
    fontWeight: 400,
    fontStyle: "italic",
    letterSpacing: "1px",
    textAlign: "center",
    marginBottom: "30px",
  };

  const tabStyle: React.CSSProperties = {
    display: "flex",
    marginBottom: "30px",
    borderBottom: "2px solid #8B4513",
    background: "rgba(139, 69, 19, 0.1)",
    borderRadius: "8px 8px 0 0",
  };

  const tabButtonStyle: React.CSSProperties = {
    flex: 1,
    padding: "18px",
    textAlign: "center",
    background: "transparent",
    border: "none",
    color: "#8B4513",
    fontFamily: "'Cinzel', serif",
    fontWeight: 600,
    fontSize: "1.1em",
    cursor: "pointer",
    textTransform: "uppercase",
    letterSpacing: "1px",
  };

  const activeTabStyle: React.CSSProperties = {
    ...tabButtonStyle,
    background: "linear-gradient(145deg, #CD853F, #DEB887)",
    color: "#654321",
    boxShadow: "inset 0 2px 10px rgba(139, 69, 19, 0.2)",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "16px 20px",
    background: "rgba(245, 222, 179, 0.8)",
    border: "3px solid rgba(139, 69, 19, 0.3)",
    borderRadius: "8px",
    color: "#654321",
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "1.2em",
    marginBottom: "20px",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    color: "#8B4513",
    fontSize: "1.1em",
    fontWeight: 600,
    marginBottom: "10px",
    fontFamily: "'Cinzel', serif",
    letterSpacing: "1px",
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    padding: "18px",
    background: "linear-gradient(145deg, #CD853F, #D2691E, #B8860B)",
    border: "3px solid #8B4513",
    borderRadius: "12px",
    color: "#F5DEB3",
    fontFamily: "'Cinzel', serif",
    fontSize: "1.2em",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "2px",
    cursor: "pointer",
    textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
    marginTop: "15px",
  };

  const messageStyle: React.CSSProperties = {
    padding: "15px 20px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "center",
    fontWeight: 500,
    fontSize: "1.05em",
    border: "2px solid",
  };

  const getMessageStyle = (type: string) => {
    const baseStyle = { ...messageStyle };
    switch (type) {
      case 'success':
        return { ...baseStyle, background: "rgba(34, 139, 34, 0.1)", borderColor: "#228B22", color: "#006400" };
      case 'error':
        return { ...baseStyle, background: "rgba(205, 92, 92, 0.1)", borderColor: "#CD5C5C", color: "#8B0000" };
      default:
        return { ...baseStyle, background: "rgba(218, 165, 32, 0.1)", borderColor: "#DAA520", color: "#B8860B" };
    }
  };

  return (
    <div style={containerStyle}>
      {/* Sacred floating symbols */}
      <div style={{ position: "fixed", width: "100%", height: "100%", overflow: "hidden", zIndex: 2, pointerEvents: "none" }}>
        {Array.from({ length: 12 }, (_, i) => (
          <div 
            key={i}
            style={{
              position: "absolute",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${1.5 + Math.random()}em`,
              color: "rgba(139, 69, 19, 0.1)",
              animation: `float${i} ${20 + Math.random() * 10}s infinite linear`,
              textShadow: "0 0 10px rgba(139, 69, 19, 0.2)",
            }}
          >
            {sacredSymbols[Math.floor(Math.random() * sacredSymbols.length)]}
          </div>
        ))}
      </div>

      {/* Main portal container */}
      <div style={portalStyle}>
        {/* Header */}
        <div>
          <h1 style={titleStyle}>Zoroastervers</h1>
          <p style={subtitleStyle}>Sacred Portal of Ancient Wisdom</p>
        </div>

        {/* Sacred quote */}
        <div style={{
          textAlign: "center",
          margin: "20px 0 30px",
          padding: "15px",
          background: "rgba(139, 69, 19, 0.1)",
          borderLeft: "4px solid #8B4513",
          borderRight: "4px solid #8B4513",
          fontStyle: "italic",
          color: "#654321",
          fontSize: "1.1em",
        }}>
          "Truth is best (of all that is) good. As desired, what is being desired is truth for him who (represents) the best truth."
        </div>

        {/* Messages */}
        {message && (
          <div style={getMessageStyle(message.type)}>
            {message.text}
          </div>
        )}

        {/* Tab system */}
        <div style={tabStyle}>
          <button
            style={activeTab === 'login' ? activeTabStyle : tabButtonStyle}
            onClick={() => setActiveTab('login')}
            type="button"
          >
            Sacred Entry
          </button>
          <button
            style={activeTab === 'signup' ? activeTabStyle : tabButtonStyle}
            onClick={() => setActiveTab('signup')}
            type="button"
          >
            Join the Light
          </button>
        </div>

        {/* Login Form - FIXED: Added autocomplete attributes */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} autoComplete="on">
            <div>
              <label style={labelStyle} htmlFor="loginEmail">Sacred Email</label>
              <input
                style={inputStyle}
                type="email"
                id="loginEmail"
                name="email"
                autoComplete="username"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Enter your sacred email"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label style={labelStyle} htmlFor="loginPassword">Sacred Password</label>
              <input
                style={inputStyle}
                type="password"
                id="loginPassword"
                name="current-password"
                autoComplete="current-password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter your sacred password"
                required
                disabled={loading}
              />
            </div>
            <button 
              type="submit" 
              style={buttonStyle}
              disabled={loading}
            >
              {loading ? 'Entering Sacred Realm...' : 'Enter Sacred Realm'}
            </button>
            <div style={{ textAlign: "center", marginTop: "25px" }}>
              <Link to="/forgot-password" style={{ color: "#8B4513", textDecoration: "none" }}>Forgotten Sacred Words?</Link>
            </div>
          </form>
        )}

        {/* Signup Form - FIXED: Added autocomplete attributes */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignup} autoComplete="on">
            <div>
              <label style={labelStyle} htmlFor="signupDisplayName">Sacred Name</label>
              <input
                style={inputStyle}
                type="text"
                id="signupDisplayName"
                name="name"
                autoComplete="name"
                value={signupDisplayName}
                onChange={(e) => setSignupDisplayName(e.target.value)}
                placeholder="Enter your sacred name"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label style={labelStyle} htmlFor="signupEmail">Sacred Email</label>
              <input
                style={inputStyle}
                type="email"
                id="signupEmail"
                name="email"
                autoComplete="username"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="your.sacred@email.com"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label style={labelStyle} htmlFor="signupPassword">Sacred Password</label>
              <input
                style={inputStyle}
                type="password"
                id="signupPassword"
                name="new-password"
                autoComplete="new-password"
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
                <div style={{ fontSize: "0.9em", marginTop: "8px", color: "#8B4513" }}>
                  Sacred Power: {passwordStrength.text}
                </div>
              )}
            </div>
            <div>
              <label style={labelStyle} htmlFor="confirmPassword">Confirm Sacred Password</label>
              <input
                style={inputStyle}
                type="password"
                id="confirmPassword"
                name="confirm-password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your sacred password"
                required
                disabled={loading}
              />
            </div>
            <button 
              type="submit" 
              style={buttonStyle}
              disabled={loading}
            >
              {loading ? 'Joining Sacred Realm...' : 'Join Sacred Realm'}
            </button>
          </form>
        )}

        {/* Sacred methods (Social Login) */}
        <div style={{ marginTop: "35px", textAlign: "center" }}>
          <div style={{ color: "#8B4513", marginBottom: "20px", fontSize: "1.1em", fontWeight: 600, fontFamily: "'Cinzel', serif", letterSpacing: "1px" }}>
            Sacred Methods
          </div>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              style={{
                padding: "12px 18px",
                border: "2px solid #8B4513",
                borderRadius: "8px",
                background: "rgba(245, 222, 179, 0.8)",
                color: "#8B4513",
                fontFamily: "'Cinzel', serif",
                fontWeight: 600,
                fontSize: "0.95em",
                textTransform: "uppercase",
                letterSpacing: "1px",
                cursor: "pointer",
              }}
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              Google Light
            </button>
            <button
              style={{
                padding: "12px 18px",
                border: "2px solid #8B4513",
                borderRadius: "8px",
                background: "rgba(245, 222, 179, 0.8)",
                color: "#8B4513",
                fontFamily: "'Cinzel', serif",
                fontWeight: 600,
                fontSize: "0.95em",
                textTransform: "uppercase",
                letterSpacing: "1px",
                cursor: "pointer",
              }}
              onClick={() => showMessage('GitHub sacred connection is not yet available', 'info')}
              disabled={loading}
            >
              GitHub Wisdom
            </button>
          </div>
        </div>

        {/* Loading spinner */}
        {loading && (
          <div style={{ textAlign: "center", color: "#8B4513", marginTop: "15px" }}>
            <span style={{
              display: "inline-block",
              width: "25px",
              height: "25px",
              border: "3px solid rgba(139, 69, 19, 0.3)",
              borderTop: "3px solid #8B4513",
              borderRadius: "50%",
              animation: "spin 1.2s linear infinite",
              marginRight: "12px",
            }}></span>
            Connecting to Sacred Realm...
          </div>
        )}
      </div>

      {/* Add CSS animations */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:wght@400;500;600&display=swap');
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          ${Array.from({ length: 12 }, (_, i) => `
            @keyframes float${i} {
              0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
              }
              10% {
                opacity: 0.3;
              }
              90% {
                opacity: 0.3;
              }
              100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
              }
            }
          `).join('')}
        `}
      </style>
    </div>
  );
};

export default LoginPage;
