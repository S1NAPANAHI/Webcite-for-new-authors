# Create a comprehensive multi-stage beta reader application system with JavaScript implementation
import json

# Define the multi-stage application structure
application_stages = {
    "Stage 1": {
        "title": "Basic Information & Pre-Screening",
        "description": "Initial qualification and basic details",
        "auto_disqualify": True,
        "min_score_required": 15,
        "max_possible_score": 30,
        "questions": [
            {
                "id": "reading_frequency",
                "type": "multiple_choice",
                "question": "How many books do you typically read per year?",
                "options": [
                    {"text": "0-5 books", "score": 1},
                    {"text": "6-11 books", "score": 3},
                    {"text": "12-24 books", "score": 5},
                    {"text": "25-49 books", "score": 7},
                    {"text": "50+ books", "score": 10}
                ],
                "weight": 0.33,
                "required": True
            },
            {
                "id": "genre_familiarity",
                "type": "multiple_choice",
                "question": "How familiar are you with [YOUR GENRE] fiction?",
                "options": [
                    {"text": "Never read it", "score": 1},
                    {"text": "Read a few books", "score": 3},
                    {"text": "Read occasionally", "score": 5},
                    {"text": "Read regularly", "score": 7},
                    {"text": "Expert knowledge", "score": 10}
                ],
                "weight": 0.33,
                "required": True
            },
            {
                "id": "time_commitment",
                "type": "multiple_choice",
                "question": "How many hours per week can you dedicate to beta reading?",
                "options": [
                    {"text": "1-2 hours", "score": 2},
                    {"text": "3-5 hours", "score": 5},
                    {"text": "6-9 hours", "score": 7},
                    {"text": "10-14 hours", "score": 9},
                    {"text": "15+ hours", "score": 10}
                ],
                "weight": 0.34,
                "required": True
            }
        ]
    },
    
    "Stage 2": {
        "title": "Experience & Skills Assessment",
        "description": "Detailed evaluation of reading and feedback experience",
        "conditional_display": True,
        "min_score_required": 25,
        "max_possible_score": 40,
        "questions": [
            {
                "id": "beta_experience",
                "type": "multiple_choice",
                "question": "How many beta reading projects have you completed?",
                "options": [
                    {"text": "None", "score": 2},
                    {"text": "1 project", "score": 4},
                    {"text": "2-4 projects", "score": 6},
                    {"text": "5-9 projects", "score": 8},
                    {"text": "10+ projects", "score": 10}
                ],
                "weight": 0.25,
                "required": True
            },
            {
                "id": "feedback_strengths",
                "type": "checkbox_multiple",
                "question": "What are your strongest areas for providing feedback? (Select all that apply)",
                "options": [
                    {"text": "Plot structure and pacing", "score": 3},
                    {"text": "Character development", "score": 3},
                    {"text": "Dialogue authenticity", "score": 2},
                    {"text": "World-building consistency", "score": 2},
                    {"text": "Grammar and style", "score": 2},
                    {"text": "Emotional impact", "score": 2}
                ],
                "weight": 0.30,
                "max_selections": 4,
                "required": True
            },
            {
                "id": "writing_background",
                "type": "multiple_choice",
                "question": "What best describes your writing/editing background?",
                "options": [
                    {"text": "No writing experience", "score": 2},
                    {"text": "Casual writer", "score": 4},
                    {"text": "Serious writer (unpublished)", "score": 6},
                    {"text": "Published author", "score": 8},
                    {"text": "Professional editor/reviewer", "score": 10}
                ],
                "weight": 0.25,
                "required": True
            },
            {
                "id": "reading_speed",
                "type": "slider",
                "question": "Approximately how many pages can you read per hour?",
                "min": 10,
                "max": 100,
                "step": 5,
                "scoring_formula": "Math.min(10, Math.floor(value / 10))",
                "weight": 0.20,
                "required": True
            }
        ]
    },
    
    "Stage 3": {
        "title": "Sample Feedback Analysis",
        "description": "Evaluate analytical skills through sample text review",
        "min_score_required": 30,
        "max_possible_score": 50,
        "questions": [
            {
                "id": "excerpt_analysis",
                "type": "textarea",
                "question": "Read this excerpt and identify what works well (100-300 words):",
                "sample_text": "The obsidian gates groaned, not with the weight of stone, but with the sorrow of ages. Kaelen watched from the shadows, his breath a ghost in the frigid air, as the sigil on the archway pulsed with a faint, sickly green light. It was a warning. It was an invitation.",
                "scoring_criteria": [
                    {"aspect": "Identifies specific literary techniques", "max_score": 3},
                    {"aspect": "Provides concrete examples from text", "max_score": 3},
                    {"aspect": "Shows genre awareness", "max_score": 2},
                    {"aspect": "Demonstrates emotional engagement", "max_score": 2}
                ],
                "min_words": 100,
                "max_words": 300,
                "weight": 0.30,
                "required": True
            },
            {
                "id": "problem_identification",
                "type": "textarea",
                "question": "What, if anything, was confusing or unclear? How could it be improved? (100-300 words)",
                "scoring_criteria": [
                    {"aspect": "Identifies genuine readability issues", "max_score": 3},
                    {"aspect": "Distinguishes objective vs subjective concerns", "max_score": 3},
                    {"aspect": "Explains reasoning clearly", "max_score": 2},
                    {"aspect": "Provides constructive context", "max_score": 2}
                ],
                "min_words": 100,
                "max_words": 300,
                "weight": 0.30,
                "required": True
            },
            {
                "id": "actionable_suggestion",
                "type": "textarea",
                "question": "Provide one specific, actionable suggestion to enhance this scene (60-200 words)",
                "scoring_criteria": [
                    {"aspect": "Offers specific, implementable solution", "max_score": 4},
                    {"aspect": "Shows understanding of author's intent", "max_score": 3},
                    {"aspect": "Suggests enhancement rather than just fixes", "max_score": 3}
                ],
                "min_words": 60,
                "max_words": 200,
                "weight": 0.40,
                "required": True
            }
        ]
    },
    
    "Stage 4": {
        "title": "Final Assessment & Preferences",
        "description": "Communication style and final compatibility check",
        "min_score_required": 20,
        "max_possible_score": 30,
        "questions": [
            {
                "id": "communication_style",
                "type": "multiple_choice",
                "question": "How would you describe your feedback style?",
                "options": [
                    {"text": "Direct and detailed", "score": 8},
                    {"text": "Gentle but thorough", "score": 10},
                    {"text": "Focused on major issues", "score": 6},
                    {"text": "Encouraging with suggestions", "score": 9},
                    {"text": "Technical and analytical", "score": 7}
                ],
                "weight": 0.40,
                "required": True
            },
            {
                "id": "availability_window",
                "type": "date_range",
                "question": "What is your availability window for this project?",
                "scoring_criteria": [
                    {"aspect": "Matches project timeline", "max_score": 5},
                    {"aspect": "Provides realistic timeframe", "max_score": 3},
                    {"aspect": "Shows flexibility", "max_score": 2}
                ],
                "weight": 0.30,
                "required": True
            },
            {
                "id": "motivation",
                "type": "textarea",
                "question": "Why do you want to be a beta reader for this project? (50-150 words)",
                "scoring_criteria": [
                    {"aspect": "Shows genuine interest in the work", "max_score": 4},
                    {"aspect": "Demonstrates understanding of role", "max_score": 3},
                    {"aspect": "Articulates value they can provide", "max_score": 3}
                ],
                "min_words": 50,
                "max_words": 150,
                "weight": 0.30,
                "required": True
            }
        ]
    }
}

# Define scoring thresholds and decision matrix
scoring_system = {
    "overall_thresholds": {
        "auto_accept": 90,
        "strong_candidate": 75,
        "interview_required": 60,
        "auto_reject": 0
    },
    "stage_requirements": {
        "stage_1_minimum": 15,
        "stage_2_minimum": 25,
        "stage_3_minimum": 30,
        "stage_4_minimum": 20
    },
    "bonus_criteria": {
        "genre_expert_bonus": 5,
        "professional_experience_bonus": 10,
        "perfect_feedback_sample_bonus": 15,
        "early_completion_bonus": 3
    }
}

print("MULTI-STAGE BETA READER APPLICATION SYSTEM")
print("="*55)

# Display the stage structure
for stage_name, stage_data in application_stages.items():
    print(f"\n{stage_name}: {stage_data['title']}")
    print(f"Description: {stage_data['description']}")
    print(f"Questions: {len(stage_data['questions'])}")
    print(f"Max Score: {stage_data['max_possible_score']}")
    print(f"Min Required: {stage_data['min_score_required']}")

print(f"\n\nScoring System Overview:")
print(f"Total Possible Score: {sum(stage['max_possible_score'] for stage in application_stages.values())}")
for threshold, score in scoring_system['overall_thresholds'].items():
    print(f"- {threshold.replace('_', ' ').title()}: {score}+ points")

# Save the complete system to JSON for implementation
complete_system = {
    "application_stages": application_stages,
    "scoring_system": scoring_system
}

with open('beta_reader_application_system.json', 'w') as f:
    json.dump(complete_system, f, indent=2)

print(f"\n\nComplete system saved to: beta_reader_application_system.json")