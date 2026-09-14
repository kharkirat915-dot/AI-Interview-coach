import { InterviewQuestion } from '../src/types';

export const DOMAIN_QUESTIONS: Record<string, InterviewQuestion[]> = {
  'Software Engineering': [
    {
      id: 'swe-1',
      category: 'Technical',
      domain: 'Software Engineering',
      question: 'Can you explain how you would design a scalable URL shortener service (like bit.ly)? What database and caching strategies would you choose to handle high read traffic?',
      intent: 'Evaluates system architecture, database partitioning, caching (Redis/Memcached), and hashing collisions.',
      sampleKeyPoints: ['Base62 encoding or SHA-256 truncation', 'Cache-aside with Redis', 'NoSQL vs RDBMS for write scaling', 'Handling 100:1 read to write ratio']
    },
    {
      id: 'swe-2',
      category: 'HR / Behavioral',
      domain: 'Software Engineering',
      question: 'Tell me about a time you had a technical disagreement with a teammate or senior engineer about an architectural decision. How did you handle the situation and reach consensus?',
      intent: 'Tests collaboration, humility, data-driven reasoning, and professional maturity under pressure.',
      sampleKeyPoints: ['Disagreement context', 'Data/benchmarking or POC instead of ego', 'Active listening', 'Disagree and commit or shared resolution']
    },
    {
      id: 'swe-3',
      category: 'Technical',
      domain: 'Software Engineering',
      question: 'Describe how you troubleshoot a production incident where response latency has spiked significantly, but CPU and memory utilization appear normal.',
      intent: 'Investigates diagnostic methodology: database locks, thread contention, downstream API bottlenecks, I/O wait, GC pauses.',
      sampleKeyPoints: ['Metrics check (I/O wait, DB connection pool)', 'Distributed tracing (OpenTelemetry)', 'Thread dumps / DB slow query log', 'Mitigation before root cause fix']
    },
    {
      id: 'swe-4',
      category: 'HR / Behavioral',
      domain: 'Software Engineering',
      question: 'Tell me about a complex project where user requirements or technical constraints shifted dramatically midway through. How did you adapt your plan and ensure timely delivery?',
      intent: 'Evaluates adaptability, agile mindset, stakeholder communication, and iterative delivery.',
      sampleKeyPoints: ['Original scope vs changing reality', 'Reprioritization and scope slicing', 'Transparent stakeholder alignment', 'Outcome & retrospective learnings']
    },
    {
      id: 'swe-5',
      category: 'Technical',
      domain: 'Software Engineering',
      question: 'Compare SQL and NoSQL databases. In what real-world architecture would you strictly mandate PostgreSQL over MongoDB, and vice versa?',
      intent: 'Evaluates relational ACID guarantees, transactional consistency, relational joins vs document elasticity.',
      sampleKeyPoints: ['ACID transactions & relational schema integrity', 'Foreign keys and financial/ledger records', 'Horizontal sharding in document stores', 'Schema flexibility in rapid ingestion']
    }
  ],
  'Core Engineering': [
    {
      id: 'core-1',
      category: 'Technical',
      domain: 'Core Engineering',
      question: 'Walk me through how you approach Failure Mode and Effects Analysis (FMEA) when designing or modifying a critical physical or electrical component.',
      intent: 'Assesses engineering rigor, risk assessment, Severity-Occurrence-Detection calculation, and mitigation protocols.',
      sampleKeyPoints: ['Identifying failure modes', 'RPN (Risk Priority Number) ranking', 'Preventative safeguards vs detective controls', 'Design validation plan']
    },
    {
      id: 'core-2',
      category: 'HR / Behavioral',
      domain: 'Core Engineering',
      question: 'Describe a project where tight safety tolerances clashed directly with project delivery timelines or budget constraints. How did you navigate the trade-off?',
      intent: 'Evaluates engineering ethics, safety standards adherence, executive negotiation, and risk mitigation.',
      sampleKeyPoints: ['Non-negotiable safety standards (e.g., ISO/ASME)', 'Transparent risk presentation to stakeholders', 'Finding alternative validated approaches', 'Long-term reputation and reliability focus']
    },
    {
      id: 'core-3',
      category: 'Technical',
      domain: 'Core Engineering',
      question: 'How do you perform root cause analysis (e.g., 5-Whys, Ishikawa/Fishbone, or Pareto analysis) when a prototype fails quality testing or fatigue benchmarks?',
      intent: 'Tests analytical problem-solving, physical testing discipline, and structured defect containment.',
      sampleKeyPoints: ['Containment and data collection', 'Fishbone diagram (Man, Machine, Material, Method)', 'Validating root causes with physical or thermal test data', 'Engineering Change Notice (ECN) implementation']
    },
    {
      id: 'core-4',
      category: 'HR / Behavioral',
      domain: 'Core Engineering',
      question: 'Tell me about a time you collaborated with cross-functional teams (e.g., manufacturing floor, procurement, quality assurance) to resolve an engineering bottleneck.',
      intent: 'Evaluates interdisciplinary communication, empathy for production realities, and Design for Manufacturability (DFM).',
      sampleKeyPoints: ['Cross-functional problem context', 'Visiting shop floor / listening to operators', 'Design adjustments for ease of assembly', 'Measurable throughput or yield improvement']
    },
    {
      id: 'core-5',
      category: 'Technical',
      domain: 'Core Engineering',
      question: 'When designing a component subjected to cyclic thermal and mechanical stresses, what factors govern your material selection and safety factors?',
      intent: 'Evaluates knowledge of thermal expansion coefficients, S-N fatigue curves, yield strength vs ultimate tensile strength, and environmental degradation.',
      sampleKeyPoints: ['Thermal fatigue and expansion mismatch', 'Wöhler S-N curve & endurance limit', 'Stress concentration factors (Kt)', 'Corrosion or creep behavior']
    }
  ],
  'Management': [
    {
      id: 'mgmt-1',
      category: 'HR / Behavioral',
      domain: 'Management',
      question: 'How do you handle an underperforming direct report while maintaining team morale and upholding high delivery standards?',
      intent: 'Assesses empathetic leadership, clear expectation setting, coaching, Performance Improvement Plans (PIPs), and fair accountability.',
      sampleKeyPoints: ['Early 1-on-1 private inquiry (skill vs will)', 'Clear, objective milestones and feedback', 'Providing resources and mentorship', 'Decisive resolution if performance does not improve']
    },
    {
      id: 'mgmt-2',
      category: 'Architecture / Strategy',
      domain: 'Management',
      question: 'Walk me through how you prioritize competing product initiatives across multiple executive stakeholders when engineering capacity is severely constrained.',
      intent: 'Tests prioritization frameworks (RICE, Cost of Delay, OKRs), stakeholder diplomacy, and saying no with clear data.',
      sampleKeyPoints: ['Business impact vs effort matrix', 'Alignment with strategic annual company OKRs', 'Transparent capacity models', 'Managing stakeholder expectations with trade-offs']
    },
    {
      id: 'mgmt-3',
      category: 'HR / Behavioral',
      domain: 'Management',
      question: 'Tell me about a time you had to deliver difficult, critical feedback to a high performer whose individual output was great but whose behavior was damaging team culture.',
      intent: 'Evaluates culture guardianship, courage, direct constructive feedback, and zero-tolerance for brilliant jerks.',
      sampleKeyPoints: ['Concrete behavioral examples vs subjective feelings', 'Explaining impact on peers and team retention', 'Setting clear behavioral expectations', 'Monitoring cultural alignment']
    },
    {
      id: 'mgmt-4',
      category: 'Architecture / Strategy',
      domain: 'Management',
      question: 'How do you establish engineering KPIs or team health metrics that foster velocity and quality without incentivizing burnout or bad metrics-gaming?',
      intent: 'Tests leadership metrics literacy (DORA metrics, cycle time, customer happiness, psychological safety).',
      sampleKeyPoints: ['Outcome-driven vs vanity metrics (e.g., DORA metrics)', 'Balance velocity with quality (change failure rate)', 'Regular retro & eNPS / pulse surveys', 'Continuous improvement culture']
    },
    {
      id: 'mgmt-5',
      category: 'HR / Behavioral',
      domain: 'Management',
      question: 'Describe a critical situation where a high-visibility project missed an executive deadline. How did you communicate with leadership and lead the retrospective?',
      intent: 'Tests executive communication, accountability without scapegoating, blameless retrospectives, and recovery planning.',
      sampleKeyPoints: ['Proactive bad news delivery (no surprises)', 'Ownership of failure and actionable recovery plan', 'Blameless post-mortem', 'Systemic process fixes to prevent recurrence']
    }
  ]
};
