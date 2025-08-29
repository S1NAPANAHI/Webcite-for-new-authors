import React, { useState, FormEvent } from 'react';
import { supabase } from '../../packages/shared/src/supabaseClient.js';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

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

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>{activeTab === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
          <p>{activeTab === 'login' 
            ? 'Sign in to access your account' 
            : 'Join our community today'}
          </p>
        </div>

        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
            type="button"
          >
            Sign In
          </button>
          <button
            className={`tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
            type="button"
          >
            Create Account
          </button>
        </div>

        {activeTab === 'login' ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="loginEmail">Email</label>
              <input
                type="email"
                id="loginEmail"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="loginPassword">Password</label>
              <input
                type="password"
                id="loginPassword"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>
            <button 
              type="submit" 
              className="btn primary" 
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <div className="form-footer">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleSignup}>
            <div className="form-group">
              <label htmlFor="signupDisplayName">Display Name</label>
              <input
                type="text"
                id="signupDisplayName"
                value={signupDisplayName}
                onChange={(e) => setSignupDisplayName(e.target.value)}
                placeholder="Enter your name"
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="signupEmail">Email</label>
              <input
                type="email"
                id="signupEmail"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="signupPassword">Password</label>
              <input
                type="password"
                id="signupPassword"
                value={signupPassword}
                onChange={(e) => {
                  setSignupPassword(e.target.value);
                  checkPasswordStrength(e.target.value);
                }}
                placeholder="Create a strong password"
                required
                disabled={loading}
              />
              {passwordStrength && (
                <div className={`password-strength ${passwordStrength.className}`}>
                  Password strength: {passwordStrength.text}
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
                disabled={loading}
              />
            </div>
            <button 
              type="submit" 
              className="btn primary" 
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        )}

        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        <div className="social-logins">
          <button
            type="button"
            className="btn social google"
            onClick={() => showMessage('Google login is not yet implemented', 'info')}
            disabled={loading}
          >
            Google
          </button>
          <button
            type="button"
            className="btn social github"
            onClick={() => showMessage('GitHub login is not yet implemented', 'info')}
            disabled={loading}
          >
            GitHub
          </button>
        </div>

        <div className="auth-footer">
          {activeTab === 'login' ? (
            <>
              Don't have an account?{' '}
              <button 
                type="button" 
                className="text-link"
                onClick={() => setActiveTab('signup')}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button 
                type="button" 
                className="text-link"
                onClick={() => setActiveTab('login')}
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;