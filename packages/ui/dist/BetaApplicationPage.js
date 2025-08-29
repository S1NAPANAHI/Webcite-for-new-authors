import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import applicationConfig from './beta_reader_application_system.json' with { type: 'json' };
const config = applicationConfig;
export const BetaApplicationPage = () => {
    const [currentStageIndex, setCurrentStageIndex] = useState(0);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [stageScores, setStageScores] = useState({});
    const [isQualified, setIsQualified] = useState(true);
    const [applicationComplete, setApplicationComplete] = useState(false);
    const [finalClassification, setFinalClassification] = useState('');
    const [totalScore, setTotalScore] = useState(0);
    const stages = Object.values(config.application_stages);
    const currentStage = stages[currentStageIndex];
    const totalStages = stages.length;
    useEffect(() => {
        const initialData = {};
        stages.forEach(stage => {
            stage.questions.forEach(question => {
                if (question.type === 'checkbox_multiple' || question.type === 'date_range') {
                    initialData[question.id] = [];
                }
                else if (question.type === 'multiple_choice' || question.type === 'slider' || question.type === 'textarea') {
                    initialData[question.id] = '';
                }
            });
        });
        setFormData(initialData);
    }, []);
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
    };
    const countWords = (text) => {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    };
    const validateStage = () => {
        let currentStageErrors = {};
        let isValid = true;
        currentStage.questions.forEach(question => {
            if (question.required) {
                const value = formData[question.id];
                if (!value || (Array.isArray(value) && value.length === 0)) {
                    currentStageErrors[question.id] = 'This field is required.';
                    isValid = false;
                }
                else if (question.type === 'textarea') {
                    const wordCount = countWords(value);
                    if (question.min_words && wordCount < question.min_words) {
                        currentStageErrors[question.id] = `Minimum ${question.min_words} words required.`;
                        isValid = false;
                    }
                    if (question.max_words && wordCount > question.max_words) {
                        currentStageErrors[question.id] = `Maximum ${question.max_words} words allowed.`;
                        isValid = false;
                    }
                }
            }
            if (question.type === 'checkbox_multiple' && question.max_selections && formData[question.id] && formData[question.id].length > question.max_selections) {
                currentStageErrors[question.id] = `You can select a maximum of ${question.max_selections} options.`;
                isValid = false;
            }
        });
        setErrors(currentStageErrors);
        return isValid;
    };
    const scoreQuestion = (question, value) => {
        let score = 0;
        if (question.type === 'multiple_choice' && question.options) {
            const selectedOption = question.options.find(opt => opt.text === value);
            score = selectedOption ? selectedOption.score : 0;
        }
        else if (question.type === 'checkbox_multiple' && question.options && Array.isArray(value)) {
            score = value.reduce((sum, selectedText) => {
                const selectedOption = question.options?.find(opt => opt.text === selectedText);
                return sum + (selectedOption ? selectedOption.score : 0);
            }, 0);
        }
        else if (question.type === 'slider' && value) {
            score = Math.min(10, Math.floor(parseInt(value) / 10));
        }
        else if (question.type === 'textarea') {
            score = value && countWords(value) > 0 ? 5 : 0;
        }
        return score * question.weight;
    };
    const calculateStageScore = (stage) => {
        let score = 0;
        stage.questions.forEach(question => {
            score += scoreQuestion(question, formData[question.id]);
        });
        return Math.round(score * (stage.max_possible_score / 10));
    };
    const handleNext = () => {
        if (validateStage()) {
            const score = calculateStageScore(currentStage);
            setStageScores((prevScores) => ({ ...prevScores, [currentStageIndex]: score }));
            if (currentStage.min_score_required && score < currentStage.min_score_required) {
                setIsQualified(false);
                setApplicationComplete(true);
                return;
            }
            if (currentStageIndex < totalStages - 1) {
                setCurrentStageIndex(prevIndex => prevIndex + 1);
            }
            else {
                completeApplication();
            }
        }
    };
    const handlePrevious = () => {
        if (currentStageIndex > 0) {
            setCurrentStageIndex(prevIndex => prevIndex - 1);
        }
    };
    const classifyApplicant = (score) => {
        const thresholds = config.scoring_system.overall_thresholds;
        if (score >= thresholds.auto_accept)
            return 'auto_accept';
        if (score >= thresholds.strong_candidate)
            return 'strong_candidate';
        if (score >= thresholds.interview_required)
            return 'interview_required';
        return 'auto_reject';
    };
    const completeApplication = () => {
        let finalTotalScore = Object.values(stageScores).reduce((sum, score) => sum + score, 0);
        setTotalScore(finalTotalScore);
        setFinalClassification(classifyApplicant(finalTotalScore));
        setApplicationComplete(true);
    };
    const renderQuestion = (question) => {
        const value = formData[question.id];
        const error = errors[question.id];
        switch (question.type) {
            case 'multiple_choice':
                return (_jsxs("div", { className: "question-container mb-4 p-4 bg-background-light rounded-lg shadow-sm border-l-4 border-primary", children: [_jsxs("label", { className: "block text-lg font-semibold text-textLight mb-2", children: [question.question, " ", question.required && _jsx("span", { className: "text-errorRed", children: "*" })] }), question.options?.map(option => (_jsxs("label", { className: "radio-option", children: [_jsx("input", { type: "radio", name: question.id, value: option.text, checked: value === option.text, onChange: handleChange }), _jsx("span", { className: "radio-custom" }), _jsx("span", { className: "option-text", children: option.text })] }, option.text))), error && _jsx("p", { className: "text-errorRed text-sm mt-1", children: error })] }, question.id));
            case 'checkbox_multiple':
                return (_jsxs("div", { className: "question-container mb-4 p-4 bg-background-light rounded-lg shadow-sm border-l-4 border-primary", children: [_jsxs("label", { className: "block text-lg font-semibold text-textLight mb-2", children: [question.question, " ", question.required && _jsx("span", { className: "text-errorRed", children: "*" })] }), question.options?.map(option => (_jsxs("label", { className: "checkbox-option", children: [_jsx("input", { type: "checkbox", name: question.id, value: option.text, checked: Array.isArray(value) && value.includes(option.text), onChange: handleChange }), _jsx("span", { className: "checkbox-custom" }), _jsx("span", { className: "option-text", children: option.text })] }, option.text))), question.max_selections && _jsxs("p", { className: "text-sm text-grayDark mt-1", children: ["Select up to ", question.max_selections] }), error && _jsx("p", { className: "text-errorRed text-sm mt-1", children: error })] }, question.id));
            case 'textarea':
                return (_jsxs("div", { className: "question-container mb-4 p-4 bg-background-light rounded-lg shadow-sm border-l-4 border-primary", children: [_jsxs("label", { htmlFor: question.id, className: "block text-lg font-semibold text-textLight mb-2", children: [question.question, " ", question.required && _jsx("span", { className: "text-errorRed", children: "*" })] }), question.sample_text && _jsx("p", { className: "text-grayDark text-base mb-2 italic", children: question.sample_text }), _jsx("textarea", { id: question.id, name: question.id, value: value || '', onChange: handleChange, rows: 6, className: "mt-1 block w-full border border-borderColorLight rounded-md shadow-sm p-2 focus:border-primary focus:ring-primary" }), question.min_words && question.max_words && (_jsxs("p", { className: "text-xs text-grayDark mt-1", children: ["Words: ", countWords(value || ''), " / ", question.max_words, " (min: ", question.min_words, ")"] })), error && _jsx("p", { className: "text-errorRed text-sm mt-1", children: error })] }, question.id));
            case 'slider':
                return (_jsxs("div", { className: "question-container mb-4 p-4 bg-background-light rounded-lg shadow-sm border-l-4 border-primary", children: [_jsxs("label", { htmlFor: question.id, className: "block text-lg font-semibold text-textLight mb-2", children: [question.question, " ", question.required && _jsx("span", { className: "text-errorRed", children: "*" })] }), _jsx("input", { type: "range", id: question.id, name: question.id, min: question.min, max: question.max, step: question.step, value: value || (question.min || 0), onChange: handleChange, className: "w-full h-2 bg-grayMedium rounded-lg appearance-none cursor-pointer accent-primary" }), _jsxs("div", { className: "flex justify-between text-sm text-grayDark mt-1", children: [_jsx("span", { children: question.min }), _jsx("span", { children: value || (question.min || 0) }), _jsx("span", { children: question.max })] }), error && _jsx("p", { className: "text-errorRed text-sm mt-1", children: error })] }, question.id));
            case 'date_range':
                return (_jsxs("div", { className: "question-container mb-4 p-4 bg-background-light rounded-lg shadow-sm border-l-4 border-primary", children: [_jsxs("label", { htmlFor: question.id, className: "block text-lg font-semibold text-textLight mb-2", children: [question.question, " ", question.required && _jsx("span", { className: "text-errorRed", children: "*" })] }), _jsx("p", { className: "text-base text-grayDark", children: "Date range selection not fully implemented in this example." }), error && _jsx("p", { className: "text-errorRed text-sm mt-1", children: error })] }, question.id));
            default:
                return _jsxs("p", { className: "text-errorRed", children: ["Unknown question type: ", question.type] }, question.id);
        }
    };
    if (applicationComplete) {
        if (!isQualified) {
            return (_jsxs("div", { className: "container mx-auto p-4 text-center text-textLight rounded-lg shadow-lg my-8 card-glow", children: [_jsx("h1", { className: "text-4xl font-bold mb-4 text-errorRed", children: "Application Not Qualified" }), _jsx("p", { className: "text-lg mb-4 text-grayDark", children: "Thank you for your interest in our beta reader program." }), _jsx("p", { className: "text-md mb-6 text-grayDark", children: "Unfortunately, you do not meet the minimum requirements for this stage. We encourage you to gain more reading experience and apply again in the future." }), _jsx("button", { onClick: () => window.location.reload(), className: "btn-glow text-white p-3 rounded-md font-semibold active:scale-95 active:shadow-inner cursor-pointer transition duration-300 ease-in-out", children: "Start Over" })] }));
        }
        else {
            const messages = {
                'auto_accept': 'Congratulations! You have been automatically accepted into our beta reader program.',
                'strong_candidate': 'Excellent! You are a strong candidate. We will contact you within 48 hours.',
                'interview_required': 'Thank you for applying. We would like to schedule a brief interview with you.',
                'auto_reject': 'Thank you for your interest. Unfortunately, you do not meet our current requirements.'
            };
            return (_jsxs("div", { className: "container mx-auto p-4 text-center text-textLight rounded-lg shadow-lg my-8 card-glow", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "Application Complete" }), _jsxs("div", { className: "p-6 rounded-lg shadow-md mb-6 card-glow", children: [_jsxs("h2", { className: "text-3xl font-semibold mb-2", children: ["Your Score: ", totalScore] }), _jsx("p", { className: "text-lg", children: messages[finalClassification] })] }), _jsx("button", { onClick: () => window.location.reload(), className: "btn-glow text-white p-3 rounded-md font-semibold active:scale-95 active:shadow-inner cursor-pointer transition duration-300 ease-in-out", children: "Apply Again" })] }));
        }
    }
    return (_jsxs("div", { className: "container mx-auto p-4 bg-background-light text-textLight rounded-lg shadow-lg my-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-6 text-primary text-center hero-title-glow", children: "Beta Program Application" }), _jsx("div", { className: "w-full bg-grayMedium rounded-full h-2.5 mb-4", children: _jsx("div", { className: "bg-primary h-2.5 rounded-full transition-all duration-500 ease-in-out", style: { width: `${((currentStageIndex + 1) / totalStages) * 100}%` } }) }), _jsxs("p", { className: "text-center text-base text-grayDark mb-6", children: ["Stage ", currentStageIndex + 1, " of ", totalStages, ": ", currentStage.title] }), _jsxs("form", { onSubmit: (e) => { e.preventDefault(); handleNext(); }, className: "space-y-6", children: [_jsxs("section", { className: "p-6 bg-background-light rounded-lg shadow-md border border-borderColorLight", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4 text-textLight", children: currentStage.title }), _jsx("p", { className: "text-lg text-grayDark mb-4", children: currentStage.description }), currentStage.questions.map(renderQuestion)] }), _jsxs("div", { className: "flex justify-between mt-6", children: [currentStageIndex > 0 && (_jsx("button", { type: "button", onClick: handlePrevious, className: "btn-glow text-white p-3 rounded-md font-semibold active:scale-95 active:shadow-inner cursor-pointer transition duration-300 ease-in-out", children: "Previous" })), _jsx("button", { type: "submit", className: "btn-glow text-white p-3 rounded-md font-semibold active:scale-95 active:shadow-inner cursor-pointer transition duration-300 ease-in-out ml-auto", children: currentStageIndex === totalStages - 1 ? 'Submit Application' : 'Next' })] })] })] }));
};
//# sourceMappingURL=BetaApplicationPage.js.map