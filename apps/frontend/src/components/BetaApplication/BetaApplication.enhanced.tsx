import React, { useState, useEffect } from 'react';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { ChevronLeft, ChevronRight, Clock, Check, AlertCircle, User as UserIcon, FileText, Target, PlayCircle } from 'lucide-react';

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
            description: "Personal Information & Commitment" 
        },
        { 
            id: 2, 
            label: "Comprehension", 
            icon: FileText, 
            description: "Reading & Analysis Skills" 
        },
        { 
            id: 3, 
            label: "Calibration", 
            icon: Target, 
            description: "Quality Assessment" 
        },
        { 
            id: 4, 
            label: "Trial Task", 
            icon: PlayCircle, 
            description: "Timed Beta Reading Exercise" 
        }
    ];

    return (
        <div className="progress-stepper">
            {steps.map((step, index) => {
                const isCompleted = completedStages.has(step.id);
                const isCurrent = step.id === currentStage;
                const isAccessible = step.id <= currentStage || isCompleted;
                const IconComponent = step.icon;

                return (
                    <div key={step.id} className="step-container">
                        <div 
                            className={`step-item ${
                                isCompleted ? 'completed' : isCurrent ? 'current' : 'upcoming'
                            } ${isAccessible ? 'accessible' : ''}`}
                            onClick={() => isAccessible && onStageClick(step.id)}
                        >
                            <div className="step-icon">
                                {isCompleted ? (
                                    <Check size={20} />
                                ) : (
                                    <IconComponent size={20} />
                                )}
                            </div>
                            <div className="step-content">
                                <div className="step-label">{step.label}</div>
                                <div className="step-description">{step.description}</div>
                            </div>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`step-connector ${isCompleted ? 'completed' : ''}`} />
                        )}
                    </div>
                );
            })}
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
}> = ({ onPrevious, onNext, onSubmit, showPrevious, showNext, showSubmit, isValid, isLoading = false }) => {
    return (
        <div className="form-navigation">
            <div className="nav-left">
                {showPrevious && (
                    <button
                        type="button"
                        onClick={onPrevious}
                        className="btn btn-secondary"
                        disabled={isLoading}
                    >
                        <ChevronLeft size={16} />
                        Previous
                    </button>
                )}
            </div>
            <div className="nav-right">
                {showNext && (
                    <button
                        type="button"
                        onClick={onNext}
                        className="btn btn-primary"
                        disabled={!isValid || isLoading}
                    >
                        Next
                        <ChevronRight size={16} />
                    </button>
                )}
                {showSubmit && (
                    <button
                        type="submit"
                        onClick={onSubmit}
                        className="btn btn-primary"
                        disabled={!isValid || isLoading}
                    >
                        {isLoading ? (
                            <>
                                <div className="spinner" />
                                Submitting...
                            </>
                        ) : (
                            'Submit Application'
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

// Word Counter Component
const WordCounter: React.FC<{
    current: number;
    min?: number;
    max: number;
    className?: string;
}> = ({ current, min = 0, max, className = '' }) => {
    const getStatus = () => {
        if (min > 0 && current < min) return 'error';
        if (current > max) return 'error';
        if (current > max * 0.9) return 'warning';
        return 'success';
    };

    return (
        <div className={`word-counter ${getStatus()} ${className}`}>
            <span className="count">{current}</span>
            <span className="separator">/</span>
            <span className="limit">{max}</span>
            <span className="label">words</span>
            {min > 0 && current < min && (
                <span className="requirement">({min} minimum)</span>
            )}
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
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [timeRemaining, setTimeRemaining] = useState(48 * 60 * 60);
    
    // Form validation state
    const [stage1Valid, setStage1Valid] = useState(false);
    const [stage2Valid, setStage2Valid] = useState(false);
    const [stage3Valid, setStage3Valid] = useState(false);
    const [stage4Valid, setStage4Valid] = useState(false);
    
    // Word counts
    const [wordCounts, setWordCounts] = useState<Record<string, number>>({});

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
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
        if (stage <= currentStage || completedStages.has(stage)) {
            setCurrentStage(stage);
        }
    };

    const goToNextStage = () => {
        const nextStage = currentStage + 1;
        setCompletedStages(prev => new Set([...prev, currentStage]));
        setCurrentStage(nextStage);
    };

    const goToPreviousStage = () => {
        if (currentStage > 1) {
            setCurrentStage(currentStage - 1);
        }
    };

    // Form validation
    const validateStage1 = (formData: FormData) => {
        const errors: Record<string, string> = {};
        
        if (!formData.get('fullName')) errors.fullName = 'Full name is required';
        if (!formData.get('email')) errors.email = 'Email is required';
        if (!formData.get('timeZone')) errors.timeZone = 'Time zone is required';
        if (!formData.get('betaCommitment')) errors.betaCommitment = 'Commitment level is required';
        if (!formData.get('hoursPerWeek')) errors.hoursPerWeek = 'Time availability is required';
        if (!formData.get('portalUse')) errors.portalUse = 'Portal usage preference is required';
        
        const interestWords = countWords(formData.get('interestStatement') as string || '');
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
        setStage1Valid(Object.keys(errors).length === 0);
        return Object.keys(errors).length === 0;
    };

    // Form submission handlers
    const handleStage1Submit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        
        if (!validateStage1(formData)) {
            return;
        }
        
        // Processing logic (similar to original)
        const data = Object.fromEntries(formData.entries());
        const devices = Array.from(document.querySelectorAll('input[name="devices"]:checked')).map(cb => (cb as HTMLInputElement).value);
        (data as any).devices = devices;
        
        // Calculate scores (same logic as original)
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

        stage1Score = Math.min(stage1Score, 20);

        let genreAlignmentScore = 0;
        if ((data.recentReads as string).length > 0 && (data.interestStatement as string).length > 0) {
            genreAlignmentScore = 10;
        }
        stage1Score += genreAlignmentScore;

        let feedbackExperienceScore = 0;
        if ((data.priorBeta as string).length > 0 && (data.feedbackPhilosophy as string).length > 0) {
            feedbackExperienceScore = 10;
        }
        stage1Score += feedbackExperienceScore;

        let reliabilityScore = 0;
        if ((data.trackRecord as string).length > 0 && (data.communication as string).length > 0) {
            reliabilityScore = 10;
        }
        stage1Score += reliabilityScore;

        let diversityCoverageScore = 0;
        const deviceCount = devices.length;
        if (deviceCount === 3) diversityCoverageScore += 6;
        else if (deviceCount === 2) diversityCoverageScore += 4;
        else if (deviceCount === 1) diversityCoverageScore += 2;
        
        diversityCoverageScore = Math.min(diversityCoverageScore, 20);
        stage1Score += diversityCoverageScore;

        const passThreshold = 50;
        let stage1Passed = (stage1Score >= passThreshold) && !autoFail;

        setApplicationData(prevData => ({ ...prevData, stage1: { ...data, rawScore: stage1Score, passed: stage1Passed, autoFail: autoFail } }));
        
        goToNextStage();
    };

    // Similar handlers for other stages (shortened for brevity)
    const handleStage2Submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Stage 2 logic...
        goToNextStage();
    };

    const handleStage3Submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Stage 3 logic...
        goToNextStage();
    };

    const handleStage4Submit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Stage 4 logic and database save...
        setCurrentStage(5); // Final results
    };

    if (isLoading) {
        return (
            <div className="beta-app-loading">
                <div className="spinner large" />
                <p>Loading your application...</p>
            </div>
        );
    }

    if (applicationStatus) {
        return (
            <div className="beta-app-container">
                <div className="status-display">
                    <div className="status-icon">
                        <Check size={48} />
                    </div>
                    <h2>Application Already Submitted</h2>
                    <p>Thank you for your interest in the Zangar/Spandam Beta Reader Program.</p>
                    <div className="status-details">
                        <p><strong>Submitted:</strong> {new Date(applicationStatus.created_at).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> Under Review</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="beta-app-container">
            {/* Enhanced Header */}
            <div className="beta-app-header">
                <h1>Zangar/Spandam Beta Reader Program</h1>
                <p>Join our exclusive community of beta readers for epic sci-fi/fantasy</p>
                <div className="program-highlights">
                    <span className="highlight">6-8 Week Program</span>
                    <span className="highlight">Exclusive Content</span>
                    <span className="highlight">Author Access</span>
                </div>
            </div>

            {/* Enhanced Progress Indicator */}
            <ProgressStepper 
                currentStage={currentStage}
                completedStages={completedStages}
                onStageClick={goToStage}
            />

            {/* Stage 1: Application Form */}
            {currentStage === 1 && (
                <div className="stage-content">
                    <div className="stage-header">
                        <h2>Personal Information & Commitment</h2>
                        <p>Tell us about yourself and your commitment to the beta reading program.</p>
                    </div>

                    <form onSubmit={handleStage1Submit} className="enhanced-form">
                        {/* Contact Information Section */}
                        <div className="form-section">
                            <h3 className="section-title">
                                <UserIcon size={20} />
                                Contact Information
                            </h3>
                            
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="fullName" className="required">Full Name</label>
                                    <input 
                                        type="text" 
                                        id="fullName" 
                                        name="fullName" 
                                        className={`form-control ${formErrors.fullName ? 'error' : ''}`}
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
                                    <label htmlFor="email" className="required">Email Address</label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email" 
                                        className={`form-control ${formErrors.email ? 'error' : ''}`}
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
                            
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="timeZone" className="required">Time Zone</label>
                                    <select 
                                        id="timeZone" 
                                        name="timeZone" 
                                        className={`form-control ${formErrors.timeZone ? 'error' : ''}`}
                                        required
                                    >
                                        <option value="">Select your time zone</option>
                                        <option value="America/New_York">Eastern Time (UTC-5/-4)</option>
                                        <option value="America/Chicago">Central Time (UTC-6/-5)</option>
                                        <option value="America/Denver">Mountain Time (UTC-7/-6)</option>
                                        <option value="America/Los_Angeles">Pacific Time (UTC-8/-7)</option>
                                        <option value="Europe/London">GMT/BST (UTC+0/+1)</option>
                                        <option value="Europe/Paris">CET/CEST (UTC+1/+2)</option>
                                        <option value="Asia/Tokyo">JST (UTC+9)</option>
                                        <option value="Australia/Sydney">AEST/AEDT (UTC+10/+11)</option>
                                    </select>
                                    {formErrors.timeZone && (
                                        <div className="error-message">
                                            <AlertCircle size={14} />
                                            {formErrors.timeZone}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="country">Country</label>
                                    <input 
                                        type="text" 
                                        id="country" 
                                        name="country" 
                                        className="form-control"
                                        placeholder="Your country"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="goodreads">Goodreads Profile (Optional)</label>
                                <input 
                                    type="url" 
                                    id="goodreads" 
                                    name="goodreads" 
                                    className="form-control"
                                    placeholder="https://goodreads.com/user/..."
                                />
                            </div>
                        </div>

                        {/* Commitment Section */}
                        <div className="form-section">
                            <h3 className="section-title">
                                <Clock size={20} />
                                Commitment & Availability
                                <span className="points-badge">Max 20 points</span>
                            </h3>
                            
                            <div className="form-group">
                                <label className="required">Beta Window Commitment (6-8 weeks)</label>
                                <div className="radio-group">
                                    <label className="radio-item">
                                        <input 
                                            type="radio" 
                                            name="betaCommitment" 
                                            value="weekly_deadlines"
                                            required
                                        />
                                        <span className="radio-label">
                                            <span className="option-title">Weekly Deadlines</span>
                                            <span className="option-points">10 points</span>
                                        </span>
                                        <span className="option-description">
                                            I can commit to weekly deadlines consistently
                                        </span>
                                    </label>
                                    
                                    <label className="radio-item">
                                        <input 
                                            type="radio" 
                                            name="betaCommitment" 
                                            value="commit_with_extensions"
                                        />
                                        <span className="radio-label">
                                            <span className="option-title">Flexible Commitment</span>
                                            <span className="option-points">6 points</span>
                                        </span>
                                        <span className="option-description">
                                            I can commit but may need 1+ extensions
                                        </span>
                                    </label>
                                    
                                    <label className="radio-item">
                                        <input 
                                            type="radio" 
                                            name="betaCommitment" 
                                            value="prefer_flexible"
                                        />
                                        <span className="radio-label">
                                            <span className="option-title">Flexible Deadlines</span>
                                            <span className="option-points">3 points</span>
                                        </span>
                                        <span className="option-description">
                                            I prefer flexible deadlines
                                        </span>
                                    </label>
                                    
                                    <label className="radio-item warning">
                                        <input 
                                            type="radio" 
                                            name="betaCommitment" 
                                            value="no_commitment"
                                        />
                                        <span className="radio-label">
                                            <span className="option-title">No Commitment</span>
                                            <span className="option-points">0 points</span>
                                        </span>
                                        <span className="option-description">
                                            I cannot commit to deadlines (auto-disqualifies)
                                        </span>
                                    </label>
                                </div>
                                {formErrors.betaCommitment && (
                                    <div className="error-message">
                                        <AlertCircle size={14} />
                                        {formErrors.betaCommitment}
                                    </div>
                                )}
                            </div>

                            {/* Continue with other commitment fields... */}
                        </div>

                        {/* Continue with other sections... */}

                        <FormNavigation
                            onNext={() => document.getElementById('stage1-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
                            showPrevious={false}
                            showNext={true}
                            showSubmit={false}
                            isValid={stage1Valid}
                        />
                    </form>
                </div>
            )}

            {/* Other stages would be similarly enhanced... */}
            {currentStage === 2 && (
                <div className="stage-content">
                    <div className="stage-header">
                        <h2>Reading Comprehension & Taste Assessment</h2>
                        <p>Demonstrate your ability to analyze complex fiction and provide constructive feedback.</p>
                    </div>
                    {/* Enhanced Stage 2 content... */}
                </div>
            )}

            {/* Continue with other stages... */}
        </div>
    );
};

export default BetaApplication;