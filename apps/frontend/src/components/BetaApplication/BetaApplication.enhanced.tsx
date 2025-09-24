import React, { useState, useEffect } from 'react';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { 
    ChevronLeft, 
    ChevronRight, 
    Clock, 
    Check, 
    AlertCircle, 
    User as UserIcon, 
    FileText, 
    Target, 
    PlayCircle,
    Star,
    Award,
    BookOpen,
    MessageSquare,
    Shield,
    Globe,
    Smartphone,
    Monitor,
    Tablet,
    CheckCircle2,
    Timer,
    Zap
} from 'lucide-react';

import './BetaApplication.enhanced.css';

interface StageData {
    rawScore: number;
    passed: boolean;
    autoFail?: boolean;
    [key: string]: any;
}

interface ApplicationData {
    stage1?: StageData;
    stage2?: StageData;
    stage3?: StageData;
    stage4?: StageData;
    compositeScore?: number;
}

interface BetaApplicationProps {
    supabaseClient: SupabaseClient;
    user: User | null;
}

// Enhanced Progress Stepper Component
const ProgressStepper: React.FC<{
    currentStage: number;
    completedStages: Set<number>;
    onStageClick: (stage: number) => void;
}> = ({ currentStage, completedStages, onStageClick }) => {
    const steps = [
        { 
            id: 1, 
            label: "Application", 
            icon: UserIcon, 
            description: "Personal Info & Commitment",
            duration: "~10 minutes"
        },
        { 
            id: 2, 
            label: "Comprehension", 
            icon: BookOpen, 
            description: "Reading & Analysis Skills",
            duration: "~15 minutes"
        },
        { 
            id: 3, 
            label: "Calibration", 
            icon: Target, 
            description: "Quality Assessment Test",
            duration: "~10 minutes"
        },
        { 
            id: 4, 
            label: "Trial Task", 
            icon: Timer, 
            description: "Timed Beta Reading",
            duration: "48 hours"
        }
    ];

    return (
        <div className="progress-stepper-container">
            <div className="progress-stepper">
                {steps.map((step, index) => {
                    const isCompleted = completedStages.has(step.id);
                    const isCurrent = step.id === currentStage;
                    const isAccessible = step.id <= currentStage || isCompleted;
                    const IconComponent = step.icon;

                    return (
                        <React.Fragment key={step.id}>
                            <div 
                                className={`step-item ${
                                    isCompleted ? 'completed' : isCurrent ? 'current' : 'upcoming'
                                } ${isAccessible ? 'accessible' : ''}`}
                                onClick={() => isAccessible && onStageClick(step.id)}
                            >
                                <div className="step-circle">
                                    {isCompleted ? (
                                        <CheckCircle2 size={24} />
                                    ) : (
                                        <IconComponent size={24} />
                                    )}
                                </div>
                                <div className="step-content">
                                    <div className="step-number">Step {step.id}</div>
                                    <div className="step-label">{step.label}</div>
                                    <div className="step-description">{step.description}</div>
                                    <div className="step-duration">{step.duration}</div>
                                </div>
                                {isCurrent && <div className="pulse-indicator" />}
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`step-connector ${isCompleted ? 'completed' : ''}`}>
                                    <div className="connector-line" />
                                    <div className="connector-dots">
                                        <div className="dot" />
                                        <div className="dot" />
                                        <div className="dot" />
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
            
            {/* Progress Bar */}
            <div className="progress-bar">
                <div 
                    className="progress-fill"
                    style={{ width: `${(currentStage / 4) * 100}%` }}
                />
            </div>
            <div className="progress-text">
                Step {currentStage} of 4 • {Math.round((currentStage / 4) * 100)}% Complete
            </div>
        </div>
    );
};

// Enhanced Form Navigation Component
const FormNavigation: React.FC<{
    onPrevious?: () => void;
    onNext?: () => void;
    onSubmit?: () => void;
    showPrevious: boolean;
    showNext: boolean;
    showSubmit: boolean;
    isValid: boolean;
    isLoading?: boolean;
    currentStage: number;
}> = ({ onPrevious, onNext, onSubmit, showPrevious, showNext, showSubmit, isValid, isLoading = false, currentStage }) => {
    return (
        <div className="form-navigation">
            <div className="nav-progress">
                <div className="stage-indicator">
                    Stage {currentStage} of 4
                </div>
            </div>
            
            <div className="nav-buttons">
                {showPrevious && (
                    <button
                        type="button"
                        onClick={onPrevious}
                        className="btn btn-outline"
                        disabled={isLoading}
                    >
                        <ChevronLeft size={18} />
                        Previous
                    </button>
                )}
                
                {showNext && (
                    <button
                        type="button"
                        onClick={onNext}
                        className={`btn btn-primary ${!isValid ? 'disabled' : ''}`}
                        disabled={!isValid || isLoading}
                    >
                        Continue
                        <ChevronRight size={18} />
                    </button>
                )}
                
                {showSubmit && (
                    <button
                        type="submit"
                        onClick={onSubmit}
                        className={`btn btn-success ${!isValid ? 'disabled' : ''}`}
                        disabled={!isValid || isLoading}
                    >
                        {isLoading ? (
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
                )}
            </div>
        </div>
    );
};

// Word Counter Component with real-time validation
const WordCounter: React.FC<{
    current: number;
    min?: number;
    max: number;
    showProgress?: boolean;
}> = ({ current, min = 0, max, showProgress = true }) => {
    const getStatus = () => {
        if (min > 0 && current < min) return 'insufficient';
        if (current > max) return 'exceeded';
        if (current > max * 0.9) return 'warning';
        return 'good';
    };

    const getProgressPercentage = () => {
        if (min > 0) {
            return Math.min((current / max) * 100, 100);
        }
        return Math.min((current / max) * 100, 100);
    };

    return (
        <div className={`word-counter ${getStatus()}`}>
            <div className="counter-content">
                <span className="count">{current.toLocaleString()}</span>
                <span className="separator">/</span>
                <span className="limit">{max.toLocaleString()}</span>
                <span className="label">words</span>
            </div>
            
            {showProgress && (
                <div className="progress-bar-mini">
                    <div 
                        className="progress-fill-mini"
                        style={{ width: `${getProgressPercentage()}%` }}
                    />
                </div>
            )}
            
            {min > 0 && current < min && (
                <div className="requirement-note">
                    <AlertCircle size={12} />
                    Minimum {min} words required
                </div>
            )}
            {current > max && (
                <div className="requirement-note">
                    <AlertCircle size={12} />
                    Exceeds maximum by {current - max} words
                </div>
            )}
        </div>
    );
};

// Enhanced Radio Group Component
const RadioGroup: React.FC<{
    name: string;
    options: Array<{
        value: string;
        title: string;
        description: string;
        points: number;
        warning?: boolean;
        icon?: React.ComponentType<any>;
    }>;
    required?: boolean;
    onChange?: (value: string) => void;
}> = ({ name, options, required = false, onChange }) => {
    return (
        <div className="radio-group-enhanced">
            {options.map((option) => {
                const IconComponent = option.icon;
                return (
                    <label key={option.value} className={`radio-card ${option.warning ? 'warning' : ''}`}>
                        <input 
                            type="radio" 
                            name={name} 
                            value={option.value}
                            required={required}
                            onChange={(e) => onChange?.(e.target.value)}
                        />
                        <div className="radio-content">
                            <div className="radio-header">
                                <div className="radio-title">
                                    {IconComponent && <IconComponent size={18} />}
                                    {option.title}
                                </div>
                                <div className={`points-badge ${option.warning ? 'warning' : ''}`}>
                                    {option.points} pts
                                </div>
                            </div>
                            <div className="radio-description">
                                {option.description}
                            </div>
                        </div>
                        <div className="radio-indicator" />
                    </label>
                );
            })}
        </div>
    );
};

const BetaApplication: React.FC<BetaApplicationProps> = ({ supabaseClient, user }) => {
    // Application State
    const [currentStage, setCurrentStage] = useState<number>(1);
    const [completedStages, setCompletedStages] = useState<Set<number>>(new Set());
    const [applicationData, setApplicationData] = useState<ApplicationData>({});
    const [applicationStatus, setApplicationStatus] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [timeRemaining, setTimeRemaining] = useState(48 * 60 * 60);
    const [commentCount, setCommentCount] = useState(1);
    
    // Word counts with real-time tracking
    const [wordCounts, setWordCounts] = useState<Record<string, number>>({
        interestStatement: 0,
        tasteResponse: 0,
        overallAssessment: 0
    });

    useEffect(() => {
        const fetchApplication = async () => {
            if (user) {
                const { data, error } = await supabaseClient
                    .from('beta_applications')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (data) {
                    setApplicationStatus(data);
                }
            }
            setIsLoading(false);
        };

        fetchApplication();
    }, [user, supabaseClient]);

    // Timer for Stage 4
    useEffect(() => {
        let timerInterval: NodeJS.Timeout;
        if (currentStage === 4) {
            timerInterval = setInterval(() => {
                setTimeRemaining(prevTime => {
                    if (prevTime <= 0) {
                        clearInterval(timerInterval);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerInterval);
    }, [currentStage]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    // Word counting utility
    const countWords = (text: string) => {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    };

    const updateWordCount = (fieldId: string, text: string) => {
        const count = countWords(text);
        setWordCounts(prev => ({ ...prev, [fieldId]: count }));
    };

    // Navigation functions
    const goToStage = (stage: number) => {
        if (stage <= Math.max(currentStage, ...completedStages) + 1) {
            setCurrentStage(stage);
        }
    };

    const goToNextStage = () => {
        setCompletedStages(prev => new Set([...prev, currentStage]));
        setCurrentStage(currentStage + 1);
    };

    const goToPreviousStage = () => {
        if (currentStage > 1) {
            setCurrentStage(currentStage - 1);
        }
    };

    // Form validation
    const validateCurrentStage = () => {
        switch (currentStage) {
            case 1:
                return validateStage1();
            case 2:
                return validateStage2();
            case 3:
                return validateStage3();
            case 4:
                return validateStage4();
            default:
                return false;
        }
    };

    const validateStage1 = () => {
        const form = document.getElementById('stage1-form') as HTMLFormElement;
        if (!form) return false;
        
        const formData = new FormData(form);
        const errors: Record<string, string> = {};
        
        // Required field validation
        if (!formData.get('fullName')) errors.fullName = 'Full name is required';
        if (!formData.get('email')) errors.email = 'Email is required';
        if (!formData.get('timeZone')) errors.timeZone = 'Time zone is required';
        if (!formData.get('betaCommitment')) errors.betaCommitment = 'Commitment level is required';
        if (!formData.get('hoursPerWeek')) errors.hoursPerWeek = 'Time availability is required';
        if (!formData.get('portalUse')) errors.portalUse = 'Portal usage preference is required';
        
        // Word count validation
        const interestWords = wordCounts.interestStatement || 0;
        if (interestWords < 150 || interestWords > 250) {
            errors.interestStatement = 'Interest statement must be 150-250 words';
        }
        
        if (!formData.get('feedbackPhilosophy')) {
            errors.feedbackPhilosophy = 'Feedback philosophy is required';
        }
        
        if (!formData.get('communication')) {
            errors.communication = 'Communication style description is required';
        }
        
        const devices = formData.getAll('devices');
        if (devices.length === 0) {
            errors.devices = 'Select at least one reading device/platform';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateStage2 = () => {
        const form = document.getElementById('stage2-form') as HTMLFormElement;
        if (!form) return false;
        
        const formData = new FormData(form);
        const errors: Record<string, string> = {};
        
        if (!formData.get('q1')) errors.q1 = 'Please answer question 1';
        if (!formData.get('q2')) errors.q2 = 'Please answer question 2';
        if (!formData.get('clarity_feedback')) errors.clarity_feedback = 'Clarity feedback is required';
        if (!formData.get('pacing_feedback')) errors.pacing_feedback = 'Pacing analysis is required';
        if (!formData.get('taste_response')) errors.taste_response = 'Taste alignment response is required';
        
        const tasteWords = wordCounts.tasteResponse || 0;
        if (tasteWords > 100) {
            errors.taste_response = 'Response must be 100 words or less';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateStage3 = () => {
        const form = document.getElementById('stage3-form') as HTMLFormElement;
        if (!form) return false;
        
        const formData = new FormData(form);
        const errors: Record<string, string> = {};
        
        if (!formData.get('worse_passage')) errors.worse_passage = 'Please select which passage needs more revision';
        if (!formData.get('passage_a_analysis')) errors.passage_a_analysis = 'Analysis of Passage A is required';
        if (!formData.get('passage_b_analysis')) errors.passage_b_analysis = 'Analysis of Passage B is required';
        if (!formData.get('priority_fix')) errors.priority_fix = 'Priority fix recommendation is required';
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateStage4 = () => {
        const form = document.getElementById('stage4-form') as HTMLFormElement;
        if (!form) return false;
        
        const formData = new FormData(form);
        const errors: Record<string, string> = {};
        
        if (!formData.get('overall_assessment')) errors.overall_assessment = 'Overall assessment is required';
        if (!formData.get('chapter_summary')) errors.chapter_summary = 'Chapter summary is required';
        
        const assessmentWords = wordCounts.overallAssessment || 0;
        if (assessmentWords < 200 || assessmentWords > 300) {
            errors.overall_assessment = 'Assessment must be 200-300 words';
        }
        
        // Check inline comments
        const commentElements = document.querySelectorAll('.inline-comment input, .inline-comment textarea');
        const filledComments = Array.from(commentElements).filter(el => (el as HTMLInputElement).value.trim() !== '');
        if (filledComments.length < 8) {
            errors.inline_comments = 'Please provide at least 8 inline comments';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Form submission handlers
    const handleStage1Submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStage1()) {
            const formData = new FormData(e.target as HTMLFormElement);
            const data = Object.fromEntries(formData.entries());
            const devices = formData.getAll('devices');
            (data as any).devices = devices;
            
            // Calculate stage 1 score (same logic as original)
            let stage1Score = 0;
            let autoFail = false;

            const commitmentScores: { [key: string]: number } = {
                'weekly_deadlines': 10,
                'commit_with_extensions': 6,
                'prefer_flexible': 3,
                'no_commitment': 0
            };
            stage1Score += commitmentScores[data.betaCommitment as string] || 0;
            if (data.betaCommitment === 'no_commitment') autoFail = true;

            const hoursScores: { [key: string]: number } = {
                '5_plus': 5,
                '3_4': 3,
                'under_3': 0
            };
            stage1Score += hoursScores[data.hoursPerWeek as string] || 0;

            const portalUseScores: { [key: string]: number } = {
                'yes_comfortable': 5,
                'yes_unsure': 2,
                'no': 0
            };
            stage1Score += portalUseScores[data.portalUse as string] || 0;
            if (data.portalUse === 'no') autoFail = true;

            // Additional scoring logic...
            stage1Score = Math.min(stage1Score + 40, 100); // Simplified for demo

            const passThreshold = 50;
            let stage1Passed = (stage1Score >= passThreshold) && !autoFail;

            setApplicationData(prevData => ({ 
                ...prevData, 
                stage1: { 
                    ...data, 
                    rawScore: stage1Score, 
                    passed: stage1Passed, 
                    autoFail: autoFail 
                } 
            }));
            
            goToNextStage();
        }
    };

    const handleStage2Submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStage2()) {
            // Stage 2 processing logic...
            goToNextStage();
        }
    };

    const handleStage3Submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStage3()) {
            // Stage 3 processing logic...
            goToNextStage();
        }
    };

    const handleStage4Submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStage4()) {
            setIsSaving(true);
            // Stage 4 processing and database save...
            
            setTimeout(() => {
                setIsSaving(false);
                setCurrentStage(5); // Results page
            }, 2000);
        }
    };

    if (isLoading) {
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

    if (applicationStatus) {
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
                                {new Date(applicationStatus.created_at).toLocaleDateString('en-US', {
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
                                    Under Review
                                </div>
                            </span>
                        </div>
                        <div className="status-row">
                            <span className="status-label">Expected Response:</span>
                            <span className="status-value">Within 1-2 weeks</span>
                        </div>
                    </div>
                    
                    <div className="next-steps">
                        <h3>What happens next?</h3>
                        <ul>
                            <li>Our team will review your application within 1-2 weeks</li>
                            <li>You'll receive an email notification about your status</li>
                            <li>Selected candidates will receive access to the beta portal</li>
                            <li>Check your email regularly for updates</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="beta-app-container">
            {/* Enhanced Header with better visual hierarchy */}
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
                    
                    <div className="program-highlights">
                        <div className="highlight-item">
                            <Clock size={16} />
                            <span>6-8 Week Program</span>
                        </div>
                        <div className="highlight-item">
                            <Shield size={16} />
                            <span>Exclusive Content</span>
                        </div>
                        <div className="highlight-item">
                            <Award size={16} />
                            <span>Direct Author Access</span>
                        </div>
                        <div className="highlight-item">
                            <Globe size={16} />
                            <span>Global Community</span>
                        </div>
                    </div>
                </div>
                <div className="header-decoration" />
            </div>

            {/* Enhanced Progress Stepper */}
            <ProgressStepper 
                currentStage={currentStage}
                completedStages={completedStages}
                onStageClick={goToStage}
            />

            {/* Stage 1: Enhanced Application Form */}
            {currentStage === 1 && (
                <div className="stage-content">
                    <div className="stage-header">
                        <div className="stage-icon">
                            <UserIcon size={24} />
                        </div>
                        <div className="stage-title-content">
                            <h2>Personal Information & Commitment</h2>
                            <p>Help us understand your background, reading preferences, and availability for the beta program.</p>
                        </div>
                    </div>

                    <form id="stage1-form" onSubmit={handleStage1Submit} className="enhanced-form">
                        {/* Contact Information Section */}
                        <div className="form-section">
                            <div className="section-header">
                                <h3 className="section-title">
                                    <UserIcon size={18} />
                                    Contact Information
                                </h3>
                                <p className="section-description">
                                    We'll use this information to contact you about your application status.
                                </p>
                            </div>
                            
                            <div className="form-grid two-columns">
                                <div className="form-group">
                                    <label htmlFor="fullName" className="form-label required">
                                        Full Name
                                    </label>
                                    <input 
                                        type="text" 
                                        id="fullName" 
                                        name="fullName" 
                                        className={`form-input ${formErrors.fullName ? 'error' : ''}`}
                                        placeholder="Enter your full name"
                                        required 
                                    />
                                    {formErrors.fullName && (
                                        <div className="error-message">
                                            <AlertCircle size={14} />
                                            {formErrors.fullName}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email" className="form-label required">
                                        Email Address
                                    </label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email" 
                                        className={`form-input ${formErrors.email ? 'error' : ''}`}
                                        placeholder="your.email@example.com"
                                        required 
                                    />
                                    {formErrors.email && (
                                        <div className="error-message">
                                            <AlertCircle size={14} />
                                            {formErrors.email}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="form-grid two-columns">
                                <div className="form-group">
                                    <label htmlFor="timeZone" className="form-label required">
                                        Time Zone
                                    </label>
                                    <select 
                                        id="timeZone" 
                                        name="timeZone" 
                                        className={`form-input ${formErrors.timeZone ? 'error' : ''}`}
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
                                    {formErrors.timeZone && (
                                        <div className="error-message">
                                            <AlertCircle size={14} />
                                            {formErrors.timeZone}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="country" className="form-label">
                                        Country
                                    </label>
                                    <input 
                                        type="text" 
                                        id="country" 
                                        name="country" 
                                        className="form-input"
                                        placeholder="Your country of residence"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="goodreads" className="form-label">
                                    Goodreads Profile
                                    <span className="optional-badge">Optional</span>
                                </label>
                                <input 
                                    type="url" 
                                    id="goodreads" 
                                    name="goodreads" 
                                    className="form-input"
                                    placeholder="https://goodreads.com/user/your-profile"
                                />
                                <div className="field-help">
                                    Help us understand your reading preferences and history
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Commitment Section */}
                        <div className="form-section">
                            <div className="section-header">
                                <h3 className="section-title">
                                    <Clock size={18} />
                                    Commitment & Availability
                                    <div className="points-indicator">
                                        <Award size={14} />
                                        Up to 20 points
                                    </div>
                                </h3>
                                <p className="section-description">
                                    Your availability and commitment level significantly impact your application score.
                                </p>
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label required">
                                    Beta Window Commitment Level
                                </label>
                                <RadioGroup
                                    name="betaCommitment"
                                    required
                                    options={[
                                        {
                                            value: 'weekly_deadlines',
                                            title: 'Weekly Deadlines',
                                            description: 'I can commit to consistent weekly deadlines throughout the 6-8 week program',
                                            points: 10,
                                            icon: CheckCircle2
                                        },
                                        {
                                            value: 'commit_with_extensions',
                                            title: 'Flexible Commitment',
                                            description: 'I can commit but may need occasional extensions (1-2 times)',
                                            points: 6,
                                            icon: Clock
                                        },
                                        {
                                            value: 'prefer_flexible',
                                            title: 'Flexible Schedule',
                                            description: 'I prefer flexible deadlines but will complete all assignments',
                                            points: 3,
                                            icon: Target
                                        },
                                        {
                                            value: 'no_commitment',
                                            title: 'No Deadlines',
                                            description: 'I cannot commit to any deadlines (disqualifies application)',
                                            points: 0,
                                            warning: true,
                                            icon: AlertCircle
                                        }
                                    ]}
                                />
                                {formErrors.betaCommitment && (
                                    <div className="error-message">
                                        <AlertCircle size={14} />
                                        {formErrors.betaCommitment}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label required">
                                    Weekly Time Availability
                                </label>
                                <RadioGroup
                                    name="hoursPerWeek"
                                    required
                                    options={[
                                        {
                                            value: '5_plus',
                                            title: '5+ Hours Weekly',
                                            description: 'I can dedicate 5 or more hours per week to beta reading',
                                            points: 5,
                                            icon: Zap
                                        },
                                        {
                                            value: '3_4',
                                            title: '3-4 Hours Weekly',
                                            description: 'I can dedicate 3-4 hours per week consistently',
                                            points: 3,
                                            icon: Clock
                                        },
                                        {
                                            value: 'under_3',
                                            title: 'Under 3 Hours',
                                            description: 'I have less than 3 hours available per week',
                                            points: 0,
                                            icon: AlertCircle
                                        }
                                    ]}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label required">
                                    Platform Comfort Level
                                </label>
                                <RadioGroup
                                    name="portalUse"
                                    required
                                    options={[
                                        {
                                            value: 'yes_comfortable',
                                            title: 'Web Platform Expert',
                                            description: 'I\'m comfortable using web-based tools and platforms',
                                            points: 5,
                                            icon: Monitor
                                        },
                                        {
                                            value: 'yes_unsure',
                                            title: 'Learning Mode',
                                            description: 'I can use web tools but might need some guidance',
                                            points: 2,
                                            icon: BookOpen
                                        },
                                        {
                                            value: 'no',
                                            title: 'Prefer Alternatives',
                                            description: 'I prefer email or other non-web methods (disqualifies)',
                                            points: 0,
                                            warning: true,
                                            icon: AlertCircle
                                        }
                                    ]}
                                />
                            </div>
                        </div>

                        {/* Enhanced Genre Section */}
                        <div className="form-section">
                            <div className="section-header">
                                <h3 className="section-title">
                                    <BookOpen size={18} />
                                    Reading Background & Series Interest
                                    <div className="points-indicator">
                                        <Award size={14} />
                                        Up to 20 points
                                    </div>
                                </h3>
                                <p className="section-description">
                                    Your familiarity with the genre and specific interest in our series.
                                </p>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="recentReads" className="form-label">
                                    Recent Relevant Reading
                                    <span className="optional-badge">Recommended</span>
                                </label>
                                <textarea 
                                    id="recentReads" 
                                    name="recentReads" 
                                    className="form-textarea"
                                    placeholder="List 3-5 books you've read in the last 12 months that relate to epic sci-fi/fantasy, Persian/Zoroastrian themes, or big-idea worldbuilding. Include titles and what you enjoyed about them..."
                                    rows={4}
                                />
                                <div className="field-help">
                                    💡 Examples: Dune, Foundation series, Stormlight Archive, Persian mythology, epic fantasy
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="interestStatement" className="form-label required">
                                    Why This Series? 
                                </label>
                                <textarea 
                                    id="interestStatement" 
                                    name="interestStatement" 
                                    className={`form-textarea ${formErrors.interestStatement ? 'error' : ''}`}
                                    placeholder="What specifically interests you about the Zangar/Spandam series? Mention themes like empire vs. kinship, oath/fate dynamics, cliffside megastructures, Persian-inspired worldbuilding, etc."
                                    rows={6}
                                    onChange={(e) => updateWordCount('interestStatement', e.target.value)}
                                    required
                                />
                                <div className="field-footer">
                                    <WordCounter 
                                        current={wordCounts.interestStatement} 
                                        min={150} 
                                        max={250} 
                                    />
                                    <div className="field-help">
                                        💡 Be specific about themes, settings, or concepts that appeal to you
                                    </div>
                                </div>
                                {formErrors.interestStatement && (
                                    <div className="error-message">
                                        <AlertCircle size={14} />
                                        {formErrors.interestStatement}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Enhanced Device Section */}
                        <div className="form-section">
                            <div className="section-header">
                                <h3 className="section-title">
                                    <Smartphone size={18} />
                                    Reading Devices & Platforms
                                    <div className="points-indicator">
                                        <Award size={14} />
                                        Up to 20 points
                                    </div>
                                </h3>
                                <p className="section-description">
                                    Multiple device types help us test compatibility across platforms.
                                </p>
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label required">
                                    Available Reading Devices
                                </label>
                                <div className="checkbox-grid">
                                    <label className="checkbox-card">
                                        <input 
                                            type="checkbox" 
                                            name="devices" 
                                            value="desktop"
                                        />
                                        <div className="checkbox-content">
                                            <div className="checkbox-icon">
                                                <Monitor size={20} />
                                            </div>
                                            <div className="checkbox-text">
                                                <span className="checkbox-title">Desktop/Laptop</span>
                                                <span className="checkbox-description">Windows, Mac, Linux</span>
                                            </div>
                                        </div>
                                        <div className="checkbox-indicator" />
                                    </label>
                                    
                                    <label className="checkbox-card">
                                        <input 
                                            type="checkbox" 
                                            name="devices" 
                                            value="mobile"
                                        />
                                        <div className="checkbox-content">
                                            <div className="checkbox-icon">
                                                <Smartphone size={20} />
                                            </div>
                                            <div className="checkbox-text">
                                                <span className="checkbox-title">Mobile/Tablet</span>
                                                <span className="checkbox-description">iOS, Android</span>
                                            </div>
                                        </div>
                                        <div className="checkbox-indicator" />
                                    </label>
                                    
                                    <label className="checkbox-card">
                                        <input 
                                            type="checkbox" 
                                            name="devices" 
                                            value="ereader"
                                        />
                                        <div className="checkbox-content">
                                            <div className="checkbox-icon">
                                                <Tablet size={20} />
                                            </div>
                                            <div className="checkbox-text">
                                                <span className="checkbox-title">E-reader</span>
                                                <span className="checkbox-description">Kindle, Kobo, etc.</span>
                                            </div>
                                        </div>
                                        <div className="checkbox-indicator" />
                                    </label>
                                </div>
                                {formErrors.devices && (
                                    <div className="error-message">
                                        <AlertCircle size={14} />
                                        {formErrors.devices}
                                    </div>
                                )}
                                <div className="field-help">
                                    💡 More devices = higher score (up to 6 bonus points for all three)
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Feedback Section */}
                        <div className="form-section">
                            <div className="section-header">
                                <h3 className="section-title">
                                    <MessageSquare size={18} />
                                    Feedback Experience & Philosophy
                                    <div className="points-indicator">
                                        <Award size={14} />
                                        Up to 20 points
                                    </div>
                                </h3>
                                <p className="section-description">
                                    Your approach to providing constructive feedback to authors.
                                </p>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="priorBeta" className="form-label">
                                    Previous Beta Reading Experience
                                    <span className="optional-badge">Recommended</span>
                                </label>
                                <textarea 
                                    id="priorBeta" 
                                    name="priorBeta" 
                                    className="form-textarea"
                                    placeholder="Describe your experience with beta reading, manuscript critiques, writing groups, or book reviews. Include specific examples, platforms you've used, and outcomes of your feedback..."
                                    rows={4}
                                />
                                <div className="field-help">
                                    💡 Include: platforms used, types of feedback given, author relationships
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="feedbackPhilosophy" className="form-label required">
                                    Your Feedback Philosophy
                                </label>
                                <textarea 
                                    id="feedbackPhilosophy" 
                                    name="feedbackPhilosophy" 
                                    className={`form-textarea ${formErrors.feedbackPhilosophy ? 'error' : ''}`}
                                    placeholder="How do you approach giving feedback? How do you balance honesty with kindness? Describe your method for providing actionable, specific suggestions that help authors improve..."
                                    rows={5}
                                    required
                                />
                                {formErrors.feedbackPhilosophy && (
                                    <div className="error-message">
                                        <AlertCircle size={14} />
                                        {formErrors.feedbackPhilosophy}
                                    </div>
                                )}
                                <div className="field-help">
                                    💡 Focus on: constructive criticism, specific examples, balancing praise and improvement areas
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Reliability Section */}
                        <div className="form-section">
                            <div className="section-header">
                                <h3 className="section-title">
                                    <Shield size={18} />
                                    Reliability & Communication
                                    <div className="points-indicator">
                                        <Award size={14} />
                                        Up to 20 points
                                    </div>
                                </h3>
                                <p className="section-description">
                                    Demonstrate your reliability and communication skills.
                                </p>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="trackRecord" className="form-label">
                                    Deadline Track Record
                                    <span className="optional-badge">Recommended</span>
                                </label>
                                <textarea 
                                    id="trackRecord" 
                                    name="trackRecord" 
                                    className="form-textarea"
                                    placeholder="Provide examples of successfully meeting deadlines in work, volunteer, creative, or academic contexts. Include any verifiable references, public profiles, or specific projects you've completed on time..."
                                    rows={4}
                                />
                                <div className="field-help">
                                    💡 Include: work projects, volunteer commitments, creative collaborations, academic achievements
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="communication" className="form-label required">
                                    Communication Approach
                                </label>
                                <textarea 
                                    id="communication" 
                                    name="communication" 
                                    className={`form-textarea ${formErrors.communication ? 'error' : ''}`}
                                    placeholder="Describe your communication style. How do you handle check-ins and updates? What would you do if you encountered a problem or needed to request an extension? How do you prefer to receive and give feedback?"
                                    rows={4}
                                    required
                                />
                                {formErrors.communication && (
                                    <div className="error-message">
                                        <AlertCircle size={14} />
                                        {formErrors.communication}
                                    </div>
                                )}
                                <div className="field-help">
                                    💡 We value proactive communication and transparency about challenges
                                </div>
                            </div>
                        </div>

                        {/* Additional Information Section */}
                        <div className="form-section">
                            <div className="section-header">
                                <h3 className="section-title">
                                    <Globe size={18} />
                                    Additional Information
                                    <span className="optional-badge">Optional</span>
                                </h3>
                                <p className="section-description">
                                    Help us build a diverse and representative beta reading community.
                                </p>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="accessNeeds" className="form-label">
                                    Access Needs & Unique Perspectives
                                </label>
                                <textarea 
                                    id="accessNeeds" 
                                    name="accessNeeds" 
                                    className="form-textarea"
                                    placeholder="Do you have any accessibility needs, cultural backgrounds (especially Persian/Middle Eastern), military experience, or other perspectives that would add value to our beta program?"
                                    rows={3}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="demographics" className="form-label">
                                    Diversity Information
                                </label>
                                <textarea 
                                    id="demographics" 
                                    name="demographics" 
                                    className="form-textarea"
                                    placeholder="Any additional demographic or experience diversity you'd like to share that would improve our beta reader representation?"
                                    rows={3}
                                />
                                <div className="field-help">
                                    🌍 We're committed to building an inclusive beta reading community
                                </div>
                            </div>
                        </div>

                        <FormNavigation
                            onNext={() => {
                                const form = document.getElementById('stage1-form') as HTMLFormElement;
                                if (form) {
                                    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                                }
                            }}
                            showPrevious={false}
                            showNext={true}
                            showSubmit={false}
                            isValid={validateStage1()}
                            currentStage={currentStage}
                        />
                    </form>
                </div>
            )}

            {/* Stage 2: Enhanced Comprehension Test */}
            {currentStage === 2 && (
                <div className="stage-content">
                    <div className="stage-header">
                        <div className="stage-icon">
                            <BookOpen size={24} />
                        </div>
                        <div className="stage-title-content">
                            <h2>Reading Comprehension & Analysis</h2>
                            <p>Demonstrate your ability to understand complex fiction and provide insightful feedback.</p>
                            <div className="stage-stats">
                                <span className="stat"><Timer size={14} /> ~15 minutes</span>
                                <span className="stat"><Award size={14} /> Up to 60 points</span>
                            </div>
                        </div>
                    </div>

                    <form id="stage2-form" onSubmit={handleStage2Submit} className="enhanced-form">
                        <div className="form-section">
                            <div className="instructions-card">
                                <h3>📖 Instructions</h3>
                                <p>Read the excerpt below carefully and answer the questions. This tests your ability to parse complex worldbuilding and provide specific, actionable feedback.</p>
                            </div>
                            
                            <div className="excerpt-container enhanced">
                                <div className="excerpt-header">
                                    <h4>📜 Sample Excerpt from Zangar Chronicles</h4>
                                    <div className="excerpt-meta">
                                        <span className="word-count-badge">~400 words</span>
                                        <span className="genre-badge">Epic Sci-Fi Fantasy</span>
                                    </div>
                                </div>
                                
                                <div className="excerpt-text-container">
                                    <p className="excerpt-text">
                                        The <em>Vənāsō</em> winds carried more than salt and storm-promise tonight. Hooran felt the weight of unspoken oaths pressing against her temples as she stood upon the Cliffside Sanctum, watching the fires of Spandam flicker like dying stars across the chasm. Each flame represented a choice—empire or kinship, the Saoshyant's path or the old ways of her mothers.
                                    </p>
                                    <p className="excerpt-text">
                                        "The Zangar expect answers by dawn," Cyrus said, his voice cutting through the wind-song. His ceremonial armor caught moonlight like captured ice, each plate inscribed with binding-runes that pulsed faintly blue. "The Great Assembly grows restless."
                                    </p>
                                    <p className="excerpt-text">
                                        Hooran's fingers traced the oath-scar on her palm—the mark that bound her to choices not yet made. Below, the megastructure of Spandam stretched into darkness, its bio-luminescent veins carrying information like blood through stone arteries. Somewhere in those depths, her brother Darius worked the Deep Forges, unaware that his sister's decision would reshape not just their family's fate, but the balance between the Seven Domains.
                                    </p>
                                    <p className="excerpt-text">
                                        "The winds know," she whispered, tasting copper and ozone. "They've always known."
                                    </p>
                                </div>
                            </div>

                            <div className="questions-container">
                                <div className="question-card">
                                    <label className="form-label required">
                                        <span className="question-number">1</span>
                                        What is the primary source of tension in this scene?
                                    </label>
                                    <div className="radio-options">
                                        <label className="radio-option">
                                            <input type="radio" name="q1" value="a" required />
                                            <span>Weather conditions threatening the characters</span>
                                        </label>
                                        <label className="radio-option correct-answer">
                                            <input type="radio" name="q1" value="b" />
                                            <span>Hooran must choose between competing loyalties by dawn</span>
                                        </label>
                                        <label className="radio-option">
                                            <input type="radio" name="q1" value="c" />
                                            <span>Cyrus is pressuring Hooran to attack Spandam</span>
                                        </label>
                                        <label className="radio-option">
                                            <input type="radio" name="q1" value="d" />
                                            <span>The bio-luminescent technology is failing</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="question-card">
                                    <label htmlFor="q2" className="form-label required">
                                        <span className="question-number">2</span>
                                        What role do the "Vənāsō winds" serve in this passage?
                                    </label>
                                    <textarea 
                                        id="q2"
                                        name="q2" 
                                        className="form-textarea"
                                        placeholder="Explain in 2-3 sentences how the winds function both literally and symbolically in the scene..."
                                        rows={3}
                                        required
                                    />
                                    <div className="field-help">
                                        💡 Consider both literal and symbolic meanings
                                    </div>
                                </div>

                                <div className="question-card">
                                    <label htmlFor="clarity_feedback" className="form-label required">
                                        <span className="question-number">3</span>
                                        Feedback Task: Identify a clarity issue and suggest improvement
                                    </label>
                                    <textarea 
                                        id="clarity_feedback"
                                        name="clarity_feedback" 
                                        className="form-textarea"
                                        placeholder="Point to specific lines that are unclear, explain why they're confusing, and suggest how to improve clarity while maintaining the author's voice..."
                                        rows={4}
                                        required
                                    />
                                    <div className="field-help">
                                        💡 Quote specific text and provide constructive alternatives
                                    </div>
                                </div>

                                <div className="question-card">
                                    <label htmlFor="pacing_feedback" className="form-label required">
                                        <span className="question-number">4</span>
                                        Pacing Analysis
                                    </label>
                                    <textarea 
                                        id="pacing_feedback"
                                        name="pacing_feedback" 
                                        className="form-textarea"
                                        placeholder="Analyze the rhythm and flow of this excerpt. Does it feel rushed, too slow, or well-paced? Cite specific examples from the text to support your assessment..."
                                        rows={4}
                                        required
                                    />
                                    <div className="field-help">
                                        💡 Focus on sentence length, paragraph breaks, tension building
                                    </div>
                                </div>

                                <div className="question-card">
                                    <label htmlFor="taste_response" className="form-label required">
                                        <span className="question-number">5</span>
                                        Personal Response: What engages or loses you?
                                    </label>
                                    <textarea 
                                        id="taste_response"
                                        name="taste_response" 
                                        className="form-textarea"
                                        placeholder="Be honest about what works or doesn't work for you as a reader. What draws you in? What makes you want to keep reading or puts you off?"
                                        rows={3}
                                        onChange={(e) => updateWordCount('tasteResponse', e.target.value)}
                                        required
                                    />
                                    <WordCounter 
                                        current={wordCounts.tasteResponse} 
                                        max={100} 
                                    />
                                    <div className="field-help">
                                        💡 Honest feedback helps us match readers to content
                                    </div>
                                </div>
                            </div>
                        </div>

                        <FormNavigation
                            onPrevious={goToPreviousStage}
                            onNext={() => {
                                const form = document.getElementById('stage2-form') as HTMLFormElement;
                                if (form) {
                                    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                                }
                            }}
                            showPrevious={true}
                            showNext={true}
                            showSubmit={false}
                            isValid={validateStage2()}
                            currentStage={currentStage}
                        />
                    </form>
                </div>
            )}

            {/* Stage 3: Enhanced Calibration Test */}
            {currentStage === 3 && (
                <div className="stage-content">
                    <div className="stage-header">
                        <div className="stage-icon">
                            <Target size={24} />
                        </div>
                        <div className="stage-title-content">
                            <h2>Quality Calibration Test</h2>
                            <p>Compare two writing samples and demonstrate your editorial judgment.</p>
                            <div className="stage-stats">
                                <span className="stat"><Timer size={14} /> ~10 minutes</span>
                                <span className="stat"><Award size={14} /> Up to 40 points</span>
                            </div>
                        </div>
                    </div>

                    <form id="stage3-form" onSubmit={handleStage3Submit} className="enhanced-form">
                        <div className="form-section">
                            <div className="instructions-card">
                                <h3>🎯 Calibration Instructions</h3>
                                <p>Compare these two passages and identify which needs more revision. Your ability to recognize quality differences is crucial for beta reading.</p>
                            </div>

                            <div className="comparison-container">
                                <div className="passage-card passage-a">
                                    <div className="passage-header">
                                        <h4>📖 Passage A</h4>
                                        <div className="passage-label">Sample Writing</div>
                                    </div>
                                    <div className="passage-content">
                                        <p className="passage-text">
                                            The battle raged across the crystalline plains. Warriors fought with determination. Magic crackled through the air as spells were cast by the mages. It was a significant moment in the war. Many would die. The outcome would affect everyone. The protagonist felt conflicted about their role in the violence.
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="vs-divider">
                                    <div className="vs-circle">VS</div>
                                </div>
                                
                                <div className="passage-card passage-b">
                                    <div className="passage-header">
                                        <h4>📖 Passage B</h4>
                                        <div className="passage-label">Sample Writing</div>
                                    </div>
                                    <div className="passage-content">
                                        <p className="passage-text">
                                            Kara's blade sang against Varek's shield, the impact reverberating through her bones. Around them, the Shattered Fields erupted in cascades of amber light—each spell-strike from the War-Mages above sending hairline fractures racing through the crystalline ground. She could taste copper and ozone, hear the wet snap of breaking bone somewhere to her left. This was the moment Sehran had warned her about: when ideology met steel, and someone had to choose what they were willing to break.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="question-card major">
                                <label className="form-label required">
                                    <span className="question-number">⚖️</span>
                                    Which passage needs more revision?
                                </label>
                                <div className="radio-options centered">
                                    <label className="radio-option large correct-answer">
                                        <input type="radio" name="worse_passage" value="a" required />
                                        <span className="option-content">
                                            <strong>Passage A</strong>
                                            <small>Needs more work</small>
                                        </span>
                                    </label>
                                    <label className="radio-option large">
                                        <input type="radio" name="worse_passage" value="b" />
                                        <span className="option-content">
                                            <strong>Passage B</strong>
                                            <small>Needs more work</small>
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="analysis-grid">
                                <div className="question-card">
                                    <label htmlFor="passage_a_analysis" className="form-label required">
                                        <span className="question-number">A</span>
                                        Analysis of Passage A
                                    </label>
                                    <textarea 
                                        id="passage_a_analysis"
                                        name="passage_a_analysis" 
                                        className="form-textarea"
                                        placeholder="Identify specific strengths and weaknesses in Passage A. What works well? What needs improvement? Be specific and cite examples..."
                                        rows={4}
                                        required
                                    />
                                </div>

                                <div className="question-card">
                                    <label htmlFor="passage_b_analysis" className="form-label required">
                                        <span className="question-number">B</span>
                                        Analysis of Passage B
                                    </label>
                                    <textarea 
                                        id="passage_b_analysis"
                                        name="passage_b_analysis" 
                                        className="form-textarea"
                                        placeholder="Identify specific strengths and weaknesses in Passage B. What works well? What needs improvement? Be specific and cite examples..."
                                        rows={4}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="question-card priority">
                                <label htmlFor="priority_fix" className="form-label required">
                                    <span className="question-number">🔧</span>
                                    Priority Fix Recommendation
                                </label>
                                <textarea 
                                    id="priority_fix"
                                    name="priority_fix" 
                                    className="form-textarea"
                                    placeholder="If you could only fix one thing across both passages, what would it be? Choose the highest-impact problem and provide a concrete, actionable solution..."
                                    rows={4}
                                    required
                                />
                                <div className="field-help">
                                    💡 Focus on the change that would have the biggest positive impact
                                </div>
                            </div>
                        </div>

                        <FormNavigation
                            onPrevious={goToPreviousStage}
                            onNext={() => {
                                const form = document.getElementById('stage3-form') as HTMLFormElement;
                                if (form) {
                                    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                                }
                            }}
                            showPrevious={true}
                            showNext={true}
                            showSubmit={false}
                            isValid={validateStage3()}
                            currentStage={currentStage}
                        />
                    </form>
                </div>
            )}

            {/* Stage 4: Enhanced Trial Task */}
            {currentStage === 4 && (
                <div className="stage-content">
                    <div className="stage-header">
                        <div className="stage-icon timer">
                            <Timer size={24} />
                        </div>
                        <div className="stage-title-content">
                            <h2>Timed Beta Reading Trial</h2>
                            <p>Complete a full beta reading task under realistic conditions.</p>
                            <div className="stage-stats">
                                <span className="stat urgent"><Timer size={14} /> 48 hour deadline</span>
                                <span className="stat"><Award size={14} /> Up to 60 points</span>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Timer */}
                    <div className="timer-display">
                        <div className="timer-icon">
                            <Timer size={32} />
                        </div>
                        <div className="timer-content">
                            <div className="timer-label">Time Remaining</div>
                            <div className="timer-value">{formatTime(timeRemaining)}</div>
                            <div className="timer-status">
                                {timeRemaining > 24 * 60 * 60 ? (
                                    <span className="status good">✅ Plenty of time</span>
                                ) : timeRemaining > 12 * 60 * 60 ? (
                                    <span className="status warning">⚠️ Moderate urgency</span>
                                ) : (
                                    <span className="status urgent">🚨 High urgency</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <form id="stage4-form" onSubmit={handleStage4Submit} className="enhanced-form">
                        {/* Rest of Stage 4 content... */}
                        <div className="form-section">
                            <div className="instructions-card urgent">
                                <h3>⏱️ Trial Task Instructions</h3>
                                <p>This simulates real beta reading conditions. Read the chapter excerpt and provide comprehensive feedback as you would for an actual beta assignment.</p>
                                <div className="requirements-list">
                                    <div className="requirement"><Check size={16} /> Overall assessment (200-300 words)</div>
                                    <div className="requirement"><Check size={16} /> Minimum 8 inline comments</div>
                                    <div className="requirement"><Check size={16} /> Chapter summary</div>
                                    <div className="requirement"><Check size={16} /> Complete within 48 hours</div>
                                </div>
                            </div>

                            {/* Task content would continue here... */}
                        </div>

                        <FormNavigation
                            onPrevious={goToPreviousStage}
                            onSubmit={() => {
                                const form = document.getElementById('stage4-form') as HTMLFormElement;
                                if (form) {
                                    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                                }
                            }}
                            showPrevious={true}
                            showNext={false}
                            showSubmit={true}
                            isValid={validateStage4()}
                            isLoading={isSaving}
                            currentStage={currentStage}
                        />
                    </form>
                </div>
            )}

            {/* Enhanced Final Results */}
            {currentStage === 5 && (
                <div className="stage-content">
                    <div className="results-display">
                        <div className="results-header">
                            <div className="success-icon">
                                <CheckCircle2 size={48} />
                            </div>
                            <h2>Application Submitted Successfully!</h2>
                            <p>Your beta reader application has been completed and submitted for review.</p>
                        </div>

                        <div className="score-summary">
                            <h3>Your Performance Summary</h3>
                            <div className="score-grid">
                                <div className="score-card">
                                    <div className="score-header">
                                        <UserIcon size={20} />
                                        <span>Stage 1: Application</span>
                                    </div>
                                    <div className="score-value">{applicationData.stage1?.rawScore || 0}/100</div>
                                    <div className="score-status">
                                        {applicationData.stage1?.passed ? 
                                            <span className="passed">✅ Passed</span> : 
                                            <span className="failed">❌ Not Passed</span>
                                        }
                                    </div>
                                </div>
                                
                                <div className="score-card">
                                    <div className="score-header">
                                        <BookOpen size={20} />
                                        <span>Stage 2: Comprehension</span>
                                    </div>
                                    <div className="score-value">{applicationData.stage2?.rawScore || 0}/60</div>
                                    <div className="score-status">
                                        {applicationData.stage2?.passed ? 
                                            <span className="passed">✅ Passed</span> : 
                                            <span className="failed">❌ Not Passed</span>
                                        }
                                    </div>
                                </div>
                                
                                <div className="score-card">
                                    <div className="score-header">
                                        <Target size={20} />
                                        <span>Stage 3: Calibration</span>
                                    </div>
                                    <div className="score-value">{applicationData.stage3?.rawScore || 0}/40</div>
                                    <div className="score-status">
                                        {applicationData.stage3?.passed ? 
                                            <span className="passed">✅ Passed</span> : 
                                            <span className="failed">❌ Not Passed</span>
                                        }
                                    </div>
                                </div>
                                
                                <div className="score-card">
                                    <div className="score-header">
                                        <Timer size={20} />
                                        <span>Stage 4: Trial Task</span>
                                    </div>
                                    <div className="score-value">{applicationData.stage4?.rawScore || 0}/60</div>
                                    <div className="score-status">
                                        {applicationData.stage4?.passed ? 
                                            <span className="passed">✅ Passed</span> : 
                                            <span className="failed">❌ Not Passed</span>
                                        }
                                    </div>
                                </div>
                            </div>
                            
                            <div className="composite-score">
                                <div className="composite-icon">
                                    <Award size={28} />
                                </div>
                                <div className="composite-content">
                                    <div className="composite-label">Final Composite Score</div>
                                    <div className="composite-value">{applicationData.compositeScore || 0}/100</div>
                                </div>
                            </div>
                        </div>

                        <div className="next-steps-card">
                            <h3>📋 What Happens Next?</h3>
                            <div className="timeline">
                                <div className="timeline-item">
                                    <div className="timeline-dot">1</div>
                                    <div className="timeline-content">
                                        <strong>Review Period</strong>
                                        <p>Our team reviews all applications (1-2 weeks)</p>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-dot">2</div>
                                    <div className="timeline-content">
                                        <strong>Notification</strong>
                                        <p>You'll receive an email about your application status</p>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-dot">3</div>
                                    <div className="timeline-content">
                                        <strong>Beta Portal Access</strong>
                                        <p>Selected readers get exclusive portal access and materials</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BetaApplication;