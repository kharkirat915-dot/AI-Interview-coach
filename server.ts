import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { DOMAIN_QUESTIONS } from './server/questions';
import { evaluateAnswer, generateSessionSummary } from './server/evaluator';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON requests
  app.use(express.json({ limit: '10mb' }));

  // --- API Routes ---

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'AI Interview Prep Coach API',
      groqConfigured: Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim().length > 0),
    });
  });

  // Get curated questions by domain
  app.get('/api/questions', (req, res) => {
    const domain = (req.query.domain as string) || 'Software Engineering';
    const count = parseInt((req.query.count as string) || '4', 10);
    const domainQuestions = DOMAIN_QUESTIONS[domain] || DOMAIN_QUESTIONS['Software Engineering'];

    // Select the requested number of questions (default 4)
    const selected = domainQuestions.slice(0, Math.max(3, Math.min(count, domainQuestions.length)));
    res.json({
      domain,
      totalAvailable: domainQuestions.length,
      questions: selected,
    });
  });

  // Main evaluation endpoint requested by user: /api/evaluate
  app.post('/api/evaluate', async (req, res) => {
    try {
      const { question, answer, domain, resumeText } = req.body;

      if (!question || !answer || !domain) {
        return res.status(400).json({
          error: 'Missing required parameters: question, answer, and domain are required.',
        });
      }

      console.log(`[API /api/evaluate] Processing answer for domain: ${domain} (${answer.length} chars)`);

      // Call modular evaluator (supports Groq API or heuristic fallback)
      const evaluation = await evaluateAnswer(question, answer, domain, resumeText);

      return res.json(evaluation);
    } catch (error: any) {
      console.error('[API /api/evaluate] Error evaluating answer:', error);
      return res.status(500).json({
        error: 'Evaluation processing encountered an internal error.',
        message: error.message,
      });
    }
  });

  // Final summary endpoint
  app.post('/api/summary', (req, res) => {
    try {
      const { domain, answersHistory } = req.body;
      if (!domain || !Array.isArray(answersHistory)) {
        return res.status(400).json({
          error: 'Missing domain or answersHistory array.',
        });
      }

      const summary = generateSessionSummary(domain, answersHistory);
      return res.json(summary);
    } catch (error: any) {
      console.error('[API /api/summary] Error generating summary:', error);
      return res.status(500).json({
        error: 'Failed to generate session summary.',
        message: error.message,
      });
    }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Interview Prep Coach server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
