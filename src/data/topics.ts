import type { Topic } from '../types'

// ══════════════════════════════════════════════════════════════════════════════
// TOEIC MICRO-TOPICS
// 25 precision learning units covering every high-value exam area.
// frequencyRank: 1 = highest exam frequency, lower = less frequent
// ══════════════════════════════════════════════════════════════════════════════

export const TOPICS: Topic[] = [

  // ── GRAMMAR — Part 5 ──────────────────────────────────────────────────────

  {
    id: 'word_form',
    title: 'Word Form',
    subtitle: 'Noun / adjective / adverb / verb — same root, different endings',
    category: 'grammar',
    subcategory: 'morphology',
    description:
      'Word form questions give you four options built from the same root word — e.g. decide / decisive / decision / decisively — and test whether you can identify the correct grammatical role in the sentence.',
    whyItMatters:
      'Word form is the single most frequent question type in Part 5. On every exam, 5–7 questions test this directly. It is the highest-ROI topic you can study.',
    difficulty: 'intermediate',
    toeicROI: 'critical',
    toeicParts: ['part5'],
    drillCategory: 'word_form',
    linkedLessonIds: ['word_form'],
    traps: [
      'Picking a noun when the blank needs an adjective (e.g. "a decision decision")',
      'Confusing adverb and adjective placements — adverbs modify verbs, adjectives modify nouns',
      'Missing that the blank comes before a noun and requires an adjective, not a verb',
      '-al vs -ally trap: "economic" (adj) vs "economically" (adv)',
    ],
    examples: [
      { correct: 'The manager made a decisive choice.', incorrect: 'The manager made a decisively choice.', note: 'Adjective needed before a noun' },
      { correct: 'She speaks English fluently.', incorrect: 'She speaks English fluent.', note: 'Adverb needed to modify a verb' },
      { correct: 'Submit your application by Friday.', incorrect: 'Submit your apply by Friday.', note: '"Apply" is a verb — cannot be the object of "submit"' },
    ],
    memoryTip: 'Read left AND right: what is before the blank? What is after? A blank after "a/the" usually needs a noun or adjective. A blank after a verb usually needs an adverb.',
    tags: ['part5', 'grammar', 'high-frequency', 'critical', 'morphology'],
    icon: '📝',
    frequencyRank: 1,
  },

  {
    id: 'conjunction',
    title: 'Conjunctions & Connectors',
    subtitle: 'Although / despite / however / therefore / because',
    category: 'grammar',
    subcategory: 'connectors',
    description:
      'Connectors show the logical relationship between two ideas. TOEIC tests coordinating conjunctions (but, so), subordinating conjunctions (although, because, while), transitions (however, therefore), and prepositions used as connectors (despite, in spite of).',
    whyItMatters:
      'Connector questions appear in every Part 5 section and are also critical for Part 6 coherence. Mastering the logic of "contrast vs cause vs addition" eliminates the most common Part 5 errors.',
    difficulty: 'intermediate',
    toeicROI: 'critical',
    toeicParts: ['part5', 'part6'],
    drillCategory: 'conjunction',
    linkedLessonIds: ['conjunction', 'trap_despite'],
    traps: [
      '"Despite" is a preposition — it must be followed by a noun or noun phrase, never a full clause',
      '"Although" is a conjunction — it introduces a full clause (Subject + Verb)',
      '"However" is a transition — it connects two independent sentences, not clauses',
      '"Because of" (prep) vs "because" (conj) — different structures required after each',
    ],
    examples: [
      { correct: 'Despite the rain, we continued.', incorrect: 'Despite it rained, we continued.', note: '"Despite" + noun phrase only' },
      { correct: 'Although it rained, we continued.', incorrect: 'Although the rain, we continued.', note: '"Although" + full clause (S+V)' },
      { correct: 'The plan failed. However, we adapted.', incorrect: 'The plan failed, however we adapted.', note: '"However" separates two sentences; use a period or semicolon' },
    ],
    memoryTip: 'Ask: is the blank followed by a noun phrase or a full clause? Noun phrase → despite/in spite of/because of. Full clause → although/because/while.',
    tags: ['part5', 'part6', 'grammar', 'critical', 'connectors', 'trap'],
    icon: '🔗',
    frequencyRank: 2,
  },

  {
    id: 'preposition',
    title: 'Prepositions',
    subtitle: 'in / on / at / by / for / with / of — the right one for the right context',
    category: 'grammar',
    subcategory: 'prepositions',
    description:
      'Preposition questions test your ability to select the correct preposition in phrases like "in charge of," "responsible for," "interested in," "by Friday," and "on behalf of." Many are collocational — you must know the phrase, not derive it from rules.',
    whyItMatters:
      'Prepositions appear in 4–6 Part 5 questions per exam. They also appear in Part 6 and Part 7 comprehension, where misreading a preposition changes the meaning entirely.',
    difficulty: 'intermediate',
    toeicROI: 'high',
    toeicParts: ['part5', 'part6', 'part7'],
    drillCategory: 'preposition',
    linkedLessonIds: ['preposition'],
    traps: [
      '"In time" (before a deadline) vs "on time" (punctually) — completely different meanings',
      '"By Friday" (deadline) vs "until Friday" (duration) — confusing these is a common error',
      '"Interested in" not "interested about" — collocations must be memorized',
      '"Responsible for" not "responsible of" — most English learners default to "of"',
    ],
    examples: [
      { correct: 'The report is due by Friday.', incorrect: 'The report is due until Friday.', note: '"By" = deadline; "until" = duration' },
      { correct: 'She is in charge of the project.', incorrect: 'She is in charge for the project.', note: 'Fixed collocation: in charge of' },
      { correct: 'We arrived on time.', incorrect: 'We arrived in time.', note: '"On time" = punctual; "in time" = early enough' },
    ],
    memoryTip: 'Memorize preposition collocations as fixed phrases, not individual words: "in charge of," "responsible for," "interested in," "apply for," "agree with."',
    tags: ['part5', 'grammar', 'high-frequency', 'collocation', 'preposition'],
    icon: '↗️',
    frequencyRank: 3,
  },

  {
    id: 'verb_tense',
    title: 'Verb Tense Selection',
    subtitle: 'Past perfect / present perfect / future / future perfect',
    category: 'grammar',
    subcategory: 'tense',
    description:
      'Tense questions require you to select the correct verb form based on time clues in the sentence: "by the time," "since," "already," "next week," "before the meeting ends." Identifying the time clue is the key skill.',
    whyItMatters:
      'Tense errors are among the hardest to detect intuitively. TOEIC specifically exploits the confusion between simple past and present perfect, and between future and future perfect.',
    difficulty: 'intermediate',
    toeicROI: 'high',
    toeicParts: ['part5', 'part6'],
    drillCategory: 'verb',
    linkedLessonIds: ['verb'],
    traps: [
      '"Since" and "for" both accompany present perfect — "since" + point in time, "for" + duration',
      '"By the time + past → past perfect" — many learners use simple past instead',
      '"Already" suggests present perfect or past perfect, not simple past in TOEIC contexts',
      'Future perfect "will have + past participle" is often missed in favour of simple future',
    ],
    examples: [
      { correct: 'She has worked here since 2019.', incorrect: 'She worked here since 2019.', note: '"Since" triggers present perfect' },
      { correct: 'By the time he arrived, the meeting had ended.', incorrect: 'By the time he arrived, the meeting ended.', note: '"By the time" + past → past perfect' },
      { correct: 'The project will have been completed by March.', incorrect: 'The project will be completed by March.', note: '"By [future date]" + completed action → future perfect' },
    ],
    memoryTip: 'Scan for the time clue FIRST: since/for → present perfect; by the time → past/future perfect; next/tomorrow → future.',
    tags: ['part5', 'part6', 'grammar', 'tense', 'high-value'],
    icon: '⏱️',
    frequencyRank: 4,
  },

  {
    id: 'gerund_infinitive',
    title: 'Gerund vs Infinitive',
    subtitle: '-ing form or to + verb — after specific verbs, it is not optional',
    category: 'grammar',
    subcategory: 'verb_patterns',
    description:
      'After certain verbs, you must use a gerund (-ing form). After others, you must use an infinitive (to + verb). And after some, both are possible. TOEIC exploits this by placing common business verbs that learners guess wrong.',
    whyItMatters:
      'Gerund/infinitive questions appear in Part 5 and depend on memorizing verb patterns. Unlike tense, there is often no logical deduction possible — you must know the pattern.',
    difficulty: 'advanced',
    toeicROI: 'high',
    toeicParts: ['part5'],
    drillCategory: 'gerund_infinitive',
    linkedLessonIds: ['gerund_infinitive'],
    traps: [
      '"Avoid," "suggest," "consider," "recommend," "finish" → always followed by gerund',
      '"Decide," "plan," "agree," "promise," "manage" → always followed by infinitive',
      '"Stop doing" (cease) vs "stop to do" (pause in order to) — completely different meanings',
      'After prepositions, always use gerund: "interested in doing," "good at writing"',
    ],
    examples: [
      { correct: 'She avoided making the same mistake.', incorrect: 'She avoided to make the same mistake.', note: '"Avoid" always takes gerund' },
      { correct: 'He decided to postpone the meeting.', incorrect: 'He decided postponing the meeting.', note: '"Decide" always takes infinitive' },
      { correct: 'They stopped arguing about the budget.', incorrect: 'They stopped to argue about the budget.', note: 'Different meaning: "stopped arguing" = ceased; "stopped to argue" = paused in order to' },
    ],
    memoryTip: 'Memorize two core lists: RAVEN (Remember, Avoid, Various, Enjoy, Negate/Needs) → gerund. SIDE (Stop, Intend, Decide, Expect) → infinitive as a starting point.',
    tags: ['part5', 'grammar', 'verb-patterns', 'high-value'],
    icon: '⚙️',
    frequencyRank: 5,
  },

  {
    id: 'passive_voice',
    title: 'Passive Voice',
    subtitle: 'be + past participle — when and how to use it in business English',
    category: 'grammar',
    subcategory: 'voice',
    description:
      'Passive voice in English is formed with "be + past participle." TOEIC tests your ability to select the right form of "be" (is/are/was/were/will be/has been) in passive constructions, and to distinguish when passive is required vs when active is correct.',
    whyItMatters:
      'Business English is heavily passive. TOEIC reading passages use passive extensively, and Part 5 tests passive form construction. Mastering this accelerates both reading comprehension and Part 5 scores.',
    difficulty: 'intermediate',
    toeicROI: 'high',
    toeicParts: ['part5', 'part6', 'part7'],
    drillCategory: 'passive',
    linkedLessonIds: ['passive'],
    traps: [
      '"Was approved" (passive) vs "approved" (active past) — the agent changes meaning',
      'The perfect passive "has been + past participle" vs simple passive "is + past participle"',
      'Passive with modals: "should be reviewed" not "should reviewed"',
      '"The report was written by" — "by" introduces the agent in passive sentences',
    ],
    examples: [
      { correct: 'The proposal was approved by the board.', incorrect: 'The proposal was approve by the board.', note: 'Passive = be + past participle' },
      { correct: 'The results have been reviewed.', incorrect: 'The results have reviewed.', note: '"Have been" not just "have" for passive' },
      { correct: 'New procedures will be implemented next quarter.', incorrect: 'New procedures will implemented next quarter.', note: '"Will be + past participle" for future passive' },
    ],
    memoryTip: 'Be + past participle. The tense lives in "be" — not in the participle.',
    tags: ['part5', 'part7', 'grammar', 'passive', 'business-english'],
    icon: '🔄',
    frequencyRank: 6,
  },

  {
    id: 'relative_clause',
    title: 'Relative Clauses',
    subtitle: 'who / which / that / whose / where — the right pronoun for the right antecedent',
    category: 'grammar',
    subcategory: 'clauses',
    description:
      'Relative clauses modify nouns and are introduced by who (people), which (things), that (people or things), whose (possession), where (places), or when (time). TOEIC tests both correct selection and correct clause structure.',
    whyItMatters:
      'Relative clauses are critical for Part 5 and appear throughout Part 7 reading passages. Misreading a relative clause can flip the meaning of a sentence in comprehension questions.',
    difficulty: 'intermediate',
    toeicROI: 'medium',
    toeicParts: ['part5', 'part7'],
    drillCategory: 'relative_clause',
    linkedLessonIds: ['relative_clause'],
    traps: [
      '"Who" for people, "which" for things — never "which" for people in standard TOEIC usage',
      '"Whose" indicates possession — "the employee whose contract was renewed"',
      '"Where" refers to a place — "the office where she works"',
      'Restrictive vs non-restrictive: "the manager who called" (specific) vs "the manager, who called," (additional info)',
    ],
    examples: [
      { correct: 'The employee who submitted the report was promoted.', incorrect: 'The employee which submitted the report was promoted.', note: '"Who" for people, not "which"' },
      { correct: 'The department where she works is expanding.', incorrect: 'The department that she works is expanding.', note: '"Where" for places (or "where" can be replaced by "in which")' },
      { correct: 'The contract whose terms were agreed upon yesterday was signed.', incorrect: 'The contract which terms were agreed upon yesterday was signed.', note: '"Whose" for possession' },
    ],
    memoryTip: 'People → who/whose. Things → which/that. Places → where. Time → when.',
    tags: ['part5', 'part7', 'grammar', 'clauses'],
    icon: '🔍',
    frequencyRank: 7,
  },

  {
    id: 'article',
    title: 'Articles',
    subtitle: 'a / an / the / zero article — systematic, not guesswork',
    category: 'grammar',
    subcategory: 'determiners',
    description:
      'Article selection follows consistent rules. "The" (definite) = previously mentioned, unique, or specific. "A/an" (indefinite) = first mention, one of many. Zero article = plural or uncountable nouns in general statements.',
    whyItMatters:
      'Articles appear throughout all TOEIC sections. In Part 5, 2–4 questions directly test article selection. In reading, missing article logic causes misinterpretation.',
    difficulty: 'intermediate',
    toeicROI: 'medium',
    toeicParts: ['part5', 'part6'],
    drillCategory: 'article',
    linkedLessonIds: ['article'],
    traps: [
      'Using "a" before a vowel sound: "an hour," "an MBA," "a university" (the U sounds like Y)',
      'Second mention uses "the": first "We hired a consultant" → then "The consultant recommended…"',
      'Unique things use "the": "the CEO," "the internet," "the environment"',
      'Zero article with general nouns: "Managers are responsible for…" not "The managers are responsible for…"',
    ],
    examples: [
      { correct: 'We received an offer yesterday.', incorrect: 'We received a offer yesterday.', note: '"An" before vowel sounds' },
      { correct: 'The report was submitted on time.', incorrect: 'A report was submitted on time.', note: '"The" = specific, previously identified report' },
      { correct: 'Communication is essential in business.', incorrect: 'The communication is essential in business.', note: 'Zero article for general abstract concepts' },
    ],
    memoryTip: 'First mention → a/an. Second mention → the. Unique → the. General concept → zero.',
    tags: ['part5', 'part6', 'grammar', 'determiners'],
    icon: '📋',
    frequencyRank: 8,
  },

  {
    id: 'pronoun',
    title: 'Pronouns',
    subtitle: 'subject / object / possessive / reflexive — case and referent matter',
    category: 'grammar',
    subcategory: 'pronouns',
    description:
      'Pronoun questions test subject case (she/he/they), object case (her/him/them), possessive determiners (her/his/their), possessive pronouns (hers/his/theirs), and reflexive forms (herself/himself/themselves).',
    whyItMatters:
      'Pronoun case errors are easy to see when reviewed in isolation but surprisingly hard under time pressure in Part 5. Reflexive vs possessive confusion is a classic TOEIC trap.',
    difficulty: 'beginner',
    toeicROI: 'medium',
    toeicParts: ['part5'],
    drillCategory: 'pronoun',
    linkedLessonIds: [],
    traps: [
      'Reflexive pronouns ("herself," "itself") are used when subject and object are the same person',
      '"Its" (possessive) vs "it\'s" (contraction) — TOEIC sometimes tests this distinction',
      'After prepositions, use object pronouns: "between you and me," not "between you and I"',
      'Possessive determiners precede nouns: "her report" (not "hers report")',
    ],
    examples: [
      { correct: 'She reviewed the report herself.', incorrect: 'She reviewed the report by her.', note: 'Reflexive pronoun when subject = object' },
      { correct: 'The decision is hers to make.', incorrect: 'The decision is her to make.', note: 'Possessive pronoun (no noun after it)' },
      { correct: 'The team completed the project on its own.', incorrect: 'The team completed the project on it\'s own.', note: '"Its" = possessive; "it\'s" = it is' },
    ],
    memoryTip: 'Subject (I/she/he) → before verb. Object (me/her/him) → after verb or preposition. Reflexive → when subject and object are the same.',
    tags: ['part5', 'grammar', 'pronouns'],
    icon: '👤',
    frequencyRank: 9,
  },

  // ── TRAPS ─────────────────────────────────────────────────────────────────

  {
    id: 'trap_despite_although',
    title: 'Despite vs Although vs However',
    subtitle: 'The #1 conjunction trap in every TOEIC exam',
    category: 'traps',
    subcategory: 'connectors',
    description:
      'These three words all express contrast, but they have completely different grammatical structures. TOEIC places them in a single question with options that all mean "contrast" — forcing you to select based on structure, not meaning.',
    whyItMatters:
      'This is the most frequently tested trap in Part 5. Every TOEIC exam includes at least one version of this trap. Getting this wrong costs 1 mark for what is a learnable, mechanical rule.',
    difficulty: 'intermediate',
    toeicROI: 'critical',
    toeicParts: ['part5', 'part6'],
    linkedLessonIds: ['conjunction', 'trap_despite'],
    traps: [
      '"Despite" is always followed by a noun or noun phrase — NEVER a full clause with a subject and verb',
      '"Although" introduces a full subordinate clause — it MUST have a subject and verb after it',
      '"However" is a sentence adverb — use it to start a new sentence or after a semicolon',
      'Common trap: TOEIC puts a noun phrase after the blank to lure you into choosing "although"',
    ],
    examples: [
      { correct: 'Despite the delay, the shipment arrived.', incorrect: 'Although the delay, the shipment arrived.', note: '"Despite" + noun phrase; "although" needs a full clause' },
      { correct: 'Although it was delayed, the shipment arrived.', incorrect: 'Despite it was delayed, the shipment arrived.', note: '"Although" + clause (it was delayed)' },
      { correct: 'The shipment was delayed. However, it arrived.', incorrect: 'The shipment was delayed, however it arrived.', note: '"However" starts a new sentence, not a clause' },
    ],
    memoryTip: 'Check what follows the blank. Noun phrase → despite. Subject + verb → although. New sentence → however.',
    tags: ['part5', 'traps', 'critical', 'conjunction', 'connector-trap'],
    icon: '⚠️',
    frequencyRank: 2,
  },

  {
    id: 'trap_confusables',
    title: 'Confusable Adjectives',
    subtitle: 'effective / efficient — economic / economical — historic / historical',
    category: 'traps',
    subcategory: 'vocabulary_traps',
    description:
      'TOEIC loves pairs of adjectives with similar forms but different meanings. These are tested in Part 5 and also trip up readers in Part 7. Learning one-line rules for each pair eliminates the confusion permanently.',
    whyItMatters:
      'Confusable adjective errors cause wrong answers that feel "almost right." Because both options look familiar, learners guess rather than knowing. Eliminating guessing here is quick score recovery.',
    difficulty: 'intermediate',
    toeicROI: 'high',
    toeicParts: ['part5', 'part7'],
    linkedLessonIds: ['trap_confusables'],
    traps: [
      '"Effective" = achieves the intended result. "Efficient" = achieves it with minimum waste.',
      '"Economic" = relating to economics/money. "Economical" = cheap/not wasteful.',
      '"Historic" = important in history. "Historical" = related to history in general.',
      '"Sensible" = reasonable/practical. "Sensitive" = easily affected/emotionally reactive.',
    ],
    examples: [
      { correct: 'This is the most effective solution.', incorrect: 'This is the most efficient solution.', note: '"Effective" = it works; "efficient" = it works without waste' },
      { correct: 'We need a more economical approach.', incorrect: 'We need a more economic approach.', note: '"Economical" = cost-saving; "economic" = related to the economy' },
      { correct: 'This was a historic decision.', incorrect: 'This was a historical decision.', note: '"Historic" = will be remembered in history; "historical" = from the past' },
    ],
    memoryTip: 'Effective = effect (result). Efficient = efficient use of resources. Economical = economising. Economic = the economy.',
    tags: ['part5', 'traps', 'adjectives', 'confusables', 'vocabulary'],
    icon: '⚖️',
    frequencyRank: 3,
  },

  {
    id: 'trap_say_tell',
    title: 'Say vs Tell',
    subtitle: 'The classic reporting verb trap',
    category: 'traps',
    subcategory: 'verb_confusion',
    description:
      '"Say" and "tell" are both reporting verbs but follow completely different structures. "Tell" always has an indirect object (a person) directly after it. "Say" never takes a direct object (a person) without "to."',
    whyItMatters:
      'Say/tell confusion appears in Part 5 and Part 6. Because both words mean "communicate verbally," learners guess based on meaning. The correct answer depends entirely on the grammatical structure that follows.',
    difficulty: 'beginner',
    toeicROI: 'high',
    toeicParts: ['part5', 'part6'],
    linkedLessonIds: ['trap_say_tell'],
    traps: [
      '"Tell" must be followed by a person: "tell me," "tell him," "tell the team" — never "tell that…"',
      '"Say" cannot be followed directly by a person: "say to me" not "say me"',
      '"Tell the truth/a story/a lie/a joke" — special fixed expressions with "tell" + noun',
      'In reported speech: "She said (that)…" — "said" does not take a person as direct object',
    ],
    examples: [
      { correct: 'She told me about the meeting.', incorrect: 'She said me about the meeting.', note: '"Tell" + person directly; "say" cannot do this' },
      { correct: 'He said that he would be late.', incorrect: 'He told that he would be late.', note: '"Tell" needs a person before "that": "told him that…"' },
      { correct: 'Please tell the team about the changes.', incorrect: 'Please say the team about the changes.', note: '"Tell" + person + about; "say" would need "to the team"' },
    ],
    memoryTip: 'Tell = tell someone (person follows directly). Say = say something (thing follows directly).',
    tags: ['part5', 'traps', 'verbs', 'reporting-speech'],
    icon: '💬',
    frequencyRank: 5,
  },

  {
    id: 'trap_since_for',
    title: 'Since vs For + Rise vs Raise',
    subtitle: 'Time connectors and the most confused verb pair',
    category: 'traps',
    subcategory: 'mixed_traps',
    description:
      'Two important traps packaged in one: (1) "since" + point in time vs "for" + duration, both used with present perfect; (2) rise/raised/risen (intransitive) vs raise/raised/raised (transitive).',
    whyItMatters:
      'Since/for errors are the #1 present perfect mistake. Rise/raise confusion is a classic advanced trap. Both appear in Part 5 and Part 6 context-based questions.',
    difficulty: 'advanced',
    toeicROI: 'high',
    toeicParts: ['part5', 'part6'],
    linkedLessonIds: ['trap_since_for'],
    traps: [
      '"Since" + a point in time: "since 2020," "since Monday," "since the merger"',
      '"For" + a duration: "for three years," "for six months," "for decades"',
      '"Rise" is intransitive — it never takes an object: "Sales rose last quarter."',
      '"Raise" is transitive — it requires an object: "The company raised its prices."',
    ],
    examples: [
      { correct: 'She has worked here since 2018.', incorrect: 'She has worked here for 2018.', note: '"Since" + point in time; "for" + duration' },
      { correct: 'She has worked here for five years.', incorrect: 'She has worked here since five years.', note: '"For" + duration (five years); "since" needs a date' },
      { correct: 'Prices rose sharply last year.', incorrect: 'Prices raised sharply last year.', note: '"Rise" = go up by itself; "raise" = cause something to go up' },
    ],
    memoryTip: 'Since → when did it start? For → how long has it been going? Rise = the sun rises (no object). Raise = raise your hand (object needed).',
    tags: ['part5', 'part6', 'traps', 'advanced', 'verb-confusion', 'tense'],
    icon: '📈',
    frequencyRank: 6,
  },

  // ── VOCABULARY ────────────────────────────────────────────────────────────

  {
    id: 'vocab_finance',
    title: 'Finance Vocabulary',
    subtitle: 'revenue / liability / fiscal / invoice / equity — Part 5/6/7 essential',
    category: 'vocabulary',
    subcategory: 'finance',
    description:
      'Finance vocabulary appears throughout all TOEIC sections. Part 7 business documents — invoices, financial reports, earnings announcements — require fluency with these terms to answer correctly.',
    whyItMatters:
      'Finance is the most common business domain in TOEIC. Emails, memos, reports, and notices all use financial vocabulary. A learner who knows these 15 words is significantly faster and more accurate on Part 7.',
    difficulty: 'intermediate',
    toeicROI: 'high',
    toeicParts: ['part5', 'part6', 'part7'],
    linkedLessonIds: ['vocab_finance'],
    traps: [
      '"Revenue" (total income) vs "profit" (income minus expenses) — different concepts',
      '"Invoice" (bill sent) vs "receipt" (proof of payment) — common Part 7 confusion',
      '"Fiscal year" = accounting year, which may not match the calendar year',
      '"Liability" = debt/obligation vs "asset" = owned resource',
    ],
    examples: [
      { correct: 'The company reported strong revenue growth.', note: 'Revenue = total sales income before expenses' },
      { correct: 'Please settle the invoice within 30 days.', note: 'Invoice = bill requesting payment' },
      { correct: 'The fiscal year ends on March 31.', note: 'Fiscal year = company\'s accounting year' },
    ],
    memoryTip: 'Revenue is the TOP line (everything earned). Profit is the BOTTOM line (after costs).',
    tags: ['part5', 'part6', 'part7', 'vocabulary', 'finance', 'business'],
    icon: '💰',
    frequencyRank: 4,
  },

  {
    id: 'vocab_hr',
    title: 'HR & Office Vocabulary',
    subtitle: 'appraisal / delegate / onboard / initiative / grievance',
    category: 'vocabulary',
    subcategory: 'human_resources',
    description:
      'HR vocabulary appears in job ads, internal memos, performance review documents, and workplace communications — all common Part 6 and Part 7 document types. It is also frequently tested in Part 5 sentence completion.',
    whyItMatters:
      'TOEIC Part 7 commonly features HR documents: job postings, onboarding emails, appraisal letters. Without this vocabulary, even strong grammar students lose points on comprehension.',
    difficulty: 'intermediate',
    toeicROI: 'high',
    toeicParts: ['part5', 'part6', 'part7'],
    linkedLessonIds: ['vocab_hr'],
    traps: [
      '"Appraisal" = formal performance review (not just praise)',
      '"Delegate" = assign authority to someone else (not just "assign tasks")',
      '"Onboard" = the process of integrating a new employee — increasingly used as a verb',
      '"Take initiative" = act without being asked — fixed expression',
    ],
    examples: [
      { correct: 'Her annual appraisal is scheduled for next month.', note: 'Appraisal = formal performance evaluation' },
      { correct: 'The manager delegated the project to her team.', note: 'Delegate = transfer responsibility' },
      { correct: 'New employees will be onboarded during a three-day orientation.', note: '"Onboard" used as a verb in modern business English' },
    ],
    memoryTip: 'Delegate = send down authority. Appraise = look at performance carefully.',
    tags: ['part5', 'part6', 'part7', 'vocabulary', 'hr', 'office'],
    icon: '👥',
    frequencyRank: 5,
  },

  {
    id: 'vocab_collocations',
    title: 'Business Collocations',
    subtitle: 'make / do / take / give + noun — the right verb for each combination',
    category: 'vocabulary',
    subcategory: 'collocations',
    description:
      'Business collocations are fixed combinations of verb + noun (or adjective + noun) that native speakers use automatically but learners often get wrong. "Make a decision" not "do a decision." "Take a break" not "make a break."',
    whyItMatters:
      'Collocation errors are among the hardest to detect intuitively. TOEIC exploits this — placing "do" where "make" is required, or "have" where "take" is standard. Memorizing key collocations eliminates these errors.',
    difficulty: 'intermediate',
    toeicROI: 'high',
    toeicParts: ['part5', 'part6'],
    drillCategory: 'collocation',
    linkedLessonIds: [],
    traps: [
      '"Make" a decision, a profit, a call, a mistake, a suggestion, progress',
      '"Do" business, research, damage, a job, your best, overtime',
      '"Take" responsibility, action, a break, notes, advantage of, part in',
      '"Have" a meeting, a discussion, difficulty, an impact, access to',
    ],
    examples: [
      { correct: 'We made significant progress last quarter.', incorrect: 'We did significant progress last quarter.', note: '"Make progress" not "do progress"' },
      { correct: 'The team took responsibility for the error.', incorrect: 'The team made responsibility for the error.', note: '"Take responsibility" not "make responsibility"' },
      { correct: 'They have difficulty meeting the deadline.', incorrect: 'They make difficulty meeting the deadline.', note: '"Have difficulty" not "make difficulty"' },
    ],
    memoryTip: 'When in doubt: MAKE = create or produce something. DO = perform an action. TAKE = accept or receive.',
    tags: ['part5', 'part6', 'vocabulary', 'collocations', 'business'],
    icon: '🔀',
    frequencyRank: 5,
  },

  {
    id: 'vocab_email',
    title: 'Email & Correspondence',
    subtitle: 'regarding / with reference to / as per / I am writing to — opening and closing phrases',
    category: 'vocabulary',
    subcategory: 'correspondence',
    description:
      'TOEIC Part 6 and Part 7 are full of business emails, memos, and letters. Understanding the vocabulary of formal correspondence — openings, transitions, closings — allows faster and more accurate reading.',
    whyItMatters:
      'Part 6 often requires inserting the correct sentence into an email context. Part 7 reading passages frequently feature email chains. Fluency with email conventions is a reading speed multiplier.',
    difficulty: 'beginner',
    toeicROI: 'medium',
    toeicParts: ['part6', 'part7'],
    linkedLessonIds: [],
    traps: [
      '"Regarding" = about/concerning — more formal than "about"',
      '"As per" = in accordance with — often seen in formal replies',
      '"I am writing to + infinitive" — standard email opening structure',
      '"Please do not hesitate to contact us" — fixed formal closing phrase',
    ],
    examples: [
      { correct: 'I am writing to inquire about the status of my application.', note: 'Standard email opening: "I am writing to + infinitive"' },
      { correct: 'Regarding your request for a refund, we are happy to assist.', note: '"Regarding" = about — more formal alternative' },
      { correct: 'As per our previous conversation, the meeting is confirmed for Thursday.', note: '"As per" = according to / in accordance with' },
    ],
    memoryTip: 'TOEIC emails follow a predictable structure: opening → purpose → details → action → closing. Knowing the phrases speeds up reading by 30%.',
    tags: ['part6', 'part7', 'vocabulary', 'email', 'correspondence'],
    icon: '📧',
    frequencyRank: 7,
  },

  {
    id: 'vocab_logistics',
    title: 'Shipping & Logistics',
    subtitle: 'shipment / freight / dispatch / inventory / customs clearance',
    category: 'vocabulary',
    subcategory: 'logistics',
    description:
      'Logistics and shipping vocabulary is common in Part 7 documents: shipping confirmations, purchase orders, and logistics emails. TOEIC uses this domain to test vocabulary comprehension in context.',
    whyItMatters:
      'Shipping and supply chain documents are a frequently tested Part 7 document type. Not knowing "dispatch," "freight," or "customs clearance" can cause misreading of key details in comprehension questions.',
    difficulty: 'intermediate',
    toeicROI: 'medium',
    toeicParts: ['part6', 'part7'],
    linkedLessonIds: [],
    traps: [
      '"Dispatch" = send out (UK) / speed (general) — in TOEIC, usually means "ship"',
      '"Freight" = goods being transported (not the cost) / also the cost of transport',
      '"Inventory" = stock of goods — "low inventory" = not enough stock',
      '"ETA" = Estimated Time of Arrival — critical abbreviation in shipping documents',
    ],
    examples: [
      { correct: 'The shipment was dispatched on Monday and is expected to arrive by Friday.', note: 'Dispatched = sent out' },
      { correct: 'Customs clearance may take 2–3 business days.', note: 'Customs clearance = official approval to enter the country' },
      { correct: 'We currently have sufficient inventory to fulfill all pending orders.', note: 'Inventory = stock on hand' },
    ],
    memoryTip: 'Dispatch → dispatch center → center that sends things out. Freight → heavy goods in transit.',
    tags: ['part6', 'part7', 'vocabulary', 'logistics', 'shipping'],
    icon: '🚚',
    frequencyRank: 8,
  },

  {
    id: 'vocab_contract',
    title: 'Contracts & Legal',
    subtitle: 'clause / terms / conditions / liable / provision / comply',
    category: 'vocabulary',
    subcategory: 'legal',
    description:
      'Contract and legal vocabulary appears in Part 7 double-passage texts featuring contracts, service agreements, or terms and conditions. These are some of the hardest document types in TOEIC, partly because the vocabulary is unfamiliar.',
    whyItMatters:
      'Contract documents in TOEIC Part 7 are specifically designed to require accurate reading of dense vocabulary. Learners who know "clause," "provision," "liable," and "comply" gain 1–3 additional correct answers on these passages.',
    difficulty: 'advanced',
    toeicROI: 'medium',
    toeicParts: ['part7'],
    linkedLessonIds: [],
    traps: [
      '"Clause" = a specific provision within a contract — not the same as a grammatical clause',
      '"Liable" = legally responsible — "liable for damages" means legally obliged to pay',
      '"Comply" = act in accordance with a rule — "comply with regulations"',
      '"Provision" = a specific condition or rule in a contract — also can mean "the act of providing"',
    ],
    examples: [
      { correct: 'Both parties must comply with the terms of the agreement.', note: '"Comply with" = follow / adhere to' },
      { correct: 'The contractor shall be liable for any damages caused.', note: '"Liable for" = legally responsible for' },
      { correct: 'Clause 7 of the contract outlines the termination procedure.', note: '"Clause" = specific numbered section of a contract' },
    ],
    memoryTip: 'Liable → liability → who is responsible if something goes wrong. Clause → close look → read each clause carefully.',
    tags: ['part7', 'vocabulary', 'legal', 'contracts', 'advanced'],
    icon: '📄',
    frequencyRank: 9,
  },

  // ── STRATEGY ──────────────────────────────────────────────────────────────

  {
    id: 'strategy_part5_framework',
    title: 'Part 5 Strategy',
    subtitle: 'The 30-second decision framework for guaranteed points',
    category: 'strategy',
    subcategory: 'part5_strategy',
    description:
      'A systematic decision tree for every Part 5 question: (1) read the sentence for the blank, (2) look at the grammatical environment of the blank, (3) identify the question type, (4) apply the rule. Do not read the options first.',
    whyItMatters:
      'Most test-takers waste 45–60 seconds per Part 5 question by reading all options first. The framework cuts this to 25–35 seconds while increasing accuracy. Over 30 questions, this saves 5–10 minutes for Part 7.',
    difficulty: 'beginner',
    toeicROI: 'critical',
    toeicParts: ['part5'],
    linkedLessonIds: ['strategy_part5'],
    traps: [
      'Never read all four options first — identify the question type from the blank context',
      'If you cannot determine the answer in 30 seconds, choose your best guess and move on',
      '"Meaning-based" questions are last resort — structure-based answers first',
      'Wrong options are designed to look partially correct — trust the grammatical rule, not your feeling',
    ],
    examples: [
      { correct: 'Step 1: Identify grammatical role of blank. Step 2: Apply structural rule. Step 3: Verify against options.', note: 'Always: structure → rule → option' },
    ],
    memoryTip: 'Read the blank CONTEXT first. What grammatical structure is expected? Then look at options. Never the other way around.',
    tags: ['strategy', 'part5', 'critical', 'framework', 'time-management'],
    icon: '🗺️',
    frequencyRank: 1,
  },

  {
    id: 'strategy_part7_skim',
    title: 'Part 7 Skim & Scan',
    subtitle: 'Strategic reading: structure first, details second',
    category: 'strategy',
    subcategory: 'part7_strategy',
    description:
      'Skim the document for structure and topic (10–15 seconds). Identify document type (email, ad, memo, report). Then read questions. For each question, scan for the relevant section rather than re-reading everything.',
    whyItMatters:
      'Part 7 is the major time pressure section of TOEIC. Reading every word of every passage is impossible in time. Skim/scan technique allows accurate answers in 60–90 seconds per single passage.',
    difficulty: 'intermediate',
    toeicROI: 'high',
    toeicParts: ['part7'],
    linkedLessonIds: ['strategy_part7'],
    traps: [
      'Never re-read the whole passage for each question — scan to the relevant paragraph',
      '"NOT true" questions require checking all options against the passage',
      'Inference questions require reading between the lines — the answer is never stated directly',
      'Paraphrase traps: the correct answer often uses different words to express the same idea',
    ],
    examples: [
      { correct: 'Skim: Topic? → Finance report. Main sections? → Q1 results, outlook, notes.', note: 'Step 1: 10 seconds to understand structure' },
      { correct: 'Question: "When will the event take place?" → scan for date/time information only.', note: 'Step 2: Scan directly to relevant section' },
    ],
    memoryTip: 'SKIM for structure (what is this document about?). SCAN for specifics (where is the answer?).',
    tags: ['strategy', 'part7', 'reading', 'high-value', 'time-management'],
    icon: '📖',
    frequencyRank: 3,
  },

  {
    id: 'part7_inference',
    title: 'Part 7 Inference Questions',
    subtitle: 'What can be inferred / implied / suggested — reading between the lines',
    category: 'reading',
    subcategory: 'comprehension',
    description:
      'Inference questions ask what the passage implies without stating directly. They are the hardest question type in Part 7. The correct answer is a logical conclusion from stated facts — not stated explicitly, but undeniably supported.',
    whyItMatters:
      'Inference questions appear 2–4 times per Part 7 and are frequently wrong even for strong readers. Mastering inference logic is one of the most impactful advanced improvements for scores above 750.',
    difficulty: 'advanced',
    toeicROI: 'high',
    toeicParts: ['part7'],
    linkedLessonIds: [],
    traps: [
      'Avoid answers that go too far beyond the text — inferences must be directly supported',
      '"It can be inferred" questions often have attractive wrong options that state general truths',
      'The correct answer is always traceable to specific text — verify it before selecting',
      'Beware of options using absolute language ("always," "never") — usually incorrect',
    ],
    examples: [
      { correct: 'Text says: "The branch in Paris was opened last year." Inference: The company recently expanded internationally.', note: 'Safe inference — directly supported, not an overreach' },
      { correct: 'Text says: "She has 10 years of experience." Inference: She has been working in this field for a long time.', incorrect: 'Inference: She is the best candidate.', note: 'The second inference overreaches — not supported by the text' },
    ],
    memoryTip: 'Inference = "The text does not say X directly, but X must be true based on what IS stated." If you have to assume something extra → wrong answer.',
    tags: ['part7', 'reading', 'inference', 'advanced', 'comprehension'],
    icon: '🔬',
    frequencyRank: 6,
  },

  {
    id: 'part7_paraphrase',
    title: 'Part 7 Paraphrase Recognition',
    subtitle: 'Finding the answer when the wording is completely different',
    category: 'reading',
    subcategory: 'comprehension',
    description:
      'In Part 7, the correct answer almost never uses the exact words from the passage. It paraphrases — using synonyms, different structures, or different perspectives to express the same meaning. Recognising paraphrase is a trainable skill.',
    whyItMatters:
      'Paraphrase recognition is the key to eliminating attractive wrong options and finding correct answers that look unfamiliar. It accounts for why many Part 7 answers feel counterintuitive to learners reading for exact keywords.',
    difficulty: 'advanced',
    toeicROI: 'high',
    toeicParts: ['part7'],
    linkedLessonIds: ['strategy_part7'],
    traps: [
      'Options using exact words from the passage are often WRONG (distractor strategy)',
      'The correct answer often sounds "different" but means exactly the same thing',
      'Shift of perspective is common: active → passive, noun → verb, specific → general',
      '"Not stated" options are tempting when they are true in general but absent from the text',
    ],
    examples: [
      { correct: 'Text: "The event has been postponed to next quarter." Answer: "The meeting will not take place as originally scheduled."', note: 'Paraphrase: postponed → will not take place as scheduled' },
      { correct: 'Text: "Employees must submit expenses within 30 days." Answer: "There is a deadline for expense submissions."', note: 'Paraphrase: must submit within 30 days → there is a deadline' },
    ],
    memoryTip: 'When you cannot find the exact words in the text, look for the same idea expressed differently. That is the correct answer.',
    tags: ['part7', 'reading', 'paraphrase', 'advanced', 'comprehension'],
    icon: '🪞',
    frequencyRank: 7,
  },

  {
    id: 'part6_coherence',
    title: 'Part 6 Sentence Coherence',
    subtitle: 'Inserting the right sentence to maintain logical flow',
    category: 'reading',
    subcategory: 'coherence',
    description:
      'Part 6 now includes sentence-insertion questions: you are given four complete sentences and must choose which one fits the blank in the passage. The correct choice maintains logical flow, tense consistency, and topic continuity.',
    whyItMatters:
      'Sentence insertion questions are among the most difficult in Part 6. Unlike vocabulary or grammar blanks, they require discourse-level understanding of how ideas flow within a document.',
    difficulty: 'advanced',
    toeicROI: 'medium',
    toeicParts: ['part6'],
    linkedLessonIds: [],
    traps: [
      'A sentence may be grammatically correct but topically wrong — the topic must connect',
      'Transition words in the options give clues: "However," "In addition," "As a result"',
      'Check tense consistency: a sentence in past tense in a present-tense passage is usually wrong',
      'The inserted sentence must connect naturally to the sentence before AND after it',
    ],
    examples: [
      { correct: 'Blank follows: "The conference was a great success." → Correct insertion: "Attendees from over 20 countries participated."', note: 'Adds a relevant detail that expands on "great success"' },
      { correct: 'Blank follows: "The conference was a great success." → Correct insertion: "Attendees praised the organization."', incorrect: '"However, the budget was over by 15%."', note: 'The incorrect option contradicts the previous sentence — breaks coherence' },
    ],
    memoryTip: 'Read the sentence BEFORE the blank and AFTER the blank. The inserted sentence must connect smoothly to both.',
    tags: ['part6', 'reading', 'coherence', 'sentence-insertion', 'advanced'],
    icon: '🧩',
    frequencyRank: 8,
  },

  {
    id: 'distractor_logic',
    title: 'Distractor Logic',
    subtitle: 'How TOEIC constructs wrong answers — and how to see through them',
    category: 'traps',
    subcategory: 'test_strategy',
    description:
      'TOEIC wrong answers follow predictable patterns: same root word, correct meaning but wrong structure, correct structure but wrong meaning, overly general statements. Understanding distractor design helps you eliminate wrong options faster.',
    whyItMatters:
      'When you understand HOW wrong answers are constructed, you stop being fooled by them. This meta-skill accelerates all parts of the exam and explains patterns in your error notebook.',
    difficulty: 'advanced',
    toeicROI: 'high',
    toeicParts: ['part5', 'part6', 'part7'],
    linkedLessonIds: [],
    traps: [
      'Same-root distractor: all four options come from the same root word — you must pick the right form',
      'Meaning-sound-alike distractor: words that sound similar or look similar but differ in meaning',
      'Almost-correct distractor: right meaning, wrong structure (e.g. "although" where "despite" is needed)',
      'Overreach distractor in Part 7: true in general but not stated or supported in the passage',
    ],
    examples: [
      { correct: 'You see "economy / economic / economical / economically" as options → word form question', note: 'Identify type first, then select by grammatical role' },
      { correct: 'Part 7 option says "The company always delivers on time" but the passage says "usually" → overreach distractor', note: 'Absolute language in options is usually wrong' },
    ],
    memoryTip: 'Name the distractor type before eliminating it. "This is a same-root trap. I need the adverb. → economically." Naming = neutralising.',
    tags: ['strategy', 'traps', 'advanced', 'meta-skill', 'all-parts'],
    icon: '🎭',
    frequencyRank: 4,
  },

]

// ── Lookup helpers ─────────────────────────────────────────────────────────────

export const TOPIC_BY_ID: Record<string, Topic> = Object.fromEntries(
  TOPICS.map(t => [t.id, t])
)

export const TOPICS_BY_CATEGORY: Record<string, Topic[]> = TOPICS.reduce(
  (acc, t) => {
    if (!acc[t.category]) acc[t.category] = []
    acc[t.category].push(t)
    return acc
  },
  {} as Record<string, Topic[]>
)

export const TOPICS_BY_DRILL_CATEGORY: Record<string, Topic> = Object.fromEntries(
  TOPICS
    .filter(t => t.drillCategory)
    .map(t => [t.drillCategory!, t])
)

export const TOPIC_ROI_ORDER: TopicROI[] = ['critical', 'high', 'medium', 'low']
type TopicROI = 'critical' | 'high' | 'medium' | 'low'
