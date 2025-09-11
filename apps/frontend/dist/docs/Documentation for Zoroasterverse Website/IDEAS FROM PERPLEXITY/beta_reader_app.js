
// Beta Reader Application - Multi-Stage Form System
// Complete JavaScript implementation with scoring algorithm

class BetaReaderApplication {
    constructor() {
        this.currentStage = 1;
        this.totalStages = 4;
        this.responses = {};
        this.stageScores = {};
        this.totalScore = 0;
        this.isQualified = true;
        this.applicationData = null;

        // Load application configuration
        this.loadConfiguration();
        this.initializeApplication();
    }

    loadConfiguration() {
        // Application stages configuration (would typically come from JSON file)
        this.config = {
            stages: {
                1: {
                    title: "Basic Information & Pre-Screening",
                    description: "Initial qualification and basic details",
                    autoDisqualify: true,
                    minScoreRequired: 15,
                    maxPossibleScore: 30,
                    questions: [
                        {
                            id: "reading_frequency",
                            type: "multiple_choice",
                            question: "How many books do you typically read per year?",
                            options: [
                                {text: "0-5 books", score: 1},
                                {text: "6-11 books", score: 3},
                                {text: "12-24 books", score: 5},
                                {text: "25-49 books", score: 7},
                                {text: "50+ books", score: 10}
                            ],
                            weight: 0.33,
                            required: true
                        },
                        {
                            id: "genre_familiarity", 
                            type: "multiple_choice",
                            question: "How familiar are you with fantasy fiction?",
                            options: [
                                {text: "Never read it", score: 1},
                                {text: "Read a few books", score: 3},
                                {text: "Read occasionally", score: 5},
                                {text: "Read regularly", score: 7},
                                {text: "Expert knowledge", score: 10}
                            ],
                            weight: 0.33,
                            required: true
                        },
                        {
                            id: "time_commitment",
                            type: "multiple_choice", 
                            question: "How many hours per week can you dedicate to beta reading?",
                            options: [
                                {text: "1-2 hours", score: 2},
                                {text: "3-5 hours", score: 5},
                                {text: "6-9 hours", score: 7},
                                {text: "10-14 hours", score: 9},
                                {text: "15+ hours", score: 10}
                            ],
                            weight: 0.34,
                            required: true
                        }
                    ]
                },
                2: {
                    title: "Experience & Skills Assessment",
                    description: "Detailed evaluation of reading and feedback experience",
                    minScoreRequired: 25,
                    maxPossibleScore: 40,
                    questions: [
                        {
                            id: "beta_experience",
                            type: "multiple_choice",
                            question: "How many beta reading projects have you completed?",
                            options: [
                                {text: "None", score: 2},
                                {text: "1 project", score: 4},
                                {text: "2-4 projects", score: 6}, 
                                {text: "5-9 projects", score: 8},
                                {text: "10+ projects", score: 10}
                            ],
                            weight: 0.25,
                            required: true
                        },
                        {
                            id: "feedback_strengths",
                            type: "checkbox_multiple",
                            question: "What are your strongest areas for providing feedback? (Select up to 4)",
                            options: [
                                {text: "Plot structure and pacing", score: 3},
                                {text: "Character development", score: 3},
                                {text: "Dialogue authenticity", score: 2},
                                {text: "World-building consistency", score: 2},
                                {text: "Grammar and style", score: 2},
                                {text: "Emotional impact", score: 2}
                            ],
                            weight: 0.30,
                            maxSelections: 4,
                            required: true
                        },
                        {
                            id: "writing_background",
                            type: "multiple_choice",
                            question: "What best describes your writing/editing background?",
                            options: [
                                {text: "No writing experience", score: 2},
                                {text: "Casual writer", score: 4},
                                {text: "Serious writer (unpublished)", score: 6},
                                {text: "Published author", score: 8},
                                {text: "Professional editor/reviewer", score: 10}
                            ],
                            weight: 0.25,
                            required: true
                        },
                        {
                            id: "reading_speed",
                            type: "slider",
                            question: "Approximately how many pages can you read per hour?",
                            min: 10,
                            max: 100,
                            step: 5,
                            weight: 0.20,
                            required: true
                        }
                    ]
                },
                3: {
                    title: "Sample Feedback Analysis", 
                    description: "Evaluate analytical skills through sample text review",
                    minScoreRequired: 30,
                    maxPossibleScore: 50,
                    sampleText: "The obsidian gates groaned, not with the weight of stone, but with the sorrow of ages. Kaelen watched from the shadows, his breath a ghost in the frigid air, as the sigil on the archway pulsed with a faint, sickly green light. It was a warning. It was an invitation.",
                    questions: [
                        {
                            id: "excerpt_analysis",
                            type: "textarea",
                            question: "Read this excerpt and identify what works well (100-300 words):",
                            minWords: 100,
                            maxWords: 300,
                            weight: 0.30,
                            required: true,
                            scoringCriteria: [
                                {aspect: "Identifies specific literary techniques", maxScore: 3},
                                {aspect: "Provides concrete examples from text", maxScore: 3},
                                {aspect: "Shows genre awareness", maxScore: 2},
                                {aspect: "Demonstrates emotional engagement", maxScore: 2}
                            ]
                        },
                        {
                            id: "problem_identification",
                            type: "textarea", 
                            question: "What, if anything, was confusing or unclear? How could it be improved? (100-300 words)",
                            minWords: 100,
                            maxWords: 300,
                            weight: 0.30,
                            required: true,
                            scoringCriteria: [
                                {aspect: "Identifies genuine readability issues", maxScore: 3},
                                {aspect: "Distinguishes objective vs subjective concerns", maxScore: 3},
                                {aspect: "Explains reasoning clearly", maxScore: 2},
                                {aspect: "Provides constructive context", maxScore: 2}
                            ]
                        },
                        {
                            id: "actionable_suggestion",
                            type: "textarea",
                            question: "Provide one specific, actionable suggestion to enhance this scene (60-200 words)",
                            minWords: 60,
                            maxWords: 200,
                            weight: 0.40,
                            required: true,
                            scoringCriteria: [
                                {aspect: "Offers specific, implementable solution", maxScore: 4},
                                {aspect: "Shows understanding of author's intent", maxScore: 3},
                                {aspect: "Suggests enhancement rather than just fixes", maxScore: 3}
                            ]
                        }
                    ]
                },
                4: {
                    title: "Final Assessment & Preferences",
                    description: "Communication style and final compatibility check",
                    minScoreRequired: 20,
                    maxPossibleScore: 30,
                    questions: [
                        {
                            id: "communication_style",
                            type: "multiple_choice",
                            question: "How would you describe your feedback style?",
                            options: [
                                {text: "Direct and detailed", score: 8},
                                {text: "Gentle but thorough", score: 10},
                                {text: "Focused on major issues", score: 6},
                                {text: "Encouraging with suggestions", score: 9},
                                {text: "Technical and analytical", score: 7}
                            ],
                            weight: 0.40,
                            required: true
                        },
                        {
                            id: "motivation",
                            type: "textarea",
                            question: "Why do you want to be a beta reader for this project? (50-150 words)",
                            minWords: 50,
                            maxWords: 150,
                            weight: 0.60,
                            required: true,
                            scoringCriteria: [
                                {aspect: "Shows genuine interest in the work", maxScore: 4},
                                {aspect: "Demonstrates understanding of role", maxScore: 3},
                                {aspect: "Articulates value they can provide", maxScore: 3}
                            ]
                        }
                    ]
                }
            },
            thresholds: {
                autoAccept: 90,
                strongCandidate: 75,
                interviewRequired: 60,
                autoReject: 0
            }
        };
    }

    initializeApplication() {
        this.renderStage(1);
        this.updateProgressBar();
    }

    renderStage(stageNum) {
        const stage = this.config.stages[stageNum];
        const container = document.getElementById('form-container');

        container.innerHTML = `
            <div class="stage-header">
                <h2>${stage.title}</h2>
                <p class="stage-description">${stage.description}</p>
            </div>
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(stageNum / this.totalStages) * 100}%"></div>
                </div>
                <span class="progress-text">Stage ${stageNum} of ${this.totalStages}</span>
            </div>
            <form id="stage-form" class="stage-form">
                ${this.renderQuestions(stage.questions, stageNum)}
                <div class="form-actions">
                    ${stageNum > 1 ? '<button type="button" class="btn-secondary" onclick="app.previousStage()">Previous</button>' : ''}
                    <button type="submit" class="btn-primary">${stageNum === this.totalStages ? 'Submit Application' : 'Next'}</button>
                </div>
            </form>
        `;

        document.getElementById('stage-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleStageSubmission(stageNum);
        });
    }

    renderQuestions(questions, stageNum) {
        return questions.map(question => {
            switch(question.type) {
                case 'multiple_choice':
                    return this.renderMultipleChoice(question);
                case 'checkbox_multiple':
                    return this.renderCheckboxMultiple(question);
                case 'textarea':
                    return this.renderTextarea(question, stageNum);
                case 'slider':
                    return this.renderSlider(question);
                default:
                    return '';
            }
        }).join('');
    }

    renderMultipleChoice(question) {
        return `
            <div class="question-container">
                <h3 class="question-title">${question.question}</h3>
                <div class="radio-group" data-question-id="${question.id}">
                    ${question.options.map((option, index) => `
                        <label class="radio-option">
                            <input type="radio" name="${question.id}" value="${option.score}" data-text="${option.text}">
                            <span class="radio-custom"></span>
                            <span class="option-text">${option.text}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderCheckboxMultiple(question) {
        return `
            <div class="question-container">
                <h3 class="question-title">${question.question}</h3>
                <div class="checkbox-group" data-question-id="${question.id}" data-max-selections="${question.maxSelections}">
                    ${question.options.map(option => `
                        <label class="checkbox-option">
                            <input type="checkbox" name="${question.id}" value="${option.score}" data-text="${option.text}">
                            <span class="checkbox-custom"></span>
                            <span class="option-text">${option.text}</span>
                        </label>
                    `).join('')}
                </div>
                <div class="selection-counter">Selected: <span id="${question.id}-count">0</span>/${question.maxSelections}</div>
            </div>
        `;
    }

    renderTextarea(question, stageNum) {
        const sampleText = stageNum === 3 ? `<div class="sample-text"><h4>Sample Text:</h4><p class="excerpt">${this.config.stages[3].sampleText}</p></div>` : '';

        return `
            <div class="question-container">
                <h3 class="question-title">${question.question}</h3>
                ${sampleText}
                <div class="textarea-container">
                    <textarea 
                        id="${question.id}" 
                        name="${question.id}" 
                        placeholder="Your response..."
                        data-min-words="${question.minWords}"
                        data-max-words="${question.maxWords}"
                        oninput="app.updateWordCount('${question.id}')">
                    </textarea>
                    <div class="word-count">
                        Words: <span id="${question.id}-count">0</span> / ${question.maxWords} 
                        (minimum: ${question.minWords})
                    </div>
                </div>
            </div>
        `;
    }

    renderSlider(question) {
        return `
            <div class="question-container">
                <h3 class="question-title">${question.question}</h3>
                <div class="slider-container">
                    <input 
                        type="range" 
                        id="${question.id}" 
                        name="${question.id}"
                        min="${question.min}" 
                        max="${question.max}" 
                        step="${question.step}"
                        value="${(question.min + question.max) / 2}"
                        oninput="app.updateSliderValue('${question.id}')"
                        class="slider">
                    <div class="slider-labels">
                        <span>${question.min}</span>
                        <span id="${question.id}-value">${(question.min + question.max) / 2}</span>
                        <span>${question.max}</span>
                    </div>
                </div>
            </div>
        `;
    }

    handleStageSubmission(stageNum) {
        if (!this.validateStage(stageNum)) {
            return;
        }

        // Collect and score responses
        const stageScore = this.scoreStage(stageNum);
        this.stageScores[stageNum] = stageScore;

        // Check if they meet minimum requirements for this stage
        const minRequired = this.config.stages[stageNum].minScoreRequired;
        if (stageScore < minRequired) {
            this.isQualified = false;
            this.showDisqualificationMessage(stageNum, stageScore, minRequired);
            return;
        }

        // Progress to next stage or complete application
        if (stageNum < this.totalStages) {
            this.currentStage++;
            this.renderStage(this.currentStage);
        } else {
            this.completeApplication();
        }
    }

    validateStage(stageNum) {
        const stage = this.config.stages[stageNum];
        let isValid = true;

        stage.questions.forEach(question => {
            if (question.required) {
                const value = this.getQuestionValue(question);
                if (!value || (Array.isArray(value) && value.length === 0)) {
                    this.showError(question.id, 'This field is required');
                    isValid = false;
                } else if (question.type === 'textarea') {
                    const wordCount = this.countWords(value);
                    if (wordCount < question.minWords) {
                        this.showError(question.id, `Minimum ${question.minWords} words required`);
                        isValid = false;
                    } else if (wordCount > question.maxWords) {
                        this.showError(question.id, `Maximum ${question.maxWords} words allowed`);
                        isValid = false;
                    }
                }
            }
        });

        return isValid;
    }

    scoreStage(stageNum) {
        const stage = this.config.stages[stageNum];
        let stageScore = 0;

        stage.questions.forEach(question => {
            const value = this.getQuestionValue(question);
            let questionScore = 0;

            if (question.type === 'multiple_choice') {
                questionScore = parseInt(value) * question.weight;
            } else if (question.type === 'checkbox_multiple') {
                questionScore = value.reduce((sum, score) => sum + parseInt(score), 0) * question.weight;
            } else if (question.type === 'slider') {
                // Convert slider value to score (1-10 scale)
                questionScore = Math.min(10, Math.floor(parseInt(value) / 10)) * question.weight;
            } else if (question.type === 'textarea') {
                // Textarea scoring would need manual review or NLP analysis
                // For now, assign base score - in real implementation, this would be scored manually
                questionScore = this.scoreTextResponse(value, question.scoringCriteria) * question.weight;
            }

            stageScore += questionScore;
        });

        return Math.round(stageScore * stage.maxPossibleScore / 10); // Normalize to stage max score
    }

    scoreTextResponse(text, criteria) {
        // Simplified automated scoring - in practice this would need human review
        const wordCount = this.countWords(text);
        const hasExamples = /example|instance|such as|for example|specifically/i.test(text);
        const hasAnalysis = /because|therefore|analysis|technique|effective/i.test(text);
        const isDetailed = wordCount > 150;

        let score = 5; // Base score
        if (hasExamples) score += 1;
        if (hasAnalysis) score += 2;
        if (isDetailed) score += 1;

        return Math.min(10, score);
    }

    getQuestionValue(question) {
        if (question.type === 'multiple_choice') {
            const selected = document.querySelector(`input[name="${question.id}"]:checked`);
            return selected ? selected.value : null;
        } else if (question.type === 'checkbox_multiple') {
            const selected = document.querySelectorAll(`input[name="${question.id}"]:checked`);
            return Array.from(selected).map(input => input.value);
        } else if (question.type === 'textarea' || question.type === 'slider') {
            const element = document.getElementById(question.id);
            return element ? element.value : null;
        }
        return null;
    }

    completeApplication() {
        // Calculate total score
        this.totalScore = Object.values(this.stageScores).reduce((sum, score) => sum + score, 0);

        // Apply bonus criteria
        this.totalScore += this.calculateBonuses();

        // Determine final classification
        const classification = this.classifyApplicant();

        // Show results
        this.showResults(classification);
    }

    calculateBonuses() {
        let bonuses = 0;

        // Genre expert bonus
        const genreScore = this.responses['genre_familiarity'];
        if (genreScore >= 9) bonuses += 5;

        // Professional experience bonus
        const writingScore = this.responses['writing_background'];
        if (writingScore >= 8) bonuses += 10;

        return bonuses;
    }

    classifyApplicant() {
        const thresholds = this.config.thresholds;

        if (this.totalScore >= thresholds.autoAccept) return 'auto_accept';
        if (this.totalScore >= thresholds.strongCandidate) return 'strong_candidate';  
        if (this.totalScore >= thresholds.interviewRequired) return 'interview_required';
        return 'auto_reject';
    }

    showResults(classification) {
        const messages = {
            'auto_accept': 'Congratulations! You have been automatically accepted into our beta reader program.',
            'strong_candidate': 'Excellent! You are a strong candidate. We will contact you within 48 hours.',
            'interview_required': 'Thank you for applying. We would like to schedule a brief interview with you.',
            'auto_reject': 'Thank you for your interest. Unfortunately, you do not meet our current requirements.'
        };

        document.getElementById('form-container').innerHTML = `
            <div class="results-container">
                <h2>Application Complete</h2>
                <div class="score-display">
                    <h3>Your Score: ${this.totalScore}/150</h3>
                    <div class="score-breakdown">
                        ${Object.entries(this.stageScores).map(([stage, score]) => 
                            `<div>Stage ${stage}: ${score} points</div>`
                        ).join('')}
                    </div>
                </div>
                <div class="result-message ${classification}">
                    <h3>Result: ${classification.replace('_', ' ').toUpperCase()}</h3>
                    <p>${messages[classification]}</p>
                </div>
            </div>
        `;
    }

    // Helper methods
    updateWordCount(questionId) {
        const textarea = document.getElementById(questionId);
        const counter = document.getElementById(questionId + '-count');
        const wordCount = this.countWords(textarea.value);
        counter.textContent = wordCount;
    }

    updateSliderValue(questionId) {
        const slider = document.getElementById(questionId);
        const display = document.getElementById(questionId + '-value');
        display.textContent = slider.value;
    }

    countWords(text) {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }

    showError(elementId, message) {
        // Remove existing error
        const existingError = document.querySelector(`#${elementId}-error`);
        if (existingError) existingError.remove();

        // Add new error
        const element = document.getElementById(elementId) || document.querySelector(`[data-question-id="${elementId}"]`);
        const error = document.createElement('div');
        error.id = elementId + '-error';
        error.className = 'error-message';
        error.textContent = message;
        element.parentNode.appendChild(error);
    }

    previousStage() {
        if (this.currentStage > 1) {
            this.currentStage--;
            this.renderStage(this.currentStage);
        }
    }

    showDisqualificationMessage(stageNum, actualScore, requiredScore) {
        document.getElementById('form-container').innerHTML = `
            <div class="disqualification-container">
                <h2>Application Not Qualified</h2>
                <p>Thank you for your interest in our beta reader program.</p>
                <div class="score-info">
                    <p>Your score for Stage ${stageNum}: <strong>${actualScore}</strong></p>
                    <p>Minimum required: <strong>${requiredScore}</strong></p>
                </div>
                <p>Unfortunately, you do not meet the minimum requirements for this stage. 
                We encourage you to gain more reading experience and apply again in the future.</p>
                <button onclick="location.reload()" class="btn-primary">Start Over</button>
            </div>
        `;
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.app = new BetaReaderApplication();
});
