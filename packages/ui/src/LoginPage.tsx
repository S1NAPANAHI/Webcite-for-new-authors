import React, { useState, FormEvent } from 'react';
import { supabase } from '@zoroaster/shared/supabaseClient';
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

export const LoginPage: React.FC = () => {
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
    console.log('LoginPage: Attempting sign in for email:', loginEmail);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      console.log('LoginPage: signInWithPassword result error:', error);

      if (error) throw error;
      
      showMessage('Login successful! Redirecting...', 'success');
      console.log('LoginPage: Redirecting to home page');
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
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    console.log('handleGoogleLogin called');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth/callback', // Redirects to the current domain + callback path
        },
      });

      if (error) throw error;
      // No direct navigation here, as Supabase will handle the redirect
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with Google';
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
        {/* Header */}
        <div className="auth-header">
          <h1>Zoroasterverse</h1>
          <p>Join our community of readers and writers</p>
        </div>

        {/* Messages */}
        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Tab system */}
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

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label htmlFor="loginEmail">Email Address</label>
              <input
                type="email"
                id="loginEmail"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="your@email.com"
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
              <Link to="/forgot-password">Forgot your password?</Link>
            </div>
          </form>
        )}

        {/* Signup Form */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignup} className="auth-form">
            <div className="form-group">
              <label htmlFor="signupDisplayName">Display Name</label>
              <input
                type="text"
                id="signupDisplayName"
                value={signupDisplayName}
                onChange={(e) => setSignupDisplayName(e.target.value)}
                placeholder="Your name"
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="signupEmail">Email Address</label>
              <input
                type="email"
                id="signupEmail"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="your@email.com"
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
                placeholder="Create a password"
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
                placeholder="Confirm your password"
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

        {/* Social Login */}
        <div className="auth-divider">or continue with</div>
        <div className="social-logins">
          <button
            className="btn social"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            Google
          </button>
          <button
            className="btn social"
            onClick={() => showMessage('GitHub sign-in will be available soon', 'info')}
            disabled={loading}
          >
            GitHub
          </button>
        </div>

        <div className="auth-footer">
          By signing up, you agree to our terms of service and privacy policy.
        </div>
      </div>
    </div>
  );
};