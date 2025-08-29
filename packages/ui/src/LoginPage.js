import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { supabase } from '@zoroaster/shared';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
const LoginPage = () => {
    const [activeTab, setActiveTab] = useState('login');
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    // Login state
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    // Signup state
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupDisplayName, setSignupDisplayName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(null);
    const navigate = useNavigate();
    const showMessage = (text, type = 'info') => {
        setMessage({ text, type });
        const timer = setTimeout(() => setMessage(null), 6000);
        return () => clearTimeout(timer);
    };
    const handleLogin = async (e) => {
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
            if (error)
                throw error;
            navigate('/');
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';
            showMessage(errorMessage, 'error');
        }
        finally {
            setLoading(false);
        }
    };
    const handleSignup = async (e) => {
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
            if (error)
                throw error;
            showMessage('Account created! Please check your email to confirm your account.', 'success');
            setActiveTab('login');
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create account';
            showMessage(errorMessage, 'error');
        }
        finally {
            setLoading(false);
        }
    };
    const checkPasswordStrength = (password) => {
        if (!password) {
            setPasswordStrength(null);
            return;
        }
        let score = 0;
        if (password.length >= 8)
            score++;
        if (/[A-Z]/.test(password))
            score++;
        if (/[a-z]/.test(password))
            score++;
        if (/[0-9]/.test(password))
            score++;
        if (/[^A-Za-z0-9]/.test(password))
            score++;
        if (password.length >= 12)
            score++;
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
    return (_jsx("div", { className: "auth-page", children: _jsxs("div", { className: "auth-container", children: [_jsxs("div", { className: "auth-header", children: [_jsx("h1", { children: activeTab === 'login' ? 'Welcome Back' : 'Create Account' }), _jsx("p", { children: activeTab === 'login'
                                ? 'Sign in to access your account'
                                : 'Join our community today' })] }), message && (_jsx("div", { className: `message ${message.type}`, children: message.text })), _jsxs("div", { className: "tabs", children: [_jsx("button", { className: `tab ${activeTab === 'login' ? 'active' : ''}`, onClick: () => setActiveTab('login'), type: "button", children: "Sign In" }), _jsx("button", { className: `tab ${activeTab === 'signup' ? 'active' : ''}`, onClick: () => setActiveTab('signup'), type: "button", children: "Create Account" })] }), activeTab === 'login' ? (_jsxs("form", { className: "auth-form", onSubmit: handleLogin, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "loginEmail", children: "Email" }), _jsx("input", { type: "email", id: "loginEmail", value: loginEmail, onChange: (e) => setLoginEmail(e.target.value), placeholder: "Enter your email", required: true, disabled: loading })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "loginPassword", children: "Password" }), _jsx("input", { type: "password", id: "loginPassword", value: loginPassword, onChange: (e) => setLoginPassword(e.target.value), placeholder: "Enter your password", required: true, disabled: loading })] }), _jsx("button", { type: "submit", className: "btn primary", disabled: loading, children: loading ? 'Signing in...' : 'Sign In' }), _jsx("div", { className: "form-footer", children: _jsx(Link, { to: "/forgot-password", children: "Forgot password?" }) })] })) : (_jsxs("form", { className: "auth-form", onSubmit: handleSignup, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "signupDisplayName", children: "Display Name" }), _jsx("input", { type: "text", id: "signupDisplayName", value: signupDisplayName, onChange: (e) => setSignupDisplayName(e.target.value), placeholder: "Enter your name", required: true, disabled: loading })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "signupEmail", children: "Email" }), _jsx("input", { type: "email", id: "signupEmail", value: signupEmail, onChange: (e) => setSignupEmail(e.target.value), placeholder: "your.email@example.com", required: true, disabled: loading })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "signupPassword", children: "Password" }), _jsx("input", { type: "password", id: "signupPassword", value: signupPassword, onChange: (e) => {
                                        setSignupPassword(e.target.value);
                                        checkPasswordStrength(e.target.value);
                                    }, placeholder: "Create a strong password", required: true, disabled: loading }), passwordStrength && (_jsxs("div", { className: `password-strength ${passwordStrength.className}`, children: ["Password strength: ", passwordStrength.text] }))] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "confirmPassword", children: "Confirm Password" }), _jsx("input", { type: "password", id: "confirmPassword", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), placeholder: "Re-enter your password", required: true, disabled: loading })] }), _jsx("button", { type: "submit", className: "btn primary", disabled: loading, children: loading ? 'Creating account...' : 'Create Account' })] })), _jsx("div", { className: "auth-divider", children: _jsx("span", { children: "or continue with" }) }), _jsxs("div", { className: "social-logins", children: [_jsx("button", { type: "button", className: "btn social google", onClick: () => showMessage('Google login is not yet implemented', 'info'), disabled: loading, children: "Google" }), _jsx("button", { type: "button", className: "btn social github", onClick: () => showMessage('GitHub login is not yet implemented', 'info'), disabled: loading, children: "GitHub" })] }), _jsx("div", { className: "auth-footer", children: activeTab === 'login' ? (_jsxs(_Fragment, { children: ["Don't have an account?", ' ', _jsx("button", { type: "button", className: "text-link", onClick: () => setActiveTab('signup'), children: "Sign up" })] })) : (_jsxs(_Fragment, { children: ["Already have an account?", ' ', _jsx("button", { type: "button", className: "text-link", onClick: () => setActiveTab('login'), children: "Sign in" })] })) })] }) }));
};
export default LoginPage;
