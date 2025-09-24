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
                )}\n            </div>
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
        const filledComments = Array.from(commentElements).filter(el => (el as HTMLInputElement).value.trim() !== '');\n        if (filledComments.length < 8) {\n            errors.inline_comments = 'Please provide at least 8 inline comments';\n        }\n        \n        setFormErrors(errors);\n        return Object.keys(errors).length === 0;\n    };\n\n    // Form submission handlers\n    const handleStage1Submit = (e: React.FormEvent) => {\n        e.preventDefault();\n        if (validateStage1()) {\n            const formData = new FormData(e.target as HTMLFormElement);\n            const data = Object.fromEntries(formData.entries());\n            const devices = formData.getAll('devices');\n            (data as any).devices = devices;\n            \n            // Calculate stage 1 score (same logic as original)\n            let stage1Score = 0;\n            let autoFail = false;\n\n            const commitmentScores: { [key: string]: number } = {\n                'weekly_deadlines': 10,\n                'commit_with_extensions': 6,\n                'prefer_flexible': 3,\n                'no_commitment': 0\n            };\n            stage1Score += commitmentScores[data.betaCommitment as string] || 0;\n            if (data.betaCommitment === 'no_commitment') autoFail = true;\n\n            const hoursScores: { [key: string]: number } = {\n                '5_plus': 5,\n                '3_4': 3,\n                'under_3': 0\n            };\n            stage1Score += hoursScores[data.hoursPerWeek as string] || 0;\n\n            const portalUseScores: { [key: string]: number } = {\n                'yes_comfortable': 5,\n                'yes_unsure': 2,\n                'no': 0\n            };\n            stage1Score += portalUseScores[data.portalUse as string] || 0;\n            if (data.portalUse === 'no') autoFail = true;\n\n            // Additional scoring logic...\n            stage1Score = Math.min(stage1Score + 40, 100); // Simplified for demo\n\n            const passThreshold = 50;\n            let stage1Passed = (stage1Score >= passThreshold) && !autoFail;\n\n            setApplicationData(prevData => ({ \n                ...prevData, \n                stage1: { \n                    ...data, \n                    rawScore: stage1Score, \n                    passed: stage1Passed, \n                    autoFail: autoFail \n                } \n            }));\n            \n            goToNextStage();\n        }\n    };\n\n    const handleStage2Submit = (e: React.FormEvent) => {\n        e.preventDefault();\n        if (validateStage2()) {\n            // Stage 2 processing logic...\n            goToNextStage();\n        }\n    };\n\n    const handleStage3Submit = (e: React.FormEvent) => {\n        e.preventDefault();\n        if (validateStage3()) {\n            // Stage 3 processing logic...\n            goToNextStage();\n        }\n    };\n\n    const handleStage4Submit = async (e: React.FormEvent) => {\n        e.preventDefault();\n        if (validateStage4()) {\n            setIsSaving(true);\n            // Stage 4 processing and database save...\n            \n            setTimeout(() => {\n                setIsSaving(false);\n                setCurrentStage(5); // Results page\n            }, 2000);\n        }\n    };\n\n    if (isLoading) {\n        return (\n            <div className=\"beta-app-loading\">\n                <div className=\"loading-content\">\n                    <div className=\"spinner large\" />\n                    <h3>Loading your application...</h3>\n                    <p>Please wait while we prepare your beta reader application.</p>\n                </div>\n            </div>\n        );\n    }\n\n    if (applicationStatus) {\n        return (\n            <div className=\"beta-app-container\">\n                <div className=\"status-display submitted\">\n                    <div className=\"status-icon\">\n                        <CheckCircle2 size={64} />\n                    </div>\n                    <h2>Application Successfully Submitted!</h2>\n                    <p>Thank you for applying to the Zangar/Spandam Beta Reader Program.</p>\n                    \n                    <div className=\"status-card\">\n                        <div className=\"status-row\">\n                            <span className=\"status-label\">Submitted:</span>\n                            <span className=\"status-value\">\n                                {new Date(applicationStatus.created_at).toLocaleDateString('en-US', {\n                                    year: 'numeric',\n                                    month: 'long',\n                                    day: 'numeric',\n                                    hour: '2-digit',\n                                    minute: '2-digit'\n                                })}\n                            </span>\n                        </div>\n                        <div className=\"status-row\">\n                            <span className=\"status-label\">Current Status:</span>\n                            <span className=\"status-value\">\n                                <div className=\"status-badge pending\">\n                                    <Clock size={14} />\n                                    Under Review\n                                </div>\n                            </span>\n                        </div>\n                        <div className=\"status-row\">\n                            <span className=\"status-label\">Expected Response:</span>\n                            <span className=\"status-value\">Within 1-2 weeks</span>\n                        </div>\n                    </div>\n                    \n                    <div className=\"next-steps\">\n                        <h3>What happens next?</h3>\n                        <ul>\n                            <li>Our team will review your application within 1-2 weeks</li>\n                            <li>You'll receive an email notification about your status</li>\n                            <li>Selected candidates will receive access to the beta portal</li>\n                            <li>Check your email regularly for updates</li>\n                        </ul>\n                    </div>\n                </div>\n            </div>\n        );\n    }\n\n    return (\n        <div className=\"beta-app-container\">\n            {/* Enhanced Header with better visual hierarchy */}\n            <div className=\"beta-app-header\">\n                <div className=\"header-content\">\n                    <div className=\"header-badge\">\n                        <Star size={16} />\n                        Beta Reader Program\n                    </div>\n                    <h1>Zangar/Spandam Beta Reader Application</h1>\n                    <p className=\"header-subtitle\">\n                        Join our exclusive community of beta readers and help shape the future of epic sci-fi/fantasy\n                    </p>\n                    \n                    <div className=\"program-highlights\">\n                        <div className=\"highlight-item\">\n                            <Clock size={16} />\n                            <span>6-8 Week Program</span>\n                        </div>\n                        <div className=\"highlight-item\">\n                            <Shield size={16} />\n                            <span>Exclusive Content</span>\n                        </div>\n                        <div className=\"highlight-item\">\n                            <Award size={16} />\n                            <span>Direct Author Access</span>\n                        </div>\n                        <div className=\"highlight-item\">\n                            <Globe size={16} />\n                            <span>Global Community</span>\n                        </div>\n                    </div>\n                </div>\n                <div className=\"header-decoration\" />\n            </div>\n\n            {/* Enhanced Progress Stepper */}\n            <ProgressStepper \n                currentStage={currentStage}\n                completedStages={completedStages}\n                onStageClick={goToStage}\n            />\n\n            {/* Stage 1: Enhanced Application Form */}\n            {currentStage === 1 && (\n                <div className=\"stage-content\">\n                    <div className=\"stage-header\">\n                        <div className=\"stage-icon\">\n                            <UserIcon size={24} />\n                        </div>\n                        <div className=\"stage-title-content\">\n                            <h2>Personal Information & Commitment</h2>\n                            <p>Help us understand your background, reading preferences, and availability for the beta program.</p>\n                        </div>\n                    </div>\n\n                    <form id=\"stage1-form\" onSubmit={handleStage1Submit} className=\"enhanced-form\">\n                        {/* Contact Information Section */}\n                        <div className=\"form-section\">\n                            <div className=\"section-header\">\n                                <h3 className=\"section-title\">\n                                    <UserIcon size={18} />\n                                    Contact Information\n                                </h3>\n                                <p className=\"section-description\">\n                                    We'll use this information to contact you about your application status.\n                                </p>\n                            </div>\n                            \n                            <div className=\"form-grid two-columns\">\n                                <div className=\"form-group\">\n                                    <label htmlFor=\"fullName\" className=\"form-label required\">\n                                        Full Name\n                                    </label>\n                                    <input \n                                        type=\"text\" \n                                        id=\"fullName\" \n                                        name=\"fullName\" \n                                        className={`form-input ${formErrors.fullName ? 'error' : ''}`}\n                                        placeholder=\"Enter your full name\"\n                                        required \n                                    />\n                                    {formErrors.fullName && (\n                                        <div className=\"error-message\">\n                                            <AlertCircle size={14} />\n                                            {formErrors.fullName}\n                                        </div>\n                                    )}\n                                </div>\n\n                                <div className=\"form-group\">\n                                    <label htmlFor=\"email\" className=\"form-label required\">\n                                        Email Address\n                                    </label>\n                                    <input \n                                        type=\"email\" \n                                        id=\"email\" \n                                        name=\"email\" \n                                        className={`form-input ${formErrors.email ? 'error' : ''}`}\n                                        placeholder=\"your.email@example.com\"\n                                        required \n                                    />\n                                    {formErrors.email && (\n                                        <div className=\"error-message\">\n                                            <AlertCircle size={14} />\n                                            {formErrors.email}\n                                        </div>\n                                    )}\n                                </div>\n                            </div>\n                            \n                            <div className=\"form-grid two-columns\">\n                                <div className=\"form-group\">\n                                    <label htmlFor=\"timeZone\" className=\"form-label required\">\n                                        Time Zone\n                                    </label>\n                                    <select \n                                        id=\"timeZone\" \n                                        name=\"timeZone\" \n                                        className={`form-input ${formErrors.timeZone ? 'error' : ''}`}\n                                        required\n                                    >\n                                        <option value=\"\">Select your time zone</option>\n                                        <option value=\"America/New_York\">🇺🇸 Eastern Time (UTC-5/-4)</option>\n                                        <option value=\"America/Chicago\">🇺🇸 Central Time (UTC-6/-5)</option>\n                                        <option value=\"America/Denver\">🇺🇸 Mountain Time (UTC-7/-6)</option>\n                                        <option value=\"America/Los_Angeles\">🇺🇸 Pacific Time (UTC-8/-7)</option>\n                                        <option value=\"Europe/London\">🇬🇧 GMT/BST (UTC+0/+1)</option>\n                                        <option value=\"Europe/Paris\">🇫🇷 CET/CEST (UTC+1/+2)</option>\n                                        <option value=\"Asia/Tokyo\">🇯🇵 JST (UTC+9)</option>\n                                        <option value=\"Australia/Sydney\">🇦🇺 AEST/AEDT (UTC+10/+11)</option>\n                                    </select>\n                                    {formErrors.timeZone && (\n                                        <div className=\"error-message\">\n                                            <AlertCircle size={14} />\n                                            {formErrors.timeZone}\n                                        </div>\n                                    )}\n                                </div>\n\n                                <div className=\"form-group\">\n                                    <label htmlFor=\"country\" className=\"form-label\">\n                                        Country\n                                    </label>\n                                    <input \n                                        type=\"text\" \n                                        id=\"country\" \n                                        name=\"country\" \n                                        className=\"form-input\"\n                                        placeholder=\"Your country of residence\"\n                                    />\n                                </div>\n                            </div>\n\n                            <div className=\"form-group\">\n                                <label htmlFor=\"goodreads\" className=\"form-label\">\n                                    Goodreads Profile\n                                    <span className=\"optional-badge\">Optional</span>\n                                </label>\n                                <input \n                                    type=\"url\" \n                                    id=\"goodreads\" \n                                    name=\"goodreads\" \n                                    className=\"form-input\"\n                                    placeholder=\"https://goodreads.com/user/your-profile\"\n                                />\n                                <div className=\"field-help\">\n                                    Help us understand your reading preferences and history\n                                </div>\n                            </div>\n                        </div>\n\n                        {/* Enhanced Commitment Section */}\n                        <div className=\"form-section\">\n                            <div className=\"section-header\">\n                                <h3 className=\"section-title\">\n                                    <Clock size={18} />\n                                    Commitment & Availability\n                                    <div className=\"points-indicator\">\n                                        <Award size={14} />\n                                        Up to 20 points\n                                    </div>\n                                </h3>\n                                <p className=\"section-description\">\n                                    Your availability and commitment level significantly impact your application score.\n                                </p>\n                            </div>\n                            \n                            <div className=\"form-group\">\n                                <label className=\"form-label required\">\n                                    Beta Window Commitment Level\n                                </label>\n                                <RadioGroup\n                                    name=\"betaCommitment\"\n                                    required\n                                    options={[\n                                        {\n                                            value: 'weekly_deadlines',\n                                            title: 'Weekly Deadlines',\n                                            description: 'I can commit to consistent weekly deadlines throughout the 6-8 week program',\n                                            points: 10,\n                                            icon: CheckCircle2\n                                        },\n                                        {\n                                            value: 'commit_with_extensions',\n                                            title: 'Flexible Commitment',\n                                            description: 'I can commit but may need occasional extensions (1-2 times)',\n                                            points: 6,\n                                            icon: Clock\n                                        },\n                                        {\n                                            value: 'prefer_flexible',\n                                            title: 'Flexible Schedule',\n                                            description: 'I prefer flexible deadlines but will complete all assignments',\n                                            points: 3,\n                                            icon: Target\n                                        },\n                                        {\n                                            value: 'no_commitment',\n                                            title: 'No Deadlines',\n                                            description: 'I cannot commit to any deadlines (disqualifies application)',\n                                            points: 0,\n                                            warning: true,\n                                            icon: AlertCircle\n                                        }\n                                    ]}\n                                />\n                                {formErrors.betaCommitment && (\n                                    <div className=\"error-message\">\n                                        <AlertCircle size={14} />\n                                        {formErrors.betaCommitment}\n                                    </div>\n                                )}\n                            </div>\n\n                            <div className=\"form-group\">\n                                <label className=\"form-label required\">\n                                    Weekly Time Availability\n                                </label>\n                                <RadioGroup\n                                    name=\"hoursPerWeek\"\n                                    required\n                                    options={[\n                                        {\n                                            value: '5_plus',\n                                            title: '5+ Hours Weekly',\n                                            description: 'I can dedicate 5 or more hours per week to beta reading',\n                                            points: 5,\n                                            icon: Zap\n                                        },\n                                        {\n                                            value: '3_4',\n                                            title: '3-4 Hours Weekly',\n                                            description: 'I can dedicate 3-4 hours per week consistently',\n                                            points: 3,\n                                            icon: Clock\n                                        },\n                                        {\n                                            value: 'under_3',\n                                            title: 'Under 3 Hours',\n                                            description: 'I have less than 3 hours available per week',\n                                            points: 0,\n                                            icon: AlertCircle\n                                        }\n                                    ]}\n                                />\n                            </div>\n\n                            <div className=\"form-group\">\n                                <label className=\"form-label required\">\n                                    Platform Comfort Level\n                                </label>\n                                <RadioGroup\n                                    name=\"portalUse\"\n                                    required\n                                    options={[\n                                        {\n                                            value: 'yes_comfortable',\n                                            title: 'Web Platform Expert',\n                                            description: 'I\\'m comfortable using web-based tools and platforms',\n                                            points: 5,\n                                            icon: Monitor\n                                        },\n                                        {\n                                            value: 'yes_unsure',\n                                            title: 'Learning Mode',\n                                            description: 'I can use web tools but might need some guidance',\n                                            points: 2,\n                                            icon: BookOpen\n                                        },\n                                        {\n                                            value: 'no',\n                                            title: 'Prefer Alternatives',\n                                            description: 'I prefer email or other non-web methods (disqualifies)',\n                                            points: 0,\n                                            warning: true,\n                                            icon: AlertCircle\n                                        }\n                                    ]}\n                                />\n                            </div>\n                        </div>\n\n                        {/* Enhanced Genre Section */}\n                        <div className=\"form-section\">\n                            <div className=\"section-header\">\n                                <h3 className=\"section-title\">\n                                    <BookOpen size={18} />\n                                    Reading Background & Series Interest\n                                    <div className=\"points-indicator\">\n                                        <Award size={14} />\n                                        Up to 20 points\n                                    </div>\n                                </h3>\n                                <p className=\"section-description\">\n                                    Your familiarity with the genre and specific interest in our series.\n                                </p>\n                            </div>\n                            \n                            <div className=\"form-group\">\n                                <label htmlFor=\"recentReads\" className=\"form-label\">\n                                    Recent Relevant Reading\n                                    <span className=\"optional-badge\">Recommended</span>\n                                </label>\n                                <textarea \n                                    id=\"recentReads\" \n                                    name=\"recentReads\" \n                                    className=\"form-textarea\"\n                                    placeholder=\"List 3-5 books you've read in the last 12 months that relate to epic sci-fi/fantasy, Persian/Zoroastrian themes, or big-idea worldbuilding. Include titles and what you enjoyed about them...\"\n                                    rows={4}\n                                />\n                                <div className=\"field-help\">\n                                    💡 Examples: Dune, Foundation series, Stormlight Archive, Persian mythology, epic fantasy\n                                </div>\n                            </div>\n                            \n                            <div className=\"form-group\">\n                                <label htmlFor=\"interestStatement\" className=\"form-label required\">\n                                    Why This Series? \n                                </label>\n                                <textarea \n                                    id=\"interestStatement\" \n                                    name=\"interestStatement\" \n                                    className={`form-textarea ${formErrors.interestStatement ? 'error' : ''}`}\n                                    placeholder=\"What specifically interests you about the Zangar/Spandam series? Mention themes like empire vs. kinship, oath/fate dynamics, cliffside megastructures, Persian-inspired worldbuilding, etc.\"\n                                    rows={6}\n                                    onChange={(e) => updateWordCount('interestStatement', e.target.value)}\n                                    required\n                                />\n                                <div className=\"field-footer\">\n                                    <WordCounter \n                                        current={wordCounts.interestStatement} \n                                        min={150} \n                                        max={250} \n                                    />\n                                    <div className=\"field-help\">\n                                        💡 Be specific about themes, settings, or concepts that appeal to you\n                                    </div>\n                                </div>\n                                {formErrors.interestStatement && (\n                                    <div className=\"error-message\">\n                                        <AlertCircle size={14} />\n                                        {formErrors.interestStatement}\n                                    </div>\n                                )}\n                            </div>\n                        </div>\n\n                        {/* Enhanced Device Section */}\n                        <div className=\"form-section\">\n                            <div className=\"section-header\">\n                                <h3 className=\"section-title\">\n                                    <Smartphone size={18} />\n                                    Reading Devices & Platforms\n                                    <div className=\"points-indicator\">\n                                        <Award size={14} />\n                                        Up to 20 points\n                                    </div>\n                                </h3>\n                                <p className=\"section-description\">\n                                    Multiple device types help us test compatibility across platforms.\n                                </p>\n                            </div>\n                            \n                            <div className=\"form-group\">\n                                <label className=\"form-label required\">\n                                    Available Reading Devices\n                                </label>\n                                <div className=\"checkbox-grid\">\n                                    <label className=\"checkbox-card\">\n                                        <input \n                                            type=\"checkbox\" \n                                            name=\"devices\" \n                                            value=\"desktop\"\n                                        />\n                                        <div className=\"checkbox-content\">\n                                            <div className=\"checkbox-icon\">\n                                                <Monitor size={20} />\n                                            </div>\n                                            <div className=\"checkbox-text\">\n                                                <span className=\"checkbox-title\">Desktop/Laptop</span>\n                                                <span className=\"checkbox-description\">Windows, Mac, Linux</span>\n                                            </div>\n                                        </div>\n                                        <div className=\"checkbox-indicator\" />\n                                    </label>\n                                    \n                                    <label className=\"checkbox-card\">\n                                        <input \n                                            type=\"checkbox\" \n                                            name=\"devices\" \n                                            value=\"mobile\"\n                                        />\n                                        <div className=\"checkbox-content\">\n                                            <div className=\"checkbox-icon\">\n                                                <Smartphone size={20} />\n                                            </div>\n                                            <div className=\"checkbox-text\">\n                                                <span className=\"checkbox-title\">Mobile/Tablet</span>\n                                                <span className=\"checkbox-description\">iOS, Android</span>\n                                            </div>\n                                        </div>\n                                        <div className=\"checkbox-indicator\" />\n                                    </label>\n                                    \n                                    <label className=\"checkbox-card\">\n                                        <input \n                                            type=\"checkbox\" \n                                            name=\"devices\" \n                                            value=\"ereader\"\n                                        />\n                                        <div className=\"checkbox-content\">\n                                            <div className=\"checkbox-icon\">\n                                                <Tablet size={20} />\n                                            </div>\n                                            <div className=\"checkbox-text\">\n                                                <span className=\"checkbox-title\">E-reader</span>\n                                                <span className=\"checkbox-description\">Kindle, Kobo, etc.</span>\n                                            </div>\n                                        </div>\n                                        <div className=\"checkbox-indicator\" />\n                                    </label>\n                                </div>\n                                {formErrors.devices && (\n                                    <div className=\"error-message\">\n                                        <AlertCircle size={14} />\n                                        {formErrors.devices}\n                                    </div>\n                                )}\n                                <div className=\"field-help\">\n                                    💡 More devices = higher score (up to 6 bonus points for all three)\n                                </div>\n                            </div>\n                        </div>\n\n                        {/* Enhanced Feedback Section */}\n                        <div className=\"form-section\">\n                            <div className=\"section-header\">\n                                <h3 className=\"section-title\">\n                                    <MessageSquare size={18} />\n                                    Feedback Experience & Philosophy\n                                    <div className=\"points-indicator\">\n                                        <Award size={14} />\n                                        Up to 20 points\n                                    </div>\n                                </h3>\n                                <p className=\"section-description\">\n                                    Your approach to providing constructive feedback to authors.\n                                </p>\n                            </div>\n                            \n                            <div className=\"form-group\">\n                                <label htmlFor=\"priorBeta\" className=\"form-label\">\n                                    Previous Beta Reading Experience\n                                    <span className=\"optional-badge\">Recommended</span>\n                                </label>\n                                <textarea \n                                    id=\"priorBeta\" \n                                    name=\"priorBeta\" \n                                    className=\"form-textarea\"\n                                    placeholder=\"Describe your experience with beta reading, manuscript critiques, writing groups, or book reviews. Include specific examples, platforms you've used, and outcomes of your feedback...\"\n                                    rows={4}\n                                />\n                                <div className=\"field-help\">\n                                    💡 Include: platforms used, types of feedback given, author relationships\n                                </div>\n                            </div>\n                            \n                            <div className=\"form-group\">\n                                <label htmlFor=\"feedbackPhilosophy\" className=\"form-label required\">\n                                    Your Feedback Philosophy\n                                </label>\n                                <textarea \n                                    id=\"feedbackPhilosophy\" \n                                    name=\"feedbackPhilosophy\" \n                                    className={`form-textarea ${formErrors.feedbackPhilosophy ? 'error' : ''}`}\n                                    placeholder=\"How do you approach giving feedback? How do you balance honesty with kindness? Describe your method for providing actionable, specific suggestions that help authors improve...\"\n                                    rows={5}\n                                    required\n                                />\n                                {formErrors.feedbackPhilosophy && (\n                                    <div className=\"error-message\">\n                                        <AlertCircle size={14} />\n                                        {formErrors.feedbackPhilosophy}\n                                    </div>\n                                )}\n                                <div className=\"field-help\">\n                                    💡 Focus on: constructive criticism, specific examples, balancing praise and improvement areas\n                                </div>\n                            </div>\n                        </div>\n\n                        {/* Enhanced Reliability Section */}\n                        <div className=\"form-section\">\n                            <div className=\"section-header\">\n                                <h3 className=\"section-title\">\n                                    <Shield size={18} />\n                                    Reliability & Communication\n                                    <div className=\"points-indicator\">\n                                        <Award size={14} />\n                                        Up to 20 points\n                                    </div>\n                                </h3>\n                                <p className=\"section-description\">\n                                    Demonstrate your reliability and communication skills.\n                                </p>\n                            </div>\n                            \n                            <div className=\"form-group\">\n                                <label htmlFor=\"trackRecord\" className=\"form-label\">\n                                    Deadline Track Record\n                                    <span className=\"optional-badge\">Recommended</span>\n                                </label>\n                                <textarea \n                                    id=\"trackRecord\" \n                                    name=\"trackRecord\" \n                                    className=\"form-textarea\"\n                                    placeholder=\"Provide examples of successfully meeting deadlines in work, volunteer, creative, or academic contexts. Include any verifiable references, public profiles, or specific projects you've completed on time...\"\n                                    rows={4}\n                                />\n                                <div className=\"field-help\">\n                                    💡 Include: work projects, volunteer commitments, creative collaborations, academic achievements\n                                </div>\n                            </div>\n                            \n                            <div className=\"form-group\">\n                                <label htmlFor=\"communication\" className=\"form-label required\">\n                                    Communication Approach\n                                </label>\n                                <textarea \n                                    id=\"communication\" \n                                    name=\"communication\" \n                                    className={`form-textarea ${formErrors.communication ? 'error' : ''}`}\n                                    placeholder=\"Describe your communication style. How do you handle check-ins and updates? What would you do if you encountered a problem or needed to request an extension? How do you prefer to receive and give feedback?\"\n                                    rows={4}\n                                    required\n                                />\n                                {formErrors.communication && (\n                                    <div className=\"error-message\">\n                                        <AlertCircle size={14} />\n                                        {formErrors.communication}\n                                    </div>\n                                )}\n                                <div className=\"field-help\">\n                                    💡 We value proactive communication and transparency about challenges\n                                </div>\n                            </div>\n                        </div>\n\n                        {/* Additional Information Section */}\n                        <div className=\"form-section\">\n                            <div className=\"section-header\">\n                                <h3 className=\"section-title\">\n                                    <Globe size={18} />\n                                    Additional Information\n                                    <span className=\"optional-badge\">Optional</span>\n                                </h3>\n                                <p className=\"section-description\">\n                                    Help us build a diverse and representative beta reading community.\n                                </p>\n                            </div>\n                            \n                            <div className=\"form-group\">\n                                <label htmlFor=\"accessNeeds\" className=\"form-label\">\n                                    Access Needs & Unique Perspectives\n                                </label>\n                                <textarea \n                                    id=\"accessNeeds\" \n                                    name=\"accessNeeds\" \n                                    className=\"form-textarea\"\n                                    placeholder=\"Do you have any accessibility needs, cultural backgrounds (especially Persian/Middle Eastern), military experience, or other perspectives that would add value to our beta program?\"\n                                    rows={3}\n                                />\n                            </div>\n                            \n                            <div className=\"form-group\">\n                                <label htmlFor=\"demographics\" className=\"form-label\">\n                                    Diversity Information\n                                </label>\n                                <textarea \n                                    id=\"demographics\" \n                                    name=\"demographics\" \n                                    className=\"form-textarea\"\n                                    placeholder=\"Any additional demographic or experience diversity you'd like to share that would improve our beta reader representation?\"\n                                    rows={3}\n                                />\n                                <div className=\"field-help\">\n                                    🌍 We're committed to building an inclusive beta reading community\n                                </div>\n                            </div>\n                        </div>\n\n                        <FormNavigation\n                            onNext={() => {\n                                const form = document.getElementById('stage1-form') as HTMLFormElement;\n                                if (form) {\n                                    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));\n                                }\n                            }}\n                            showPrevious={false}\n                            showNext={true}\n                            showSubmit={false}\n                            isValid={validateStage1()}\n                            currentStage={currentStage}\n                        />\n                    </form>\n                </div>\n            )}\n\n            {/* Stage 2: Enhanced Comprehension Test */}\n            {currentStage === 2 && (\n                <div className=\"stage-content\">\n                    <div className=\"stage-header\">\n                        <div className=\"stage-icon\">\n                            <BookOpen size={24} />\n                        </div>\n                        <div className=\"stage-title-content\">\n                            <h2>Reading Comprehension & Analysis</h2>\n                            <p>Demonstrate your ability to understand complex fiction and provide insightful feedback.</p>\n                            <div className=\"stage-stats\">\n                                <span className=\"stat\"><Timer size={14} /> ~15 minutes</span>\n                                <span className=\"stat\"><Award size={14} /> Up to 60 points</span>\n                            </div>\n                        </div>\n                    </div>\n\n                    <form id=\"stage2-form\" onSubmit={handleStage2Submit} className=\"enhanced-form\">\n                        <div className=\"form-section\">\n                            <div className=\"instructions-card\">\n                                <h3>📖 Instructions</h3>\n                                <p>Read the excerpt below carefully and answer the questions. This tests your ability to parse complex worldbuilding and provide specific, actionable feedback.</p>\n                            </div>\n                            \n                            <div className=\"excerpt-container enhanced\">\n                                <div className=\"excerpt-header\">\n                                    <h4>📜 Sample Excerpt from Zangar Chronicles</h4>\n                                    <div className=\"excerpt-meta\">\n                                        <span className=\"word-count-badge\">~400 words</span>\n                                        <span className=\"genre-badge\">Epic Sci-Fi Fantasy</span>\n                                    </div>\n                                </div>\n                                \n                                <div className=\"excerpt-text-container\">\n                                    <p className=\"excerpt-text\">\n                                        The <em>Vənāsō</em> winds carried more than salt and storm-promise tonight. Hooran felt the weight of unspoken oaths pressing against her temples as she stood upon the Cliffside Sanctum, watching the fires of Spandam flicker like dying stars across the chasm. Each flame represented a choice—empire or kinship, the Saoshyant's path or the old ways of her mothers.\n                                    </p>\n                                    <p className=\"excerpt-text\">\n                                        \"The Zangar expect answers by dawn,\" Cyrus said, his voice cutting through the wind-song. His ceremonial armor caught moonlight like captured ice, each plate inscribed with binding-runes that pulsed faintly blue. \"The Great Assembly grows restless.\"\n                                    </p>\n                                    <p className=\"excerpt-text\">\n                                        Hooran's fingers traced the oath-scar on her palm—the mark that bound her to choices not yet made. Below, the megastructure of Spandam stretched into darkness, its bio-luminescent veins carrying information like blood through stone arteries. Somewhere in those depths, her brother Darius worked the Deep Forges, unaware that his sister's decision would reshape not just their family's fate, but the balance between the Seven Domains.\n                                    </p>\n                                    <p className=\"excerpt-text\">\n                                        \"The winds know,\" she whispered, tasting copper and ozone. \"They've always known.\"\n                                    </p>\n                                </div>\n                            </div>\n\n                            <div className=\"questions-container\">\n                                <div className=\"question-card\">\n                                    <label className=\"form-label required\">\n                                        <span className=\"question-number\">1</span>\n                                        What is the primary source of tension in this scene?\n                                    </label>\n                                    <div className=\"radio-options\">\n                                        <label className=\"radio-option\">\n                                            <input type=\"radio\" name=\"q1\" value=\"a\" required />\n                                            <span>Weather conditions threatening the characters</span>\n                                        </label>\n                                        <label className=\"radio-option correct-answer\">\n                                            <input type=\"radio\" name=\"q1\" value=\"b\" />\n                                            <span>Hooran must choose between competing loyalties by dawn</span>\n                                        </label>\n                                        <label className=\"radio-option\">\n                                            <input type=\"radio\" name=\"q1\" value=\"c\" />\n                                            <span>Cyrus is pressuring Hooran to attack Spandam</span>\n                                        </label>\n                                        <label className=\"radio-option\">\n                                            <input type=\"radio\" name=\"q1\" value=\"d\" />\n                                            <span>The bio-luminescent technology is failing</span>\n                                        </label>\n                                    </div>\n                                </div>\n\n                                <div className=\"question-card\">\n                                    <label htmlFor=\"q2\" className=\"form-label required\">\n                                        <span className=\"question-number\">2</span>\n                                        What role do the \"Vənāsō winds\" serve in this passage?\n                                    </label>\n                                    <textarea \n                                        id=\"q2\"\n                                        name=\"q2\" \n                                        className=\"form-textarea\"\n                                        placeholder=\"Explain in 2-3 sentences how the winds function both literally and symbolically in the scene...\"\n                                        rows={3}\n                                        required\n                                    />\n                                    <div className=\"field-help\">\n                                        💡 Consider both literal and symbolic meanings\n                                    </div>\n                                </div>\n\n                                <div className=\"question-card\">\n                                    <label htmlFor=\"clarity_feedback\" className=\"form-label required\">\n                                        <span className=\"question-number\">3</span>\n                                        Feedback Task: Identify a clarity issue and suggest improvement\n                                    </label>\n                                    <textarea \n                                        id=\"clarity_feedback\"\n                                        name=\"clarity_feedback\" \n                                        className=\"form-textarea\"\n                                        placeholder=\"Point to specific lines that are unclear, explain why they're confusing, and suggest how to improve clarity while maintaining the author's voice...\"\n                                        rows={4}\n                                        required\n                                    />\n                                    <div className=\"field-help\">\n                                        💡 Quote specific text and provide constructive alternatives\n                                    </div>\n                                </div>\n\n                                <div className=\"question-card\">\n                                    <label htmlFor=\"pacing_feedback\" className=\"form-label required\">\n                                        <span className=\"question-number\">4</span>\n                                        Pacing Analysis\n                                    </label>\n                                    <textarea \n                                        id=\"pacing_feedback\"\n                                        name=\"pacing_feedback\" \n                                        className=\"form-textarea\"\n                                        placeholder=\"Analyze the rhythm and flow of this excerpt. Does it feel rushed, too slow, or well-paced? Cite specific examples from the text to support your assessment...\"\n                                        rows={4}\n                                        required\n                                    />\n                                    <div className=\"field-help\">\n                                        💡 Focus on sentence length, paragraph breaks, tension building\n                                    </div>\n                                </div>\n\n                                <div className=\"question-card\">\n                                    <label htmlFor=\"taste_response\" className=\"form-label required\">\n                                        <span className=\"question-number\">5</span>\n                                        Personal Response: What engages or loses you?\n                                    </label>\n                                    <textarea \n                                        id=\"taste_response\"\n                                        name=\"taste_response\" \n                                        className=\"form-textarea\"\n                                        placeholder=\"Be honest about what works or doesn't work for you as a reader. What draws you in? What makes you want to keep reading or puts you off?\"\n                                        rows={3}\n                                        onChange={(e) => updateWordCount('tasteResponse', e.target.value)}\n                                        required\n                                    />\n                                    <WordCounter \n                                        current={wordCounts.tasteResponse} \n                                        max={100} \n                                    />\n                                    <div className=\"field-help\">\n                                        💡 Honest feedback helps us match readers to content\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n\n                        <FormNavigation\n                            onPrevious={goToPreviousStage}\n                            onNext={() => {\n                                const form = document.getElementById('stage2-form') as HTMLFormElement;\n                                if (form) {\n                                    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));\n                                }\n                            }}\n                            showPrevious={true}\n                            showNext={true}\n                            showSubmit={false}\n                            isValid={validateStage2()}\n                            currentStage={currentStage}\n                        />\n                    </form>\n                </div>\n            )}\n\n            {/* Stage 3: Enhanced Calibration Test */}\n            {currentStage === 3 && (\n                <div className=\"stage-content\">\n                    <div className=\"stage-header\">\n                        <div className=\"stage-icon\">\n                            <Target size={24} />\n                        </div>\n                        <div className=\"stage-title-content\">\n                            <h2>Quality Calibration Test</h2>\n                            <p>Compare two writing samples and demonstrate your editorial judgment.</p>\n                            <div className=\"stage-stats\">\n                                <span className=\"stat\"><Timer size={14} /> ~10 minutes</span>\n                                <span className=\"stat\"><Award size={14} /> Up to 40 points</span>\n                            </div>\n                        </div>\n                    </div>\n\n                    <form id=\"stage3-form\" onSubmit={handleStage3Submit} className=\"enhanced-form\">\n                        <div className=\"form-section\">\n                            <div className=\"instructions-card\">\n                                <h3>🎯 Calibration Instructions</h3>\n                                <p>Compare these two passages and identify which needs more revision. Your ability to recognize quality differences is crucial for beta reading.</p>\n                            </div>\n\n                            <div className=\"comparison-container\">\n                                <div className=\"passage-card passage-a\">\n                                    <div className=\"passage-header\">\n                                        <h4>📖 Passage A</h4>\n                                        <div className=\"passage-label\">Sample Writing</div>\n                                    </div>\n                                    <div className=\"passage-content\">\n                                        <p className=\"passage-text\">\n                                            The battle raged across the crystalline plains. Warriors fought with determination. Magic crackled through the air as spells were cast by the mages. It was a significant moment in the war. Many would die. The outcome would affect everyone. The protagonist felt conflicted about their role in the violence.\n                                        </p>\n                                    </div>\n                                </div>\n                                \n                                <div className=\"vs-divider\">\n                                    <div className=\"vs-circle\">VS</div>\n                                </div>\n                                \n                                <div className=\"passage-card passage-b\">\n                                    <div className=\"passage-header\">\n                                        <h4>📖 Passage B</h4>\n                                        <div className=\"passage-label\">Sample Writing</div>\n                                    </div>\n                                    <div className=\"passage-content\">\n                                        <p className=\"passage-text\">\n                                            Kara's blade sang against Varek's shield, the impact reverberating through her bones. Around them, the Shattered Fields erupted in cascades of amber light—each spell-strike from the War-Mages above sending hairline fractures racing through the crystalline ground. She could taste copper and ozone, hear the wet snap of breaking bone somewhere to her left. This was the moment Sehran had warned her about: when ideology met steel, and someone had to choose what they were willing to break.\n                                        </p>\n                                    </div>\n                                </div>\n                            </div>\n\n                            <div className=\"question-card major\">\n                                <label className=\"form-label required\">\n                                    <span className=\"question-number\">⚖️</span>\n                                    Which passage needs more revision?\n                                </label>\n                                <div className=\"radio-options centered\">\n                                    <label className=\"radio-option large correct-answer\">\n                                        <input type=\"radio\" name=\"worse_passage\" value=\"a\" required />\n                                        <span className=\"option-content\">\n                                            <strong>Passage A</strong>\n                                            <small>Needs more work</small>\n                                        </span>\n                                    </label>\n                                    <label className=\"radio-option large\">\n                                        <input type=\"radio\" name=\"worse_passage\" value=\"b\" />\n                                        <span className=\"option-content\">\n                                            <strong>Passage B</strong>\n                                            <small>Needs more work</small>\n                                        </span>\n                                    </label>\n                                </div>\n                            </div>\n\n                            <div className=\"analysis-grid\">\n                                <div className=\"question-card\">\n                                    <label htmlFor=\"passage_a_analysis\" className=\"form-label required\">\n                                        <span className=\"question-number\">A</span>\n                                        Analysis of Passage A\n                                    </label>\n                                    <textarea \n                                        id=\"passage_a_analysis\"\n                                        name=\"passage_a_analysis\" \n                                        className=\"form-textarea\"\n                                        placeholder=\"Identify specific strengths and weaknesses in Passage A. What works well? What needs improvement? Be specific and cite examples...\"\n                                        rows={4}\n                                        required\n                                    />\n                                </div>\n\n                                <div className=\"question-card\">\n                                    <label htmlFor=\"passage_b_analysis\" className=\"form-label required\">\n                                        <span className=\"question-number\">B</span>\n                                        Analysis of Passage B\n                                    </label>\n                                    <textarea \n                                        id=\"passage_b_analysis\"\n                                        name=\"passage_b_analysis\" \n                                        className=\"form-textarea\"\n                                        placeholder=\"Identify specific strengths and weaknesses in Passage B. What works well? What needs improvement? Be specific and cite examples...\"\n                                        rows={4}\n                                        required\n                                    />\n                                </div>\n                            </div>\n\n                            <div className=\"question-card priority\">\n                                <label htmlFor=\"priority_fix\" className=\"form-label required\">\n                                    <span className=\"question-number\">🔧</span>\n                                    Priority Fix Recommendation\n                                </label>\n                                <textarea \n                                    id=\"priority_fix\"\n                                    name=\"priority_fix\" \n                                    className=\"form-textarea\"\n                                    placeholder=\"If you could only fix one thing across both passages, what would it be? Choose the highest-impact problem and provide a concrete, actionable solution...\"\n                                    rows={4}\n                                    required\n                                />\n                                <div className=\"field-help\">\n                                    💡 Focus on the change that would have the biggest positive impact\n                                </div>\n                            </div>\n                        </div>\n\n                        <FormNavigation\n                            onPrevious={goToPreviousStage}\n                            onNext={() => {\n                                const form = document.getElementById('stage2-form') as HTMLFormElement;\n                                if (form) {\n                                    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));\n                                }\n                            }}\n                            showPrevious={true}\n                            showNext={true}\n                            showSubmit={false}\n                            isValid={validateStage2()}\n                            currentStage={currentStage}\n                        />\n                    </form>\n                </div>\n            )}\n\n            {/* Stage 4: Enhanced Trial Task */}\n            {currentStage === 4 && (\n                <div className=\"stage-content\">\n                    <div className=\"stage-header\">\n                        <div className=\"stage-icon timer\">\n                            <Timer size={24} />\n                        </div>\n                        <div className=\"stage-title-content\">\n                            <h2>Timed Beta Reading Trial</h2>\n                            <p>Complete a full beta reading task under realistic conditions.</p>\n                            <div className=\"stage-stats\">\n                                <span className=\"stat urgent\"><Timer size={14} /> 48 hour deadline</span>\n                                <span className=\"stat\"><Award size={14} /> Up to 60 points</span>\n                            </div>\n                        </div>\n                    </div>\n\n                    {/* Enhanced Timer */}\n                    <div className=\"timer-display\">\n                        <div className=\"timer-icon\">\n                            <Timer size={32} />\n                        </div>\n                        <div className=\"timer-content\">\n                            <div className=\"timer-label\">Time Remaining</div>\n                            <div className=\"timer-value\">{formatTime(timeRemaining)}</div>\n                            <div className=\"timer-status\">\n                                {timeRemaining > 24 * 60 * 60 ? (\n                                    <span className=\"status good\">✅ Plenty of time</span>\n                                ) : timeRemaining > 12 * 60 * 60 ? (\n                                    <span className=\"status warning\">⚠️ Moderate urgency</span>\n                                ) : (\n                                    <span className=\"status urgent\">🚨 High urgency</span>\n                                )}\n                            </div>\n                        </div>\n                    </div>\n\n                    <form id=\"stage4-form\" onSubmit={handleStage4Submit} className=\"enhanced-form\">\n                        {/* Rest of Stage 4 content... */}\n                        <div className=\"form-section\">\n                            <div className=\"instructions-card urgent\">\n                                <h3>⏱️ Trial Task Instructions</h3>\n                                <p>This simulates real beta reading conditions. Read the chapter excerpt and provide comprehensive feedback as you would for an actual beta assignment.</p>\n                                <div className=\"requirements-list\">\n                                    <div className=\"requirement\"><Check size={16} /> Overall assessment (200-300 words)</div>\n                                    <div className=\"requirement\"><Check size={16} /> Minimum 8 inline comments</div>\n                                    <div className=\"requirement\"><Check size={16} /> Chapter summary</div>\n                                    <div className=\"requirement\"><Check size={16} /> Complete within 48 hours</div>\n                                </div>\n                            </div>\n\n                            {/* Task content would continue here... */}\n                        </div>\n\n                        <FormNavigation\n                            onPrevious={goToPreviousStage}\n                            onSubmit={() => {\n                                const form = document.getElementById('stage4-form') as HTMLFormElement;\n                                if (form) {\n                                    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));\n                                }\n                            }}\n                            showPrevious={true}\n                            showNext={false}\n                            showSubmit={true}\n                            isValid={validateStage4()}\n                            isLoading={isSaving}\n                            currentStage={currentStage}\n                        />\n                    </form>\n                </div>\n            )}\n\n            {/* Enhanced Final Results */}\n            {currentStage === 5 && (\n                <div className=\"stage-content\">\n                    <div className=\"results-display\">\n                        <div className=\"results-header\">\n                            <div className=\"success-icon\">\n                                <CheckCircle2 size={48} />\n                            </div>\n                            <h2>Application Submitted Successfully!</h2>\n                            <p>Your beta reader application has been completed and submitted for review.</p>\n                        </div>\n\n                        <div className=\"score-summary\">\n                            <h3>Your Performance Summary</h3>\n                            <div className=\"score-grid\">\n                                <div className=\"score-card\">\n                                    <div className=\"score-header\">\n                                        <UserIcon size={20} />\n                                        <span>Stage 1: Application</span>\n                                    </div>\n                                    <div className=\"score-value\">{applicationData.stage1?.rawScore || 0}/100</div>\n                                    <div className=\"score-status\">\n                                        {applicationData.stage1?.passed ? \n                                            <span className=\"passed\">✅ Passed</span> : \n                                            <span className=\"failed\">❌ Not Passed</span>\n                                        }\n                                    </div>\n                                </div>\n                                \n                                <div className=\"score-card\">\n                                    <div className=\"score-header\">\n                                        <BookOpen size={20} />\n                                        <span>Stage 2: Comprehension</span>\n                                    </div>\n                                    <div className=\"score-value\">{applicationData.stage2?.rawScore || 0}/60</div>\n                                    <div className=\"score-status\">\n                                        {applicationData.stage2?.passed ? \n                                            <span className=\"passed\">✅ Passed</span> : \n                                            <span className=\"failed\">❌ Not Passed</span>\n                                        }\n                                    </div>\n                                </div>\n                                \n                                <div className=\"score-card\">\n                                    <div className=\"score-header\">\n                                        <Target size={20} />\n                                        <span>Stage 3: Calibration</span>\n                                    </div>\n                                    <div className=\"score-value\">{applicationData.stage3?.rawScore || 0}/40</div>\n                                    <div className=\"score-status\">\n                                        {applicationData.stage3?.passed ? \n                                            <span className=\"passed\">✅ Passed</span> : \n                                            <span className=\"failed\">❌ Not Passed</span>\n                                        }\n                                    </div>\n                                </div>\n                                \n                                <div className=\"score-card\">\n                                    <div className=\"score-header\">\n                                        <Timer size={20} />\n                                        <span>Stage 4: Trial Task</span>\n                                    </div>\n                                    <div className=\"score-value\">{applicationData.stage4?.rawScore || 0}/60</div>\n                                    <div className=\"score-status\">\n                                        {applicationData.stage4?.passed ? \n                                            <span className=\"passed\">✅ Passed</span> : \n                                            <span className=\"failed\">❌ Not Passed</span>\n                                        }\n                                    </div>\n                                </div>\n                            </div>\n                            \n                            <div className=\"composite-score\">\n                                <div className=\"composite-icon\">\n                                    <Award size={28} />\n                                </div>\n                                <div className=\"composite-content\">\n                                    <div className=\"composite-label\">Final Composite Score</div>\n                                    <div className=\"composite-value\">{applicationData.compositeScore || 0}/100</div>\n                                </div>\n                            </div>\n                        </div>\n\n                        <div className=\"next-steps-card\">\n                            <h3>📋 What Happens Next?</h3>\n                            <div className=\"timeline\">\n                                <div className=\"timeline-item\">\n                                    <div className=\"timeline-dot\">1</div>\n                                    <div className=\"timeline-content\">\n                                        <strong>Review Period</strong>\n                                        <p>Our team reviews all applications (1-2 weeks)</p>\n                                    </div>\n                                </div>\n                                <div className=\"timeline-item\">\n                                    <div className=\"timeline-dot\">2</div>\n                                    <div className=\"timeline-content\">\n                                        <strong>Notification</strong>\n                                        <p>You'll receive an email about your application status</p>\n                                    </div>\n                                </div>\n                                <div className=\"timeline-item\">\n                                    <div className=\"timeline-dot\">3</div>\n                                    <div className=\"timeline-content\">\n                                        <strong>Beta Portal Access</strong>\n                                        <p>Selected readers get exclusive portal access and materials</p>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            )}\n        </div>\n    );\n};\n\nexport default BetaApplication;