import { useState, useEffect } from 'react';
import applicationConfig from './beta_reader_application_system.json' with { type: 'json' };

interface Question {
  id: string;
  type: string;
  question: string;
  options?: { text: string; score: number }[];
  weight: number;
  required: boolean;
  min_words?: number;
  max_words?: number;
  min?: number;
  max?: number;
  step?: number;
  max_selections?: number;
  sample_text?: string;
  scoring_criteria?: { aspect: string; max_score: number }[];
}

interface Stage {
  title: string;
  description: string;
  auto_disqualify?: boolean;
  min_score_required: number;
  max_possible_score: number;
  questions: Question[];
}

interface ApplicationConfig {
  application_stages: { [key: string]: Stage };
  scoring_system: {
    overall_thresholds: {
      auto_accept: number;
      strong_candidate: number;
      interview_required: number;
      auto_reject: number;
    };
    stage_requirements: { [key: string]: number };
    bonus_criteria: { [key: string]: number };
  };
}

interface FormData {
  [key: string]: any; // Will refine this further if needed, but for now, allow any
}

interface Errors {
  [key: string]: string | undefined;
}

interface StageScores {
  [key: number]: number; // Stage index to score
}

const config: ApplicationConfig = applicationConfig as ApplicationConfig;

export const BetaApplicationPage: React.FC = () => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<Errors>({});
  const [stageScores, setStageScores] = useState<StageScores>({});
  const [isQualified, setIsQualified] = useState(true);
  const [applicationComplete, setApplicationComplete] = useState(false);
  const [finalClassification, setFinalClassification] = useState('');
  const [totalScore, setTotalScore] = useState(0);

  const stages = Object.values(config.application_stages);
  const currentStage = stages[currentStageIndex];
  const totalStages = stages.length;

  useEffect(() => {
    const initialData: FormData = {};
    stages.forEach(stage => {
      stage.questions.forEach(question => {
        if (question.type === 'checkbox_multiple' || question.type === 'date_range') {
          initialData[question.id] = [];
        } else if (question.type === 'multiple_choice' || question.type === 'slider' || question.type === 'textarea') {
          initialData[question.id] = '';
        }
      });
    });
    setFormData(initialData);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prevData: FormData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prevErrors: Errors) => ({ ...prevErrors, [name]: undefined }));
  };

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const validateStage = (): boolean => {
    let currentStageErrors: Errors = {};
    let isValid = true;

    currentStage.questions.forEach(question => {
      if (question.required) {
        const value = formData[question.id];
        if (!value || (Array.isArray(value) && value.length === 0)) {
          currentStageErrors[question.id] = 'This field is required.';
          isValid = false;
        } else if (question.type === 'textarea') {
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

  const scoreQuestion = (question: Question, value: any): number => {
    let score = 0;
    if (question.type === 'multiple_choice' && question.options) {
      const selectedOption = question.options.find(opt => opt.text === value);
      score = selectedOption ? selectedOption.score : 0;
    } else if (question.type === 'checkbox_multiple' && question.options && Array.isArray(value)) {
      score = value.reduce((sum: number, selectedText: string) => {
        const selectedOption = question.options?.find(opt => opt.text === selectedText);
        return sum + (selectedOption ? selectedOption.score : 0);
      }, 0);
    } else if (question.type === 'slider' && value) {
      score = Math.min(10, Math.floor(parseInt(value) / 10));
    } else if (question.type === 'textarea') {
      score = value && countWords(value) > 0 ? 5 : 0;
    }
    return score * question.weight;
  };

  const calculateStageScore = (stage: Stage): number => {
    let score = 0;
    stage.questions.forEach(question => {
      score += scoreQuestion(question, formData[question.id]);
    });
    return Math.round(score * (stage.max_possible_score / 10));
  };

  const handleNext = () => {
    if (validateStage()) {
      const score = calculateStageScore(currentStage);
      setStageScores((prevScores: StageScores) => ({ ...prevScores, [currentStageIndex]: score }));

      if (currentStage.min_score_required && score < currentStage.min_score_required) {
        setIsQualified(false);
        setApplicationComplete(true);
        return;
      }

      if (currentStageIndex < totalStages - 1) {
        setCurrentStageIndex(prevIndex => prevIndex + 1);
      } else {
        completeApplication();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStageIndex > 0) {
      setCurrentStageIndex(prevIndex => prevIndex - 1);
    }
  };

  const classifyApplicant = (score: number): string => {
    const thresholds = config.scoring_system.overall_thresholds;
    if (score >= thresholds.auto_accept) return 'auto_accept';
    if (score >= thresholds.strong_candidate) return 'strong_candidate';
    if (score >= thresholds.interview_required) return 'interview_required';
    return 'auto_reject';
  };

  const completeApplication = () => {
    let finalTotalScore: number = Object.values(stageScores).reduce((sum: number, score: number) => sum + score, 0);
    setTotalScore(finalTotalScore);
    setFinalClassification(classifyApplicant(finalTotalScore));
    setApplicationComplete(true);
  };

  const renderQuestion = (question: Question) => {
    const value = formData[question.id];
    const error = errors[question.id];

    switch (question.type) {
      case 'multiple_choice':
        return (
          <div key={question.id} className="question-container mb-4 p-4 bg-background-light rounded-lg shadow-sm border-l-4 border-primary">
            <label className="block text-lg font-semibold text-textLight mb-2">{question.question} {question.required && <span className="text-errorRed">*</span>}</label>
            {question.options?.map(option => (
              <label key={option.text} className="radio-option">
                <input
                  type="radio"
                  name={question.id}
                  value={option.text} // Corrected: Store option.text as value
                  checked={value === option.text}
                  onChange={handleChange}
                />
                <span className="radio-custom"></span>
                <span className="option-text">{option.text}</span>
              </label>
            ))}
            {error && <p className="text-errorRed text-sm mt-1">{error}</p>}
          </div>
        );
      case 'checkbox_multiple':
        return (
          <div key={question.id} className="question-container mb-4 p-4 bg-background-light rounded-lg shadow-sm border-l-4 border-primary">
            <label className="block text-lg font-semibold text-textLight mb-2">{question.question} {question.required && <span className="text-errorRed">*</span>}</label>
            {question.options?.map(option => (
              <label key={option.text} className="checkbox-option">
                <input
                  type="checkbox"
                  name={question.id}
                  value={option.text} // Corrected: Store option.text as value
                  checked={Array.isArray(value) && value.includes(option.text)}
                  onChange={handleChange}
                />
                <span className="checkbox-custom"></span>
                <span className="option-text">{option.text}</span>
              </label>
            ))}
            {question.max_selections && <p className="text-sm text-grayDark mt-1">Select up to {question.max_selections}</p>}
            {error && <p className="text-errorRed text-sm mt-1">{error}</p>}
          </div>
        );
      case 'textarea':
        return (
          <div key={question.id} className="question-container mb-4 p-4 bg-background-light rounded-lg shadow-sm border-l-4 border-primary">
            <label htmlFor={question.id} className="block text-lg font-semibold text-textLight mb-2">{question.question} {question.required && <span className="text-errorRed">*</span>}</label>
            {question.sample_text && <p className="text-grayDark text-base mb-2 italic">{question.sample_text}</p>}
            <textarea
              id={question.id}
              name={question.id}
              value={value || ''}
              onChange={handleChange}
              rows={6}
              className="mt-1 block w-full border border-borderColorLight rounded-md shadow-sm p-2 focus:border-primary focus:ring-primary"
            ></textarea>
            {question.min_words && question.max_words && (
              <p className="text-xs text-grayDark mt-1">Words: {countWords(value || '')} / {question.max_words} (min: {question.min_words})</p>
            )}
            {error && <p className="text-errorRed text-sm mt-1">{error}</p>}
          </div>
        );
      case 'slider':
        return (
          <div key={question.id} className="question-container mb-4 p-4 bg-background-light rounded-lg shadow-sm border-l-4 border-primary">
            <label htmlFor={question.id} className="block text-lg font-semibold text-textLight mb-2">{question.question} {question.required && <span className="text-errorRed">*</span>}</label>
            <input
              type="range"
              id={question.id}
              name={question.id}
              min={question.min}
              max={question.max}
              step={question.step}
              value={value || (question.min || 0)}
              onChange={handleChange}
              className="w-full h-2 bg-grayMedium rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-sm text-grayDark mt-1">
              <span>{question.min}</span>
              <span>{value || (question.min || 0)}</span>
              <span>{question.max}</span>
            </div>
            {error && <p className="text-errorRed text-sm mt-1">{error}</p>}
          </div>
        );
      case 'date_range':
        return (
          <div key={question.id} className="question-container mb-4 p-4 bg-background-light rounded-lg shadow-sm border-l-4 border-primary">
            <label htmlFor={question.id} className="block text-lg font-semibold text-textLight mb-2">{question.question} {question.required && <span className="text-errorRed">*</span>}</label>
            <p className="text-base text-grayDark">Date range selection not fully implemented in this example.</p>
            {error && <p className="text-errorRed text-sm mt-1">{error}</p>}
          </div>
        );
      default:
        return <p key={question.id} className="text-errorRed">Unknown question type: {question.type}</p>;
    }
  };

  if (applicationComplete) {
    if (!isQualified) {
      return (
        <div className="container mx-auto p-4 text-center text-textLight rounded-lg shadow-lg my-8 card-glow">
          <h1 className="text-4xl font-bold mb-4 text-errorRed">Application Not Qualified</h1>
          <p className="text-lg mb-4 text-grayDark">Thank you for your interest in our beta reader program.</p>
          <p className="text-md mb-6 text-grayDark">Unfortunately, you do not meet the minimum requirements for this stage. We encourage you to gain more reading experience and apply again in the future.</p>
          <button onClick={() => window.location.reload()} className="btn-glow text-white p-3 rounded-md font-semibold active:scale-95 active:shadow-inner cursor-pointer transition duration-300 ease-in-out">Start Over</button>
        </div>
      );
    } else {
      const messages: { [key: string]: string } = {
        'auto_accept': 'Congratulations! You have been automatically accepted into our beta reader program.',
        'strong_candidate': 'Excellent! You are a strong candidate. We will contact you within 48 hours.',
        'interview_required': 'Thank you for applying. We would like to schedule a brief interview with you.',
        'auto_reject': 'Thank you for your interest. Unfortunately, you do not meet our current requirements.'
      };
      return (
        <div className="container mx-auto p-4 text-center text-textLight rounded-lg shadow-lg my-8 card-glow">
          <h1 className="text-4xl font-bold mb-4">Application Complete</h1>
          <div className="p-6 rounded-lg shadow-md mb-6 card-glow">
            <h2 className="text-3xl font-semibold mb-2">Your Score: {totalScore}</h2>
            <p className="text-lg">{messages[finalClassification]}</p>
          </div>
          <button onClick={() => window.location.reload()} className="btn-glow text-white p-3 rounded-md font-semibold active:scale-95 active:shadow-inner cursor-pointer transition duration-300 ease-in-out">Apply Again</button>
        </div>
      );
    }
  }

  return (
    <div className="container mx-auto p-4 bg-background-light text-textLight rounded-lg shadow-lg my-8">
      <h1 className="text-4xl font-bold mb-6 text-primary text-center hero-title-glow">Beta Program Application</h1>

      <div className="w-full bg-grayMedium rounded-full h-2.5 mb-4">
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${((currentStageIndex + 1) / totalStages) * 100}%` }}
        ></div>
      </div>
      <p className="text-center text-base text-grayDark mb-6">Stage {currentStageIndex + 1} of {totalStages}: {currentStage.title}</p>

      <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
        <section className="p-6 bg-background-light rounded-lg shadow-md border border-borderColorLight">
          <h2 className="text-3xl font-semibold mb-4 text-textLight">{currentStage.title}</h2>
          <p className="text-lg text-grayDark mb-4">{currentStage.description}</p>
          {currentStage.questions.map(renderQuestion)}
        </section>

        <div className="flex justify-between mt-6">
          {currentStageIndex > 0 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="btn-glow text-white p-3 rounded-md font-semibold active:scale-95 active:shadow-inner cursor-pointer transition duration-300 ease-in-out"
            >
              Previous
            </button>
          )}
          <button
            type="submit"
            className="btn-glow text-white p-3 rounded-md font-semibold active:scale-95 active:shadow-inner cursor-pointer transition duration-300 ease-in-out ml-auto"
          >
            {currentStageIndex === totalStages - 1 ? 'Submit Application' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
};

