/**
 * MODULAR LLM EVALUATOR SERVICE
 * 
 * Instructions for connecting your Groq API:
 * 1. Set your GROQ_API_KEY environment variable:
 *    export GROQ_API_KEY="gsk_..." (or in your container env / .env file)
 * 2. The function `evaluateAnswer` below already detects `process.env.GROQ_API_KEY`
 *    and seamlessly routes to Groq's OpenAI-compatible chat completion endpoint
 *    (using `llama-3.3-70b-versatile` or your model of choice).
 * 3. If no GROQ_API_KEY is configured, it falls back to the high-fidelity
 *    heuristic evaluator below, allowing the full UI and mock interview flow
 *    to work out of the box with zero external dependencies.
 */

import { EvaluationFeedback, SessionSummaryResponse } from '../src/types';

/**
 * Evaluates a candidate's answer for a given interview question and domain.
 * 
 * @param question - The interview question asked
 * @param answer - The candidate's response
 * @param domain - The selected domain ('Software Engineering' | 'Core Engineering' | 'Management')
 * @param resumeText - Optional resume text provided by the candidate during setup
 */
export async function evaluateAnswer(
  question: string,
  answer: string,
  domain: string,
  resumeText?: string
): Promise<EvaluationFeedback> {
  const groqApiKey = process.env.GROQ_API_KEY;

  // If the user has provided their Groq API key in the environment, use the real LLM call!
  if (groqApiKey && groqApiKey.trim().length > 0) {
    try {
      console.log('[Evaluator] GROQ_API_KEY detected. Invoking Groq LLM API...');
      return await evaluateWithGroq(question, answer, domain, resumeText, groqApiKey);
    } catch (error) {
      console.error('[Evaluator] Groq LLM API call encountered an issue, falling back to heuristic evaluator:', error);
      // Fallback gracefully so the interview session is never interrupted
    }
  }

  // Placeholder heuristic evaluator: realistic, domain-aware, STAR-scoring evaluation
  console.log('[Evaluator] Running modular heuristic evaluator for domain:', domain);
  return evaluateWithHeuristic(question, answer, domain, resumeText);
}

/**
 * Real Groq API implementation using Groq's OpenAI-compatible completions endpoint.
 * You can customize the model name (e.g., 'llama-3.3-70b-versatile', 'mixtral-8x7b-32768')
 * or prompt instructions right here.
 */
async function evaluateWithGroq(
  question: string,
  answer: string,
  domain: string,
  resumeText?: string,
  apiKey?: string
): Promise<EvaluationFeedback> {
  const prompt = `
You are an expert executive technical and behavioral interviewer evaluating a candidate in the "${domain}" domain.
Analyze the following interview question and candidate answer:

Question: "${question}"
Candidate Answer: "${answer}"
${resumeText ? `Candidate Resume / Background Snippet: "${resumeText.slice(0, 1000)}"` : ''}

Evaluate the response rigorously based on:
1. Technical depth and correctness for ${domain}
2. Communication clarity and structure (STAR method: Situation, Task, Action, Result)
3. Actionable strengths and targeted areas for improvement

Respond ONLY with a valid JSON object matching this exact TypeScript structure:
{
  "score": number (between 4.0 and 9.8 with 1 decimal),
  "scorePercentage": number (integer 40 to 98),
  "ratingLabel": string (e.g. "Strong Technical Depth", "Solid Structure, Needs Concrete Metrics", "Well-Articulated Leadership"),
  "strengths": string[] (3 bullet points highlighting specific things the candidate did well),
  "improvements": string[] (2-3 constructive bullet points explaining what would make this answer top-tier),
  "communicationClarity": string (1-2 sentences analyzing their tone, conciseness, and delivery),
  "modelAnswerTips": string (A concise 2-sentence tip or structure they could use in the actual interview),
  "metrics": {
    "technicalAccuracy": number (integer 1-10),
    "clarity": number (integer 1-10),
    "structureSTAR": number (integer 1-10),
    "relevance": number (integer 1-10)
  },
  "agentSteps": [
    "✓ Answer analyzed for technical depth",
    "✓ STAR framework & metric quantification scanned",
    "✓ Communication clarity checked",
    "✓ Domain-tailored coaching feedback generated"
  ]
}
`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an elite interview coach evaluating candidate responses. Always output strict valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API returned ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content;
  const parsed = JSON.parse(rawContent);

  return {
    score: Number(parsed.score) || 7.5,
    scorePercentage: Number(parsed.scorePercentage) || Math.round((Number(parsed.score) || 7.5) * 10),
    ratingLabel: parsed.ratingLabel || 'Structured Response',
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ['Clear answer delivery', 'Relevant context provided'],
    improvements: Array.isArray(parsed.improvements) ? parsed.improvements : ['Quantify measurable business results with exact percentages or metrics'],
    communicationClarity: parsed.communicationClarity || 'Clear cadence with direct articulation of key points.',
    modelAnswerTips: parsed.modelAnswerTips || 'Frame your answer using the Situation-Task-Action-Result format with a 30-second context and 90-second deep dive on your specific personal contribution.',
    metrics: {
      technicalAccuracy: Number(parsed.metrics?.technicalAccuracy) || 8,
      clarity: Number(parsed.metrics?.clarity) || 8,
      structureSTAR: Number(parsed.metrics?.structureSTAR) || 7,
      relevance: Number(parsed.metrics?.relevance) || 8,
    },
    agentSteps: [
      '✓ Answer analyzed via Groq LLM engine',
      '✓ Technical accuracy & domain keywords cross-referenced',
      '✓ Communication clarity & STAR structure verified',
      '✓ Feedback generated'
    ],
    isLlmPowered: true
  };
}

/**
 * High-fidelity placeholder evaluator that analyzes the candidate's real text:
 * - Word count & depth
 * - STAR keywords (Situation, Task, Action, Result, Metrics)
 * - Domain-specific vocabulary
 * - Clarity and filler indicators
 * - Resume connection (if provided)
 */
function evaluateWithHeuristic(
  question: string,
  answer: string,
  domain: string,
  resumeText?: string
): EvaluationFeedback {
  const trimmed = answer.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const lowerAnswer = trimmed.toLowerCase();

  // 1. STAR Analysis
  const hasSituation = /situation|context|background|when i was|at my previous|our team was|project/i.test(lowerAnswer);
  const hasTask = /task|goal|objective|challenge|responsible for|target|requirement/i.test(lowerAnswer);
  const hasAction = /i built|i designed|i implemented|i led|i decided|i analyzed|i coordinated|action|my approach|we used/i.test(lowerAnswer);
  const hasResult = /result|outcome|impact|increased|reduced|improved|percent|%|saved|delivered|metric|successfully/i.test(lowerAnswer);
  const starCount = [hasSituation, hasTask, hasAction, hasResult].filter(Boolean).length;

  // 2. Domain Keywords
  let domainKeywords: string[] = [];
  if (domain === 'Software Engineering') {
    domainKeywords = ['api', 'database', 'sql', 'nosql', 'cache', 'redis', 'latency', 'scale', 'microservice', 'concurrency', 'architecture', 'trace', 'monitoring', 'index', 'acid', 'trade-off', 'performance', 'refactor', 'test'];
  } else if (domain === 'Core Engineering') {
    domainKeywords = ['fmea', 'tolerance', 'stress', 'thermal', 'fatigue', 'safety', 'quality', 'root cause', 'prototype', 'cad', 'material', 'dfm', 'spec', 'compliance', 'iso', 'testing', 'simulation'];
  } else {
    // Management
    domainKeywords = ['okr', 'kpi', 'stakeholder', 'morale', '1-on-1', 'mentorship', 'priority', 'alignment', 'trade-off', 'retrospective', 'culture', 'feedback', 'pip', 'capacity', 'roadmap', 'delegat'];
  }

  const matchedKeywords = domainKeywords.filter(kw => lowerAnswer.includes(kw));
  const keywordDensityScore = Math.min(10, Math.max(3, Math.round((matchedKeywords.length / 3) * 6) + 3));

  // 3. Word Count / Depth scoring
  let depthScore = 5;
  if (wordCount < 25) depthScore = 4;
  else if (wordCount < 60) depthScore = 6;
  else if (wordCount < 120) depthScore = 8;
  else if (wordCount < 260) depthScore = 9;
  else depthScore = 8; // too long / rambling

  // 4. Clarity & Filler words
  const fillers = ['um', 'uh', 'like', 'you know', 'basically', 'kind of', 'sort of', 'stuff', 'things'];
  const foundFillers = fillers.filter(f => lowerAnswer.includes(` ${f} `) || lowerAnswer.startsWith(`${f} `));
  const clarityScore = Math.max(4, Math.min(10, 9 - foundFillers.length));

  // 5. Calculate overall score
  const structureScore = Math.min(10, Math.max(4, 4 + starCount * 1.5));
  const technicalAccuracy = Math.min(10, Math.max(5, Math.round((keywordDensityScore * 0.6) + (depthScore * 0.4))));
  const relevance = wordCount > 30 ? 8 : 5;

  const rawAverage = (technicalAccuracy * 0.35) + (clarityScore * 0.25) + (structureScore * 0.25) + (relevance * 0.15);
  const finalScore = Math.round(rawAverage * 10) / 10;
  const scorePercentage = Math.round(finalScore * 10);

  // 6. Label & Strengths
  let ratingLabel = 'Solid Foundation';
  if (finalScore >= 8.8) ratingLabel = 'Exceptional, Interview-Ready';
  else if (finalScore >= 8.0) ratingLabel = 'Strong & Structured Response';
  else if (finalScore >= 7.0) ratingLabel = 'Good Concept, Add Precision';
  else ratingLabel = 'Developing — Needs STAR Structure';

  const strengths: string[] = [];
  if (starCount >= 3) {
    strengths.push('Effective use of the STAR narrative structure (clear Action and Outcome highlighted).');
  } else if (hasAction) {
    strengths.push('Directly specified your personal actions and engineering decisions rather than speaking only passively.');
  } else {
    strengths.push('Addressed the core intent of the question with relevant context.');
  }

  if (matchedKeywords.length >= 2) {
    strengths.push(`Naturally integrated ${domain} domain concepts (${matchedKeywords.slice(0, 3).join(', ')}).`);
  } else {
    strengths.push('Clear conversational tone that was straightforward to follow.');
  }

  if (wordCount >= 70 && wordCount <= 220) {
    strengths.push(`Ideal response pacing (${wordCount} words) — concise enough to maintain interviewer engagement while providing substance.`);
  } else if (foundFillers.length === 0) {
    strengths.push('Clean language without distracting filler phrases or hedging.');
  } else {
    strengths.push('Logical progression of thought from setup to resolution.');
  }

  // 7. Improvements
  const improvements: string[] = [];
  if (!hasResult) {
    improvements.push('Quantify the final outcome: Include concrete metrics (e.g., "reduced latency by 35%", "shipped 2 weeks ahead of deadline", "zero safety incidents").');
  }
  if (wordCount < 60) {
    improvements.push('Elaborate with specific technical decisions: detail the exact trade-offs you evaluated before choosing your solution.');
  } else if (wordCount > 240) {
    improvements.push('Sharpen conciseness: Aim for a 90–120 second spoken response to leave time for natural interviewer follow-ups.');
  }
  if (matchedKeywords.length < 2) {
    improvements.push(`Deepen domain terminology: reference relevant ${domain} principles, standards, or architectural patterns.`);
  }
  if (foundFillers.length > 0) {
    improvements.push(`Reduce filler words (${foundFillers.join(', ')}): pause deliberately instead of using placeholder sounds.`);
  }

  // Ensure at least 2 distinct improvements
  if (improvements.length < 2) {
    improvements.push('Highlight what you would do differently in hindsight to demonstrate self-awareness and continuous learning.');
  }

  // Communication Clarity
  const communicationClarity = wordCount < 40 
    ? 'Brief and direct, but needs additional supporting evidence and technical narrative.'
    : foundFillers.length > 0 
      ? `Good articulate baseline; minimizing conversational fillers like "${foundFillers[0]}" will project higher executive presence.`
      : 'Articulate, professional pacing with clear emphasis on decisive actions.';

  // Model answer tips
  let modelAnswerTips = '';
  if (domain === 'Software Engineering') {
    modelAnswerTips = 'Lead with the system requirements and trade-offs (e.g., consistency vs availability or write vs read throughput) before diving into your chosen data structure or caching layer.';
  } else if (domain === 'Core Engineering') {
    modelAnswerTips = 'Anchor your response in established safety standards (e.g., ISO, ASME) and explain how you validated test parameters through empirical prototypes or simulations.';
  } else {
    modelAnswerTips = 'Frame your leadership decisions through team impact and business outcomes: explain how you established alignment, created psychological safety, and tracked measurable progress.';
  }

  if (resumeText && resumeText.trim().length > 20) {
    modelAnswerTips += ' Pro-tip: Connect this answer directly to a specific milestone from your uploaded resume for greater credibility.';
  }

  return {
    score: finalScore,
    scorePercentage,
    ratingLabel,
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
    communicationClarity,
    modelAnswerTips,
    metrics: {
      technicalAccuracy,
      clarity: clarityScore,
      structureSTAR: structureScore,
      relevance,
    },
    agentSteps: [
      '✓ Answer analyzed for technical depth',
      '✓ Communication clarity & syntax checked',
      '✓ STAR structure & metrics evaluated',
      '✓ Feedback generated'
    ],
    isLlmPowered: false
  };
}

/**
 * Generates an end-of-session comprehensive summary
 */
export function generateSessionSummary(
  domain: string,
  answersHistory: Array<{ question: string; answer: string; feedback: EvaluationFeedback }>
): SessionSummaryResponse {
  if (answersHistory.length === 0) {
    return {
      overallScore: 70,
      overallRating: 'Session Incomplete',
      readinessLevel: 'Developing',
      topStrengths: ['Completed preliminary setup'],
      priorityAreasToImprove: ['Complete full interview loop'],
      metricsBreakdown: { technicalAccuracy: 7, communicationClarity: 7, starStructure: 7, strategicThinking: 7 },
      coachSummary: 'Begin a full session to receive comprehensive performance analytics.'
    };
  }

  const avgScore = Math.round(
    answersHistory.reduce((acc, curr) => acc + curr.feedback.score, 0) / answersHistory.length * 10
  ) / 10;
  const overallPercentage = Math.round(avgScore * 10);

  const avgTech = Math.round(answersHistory.reduce((a, c) => a + c.feedback.metrics.technicalAccuracy, 0) / answersHistory.length);
  const avgClarity = Math.round(answersHistory.reduce((a, c) => a + c.feedback.metrics.clarity, 0) / answersHistory.length);
  const avgSTAR = Math.round(answersHistory.reduce((a, c) => a + c.feedback.metrics.structureSTAR, 0) / answersHistory.length);
  const avgRelevance = Math.round(answersHistory.reduce((a, c) => a + c.feedback.metrics.relevance, 0) / answersHistory.length);

  let overallRating = 'Interview Ready (Strong Performer)';
  let readinessLevel: 'High' | 'Solid' | 'Developing' = 'High';

  if (overallPercentage >= 85) {
    overallRating = 'Interview Ready (Top 10% Candidate)';
    readinessLevel = 'High';
  } else if (overallPercentage >= 75) {
    overallRating = 'Competitive Candidate (Solid Foundation)';
    readinessLevel = 'Solid';
  } else {
    overallRating = 'Developing (Needs Structured Practice)';
    readinessLevel = 'Developing';
  }

  // Aggregate strengths & improvements
  const allStrengths = answersHistory.flatMap(h => h.feedback.strengths);
  const allImprovements = answersHistory.flatMap(h => h.feedback.improvements);

  const uniqueStrengths = Array.from(new Set(allStrengths)).slice(0, 4);
  const uniqueImprovements = Array.from(new Set(allImprovements)).slice(0, 3);

  const coachSummary = `Throughout this ${domain} interview simulation across ${answersHistory.length} questions, you demonstrated ${readinessLevel === 'High' ? 'an outstanding balance of technical precision and structured communication' : readinessLevel === 'Solid' ? 'a dependable problem-solving baseline with good domain articulation' : 'promising fundamentals that will elevate quickly with more intentional STAR quantification'}. Your responses scored an average of ${avgScore}/10 (${overallPercentage}%).`;

  return {
    overallScore: overallPercentage,
    overallRating,
    readinessLevel,
    topStrengths: uniqueStrengths,
    priorityAreasToImprove: uniqueImprovements,
    metricsBreakdown: {
      technicalAccuracy: avgTech,
      communicationClarity: avgClarity,
      starStructure: avgSTAR,
      strategicThinking: avgRelevance,
    },
    coachSummary,
  };
}
