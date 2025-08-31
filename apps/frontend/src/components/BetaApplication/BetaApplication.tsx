import React, { useState, useEffect } from 'react';

import './BetaApplication.css'; // Import the CSS file

interface StageData {
    rawScore: number;
    passed: boolean;
    autoFail?: boolean;
    [key: string]: any; // Allow other properties
}

interface ApplicationData {
    stage1?: StageData;
    stage2?: StageData;
    stage3?: StageData;
    stage4?: StageData;
    compositeScore?: number;
    // Add other top-level properties if they exist
}

const BetaApplication: React.FC = () => {
    // Application State
    const [currentStage, setCurrentStage] = useState<number>(1);
    const [applicationData, setApplicationData] = useState<ApplicationData>({});
    const [commentCount, setCommentCount] = useState(1);
    const [timeRemaining, setTimeRemaining] = useState(48 * 60 * 60); // 48 hours in seconds

    // Define the steps for the mountain stepper
    const steps = [
        { label: "Application" },
        { label: "Comprehension" },
        { label: "Calibration" },
        { label: "Trial Task" }
    ];

    // MountainIcon component (adapted from provided React component)
    const MountainIcon: React.FC<{ state: 'done' | 'current' | 'upcoming' }> = ({ state }) => {
        const fill = state === "done" ? "#10B981" : state === "current" ? "#60A5FA" : "#6B7280";
        const cap = state === "upcoming" ? "#9CA3AF" : "#E5E7EB";
        return (
            <svg viewBox="0 0 64 40" width="36" height="24" className={`mountain-icon ${state}`} aria-hidden>
                <path d="M2 38 L20 12 L28 22 L40 4 L62 38 Z" fill={fill} stroke={fill} strokeWidth="1.5"/>
                <path d="M20 12 L24 18 L16 18 Z" fill={cap}/>
                <path d="M40 4 L44 12 L36 12 Z" fill={cap}/>
            </svg>
        );
    };

    // Connector component (adapted from provided React component)
    const Connector: React.FC<{ done: boolean }> = ({ done }) => (
        <div className={`connector ${done ? 'done' : ''}`} />
    );

    // Function to render the mountain stepper (JSX directly in render)
    const renderMountainStepper = () => {
        return (
            <div className="mountain-stepper">
                <Connector done={currentStage > 0} />
                {steps.map((step, i) => {
                    const stageIndex = i + 1;
                    const state = stageIndex < currentStage ? "done" : stageIndex === currentStage ? "current" : "upcoming";
                    return (
                        <React.Fragment key={step.label}>
                            <div className="mountain-step-container" onClick={() => showStage(stageIndex)}>
                                <MountainIcon state={state} />
                                <span className={`mountain-label ${state}`}>{step.label}</span>
                            </div>
                            <Connector done={stageIndex < currentStage} />
                        </React.Fragment>
                    );
                })}
            </div>
        );
    };

    // Stage Navigation
            const showStage = (stage: number) => {
                setCurrentStage(6);
    };

    // Word count functionality
    const updateWordCount = (textareaId: string, counterId: string, min: number, max: number) => {
        const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
        const counter = document.getElementById(counterId) as HTMLDivElement;
        
        if (textarea && counter) {
            const words = textarea.value.trim().split(/\s+/).filter(word => word.length > 0).length;
            counter.textContent = `${words}/${max} words`;
            
            counter.className = 'word-count';
            if (words < min) counter.classList.add('error');
            else if (words > max * 0.9) counter.classList.add('warning');
        }
    };

    // useEffect for word counters (initial setup and re-render)
    useEffect(() => {
        updateWordCount('interestStatement', 'interestWordCount', 150, 250);
        updateWordCount('taste_response', 'tasteWordCount', 0, 100);
        updateWordCount('overall_assessment', 'assessmentWordCount', 200, 300);
    }, [currentStage]); // Re-run when stage changes to re-attach listeners if elements are re-rendered

    // Timer functionality
    useEffect(() => {
        let timerInterval: NodeJS.Timeout;
        if (currentStage === 4) { // Only start timer when on Stage 4
            timerInterval = setInterval(() => {
                setTimeRemaining(prevTime => {
                    if (prevTime <= 0) {
                        clearInterval(timerInterval);
                        alert('Time expired! Your submission may be marked as late.');
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerInterval);
    }, [currentStage]); // Start/clear timer when stage changes

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Form submission handlers
    const handleApplicationFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());
        
        const devices = Array.from(document.querySelectorAll('input[name="devices"]:checked')).map(cb => (cb as HTMLInputElement).value);
        (data as any).devices = devices;
        
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
        
        showStage(2);
    };

    const handleStage2FormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());
        
        let stage2Score = 0;
        const maxScore = 60;
        const passThreshold = 38;

        if (data.q1 === 'b') stage2Score += 20;

        if ((data.clarity_feedback as string).length > 0 && (data.pacing_feedback as string).length > 0) {
            stage2Score += 15;
        }

        if ((data.taste_response as string).length > 0) {
            stage2Score += 5;
        }

        let stage2Passed = (stage2Score >= passThreshold);

        setApplicationData(prevData => ({ ...prevData, stage2: { ...data, rawScore: stage2Score, passed: stage2Passed } }));
        
        showStage(3);
    };

    const handleStage3FormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());
        
        let stage3Score = 0;
        const maxScore = 40;
        const passThreshold = 26;

        if (data.worse_passage === 'a') stage3Score += 15;

        if ((data.passage_a_analysis as string).length > 0 && (data.passage_b_analysis as string).length > 0 && (data.priority_fix as string).length > 0) {
            stage3Score += 5;
        }

        let stage3Passed = (stage3Score >= passThreshold);

        setApplicationData(prevData => ({ ...prevData, stage3: { ...data, rawScore: stage3Score, passed: stage3Passed } }));
        
        showStage(4);
    };

    const handleStage4FormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());
        
        let stage4Score = 0;
        const maxScore = 60;
        const passThreshold = 40;

        if (timeRemaining > 0) {
            stage4Score += 10;
        } else {
            stage4Score += 0;
        }

        const inlineComments = document.querySelectorAll('.inline-comment'); // Still relies on DOM query
        if ((data.overall_assessment as string).length > 0 && (data.chapter_summary as string).length > 0 && inlineComments.length >= 8) {
            stage4Score += 10;
        } else if ((data.overall_assessment as string).length > 0 && (data.chapter_summary as string).length > 0 && inlineComments.length >= 4) {
            stage4Score += 5;
        }

        if (inlineComments.length > 0) {
            stage4Score += 10;
        }
        if ((data.chapter_summary as string).length > 0) {
            stage4Score += 10;
        }

        let stage4Passed = (stage4Score >= passThreshold);

        setApplicationData(prevData => ({ ...prevData, stage4: { ...data, rawScore: stage4Score, passed: stage4Passed } }));
        
        // Calculate final composite score
        const weights = { stage1: 0.20, stage2: 0.25, stage3: 0.20, stage4: 0.35 };
        const composite = 
            ((applicationData as any).stage1.rawScore / 100) * (weights.stage1 * 100) +
            ((applicationData as any).stage2.rawScore / 60) * (weights.stage2 * 100) +
            ((applicationData as any).stage3.rawScore / 40) * (weights.stage3 * 100) +
            ((applicationData as any).stage4.rawScore / 60) * (weights.stage4 * 100);
        
        setApplicationData(prevData => ({ ...prevData, compositeScore: Math.round(composite * 10) / 10 }));
        
        setCurrentStage(6);

        // Prepare data for Supabase insertion
        const applicationToSave = {
            user_id: (await supabase.auth.getUser()).data.user?.id, // Get current user ID
            full_name: (applicationData as any).stage1.fullName,
            email: (applicationData as any).stage1.email,
            time_zone: (applicationData as any).stage1.timeZone,
            country: (applicationData as any).stage1.country,
            goodreads: (applicationData as any).stage1.goodreads,
            beta_commitment: (applicationData as any).stage1.betaCommitment,
            hours_per_week: (applicationData as any).stage1.hoursPerWeek,
            portal_use: (applicationData as any).stage1.portalUse,
            recent_reads: (applicationData as any).stage1.recentReads,
            interest_statement: (applicationData as any).stage1.interestStatement,
            prior_beta: (applicationData as any).stage1.priorBeta,
            feedback_philosophy: (applicationData as any).stage1.feedbackPhilosophy,
            track_record: (applicationData as any).stage1.trackRecord,
            communication: (applicationData as any).stage1.communication,
            devices: (applicationData as any).stage1.devices,
            access_needs: (applicationData as any).stage1.accessNeeds,
            demographics: (applicationData as any).stage1.demographics,
            stage1_raw_score: (applicationData as any).stage1.rawScore,
            stage1_passed: (applicationData as any).stage1.passed,
            stage1_auto_fail: (applicationData as any).stage1.autoFail,

            q1: (applicationData as any).stage2.q1,
            q2: (applicationData as any).stage2.q2,
            clarity_feedback: (applicationData as any).stage2.clarity_feedback,
            pacing_analysis: (applicationData as any).stage2.pacing_feedback, // Note: schema uses pacing_analysis, form uses pacing_feedback
            taste_alignment: (applicationData as any).stage2.taste_response, // Note: schema uses taste_alignment, form uses taste_response
            stage2_raw_score: (applicationData as any).stage2.rawScore,
            stage2_passed: (applicationData as any).stage2.passed,

            worse_passage: (applicationData as any).stage3.worse_passage,
            passage_a_analysis: (applicationData as any).stage3.passage_a_analysis,
            passage_b_analysis: (applicationData as any).stage3.passage_b_analysis,
            priority_fix: (applicationData as any).stage3.priority_fix,
            stage3_raw_score: (applicationData as any).stage3.rawScore,
            stage3_passed: (applicationData as any).stage3.passed,

            overall_assessment: (applicationData as any).stage4.overall_assessment,
            chapter_summary: (applicationData as any).stage4.chapter_summary,
            stage4_raw_score: (applicationData as any).stage4.rawScore,
            stage4_passed: (applicationData as any).stage4.passed,
            composite_score: (applicationData as any).compositeScore,
        };

        const { error } = await supabase
            .from('beta_applications')
            .insert([applicationToSave]);

        if (error) {
            console.error('Error saving beta application:', error);
            alert('There was an error saving your application. Please try again.');
        } else {
            console.log('Beta application saved successfully!');
            // Optionally, redirect to a success page or show a success message
        }
    };

    // Add comment functionality
    const addComment = () => {
        setCommentCount(prevCount => prevCount + 1);
    };

    // Final results display
    const showFinalResults = () => {
        // This part will be rendered conditionally in JSX
    };

    return (
        <div className="beta-app-container">
            <div className="beta-app-header">
                <h1>Zangar/Spandam Beta Reader Program</h1>
                <p>Join our exclusive beta reading community for epic sci-fi/fantasy</p>
            </div>

            {/* Stage Indicator (Mountain Stepper) */}
            {renderMountainStepper()}

            {/* Stage 1: Application Form */}
            {currentStage === 1 && (
                <div id="stage1" className="stage-content">
                    <form onSubmit={handleApplicationFormSubmit}>
                        {/* Identity Section */}
                        <div className="form-section">
                            <h3 className="section-title">Contact Information</h3>
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name *</label>
                                <input type="text" id="fullName" name="fullName" className="form-control" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email Address *</label>
                                <input type="email" id="email" name="email" className="form-control" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="timeZone">Time Zone *</label>
                                <select id="timeZone" name="timeZone" className="form-control" required>
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
                            </div>
                            <div className="form-group">
                                <label htmlFor="country">Country</label>
                                <input type="text" id="country" name="country" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="goodreads">Goodreads Profile (optional)</label>
                                <input type="text" id="goodreads" name="goodreads" className="form-control" placeholder="https://goodreads.com/user/..." />
                            </div>
                        </div>

                        {/* Commitment Section */}
                        <div className="form-section">
                            <h3 className="section-title">Commitment & Availability (Max 20 pts)</h3>
                            <div className="form-group">
                                <label htmlFor="betaCommitment">Beta Window Commitment (6-8 weeks) *</label>
                                <select id="betaCommitment" name="betaCommitment" className="form-control" required>
                                    <option value="">Select your commitment level</option>
                                    <option value="weekly_deadlines">I can commit to weekly deadlines (10 pts)</option>
                                    <option value="commit_with_extensions">I can commit but may need 1+ extensions (6 pts)</option>
                                    <option value="prefer_flexible">I prefer flexible deadlines (3 pts)</option>
                                    <option value="no_commitment">I cannot commit to deadlines (0 pts)</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="hoursPerWeek">Time Budget per Week *</label>
                                <select id="hoursPerWeek" name="hoursPerWeek" className="form-control" required>
                                    <option value="">Select your time availability</option>
                                    <option value="5_plus">5+ hours per week (5 pts)</option>
                                    <option value="3_4">3-4 hours per week (3 pts)</option>
                                    <option value="under_3">Less than 3 hours (0 pts)</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="portalUse">Website Portal Usage *</label>
                                <select id="portalUse" name="portalUse" className="form-control" required>
                                    <option value="">Select your comfort level</option>
                                    <option value="yes_comfortable">Yes, I'm comfortable using web tools (5 pts)</option>
                                    <option value="yes_unsure">Yes, but I'm unsure about tech (2 pts)</option>
                                    <option value="no">No, I prefer other methods (0 pts)</option>
                                </select>
                            </div>
                        </div>

                        {/* Genre Alignment */}
                        <div className="form-section">
                            <h3 className="section-title">Genre/Series Alignment (Max 20 pts)</h3>
                            <div className="form-group">
                                <label htmlFor="recentReads">Recent Relevant Reads</label>
                                <textarea id="recentReads" name="recentReads" className="form-control" placeholder="List 3-5 books you've read in the last 12 months that relate to epic sci-fi/fantasy, Persian/Zoroastrian themes, or big-idea worldbuilding..."></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="interestStatement">Why This Series? (150-250 words) *</label>
                                <textarea id="interestStatement" name="interestStatement" className="form-control" placeholder="What specifically interests you about the Zangar/Spandam series? Mention themes like empire vs. kinship, oath/fate dynamics, cliffside megastructures, etc." required></textarea>
                                <div className="word-count" id="interestWordCount">0/250 words</div>
                            </div>
                        </div>

                        {/* Feedback Experience */}
                        <div className="form-section">
                            <h3 className="section-title">Feedback Experience & Philosophy (Max 20 pts)</h3>
                            <div className="form-group">
                                <label htmlFor="priorBeta">Prior Beta/Critique Experience</label>
                                <textarea id="priorBeta" name="priorBeta" className="form-control" placeholder="Describe your experience with beta reading, manuscript critiques, or writing groups. Include specific examples and outcomes..."></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="feedbackPhilosophy">Feedback Philosophy *</label>
                                <textarea id="feedbackPhilosophy" name="feedbackPhilosophy" className="form-control" placeholder="How do you approach giving feedback? How do you balance honesty with kindness? Describe your method for providing actionable, specific suggestions..." required></textarea>
                            </div>
                        </div>

                        {/* Reliability */}
                        <div className="form-section">
                            <h3 className="section-title">Reliability Signals (Max 20 pts)</h3>
                            <div className="form-group">
                                <label htmlFor="trackRecord">Deadline Track Record</label>
                                <textarea id="trackRecord" name="trackRecord" className="form-control" placeholder="Provide examples of meeting deadlines in work, volunteer, or creative contexts. Include any verifiable references or public profiles..."></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="communication">Communication Style *</label>
                                <textarea id="communication" name="communication" className="form-control" placeholder="How do you handle check-ins and communication? What would you do if you encountered a blocker or needed to request an extension?" required></textarea>
                            </div>
                        </div>

                        {/* Diversity & Coverage */}
                        <div className="form-section">
                            <h3 className="section-title">Diversity & Coverage (Max 20 pts)</h3>
                            <div className="form-group">
                                <label>Reading Devices/Platforms *</label>
                                <div className="checkbox-group">
                                    <div className="checkbox-item">
                                        <input type="checkbox" id="desktop" name="devices" value="desktop" />
                                        <label htmlFor="desktop">Desktop/Laptop</label>
                                    </div>
                                    <div className="checkbox-item">
                                        <input type="checkbox" id="mobile" name="devices" value="mobile" />
                                        <label htmlFor="mobile">Mobile/Tablet</label>
                                    </div>
                                    <div className="checkbox-item">
                                        <input type="checkbox" id="ereader" name="devices" value="ereader" />
                                        <label htmlFor="ereader">E-reader (Kindle, etc.)</label>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="accessNeeds">Access Needs & Unique Perspectives</label>
                                <textarea id="accessNeeds" name="accessNeeds" className="form-control" placeholder="Do you have any access needs, cultural backgrounds (especially Persian/Middle Eastern), military experience, or other perspectives that would add value to our beta program?"></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="demographics">Additional Diversity Information</label>
                                <textarea id="demographics" name="demographics" className="form-control" placeholder="Any other demographic or experience diversity you'd like to share that would improve our beta reader representation?"></textarea>
                            </div>
                        </div>

                        <div className="navigation">
                            <div></div>
                            <button type="submit" className="btn btn-primary">Submit Application</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Stage 2: Comprehension Test */}
                        {currentStage === 6 && (                <div id="stage2" className="stage-content">
                    <div className="form-section">
                        <h3 className="section-title">Stage 2: Reading Comprehension & Taste Fit</h3>
                        <p><strong>Instructions:</strong> Read the excerpt below and answer the questions. This tests your ability to parse complex worldbuilding and provide specific feedback.</p>
                        
                        <div className="excerpt-container">
                            <h4>Sample Excerpt (800 words)</h4>
                            <p className="excerpt-text">
                                The Vənāsō winds carried more than salt and storm-promise tonight. Hooran felt the weight of unspoken oaths pressing against her temples as she stood upon the Cliffside Sanctum, watching the fires of Spandam flicker like dying stars across the chasm. Each flame represented a choice—empire or kinship, the Saoshyant's path or the old ways of her mothers.
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

                        <form onSubmit={handleStage2FormSubmit}>
                            <div className="form-group">
                                <label><strong>Question 1:</strong> What is the primary source of tension in this scene?</label>
                                <select className="form-control" name="q1" required>
                                    <option value="">Choose the best answer</option>
                                    <option value="a">Weather conditions threatening the characters</option>
                                    <option value="b">Hooran must choose between competing loyalties by dawn</option>
                                    <option value="c">Cyrus is pressuring Hooran to attack Spandam</option>
                                    <option value="d">The bio-luminescent technology is failing</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label><strong>Question 2:</strong> What role do the "Vənāsō winds" serve in this passage?</label>
                                <textarea className="form-control" name="q2" placeholder="Explain in 2-3 sentences..." required></textarea>
                            </div>

                            <div className="form-group">
                                <label><strong>Feedback Task:</strong> Identify one clarity issue and suggest a specific improvement</label>
                                <textarea className="form-control" name="clarity_feedback" placeholder="Point to specific lines and explain what's unclear, then suggest how to fix it..." required></textarea>
                            </div>

                            <div className="form-group">
                                <label><strong>Pacing Analysis:</strong> How does the pacing work in this excerpt?</label>
                                <textarea className="form-control" name="pacing_feedback" placeholder="Analyze the rhythm and flow, citing specific examples..." required></textarea>
                            </div>

                            <div className="form-group">
                                <label><strong>Taste Alignment (100 words):</strong> What about this excerpt most engages or loses you?</label>
                                <textarea id="taste_response" className="form-control" name="taste_response" placeholder="Be specific about what works or doesn't work for you as a reader..." required></textarea>
                                <div className="word-count" id="tasteWordCount">0/100 words</div>
                            </div>

                            <div className="navigation">
                                <button type="button" className="btn btn-secondary" onClick={() => showStage(1)}>Back to Application</button>
                                <button type="submit" className="btn btn-primary">Submit Stage 2</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Stage 3: Calibration */}
            {currentStage === 3 && (
                <div id="stage3" className="stage-content">
                    <div className="form-section">
                        <h3 className="section-title">Stage 3: Calibration Test</h3>
                        <p><strong>Instructions:</strong> Compare these two passages and rank which needs more revision. Explain your reasoning.</p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', margin: '25px 0' }}>
                            <div className="excerpt-container" style={{ background: 'linear-gradient(145deg, #f0f8f0 0%, #e8f4e8 100%)', borderColor: '#90ee90' }}>
                                <h4 style={{ color: '#228b22' }}>Passage A</h4>
                                <p className="excerpt-text">
                                    The battle raged across the crystalline plains. Warriors fought with determination. Magic crackled through the air as spells were cast by the mages. It was a significant moment in the war. Many would die. The outcome would affect everyone. The protagonist felt conflicted about their role in the violence.
                                </p>
                            </div>
                            <div className="excerpt-container" style={{ background: 'linear-gradient(145deg, #fff8dc 0%, #f5f5dc 100%)', borderColor: '#daa520' }}>
                                <h4 style={{ color: '#b8860b' }}>Passage B</h4>
                                <p className="excerpt-text">
                                    Kara's blade sang against Varek's shield, the impact reverberating through her bones. Around them, the Shattered Fields erupted in cascades of amber light—each spell-strike from the War-Mages above sending hairline fractures racing through the crystalline ground. She could taste copper and ozone, hear the wet snap of breaking bone somewhere to her left. This was the moment Sehran had warned her about: when ideology met steel, and someone had to choose what they were willing to break.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleStage3FormSubmit}>
                            <div className="form-group">
                                <label><strong>Which passage needs more revision?</strong></label>
                                <select className="form-control" name="worse_passage" required>
                                    <option value="">Choose one</option>
                                    <option value="a">Passage A</option>
                                    <option value="b">Passage B</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label><strong>Analysis of Passage A:</strong> Identify strengths and weaknesses</label>
                                <textarea className="form-control" name="passage_a_analysis" placeholder="What works and what doesn't? Be specific..." required></textarea>
                            </div>

                            <div className="form-group">
                                <label><strong>Analysis of Passage B:</strong> Identify strengths and weaknesses</label>
                                <textarea className="form-control" name="passage_b_analysis" placeholder="What works and what doesn't? Be specific..." required></textarea>
                            </div>

                            <div className="form-group">
                                <label><strong>Top Priority Fix:</strong> What's the most important issue to address?</label>
                                <textarea className="form-control" name="priority_fix" placeholder="Choose the highest-impact problem and suggest a concrete solution..." required></textarea>
                            </div>

                            <div className="navigation">
                                <button type="button" className="btn btn-secondary" onClick={() => showStage(2)}>Back to Stage 2</button>
                                <button type="submit" className="btn btn-primary">Submit Stage 3</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Stage 4: Timed Trial */}
            {currentStage === 4 && (
                <div id="stage4" className="stage-content">
                    <div className="form-section">
                        <h3 className="section-title">Stage 4: Timed Trial Task</h3>
                        <p><strong>Deadline:</strong> You have 48 hours from now to complete this task.</p>
                        
                        <div id="timer" style={{ background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)', color: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center', margin: '20px 0', fontSize: '1.5em', fontWeight: 'bold' }}>
                            Time Remaining: <span id="countdown">{formatTime(timeRemaining)}</span>
                        </div>

                        <div className="excerpt-container">
                            <h4>Chapter Excerpt (2,500 words - Sample)</h4>
                            <p><em>Read the full chapter and provide detailed feedback using the form below...</em></p>
                            <div style={{ height: '350px', overflowY: 'auto', background: 'linear-gradient(145deg, #ffffff 0%, #fefdfb 100%)', padding: '20px', border: '1px solid #d4c5a9', fontStyle: 'italic', lineHeight: '1.8', color: '#3c2415' }}>
                                [Full chapter content would be provided here - this is a placeholder showing the format. The actual implementation would include the complete text with line numbers for reference. Each paragraph would be numbered for easy reference in feedback.]
                            </div>
                        </div>

                        <form onSubmit={handleStage4FormSubmit}>
                            <div className="form-group">
                                <label><strong>Overall Assessment (200-300 words):</strong></label>
                                <textarea id="overall_assessment" className="form-control" name="overall_assessment" placeholder="Provide a comprehensive overview focusing on the top 3 issues that need attention..." required style={{ minHeight: '150px' }}></textarea>
                                <div className="word-count" id="assessmentWordCount">0/300 words</div>
                            </div>

                            <div className="form-group">
                                <label><strong>Inline Comments (minimum 8):</strong></label>
                                <div id="inline-comments">
                                    {Array.from({ length: commentCount }).map((_, index) => (
                                        <div className="inline-comment" key={index} style={{ background: 'white', padding: '15px', borderRadius: '8px', marginBottom: '15px', borderLeft: '3px solid #667eea' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px' }}>
                                                <div>
                                                    <label>Line/Section Reference:</label>
                                                    <input type="text" className="form-control" name={`comment_ref_${index + 1}`} placeholder="e.g., Line 45, Paragraph 3" />
                                                </div>
                                                <div>
                                                    <label>Issue Type:</label>
                                                    <select className="form-control" name={`comment_type_${index + 1}`}>
                                                        <option value="">Select type</option>
                                                        <option value="clarity">Clarity</option>
                                                        <option value="pacing">Pacing</option>
                                                        <option value="continuity">Continuity</option>
                                                        <option value="voice">Voice</option>
                                                        <option value="logic">Logic</option>
                                                        <option value="worldbuilding">Worldbuilding</option>
                                                        <option value="stakes">Stakes/Tension</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div style={{ marginTop: '10px' }}>
                                                <label>Comment & Suggestion:</label>
                                                <textarea className="form-control" name={`comment_text_${index + 1}`} placeholder="Describe the issue and provide a specific suggestion for improvement..."></textarea>
                                            </div>
                                            {index > 0 && ( // Allow removing comments except the first one
                                                <button type="button" onClick={() => setCommentCount(prev => prev - 1)} className="btn btn-secondary" style={{ marginTop: '10px', fontSize: '0.8em', padding: '8px 15px' }}>Remove Comment</button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button type="button" onClick={addComment} className="btn btn-secondary" style={{ marginTop: '15px' }}>Add Another Comment</button>
                            </div>

                            <div className="form-group">
                                <label><strong>Chapter Summary & Recommendations:</strong></label>
                                <textarea className="form-control" name="chapter_summary" placeholder="Summarize your overall thoughts and provide 3 key recommendations for improvement..." required style={{ minHeight: '120px' }}></textarea>
                            </div>

                            <div className="navigation">
                                <button type="button" className="btn btn-secondary" onClick={() => showStage(3)}>Back to Stage 3</button>
                                <button type="submit" className="btn btn-primary">Submit Final Stage</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Admin Panel */}
            {currentStage === 5 && (
                <div id="admin" className="stage-content">
                    <div className="admin-panel">
                        <h3 className="section-title">Admin Panel - Beta Reader Applications</h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                            <div className="score-item" style={{ background: 'linear-gradient(145deg, #ffffff 0%, #fefdfb 100%)', border: '1px solid #d4c5a9', color: '#3c2415' }}>
                                <h4>Total Applications</h4>
                                <p style={{ fontSize: '2em', fontWeight: 'bold', color: '#8b4513' }}>127</p>
                            </div>
                            <div className="score-item" style={{ background: 'linear-gradient(145deg, #ffffff 0%, #fefdfb 100%)', border: '1px solid #d4c5a9', color: '#3c2415' }}>
                                <h4>Passed Stage 1</h4>
                                <p style={{ fontSize: '2em', fontWeight: 'bold', color: '#228b22' }}>89</p>
                            </div>
                            <div className="score-item" style={{ background: 'linear-gradient(145deg, #ffffff 0%, #fefdfb 100%)', border: '1px solid #d4c5a9', color: '#3c2415' }}>
                                <h4>Final Selections</h4>
                                <p style={{ fontSize: '2em', fontWeight: 'bold', color: '#8b4513' }}>37</p>
                            </div>
                            <div className="score-item" style={{ background: 'linear-gradient(145deg, #ffffff 0%, #fefdfb 100%)', border: '1px solid #d4c5a9', color: '#3c2415' }}>
                                <h4>Waitlist</h4>
                                <p style={{ fontSize: '2em', fontWeight: 'bold', color: '#b8860b' }}>15</p>
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <button className="btn btn-primary" onClick={() => alert('Report generated!')}>Generate Final Report</button>
                            <button className="btn btn-secondary" onClick={() => alert('Data exported!')}>Export Data</button>
                            <button className="btn btn-secondary" onClick={() => { if (window.confirm('Send selection emails to all applicants? This cannot be undone.')) alert('Emails sent!'); }}>Send Selection Emails</button>
                        </div>

                        <div className="applicant-list" id="applicantList">
                            {/* Sample applicant cards */}
                            <div className="applicant-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                    <div>
                                        <h4 style={{ color: '#8b4513', marginBottom: '5px' }}>Sarah Chen</h4>
                                        <p style={{ color: '#6b5b73', fontSize: '0.9em' }}>sarah.chen @email.com | GMT+8</p>
                                    </div>
                                    <span className="status-badge status-passed">Selected</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '15px' }}>
                                    <div><strong>Stage 1:</strong> 87/100</div>
                                    <div><strong>Stage 2:</strong> 52/60</div>
                                    <div><strong>Stage 3:</strong> 34/40</div>
                                    <div><strong>Stage 4:</strong> 55/60</div>
                                </div>
                                <div style={{ background: 'rgba(139, 69, 19, 0.1)', padding: '10px', borderLeft: '3px solid #8b4513' }}>
                                    <strong>Composite Score: 92.1</strong> | Strengths: Genre expertise, reliable communication, mobile testing
                                </div>
                            </div>

                            <div className="applicant-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                    <div>
                                        <h4 style={{ color: '#8b4513', marginBottom: '5px' }}>Marcus Rodriguez</h4>
                                        <p style={{ color: '#6b5b73', fontSize: '0.9em' }}>m.rodriguez @email.com | EST</p>
                                    </div>
                                    <span className="status-badge status-pending">Waitlist</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '15px' }}>
                                    <div><strong>Stage 1:</strong> 79/100</div>
                                    <div><strong>Stage 2:</strong> 48/60</div>
                                    <div><strong>Stage 3:</strong> 31/40</div>
                                    <div><strong>Stage 4:</strong> 48/60</div>
                                </div>
                                <div style={{ background: 'rgba(218, 165, 32, 0.1)', padding: '10px', borderLeft: '3px solid #daa520' }}>
                                    <strong>Composite Score: 83.7</strong> | Strengths: Military background, Persian cultural knowledge
                                </div>
                            </div>

                            <div className="applicant-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                    <div>
                                        <h4 style={{ color: '#8b4513', marginBottom: '5px' }}>Jennifer Walsh</h4>
                                        <p style={{ color: '#6b5b73', fontSize: '0.9em' }}>jen.walsh @email.com | GMT</p>
                                    </div>
                                    <span className="status-badge status-failed">Not Selected</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '15px' }}>
                                    <div><strong>Stage 1:</strong> 71/100</div>
                                    <div><strong>Stage 2:</strong> 33/60</div>
                                    <div><strong>Stage 3:</strong> —</div>
                                    <div><strong>Stage 4:</strong> —</div>
                                </div>
                                <div style={{ background: 'rgba(220, 20, 60, 0.1)', padding: '10px', borderLeft: '3px solid #dc143c' }}>
                                    <strong>Composite Score: 45.2</strong> | Issues: Failed Stage 2 comprehension, generic feedback
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Final Results Display */}            {currentStage === 6 && (                <div className="score-display">                    <h2 style={{ marginBottom: '20px' }}>Application Complete!</h2>                    <div className="score-breakdown">                        <div className="score-item">                            <h4>Stage 1</h4>                            <p>{(applicationData as any).stage1?.rawScore || 0}/100</p>                        </div>                        <div className="score-item">                            <h4>Stage 2</h4>                            <p>{(applicationData as any).stage2?.rawScore || 0}/60</p>                        </div>                        <div className="score-item">                            <h4>Stage 3</h4>                            <p>{(applicationData as any).stage3?.rawScore || 0}/40</p>                        </div>                        <div className="score-item">                            <h4>Stage 4</h4>                            <p>{(applicationData as any).stage4?.rawScore || 0}/60</p>                        </div>                    </div>                    <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.3)' }}>                        <h3>Final Composite Score: {(applicationData as any).compositeScore || 0}/100</h3>                        <p style={{ marginTop: '15px' }}>Thank you for your application! We\'ll be in touch within 1-2 weeks with our decision.</p>                    </div>                    {/* Submitted Data */}                    <div className="submitted-data" style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.3)' }}>                        <h3>Submitted Application Data for Review</h3>                        {/* Stage 1 Data */}                        {applicationData.stage1 && (                            <div style={{ marginBottom: '20px' }}>                                <h4>Stage 1: Application Form</h4>                                {Object.entries((applicationData as any).stage1).map(([key, value]) => (                                    <p key={key}><strong>{key}:</strong> {JSON.stringify(value)}</p>                                ))}                            </div>                        )}                        {/* Stage 2 Data */}                        {applicationData.stage2 && (                            <div style={{ marginBottom: '20px' }}>                                <h4>Stage 2: Comprehension Test</h4>                                {Object.entries((applicationData as any).stage2).map(([key, value]) => (                                    <p key={key}><strong>{key}:</strong> {JSON.stringify(value)}</p>                                ))}                            </div>                        )}                        {/* Stage 3 Data */}                        {applicationData.stage3 && (                            <div style={{ marginBottom: '20px' }}>                                <h4>Stage 3: Calibration Test</h4>                                {Object.entries((applicationData as any).stage3).map(([key, value]) => (                                    <p key={key}><strong>{key}:</strong> {JSON.stringify(value)}</p>                                ))}                            </div>                        )}                        {/* Stage 4 Data */}                        {applicationData.stage4 && (                            <div style={{ marginBottom: '20px' }}>                                <h4>Stage 4: Timed Trial Task</h4>                                {Object.entries((applicationData as any).stage4).map(([key, value]) => (                                    <p key={key}><strong>{key}:</strong> {JSON.stringify(value)}</p>                                ))}                            </div>                        )}                    </div>                </div>            )}
        </div>
    );
};

export default BetaApplication;
