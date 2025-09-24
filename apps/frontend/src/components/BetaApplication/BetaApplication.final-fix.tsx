/**
 * BetaApplication - FINAL WORKING VERSION
 *
 * Fixes:
 * - Zero infinite-render loops (React #301)
 * - Proper user_id column usage (Supabase 400/42703)
 * - Defensive error handling everywhere
 * - Stable dependencies in useEffect
 * - All handlers wrapped in useCallback
 */
import React, { useEffect, useState, useCallback } from 'react';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { 
    ChevronLeft, 
    ChevronRight, 
    Clock, 
    Check, 
    AlertCircle, 
    User as UserIcon, 
    Star,
    Award,
    BookOpen,
    MessageSquare,
    Shield,
    Globe,
    CheckCircle2,
    Timer,
    Zap
} from 'lucide-react';

interface BetaApplicationRow {
  id: string;
  user_id: string;
  status: string;
  application_data: Record<string, unknown>;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface BetaApplicationProps {
    supabaseClient: SupabaseClient;
    user: User | null;
}

interface FormData {
    fullName: string;
    email: string;
    timeZone: string;
    country: string;
    betaCommitment: string;
    hoursPerWeek: string;
    portalUse: string;
    interestStatement: string;
    recentReads: string;
    feedbackPhilosophy: string;
    communication: string;
    devices: string[];
}

const BetaApplication: React.FC<BetaApplicationProps> = ({ supabaseClient, user }) => {
    // Auth and data state
    const [row, setRow] = useState<BetaApplicationRow | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentStage, setCurrentStage] = useState(1);
    
    // Form state
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        email: user?.email || '',
        timeZone: '',
        country: '',
        betaCommitment: '',
        hoursPerWeek: '',
        portalUse: '',
        interestStatement: '',
        recentReads: '',
        feedbackPhilosophy: '',
        communication: '',
        devices: []
    });

    // Word counts for validation
    const [wordCounts, setWordCounts] = useState({
        interestStatement: 0
    });

    // FIXED: Fetch user's existing application (no infinite loops)
    useEffect(() => {
        if (!user?.id || !supabaseClient) return;
        
        let ignore = false;

        const fetchApplication = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const { data, error } = await supabaseClient
                    .from('beta_applications')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (!ignore) {
                    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
                        setError(error.message);
                    } else {
                        setRow(data as BetaApplicationRow | null);
                        // If application exists, populate form data
                        if (data && data.application_data) {
                            const appData = data.application_data as Partial<FormData>;
                            setFormData(prev => ({ ...prev, ...appData }));
                        }
                    }
                }
            } catch (err) {
                if (!ignore) {
                    setError(err instanceof Error ? err.message : 'Unknown error occurred');
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        fetchApplication();
        return () => { ignore = true; };
    }, [user?.id, supabaseClient]); // Stable dependencies

    // FIXED: Word counting with useCallback to prevent re-renders
    const updateWordCount = useCallback((text: string, field: keyof typeof wordCounts) => {
        const count = text.trim().split(/\s+/).filter(word => word.length > 0).length;
        setWordCounts(prev => ({ ...prev, [field]: count }));
    }, []);

    // FIXED: Form handlers with useCallback
    const handleInputChange = useCallback((field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Update word count for text areas
        if (field === 'interestStatement') {
            updateWordCount(value, 'interestStatement');
        }
    }, [updateWordCount]);

    const handleDeviceChange = useCallback((device: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            devices: checked 
                ? [...prev.devices, device]
                : prev.devices.filter(d => d !== device)
        }));
    }, []);

    // FIXED: Submit handler with useCallback
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;

        setLoading(true);
        setError(null);

        const payload = {
            user_id: user.id,
            application_data: formData,
            status: 'submitted',
        };

        try {
            const { data, error } = row
                ? await supabaseClient // UPDATE existing
                    .from('beta_applications')
                    .update(payload)
                    .eq('id', row.id)
                    .select()
                    .single()
                : await supabaseClient // INSERT new
                    .from('beta_applications')
                    .insert(payload)
                    .select()
                    .single();

            if (error) {
                setError(error.message);
            } else {
                setRow(data as BetaApplicationRow);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit application');
        } finally {
            setLoading(false);
        }
    }, [formData, row, user?.id, supabaseClient]);

    // FIXED: Navigation handlers with useCallback
    const goToNextStage = useCallback(() => {
        setCurrentStage(prev => Math.min(prev + 1, 4));
    }, []);

    const goToPreviousStage = useCallback(() => {
        setCurrentStage(prev => Math.max(prev - 1, 1));
    }, []);

    // Validation
    const isStage1Valid = formData.fullName && 
                         formData.email && 
                         formData.timeZone && 
                         formData.betaCommitment && 
                         formData.hoursPerWeek && 
                         formData.portalUse && 
                         wordCounts.interestStatement >= 150 && 
                         wordCounts.interestStatement <= 250 &&
                         formData.feedbackPhilosophy &&
                         formData.communication &&
                         formData.devices.length > 0;

    // Loading state
    if (loading && !row) {
        return (
            <div className="beta-app-loading">
                <div className="loading-content">
                    <div className="spinner large" />
                    <h3>Loading your application...</h3>
                    <p>Please wait while we prepare your beta reader application.</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="beta-app-container">
                <div className="error-display">
                    <div className="error-icon">
                        <AlertCircle size={48} />
                    </div>
                    <h2>Application Error</h2>
                    <p style={{color:'red'}}>Error: {error}</p>
                    <button 
                        className="btn btn-primary"
                        onClick={() => {
                            setError(null);
                            setLoading(false);
                        }}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Show submitted application
    if (row) {
        return (
            <div className="beta-app-container">
                <div className="status-display submitted">
                    <div className="status-icon">
                        <CheckCircle2 size={64} />
                    </div>
                    <h2>Application Successfully Submitted!</h2>
                    <p>Thank you for applying to the Zangar/Spandam Beta Reader Program.</p>
                    
                    <div className="status-card">
                        <div className="status-row">
                            <span className="status-label">Submitted:</span>
                            <span className="status-value">
                                {new Date(row.submitted_at || row.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                        <div className="status-row">
                            <span className="status-label">Current Status:</span>
                            <span className="status-value">
                                <div className="status-badge pending">
                                    <Clock size={14} />
                                    {row.status || 'Under Review'}
                                </div>
                            </span>
                        </div>
                        <div className="status-row">
                            <span className="status-label">Expected Response:</span>
                            <span className="status-value">Within 1-2 weeks</span>
                        </div>
                    </div>
                    
                    <div className="application-data">
                        <h3>Your Application Data:</h3>
                        <pre style={{background:'#f5f5f5',padding:'1rem',borderRadius:'4px',overflow:'auto'}}>
                            {JSON.stringify(row.application_data, null, 2)}
                        </pre>
                    </div>
                    
                    <button 
                        className="btn btn-outline"
                        onClick={() => setRow(null)}
                    >
                        Edit Application
                    </button>
                </div>
            </div>
        );
    }

    // Show application form
    return (
        <div className="beta-app-container">
            {/* Header */}
            <div className="beta-app-header">
                <div className="header-content">
                    <div className="header-badge">
                        <Star size={16} />
                        Beta Reader Program
                    </div>
                    <h1>Zangar/Spandam Beta Reader Application</h1>
                    <p className="header-subtitle">
                        Join our exclusive community of beta readers and help shape the future of epic sci-fi/fantasy
                    </p>
                </div>
            </div>

            {/* Progress indicator */}
            <div className="progress-indicator">
                <div className="progress-bar">
                    <div 
                        className="progress-fill"
                        style={{ width: `${(currentStage / 4) * 100}%` }}
                    />
                </div>
                <div className="progress-text">
                    Step {currentStage} of 4
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="enhanced-form">
                <div className="form-section">
                    <div className="section-header">
                        <h3>Personal Information & Commitment</h3>
                        <p>Help us understand your background and availability for the beta program.</p>
                    </div>
                    
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="fullName" className="form-label required">
                                Full Name
                            </label>
                            <input 
                                type="text" 
                                id="fullName" 
                                className="form-input"
                                value={formData.fullName}
                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                                placeholder="Enter your full name"
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label required">
                                Email Address
                            </label>
                            <input 
                                type="email" 
                                id="email" 
                                className="form-input"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="your.email@example.com"
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="timeZone" className="form-label required">
                                Time Zone
                            </label>
                            <select 
                                id="timeZone" 
                                className="form-input"
                                value={formData.timeZone}
                                onChange={(e) => handleInputChange('timeZone', e.target.value)}
                                required
                            >
                                <option value="">Select your time zone</option>
                                <option value="America/New_York">🇺🇸 Eastern Time (UTC-5/-4)</option>
                                <option value="America/Chicago">🇺🇸 Central Time (UTC-6/-5)</option>
                                <option value="America/Denver">🇺🇸 Mountain Time (UTC-7/-6)</option>
                                <option value="America/Los_Angeles">🇺🇸 Pacific Time (UTC-8/-7)</option>
                                <option value="Europe/London">🇬🇧 GMT/BST (UTC+0/+1)</option>
                                <option value="Europe/Paris">🇫🇷 CET/CEST (UTC+1/+2)</option>
                                <option value="Asia/Tokyo">🇯🇵 JST (UTC+9)</option>
                                <option value="Australia/Sydney">🇦🇺 AEST/AEDT (UTC+10/+11)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="country" className="form-label">
                                Country
                            </label>
                            <input 
                                type="text" 
                                id="country" 
                                className="form-input"
                                value={formData.country}
                                onChange={(e) => handleInputChange('country', e.target.value)}
                                placeholder="Your country of residence"
                            />
                        </div>
                    </div>

                    {/* Commitment Level */}
                    <div className="form-group">
                        <label className="form-label required">
                            Beta Window Commitment Level
                        </label>
                        <div className="radio-group">
                            {[
                                { value: 'weekly_deadlines', label: 'Weekly Deadlines', desc: 'I can commit to consistent weekly deadlines' },
                                { value: 'commit_with_extensions', label: 'Flexible Commitment', desc: 'I can commit but may need occasional extensions' },
                                { value: 'prefer_flexible', label: 'Flexible Schedule', desc: 'I prefer flexible deadlines but will complete assignments' },
                                { value: 'no_commitment', label: 'No Deadlines', desc: 'I cannot commit to any deadlines' }
                            ].map(option => (
                                <label key={option.value} className="radio-option">
                                    <input 
                                        type="radio" 
                                        name="betaCommitment" 
                                        value={option.value}
                                        checked={formData.betaCommitment === option.value}
                                        onChange={(e) => handleInputChange('betaCommitment', e.target.value)}
                                        required
                                    />
                                    <div className="radio-content">
                                        <div className="radio-title">{option.label}</div>
                                        <div className="radio-description">{option.desc}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Weekly Hours */}
                    <div className="form-group">
                        <label className="form-label required">
                            Weekly Time Availability
                        </label>
                        <div className="radio-group">
                            {[
                                { value: '5_plus', label: '5+ Hours Weekly', desc: 'I can dedicate 5 or more hours per week' },
                                { value: '3_4', label: '3-4 Hours Weekly', desc: 'I can dedicate 3-4 hours per week consistently' },
                                { value: 'under_3', label: 'Under 3 Hours', desc: 'I have less than 3 hours available per week' }
                            ].map(option => (
                                <label key={option.value} className="radio-option">
                                    <input 
                                        type="radio" 
                                        name="hoursPerWeek" 
                                        value={option.value}
                                        checked={formData.hoursPerWeek === option.value}
                                        onChange={(e) => handleInputChange('hoursPerWeek', e.target.value)}
                                        required
                                    />
                                    <div className="radio-content">
                                        <div className="radio-title">{option.label}</div>
                                        <div className="radio-description">{option.desc}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Platform Comfort */}
                    <div className="form-group">
                        <label className="form-label required">
                            Platform Comfort Level
                        </label>
                        <div className="radio-group">
                            {[
                                { value: 'yes_comfortable', label: 'Web Platform Expert', desc: 'I\'m comfortable using web-based tools' },
                                { value: 'yes_unsure', label: 'Learning Mode', desc: 'I can use web tools but might need guidance' },
                                { value: 'no', label: 'Prefer Alternatives', desc: 'I prefer email or other non-web methods' }
                            ].map(option => (
                                <label key={option.value} className="radio-option">
                                    <input 
                                        type="radio" 
                                        name="portalUse" 
                                        value={option.value}
                                        checked={formData.portalUse === option.value}
                                        onChange={(e) => handleInputChange('portalUse', e.target.value)}
                                        required
                                    />
                                    <div className="radio-content">
                                        <div className="radio-title">{option.label}</div>
                                        <div className="radio-description">{option.desc}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Interest Statement */}
                    <div className="form-group">
                        <label htmlFor="interestStatement" className="form-label required">
                            Why This Series? (150-250 words)
                        </label>
                        <textarea 
                            id="interestStatement" 
                            className="form-textarea"
                            value={formData.interestStatement}
                            onChange={(e) => handleInputChange('interestStatement', e.target.value)}
                            placeholder="What specifically interests you about the Zangar/Spandam series?"
                            rows={6}
                            required
                        />
                        <div className="word-counter">
                            <span className={wordCounts.interestStatement < 150 || wordCounts.interestStatement > 250 ? 'text-red-500' : 'text-green-500'}>
                                {wordCounts.interestStatement}/250 words
                            </span>
                            {wordCounts.interestStatement < 150 && <span className="text-red-500"> (Minimum 150 required)</span>}
                            {wordCounts.interestStatement > 250 && <span className="text-red-500"> (Exceeds maximum)</span>}
                        </div>
                    </div>

                    {/* Recent Reads */}
                    <div className="form-group">
                        <label htmlFor="recentReads" className="form-label">
                            Recent Relevant Reading
                        </label>
                        <textarea 
                            id="recentReads" 
                            className="form-textarea"
                            value={formData.recentReads}
                            onChange={(e) => handleInputChange('recentReads', e.target.value)}
                            placeholder="List 3-5 books you've read in the last 12 months that relate to epic sci-fi/fantasy..."
                            rows={4}
                        />
                    </div>

                    {/* Reading Devices */}
                    <div className="form-group">
                        <label className="form-label required">
                            Available Reading Devices
                        </label>
                        <div className="checkbox-grid">
                            {[
                                { value: 'desktop', label: 'Desktop/Laptop', desc: 'Windows, Mac, Linux' },
                                { value: 'mobile', label: 'Mobile/Tablet', desc: 'iOS, Android' },
                                { value: 'ereader', label: 'E-reader', desc: 'Kindle, Kobo, etc.' }
                            ].map(option => (
                                <label key={option.value} className="checkbox-option">
                                    <input 
                                        type="checkbox" 
                                        value={option.value}
                                        checked={formData.devices.includes(option.value)}
                                        onChange={(e) => handleDeviceChange(option.value, e.target.checked)}
                                    />
                                    <div className="checkbox-content">
                                        <div className="checkbox-title">{option.label}</div>
                                        <div className="checkbox-description">{option.desc}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                        {formData.devices.length === 0 && (
                            <div className="text-red-500">Please select at least one reading device</div>
                        )}
                    </div>

                    {/* Feedback Philosophy */}
                    <div className="form-group">
                        <label htmlFor="feedbackPhilosophy" className="form-label required">
                            Your Feedback Philosophy
                        </label>
                        <textarea 
                            id="feedbackPhilosophy" 
                            className="form-textarea"
                            value={formData.feedbackPhilosophy}
                            onChange={(e) => handleInputChange('feedbackPhilosophy', e.target.value)}
                            placeholder="How do you approach giving feedback? How do you balance honesty with kindness?"
                            rows={5}
                            required
                        />
                    </div>

                    {/* Communication Style */}
                    <div className="form-group">
                        <label htmlFor="communication" className="form-label required">
                            Communication Approach
                        </label>
                        <textarea 
                            id="communication" 
                            className="form-textarea"
                            value={formData.communication}
                            onChange={(e) => handleInputChange('communication', e.target.value)}
                            placeholder="Describe your communication style. How do you handle check-ins and updates?"
                            rows={4}
                            required
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="form-navigation">
                    <button 
                        type="submit" 
                        className={`btn btn-primary ${!isStage1Valid ? 'disabled' : ''}`}
                        disabled={!isStage1Valid || loading}
                    >
                        {loading ? (
                            <>
                                <div className="spinner" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Zap size={18} />
                                Submit Application
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BetaApplication;