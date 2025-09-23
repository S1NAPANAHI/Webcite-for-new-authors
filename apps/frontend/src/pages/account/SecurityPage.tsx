import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '@zoroaster/shared';
import { toast } from 'react-hot-toast';

interface LoginSession {
  id: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  last_active: string;
  is_current: boolean;
  location?: string;
}

interface SecuritySettings {
  two_factor_enabled: boolean;
  login_alerts: boolean;
  suspicious_activity_alerts: boolean;
  password_last_changed: string;
  last_login: string;
  failed_login_attempts: number;
}

const SecurityPage: React.FC = () => {
  const { user } = useAuth();
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [loginSessions, setLoginSessions] = useState<LoginSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    fetchSecurityData();
  }, [user]);

  const fetchSecurityData = async () => {
    if (!user) return;

    try {
      // Fetch security settings - in real implementation, this would be from a security_settings table
      const mockSecuritySettings: SecuritySettings = {
        two_factor_enabled: false,
        login_alerts: true,
        suspicious_activity_alerts: true,
        password_last_changed: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        last_login: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        failed_login_attempts: 0
      };

      // Fetch recent login sessions - simulated data
      const mockSessions: LoginSession[] = [
        {
          id: '1',
          ip_address: '192.168.1.100',
          user_agent: 'Chrome 118.0.0.0 on Windows 10',
          created_at: new Date().toISOString(),
          last_active: new Date().toISOString(),
          is_current: true,
          location: 'New York, NY, USA'
        },
        {
          id: '2',
          ip_address: '10.0.0.50',
          user_agent: 'Safari 17.0 on macOS Sonoma',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          last_active: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
          is_current: false,
          location: 'San Francisco, CA, USA'
        },
        {
          id: '3',
          ip_address: '172.16.0.25',
          user_agent: 'Firefox 119.0 on Ubuntu 22.04',
          created_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
          last_active: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          is_current: false,
          location: 'London, UK'
        }
      ];

      setSecuritySettings(mockSecuritySettings);
      setLoginSessions(mockSessions);
    } catch (error) {
      console.error('Error fetching security data:', error);
      toast.error('Failed to load security information');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) {
        toast.error('Failed to update password: ' + error.message);
      } else {
        toast.success('Password updated successfully');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordForm(false);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogoutOtherSessions = async () => {
    try {
      // In a real implementation, you'd call an API to invalidate other sessions
      toast.success('All other sessions have been logged out');
      // Refresh sessions
      await fetchSecurityData();
    } catch (error) {
      console.error('Error logging out other sessions:', error);
      toast.error('Failed to logout other sessions');
    }
  };

  const handleEnable2FA = async () => {
    try {
      // In a real implementation, you'd set up 2FA with QR codes, backup codes, etc.
      toast.success('2FA setup would be initiated here');
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      toast.error('Failed to enable 2FA');
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const getPasswordStrengthColor = (daysAgo: number) => {
    if (daysAgo < 30) return 'text-green-600';
    if (daysAgo < 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!securitySettings) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Security Settings</h2>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  const passwordAge = Math.floor((Date.now() - new Date(securitySettings.password_last_changed).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Security Settings</h1>
        <p className="text-gray-600">Manage your account security and login preferences</p>
      </div>

      <div className="space-y-8">
        {/* Password Security */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Password & Authentication</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Password</h3>
                <p className={`text-sm ${getPasswordStrengthColor(passwordAge)}`}>
                  Last changed {passwordAge} days ago
                  {passwordAge > 90 && ' - Consider updating your password'}
                </p>
              </div>
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Change Password
              </button>
            </div>

            {/* Password Change Form */}
            {showPasswordForm && (
              <form onSubmit={handlePasswordChange} className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      minLength={8}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      minLength={8}
                      required
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={changingPassword}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center"
                    >
                      {changingPassword && (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      {changingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}

            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Two-Factor Authentication</h3>
                <p className={`text-sm ${
                  securitySettings.two_factor_enabled ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {securitySettings.two_factor_enabled ? 'Enabled - Your account is protected' : 'Disabled - Add an extra layer of security'}
                </p>
              </div>
              <button
                onClick={handleEnable2FA}
                className={`px-4 py-2 rounded-md transition-colors ${
                  securitySettings.two_factor_enabled
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {securitySettings.two_factor_enabled ? 'Disable 2FA' : 'Enable 2FA'}
              </button>
            </div>
          </div>
        </div>

        {/* Security Alerts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Alerts</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Login Alerts</h3>
                <p className="text-sm text-gray-500">Get notified when someone logs into your account</p>
              </div>
              <button
                onClick={() => setSecuritySettings(prev => prev ? { ...prev, login_alerts: !prev.login_alerts } : null)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  securitySettings.login_alerts ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  securitySettings.login_alerts ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Suspicious Activity Alerts</h3>
                <p className="text-sm text-gray-500">Get alerted about unusual account activity</p>
              </div>
              <button
                onClick={() => setSecuritySettings(prev => prev ? { ...prev, suspicious_activity_alerts: !prev.suspicious_activity_alerts } : null)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  securitySettings.suspicious_activity_alerts ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  securitySettings.suspicious_activity_alerts ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Account Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Activity</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Last login</span>
              <span className="text-gray-900 font-medium">
                {formatTimeAgo(securitySettings.last_login)}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Failed login attempts</span>
              <span className={`font-medium ${
                securitySettings.failed_login_attempts > 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                {securitySettings.failed_login_attempts}
              </span>
            </div>
          </div>
        </div>

        {/* Login Sessions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Active Sessions</h2>
            {loginSessions.filter(s => !s.is_current).length > 0 && (
              <button
                onClick={handleLogoutOtherSessions}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
              >
                Logout All Other Sessions
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            {loginSessions.map(session => (
              <div
                key={session.id}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  session.is_current
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-900 mr-2">
                        {session.user_agent}
                      </h4>
                      {session.is_current && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                          Current Session
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>IP: {session.ip_address}</p>
                      {session.location && <p>Location: {session.location}</p>}
                      <p>Created: {formatTimeAgo(session.created_at)}</p>
                      <p>Last active: {formatTimeAgo(session.last_active)}</p>
                    </div>
                  </div>
                  
                  {!session.is_current && (
                    <button className="ml-4 px-3 py-1 text-xs text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors">
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <h2 className="text-xl font-semibold text-red-600 mb-6">Danger Zone</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Download Your Data</h3>
                <p className="text-sm text-gray-500">Get a copy of all your account data</p>
              </div>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                Request Export
              </button>
            </div>

            <div className="flex items-center justify-between py-4">
              <div>
                <h3 className="text-sm font-medium text-red-600">Delete Account</h3>
                <p className="text-sm text-gray-500">Permanently delete your account and all associated data</p>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;