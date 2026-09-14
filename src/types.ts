export interface EvaluationRequest {
  question: string;
  answer: string;
  domain: string;
  resumeText?: string;
  questionIndex?: number;
  totalQuestions?: number;
}

export interface EvaluationMetrics {
  technicalAccuracy: number; // 1-10
  clarity: number; // 1-10
  structureSTAR: number; // 1-10
  relevance: number; // 1-10
}

export interface EvaluationFeedback {
  score: number; // 1-10
  scorePercentage: number; // 10-100
  ratingLabel: string;
  strengths: string[];
  improvements: string[];
  communicationClarity: string;
  modelAnswerTips: string;
  metrics: EvaluationMetrics;
  agentSteps: string[];
  isLlmPowered?: boolean;
}

export interface InterviewQuestion {
  id: string;
  category: 'Technical' | 'HR / Behavioral' | 'Architecture / Strategy';
  domain: string;
  question: string;
  intent: string;
  sampleKeyPoints: string[];
}

export interface SessionSummaryRequest {
  domain: string;
  questionsCount: number;
  answersHistory: Array<{
    question: string;
    answer: string;
    feedback: EvaluationFeedback;
  }>;
}

export interface SessionSummaryResponse {
  overallScore: number;
  overallRating: string;
  readinessLevel: 'High' | 'Solid' | 'Developing';
  topStrengths: string[];
  priorityAreasToImprove: string[];
  metricsBreakdown: {
    technicalAccuracy: number;
    communicationClarity: number;
    starStructure: number;
    strategicThinking: number;
  };
  coachSummary: string;
}
