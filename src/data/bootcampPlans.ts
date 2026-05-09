import type { BootcampPlan } from '../types'

const plan14Days: BootcampPlan = {
  duration: 14,
  name: '14-Day TOEIC 940 Sprint',
  days: [
    {
      day: 1, theme: 'Part 5 Foundation — Word Forms',
      mission: 'Master the #1 question type on TOEIC Part 5: word forms. Learn to instantly identify whether a blank needs a noun, verb, adjective, or adverb.',
      goal: 'Achieve 80%+ accuracy on word form questions',
      timeEstimate: 75,
      tasks: [
        { id: 'd1t1', label: 'Study word form recognition rules', detail: 'Review the 4 key positions: noun (after article/possessive), verb (after subject), adjective (before noun or after be-verb), adverb (modifies verb/adjective). Memorize 10 common suffixes.', module: 'strategy', minutes: 20, priority: 'critical' },
        { id: 'd1t2', label: 'Drill 20 word form questions', detail: 'Use Grammar Drill → Word Form category → 20 questions. Aim for under 35s per question.', module: 'grammar', minutes: 25, priority: 'critical' },
        { id: 'd1t3', label: 'Learn 20 Finance vocabulary words', detail: 'Go through revenue, expenditure, fiscal, dividend, liability, asset, depreciation, equity, portfolio, audit, subsidy, margin, surplus, deficit, forecast + 5 more.', module: 'vocabulary', minutes: 20, priority: 'high' },
        { id: 'd1t4', label: 'Review all errors from today', detail: 'Open Error Notebook. For each mistake, read the explanation twice and say the correct answer aloud.', module: 'errors', minutes: 10, priority: 'medium' },
      ],
    },
    {
      day: 2, theme: 'Part 5 Prepositions & Collocations',
      mission: 'Crack the top 15 preposition collocations that appear every TOEIC exam. These are pure memorization — zero exceptions.',
      goal: 'Memorize the top 15 preposition traps',
      timeEstimate: 75,
      tasks: [
        { id: 'd2t1', label: 'Review preposition collocation patterns', detail: 'Focus on: responsible FOR, comply WITH, result FROM/IN, refer TO, in accordance WITH, in charge OF, specialize IN, aware OF. Write each one 3 times.', module: 'strategy', minutes: 15, priority: 'critical' },
        { id: 'd2t2', label: 'Drill 20 preposition questions', detail: 'Grammar Drill → Prepositions → 20 questions timed (45s each). Watch for the result FROM vs result IN trap.', module: 'grammar', minutes: 25, priority: 'critical' },
        { id: 'd2t3', label: 'Learn 20 HR vocabulary words', detail: 'Study: recruitment, resignation, probationary, remuneration, incentive, grievance, redundancy, appraisal, mandate, turnover, entitlement, maternity, severance, promotion, tenure + 5 more.', module: 'vocabulary', minutes: 20, priority: 'high' },
        { id: 'd2t4', label: 'Trap Lab: preposition traps', detail: 'Go to Trap Lab → filter Prepositions. Study all preposition traps, especially comply WITH and responsible FOR.', module: 'traps', minutes: 15, priority: 'high' },
      ],
    },
    {
      day: 3, theme: 'Part 5 Conjunctions & Connectors',
      mission: 'Conjunctions are logic questions. Once you understand the ALTHOUGH vs DESPITE rule (clause vs phrase), you will never miss them again.',
      goal: 'Score 90%+ on conjunction questions',
      timeEstimate: 75,
      tasks: [
        { id: 'd3t1', label: 'Conjunction logic framework', detail: 'The golden rule: ALTHOUGH/EVEN THOUGH + full clause (S+V). DESPITE/IN SPITE OF + noun phrase. HOWEVER/NEVERTHELESS = connector between sentences. Draw a decision tree.', module: 'strategy', minutes: 15, priority: 'critical' },
        { id: 'd3t2', label: 'Drill 20 conjunction questions', detail: 'Grammar Drill → Conjunctions → 20 questions. Focus on contrast vs. cause vs. condition distinctions.', module: 'grammar', minutes: 25, priority: 'critical' },
        { id: 'd3t3', label: 'Learn 20 Marketing vocabulary words', detail: 'Study: demographics, endorsement, campaign, leverage, benchmark, niche, penetration, branding, incentivize, launch + 10 more customer-service words.', module: 'vocabulary', minutes: 20, priority: 'high' },
        { id: 'd3t4', label: 'Review all errors (cumulative)', detail: 'Check Error Notebook. Mark any error you now understand as reviewed. Count remaining unresolved errors.', module: 'errors', minutes: 15, priority: 'high' },
      ],
    },
    {
      day: 4, theme: 'Part 5 Verb Tenses & Passive Voice',
      mission: 'Verb tense questions are answered by finding TIME MARKERS. Train your eye to spot them in under 5 seconds.',
      goal: 'Identify tense from time markers automatically',
      timeEstimate: 80,
      tasks: [
        { id: 'd4t1', label: 'Tense recognition from time markers', detail: 'Map: yesterday/last = past, tomorrow/next = future, since/for = present perfect, by the time = future perfect/past perfect. Also: subjunctive after require/recommend that = base verb.', module: 'strategy', minutes: 20, priority: 'critical' },
        { id: 'd4t2', label: 'Drill 20 verb tense questions', detail: 'Grammar Drill → Verb Tense → 20 questions timed. For every question, circle the time marker first.', module: 'grammar', minutes: 25, priority: 'critical' },
        { id: 'd4t3', label: 'Learn 20 Operations vocabulary words', detail: 'Study: procurement, logistics, inventory, outsource, streamline, turnaround, backlog, dispatch, throughput, lead time + 10 more operations terms.', module: 'vocabulary', minutes: 20, priority: 'high' },
        { id: 'd4t4', label: 'Error review — tense mistakes', detail: 'Filter Error Notebook by grammar. Focus on any verb tense errors. Write the time marker rule for each.', module: 'errors', minutes: 15, priority: 'medium' },
      ],
    },
    {
      day: 5, theme: 'Part 5 Pronouns & Articles',
      mission: 'Pronouns and articles seem easy — but TOEIC uses them to trap careless test-takers. Focus on agreement rules.',
      goal: 'Zero pronoun/article errors by end of day',
      timeEstimate: 70,
      tasks: [
        { id: 'd5t1', label: 'Pronoun and article rules', detail: 'Pronoun rules: each/every/anyone = singular he or she (not they in formal TOEIC). Neither...nor = agree with nearer noun. Committee = its (collective singular). Articles: a/an first mention, the second mention. Superlative always takes THE.', module: 'strategy', minutes: 15, priority: 'critical' },
        { id: 'd5t2', label: 'Drill 20 pronoun/article questions', detail: 'Grammar Drill → Pronouns then Articles → 20 questions combined. Circle the antecedent for every pronoun question.', module: 'grammar', minutes: 20, priority: 'critical' },
        { id: 'd5t3', label: 'Learn 20 Legal vocabulary words', detail: 'Study: compliance, litigation, arbitration, indemnify, clause, breach, provisional, execute, proprietary, waiver + 10 more legal terms.', module: 'vocabulary', minutes: 20, priority: 'high' },
        { id: 'd5t4', label: 'Mixed 10-question rapid drill', detail: 'Grammar Drill → All categories → 10 questions, Timed mode. Treat as a mini-test.', module: 'grammar', minutes: 15, priority: 'medium' },
      ],
    },
    {
      day: 6, theme: 'Part 5 Vocabulary Questions',
      mission: 'Vocabulary questions reward preparation. The key is knowing TOEIC-specific meanings that differ from everyday English.',
      goal: 'Build TOEIC business vocabulary to 60+ active words',
      timeEstimate: 75,
      tasks: [
        { id: 'd6t1', label: 'Business vocabulary patterns', detail: 'Focus on: postpone vs cancel, consolidate vs acquire, scrutinize vs summarize, exceed vs access. Also: TOEIC false friends like "control" = manage in business English.', module: 'strategy', minutes: 15, priority: 'critical' },
        { id: 'd6t2', label: 'Drill 20 vocabulary questions', detail: 'Grammar Drill → Vocabulary → 20 questions. Read all 4 options carefully before answering.', module: 'grammar', minutes: 25, priority: 'critical' },
        { id: 'd6t3', label: 'Learn Travel & Office vocabulary', detail: 'Study: itinerary, reimbursement, voucher, layover, conference, adjourn, agenda, minutes, quorum, proxy + 10 customer service words.', module: 'vocabulary', minutes: 20, priority: 'high' },
        { id: 'd6t4', label: 'Trap Lab — vocabulary traps', detail: 'Review all Word Form and Vocabulary traps in Trap Lab. Add any new traps you discover to your mental list.', module: 'traps', minutes: 15, priority: 'high' },
      ],
    },
    {
      day: 7, theme: 'First Full Mock + Deep Analysis',
      mission: 'Test everything you have learned. The mock score is your BASELINE. Do not be discouraged — every error is data.',
      goal: 'Complete full mock and analyze every single error',
      timeEstimate: 85,
      tasks: [
        { id: 'd7t1', label: 'Full Part 5 mock — 40 questions timed', detail: 'Go to Mock Exam → Part 5 Full (40 questions, 30 minutes). Simulate real exam conditions. No notes, no breaks.', module: 'mock', minutes: 35, priority: 'critical' },
        { id: 'd7t2', label: 'Analyze every error carefully', detail: 'For each wrong answer: identify the trap, write the rule, categorize it. Open Error Notebook and read all errors.', module: 'errors', minutes: 20, priority: 'critical' },
        { id: 'd7t3', label: 'Vocabulary review — unknowns only', detail: 'Go to Vocabulary Accelerator → filter Unknown words only. Review each one. Re-rate any you now know.', module: 'vocabulary', minutes: 20, priority: 'high' },
        { id: 'd7t4', label: 'Plan Week 2 strategy', detail: 'Based on your mock results, identify your 2 weakest categories. Check Analytics → Category Accuracy. Plan to double down on those in Week 2.', module: 'strategy', minutes: 10, priority: 'medium' },
      ],
    },
    {
      day: 8, theme: 'Part 7 Foundation — Emails & Memos',
      mission: 'Part 7 is the highest ROI section for score increases. Start with the easiest text types: emails and memos.',
      goal: 'Read 2 passages under 3 minutes each, 100% accuracy',
      timeEstimate: 80,
      tasks: [
        { id: 'd8t1', label: 'Reading strategy overview', detail: 'The TOEIC Reading Method: (1) Read the question first, not the passage. (2) Find the specific detail — do not read everything. (3) Beware paraphrase traps: the correct answer never uses the exact same words as the passage.', module: 'strategy', minutes: 20, priority: 'critical' },
        { id: 'd8t2', label: 'Read 2 passages with full timing', detail: 'Reading Center → choose Memo and Email passages. Time yourself. Answer all questions. Review explanations carefully.', module: 'reading', minutes: 30, priority: 'critical' },
        { id: 'd8t3', label: 'Trap Lab — reading traps', detail: 'Study all Reading traps in Trap Lab: date confusion, NOT-TRUE, paraphrase, inference overreach.', module: 'traps', minutes: 15, priority: 'high' },
        { id: 'd8t4', label: 'Error review', detail: 'Review all new reading errors in Error Notebook. For each, re-read the passage section that contained the answer.', module: 'errors', minutes: 15, priority: 'medium' },
      ],
    },
    {
      day: 9, theme: 'Part 7 — Advertisements & Notices',
      mission: 'Advertisements and notices have a different structure than emails. They use lists, bullet points, and embedded dates — prime trap territory.',
      goal: 'Master skim-scan technique on structured documents',
      timeEstimate: 85,
      tasks: [
        { id: 'd9t1', label: 'Skim and scan technique drill', detail: 'Skimming = read first sentence of each paragraph (15 sec). Scanning = look for numbers, dates, names, capitalized words for specific questions. Practice this sequence explicitly.', module: 'strategy', minutes: 15, priority: 'critical' },
        { id: 'd9t2', label: 'Read 2 more passages — Ad and Notice', detail: 'Reading Center → Advertisement and Notice passages. Apply skim-scan method.', module: 'reading', minutes: 30, priority: 'critical' },
        { id: 'd9t3', label: 'Customer Service vocabulary', detail: 'Vocabulary Accelerator → Customer Service category. Review all 10 words. Use quiz mode.', module: 'vocabulary', minutes: 20, priority: 'high' },
        { id: 'd9t4', label: 'Grammar drill — weak categories', detail: 'Check Analytics → Category Accuracy. Drill your weakest category (20 questions).', module: 'grammar', minutes: 20, priority: 'high' },
      ],
    },
    {
      day: 10, theme: 'Part 7 — Articles & Complex Texts',
      mission: 'Articles are the hardest Part 7 texts. They require inference skills, not just finding explicit answers.',
      goal: 'Complete all 5 passages, 80%+ accuracy',
      timeEstimate: 100,
      tasks: [
        { id: 'd10t1', label: 'Complex text strategy', detail: 'For articles: (1) Read title + first/last paragraphs. (2) Questions about "the author implies" = inference. (3) Vocabulary-in-context = replace word with each option; choose best fit.', module: 'strategy', minutes: 20, priority: 'critical' },
        { id: 'd10t2', label: 'Complete all 5 passages timed', detail: 'Reading Center → do all 5 passages in one session (target: 18 min total). This simulates real exam pressure.', module: 'reading', minutes: 45, priority: 'critical' },
        { id: 'd10t3', label: 'Deep error analysis', detail: 'Error Notebook → filter by Part 7. For every reading error, identify: detail trap / paraphrase trap / inference trap / date confusion.', module: 'errors', minutes: 20, priority: 'critical' },
        { id: 'd10t4', label: 'Vocabulary sprint', detail: 'Vocabulary Accelerator → All categories → flip 20 cards. Rate every card honestly.', module: 'vocabulary', minutes: 15, priority: 'medium' },
      ],
    },
    {
      day: 11, theme: 'Mixed Grammar Blitz',
      mission: 'Day 11 is about SPEED. You know the rules — now train your brain to apply them in under 30 seconds each.',
      goal: 'Answer 40 mixed questions with avg time under 35s',
      timeEstimate: 90,
      tasks: [
        { id: 'd11t1', label: 'Adaptive grammar drill — 40 questions', detail: 'Grammar Drill → Adaptive mode → 40 questions. The system will prioritize your weak categories. Push for speed.', module: 'grammar', minutes: 35, priority: 'critical' },
        { id: 'd11t2', label: 'Error Notebook review', detail: 'Read through all unresolved errors. Try to resolve at least 5 by reciting the correct rule without looking.', module: 'errors', minutes: 20, priority: 'critical' },
        { id: 'd11t3', label: 'Trap Lab — all categories', detail: 'Go through Trap Lab systematically. By now, you should be able to predict the trap before clicking "reveal".', module: 'traps', minutes: 20, priority: 'high' },
        { id: 'd11t4', label: 'Vocabulary review sprint', detail: 'Vocabulary Accelerator → Learning and Unknown cards only. Aim to move 10 cards from "Learning" to "Known".', module: 'vocabulary', minutes: 15, priority: 'medium' },
      ],
    },
    {
      day: 12, theme: 'Part 6 Strategy & Simulation',
      mission: 'Part 6 combines grammar AND reading comprehension. It tests whether you can understand context, not just isolated grammar.',
      goal: 'Understand Part 6 context-dependent grammar',
      timeEstimate: 80,
      tasks: [
        { id: 'd12t1', label: 'Part 6 strategy overview', detail: 'Part 6 has 4 texts × 4 blanks = 16 questions. KEY RULE: always read the FULL sentence before and after the blank. Context changes the answer. Watch for discourse connectors (however, therefore, in addition).', module: 'strategy', minutes: 20, priority: 'critical' },
        { id: 'd12t2', label: 'Part 6 grammar simulation', detail: 'Grammar Drill → Adaptive mode → 25 questions. Imagine each one is in context of a longer text.', module: 'grammar', minutes: 25, priority: 'critical' },
        { id: 'd12t3', label: 'Mixed vocabulary quiz', detail: 'Vocabulary Accelerator → All categories → Quiz Mode → 20 questions. No card flipping — choose the definition.', module: 'vocabulary', minutes: 20, priority: 'high' },
        { id: 'd12t4', label: 'Error review', detail: 'Final pass through Error Notebook. Try to resolve all errors with <medium> danger level.', module: 'errors', minutes: 15, priority: 'medium' },
      ],
    },
    {
      day: 13, theme: 'Second Full Mock Exam',
      mission: 'This is your benchmark. Compare your score to Day 7 mock. You should see clear improvement. Every point gained is proof the system works.',
      goal: 'Beat your Day 7 mock score by at least 5%',
      timeEstimate: 100,
      tasks: [
        { id: 'd13t1', label: 'Full mock exam — all question types', detail: 'Mock Exam → Reading Sprint (100 questions, 45 minutes). Simulate real exam conditions: no phone, no breaks, water only.', module: 'mock', minutes: 40, priority: 'critical' },
        { id: 'd13t2', label: 'Detailed mock analysis', detail: 'For every wrong answer, categorize it: (1) knowledge gap, (2) trap, (3) careless error, (4) time pressure. Each type has a different fix.', module: 'errors', minutes: 25, priority: 'critical' },
        { id: 'd13t3', label: 'Final unknown vocabulary', detail: 'Vocabulary Accelerator → Unknown cards only. These are the ones that keep escaping you.', module: 'vocabulary', minutes: 20, priority: 'high' },
        { id: 'd13t4', label: 'Rest and light review only', detail: 'Do NOT study new material. Read through your personal error patterns. Get 8+ hours of sleep.', module: 'strategy', minutes: 15, priority: 'medium' },
      ],
    },
    {
      day: 14, theme: 'Final Review — Exam Eve',
      mission: 'Today is maintenance only. No new material. Your brain needs consolidation time. Review your strongest knowledge, sleep well.',
      goal: 'Arrive at exam rested, confident, and prepared',
      timeEstimate: 55,
      tasks: [
        { id: 'd14t1', label: 'Light vocabulary review — known cards only', detail: 'Vocabulary Accelerator → Known cards only. Flip through 20 words you already know. Confidence building only.', module: 'vocabulary', minutes: 20, priority: 'high' },
        { id: 'd14t2', label: 'Review top 10 personal error patterns', detail: 'Error Notebook → sort by frequency. Read the top 10 most repeated errors. Say the correction aloud once each.', module: 'errors', minutes: 20, priority: 'critical' },
        { id: 'd14t3', label: 'Read exam day strategy card', detail: 'Strategy → Exam Day Protocol. Read the time budget table. Visualize yourself moving through the exam confidently.', module: 'strategy', minutes: 15, priority: 'high' },
        { id: 'd14t4', label: 'REST — No new material', detail: 'Eat well. Sleep by 10 PM. Your preparation is done. Trust the work you have put in.', module: 'strategy', minutes: 0, priority: 'medium' },
      ],
    },
  ],
}

const plan7Days: BootcampPlan = {
  duration: 7,
  name: '7-Day TOEIC Accelerator',
  days: [
    {
      day: 1, theme: 'Grammar Foundation — Parts of Speech',
      mission: 'In one session, cover word forms AND prepositions. Move fast. Focus on patterns, not perfection.',
      goal: 'Learn all 4 word positions and top 10 prepositions',
      timeEstimate: 90,
      tasks: [
        { id: '7d1t1', label: 'Word form rules + drill 20 questions', detail: 'Strategy guide then Grammar Drill → Word Form → 20 questions timed.', module: 'grammar', minutes: 40, priority: 'critical' },
        { id: '7d1t2', label: 'Preposition patterns + drill 15 questions', detail: 'Review top 10 preposition collocations. Grammar Drill → Prepositions → 15 questions.', module: 'grammar', minutes: 30, priority: 'critical' },
        { id: '7d1t3', label: 'Finance vocabulary — 20 words', detail: 'Vocabulary Accelerator → Finance → 20 cards.', module: 'vocabulary', minutes: 20, priority: 'high' },
      ],
    },
    {
      day: 2, theme: 'Grammar — Conjunctions, Tenses & Traps',
      mission: 'Cover the remaining grammar categories. By end of day, you will have touched all Part 5 question types.',
      goal: 'Know all major grammar patterns for Part 5',
      timeEstimate: 90,
      tasks: [
        { id: '7d2t1', label: 'Conjunctions + verb tenses drill — 30 questions', detail: 'Grammar Drill → Conjunctions (15 questions) then Verb Tense (15 questions).', module: 'grammar', minutes: 40, priority: 'critical' },
        { id: '7d2t2', label: 'Trap Lab — 10 key traps', detail: 'Trap Lab → study top 10 traps across all categories.', module: 'traps', minutes: 20, priority: 'high' },
        { id: '7d2t3', label: 'HR + Marketing vocabulary', detail: 'Vocabulary Accelerator → HR and Marketing → 20 cards each.', module: 'vocabulary', minutes: 30, priority: 'high' },
      ],
    },
    {
      day: 3, theme: 'First Mock + Error Analysis',
      mission: 'Test yourself immediately. Early mocks reveal what you actually know vs. what you think you know.',
      goal: 'Complete mock, identify top 3 weak areas',
      timeEstimate: 85,
      tasks: [
        { id: '7d3t1', label: 'Mini Mock — 20 questions', detail: 'Mock Exam → Mini Mock (20 questions, 15 minutes). Full exam conditions.', module: 'mock', minutes: 20, priority: 'critical' },
        { id: '7d3t2', label: 'Deep error analysis', detail: 'Error Notebook → analyze every mistake. Categorize by type.', module: 'errors', minutes: 25, priority: 'critical' },
        { id: '7d3t3', label: 'Adaptive grammar drill — weak categories', detail: 'Grammar Drill → Adaptive mode → 20 questions (targets your weak spots).', module: 'grammar', minutes: 25, priority: 'critical' },
        { id: '7d3t4', label: 'Operations + Legal vocabulary', detail: 'Vocabulary Accelerator → 20 cards.', module: 'vocabulary', minutes: 15, priority: 'medium' },
      ],
    },
    {
      day: 4, theme: 'Part 7 Reading Foundations',
      mission: 'Attack Reading Part 7. You have 3 days to build the skill. Start with question-first technique.',
      goal: 'Complete 3 passages with 75%+ accuracy',
      timeEstimate: 85,
      tasks: [
        { id: '7d4t1', label: 'Reading strategy — question-first technique', detail: 'Strategy → Part 7 Tactics. Read the strategy guide fully.', module: 'strategy', minutes: 20, priority: 'critical' },
        { id: '7d4t2', label: 'Read 3 passages timed', detail: 'Reading Center → Memo, Email, Advertisement. 75 seconds per question max.', module: 'reading', minutes: 40, priority: 'critical' },
        { id: '7d4t3', label: 'Reading traps review', detail: 'Trap Lab → Reading category. Study all 4 reading traps.', module: 'traps', minutes: 15, priority: 'high' },
        { id: '7d4t4', label: 'Error review', detail: 'Error Notebook → review all new reading errors.', module: 'errors', minutes: 10, priority: 'medium' },
      ],
    },
    {
      day: 5, theme: 'Reading Deep + Vocabulary Blitz',
      mission: 'Finish all 5 passages. Then do a vocabulary blitz to maximize points from the 10 vocabulary questions in Part 5.',
      goal: 'All 5 passages done. 60+ vocabulary words known.',
      timeEstimate: 90,
      tasks: [
        { id: '7d5t1', label: 'Complete all 5 passages', detail: 'Reading Center → do all 5 passages in one session.', module: 'reading', minutes: 40, priority: 'critical' },
        { id: '7d5t2', label: 'Vocabulary sprint — all categories', detail: 'Vocabulary Accelerator → All → 40 cards. Rate aggressively. Move fast.', module: 'vocabulary', minutes: 30, priority: 'high' },
        { id: '7d5t3', label: 'Grammar drill — adaptive 20 questions', detail: 'Grammar Drill → Adaptive → 20 questions.', module: 'grammar', minutes: 20, priority: 'high' },
      ],
    },
    {
      day: 6, theme: 'Full Mock + Targeted Repair',
      mission: 'Second full mock. Then spend remaining time laser-focused on your most dangerous errors.',
      goal: 'Beat Day 3 mock score. Resolve 50%+ of error notebook.',
      timeEstimate: 90,
      tasks: [
        { id: '7d6t1', label: 'Part 5 Full mock — 40 questions', detail: 'Mock Exam → Part 5 Full (40 questions, 30 min).', module: 'mock', minutes: 35, priority: 'critical' },
        { id: '7d6t2', label: 'Error Notebook — targeted repair', detail: 'Focus on high and critical danger errors only. Read rule 3x, write answer.', module: 'errors', minutes: 25, priority: 'critical' },
        { id: '7d6t3', label: 'Trap Lab — final review', detail: 'Skim all 20 traps. Can you predict each trap answer before reading?', module: 'traps', minutes: 15, priority: 'high' },
        { id: '7d6t4', label: 'Vocabulary — unknowns only', detail: 'Vocabulary Accelerator → Unknown words filter.', module: 'vocabulary', minutes: 15, priority: 'medium' },
      ],
    },
    {
      day: 7, theme: 'Exam Eve — Final Review',
      mission: 'Maintenance only. No new material. Review. Rest. Trust your preparation.',
      goal: 'Arrive at exam confident and rested',
      timeEstimate: 50,
      tasks: [
        { id: '7d7t1', label: 'Top 10 error patterns review', detail: 'Error Notebook → sort by frequency → read top 10.', module: 'errors', minutes: 20, priority: 'critical' },
        { id: '7d7t2', label: 'Exam day strategy card', detail: 'Strategy → Exam Day Protocol. Read time budget. Visualize success.', module: 'strategy', minutes: 15, priority: 'high' },
        { id: '7d7t3', label: 'Light vocabulary review', detail: 'Vocabulary → Known cards only → 15 cards. Confidence only.', module: 'vocabulary', minutes: 15, priority: 'medium' },
      ],
    },
  ],
}

const plan10Days: BootcampPlan = {
  duration: 10,
  name: '10-Day TOEIC Intensive',
  days: plan14Days.days.slice(0, 10).map((day, i) => ({
    ...day,
    day: i + 1,
    tasks: day.tasks.map(t => ({ ...t, id: t.id.replace('d', '10d') })),
  })),
}

export const bootcampPlans: BootcampPlan[] = [plan7Days, plan10Days, plan14Days]
