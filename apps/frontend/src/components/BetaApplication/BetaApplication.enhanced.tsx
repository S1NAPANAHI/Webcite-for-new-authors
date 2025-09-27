/**
 * Enhanced Beta Application Form - Drop-in Replacement
 * Maintains all existing functionality with improved UX/UI
 */
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { SupabaseClient, User } from ' @supabase/supabase-js';
import { 
    ChevronLeft, 
    ChevronRight, 
    Clock, 
    Check, 
    AlertCircle, 
    User as UserIcon, 
    Star,
    BookOpen,
    Target,
    Sparkles,
    CheckCircle2,
    Zap,
    Info,
    AlertTriangle,
    Globe,
    Users,
    Rocket
} from 'lucide-react';
import './BetaApplication.enhanced.css';

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

const STEPS = [
    {
        id: 1,
        title: "Personal Info",
        description: "Basic details and contact information",
        icon: UserIcon,
        fields: ['fullName', 'email', 'timeZone', 'country'] as (keyof FormData)[],
        estimatedTime: "2 min"
    },
    {
        id: 2,
        title: "Commitment",
        description: "Time availability and platform comfort",
        icon: Target,
        fields: ['betaCommitment', 'hoursPerWeek', 'portalUse'] as (keyof FormData)[],
        estimatedTime: "3 min"
    },
    {
        id: 3,
        title: "Experience",
        description: "Reading background and devices",
        icon: BookOpen,
        fields: ['recentReads', 'devices'] as (keyof FormData)[],
        estimatedTime: "3 min"
    },
    {
        id: 4,
        title: "Interest & Vision",
        description: "Your motivation and feedback approach",
        icon: Sparkles,
        fields: ['interestStatement', 'feedbackPhilosophy', 'communication'] as (keyof FormData)[],
        estimatedTime: "5 min"
    }
];

const BetaApplicationEnhanced: React.FC<BetaApplicationProps> = ({ supabaseClient, user }) => {
    const [row, setRow] = useState<BetaApplicationRow | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
    
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
    
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    
    const interestWordCount = useMemo(() => {
        return formData.interestStatement.trim().split(/\s+/).filter(word => word.length > 0).length;
    }, [formData.interestStatement]);

    // Load existing application - same logic as original
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
                    if (error && error.code !== 'PGRST116') {
                        setError(error.message);
                    } else {
                        setRow(data as BetaApplicationRow | null);
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
    }, [user?.id, supabaseClient]);

    const handleInputChange = useCallback(<K extends keyof FormData>(
        field: K,
        value: FormData[K]
    ) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    }, [errors]);

    const validateStep = useCallback((stepId: number): boolean => {
        const step = STEPS.find(s => s.id === stepId);
        if (!step) return false;
        
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        
        step.fields.forEach(field => {
            const value = formData[field];
            
            switch (field) {
                case 'fullName':
                case 'email':
                case 'timeZone':
                case 'betaCommitment':
                case 'hoursPerWeek':
                case 'portalUse':
                case 'feedbackPhilosophy':
                case 'communication':
                    if (!value || (typeof value === 'string' && !value.trim())) {
                        newErrors[field] = 'This field is required';
                    }
                    break;
                case 'interestStatement':
                    if (!value || (typeof value === 'string' && !value.trim())) {
                        newErrors[field] = 'This field is required';
                    } else if (interestWordCount < 150) {
                        newErrors[field] = `Please write at least 150 words (currently ${interestWordCount})`;
                    } else if (interestWordCount > 250) {
                        newErrors[field] = `Please keep it under 250 words (currently ${interestWordCount})`;
                    }
                    break;
                case 'devices':
                    if (Array.isArray(value) && value.length === 0) {
                        newErrors[field] = 'Please select at least one device';
                    }
                    break;
            }
        });
        
        setErrors(prev => ({ ...prev, ...newErrors }));
        return Object.keys(newErrors).length === 0;
    }, [formData, interestWordCount]);

    const goToStep = useCallback((stepId: number) => {
        const isAccessible = completedSteps.has(stepId) || stepId === currentStep || 
                           completedSteps.has(stepId - 1) || stepId === 1;
        if (isAccessible) {
            setCurrentStep(stepId);
        }
    }, [currentStep, completedSteps]);

    const goToNextStep = useCallback(() => {
        if (validateStep(currentStep)) {
            setCompletedSteps(prev => new Set([...prev, currentStep]));
            if (currentStep < STEPS.length) {
                setCurrentStep(prev => prev + 1);
            }
        }
    }, [currentStep, validateStep]);

    const goToPreviousStep = useCallback(() => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    }, [currentStep]);

    // Submit handler - same logic as original
    const handleSubmit = useCallback(async () => {
        if (!user?.id) return;
        
        let allValid = true;
        for (let i = 1; i <= STEPS.length; i++) {
            if (!validateStep(i)) {
                allValid = false;
            }
        }
        
        if (!allValid) {
            setError('Please complete all required fields correctly.');
            return;
        }

        setLoading(true);
        setError(null);

        const payload = {
            user_id: user.id,
            application_data: formData,
            status: 'submitted',
        };

        try {
            const { data, error } = row
                ? await supabaseClient
                    .from('beta_applications')
                    .update(payload)
                    .eq('id', row.id)
                    .select()
                    .single()
                : await supabaseClient
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
    }, [formData, row, user?.id, supabaseClient, validateStep]);

    // Loading state
    if (loading && !row) {
        return (
            <div className="enhanced-loading-state">
                <div className="loading-content">
                    <div className="loading-spinner" />
                    <h3>Loading your application...</h3>
                    <p>Please wait while we prepare your beta reader application.</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error && !row) {
        return (
            <div className="enhanced-error-state">
                <AlertCircle size={48} />
                <h2>Application Error</h2>
                <p>{error}</p>
                <button 
                    className="retry-button"
                    onClick={() => {
                        setError(null);
                        setLoading(false);
                    }}
                >
                    Try Again
                </button>
            </div>
        );
    }

    // Success state
    if (row) {
        return (
            <div className="enhanced-success-state">
                <div className="success-content">
                    <div className="success-icon">
                        <CheckCircle2 size={40} />
                        <div className="sparkle-icon">
                            <Sparkles size={16} />
                        </div>
                    </div>
                    
                    <h1>Application Successfully Submitted!</h1>
                    <p>Thank you for applying to the Zangar/Spandam Beta Reader Program.</p>
                    
                    <div className="status-card">
                        <h3><Info size={20} />Application Details</h3>
                        <div className="status-grid">
                            <div>
                                <span className="label">Submitted:</span>
                                <div className="value">
                                    {new Date(row.submitted_at || row.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                            <div>
                                <span className="label">Status:</span>
                                <div className="status-badge">
                                    <Clock size={14} />
                                    Under Review
                                </div>
                            </div>
                        </div>
                        <div className="status-footer">
                            <span className="label">Expected Response:</span>
                            <div className="value">Within 1-2 weeks</div>
                        </div>
                    </div>
                    
                    <div className="success-actions">
                        <button onClick={() => setRow(null)} className="secondary-button">
                            Edit Application
                        </button>
                        <button className="primary-button">
                            <BookOpen size={16} />
                            View Beta Handbook
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentStepConfig = STEPS.find(s => s.id === currentStep)!;
    const isLastStep = currentStep === STEPS.length;
    const canProceed = validateStep(currentStep);

    return (
        <div className="enhanced-beta-app">
            {/* Header */}
            <div className="app-header">
                <div className="header-badge">
                    <Star size={16} />
                    Beta Reader Program
                </div>
                <h1>Zangar/Spandam Beta Application</h1>
                <p>Join our exclusive community of beta readers and help shape the future of epic sci-fi fantasy</p>
            </div>

            {/* Progress Stepper */}
            <div className="progress-stepper">
                <div className="progress-line" />
                <div 
                    className="progress-fill"
                    style={{ 
                        width: `${((Math.max(...Array.from(completedSteps), currentStep - 1)) / (STEPS.length - 1)) * 100}%` 
                    }}
                />
                
                <div className="steps-container">
                    {STEPS.map((step) => {
                        const isCompleted = completedSteps.has(step.id);
                        const isCurrent = currentStep === step.id;
                        const isAccessible = isCompleted || isCurrent || completedSteps.has(step.id - 1) || step.id === 1;
                        const IconComponent = step.icon;
                        
                        return (
                            <button
                                key={step.id}
                                onClick={() => isAccessible && goToStep(step.id)}
                                className={`step-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${!isAccessible ? 'disabled' : ''}`}
                                disabled={!isAccessible}
                            >
                                <div className="step-circle">
                                    {isCompleted ? <Check size={20} /> : <IconComponent size={20} />}
                                </div>
                                <div className="step-content">
                                    <div className="step-title">{step.title}</div>
                                    <div className="step-time">{step.estimatedTime}</div>
                                </div>
                                {isCurrent && <div className="current-indicator" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Form Card */}
            <div className="form-card">
                <div className="form-header">
                    <div className="header-icon">
                        <currentStepConfig.icon size={24} />
                    </div>
                    <div>
                        <h2>{currentStepConfig.title}</h2>
                        <p>{currentStepConfig.description}</p>
                    </div>
                </div>

                <div className="form-content">
                    {/* Step 1: Personal Info */}
                    {currentStep === 1 && (
                        <div className="form-step">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="fullName">
                                        Full Name <span className="required">*</span>
                                    </label>
                                    <input
                                        id="fullName"
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                                        placeholder="Enter your full name"
                                        className={errors.fullName ? 'error' : ''}
                                    />
                                    {errors.fullName && (
                                        <div className="error-message">
                                            <AlertTriangle size={12} />
                                            {errors.fullName}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">
                                        Email Address <span className="required">*</span>
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        placeholder="your.email @example.com"
                                        className={errors.email ? 'error' : ''}
                                    />
                                    {errors.email && (
                                        <div className="error-message">
                                            <AlertTriangle size={12} />
                                            {errors.email}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="timeZone">
                                        Time Zone <span className="required">*</span>
                                    </label>
                                    <select
                                        id="timeZone"
                                        value={formData.timeZone}
                                        onChange={(e) => handleInputChange('timeZone', e.target.value)}
                                        className={errors.timeZone ? 'error' : ''}
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
                                    {errors.timeZone && (
                                        <div className="error-message">
                                            <AlertTriangle size={12} />
                                            {errors.timeZone}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="country">Country</label>
                                    <input
                                        id="country"
                                        type="text"
                                        value={formData.country}
                                        onChange={(e) => handleInputChange('country', e.target.value)}
                                        placeholder="Your country of residence"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Commitment */}
                    {currentStep === 2 && (
                        <div className="form-step">
                            <div className="form-group">
                                <label>
                                    Beta Window Commitment Level <span className="required">*</span>
                                </label>
                                <div className="radio-group">
                                    {[
                                        { 
                                            value: 'weekly_deadlines', 
                                            label: 'Weekly Deadlines', 
                                            description: 'I can commit to consistent weekly deadlines and structured feedback schedules',
                                            recommended: true
                                        },
                                        { 
                                            value: 'commit_with_extensions', 
                                            label: 'Flexible Commitment', 
                                            description: 'I can usually meet deadlines but may need occasional extensions for life events'
                                        },
                                        { 
                                            value: 'prefer_flexible', 
                                            label: 'Flexible Schedule', 
                                            description: 'I prefer flexible deadlines but will complete all assigned work'
                                        },
                                        { 
                                            value: 'no_commitment', 
                                            label: 'No Deadline Pressure', 
                                            description: 'I cannot commit to any specific deadlines due to unpredictable schedule',
                                            warning: true
                                        }
                                    ].map(option => (
                                        <label key={option.value} className={`radio-option ${option.warning ? 'warning' : ''} ${option.recommended ? 'recommended' : ''}`}>
                                            <input
                                                type="radio"
                                                name="betaCommitment"
                                                value={option.value}
                                                checked={formData.betaCommitment === option.value}
                                                onChange={(e) => handleInputChange('betaCommitment', e.target.value)}
                                            />
                                            <div className="radio-content">
                                                <div className="radio-header">
                                                    <span className="radio-title">{option.label}</span>
                                                    {option.recommended && <span className="badge recommended">Recommended</span>}
                                                    {option.warning && <span className="badge warning">Limited Opportunities</span>}
                                                </div>
                                                <p className="radio-description">{option.description}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {errors.betaCommitment && (
                                    <div className="error-message">
                                        <AlertTriangle size={12} />
                                        {errors.betaCommitment}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>
                                    Weekly Time Availability <span className="required">*</span>
                                </label>
                                <div className="radio-group">
                                    {[
                                        { 
                                            value: '5_plus', 
                                            label: '5+ Hours Weekly', 
                                            description: 'I can dedicate 5 or more hours per week to reading and feedback',
                                            recommended: true
                                        },
                                        { 
                                            value: '3_4', 
                                            label: '3-4 Hours Weekly', 
                                            description: 'I can consistently dedicate 3-4 hours per week to the program'
                                        },
                                        { 
                                            value: 'under_3', 
                                            label: 'Under 3 Hours', 
                                            description: 'I have less than 3 hours available per week for beta reading',
                                            warning: true
                                        }
                                    ].map(option => (
                                        <label key={option.value} className={`radio-option ${option.warning ? 'warning' : ''} ${option.recommended ? 'recommended' : ''}`}>
                                            <input
                                                type="radio"
                                                name="hoursPerWeek"
                                                value={option.value}
                                                checked={formData.hoursPerWeek === option.value}
                                                onChange={(e) => handleInputChange('hoursPerWeek', e.target.value)}
                                            />
                                            <div className="radio-content">
                                                <div className="radio-header">
                                                    <span className="radio-title">{option.label}</span>
                                                    {option.recommended && <span className="badge recommended">Recommended</span>}
                                                    {option.warning && <span className="badge warning">Limited Opportunities</span>}
                                                </div>
                                                <p className="radio-description">{option.description}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {errors.hoursPerWeek && (
                                    <div className="error-message">
                                        <AlertTriangle size={12} />
                                        {errors.hoursPerWeek}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>
                                    Platform Comfort Level <span className="required">*</span>
                                </label>
                                <div className="radio-group">
                                    {[
                                        { 
                                            value: 'yes_comfortable', 
                                            label: 'Web Platform Expert', 
                                            description: "I'm very comfortable with web-based tools and online platforms",
                                            recommended: true
                                        },
                                        { 
                                            value: 'yes_unsure', 
                                            label: 'Learning Mode', 
                                            description: 'I can use web tools but might need some guidance initially'
                                        },
                                        { 
                                            value: 'no', 
                                            label: 'Prefer Alternatives', 
                                            description: 'I strongly prefer email, documents, or other non-web methods',
                                            warning: true
                                        }
                                    ].map(option => (
                                        <label key={option.value} className={`radio-option ${option.warning ? 'warning' : ''} ${option.recommended ? 'recommended' : ''}`}>
                                            <input
                                                type="radio"
                                                name="portalUse"
                                                value={option.value}
                                                checked={formData.portalUse === option.value}
                                                onChange={(e) => handleInputChange('portalUse', e.target.value)}
                                            />
                                            <div className="radio-content">
                                                <div className="radio-header">
                                                    <span className="radio-title">{option.label}</span>
                                                    {option.recommended && <span className="badge recommended">Recommended</span>}
                                                    {option.warning && <span className="badge warning">Limited Opportunities</span>}
                                                </div>
                                                <p className="radio-description">{option.description}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {errors.portalUse && (
                                    <div className="error-message">
                                        <AlertTriangle size={12} />
                                        {errors.portalUse}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Experience */}
                    {currentStep === 3 && (
                        <div className="form-step">
                            <div className="form-group">
                                <label htmlFor="recentReads">Recent Relevant Reading</label>
                                <textarea
                                    id="recentReads"
                                    value={formData.recentReads}
                                    onChange={(e) => handleInputChange('recentReads', e.target.value)}
                                    placeholder="List 3-5 books you've read in the last 12 months that relate to epic sci-fi/fantasy. Include titles, authors, and brief thoughts on what you liked or didn't like..."
                                    rows={5}
                                />
                                <p className="help-text">Help us understand your current reading interests and experience with the genre</p>
                            </div>

                            <div className="form-group">
                                <label>
                                    Available Reading Devices <span className="required">*</span>
                                </label>
                                <div className="checkbox-group">
                                    {[
                                        { 
                                            value: 'desktop', 
                                            label: 'Desktop/Laptop', 
                                            description: 'Windows, Mac, Linux computers',
                                            icon: Globe
                                        },
                                        { 
                                            value: 'mobile', 
                                            label: 'Mobile/Tablet', 
                                            description: 'iOS, Android phones and tablets',
                                            icon: Users
                                        },
                                        { 
                                            value: 'ereader', 
                                            label: 'E-reader Device', 
                                            description: 'Kindle, Kobo, or other e-ink devices',
                                            icon: BookOpen
                                        }
                                    ].map(option => {
                                        const IconComponent = option.icon;
                                        const isSelected = formData.devices.includes(option.value);
                                        
                                        return (
                                            <label key={option.value} className={`checkbox-option ${isSelected ? 'selected' : ''}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={(e) => {
                                                        const newDevices = e.target.checked
                                                            ? [...formData.devices, option.value]
                                                            : formData.devices.filter(d => d !== option.value);
                                                        handleInputChange('devices', newDevices);
                                                    }}
                                                />
                                                <div className="checkbox-content">
                                                    <div className="checkbox-icon">
                                                        <IconComponent size={16} />
                                                    </div>
                                                    <div>
                                                        <div className="checkbox-title">{option.label}</div>
                                                        <div className="checkbox-description">{option.description}</div>
                                                    </div>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                                {errors.devices && (
                                    <div className="error-message">
                                        <AlertTriangle size={12} />
                                        {errors.devices}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Interest & Vision */}
                    {currentStep === 4 && (
                        <div className="form-step">
                            <div className="form-group">
                                <label htmlFor="interestStatement">
                                    Why This Series? (150-250 words) <span className="required">*</span>
                                </label>
                                <textarea
                                    id="interestStatement"
                                    value={formData.interestStatement}
                                    onChange={(e) => handleInputChange('interestStatement', e.target.value)}
                                    placeholder="What specifically interests you about the Zangar/Spandam series? What aspects of epic sci-fi/fantasy appeal to you most? What are you hoping to experience and contribute as a beta reader?"
                                    rows={6}
                                    className={errors.interestStatement ? 'error' : ''}
                                />
                                <div className={`word-counter ${
                                    interestWordCount >= 150 && interestWordCount <= 250 ? 'good' : 
                                    interestWordCount < 150 ? 'insufficient' : 'exceeded'
                                }`}>
                                    <span className="count">{interestWordCount}</span>
                                    <span className="separator">/</span>
                                    <span className="limit">250</span>
                                    <span className="label">words</span>
                                    {interestWordCount < 150 && <span className="note">({150 - interestWordCount} more needed)</span>}
                                    {interestWordCount > 250 && <span className="note">({interestWordCount - 250} over limit)</span>}
                                </div>
                                {errors.interestStatement && (
                                    <div className="error-message">
                                        <AlertTriangle size={12} />
                                        {errors.interestStatement}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="feedbackPhilosophy">
                                    Your Feedback Philosophy <span className="required">*</span>
                                </label>
                                <textarea
                                    id="feedbackPhilosophy"
                                    value={formData.feedbackPhilosophy}
                                    onChange={(e) => handleInputChange('feedbackPhilosophy', e.target.value)}
                                    placeholder="How do you approach giving feedback on creative work? How do you balance honesty with kindness? What's your experience with constructive criticism?"
                                    rows={4}
                                    className={errors.feedbackPhilosophy ? 'error' : ''}
                                />
                                {errors.feedbackPhilosophy && (
                                    <div className="error-message">
                                        <AlertTriangle size={12} />
                                        {errors.feedbackPhilosophy}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="communication">
                                    Communication Approach <span className="required">*</span>
                                </label>
                                <textarea
                                    id="communication"
                                    value={formData.communication}
                                    onChange={(e) => handleInputChange('communication', e.target.value)}
                                    placeholder="Describe your communication style. How do you handle check-ins and updates? Do you prefer detailed written feedback, quick notes, or scheduled discussions?"
                                    rows={4}
                                    className={errors.communication ? 'error' : ''}
                                />
                                {errors.communication && (
                                    <div className="error-message">
                                        <AlertTriangle size={12} />
                                        {errors.communication}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="form-footer">
                    <div className="step-info">
                        <span>Step {currentStep} of {STEPS.length}</span>
                        <span>•</span>
                        <span>{currentStepConfig.estimatedTime}</span>
                    </div>

                    <div className="navigation-buttons">
                        {currentStep > 1 && (
                            <button
                                onClick={goToPreviousStep}
                                className="nav-button secondary"
                            >
                                <ChevronLeft size={16} />
                                Previous
                            </button>
                        )}

                        {!isLastStep ? (
                            <button
                                onClick={goToNextStep}
                                disabled={!canProceed}
                                className={`nav-button primary ${!canProceed ? 'disabled' : ''}`}
                            >
                                Next
                                <ChevronRight size={16} />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !canProceed}
                                className={`nav-button primary ${loading || !canProceed ? 'disabled' : ''}`}
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Rocket size={16} />
                                        Submit Application
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="error-banner">
                    <AlertTriangle size={20} />
                    <div>
                        <h4>Application Error</h4>
                        <p>{error}</p>
                    </div>
                    <button onClick={() => setError(null)}>×</button>
                </div>
            )}
        </div>
    );
};

export default BetaApplicationEnhanced;
