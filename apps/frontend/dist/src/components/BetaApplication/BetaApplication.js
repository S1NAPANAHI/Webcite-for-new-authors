import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { supabase } from '@zoroaster/shared';
import './BetaApplication.css'; // Import the CSS file
const BetaApplication = () => {
    // Application State
    const [currentStage, setCurrentStage] = useState(1);
    const [applicationData, setApplicationData] = useState({});
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
    const MountainIcon = ({ state }) => {
        const fill = state === "done" ? "#10B981" : state === "current" ? "#60A5FA" : "#6B7280";
        const cap = state === "upcoming" ? "#9CA3AF" : "#E5E7EB";
        return (_jsxs("svg", { viewBox: "0 0 64 40", width: "36", height: "24", className: `mountain-icon ${state}`, "aria-hidden": true, children: [_jsx("path", { d: "M2 38 L20 12 L28 22 L40 4 L62 38 Z", fill: fill, stroke: fill, strokeWidth: "1.5" }), _jsx("path", { d: "M20 12 L24 18 L16 18 Z", fill: cap }), _jsx("path", { d: "M40 4 L44 12 L36 12 Z", fill: cap })] }));
    };
    // Connector component (adapted from provided React component)
    const Connector = ({ done }) => (_jsx("div", { className: `connector ${done ? 'done' : ''}` }));
    // Function to render the mountain stepper (JSX directly in render)
    const renderMountainStepper = () => {
        return (_jsxs("div", { className: "mountain-stepper", children: [_jsx(Connector, { done: currentStage > 0 }), steps.map((step, i) => {
                    const stageIndex = i + 1;
                    const state = stageIndex < currentStage ? "done" : stageIndex === currentStage ? "current" : "upcoming";
                    return (_jsxs(React.Fragment, { children: [_jsxs("div", { className: "mountain-step-container", onClick: () => showStage(stageIndex), children: [_jsx(MountainIcon, { state: state }), _jsx("span", { className: `mountain-label ${state}`, children: step.label })] }), _jsx(Connector, { done: stageIndex < currentStage })] }, step.label));
                })] }));
    };
    // Stage Navigation
    const showStage = (stage) => {
        setCurrentStage(6);
    };
    // Word count functionality
    const updateWordCount = (textareaId, counterId, min, max) => {
        const textarea = document.getElementById(textareaId);
        const counter = document.getElementById(counterId);
        if (textarea && counter) {
            const words = textarea.value.trim().split(/\s+/).filter(word => word.length > 0).length;
            counter.textContent = `${words}/${max} words`;
            counter.className = 'word-count';
            if (words < min)
                counter.classList.add('error');
            else if (words > max * 0.9)
                counter.classList.add('warning');
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
        let timerInterval;
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
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    // Form submission handlers
    const handleApplicationFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        const devices = Array.from(document.querySelectorAll('input[name="devices"]:checked')).map(cb => cb.value);
        data.devices = devices;
        let stage1Score = 0;
        let autoFail = false;
        const commitmentScores = {
            'weekly_deadlines': 10,
            'commit_with_extensions': 6,
            'prefer_flexible': 3,
            'no_commitment': 0
        };
        stage1Score += commitmentScores[data.betaCommitment] || 0;
        if (data.betaCommitment === 'no_commitment')
            autoFail = true;
        const hoursScores = {
            '5_plus': 5,
            '3_4': 3,
            'under_3': 0
        };
        stage1Score += hoursScores[data.hoursPerWeek] || 0;
        const portalUseScores = {
            'yes_comfortable': 5,
            'yes_unsure': 2,
            'no': 0
        };
        stage1Score += portalUseScores[data.portalUse] || 0;
        if (data.portalUse === 'no')
            autoFail = true;
        stage1Score = Math.min(stage1Score, 20);
        let genreAlignmentScore = 0;
        if (data.recentReads.length > 0 && data.interestStatement.length > 0) {
            genreAlignmentScore = 10;
        }
        stage1Score += genreAlignmentScore;
        let feedbackExperienceScore = 0;
        if (data.priorBeta.length > 0 && data.feedbackPhilosophy.length > 0) {
            feedbackExperienceScore = 10;
        }
        stage1Score += feedbackExperienceScore;
        let reliabilityScore = 0;
        if (data.trackRecord.length > 0 && data.communication.length > 0) {
            reliabilityScore = 10;
        }
        stage1Score += reliabilityScore;
        let diversityCoverageScore = 0;
        const deviceCount = devices.length;
        if (deviceCount === 3)
            diversityCoverageScore += 6;
        else if (deviceCount === 2)
            diversityCoverageScore += 4;
        else if (deviceCount === 1)
            diversityCoverageScore += 2;
        diversityCoverageScore = Math.min(diversityCoverageScore, 20);
        stage1Score += diversityCoverageScore;
        const passThreshold = 50;
        let stage1Passed = (stage1Score >= passThreshold) && !autoFail;
        setApplicationData(prevData => ({ ...prevData, stage1: { ...data, rawScore: stage1Score, passed: stage1Passed, autoFail: autoFail } }));
        showStage(2);
    };
    const handleStage2FormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        let stage2Score = 0;
        const maxScore = 60;
        const passThreshold = 38;
        if (data.q1 === 'b')
            stage2Score += 20;
        if (data.clarity_feedback.length > 0 && data.pacing_feedback.length > 0) {
            stage2Score += 15;
        }
        if (data.taste_response.length > 0) {
            stage2Score += 5;
        }
        let stage2Passed = (stage2Score >= passThreshold);
        setApplicationData(prevData => ({ ...prevData, stage2: { ...data, rawScore: stage2Score, passed: stage2Passed } }));
        showStage(3);
    };
    const handleStage3FormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        let stage3Score = 0;
        const maxScore = 40;
        const passThreshold = 26;
        if (data.worse_passage === 'a')
            stage3Score += 15;
        if (data.passage_a_analysis.length > 0 && data.passage_b_analysis.length > 0 && data.priority_fix.length > 0) {
            stage3Score += 5;
        }
        let stage3Passed = (stage3Score >= passThreshold);
        setApplicationData(prevData => ({ ...prevData, stage3: { ...data, rawScore: stage3Score, passed: stage3Passed } }));
        showStage(4);
    };
    const handleStage4FormSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        let stage4Score = 0;
        const maxScore = 60;
        const passThreshold = 40;
        if (timeRemaining > 0) {
            stage4Score += 10;
        }
        else {
            stage4Score += 0;
        }
        const inlineComments = document.querySelectorAll('.inline-comment'); // Still relies on DOM query
        if (data.overall_assessment.length > 0 && data.chapter_summary.length > 0 && inlineComments.length >= 8) {
            stage4Score += 10;
        }
        else if (data.overall_assessment.length > 0 && data.chapter_summary.length > 0 && inlineComments.length >= 4) {
            stage4Score += 5;
        }
        if (inlineComments.length > 0) {
            stage4Score += 10;
        }
        if (data.chapter_summary.length > 0) {
            stage4Score += 10;
        }
        let stage4Passed = (stage4Score >= passThreshold);
        setApplicationData(prevData => ({ ...prevData, stage4: { ...data, rawScore: stage4Score, passed: stage4Passed } }));
        // Calculate final composite score
        const weights = { stage1: 0.20, stage2: 0.25, stage3: 0.20, stage4: 0.35 };
        const composite = (applicationData.stage1.rawScore / 100) * (weights.stage1 * 100) +
            (applicationData.stage2.rawScore / 60) * (weights.stage2 * 100) +
            (applicationData.stage3.rawScore / 40) * (weights.stage3 * 100) +
            (applicationData.stage4.rawScore / 60) * (weights.stage4 * 100);
        setApplicationData(prevData => ({ ...prevData, compositeScore: Math.round(composite * 10) / 10 }));
        setCurrentStage(6);
        // Prepare data for Supabase insertion
        const applicationToSave = {
            user_id: (await supabase.auth.getUser()).data.user?.id, // Get current user ID
            full_name: applicationData.stage1.fullName,
            email: applicationData.stage1.email,
            time_zone: applicationData.stage1.timeZone,
            country: applicationData.stage1.country,
            goodreads: applicationData.stage1.goodreads,
            beta_commitment: applicationData.stage1.betaCommitment,
            hours_per_week: applicationData.stage1.hoursPerWeek,
            portal_use: applicationData.stage1.portalUse,
            recent_reads: applicationData.stage1.recentReads,
            interest_statement: applicationData.stage1.interestStatement,
            prior_beta: applicationData.stage1.priorBeta,
            feedback_philosophy: applicationData.stage1.feedbackPhilosophy,
            track_record: applicationData.stage1.trackRecord,
            communication: applicationData.stage1.communication,
            devices: applicationData.stage1.devices,
            access_needs: applicationData.stage1.accessNeeds,
            demographics: applicationData.stage1.demographics,
            stage1_raw_score: applicationData.stage1.rawScore,
            stage1_passed: applicationData.stage1.passed,
            stage1_auto_fail: applicationData.stage1.autoFail,
            q1: applicationData.stage2.q1,
            q2: applicationData.stage2.q2,
            clarity_feedback: applicationData.stage2.clarity_feedback,
            pacing_analysis: applicationData.stage2.pacing_feedback, // Note: schema uses pacing_analysis, form uses pacing_feedback
            taste_alignment: applicationData.stage2.taste_response, // Note: schema uses taste_alignment, form uses taste_response
            stage2_raw_score: applicationData.stage2.rawScore,
            stage2_passed: applicationData.stage2.passed,
            worse_passage: applicationData.stage3.worse_passage,
            passage_a_analysis: applicationData.stage3.passage_a_analysis,
            passage_b_analysis: applicationData.stage3.passage_b_analysis,
            priority_fix: applicationData.stage3.priority_fix,
            stage3_raw_score: applicationData.stage3.rawScore,
            stage3_passed: applicationData.stage3.passed,
            overall_assessment: applicationData.stage4.overall_assessment,
            chapter_summary: applicationData.stage4.chapter_summary,
            stage4_raw_score: applicationData.stage4.rawScore,
            stage4_passed: applicationData.stage4.passed,
            composite_score: applicationData.compositeScore,
        };
        const { error } = await supabase
            .from('beta_applications')
            .insert([applicationToSave]);
        if (error) {
            console.error('Error saving beta application:', error);
            alert('There was an error saving your application. Please try again.');
        }
        else {
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
    return (_jsxs("div", { className: "beta-app-container", children: [_jsxs("div", { className: "beta-app-header", children: [_jsx("h1", { children: "Zangar/Spandam Beta Reader Program" }), _jsx("p", { children: "Join our exclusive beta reading community for epic sci-fi/fantasy" })] }), renderMountainStepper(), currentStage === 1 && (_jsx("div", { id: "stage1", className: "stage-content", children: _jsxs("form", { onSubmit: handleApplicationFormSubmit, children: [_jsxs("div", { className: "form-section", children: [_jsx("h3", { className: "section-title", children: "Contact Information" }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "fullName", children: "Full Name *" }), _jsx("input", { type: "text", id: "fullName", name: "fullName", className: "form-control", required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "email", children: "Email Address *" }), _jsx("input", { type: "email", id: "email", name: "email", className: "form-control", required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "timeZone", children: "Time Zone *" }), _jsxs("select", { id: "timeZone", name: "timeZone", className: "form-control", required: true, children: [_jsx("option", { value: "", children: "Select your time zone" }), _jsx("option", { value: "America/New_York", children: "Eastern Time (UTC-5/-4)" }), _jsx("option", { value: "America/Chicago", children: "Central Time (UTC-6/-5)" }), _jsx("option", { value: "America/Denver", children: "Mountain Time (UTC-7/-6)" }), _jsx("option", { value: "America/Los_Angeles", children: "Pacific Time (UTC-8/-7)" }), _jsx("option", { value: "Europe/London", children: "GMT/BST (UTC+0/+1)" }), _jsx("option", { value: "Europe/Paris", children: "CET/CEST (UTC+1/+2)" }), _jsx("option", { value: "Asia/Tokyo", children: "JST (UTC+9)" }), _jsx("option", { value: "Australia/Sydney", children: "AEST/AEDT (UTC+10/+11)" })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "country", children: "Country" }), _jsx("input", { type: "text", id: "country", name: "country", className: "form-control" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "goodreads", children: "Goodreads Profile (optional)" }), _jsx("input", { type: "text", id: "goodreads", name: "goodreads", className: "form-control", placeholder: "https://goodreads.com/user/..." })] })] }), _jsxs("div", { className: "form-section", children: [_jsx("h3", { className: "section-title", children: "Commitment & Availability (Max 20 pts)" }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "betaCommitment", children: "Beta Window Commitment (6-8 weeks) *" }), _jsxs("select", { id: "betaCommitment", name: "betaCommitment", className: "form-control", required: true, children: [_jsx("option", { value: "", children: "Select your commitment level" }), _jsx("option", { value: "weekly_deadlines", children: "I can commit to weekly deadlines (10 pts)" }), _jsx("option", { value: "commit_with_extensions", children: "I can commit but may need 1+ extensions (6 pts)" }), _jsx("option", { value: "prefer_flexible", children: "I prefer flexible deadlines (3 pts)" }), _jsx("option", { value: "no_commitment", children: "I cannot commit to deadlines (0 pts)" })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "hoursPerWeek", children: "Time Budget per Week *" }), _jsxs("select", { id: "hoursPerWeek", name: "hoursPerWeek", className: "form-control", required: true, children: [_jsx("option", { value: "", children: "Select your time availability" }), _jsx("option", { value: "5_plus", children: "5+ hours per week (5 pts)" }), _jsx("option", { value: "3_4", children: "3-4 hours per week (3 pts)" }), _jsx("option", { value: "under_3", children: "Less than 3 hours (0 pts)" })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "portalUse", children: "Website Portal Usage *" }), _jsxs("select", { id: "portalUse", name: "portalUse", className: "form-control", required: true, children: [_jsx("option", { value: "", children: "Select your comfort level" }), _jsx("option", { value: "yes_comfortable", children: "Yes, I'm comfortable using web tools (5 pts)" }), _jsx("option", { value: "yes_unsure", children: "Yes, but I'm unsure about tech (2 pts)" }), _jsx("option", { value: "no", children: "No, I prefer other methods (0 pts)" })] })] })] }), _jsxs("div", { className: "form-section", children: [_jsx("h3", { className: "section-title", children: "Genre/Series Alignment (Max 20 pts)" }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "recentReads", children: "Recent Relevant Reads" }), _jsx("textarea", { id: "recentReads", name: "recentReads", className: "form-control", placeholder: "List 3-5 books you've read in the last 12 months that relate to epic sci-fi/fantasy, Persian/Zoroastrian themes, or big-idea worldbuilding..." })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "interestStatement", children: "Why This Series? (150-250 words) *" }), _jsx("textarea", { id: "interestStatement", name: "interestStatement", className: "form-control", placeholder: "What specifically interests you about the Zangar/Spandam series? Mention themes like empire vs. kinship, oath/fate dynamics, cliffside megastructures, etc.", required: true }), _jsx("div", { className: "word-count", id: "interestWordCount", children: "0/250 words" })] })] }), _jsxs("div", { className: "form-section", children: [_jsx("h3", { className: "section-title", children: "Feedback Experience & Philosophy (Max 20 pts)" }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "priorBeta", children: "Prior Beta/Critique Experience" }), _jsx("textarea", { id: "priorBeta", name: "priorBeta", className: "form-control", placeholder: "Describe your experience with beta reading, manuscript critiques, or writing groups. Include specific examples and outcomes..." })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "feedbackPhilosophy", children: "Feedback Philosophy *" }), _jsx("textarea", { id: "feedbackPhilosophy", name: "feedbackPhilosophy", className: "form-control", placeholder: "How do you approach giving feedback? How do you balance honesty with kindness? Describe your method for providing actionable, specific suggestions...", required: true })] })] }), _jsxs("div", { className: "form-section", children: [_jsx("h3", { className: "section-title", children: "Reliability Signals (Max 20 pts)" }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "trackRecord", children: "Deadline Track Record" }), _jsx("textarea", { id: "trackRecord", name: "trackRecord", className: "form-control", placeholder: "Provide examples of meeting deadlines in work, volunteer, or creative contexts. Include any verifiable references or public profiles..." })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "communication", children: "Communication Style *" }), _jsx("textarea", { id: "communication", name: "communication", className: "form-control", placeholder: "How do you handle check-ins and communication? What would you do if you encountered a blocker or needed to request an extension?", required: true })] })] }), _jsxs("div", { className: "form-section", children: [_jsx("h3", { className: "section-title", children: "Diversity & Coverage (Max 20 pts)" }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Reading Devices/Platforms *" }), _jsxs("div", { className: "checkbox-group", children: [_jsxs("div", { className: "checkbox-item", children: [_jsx("input", { type: "checkbox", id: "desktop", name: "devices", value: "desktop" }), _jsx("label", { htmlFor: "desktop", children: "Desktop/Laptop" })] }), _jsxs("div", { className: "checkbox-item", children: [_jsx("input", { type: "checkbox", id: "mobile", name: "devices", value: "mobile" }), _jsx("label", { htmlFor: "mobile", children: "Mobile/Tablet" })] }), _jsxs("div", { className: "checkbox-item", children: [_jsx("input", { type: "checkbox", id: "ereader", name: "devices", value: "ereader" }), _jsx("label", { htmlFor: "ereader", children: "E-reader (Kindle, etc.)" })] })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "accessNeeds", children: "Access Needs & Unique Perspectives" }), _jsx("textarea", { id: "accessNeeds", name: "accessNeeds", className: "form-control", placeholder: "Do you have any access needs, cultural backgrounds (especially Persian/Middle Eastern), military experience, or other perspectives that would add value to our beta program?" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "demographics", children: "Additional Diversity Information" }), _jsx("textarea", { id: "demographics", name: "demographics", className: "form-control", placeholder: "Any other demographic or experience diversity you'd like to share that would improve our beta reader representation?" })] })] }), _jsxs("div", { className: "navigation", children: [_jsx("div", {}), _jsx("button", { type: "submit", className: "btn btn-primary", children: "Submit Application" })] })] }) })), currentStage === 6 && (_jsx("div", { id: "stage2", className: "stage-content", children: _jsxs("div", { className: "form-section", children: [_jsx("h3", { className: "section-title", children: "Stage 2: Reading Comprehension & Taste Fit" }), _jsxs("p", { children: [_jsx("strong", { children: "Instructions:" }), " Read the excerpt below and answer the questions. This tests your ability to parse complex worldbuilding and provide specific feedback."] }), _jsxs("div", { className: "excerpt-container", children: [_jsx("h4", { children: "Sample Excerpt (800 words)" }), _jsx("p", { className: "excerpt-text", children: "The V\u0259n\u0101s\u014D winds carried more than salt and storm-promise tonight. Hooran felt the weight of unspoken oaths pressing against her temples as she stood upon the Cliffside Sanctum, watching the fires of Spandam flicker like dying stars across the chasm. Each flame represented a choice\u2014empire or kinship, the Saoshyant's path or the old ways of her mothers." }), _jsx("p", { className: "excerpt-text", children: "\"The Zangar expect answers by dawn,\" Cyrus said, his voice cutting through the wind-song. His ceremonial armor caught moonlight like captured ice, each plate inscribed with binding-runes that pulsed faintly blue. \"The Great Assembly grows restless.\"" }), _jsx("p", { className: "excerpt-text", children: "Hooran's fingers traced the oath-scar on her palm\u2014the mark that bound her to choices not yet made. Below, the megastructure of Spandam stretched into darkness, its bio-luminescent veins carrying information like blood through stone arteries. Somewhere in those depths, her brother Darius worked the Deep Forges, unaware that his sister's decision would reshape not just their family's fate, but the balance between the Seven Domains." }), _jsx("p", { className: "excerpt-text", children: "\"The winds know,\" she whispered, tasting copper and ozone. \"They've always known.\"" })] }), _jsxs("form", { onSubmit: handleStage2FormSubmit, children: [_jsxs("div", { className: "form-group", children: [_jsxs("label", { children: [_jsx("strong", { children: "Question 1:" }), " What is the primary source of tension in this scene?"] }), _jsxs("select", { className: "form-control", name: "q1", required: true, children: [_jsx("option", { value: "", children: "Choose the best answer" }), _jsx("option", { value: "a", children: "Weather conditions threatening the characters" }), _jsx("option", { value: "b", children: "Hooran must choose between competing loyalties by dawn" }), _jsx("option", { value: "c", children: "Cyrus is pressuring Hooran to attack Spandam" }), _jsx("option", { value: "d", children: "The bio-luminescent technology is failing" })] })] }), _jsxs("div", { className: "form-group", children: [_jsxs("label", { children: [_jsx("strong", { children: "Question 2:" }), " What role do the \"V\u0259n\u0101s\u014D winds\" serve in this passage?"] }), _jsx("textarea", { className: "form-control", name: "q2", placeholder: "Explain in 2-3 sentences...", required: true })] }), _jsxs("div", { className: "form-group", children: [_jsxs("label", { children: [_jsx("strong", { children: "Feedback Task:" }), " Identify one clarity issue and suggest a specific improvement"] }), _jsx("textarea", { className: "form-control", name: "clarity_feedback", placeholder: "Point to specific lines and explain what's unclear, then suggest how to fix it...", required: true })] }), _jsxs("div", { className: "form-group", children: [_jsxs("label", { children: [_jsx("strong", { children: "Pacing Analysis:" }), " How does the pacing work in this excerpt?"] }), _jsx("textarea", { className: "form-control", name: "pacing_feedback", placeholder: "Analyze the rhythm and flow, citing specific examples...", required: true })] }), _jsxs("div", { className: "form-group", children: [_jsxs("label", { children: [_jsx("strong", { children: "Taste Alignment (100 words):" }), " What about this excerpt most engages or loses you?"] }), _jsx("textarea", { id: "taste_response", className: "form-control", name: "taste_response", placeholder: "Be specific about what works or doesn't work for you as a reader...", required: true }), _jsx("div", { className: "word-count", id: "tasteWordCount", children: "0/100 words" })] }), _jsxs("div", { className: "navigation", children: [_jsx("button", { type: "button", className: "btn btn-secondary", onClick: () => showStage(1), children: "Back to Application" }), _jsx("button", { type: "submit", className: "btn btn-primary", children: "Submit Stage 2" })] })] })] }) })), currentStage === 3 && (_jsx("div", { id: "stage3", className: "stage-content", children: _jsxs("div", { className: "form-section", children: [_jsx("h3", { className: "section-title", children: "Stage 3: Calibration Test" }), _jsxs("p", { children: [_jsx("strong", { children: "Instructions:" }), " Compare these two passages and rank which needs more revision. Explain your reasoning."] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', margin: '25px 0' }, children: [_jsxs("div", { className: "excerpt-container", style: { background: 'linear-gradient(145deg, #f0f8f0 0%, #e8f4e8 100%)', borderColor: '#90ee90' }, children: [_jsx("h4", { style: { color: '#228b22' }, children: "Passage A" }), _jsx("p", { className: "excerpt-text", children: "The battle raged across the crystalline plains. Warriors fought with determination. Magic crackled through the air as spells were cast by the mages. It was a significant moment in the war. Many would die. The outcome would affect everyone. The protagonist felt conflicted about their role in the violence." })] }), _jsxs("div", { className: "excerpt-container", style: { background: 'linear-gradient(145deg, #fff8dc 0%, #f5f5dc 100%)', borderColor: '#daa520' }, children: [_jsx("h4", { style: { color: '#b8860b' }, children: "Passage B" }), _jsx("p", { className: "excerpt-text", children: "Kara's blade sang against Varek's shield, the impact reverberating through her bones. Around them, the Shattered Fields erupted in cascades of amber light\u2014each spell-strike from the War-Mages above sending hairline fractures racing through the crystalline ground. She could taste copper and ozone, hear the wet snap of breaking bone somewhere to her left. This was the moment Sehran had warned her about: when ideology met steel, and someone had to choose what they were willing to break." })] })] }), _jsxs("form", { onSubmit: handleStage3FormSubmit, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: _jsx("strong", { children: "Which passage needs more revision?" }) }), _jsxs("select", { className: "form-control", name: "worse_passage", required: true, children: [_jsx("option", { value: "", children: "Choose one" }), _jsx("option", { value: "a", children: "Passage A" }), _jsx("option", { value: "b", children: "Passage B" })] })] }), _jsxs("div", { className: "form-group", children: [_jsxs("label", { children: [_jsx("strong", { children: "Analysis of Passage A:" }), " Identify strengths and weaknesses"] }), _jsx("textarea", { className: "form-control", name: "passage_a_analysis", placeholder: "What works and what doesn't? Be specific...", required: true })] }), _jsxs("div", { className: "form-group", children: [_jsxs("label", { children: [_jsx("strong", { children: "Analysis of Passage B:" }), " Identify strengths and weaknesses"] }), _jsx("textarea", { className: "form-control", name: "passage_b_analysis", placeholder: "What works and what doesn't? Be specific...", required: true })] }), _jsxs("div", { className: "form-group", children: [_jsxs("label", { children: [_jsx("strong", { children: "Top Priority Fix:" }), " What's the most important issue to address?"] }), _jsx("textarea", { className: "form-control", name: "priority_fix", placeholder: "Choose the highest-impact problem and suggest a concrete solution...", required: true })] }), _jsxs("div", { className: "navigation", children: [_jsx("button", { type: "button", className: "btn btn-secondary", onClick: () => showStage(2), children: "Back to Stage 2" }), _jsx("button", { type: "submit", className: "btn btn-primary", children: "Submit Stage 3" })] })] })] }) })), currentStage === 4 && (_jsx("div", { id: "stage4", className: "stage-content", children: _jsxs("div", { className: "form-section", children: [_jsx("h3", { className: "section-title", children: "Stage 4: Timed Trial Task" }), _jsxs("p", { children: [_jsx("strong", { children: "Deadline:" }), " You have 48 hours from now to complete this task."] }), _jsxs("div", { id: "timer", style: { background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)', color: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center', margin: '20px 0', fontSize: '1.5em', fontWeight: 'bold' }, children: ["Time Remaining: ", _jsx("span", { id: "countdown", children: formatTime(timeRemaining) })] }), _jsxs("div", { className: "excerpt-container", children: [_jsx("h4", { children: "Chapter Excerpt (2,500 words - Sample)" }), _jsx("p", { children: _jsx("em", { children: "Read the full chapter and provide detailed feedback using the form below..." }) }), _jsx("div", { style: { height: '350px', overflowY: 'auto', background: 'linear-gradient(145deg, #ffffff 0%, #fefdfb 100%)', padding: '20px', border: '1px solid #d4c5a9', fontStyle: 'italic', lineHeight: '1.8', color: '#3c2415' }, children: "[Full chapter content would be provided here - this is a placeholder showing the format. The actual implementation would include the complete text with line numbers for reference. Each paragraph would be numbered for easy reference in feedback.]" })] }), _jsxs("form", { onSubmit: handleStage4FormSubmit, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: _jsx("strong", { children: "Overall Assessment (200-300 words):" }) }), _jsx("textarea", { id: "overall_assessment", className: "form-control", name: "overall_assessment", placeholder: "Provide a comprehensive overview focusing on the top 3 issues that need attention...", required: true, style: { minHeight: '150px' } }), _jsx("div", { className: "word-count", id: "assessmentWordCount", children: "0/300 words" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: _jsx("strong", { children: "Inline Comments (minimum 8):" }) }), _jsx("div", { id: "inline-comments", children: Array.from({ length: commentCount }).map((_, index) => (_jsxs("div", { className: "inline-comment", style: { background: 'white', padding: '15px', borderRadius: '8px', marginBottom: '15px', borderLeft: '3px solid #667eea' }, children: [_jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px' }, children: [_jsxs("div", { children: [_jsx("label", { children: "Line/Section Reference:" }), _jsx("input", { type: "text", className: "form-control", name: `comment_ref_${index + 1}`, placeholder: "e.g., Line 45, Paragraph 3" })] }), _jsxs("div", { children: [_jsx("label", { children: "Issue Type:" }), _jsxs("select", { className: "form-control", name: `comment_type_${index + 1}`, children: [_jsx("option", { value: "", children: "Select type" }), _jsx("option", { value: "clarity", children: "Clarity" }), _jsx("option", { value: "pacing", children: "Pacing" }), _jsx("option", { value: "continuity", children: "Continuity" }), _jsx("option", { value: "voice", children: "Voice" }), _jsx("option", { value: "logic", children: "Logic" }), _jsx("option", { value: "worldbuilding", children: "Worldbuilding" }), _jsx("option", { value: "stakes", children: "Stakes/Tension" })] })] })] }), _jsxs("div", { style: { marginTop: '10px' }, children: [_jsx("label", { children: "Comment & Suggestion:" }), _jsx("textarea", { className: "form-control", name: `comment_text_${index + 1}`, placeholder: "Describe the issue and provide a specific suggestion for improvement..." })] }), index > 0 && ( // Allow removing comments except the first one
                                                    _jsx("button", { type: "button", onClick: () => setCommentCount(prev => prev - 1), className: "btn btn-secondary", style: { marginTop: '10px', fontSize: '0.8em', padding: '8px 15px' }, children: "Remove Comment" }))] }, index))) }), _jsx("button", { type: "button", onClick: addComment, className: "btn btn-secondary", style: { marginTop: '15px' }, children: "Add Another Comment" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: _jsx("strong", { children: "Chapter Summary & Recommendations:" }) }), _jsx("textarea", { className: "form-control", name: "chapter_summary", placeholder: "Summarize your overall thoughts and provide 3 key recommendations for improvement...", required: true, style: { minHeight: '120px' } })] }), _jsxs("div", { className: "navigation", children: [_jsx("button", { type: "button", className: "btn btn-secondary", onClick: () => showStage(3), children: "Back to Stage 3" }), _jsx("button", { type: "submit", className: "btn btn-primary", children: "Submit Final Stage" })] })] })] }) })), currentStage === 5 && (_jsx("div", { id: "admin", className: "stage-content", children: _jsxs("div", { className: "admin-panel", children: [_jsx("h3", { className: "section-title", children: "Admin Panel - Beta Reader Applications" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }, children: [_jsxs("div", { className: "score-item", style: { background: 'linear-gradient(145deg, #ffffff 0%, #fefdfb 100%)', border: '1px solid #d4c5a9', color: '#3c2415' }, children: [_jsx("h4", { children: "Total Applications" }), _jsx("p", { style: { fontSize: '2em', fontWeight: 'bold', color: '#8b4513' }, children: "127" })] }), _jsxs("div", { className: "score-item", style: { background: 'linear-gradient(145deg, #ffffff 0%, #fefdfb 100%)', border: '1px solid #d4c5a9', color: '#3c2415' }, children: [_jsx("h4", { children: "Passed Stage 1" }), _jsx("p", { style: { fontSize: '2em', fontWeight: 'bold', color: '#228b22' }, children: "89" })] }), _jsxs("div", { className: "score-item", style: { background: 'linear-gradient(145deg, #ffffff 0%, #fefdfb 100%)', border: '1px solid #d4c5a9', color: '#3c2415' }, children: [_jsx("h4", { children: "Final Selections" }), _jsx("p", { style: { fontSize: '2em', fontWeight: 'bold', color: '#8b4513' }, children: "37" })] }), _jsxs("div", { className: "score-item", style: { background: 'linear-gradient(145deg, #ffffff 0%, #fefdfb 100%)', border: '1px solid #d4c5a9', color: '#3c2415' }, children: [_jsx("h4", { children: "Waitlist" }), _jsx("p", { style: { fontSize: '2em', fontWeight: 'bold', color: '#b8860b' }, children: "15" })] })] }), _jsxs("div", { style: { marginBottom: '20px' }, children: [_jsx("button", { className: "btn btn-primary", onClick: () => alert('Report generated!'), children: "Generate Final Report" }), _jsx("button", { className: "btn btn-secondary", onClick: () => alert('Data exported!'), children: "Export Data" }), _jsx("button", { className: "btn btn-secondary", onClick: () => { if (window.confirm('Send selection emails to all applicants? This cannot be undone.'))
                                        alert('Emails sent!'); }, children: "Send Selection Emails" })] }), _jsxs("div", { className: "applicant-list", id: "applicantList", children: [_jsxs("div", { className: "applicant-card", children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }, children: [_jsxs("div", { children: [_jsx("h4", { style: { color: '#8b4513', marginBottom: '5px' }, children: "Sarah Chen" }), _jsx("p", { style: { color: '#6b5b73', fontSize: '0.9em' }, children: "sarah.chen @email.com | GMT+8" })] }), _jsx("span", { className: "status-badge status-passed", children: "Selected" })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '15px' }, children: [_jsxs("div", { children: [_jsx("strong", { children: "Stage 1:" }), " 87/100"] }), _jsxs("div", { children: [_jsx("strong", { children: "Stage 2:" }), " 52/60"] }), _jsxs("div", { children: [_jsx("strong", { children: "Stage 3:" }), " 34/40"] }), _jsxs("div", { children: [_jsx("strong", { children: "Stage 4:" }), " 55/60"] })] }), _jsxs("div", { style: { background: 'rgba(139, 69, 19, 0.1)', padding: '10px', borderLeft: '3px solid #8b4513' }, children: [_jsx("strong", { children: "Composite Score: 92.1" }), " | Strengths: Genre expertise, reliable communication, mobile testing"] })] }), _jsxs("div", { className: "applicant-card", children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }, children: [_jsxs("div", { children: [_jsx("h4", { style: { color: '#8b4513', marginBottom: '5px' }, children: "Marcus Rodriguez" }), _jsx("p", { style: { color: '#6b5b73', fontSize: '0.9em' }, children: "m.rodriguez @email.com | EST" })] }), _jsx("span", { className: "status-badge status-pending", children: "Waitlist" })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '15px' }, children: [_jsxs("div", { children: [_jsx("strong", { children: "Stage 1:" }), " 79/100"] }), _jsxs("div", { children: [_jsx("strong", { children: "Stage 2:" }), " 48/60"] }), _jsxs("div", { children: [_jsx("strong", { children: "Stage 3:" }), " 31/40"] }), _jsxs("div", { children: [_jsx("strong", { children: "Stage 4:" }), " 48/60"] })] }), _jsxs("div", { style: { background: 'rgba(218, 165, 32, 0.1)', padding: '10px', borderLeft: '3px solid #daa520' }, children: [_jsx("strong", { children: "Composite Score: 83.7" }), " | Strengths: Military background, Persian cultural knowledge"] })] }), _jsxs("div", { className: "applicant-card", children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }, children: [_jsxs("div", { children: [_jsx("h4", { style: { color: '#8b4513', marginBottom: '5px' }, children: "Jennifer Walsh" }), _jsx("p", { style: { color: '#6b5b73', fontSize: '0.9em' }, children: "jen.walsh @email.com | GMT" })] }), _jsx("span", { className: "status-badge status-failed", children: "Not Selected" })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '15px' }, children: [_jsxs("div", { children: [_jsx("strong", { children: "Stage 1:" }), " 71/100"] }), _jsxs("div", { children: [_jsx("strong", { children: "Stage 2:" }), " 33/60"] }), _jsxs("div", { children: [_jsx("strong", { children: "Stage 3:" }), " \u2014"] }), _jsxs("div", { children: [_jsx("strong", { children: "Stage 4:" }), " \u2014"] })] }), _jsxs("div", { style: { background: 'rgba(220, 20, 60, 0.1)', padding: '10px', borderLeft: '3px solid #dc143c' }, children: [_jsx("strong", { children: "Composite Score: 45.2" }), " | Issues: Failed Stage 2 comprehension, generic feedback"] })] })] })] }) })), "            ", currentStage === 6 && (_jsxs("div", { className: "score-display", children: ["                    ", _jsx("h2", { style: { marginBottom: '20px' }, children: "Application Complete!" }), "                    ", _jsxs("div", { className: "score-breakdown", children: ["                        ", _jsxs("div", { className: "score-item", children: ["                            ", _jsx("h4", { children: "Stage 1" }), "                            ", _jsxs("p", { children: [applicationData.stage1?.rawScore || 0, "/100"] }), "                        "] }), "                        ", _jsxs("div", { className: "score-item", children: ["                            ", _jsx("h4", { children: "Stage 2" }), "                            ", _jsxs("p", { children: [applicationData.stage2?.rawScore || 0, "/60"] }), "                        "] }), "                        ", _jsxs("div", { className: "score-item", children: ["                            ", _jsx("h4", { children: "Stage 3" }), "                            ", _jsxs("p", { children: [applicationData.stage3?.rawScore || 0, "/40"] }), "                        "] }), "                        ", _jsxs("div", { className: "score-item", children: ["                            ", _jsx("h4", { children: "Stage 4" }), "                            ", _jsxs("p", { children: [applicationData.stage4?.rawScore || 0, "/60"] }), "                        "] }), "                    "] }), "                    ", _jsxs("div", { style: { marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.3)' }, children: ["                        ", _jsxs("h3", { children: ["Final Composite Score: ", applicationData.compositeScore || 0, "/100"] }), "                        ", _jsx("p", { style: { marginTop: '15px' }, children: "Thank you for your application! We\\'ll be in touch within 1-2 weeks with our decision." }), "                    "] }), "                    ", "                    ", _jsxs("div", { className: "submitted-data", style: { marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.3)' }, children: ["                        ", _jsx("h3", { children: "Submitted Application Data for Review" }), "                        ", "                        ", applicationData.stage1 && (_jsxs("div", { style: { marginBottom: '20px' }, children: ["                                ", _jsx("h4", { children: "Stage 1: Application Form" }), "                                ", Object.entries(applicationData.stage1).map(([key, value]) => (_jsxs("p", { children: [_jsxs("strong", { children: [key, ":"] }), " ", JSON.stringify(value)] }, key))), "                            "] })), "                        ", "                        ", applicationData.stage2 && (_jsxs("div", { style: { marginBottom: '20px' }, children: ["                                ", _jsx("h4", { children: "Stage 2: Comprehension Test" }), "                                ", Object.entries(applicationData.stage2).map(([key, value]) => (_jsxs("p", { children: [_jsxs("strong", { children: [key, ":"] }), " ", JSON.stringify(value)] }, key))), "                            "] })), "                        ", "                        ", applicationData.stage3 && (_jsxs("div", { style: { marginBottom: '20px' }, children: ["                                ", _jsx("h4", { children: "Stage 3: Calibration Test" }), "                                ", Object.entries(applicationData.stage3).map(([key, value]) => (_jsxs("p", { children: [_jsxs("strong", { children: [key, ":"] }), " ", JSON.stringify(value)] }, key))), "                            "] })), "                        ", "                        ", applicationData.stage4 && (_jsxs("div", { style: { marginBottom: '20px' }, children: ["                                ", _jsx("h4", { children: "Stage 4: Timed Trial Task" }), "                                ", Object.entries(applicationData.stage4).map(([key, value]) => (_jsxs("p", { children: [_jsxs("strong", { children: [key, ":"] }), " ", JSON.stringify(value)] }, key))), "                            "] })), "                    "] }), "                "] }))] }));
};
export default BetaApplication;
//# sourceMappingURL=BetaApplication.js.map