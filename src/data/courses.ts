import type { Lesson } from '../types'
import { grammarTableLessons } from './grammarTableLessons'
import { advancedGrammarLessons } from './advancedGrammarLessons'

export const lessons: Lesson[] = [
  ...grammarTableLessons,
  ...advancedGrammarLessons,

  // ──────────────────────────────────────────────────────────────────────────
  // GRAMMAR LESSONS
  // ──────────────────────────────────────────────────────────────────────────

  {
    id: 'word_form',
    title: 'Word Form: The Right Shape for the Right Slot',
    subtitle: 'The most tested grammar pattern in Part 5 — 25–30% of all questions',
    category: 'grammar',
    difficulty: 'intermediate',
    estimatedMinutes: 12,
    icon: '🔠',
    objective: 'Identify the grammatical role of the blank and select the correct word form (noun / verb / adjective / adverb)',
    whyItMatters: 'Word Form questions account for 25–30% of Part 5. Once you master the position signals, these become the fastest questions to answer — often solvable in 10 seconds without even reading the whole sentence.',
    whyItMattersFr: "Les questions de forme lexicale représentent 25–30% de la Partie 5. Une fois que vous maîtrisez les signaux de position, ce sont les questions les plus rapides — souvent résolubles en 10 secondes.",
    xpReward: 50,
    linkedCategory: 'word_form',
    linkedGapFill: true,
    sections: [
      {
        type: 'rule',
        title: 'The Core Rule: Position = Role',
        content: 'Every blank in Part 5 plays a specific grammatical role. That role is determined by the words AROUND the blank — not by the meaning of the blank itself. Four roles exist: NOUN (subject or object), ADJECTIVE (modifies a noun), ADVERB (modifies a verb, adjective, or adverb), VERB (the action).',
        contentFr: "Chaque blanc dans la Partie 5 joue un rôle grammatical précis. Ce rôle est déterminé par les mots AUTOUR du blanc — pas par son sens. Quatre rôles existent: NOM (sujet ou objet), ADJECTIF (modifie un nom), ADVERBE (modifie un verbe, un adjectif ou un adverbe), VERBE (l'action)."
      },
      {
        type: 'examples',
        title: 'The 4 Position Signals — Learn These Patterns',
        content: 'These 4 patterns cover 90% of all Word Form questions:',
        examples: [
          { en: 'article / adjective + [BLANK] + noun → the blank is a NOUN', fr: 'article/adjectif + [BLANC] + nom → le blanc est un NOM', isCorrect: true, explanation: 'E.g.: "the ___ of the project" → blank = implementation (noun)' },
          { en: 'article + [BLANK] + noun → the blank is an ADJECTIVE', fr: 'article + [BLANC] + nom → le blanc est un ADJECTIF', isCorrect: true, explanation: 'E.g.: "a ___ decision" → blank = decisive (adj). Note: article + adj + noun is also valid.' },
          { en: 'verb + [BLANK] / [BLANK] + past participle → the blank is an ADVERB', fr: 'verbe + [BLANC] → le blanc est un ADVERBE', isCorrect: true, explanation: 'E.g.: "was ___ distributed" → blank = widely (adverb modifies past participle)' },
          { en: 'subject + [BLANK] + object/complement → the blank is a VERB', fr: 'sujet + [BLANC] + objet → le blanc est un VERBE', isCorrect: true, explanation: 'E.g.: "The board ___ a restructuring" → blank = approved' },
        ]
      },
      {
        type: 'examples',
        title: 'Correct vs Incorrect — Real TOEIC Sentences',
        content: 'Study these contrasting pairs carefully. The wrong version is what most test-takers choose.',
        examples: [
          { en: 'The company made a decisive decision to expand.', fr: 'La société a pris une décision décisive pour se développer.', isCorrect: true, explanation: '"decisive" = adjective modifying noun "decision". Article + adj + noun.' },
          { en: 'The company made a decisively decision to expand.', fr: '', isCorrect: false, explanation: '"decisively" is an adverb — it cannot directly precede a noun. Common trap: the -ly ending feels "stronger" or "more correct" to some learners.' },
          { en: 'Results were widely distributed to all shareholders.', fr: 'Les résultats ont été largement distribués à tous les actionnaires.', isCorrect: true, explanation: '"widely" = adverb modifying the past participle "distributed".' },
          { en: 'Results were wide distributed to all shareholders.', fr: '', isCorrect: false, explanation: '"wide" is an adjective — it cannot modify a verb form. Need the adverb "widely".' },
          { en: 'The implementation of the new system will take three months.', fr: "La mise en œuvre du nouveau système prendra trois mois.", isCorrect: true, explanation: '"implementation" = noun, serving as subject of the sentence.' },
          { en: 'The implement of the new system will take three months.', fr: '', isCorrect: false, explanation: '"implement" is a verb — it cannot be the subject without the noun suffix -ation.' },
        ]
      },
      {
        type: 'trap',
        title: 'The 3 Most Dangerous Word Form Traps',
        content: '1) "-tion" words LOOK like verbs but are NOUNS: implementation, application, consideration, distribution. Never use them as verbs.\n\n2) "-ly" is usually an adverb suffix — but not always: "friendly" and "lovely" are adjectives. Check position.\n\n3) Adjective vs Adverb confusion: "The manager was sole responsible" ✗ → "solely responsible" ✓ — need adverb to modify an adjective.',
        contentFr: "1) Les mots en '-tion' ressemblent à des verbes mais sont des NOMS: implementation, application.\n2) '-ly' est généralement un suffixe adverbial — mais pas toujours: 'friendly' est un adjectif.\n3) 'Sole responsible' ✗ → 'solely responsible' ✓ — il faut un adverbe pour modifier un adjectif."
      },
      {
        type: 'memory_tip',
        title: 'The Word Form Cheat Sheet — Memorize This',
        content: '–tion / –ance / –ence / –ment / –ness / –ity / –ship = NOUN\n–ive / –al / –ous / –ful / –less / –able / –ible = ADJECTIVE\n–ly (usually) = ADVERB\n–ize / –ify / –ate = VERB\n\nWhen stuck: read the surrounding words and ask "what role does the blank play in this sentence?"',
        contentFr: "–tion / –ance / –ence / –ment / –ness / –ité = NOM\n–ive / –al / –eux / –ble = ADJECTIF\n–ly (généralement) = ADVERBE\n–iser / –ifier = VERBE"
      },
      {
        type: 'toeic_tip',
        title: 'TOEIC Strategy: Look Right, Then Left',
        content: 'STEP 1 — Look at what comes AFTER the blank: if it\'s a noun, you need an adjective. If the blank is after a verb or past participle, you probably need an adverb.\nSTEP 2 — Look at what comes BEFORE the blank: an article before the blank usually means the blank is a noun or adjective + noun.\nSTEP 3 — Skip the options until you know what form you need. Then scan for that form.\n\nTotal time: 10–15 seconds per question.'
      },
      {
        type: 'why_wrong',
        title: 'Why Wrong Options Tempt You',
        content: 'The four options in a Word Form question always come from the SAME ROOT word. For example: "decide / decision / decisive / decisively". They all look familiar. The trap: they all seem correct because they all relate to the right meaning. The FORM is what matters — meaning alone is never enough.',
        contentFr: "Les quatre options viennent toujours de la MÊME RACINE. Elles semblent toutes correctes car elles partagent le même sens. Mais la FORME est ce qui compte — le sens seul ne suffit jamais."
      }
    ],
    miniQuiz: [
      {
        q: 'The board reached a _____ agreement on the new budget.',
        opts: ['unanimously', 'unanimous', 'unanimity', 'unanimize'],
        correct: 1,
        exp: '"unanimous" is the adjective needed to modify the noun "agreement". Article + adjective + noun pattern.',
        optExps: [
          '"unanimously" is an adverb — it cannot precede and modify a noun directly.',
          'Correct. "unanimous agreement" = article + adjective + noun.',
          '"unanimity" is a noun — two nouns cannot be stacked without a preposition.',
          '"unanimize" does not exist in English.'
        ]
      },
      {
        q: 'She spoke _____ to the client to avoid any misunderstanding.',
        opts: ['clear', 'clearing', 'clearly', 'clearance'],
        correct: 2,
        exp: '"clearly" is the adverb needed to modify the verb "spoke".',
        optExps: [
          '"clear" is an adjective — cannot modify a verb directly.',
          '"clearing" is a present participle or noun — wrong grammatical form here.',
          'Correct. "clearly" = adverb modifying the verb "spoke".',
          '"clearance" is a noun (e.g., security clearance) — unrelated role here.'
        ]
      },
      {
        q: 'The _____ of the new system is scheduled for next month.',
        opts: ['install', 'installment', 'installed', 'installation'],
        correct: 3,
        exp: '"installation" is the noun needed as the subject of the sentence.',
        optExps: [
          '"install" is a verb — cannot be the subject of a sentence.',
          '"installment" means a regular payment — wrong meaning and form.',
          '"installed" is a past participle — cannot function as subject without a helper verb.',
          'Correct. "installation" = noun form of "install", acting as subject.'
        ]
      }
    ],
    memorySummary: [
      'Position determines form: look around the blank, not at the blank.',
      '–tion/–ance/–ness/–ity = noun | –ive/–al/–ous = adjective | –ly = adverb (usually)',
      'All four options share the same meaning — it\'s the grammatical role that decides.'
    ],
    memorySummaryFr: [
      'La position détermine la forme: regardez autour du blanc, pas le blanc lui-même.',
      '–tion/–ance/–ness = nom | –ive/–al = adjectif | –ly = adverbe (généralement)',
      'Les quatre options ont le même sens — c\'est le rôle grammatical qui décide.'
    ],
    nextLessonIds: ['preposition', 'conjunction']
  },

  // ──────────────────────────────────────────────────────────────────────────

  {
    id: 'preposition',
    title: 'Prepositions: Fixed Collocations & Business Patterns',
    subtitle: 'The patterns TOEIC tests in every exam session',
    category: 'grammar',
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    icon: '🔗',
    objective: 'Recognize fixed preposition patterns with verbs, adjectives, and nouns in professional English',
    whyItMatters: 'Prepositions cannot be deduced from logic — they must be learned as fixed collocations. TOEIC tests the same 25–30 patterns repeatedly. Master these patterns and never lose a preposition point again.',
    whyItMattersFr: "Les prépositions ne peuvent pas être déduites logiquement — elles doivent être apprises comme collocations fixes. Le TOEIC teste les mêmes 25–30 structures à chaque examen.",
    xpReward: 45,
    linkedCategory: 'preposition',
    linkedGapFill: true,
    sections: [
      {
        type: 'rule',
        title: 'The Golden Rule: Prepositions Are Fixed, Not Logical',
        content: 'In English, prepositions are FIXED to specific verbs, adjectives, and nouns. You cannot translate from French or guess from meaning. "Responsible FOR" is always "for" — never "of", "to", or "about". Memorize collocations as complete units.',
        contentFr: "En anglais, les prépositions sont FIXES pour certains verbes, adjectifs et noms. Vous ne pouvez pas traduire du français ni les deviner par le sens. 'Responsible FOR' est toujours 'for' — jamais 'of', 'to' ou 'about'. Mémorisez les collocations comme des unités complètes."
      },
      {
        type: 'examples',
        title: 'High-Frequency TOEIC Preposition Patterns',
        content: 'These are the patterns that appear most often in Part 5. Learn them by heart.',
        examples: [
          { en: 'responsible FOR (something)', fr: 'responsable DE', isCorrect: true, explanation: 'He is responsible for quality control.' },
          { en: 'interested IN (something)', fr: 'intéressé PAR', isCorrect: true, explanation: 'She is interested in the new position.' },
          { en: 'concerned ABOUT (something)', fr: 'préoccupé PAR', isCorrect: true, explanation: 'Management is concerned about the delays.' },
          { en: 'aware OF (something)', fr: 'conscient DE', isCorrect: true, explanation: 'Are you aware of the new policy?' },
          { en: 'capable OF (doing something)', fr: 'capable DE', isCorrect: true, explanation: 'The team is capable of meeting the deadline.' },
          { en: 'result IN (something)', fr: 'entraîner/résulter EN', isCorrect: true, explanation: 'The changes resulted in higher revenue.' },
          { en: 'apply FOR (a position)', fr: 'postuler POUR', isCorrect: true, explanation: 'She applied for the marketing position.' },
          { en: 'comply WITH (a regulation)', fr: 'se conformer À', isCorrect: true, explanation: 'All suppliers must comply with safety standards.' },
          { en: 'deal WITH (a problem)', fr: 'traiter', isCorrect: true, explanation: 'The manager will deal with the complaint.' },
          { en: 'in charge OF (something)', fr: 'responsable DE / en charge DE', isCorrect: true, explanation: 'Who is in charge of the project?' },
          { en: 'in accordance WITH (a rule)', fr: "conformément À", isCorrect: true, explanation: 'Payments must be made in accordance with the contract.' },
          { en: 'in addition TO (something)', fr: 'en plus DE', isCorrect: true, explanation: 'In addition to salary, benefits include health insurance.' },
        ]
      },
      {
        type: 'trap',
        title: 'French Speaker Danger Zones',
        content: 'These are the most common preposition errors made by French speakers on the TOEIC:',
        contentFr: "Ce sont les erreurs de préposition les plus fréquentes des francophones au TOEIC:",
        examples: [
          { en: 'responsible OF the project ✗ → responsible FOR the project ✓', fr: "'responsable de' → EN ANGLAIS: 'responsible FOR' (jamais 'of')", isCorrect: false, explanation: 'French uses "de" but English uses "for". Never translate directly.' },
          { en: 'interested TO the position ✗ → interested IN the position ✓', fr: "'intéressé à' → EN ANGLAIS: 'interested IN' (jamais 'to')", isCorrect: false, explanation: 'French "intéressé à" ≠ English "interested in". The preposition changes.' },
          { en: 'according OF the report ✗ → according TO the report ✓', fr: "'selon' → EN ANGLAIS: 'according TO'", isCorrect: false, explanation: '"According TO" is fixed — never "according of", "according with", or "according about".' },
          { en: 'agree ABOUT a plan ✗ → agree ON a plan ✓', fr: "'d'accord sur un plan' → EN ANGLAIS: 'agree ON a plan'", isCorrect: false, explanation: '"Agree on a plan / decision". "Agree with a person". "Agree to a proposal".' },
        ]
      },
      {
        type: 'comparison',
        title: 'Agree ON / Agree WITH / Agree TO — The Three Forms',
        content: 'This verb has three different prepositions depending on what follows it:\n\n• agree WITH + person: "I agree with you."\n• agree ON + topic/plan: "They agreed on the budget."\n• agree TO + action/proposal: "She agreed to the new terms."\n\nIn TOEIC, the most tested form is "agree on a decision/plan/proposal".',
        contentFr: "Ce verbe a trois prépositions selon ce qui suit:\n• agree WITH + personne: 'Je suis d'accord avec toi.'\n• agree ON + sujet/plan: 'Ils se sont mis d'accord sur le budget.'\n• agree TO + action/proposition: 'Elle a accepté les nouvelles conditions.'"
      },
      {
        type: 'memory_tip',
        title: 'How to Memorize Prepositions (The Right Way)',
        content: 'Never memorize prepositions in isolation. Always memorize them inside a complete phrase:\n\nNOT: "responsible" + "for"\nYES: "The manager is responsible FOR the outcome."\n\nSpend 5 minutes per day reading this lesson\'s example phrases aloud. Muscle memory will do the rest. After 3 days, these patterns will feel natural.',
        contentFr: "Ne mémorisez jamais les prépositions seules. Mémorisez-les dans une phrase complète:\nNON: 'responsible' + 'for'\nOUI: 'The manager is responsible FOR the outcome.'\nLisez les exemples à voix haute pendant 5 minutes par jour."
      },
      {
        type: 'toeic_tip',
        title: 'TOEIC Technique: Eliminate by Pattern',
        content: 'When you see a preposition question: (1) Read the full sentence to identify the key verb or adjective. (2) Ask: "What preposition does this verb/adjective take?" (3) Eliminate options that don\'t match the pattern. (4) If you don\'t know the pattern — choose "for" or "with" for adjectives, "in" or "on" for verbs. These are statistically the most common in business contexts.'
      }
    ],
    miniQuiz: [
      {
        q: 'All employees must comply _____ the new safety regulations.',
        opts: ['to', 'for', 'with', 'about'],
        correct: 2,
        exp: '"comply WITH" is the fixed collocation. It is always "comply with a rule/regulation".',
        optExps: ['"comply to" does not exist in standard English.', '"comply for" does not exist — "for" is not the preposition used with "comply".', 'Correct. "comply WITH" is fixed.', '"comply about" does not exist.']
      },
      {
        q: 'The marketing team is responsible _____ brand communications.',
        opts: ['of', 'for', 'about', 'with'],
        correct: 1,
        exp: '"responsible FOR" is the fixed pattern. "Responsible of" is a direct translation trap from French.',
        optExps: ['Common French trap. English uses "FOR", not "of".', 'Correct. "responsible FOR" is always "for".', '"responsible about" does not exist.', '"responsible with" does not exist.']
      },
      {
        q: 'The new policy resulted _____ a significant cost reduction.',
        opts: ['to', 'into', 'in', 'from'],
        correct: 2,
        exp: '"result IN" is the fixed pattern — the outcome is introduced by "in".',
        optExps: ['"result to" is incorrect.', '"result into" is not standard usage.', 'Correct. "result IN" = the outcome is "in" something.', '"result from" means the opposite — the cause, not the effect.']
      }
    ],
    memorySummary: [
      'Prepositions are FIXED — never translate from French.',
      'Top 5 traps: responsible FOR (not of), interested IN (not to), comply WITH, result IN, apply FOR.',
      'Learn whole phrases: "She is responsible for the team" — not just "responsible + for".'
    ],
    memorySummaryFr: [
      'Les prépositions sont FIXES — ne jamais traduire du français.',
      'Les 5 pièges: responsible FOR (pas of), interested IN (pas to), comply WITH, result IN, apply FOR.',
      'Apprenez des phrases entières, pas des prépositions isolées.'
    ],
    nextLessonIds: ['conjunction', 'word_form']
  },

  // ──────────────────────────────────────────────────────────────────────────

  {
    id: 'conjunction',
    title: 'Conjunctions & Connectors: Despite, Although, However',
    subtitle: 'The most tested contrast structures in Part 5 and Part 6',
    category: 'grammar',
    difficulty: 'intermediate',
    estimatedMinutes: 12,
    icon: '🔀',
    objective: 'Choose the correct connector by recognizing what grammatical structure follows it',
    whyItMatters: 'Connector questions appear in both Part 5 and Part 6. The "despite vs although" trap catches thousands of TOEIC takers every session. Master this distinction and gain 20–40 reliable points.',
    whyItMattersFr: "Les connecteurs apparaissent dans les Parties 5 et 6. Le piège 'despite vs although' piège des milliers de candidats à chaque session. Maîtrisez cette distinction et gagnez 20–40 points fiables.",
    xpReward: 55,
    linkedCategory: 'conjunction',
    linkedGapFill: true,
    sections: [
      {
        type: 'rule',
        title: 'The Core Rule: What Follows the Connector?',
        content: 'Every connector in English requires a specific grammatical structure after it. The key question is not "what does this connector mean?" but "what comes after it: a noun phrase, a clause, or a new sentence?"\n\nTHREE groups to master:\n1. DESPITE / IN SPITE OF → followed by noun phrase or gerund (no subject+verb)\n2. ALTHOUGH / EVEN THOUGH / THOUGH → followed by full clause (subject + verb)\n3. HOWEVER / NEVERTHELESS / NONETHELESS → transition word between two complete sentences',
        contentFr: "Chaque connecteur en anglais nécessite une structure grammaticale spécifique après lui. La question clé: qu'est-ce qui vient après — un groupe nominal, une proposition ou une nouvelle phrase?\n\n1. DESPITE / IN SPITE OF → suivi d'un groupe nominal ou gérondif (pas de sujet+verbe)\n2. ALTHOUGH / EVEN THOUGH / THOUGH → suivi d'une proposition complète (sujet + verbe)\n3. HOWEVER / NEVERTHELESS → mot de transition entre deux phrases complètes"
      },
      {
        type: 'examples',
        title: 'Contrast Connectors: Correct vs Incorrect',
        content: 'These examples show exactly what each connector requires after it.',
        examples: [
          { en: 'Despite the heavy rain, the event continued.', fr: 'Malgré la forte pluie, l\'événement a continué.', isCorrect: true, explanation: '"Despite" + noun phrase ("the heavy rain"). No verb after despite.' },
          { en: 'Despite it rained heavily, the event continued.', fr: '', isCorrect: false, explanation: '"Despite" cannot be followed by a full clause (it rained). This is the #1 TOEIC trap.' },
          { en: 'Despite experiencing delays, the team delivered on time.', fr: 'Malgré des retards, l\'équipe a livré dans les délais.', isCorrect: true, explanation: '"Despite" + gerund ("experiencing delays"). Gerund = verb-ing as noun.' },
          { en: 'Although the weather was poor, the event continued.', fr: 'Bien que le temps fût mauvais, l\'événement a continué.', isCorrect: true, explanation: '"Although" + full clause ("the weather was poor"). Always needs subject + verb.' },
          { en: 'Although the heavy rain, the event continued.', fr: '', isCorrect: false, explanation: '"Although" cannot be followed by a bare noun phrase. Need a full clause.' },
          { en: 'The weather was poor. However, the event continued.', fr: 'Le temps était mauvais. Cependant, l\'événement a continué.', isCorrect: true, explanation: '"However" connects two complete sentences. Note: punctuation matters — it must follow a period or semicolon.' },
          { en: 'The weather was poor, however the event continued.', fr: '', isCorrect: false, explanation: 'Incorrect punctuation with "however". Need a semicolon or period before "however".' },
        ]
      },
      {
        type: 'comparison',
        title: 'Cause & Reason Connectors',
        content: 'The same noun/clause distinction applies to cause connectors:\n\n• BECAUSE + clause: "She succeeded because she practiced every day."\n• BECAUSE OF / DUE TO + noun/gerund: "She succeeded because of her dedication." / "due to practicing daily"\n\n• THEREFORE / AS A RESULT / CONSEQUENTLY → transition between two sentences (like "however")\n• SO + clause: "She practiced, so she succeeded."',
        contentFr: "La même distinction nom/proposition s'applique aux connecteurs de cause:\n• BECAUSE + proposition: 'Elle a réussi parce qu'elle s'entraînait.'\n• BECAUSE OF / DUE TO + nom/gérondif: 'Grâce à son dévouement.'\n• THEREFORE / AS A RESULT → transition entre deux phrases."
      },
      {
        type: 'trap',
        title: 'The 4 Most Dangerous Connector Traps',
        content: '1) "Despite it rained..." ✗ — Despite needs a NOUN, not a clause. Fix: "Despite the rain..." or "Although it rained..."\n\n2) "However the manager..." ✗ — However needs a period/semicolon before it. Fix: "... . However, the manager..."\n\n3) "Because of she worked hard..." ✗ — Because of needs a NOUN. Fix: "Because of her hard work..." or "Because she worked hard..."\n\n4) "In spite of he was tired..." ✗ — In spite of = despite. Same rule: needs a noun. Fix: "In spite of his fatigue..."',
        contentFr: "1) 'Despite it rained' ✗ → Despite + NOM. 'Despite the rain...'\n2) 'However the manager' ✗ → Besoin d'un point ou point-virgule avant.\n3) 'Because of she worked' ✗ → Because of + NOM. 'Because of her hard work.'\n4) 'In spite of he was tired' ✗ → In spite of + NOM."
      },
      {
        type: 'memory_tip',
        title: 'The 3-Second Test',
        content: 'When you see a contrast connector question, ask ONE question immediately:\n\n"What comes after the blank: a NOUN or a SUBJECT+VERB?"\n\n• NOUN after blank → Despite / In spite of / Due to / Because of\n• SUBJECT+VERB after blank → Although / Even though / Because / Since / When\n• FULL SENTENCE before and after → However / Therefore / As a result / Consequently\n\nThis one question solves 95% of connector questions in under 5 seconds.',
        contentFr: "Quand vous voyez un connecteur, posez UNE question: 'Qu'est-ce qui vient après le blanc — un NOM ou un SUJET+VERBE?'\n• NOM → Despite / In spite of / Due to\n• SUJET+VERBE → Although / Even though / Because\n• PHRASE COMPLÈTE → However / Therefore / Consequently"
      },
      {
        type: 'toeic_tip',
        title: 'Part 6 Connector Strategy',
        content: 'In Part 6 (text completion), connectors are tested at the sentence level. Read the PREVIOUS sentence and the NEXT sentence to understand the logical relationship (contrast? cause? addition?). Then choose the connector that: (1) expresses that relationship AND (2) takes the correct grammatical structure. Meaning + grammar = correct answer.'
      }
    ],
    miniQuiz: [
      {
        q: '_____ the budget cuts, the department maintained its performance targets.',
        opts: ['Although', 'Despite', 'However', 'Because'],
        correct: 1,
        exp: '"Despite" is followed by the noun phrase "the budget cuts". "Although" would need a full clause.',
        optExps: ['"Although" needs a full clause: "Although the budget was cut..." — "the budget cuts" is a noun phrase.', 'Correct. "Despite" + noun phrase = "despite the budget cuts".', '"However" connects two complete sentences — cannot start a sentence this way without restructuring.', '"Because" indicates reason/cause, not contrast.']
      },
      {
        q: 'The project was behind schedule. _____, the team delivered before the deadline.',
        opts: ['Despite', 'Although', 'However', 'Due to'],
        correct: 2,
        exp: '"However" connects two complete sentences and expresses contrast. It follows a period.',
        optExps: ['"Despite" needs a noun phrase immediately after it — not a full previous sentence.', '"Although" must come BEFORE the clause it introduces, not between two sentences.', 'Correct. "However" = transition word between two complete sentences expressing contrast.', '"Due to" needs a noun phrase after it — not used to connect two independent sentences.']
      },
      {
        q: 'She was promoted _____ her outstanding results this year.',
        opts: ['although', 'despite', 'because of', 'however'],
        correct: 2,
        exp: '"because of" introduces the reason using a noun phrase "her outstanding results".',
        optExps: ['"although" expresses contrast — contradicts the meaning (she was promoted BECAUSE of results).', '"despite" also expresses contrast — wrong meaning here.', 'Correct. "because of" + noun phrase = the reason for the promotion.', '"however" is a transition between sentences — cannot be used inside a single sentence this way.']
      }
    ],
    memorySummary: [
      'Despite / In spite of / Due to / Because of → always followed by a NOUN or gerund.',
      'Although / Even though / Because / Since → always followed by a SUBJECT + VERB clause.',
      'However / Therefore / As a result → transition words between two complete sentences.'
    ],
    memorySummaryFr: [
      'Despite / In spite of / Due to / Because of → toujours suivi d\'un NOM ou gérondif.',
      'Although / Even though / Because / Since → toujours suivi d\'un SUJET + VERBE.',
      'However / Therefore / As a result → mots de transition entre deux phrases complètes.'
    ],
    nextLessonIds: ['trap_despite', 'verb']
  },

  // ──────────────────────────────────────────────────────────────────────────

  {
    id: 'verb',
    title: 'Verb Tenses in TOEIC: The 5 You Actually Need',
    subtitle: 'Stop wasting time on tenses TOEIC never tests',
    category: 'grammar',
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    icon: '⏱',
    objective: 'Choose the correct verb tense based on time markers and context clues in business sentences',
    whyItMatters: 'TOEIC only tests 5 tenses repeatedly. The secret is not knowing all English tenses — it\'s recognizing the 8 time markers that signal which tense to use.',
    xpReward: 45,
    linkedCategory: 'verb',
    linkedGapFill: true,
    sections: [
      {
        type: 'rule',
        title: 'The 5 TOEIC Tenses and Their Signals',
        content: 'TOEIC tests: Simple Present | Simple Past | Present Perfect | Future (will/going to) | Present Continuous (for scheduled events). Each has specific time marker signals.',
        examples: [
          { en: 'Simple Present → "usually", "every", "generally", "regularly", "always"', fr: 'Présent simple → "d\'habitude", "toujours", "chaque"', isCorrect: true, explanation: 'E.g.: "The company usually holds its AGM in March."' },
          { en: 'Simple Past → "yesterday", "last week/month/year", "in [past year]", "ago"', fr: 'Passé simple → "hier", "la semaine dernière", "il y a"', isCorrect: true, explanation: 'E.g.: "The merger was completed last quarter."' },
          { en: 'Present Perfect → "since", "for", "already", "yet", "recently", "just", "ever"', fr: 'Present perfect → "depuis", "déjà", "récemment", "encore"', isCorrect: true, explanation: 'E.g.: "The team has already submitted the report."' },
          { en: 'Future → "next week/month", "tomorrow", "soon", "by [future date]"', fr: 'Futur → "la semaine prochaine", "bientôt", "d\'ici [date]"', isCorrect: true, explanation: 'E.g.: "The new CEO will announce the strategy next Monday."' },
          { en: 'Present Continuous (scheduled) → "this week", scheduled appointments, diary events', fr: 'Présent continu (événements programmés) → "cette semaine"', isCorrect: true, explanation: 'E.g.: "The board is meeting on Thursday." (scheduled future)' },
        ]
      },
      {
        type: 'trap',
        title: 'The Since vs For Trap (Present Perfect)',
        content: 'SINCE = point in time: "since 2019", "since January", "since the merger"\nFOR = duration: "for three years", "for a long time", "for six months"\n\nBoth are used with Present Perfect:\n"She has worked here SINCE 2020." ✓\n"She has worked here FOR five years." ✓\n"She has worked here SINCE five years." ✗ (WRONG — "five years" is a duration, not a point)\n\nThis trap is so common it has its own lesson: see "Since vs For".',
        contentFr: "SINCE = point dans le temps: 'since 2019', 'since January'\nFOR = durée: 'for three years', 'for a long time'\nLes deux s'utilisent avec le Present Perfect.\n'She has worked here SINCE 2020.' ✓\n'She has worked here FOR five years.' ✓\n'She has worked here SINCE five years.' ✗ (FAUX)"
      },
      {
        type: 'memory_tip',
        title: 'The Time Marker Scan',
        content: 'For every tense question: SCAN THE SENTENCE FIRST for time markers before looking at the options. Time markers tell you the answer before you even read the options. If you see "since 2019" → present perfect. If you see "last year" → simple past. If you see "next month" → future. This scan takes 3 seconds and eliminates 3 wrong options immediately.'
      }
    ],
    miniQuiz: [
      {
        q: 'The company _____ its new headquarters since last year.',
        opts: ['built', 'has been building', 'builds', 'will build'],
        correct: 1,
        exp: '"since last year" signals Present Perfect. The continuous form (has been building) emphasizes the ongoing action since that point.',
        optExps: ['"built" = simple past — contradicts "since" which signals an ongoing present perfect.', 'Correct. Present Perfect Continuous with "since" = action that started in the past and continues now.', '"builds" = simple present — no time marker supports this.', '"will build" = future — contradicts "since last year" which refers to the past.']
      },
      {
        q: 'The financial report _____ already _____ to the board this morning.',
        opts: ['was / presented', 'has / been presented', 'is / presenting', 'will / be presented'],
        correct: 1,
        exp: '"already" is a Present Perfect marker. "has been presented" = Present Perfect Passive.',
        optExps: ['"was presented" = simple past, but "already" typically appears with present perfect in formal English.', 'Correct. "has already been presented" = Present Perfect with "already".', '"is presenting" = present continuous — doesn\'t fit "already" with a completed event.', '"will be presented" = future — contradicts "already" and "this morning".']
      },
      {
        q: 'Mr. Kim _____ the Tokyo office on a regular basis.',
        opts: ['visits', 'visited', 'has visited', 'is visiting'],
        correct: 0,
        exp: '"on a regular basis" signals a habitual action → Simple Present.',
        optExps: ['Correct. Simple Present for regular/habitual actions: "visits on a regular basis".', '"visited" = simple past — contradicts "on a regular basis" (present habit).', '"has visited" = present perfect — used for past-to-now, not regular habits.', '"is visiting" = currently in progress — contradicts "on a regular basis".']
      }
    ],
    memorySummary: [
      'Scan for time markers before reading options: "since/already/recently" = perfect, "last year/ago" = past, "next month/soon" = future.',
      'Since = point in time. For = duration. Both use Present Perfect.',
      'Present Continuous can describe SCHEDULED future events: "The board is meeting on Thursday."'
    ],
    memorySummaryFr: [
      'Repérez les marqueurs temporels: "since/already/recently" = perfect, "last year/ago" = passé, "next month" = futur.',
      'Since = point dans le temps. For = durée. Les deux utilisent le Present Perfect.',
      'Le Présent Continu peut décrire des événements futurs programmés: "The board is meeting Thursday."'
    ],
    nextLessonIds: ['passive', 'trap_since_for']
  },

  // ──────────────────────────────────────────────────────────────────────────

  {
    id: 'passive',
    title: 'The Passive Voice: Structure, Usage & TOEIC Patterns',
    subtitle: 'The most common verb form in TOEIC business texts',
    category: 'grammar',
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    icon: '🔄',
    objective: 'Recognize passive voice patterns and choose the correct form in business contexts',
    whyItMatters: 'Business English uses passive voice far more than everyday English. TOEIC business texts are full of passive constructions. Understanding them is essential for both grammar questions and reading comprehension.',
    xpReward: 40,
    linkedCategory: 'passive',
    sections: [
      {
        type: 'rule',
        title: 'Passive Structure: be + past participle',
        content: 'The passive voice is formed with: be (in the correct tense) + past participle.\n\nFormula: subject + be + past participle (+ by agent — optional)\n\nKey tense forms:\n• Simple Present: "Decisions ARE MADE by the board."\n• Simple Past: "The report WAS SUBMITTED last week."\n• Present Perfect: "The contract HAS BEEN SIGNED."\n• Future: "The results WILL BE ANNOUNCED tomorrow."\n• Modal: "All applications MUST BE RECEIVED by Friday."',
        contentFr: "La voix passive se forme avec: be (au bon temps) + participe passé.\n\nFormule: sujet + be + participe passé (+ by agent — optionnel)\n\nFormes clés:\n• Présent simple: 'Decisions ARE MADE by the board.'\n• Passé simple: 'The report WAS SUBMITTED.'\n• Present Perfect: 'The contract HAS BEEN SIGNED.'\n• Futur: 'The results WILL BE ANNOUNCED.'\n• Modal: 'All applications MUST BE RECEIVED by Friday.'"
      },
      {
        type: 'examples',
        title: 'TOEIC Business Passive Patterns',
        content: 'These constructions appear constantly in TOEIC texts and questions.',
        examples: [
          { en: 'Employees are required to submit monthly reports.', fr: 'Les employés sont tenus de soumettre des rapports mensuels.', isCorrect: true, explanation: '"are required to" = passive + infinitive. Very common in TOEIC policies.' },
          { en: 'The new policy was implemented in January.', fr: 'La nouvelle politique a été mise en œuvre en janvier.', isCorrect: true, explanation: 'Simple past passive. Common in business texts describing past changes.' },
          { en: 'Applications will be reviewed within two weeks.', fr: 'Les candidatures seront examinées dans un délai de deux semaines.', isCorrect: true, explanation: 'Future passive. Common in hiring, procurement, approval processes.' },
          { en: 'All invoices must be approved by the finance department.', fr: 'Toutes les factures doivent être approuvées par le service financier.', isCorrect: true, explanation: 'Modal passive. Extremely common in TOEIC policy and procedural texts.' },
          { en: 'The meeting has been rescheduled to next Thursday.', fr: 'La réunion a été reportée à jeudi prochain.', isCorrect: true, explanation: 'Present Perfect passive. Common for announcements of changes.' },
        ]
      },
      {
        type: 'trap',
        title: 'The 3 Most Common Passive Errors',
        content: '1) Missing "be": "The report submitted last week" ✗ → "The report WAS submitted last week" ✓\n\n2) Wrong tense of "be": "The contract is signed last year" ✗ → "The contract WAS signed last year" ✓ (past needed, not present)\n\n3) Active vs Passive confusion:\n"The results announced" ✗ → "The results WERE announced" ✓\n(results cannot announce themselves — passive is required here)',
        contentFr: "1) 'be' manquant: 'The report submitted' ✗ → 'was submitted' ✓\n2) Mauvais temps de 'be': 'is signed last year' ✗ → 'was signed' ✓\n3) 'The results announced' ✗ → 'The results WERE announced' ✓ (les résultats ne s'annoncent pas)"
      },
      {
        type: 'memory_tip',
        title: 'When to Use Passive in Business English',
        content: 'Use passive when:\n1. The AGENT (who did it) is unknown or unimportant: "The shipment was delayed."\n2. The PROCESS or OUTCOME is more important than the actor: "All forms must be completed."\n3. In FORMAL writing (policies, procedures, reports): "Budgets are reviewed annually."\n\nThis is why TOEIC business texts are full of passive — it is the standard tone of professional communication.'
      }
    ],
    miniQuiz: [
      {
        q: 'All expense reports must _____ to the finance team by the 15th of each month.',
        opts: ['submit', 'be submitting', 'be submitted', 'have submitted'],
        correct: 2,
        exp: '"must be submitted" = modal passive. The subject (expense reports) receives the action of submitting.',
        optExps: ['"submit" is active — the subject would be doing the submitting, but expense reports don\'t submit themselves.', '"be submitting" = modal + present continuous — not the standard passive form.', 'Correct. "must be submitted" = modal passive (must + be + past participle).', '"have submitted" = active perfect — expense reports cannot submit something.']
      },
      {
        q: 'The annual budget _____ by the board of directors last Tuesday.',
        opts: ['approves', 'was approved', 'has been approved', 'approved'],
        correct: 1,
        exp: '"last Tuesday" signals Simple Past. Passive needed because "the budget" receives the approval.',
        optExps: ['"approves" = simple present active — wrong tense and voice.', 'Correct. Simple Past Passive + "last Tuesday" time marker.', '"has been approved" = Present Perfect — contradicts "last Tuesday" which signals simple past.', '"approved" = simple past active — the budget cannot approve itself; passive is needed.']
      },
      {
        q: 'Employees _____ to complete the online training before the end of the month.',
        opts: ['require', 'are required', 'will require', 'have required'],
        correct: 1,
        exp: '"are required to" = passive construction. Employees are the recipients of the requirement.',
        optExps: ['"require" = active — employees cannot require something to themselves in this context.', 'Correct. "are required to do something" = passive — standard in TOEIC policy texts.', '"will require" = future active — wrong voice.', '"have required" = present perfect active — wrong voice.']
      }
    ],
    memorySummary: [
      'Passive formula: subject + be (correct tense) + past participle.',
      'Modal passive: must/should/will + be + past participle (very common in TOEIC policies).',
      'When the subject RECEIVES the action → use passive. When the subject PERFORMS the action → use active.'
    ],
    nextLessonIds: ['gerund_infinitive', 'verb']
  },

  // ──────────────────────────────────────────────────────────────────────────

  {
    id: 'gerund_infinitive',
    title: 'Gerund vs Infinitive: The TOEIC Decision Tree',
    subtitle: 'Verb-ing or to-verb? — Master the patterns TOEIC loves',
    category: 'grammar',
    difficulty: 'advanced',
    estimatedMinutes: 12,
    icon: '🌿',
    objective: 'Choose between gerund and infinitive after specific verbs, prepositions, and phrases',
    whyItMatters: 'Gerund/infinitive errors are among the most costly grammar mistakes in TOEIC because they signal fluency. Getting them right shows mastery. Getting them wrong loses points that are hard to recover.',
    xpReward: 60,
    linkedCategory: 'gerund_infinitive',
    sections: [
      {
        type: 'rule',
        title: 'The 3-Group System',
        content: 'Group 1 — Verbs followed ONLY by gerund (verb+ing):\nenjoy, avoid, consider, recommend, suggest, finish, mind, keep, risk, delay, deny, miss, practice\n"She enjoys reading business reports."\n\nGroup 2 — Verbs followed ONLY by infinitive (to+verb):\nwant, plan, decide, agree, refuse, expect, offer, promise, hope, need, manage, fail, tend\n"The company plans to expand overseas."\n\nGroup 3 — Verbs followed by BOTH (with different meanings):\nremember, forget, stop, try, regret\n"stop smoking" ≠ "stop to smoke" (different meanings!)',
        contentFr: "Groupe 1 — Verbes suivis uniquement du gérondif (verb+ing):\nenjoy, avoid, consider, recommend, suggest, finish, mind, keep, risk, delay\n\nGroupe 2 — Verbes suivis uniquement de l'infinitif (to+verb):\nwant, plan, decide, agree, refuse, expect, offer, promise, hope, need\n\nGroupe 3 — Verbes suivis des DEUX (sens différents):\nremember, forget, stop, try, regret"
      },
      {
        type: 'examples',
        title: 'Group 3 Meaning Differences — Critical',
        content: 'These meaning pairs are a favourite TOEIC trap.',
        examples: [
          { en: 'He stopped smoking. (He no longer smokes.)', fr: 'Il a arrêté de fumer. (Il ne fume plus.)', isCorrect: true, explanation: '"stop + gerund" = ending the activity permanently.' },
          { en: 'He stopped to smoke. (He paused in order to have a cigarette.)', fr: 'Il s\'est arrêté pour fumer. (Il a fait une pause pour allumer une cigarette.)', isCorrect: true, explanation: '"stop + infinitive" = pausing an activity in order to do something else.' },
          { en: 'I remember sending the email. (I have a memory of doing it.)', fr: 'Je me souviens avoir envoyé l\'email. (Je me souviens de l\'avoir fait.)', isCorrect: true, explanation: '"remember + gerund" = a memory of a past completed action.' },
          { en: 'Remember to send the email. (Don\'t forget to do it.)', fr: 'N\'oublie pas d\'envoyer l\'email.', isCorrect: true, explanation: '"remember + infinitive" = a reminder about a future action.' },
        ]
      },
      {
        type: 'rule',
        title: 'Prepositions Always Take Gerunds',
        content: 'This is a simple but powerful rule: a verb that follows a PREPOSITION must always be in GERUND form (verb+ing).\n\n"She is interested IN learning new skills." ✓\n"She is interested IN to learn new skills." ✗\n"By working hard, he succeeded." ✓\n"By to work hard, he succeeded." ✗\n"In addition to training staff, she manages budgets." ✓\n\nRemember: preposition + verb → always gerund.',
        contentFr: "Un verbe qui suit une PRÉPOSITION doit toujours être au GÉRONDIF (verb+ing).\n'She is interested IN learning.' ✓\n'She is interested IN to learn.' ✗\n'By working hard...' ✓\n'By to work hard...' ✗"
      },
      {
        type: 'memory_tip',
        title: 'The Quick Decision Chart',
        content: 'GERUND (verb+ing) after:\n→ "enjoy, avoid, consider, finish, recommend, suggest, keep, risk"\n→ Any PREPOSITION (in, on, by, about, after, before, for, without...)\n→ Phrases: "worth doing", "can\'t help doing", "be used to doing"\n\nINFINITIVE (to+verb) after:\n→ "want, plan, decide, agree, refuse, expect, hope, need, tend, manage"\n→ Adjectives: "happy to, easy to, difficult to, important to"\n→ "in order to" (purpose)'
      }
    ],
    miniQuiz: [
      {
        q: 'The manager suggested _____ the meeting until all data is available.',
        opts: ['to postpone', 'postponing', 'postpone', 'being postponed'],
        correct: 1,
        exp: '"suggest" always takes gerund. "suggested postponing" = correct.',
        optExps: ['"suggest to postpone" is incorrect — suggest takes gerund, not infinitive.', 'Correct. "suggest + gerund" is a fixed pattern.', '"suggest postpone" is missing the gerund ending.', '"suggest being postponed" changes the meaning completely.']
      },
      {
        q: 'The company is considering _____ its headquarters to a larger facility.',
        opts: ['to move', 'move', 'moving', 'to be moved'],
        correct: 2,
        exp: '"consider" always takes gerund. "considering moving" = correct.',
        optExps: ['"consider to move" is incorrect.', '"consider move" — missing gerund ending.', 'Correct. "consider + gerund".', '"consider to be moved" — passive infinitive, wrong form.']
      },
      {
        q: 'Without _____ the contract, we cannot proceed with the project.',
        opts: ['signing', 'to sign', 'sign', 'signed'],
        correct: 0,
        exp: 'After a preposition ("without"), always use gerund: "without signing".',
        optExps: ['Correct. Preposition + gerund: "without signing" is fixed.', '"without to sign" is impossible — prepositions never take infinitives.', '"without sign" — missing gerund ending.', '"without signed" — past participle after preposition is incorrect here.']
      }
    ],
    memorySummary: [
      'enjoy/avoid/consider/suggest/finish/recommend/keep → always gerund.',
      'want/plan/decide/agree/hope/refuse/manage/tend → always infinitive.',
      'Preposition + verb → ALWAYS gerund. (interested IN learning, good AT managing)'
    ],
    nextLessonIds: ['relative_clause', 'trap_confusables']
  },

  // ──────────────────────────────────────────────────────────────────────────

  {
    id: 'relative_clause',
    title: 'Relative Clauses: Who, Which, That, Whose, Where',
    subtitle: 'Used in both Part 5 grammar and Part 7 reading comprehension',
    category: 'grammar',
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    icon: '🔍',
    objective: 'Choose the correct relative pronoun (who/which/that/whose/where) in business sentences',
    whyItMatters: 'Relative clauses are tested directly in Part 5, and understanding them improves Part 7 reading speed — complex sentences in business passages almost always use relative clauses.',
    xpReward: 40,
    linkedCategory: 'relative_clause',
    sections: [
      {
        type: 'rule',
        title: 'Which Relative Pronoun to Choose',
        content: 'WHO → refers to PEOPLE: "The manager who led the project has retired."\nWHICH → refers to THINGS or ANIMALS: "The report which was submitted last week is being reviewed."\nTHAT → refers to PEOPLE or THINGS (informal): "The policy that was introduced last year is effective."\nWHOSE → possession for PEOPLE or THINGS: "The employee whose report was late was reprimanded."\nWHERE → refers to PLACES: "The office where the meeting will be held is on the 5th floor."',
        contentFr: "WHO → personnes: 'The manager who led the project...'\nWHICH → choses/animaux: 'The report which was submitted...'\nTHAT → personnes ou choses (informel): 'The policy that was introduced...'\nWHOSE → possession: 'The employee whose report was late...'\nWHERE → lieux: 'The office where the meeting is held...'"
      },
      {
        type: 'trap',
        title: 'The WHO vs WHICH vs THAT Confusion',
        content: '"That" can replace "who" for people in informal contexts, but "which" can NEVER replace "who" for people:\n\n"The employee who handled the complaint" ✓\n"The employee that handled the complaint" ✓ (slightly informal)\n"The employee which handled the complaint" ✗ (NEVER use which for people)\n\nIn formal business writing (TOEIC), prefer "who" for people and "which" for things.',
        contentFr: "'That' peut remplacer 'who' pour les personnes (informel), mais 'which' ne peut JAMAIS remplacer 'who':\n'The employee who handled it' ✓\n'The employee that handled it' ✓ (légèrement informel)\n'The employee which handled it' ✗ (jamais 'which' pour les personnes)"
      },
      {
        type: 'examples',
        title: 'TOEIC Business Relative Clause Examples',
        content: 'Study these real business-context examples.',
        examples: [
          { en: 'The consultant who was hired last month has already improved our processes.', fr: 'Le consultant qui a été embauché le mois dernier a déjà amélioré nos processus.', isCorrect: true, explanation: '"who" for person (the consultant).' },
          { en: 'The proposal which was submitted on Monday has been accepted.', fr: 'La proposition qui a été soumise lundi a été acceptée.', isCorrect: true, explanation: '"which" for thing (the proposal).' },
          { en: 'The office where the training will take place has been renovated.', fr: 'Le bureau où la formation aura lieu a été rénové.', isCorrect: true, explanation: '"where" for place (the office).' },
          { en: 'Employees whose performance exceeds targets receive a bonus.', fr: 'Les employés dont les performances dépassent les objectifs reçoivent un bonus.', isCorrect: true, explanation: '"whose" = possession — performance belongs to the employees.' },
        ]
      }
    ],
    miniQuiz: [
      {
        q: 'The director _____ presentation impressed the investors has been promoted.',
        opts: ['who', 'which', 'that', 'whose'],
        correct: 3,
        exp: '"whose" shows possession — the presentation belongs to the director.',
        optExps: ['"who" would require "who gave an impressive presentation" — different structure.', '"which" is for things, not people.', '"that" could work for the person but not for showing possession.', 'Correct. "whose presentation" = the director\'s presentation.']
      },
      {
        q: 'The factory _____ the new products are manufactured has capacity for 500 workers.',
        opts: ['which', 'who', 'whose', 'where'],
        correct: 3,
        exp: '"where" refers to the place (the factory) where something happens.',
        optExps: ['"which" refers to things but needs a different sentence structure: "which manufactures..."', '"who" is for people, not places.', '"whose" shows possession — doesn\'t fit here (the factory doesn\'t own the products in this clause).', 'Correct. "where" refers to the factory as a place.']
      }
    ],
    memorySummary: [
      'WHO = people | WHICH = things | THAT = people or things | WHOSE = possession | WHERE = places.',
      'Never use "which" to refer to people.',
      'In formal TOEIC business writing: prefer WHO for people, WHICH for things.'
    ],
    nextLessonIds: ['article', 'trap_confusables']
  },

  // ──────────────────────────────────────────────────────────────────────────

  {
    id: 'article',
    title: 'Articles: A, An, The — The Rules That Never Change',
    subtitle: 'The silent killer of Part 5 scores for French speakers',
    category: 'grammar',
    difficulty: 'beginner',
    estimatedMinutes: 8,
    icon: '📰',
    objective: 'Use definite (the) and indefinite (a/an) articles correctly in professional contexts',
    whyItMatters: 'French has no equivalent of "the" vs "a/an" as a grammar distinction. This makes articles an invisible trap for French speakers — easy to overlook, costly to miss.',
    xpReward: 35,
    linkedCategory: 'article',
    sections: [
      {
        type: 'rule',
        title: 'A / An = Indefinite (new information) | The = Definite (known information)',
        content: 'A / AN: Used when introducing something for the first time, or when it is one of many.\n"She submitted a report." (any report, first mention)\n"He is an experienced manager." (one of many experienced managers)\n\nTHE: Used when both speaker and listener know WHICH one is meant.\n"Please review the report I sent yesterday." (specific, known report)\n"The CEO announced the new strategy." (specific people and thing)\n\nNO ARTICLE: Used with:\n• Plural nouns in general: "Managers must be decisive." (all managers in general)\n• Uncountable nouns in general: "Business requires patience."\n• Names of companies, people, countries (mostly): "Apple is expanding."',
        contentFr: "A / AN: Pour introduire quelque chose pour la première fois, ou quand c'est un parmi plusieurs.\n'She submitted A report.' (n'importe quel rapport)\n\nTHE: Quand les deux interlocuteurs savent DE QUOI il s'agit.\n'Please review THE report I sent.' (rapport spécifique)\n\nPAS D'ARTICLE: Pour les noms pluriels généraux, les noms indénombrables généraux."
      },
      {
        type: 'trap',
        title: 'French Speaker Article Traps',
        content: '"The" is NOT always used where French uses "le/la/les".\n\nFrench: "Les managers doivent être décisifs." → English: "Managers must be decisive." (no article for general statements)\nFrench: "J\'aime le café." → English: "I like coffee." (no article for uncountable nouns in general)\nFrench: "Le directeur est arrivé." → English: "The manager arrived." ✓ (specific person)\nFrench: "Il est directeur." → English: "He is A manager." (not "the manager" — job titles after "be" use "a")',
        contentFr: "'The' ne correspond pas toujours à 'le/la/les' en français.\n'Les managers doivent être décisifs.' → 'Managers must be decisive.' (pas d'article)\n'J'aime le café.' → 'I like coffee.' (pas d'article)\n'Il est directeur.' → 'He is A manager.' (pas 'the manager')"
      }
    ],
    miniQuiz: [
      {
        q: 'She has been _____ CEO of the company for three years.',
        opts: ['a', 'an', 'the', '(no article)'],
        correct: 0,
        exp: 'After "been", a job title/role uses "a/an". "She has been A CEO" — she is one of many possible CEOs.',
        optExps: ['Correct. Job titles after "be/been" use the indefinite article.', '"an" is used before vowel sounds — CEO starts with "C" sound, not vowel.', '"the CEO" would imply there is only one possible CEO and everyone knows which one.', 'No article is used for general plural nouns, not singular countable nouns.']
      },
      {
        q: 'Please submit _____ completed application form to the HR department.',
        opts: ['a', 'an', 'the', '(no article)'],
        correct: 2,
        exp: '"the completed application form" = a specific form being referred to — both parties know which one.',
        optExps: ['"a completed form" would imply any form — but context specifies THE form to submit.', '"an" = before vowel sounds, not applicable here.', 'Correct. "the" = specific, identifiable form the applicant knows about.', 'No article is not possible for a singular countable noun here.']
      }
    ],
    memorySummary: [
      'A/An = first mention or one of many. The = specific, known to both parties.',
      'No article for general plural nouns (Managers need...) and uncountable nouns in general (Business requires...).',
      'Job titles after "be": "She is A director." (not "the director" unless there is only one specific one).'
    ],
    nextLessonIds: ['word_form', 'preposition']
  },

  // ──────────────────────────────────────────────────────────────────────────
  // TRAP LESSONS
  // ──────────────────────────────────────────────────────────────────────────

  {
    id: 'trap_despite',
    title: 'Trap Master: Despite vs Although vs However vs In Spite Of',
    subtitle: 'The #1 tested contrast connector — do not guess',
    category: 'traps',
    difficulty: 'intermediate',
    estimatedMinutes: 8,
    icon: '⚔️',
    objective: 'Instantly distinguish between despite, although, however, and in spite of using a single structural test',
    whyItMatters: 'This is the most tested contrast connector pattern in TOEIC. It appears in Part 5, Part 6, and even Part 7. Getting it wrong once costs points; getting it right every time adds 15-25 reliable points to your score.',
    xpReward: 50,
    linkedCategory: 'conjunction',
    sections: [
      {
        type: 'comparison',
        title: 'The Four Contrast Connectors — Side by Side',
        content: 'DESPITE = noun/gerund follows\nIN SPITE OF = noun/gerund follows (identical to "despite")\nALTHOUGH / EVEN THOUGH / THOUGH = full clause (subject + verb) follows\nHOWEVER / NEVERTHELESS = connects two full sentences (needs period/semicolon before it)',
        examples: [
          { en: 'Despite the delay, the project finished on schedule.', fr: 'Malgré le retard, le projet s\'est terminé dans les délais.', isCorrect: true, explanation: 'despite + noun phrase "the delay"' },
          { en: 'In spite of receiving negative feedback, she stayed motivated.', fr: 'Malgré les retours négatifs reçus, elle est restée motivée.', isCorrect: true, explanation: 'in spite of + gerund phrase "receiving negative feedback"' },
          { en: 'Although the project was delayed, it finished on schedule.', fr: 'Bien que le projet ait pris du retard, il s\'est terminé dans les délais.', isCorrect: true, explanation: 'although + full clause "the project was delayed"' },
          { en: 'The project was delayed. However, it finished on schedule.', fr: 'Le projet a pris du retard. Cependant, il s\'est terminé dans les délais.', isCorrect: true, explanation: 'however between two complete sentences with period before' },
          { en: 'Despite the project was delayed, it finished on schedule.', fr: '', isCorrect: false, explanation: 'TRAP: despite cannot be followed by a clause with subject+verb. This is the most common error.' },
          { en: 'Although the delay, the project finished on schedule.', fr: '', isCorrect: false, explanation: 'TRAP: although cannot be followed by a bare noun phrase.' },
        ]
      },
      {
        type: 'memory_tip',
        title: 'The 1-Second Test',
        content: 'Look at what comes IMMEDIATELY after the blank:\n\n→ If next word starts a noun/noun phrase (the, this, a, his, their, its) → DESPITE / IN SPITE OF\n→ If next words are a subject+verb (it was, he said, the company...) → ALTHOUGH\n→ If the sentence before is complete → HOWEVER\n\nTest yourself: "_____ heavy traffic, she arrived on time."\nNext word = "heavy" (adjective → noun phrase) → DESPITE ✓',
        contentFr: "Regardez ce qui vient IMMÉDIATEMENT après le blanc:\n→ Article/pronom possessif (the, his, their) → DESPITE\n→ Sujet+verbe → ALTHOUGH\n→ Phrase complète avant → HOWEVER"
      }
    ],
    miniQuiz: [
      {
        q: '_____ working extra hours, the team failed to meet the deadline.',
        opts: ['Although', 'Despite', 'However', 'Because of'],
        correct: 1,
        exp: '"working extra hours" is a gerund phrase — use DESPITE. "Although" would need "Although they worked extra hours..."',
        optExps: ['"Although" needs a full clause — "Although they worked extra hours..."', 'Correct. "despite + gerund phrase".', '"However" needs a full sentence before it.', '"Because of" expresses cause — contradicts the contrast meaning here.']
      },
      {
        q: '_____ the team worked extra hours, they still failed to meet the deadline.',
        opts: ['Despite', 'In spite of', 'Although', 'However'],
        correct: 2,
        exp: '"the team worked extra hours" is a full clause (subject + verb) → ALTHOUGH.',
        optExps: ['"Despite" needs a noun or gerund — not a full clause.', '"In spite of" = same rule as despite — needs noun/gerund.', 'Correct. "Although + full clause".', '"However" connects two complete sentences — cannot begin a sentence with a clause like this.']
      }
    ],
    memorySummary: [
      'Despite / In spite of → noun or gerund ONLY. Never a subject+verb clause.',
      'Although / Even though → full clause (subject + verb) ONLY.',
      'However → between two complete sentences with period or semicolon before it.'
    ],
    memorySummaryFr: [
      'Despite / In spite of → nom ou gérondif SEULEMENT. Jamais sujet+verbe.',
      'Although / Even though → proposition complète (sujet + verbe) SEULEMENT.',
      'However → entre deux phrases complètes, avec point ou point-virgule avant.'
    ],
    nextLessonIds: ['conjunction', 'trap_since_for']
  },

  // ──────────────────────────────────────────────────────────────────────────

  {
    id: 'trap_confusables',
    title: 'Confusable Words: Effective/Efficient, Economic/Economical',
    subtitle: 'Similar-looking words with completely different meanings',
    category: 'traps',
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    icon: '🎭',
    objective: 'Distinguish between high-frequency confusable adjective pairs that TOEIC uses as traps',
    whyItMatters: 'TOEIC exam writers deliberately place confusable words as wrong options. These words look and sound similar but mean different things. Each pair learned is a guaranteed point saved.',
    xpReward: 50,
    sections: [
      {
        type: 'comparison',
        title: 'Pair 1: Effective vs Efficient',
        content: 'EFFECTIVE = produces the intended RESULT. Focus: does it work?\n"The new marketing strategy was highly effective." (It achieved the goal.)\n\nEFFICIENT = uses minimum resources (time, money, energy) to produce a result. Focus: how economically does it work?\n"The new system is more efficient — it saves 30% processing time."\n\nMEMORY TIP: Effective = result achieved (success). Efficient = lean, fast, minimal waste.\nFrench: "efficace" (effective) vs "efficient/efficace dans l\'usage de ressources" (efficient)',
        contentFr: "EFFECTIVE = produit le résultat voulu. La stratégie EST-ELLE EFFICACE?\n'The new strategy was highly effective.' (Elle a atteint l'objectif.)\n\nEFFICIENT = utilise le minimum de ressources. Comment économiquement fonctionne-t-il?\n'The system is efficient — it saves 30% of processing time.'",
        examples: [
          { en: 'The new drug proved effective against the virus.', fr: 'Le nouveau médicament s\'est révélé efficace contre le virus.', isCorrect: true, explanation: 'Effective = it produced the desired result (killing the virus).' },
          { en: 'The new assembly line is highly efficient.', fr: 'La nouvelle chaîne de montage est très efficiente.', isCorrect: true, explanation: 'Efficient = it uses resources (time, labour) optimally.' },
          { en: 'The campaign was efficient. (Wrong usage)', fr: '', isCorrect: false, explanation: 'Unless you mean it used minimal resources, you probably mean "effective" — it achieved its goal.' },
        ]
      },
      {
        type: 'comparison',
        title: 'Pair 2: Economic vs Economical',
        content: 'ECONOMIC = relating to the economy or economics (as a field).\n"The country is facing an economic crisis." (crisis in the economy)\n"She has a degree in economic theory."\n\nECONOMICAL = cost-effective, not wasteful, saves money.\n"This car is very economical — it uses very little fuel."\n"We need a more economical solution to this problem."\n\nMEMORY TIP: Economic = about economics (the subject). Economical = saves money.',
        contentFr: "ECONOMIC = qui concerne l'économie (en tant que domaine).\n'The country is facing an ECONOMIC crisis.' (crise dans l'économie)\n\nECONOMICAL = peu coûteux, qui économise les ressources.\n'This solution is more ECONOMICAL.' (elle coûte moins cher)"
      },
      {
        type: 'comparison',
        title: 'Pair 3: Historic vs Historical',
        content: 'HISTORIC = important in history, a landmark event.\n"The signing of the peace treaty was a historic moment."\n\nHISTORICAL = relating to history, from the past.\n"She found several historical documents in the archives."\n"This is a historical novel set in 1850."\n\nMEMORY TIP: Historic = a BIG moment. Historical = from the past.',
        contentFr: "HISTORIC = un moment important dans l'histoire.\n'A HISTORIC agreement was signed.' (événement marquant)\n\nHISTORICAL = qui concerne le passé, lié à l'histoire.\n'She studied HISTORICAL records.' (documents du passé)"
      },
      {
        type: 'trap',
        title: 'Why These Traps Work',
        content: 'The exam places both options in the choices because they share the same root word and learners assume similar-looking words mean the same thing. The strategy to beat this trap:\n\n1. Learn each pair as a CONTRAST PAIR, not separately.\n2. For each pair, remember ONE clear distinction sentence.\n3. In the exam: read the sentence context carefully. Does the blank mean "it works" (effective) or "it saves resources" (efficient)? Does it mean "about the economy" (economic) or "saves money" (economical)?',
        contentFr: "L'examen place les deux options dans les choix car elles partagent la même racine. La stratégie:\n1. Apprenez chaque paire comme paire de CONTRASTE.\n2. Pour chaque paire, mémorisez UNE phrase de distinction.\n3. Lisez le contexte: le blanc signifie 'ça marche' (effective) ou 'ça économise' (efficient)?"
      }
    ],
    miniQuiz: [
      {
        q: 'The new software has made our billing process far more _____ — reducing processing time by 40%.',
        opts: ['effective', 'efficient', 'economic', 'economical'],
        correct: 1,
        exp: '"reducing processing time by 40%" signals resource savings → EFFICIENT.',
        optExps: ['"effective" = achieves result, but the context emphasizes resource/time savings.', 'Correct. "efficient" = saves resources, time, energy — "reducing time by 40%" confirms this.', '"economic" = relating to the economy — wrong context.', '"economical" = saves money — closer, but "efficient" is the better word for a process/time context.']
      },
      {
        q: 'The country is facing serious _____ challenges due to rising inflation.',
        opts: ['economic', 'economical', 'efficient', 'effective'],
        correct: 0,
        exp: '"challenges due to rising inflation" is about the economy → ECONOMIC (relating to economics).',
        optExps: ['Correct. "economic challenges" = challenges in/related to the economy.', '"economical challenges" is not a natural phrase — "economical" refers to personal/company cost efficiency.', '"efficient challenges" is meaningless.', '"effective challenges" is meaningless.']
      }
    ],
    memorySummary: [
      'Effective = achieves the goal (the campaign was effective). Efficient = uses minimal resources (the process is efficient).',
      'Economic = relating to the economy (economic policy). Economical = cost-saving (an economical solution).',
      'When two similar words appear in options: ask what the CONTEXT is about, not just what sounds right.'
    ],
    memorySummaryFr: [
      'Effective = atteint l\'objectif. Efficient = économise les ressources.',
      'Economic = qui concerne l\'économie. Economical = peu coûteux.',
      'Quand deux mots similaires apparaissent: posez-vous "de quoi parle le contexte?"'
    ],
    nextLessonIds: ['trap_say_tell', 'trap_since_for']
  },

  // ──────────────────────────────────────────────────────────────────────────

  {
    id: 'trap_say_tell',
    title: 'Say vs Tell vs Speak vs Talk: The Reporting Verb Trap',
    subtitle: 'Four verbs, four different grammar patterns',
    category: 'traps',
    difficulty: 'intermediate',
    estimatedMinutes: 8,
    icon: '💬',
    objective: 'Choose the correct reporting verb based on whether an indirect object (a person) is required',
    whyItMatters: 'These four verbs are used constantly in TOEIC business contexts — reporting what managers said, what decisions were made, what teams communicated. Confusing them is a common and costly mistake.',
    xpReward: 45,
    sections: [
      {
        type: 'comparison',
        title: 'SAY vs TELL — The Key Structural Difference',
        content: 'SAY = say (something) — no person required as direct object after "say"\n"She said that the meeting was postponed." ✓\n"She said the client that the meeting was postponed." ✗ (cannot say + person + that)\n\nTELL = tell + PERSON + (something) — ALWAYS needs a person object\n"She told the client that the meeting was postponed." ✓\n"She told that the meeting was postponed." ✗ (must have a person after "tell")\n\nMEMORY TIP: TELL requires a LISTENER. SAY does not.',
        contentFr: "SAY = dire (quelque chose) — pas de personne requise après 'say'\n'She SAID that the meeting was postponed.' ✓\n'She SAID the client that...' ✗ (cannot say + personne + that)\n\nTELL = TELL + PERSONNE + (quelque chose) — TOUJOURS besoin d'une personne\n'She TOLD the client that the meeting was postponed.' ✓\n'She TOLD that the meeting was postponed.' ✗ (doit avoir une personne après 'tell')",
        examples: [
          { en: 'The manager said that budgets would be reduced.', fr: 'Le manager a dit que les budgets seraient réduits.', isCorrect: true, explanation: 'say + (that) clause — no person needed.' },
          { en: 'The manager told staff that budgets would be reduced.', fr: 'Le manager a dit au personnel que les budgets seraient réduits.', isCorrect: true, explanation: 'tell + person (staff) + (that) clause.' },
          { en: 'The manager told that budgets would be reduced.', fr: '', isCorrect: false, explanation: 'TRAP: "tell" must be followed by a person. "told that..." is incorrect.' },
          { en: 'The manager said the staff that budgets would be reduced.', fr: '', isCorrect: false, explanation: 'TRAP: "say" cannot be followed by a person and then "that". Use "told" if you need the person.' },
        ]
      },
      {
        type: 'comparison',
        title: 'SPEAK vs TALK — The Register Difference',
        content: 'SPEAK = more formal, more one-directional.\n"She spoke to the board about the new strategy." (formal presentation/address)\n"Could I speak with the manager, please?" (formal request)\n"She speaks three languages."\n\nTALK = more informal, implies conversation/exchange.\n"They talked about the project over lunch." (casual conversation)\n"Let\'s talk tomorrow morning." (casual)\n\nBoth: speak/talk + TO a person | speak/talk + ABOUT a topic\n"She spoke TO the board ABOUT the strategy."',
        contentFr: "SPEAK = plus formel, souvent unidirectionnel.\n'She SPOKE to the board about the strategy.' (présentation formelle)\n\nTALK = plus informel, implique une conversation/échange.\n'They TALKED about the project over lunch.' (conversation détendue)"
      }
    ],
    miniQuiz: [
      {
        q: 'The CEO _____ the shareholders that the company had exceeded its targets.',
        opts: ['said', 'told', 'spoke', 'talked'],
        correct: 1,
        exp: '"told + person (the shareholders) + that clause" = correct pattern for TELL.',
        optExps: ['"said the shareholders that" is incorrect — say cannot take a person object directly before "that".', 'Correct. "told + person + that clause".', '"spoke the shareholders that" is not grammatically correct.', '"talked the shareholders that" is not grammatically correct.']
      },
      {
        q: 'She _____ that the report would be ready by Friday.',
        opts: ['told', 'said', 'spoke', 'talked'],
        correct: 1,
        exp: '"said that..." = correct — SAY is followed directly by "that clause" without a person.',
        optExps: ['"told that" is incorrect — TELL requires a person: "told them that".', 'Correct. "said that..." — no person required after SAY.', '"spoke that" is not standard.', '"talked that" is not standard.']
      }
    ],
    memorySummary: [
      'TELL always needs a person: "told the client that..." | SAY does not: "said that..."',
      'SPEAK = formal address. TALK = informal conversation.',
      'Quick test: Is there a person after the verb? → TELL. No person? → SAY.'
    ],
    memorySummaryFr: [
      'TELL a toujours besoin d\'une personne: "told the client that..." | SAY n\'en a pas besoin: "said that..."',
      'SPEAK = discours formel. TALK = conversation informelle.',
      'Test rapide: Y a-t-il une personne après le verbe? → TELL. Non? → SAY.'
    ],
    nextLessonIds: ['trap_rise_raise', 'trap_confusables']
  },

  // ──────────────────────────────────────────────────────────────────────────

  {
    id: 'trap_since_for',
    title: 'Since vs For | Among vs Between | Rise vs Raise',
    subtitle: 'Three high-frequency TOEIC trap pairs in one lesson',
    category: 'traps',
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    icon: '⚖️',
    objective: 'Distinguish between three confusable word pairs using a single logical rule for each',
    whyItMatters: 'Each of these pairs appears in multiple TOEIC sections. One rule per pair is all you need. Learning them together reinforces the contrast logic.',
    xpReward: 50,
    sections: [
      {
        type: 'comparison',
        title: 'Pair 1: Since vs For (with Present Perfect)',
        content: 'SINCE = a specific point in time (when something started)\n"She has worked here SINCE 2019."\n"They have been partners SINCE the merger."\n\nFOR = a duration (how long)\n"She has worked here FOR five years."\n"They have been partners FOR a decade."\n\nTEST: Can you replace the word with "starting from"? → SINCE.\nCan you replace it with "during a period of"? → FOR.\n\nCOMMON ERROR: "She has worked here SINCE five years." ✗\n"Five years" is a duration → needs FOR, not SINCE.',
        contentFr: "SINCE = point précis dans le temps (quand quelque chose a commencé)\n'She has worked here SINCE 2019.'\n\nFOR = durée (combien de temps)\n'She has worked here FOR five years.'\n\nERREUR FRÉQUENTE: 'SINCE five years' ✗ → 'FOR five years' ✓",
        examples: [
          { en: 'The company has been profitable since 2018.', fr: 'L\'entreprise est rentable depuis 2018.', isCorrect: true, explanation: '2018 = specific point in time → SINCE.' },
          { en: 'The company has been profitable for six consecutive years.', fr: 'L\'entreprise est rentable depuis six années consécutives.', isCorrect: true, explanation: '"six consecutive years" = duration → FOR.' },
          { en: 'He has managed this department since fifteen years.', fr: '', isCorrect: false, explanation: '"fifteen years" is a duration, not a point → use FOR: "for fifteen years".' },
        ]
      },
      {
        type: 'comparison',
        title: 'Pair 2: Among vs Between',
        content: 'BETWEEN = two items (or more when clearly separated/distinct)\n"The contract was signed BETWEEN the buyer and the seller."\n"The issue was resolved BETWEEN the three managers."\n\nAMONG = three or more items (part of a group, not all clearly distinguished)\n"AMONG the applicants, only two met all requirements."\n"The bonus was shared AMONG all team members."\n\nNOTE: Modern English allows "between" with 3+ items when each is considered distinctly. TOEIC keeps it simple: 2 = between, 3+ general group = among.',
        contentFr: "BETWEEN = deux éléments (ou plus quand ils sont clairement distincts)\n'Signed BETWEEN the buyer and the seller.'\n\nAMONG = trois éléments ou plus (partie d'un groupe)\n'AMONG the applicants, only two qualified.'\n'Shared AMONG all team members.'"
      },
      {
        type: 'comparison',
        title: 'Pair 3: Rise vs Raise',
        content: 'RISE (rose, risen) = INTRANSITIVE — no object. Something rises by itself.\n"Prices RISE." / "Prices ROSE last quarter." / "Costs have RISEN."\n\nRAISE (raised, raised) = TRANSITIVE — needs an object. Someone raises something.\n"The company RAISED its prices." / "They have RAISED wages."\n\nMEMORY TIP: RAISE = you DO something to something (raise = lift something). RISE = something happens by itself.\nFrench trap: "augmenter" covers both, but English distinguishes them.',
        contentFr: "RISE = INTRANSITIF — pas d'objet. Quelque chose monte tout seul.\n'Prices RISE.' / 'Prices ROSE last quarter.'\n\nRAISE = TRANSITIF — besoin d'un objet. Quelqu'un augmente quelque chose.\n'The company RAISED its prices.' / 'They RAISED wages.'\n\nMémo: RAISE = vous faites monter quelque chose. RISE = quelque chose monte seul."
      }
    ],
    miniQuiz: [
      {
        q: 'The company has operated in this market _____ the early 1990s.',
        opts: ['for', 'since', 'during', 'from'],
        correct: 1,
        exp: '"the early 1990s" is a specific point in time → SINCE.',
        optExps: ['"for" needs a duration ("for 30 years") — "the early 1990s" is a point, not a duration.', 'Correct. "since + specific point in time".', '"during" expresses "within a period" — different meaning.', '"from" can be used ("from the early 1990s") but is less common with Present Perfect.']
      },
      {
        q: 'The price of raw materials has _____ sharply due to supply chain disruptions.',
        opts: ['raised', 'risen', 'arose', 'aroused'],
        correct: 1,
        exp: 'No object after the verb → RISE (intransitive). Present Perfect = "has risen".',
        optExps: ['"raised" is transitive — needs an object: "The company raised prices." — here, prices rise by themselves.', 'Correct. "has risen" = Present Perfect of RISE (intransitive). No object.', '"arose" is Past Simple of "arise" (to come up, appear) — different word entirely.', '"aroused" = stirred emotion — wrong word entirely.']
      }
    ],
    memorySummary: [
      'SINCE = point in time. FOR = duration. Never "since five years" — use "for five years".',
      'BETWEEN = 2 distinct items. AMONG = 3+ items in a group.',
      'RISE = intransitive (prices rise by themselves). RAISE = transitive (the company raises prices).'
    ],
    memorySummaryFr: [
      'SINCE = point dans le temps. FOR = durée. Jamais "since five years" → "for five years".',
      'BETWEEN = 2 éléments distincts. AMONG = 3+ éléments dans un groupe.',
      'RISE = intransitif (les prix montent). RAISE = transitif (l\'entreprise augmente les prix).'
    ],
    nextLessonIds: ['verb', 'conjunction']
  },

  // ──────────────────────────────────────────────────────────────────────────
  // VOCABULARY LESSONS
  // ──────────────────────────────────────────────────────────────────────────

  {
    id: 'vocab_finance',
    title: 'Finance & Contracts: High-Value TOEIC Vocabulary',
    subtitle: 'The words that appear in every TOEIC financial text',
    category: 'vocabulary',
    difficulty: 'intermediate',
    estimatedMinutes: 12,
    icon: '💰',
    objective: 'Recognise and use 15 high-frequency finance and contract vocabulary items in TOEIC context',
    whyItMatters: 'Finance is the most common topic domain in TOEIC. These 15 words appear in Part 5 grammar questions, Part 6 text completions, AND Part 7 reading passages. Knowing them saves time and gains points across all sections.',
    xpReward: 45,
    sections: [
      {
        type: 'examples',
        title: '15 Must-Know Finance & Contract Words',
        content: 'Learn each word with its French translation, meaning, and TOEIC example.',
        examples: [
          { en: 'revenue (n.) — total income generated. FR: chiffre d\'affaires / revenus', fr: 'La société a augmenté son chiffre d\'affaires de 20%.', isCorrect: true, explanation: '"The company increased its revenue by 20% this quarter." ≠ profit (profit is after costs are deducted).' },
          { en: 'invoice (n./v.) — a bill for goods or services. FR: facture', fr: 'La facture sera envoyée par email.', isCorrect: true, explanation: '"Please send an invoice for the consulting services." | "Invoice the client for the full amount."' },
          { en: 'reimburse (v.) — to pay someone back. FR: rembourser', fr: 'Tous les frais de déplacement seront remboursés.', isCorrect: true, explanation: '"All travel expenses will be reimbursed." | TRAP: Do not confuse with "refund" (refund = retail return; reimburse = expenses repaid).' },
          { en: 'outstanding (adj.) — 1) unpaid (balance) 2) exceptional (performance). FR: 1) en suspens/impayé 2) exceptionnel', fr: '1) Il reste un solde impayé de 500€. 2) Elle a réalisé un travail exceptionnel.', isCorrect: true, explanation: '"There is an outstanding balance on your account." (unpaid) | "Her performance has been outstanding." (exceptional). CONTEXT determines meaning.' },
          { en: 'allocate (v.) — to assign resources or budget. FR: allouer/affecter', fr: 'Le budget a été alloué aux trois départements.', isCorrect: true, explanation: '"The budget was allocated equally among three departments." | Collocations: allocate resources/funds/budget.' },
          { en: 'expenditure (n.) — money spent. FR: dépenses', fr: 'Les dépenses du département ont dépassé le budget.', isCorrect: true, explanation: '"Department expenditure exceeded the approved budget." | Formal alternative to "spending". Common in TOEIC reports.' },
          { en: 'liability (n.) — a debt or legal obligation. FR: passif/responsabilité', fr: 'L\'entreprise a réduit ses dettes à long terme.', isCorrect: true, explanation: '"The company reduced its long-term liabilities." | "limited liability company" (LLC / SARL in French).' },
          { en: 'comply with (v.) — to follow a rule/regulation. FR: se conformer à', fr: 'Tous les fournisseurs doivent respecter les normes de sécurité.', isCorrect: true, explanation: '"All suppliers must comply with safety standards." | Always "comply WITH" — never "comply to".' },
          { en: 'clause (n.) — a section of a contract. FR: clause', fr: 'La clause de confidentialité est incluse dans le contrat.', isCorrect: true, explanation: '"The non-disclosure clause is included in all contracts." | Collocations: penalty clause, cancellation clause.' },
          { en: 'waive (v.) — to give up a right voluntarily. FR: renoncer à/lever', fr: 'Les frais de retard ont été levés pour ce client.', isCorrect: true, explanation: '"The late fees were waived for first-time customers." | Collocations: waive a fee, waive a right, waive a requirement.' },
        ]
      },
      {
        type: 'trap',
        title: 'Finance Vocabulary False Friends',
        content: 'REVENUE ≠ revenue in French (same word but FR "revenu" often means personal income; EN "revenue" = company income)\nLIABILITY ≠ "liabilité" — this French word doesn\'t exist; use "responsabilité" or "dette"\nOUTSTANDING = can mean BOTH "unpaid" and "exceptional" — read context carefully\nACTUAL ≠ actuel (which means "current"). In English, "actual" means "real" or "genuine".',
        contentFr: "REVENUE ≠ 'revenu' en français dans le sens personnel — en anglais = chiffre d'affaires de l'entreprise\nLIABILITY ≠ 'liabilité' — ce mot n'existe pas en français\nOUTSTANDING = DEUX SENS: 'impayé' ET 'exceptionnel' — lisez le contexte\nACTUAL ≠ actuel. 'Actual' en anglais = réel/véritable."
      },
      {
        type: 'toeic_tip',
        title: 'Finance Vocabulary in TOEIC Part 7',
        content: 'Financial texts in Part 7 are the most information-dense. Strategy:\n1. Read the questions FIRST before the passage.\n2. In financial texts, look for: numbers, dates, percentages, company names.\n3. "Outstanding", "allocate", "revenue", "expenditure" often appear in BOTH the passage and the question — locate them quickly.\n4. Do not be intimidated by long numbers. The question will usually be about a comparison ("more than", "less than", "same as"), not the exact number.'
      }
    ],
    miniQuiz: [
      {
        q: 'The company\'s annual _____ increased by 15% following the product launch.',
        opts: ['invoice', 'revenue', 'liability', 'expenditure'],
        correct: 1,
        exp: '"revenue" = total income/sales generated. An increase after a product launch = higher income.',
        optExps: ['"invoice" = a bill — cannot "increase" in this context.', 'Correct. "revenue" = total business income.', '"liability" = debt — increasing liabilities would be negative news, contradicting the positive context.', '"expenditure" = spending — increasing expenditure is possible but contradicts "following the product launch" which suggests growth income.']
      },
      {
        q: 'All travel expenses will be _____ within two weeks of submission.',
        opts: ['refunded', 'reimbursed', 'allocated', 'waived'],
        correct: 1,
        exp: '"reimbursed" = paying back an employee\'s expenses. The most natural word for business expense repayment.',
        optExps: ['"refunded" = retail/customer returns — used for products, not employee expenses.', 'Correct. "reimbursed" = the standard business term for repaying employee expenses.', '"allocated" = assigning resources/budget — cannot be "allocated" to an individual for expenses.', '"waived" = forgiving a fee — implies the expenses would not be paid, contradicting the meaning.']
      }
    ],
    memorySummary: [
      'Revenue = company income. Expenditure = spending. Liability = debt/obligation.',
      'Outstanding = (1) unpaid / (2) exceptional — context decides which meaning.',
      'Reimburse = pay back expenses (not "refund" which is for product returns).'
    ],
    memorySummaryFr: [
      'Revenue = revenus de l\'entreprise. Expenditure = dépenses. Liability = dette/obligation.',
      'Outstanding = (1) impayé / (2) exceptionnel — c\'est le contexte qui décide.',
      'Reimburse = rembourser des frais (pas "refund" qui s\'utilise pour les retours produits).'
    ],
    nextLessonIds: ['vocab_hr', 'strategy_part7']
  },

  // ──────────────────────────────────────────────────────────────────────────

  {
    id: 'vocab_hr',
    title: 'HR, Meetings & Office: Core Business English Vocabulary',
    subtitle: 'The vocabulary of every TOEIC business conversation',
    category: 'vocabulary',
    difficulty: 'beginner',
    estimatedMinutes: 10,
    icon: '🏢',
    objective: 'Recognise and use 12 high-frequency HR and office management vocabulary items',
    whyItMatters: 'HR and office vocabulary appear in every TOEIC Part 1, Part 2, Part 4, Part 5, and Part 7. These words are so common that not knowing them is a guaranteed loss of points.',
    xpReward: 40,
    sections: [
      {
        type: 'examples',
        title: '12 Core HR & Office Words',
        content: 'Each word includes French translation, TOEIC example, and common collocations.',
        examples: [
          { en: 'applicant (n.) — a person applying for a job. FR: candidat(e)', fr: 'Nous avons reçu plus de 200 candidatures.', isCorrect: true, explanation: '"Over 200 applicants submitted their CVs." | Collocations: job applicant, successful applicant, qualified applicant.' },
          { en: 'agenda (n.) — list of topics for a meeting. FR: ordre du jour', fr: 'L\'ordre du jour de la réunion a été distribué ce matin.', isCorrect: true, explanation: '"The meeting agenda was distributed this morning." | "Is this on the agenda?" | TRAP: ≠ "agenda" in the political sense (hidden agenda).' },
          { en: 'deadline (n.) — final date by which something must be done. FR: délai/date limite', fr: 'La date limite de soumission est vendredi prochain.', isCorrect: true, explanation: '"The submission deadline is next Friday." | Collocations: meet a deadline, miss a deadline, extend a deadline.' },
          { en: 'available (adj.) — free, not in use, accessible. FR: disponible', fr: 'La salle de conférence n\'est pas disponible mardi matin.', isCorrect: true, explanation: '"The conference room is not available on Tuesday morning." | "Is the manager available?" | TRAP: Do not confuse with "accessible" (physically reachable).' },
          { en: 'promote (v.) — 1) to give a higher role 2) to advertise. FR: 1) promouvoir 2) faire la promotion de', fr: '1) Elle a été promue directrice régionale. 2) Nous faisons la promotion de nos nouveaux produits.', isCorrect: true, explanation: '"She was promoted to regional director." | "The company is promoting its new product line." | Context decides meaning.' },
          { en: 'negotiate (v.) — to discuss terms to reach agreement. FR: négocier', fr: 'Les deux parties négocient les termes du contrat.', isCorrect: true, explanation: '"Both parties are negotiating the contract terms." | Collocations: negotiate a deal/price/contract/salary.' },
          { en: 'postpone / reschedule (v.) — to move to a later time. FR: reporter/décaler', fr: 'La réunion a été reportée à jeudi.', isCorrect: true, explanation: '"The meeting has been postponed until Thursday." = "The meeting has been rescheduled to Thursday." | "postpone" implies delay; "reschedule" implies a new date was set.' },
          { en: 'implement (v.) — to put a plan into action. FR: mettre en œuvre', fr: 'La nouvelle politique sera mise en œuvre en janvier.', isCorrect: true, explanation: '"The new policy will be implemented in January." | Collocations: implement a policy/strategy/plan/change.' },
          { en: 'mandatory (adj.) — required, compulsory. FR: obligatoire', fr: 'La formation de sécurité est obligatoire pour tous les employés.', isCorrect: true, explanation: '"Safety training is mandatory for all employees." | Synonyms in TOEIC: compulsory, required, obligatory.' },
          { en: 'tentative (adj.) — not yet final, provisional. FR: provisoire/préliminaire', fr: 'L\'heure de la réunion est encore provisoire.', isCorrect: true, explanation: '"The meeting time is still tentative." | "We have a tentative agreement." | Often appears in TOEIC scheduling texts.' },
        ]
      },
      {
        type: 'toeic_tip',
        title: 'HR Vocabulary in TOEIC Part 4 (Talks)',
        content: 'In Part 4, announcements, company meetings, and HR updates are very common. Listen for:\n• Scheduling words: postpone, reschedule, tentative, available\n• Action words: implement, negotiate, promote, allocate\n• Requirement words: mandatory, required, deadline\n\nWhen you hear these words, the answer to the question is usually nearby — either just before or just after.'
      }
    ],
    miniQuiz: [
      {
        q: 'Attendance at the annual safety training is _____ for all full-time employees.',
        opts: ['tentative', 'mandatory', 'available', 'postponed'],
        correct: 1,
        exp: '"mandatory" = required, compulsory. Attendance is REQUIRED for all employees.',
        optExps: ['"tentative" = provisional/uncertain — contradicts the clear requirement stated.', 'Correct. "mandatory" = compulsory, obligatory.', '"available" = accessible/free — cannot describe attendance requirements.', '"postponed" = delayed to a later time — wrong meaning entirely.']
      }
    ],
    memorySummary: [
      'Applicant = job seeker. Agenda = meeting topics. Deadline = final date.',
      'Mandatory = required. Tentative = provisional/not yet confirmed.',
      'Promote = (1) give a higher role OR (2) advertise — context decides.'
    ],
    nextLessonIds: ['vocab_finance', 'strategy_part5']
  },

  // ──────────────────────────────────────────────────────────────────────────
  // STRATEGY LESSONS
  // ──────────────────────────────────────────────────────────────────────────

  {
    id: 'strategy_part5',
    title: 'Part 5 Speed Strategy: Solve in Under 30 Seconds',
    subtitle: 'The exam technique that separates 700 from 900',
    category: 'strategy',
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    icon: '⚡',
    objective: 'Apply a 3-step rapid-decision framework to Part 5 questions without reading the full sentence',
    whyItMatters: 'Part 5 has 30 questions in ~15 minutes. That\'s 30 seconds per question. Spending 60+ seconds per question means running out of time before Part 7. Speed technique is not about rushing — it\'s about using the right shortcut for the right question type.',
    xpReward: 55,
    sections: [
      {
        type: 'rule',
        title: 'The 3-Step Framework',
        content: 'STEP 1 — Identify the question TYPE in 3 seconds:\n• All four options are from the same root (decide/decision/decisive/decisively) → WORD FORM question\n• Options are all conjunctions (despite/although/however/because) → CONNECTOR question\n• Options are all prepositions (for/with/to/about) → PREPOSITION question\n• Options are clearly different words → VOCABULARY question (must read the full sentence)\n\nSTEP 2 — Apply the TYPE-SPECIFIC shortcut (not the full-sentence read)\n\nSTEP 3 — Confirm and move on. Never go back.',
        contentFr: "ÉTAPE 1 — Identifiez le TYPE de question en 3 secondes.\nÉTAPE 2 — Appliquez le raccourci spécifique au type.\nÉTAPE 3 — Confirmez et passez. Ne revenez jamais en arrière."
      },
      {
        type: 'rule',
        title: 'The Type-Specific Shortcuts',
        content: 'WORD FORM → Look at what comes after the blank. Noun after → adjective. Verb before/after → adverb. Article before → noun. Identify form in 5 seconds without understanding the sentence.\n\nCONNECTOR → Look at what comes AFTER the blank: a noun phrase → despite/because of/due to. A subject+verb clause → although/because/since. A complete sentence before AND after → however/therefore.\n\nPREPOSITION → Identify the verb or adjective paired with the blank. Apply memorized collocation (responsible FOR, interested IN, comply WITH).\n\nVOCABULARY → Must read the full sentence for context. Budget 20-25 seconds.',
        contentFr: "FORME LEXICALE → Regardez ce qui vient APRÈS le blanc.\nCONNECTEUR → Regardez ce qui vient APRÈS le blanc: nom → despite. Sujet+verbe → although.\nPRÉPOSITION → Identifiez le verbe/adjectif associé → appliquez la collocation mémorisée.\nVOCABULAIRE → Lisez toute la phrase. Budget: 20-25 secondes."
      },
      {
        type: 'toeic_tip',
        title: 'Time Allocation Strategy',
        content: 'TOEIC Reading total: 75 minutes for 100 questions.\nPart 5 (30 questions): target 12 minutes (24 seconds/question)\nPart 6 (16 questions): target 8 minutes (30 seconds/question)\nPart 7 (54 questions): target 55 minutes (60 seconds/question + reading time)\n\nThe math: if you spend 45 seconds per Part 5 question instead of 24, you lose 6 minutes — that\'s 6 fewer Part 7 questions you can answer.\n\nHigh-score strategy: use shortcuts to finish Part 5 in 10 minutes, not 15.',
        contentFr: "TOEIC Lecture: 75 minutes pour 100 questions.\nPartie 5 (30 questions): ciblez 12 minutes (24 secondes/question)\nPartie 6 (16 questions): ciblez 8 minutes\nPartie 7 (54 questions): ciblez 55 minutes\n\nChaque seconde gagnée en Partie 5 se transfère en Partie 7."
      },
      {
        type: 'memory_tip',
        title: 'The 3-Question Pre-Read Habit',
        content: 'Before reading the sentence, ask three questions in this order:\n1. "What TYPE of question is this?" (look at the options)\n2. "What is the STRUCTURAL SIGNAL?" (look around the blank)\n3. "What WORD fits this role/pattern?" (apply the rule)\n\nFor Word Form, Connector, and Preposition questions, you can often answer without fully understanding the sentence. Save your reading energy for Vocabulary questions and Part 7.'
      }
    ],
    miniQuiz: [
      {
        q: 'What is the FASTEST strategy for a Word Form question?',
        opts: ['Read the full sentence carefully from start to finish', 'Look at what comes before and after the blank to determine the grammatical role', 'Guess the word that sounds most business-like', 'Choose the longest option'],
        correct: 1,
        exp: 'Identifying the grammatical role from position (before/after the blank) is the fastest and most accurate strategy for Word Form.',
        optExps: ['Full-sentence reading is too slow for Word Form and wastes 15+ seconds.', 'Correct. Position signals the grammatical role in 5 seconds.', 'Business sound is not a reliable criterion.', 'Length is irrelevant to grammatical correctness.']
      },
      {
        q: 'You see these four options: "despite / although / however / because of". What TYPE of question is this?',
        opts: ['Vocabulary question', 'Word Form question', 'Connector/Conjunction question', 'Verb Tense question'],
        correct: 2,
        exp: 'All four options are connectors/conjunctions → Connector question. Apply the noun/clause test immediately.',
        optExps: ['Vocabulary questions have options from different semantic fields.', 'Word Form questions have options from the same root word.', 'Correct. All options are connectors → apply the noun phrase/clause test.', 'Verb tense questions would have different verb forms as options.']
      }
    ],
    memorySummary: [
      'Identify the question TYPE before reading the sentence: Word Form / Connector / Preposition / Vocabulary.',
      'Word Form: look at position. Connector: look at what follows. Preposition: apply memorized collocation.',
      'Budget: 24 sec/question for Part 5 to save time for Part 7.'
    ],
    memorySummaryFr: [
      'Identifiez le TYPE de question avant de lire la phrase: Forme / Connecteur / Préposition / Vocabulaire.',
      'Forme: regardez la position. Connecteur: regardez ce qui suit. Préposition: appliquez la collocation mémorisée.',
      'Budget: 24 sec/question pour la Partie 5 pour économiser du temps pour la Partie 7.'
    ],
    nextLessonIds: ['strategy_part7', 'word_form']
  },

  // ──────────────────────────────────────────────────────────────────────────

  {
    id: 'strategy_part7',
    title: 'Part 7 Reading: Skim, Scan, and Score Without Reading Everything',
    subtitle: 'How top scorers finish Part 7 with 5 minutes to spare',
    category: 'strategy',
    difficulty: 'advanced',
    estimatedMinutes: 12,
    icon: '📖',
    objective: 'Apply skimming and scanning techniques to answer Part 7 questions without reading every word',
    whyItMatters: 'Most TOEIC takers run out of time in Part 7 and guess the last 10-15 questions. Learning to extract answers without reading every word is the highest-value skill for scores above 800.',
    xpReward: 60,
    sections: [
      {
        type: 'rule',
        title: 'The Core Insight: You Never Need to Read Everything',
        content: 'TOEIC Part 7 questions are specific. They ask about specific details, specific dates, specific names, or specific meanings of words. They rarely ask you to understand the whole passage.\n\nStrategy: read the QUESTIONS first (5 seconds each), then SCAN the passage for the answer location, then read ONLY that section (10-20 words).\n\nReading everything: ~3 minutes per passage\nSkimming + scanning: ~1.5 minutes per passage\n\nWith 15+ passages, this saves 20+ minutes.',
        contentFr: "Les questions TOEIC Partie 7 sont spécifiques. Elles demandent des détails précis, des dates, des noms.\nStratégie: lisez les QUESTIONS en premier, puis SCANNEZ le texte pour trouver la réponse.\nLire tout: ~3 min par passage\nSurvol + scan: ~1.5 min par passage → économie de 20+ minutes."
      },
      {
        type: 'rule',
        title: 'Question Type Strategies',
        content: 'DETAIL questions ("According to the email, when will...") → Scan for the specific keyword from the question. The answer is almost always one sentence.\n\nVOCABULARY questions ("The word X in paragraph 2 is closest in meaning to...") → Go directly to the word in context. Read 2-3 words before and after. Choose the option that fits that specific context.\n\nINFERENCE questions ("What can be inferred about...") → Harder. Read the relevant section carefully. The answer is implied, not stated. Eliminate obviously wrong options.\n\nNOT TRUE questions ("Which of the following is NOT mentioned...") → Check each option against the text. Time-consuming — do last if pressed for time.',
        contentFr: "DÉTAIL → Scannez le mot-clé de la question.\nVOCABULAIRE → Allez directement au mot dans le texte. Lisez 2-3 mots avant et après.\nINFÉRENCE → Lisez la section pertinente. La réponse est implicite.\nNOT TRUE → Vérifiez chaque option. Chronophage — faites en dernier si vous manquez de temps."
      },
      {
        type: 'trap',
        title: 'The 5 Part 7 Traps That Cost Points',
        content: '1) TRAP: Answer that uses exact words from the passage but wrong meaning → always check context, not just word matching.\n\n2) TRAP: "Not mentioned" ≠ "False". If it is not in the passage, it is not stated — not necessarily wrong.\n\n3) TRAP: Double passages — one question asks about BOTH passages. Read both before answering that question.\n\n4) TRAP: Inference questions — the correct answer goes ONE step beyond what is stated, not two. If you\'re inferring wildly, you\'ve gone too far.\n\n5) TRAP: First option bias — many test takers choose A when they don\'t know. B and C are slightly more often correct statistically.',
        contentFr: "1) Des mots identiques au texte mais sens différent → vérifiez le contexte.\n2) 'Non mentionné' ≠ 'Faux'. Si ce n'est pas dans le texte, c'est 'non mentionné'.\n3) Double passages — une question demande sur LES DEUX textes.\n4) Inférence = UNE étape au-delà du texte, pas deux.\n5) Biais sur la première option — B et C sont légèrement plus souvent corrects."
      },
      {
        type: 'toeic_tip',
        title: 'The Reading Order That Saves Time',
        content: '1. Read question 1 (5 sec)\n2. Skim the first paragraph title and first sentence\n3. Scan for question 1 answer → answer it\n4. Read question 2 → scan → answer\n5. Repeat until all questions for this passage are done\n6. Move to next passage WITHOUT going back\n\nCritical rule: NEVER re-read passages after answering. Trust your first answer for factual questions. Only re-read for inference questions when uncertain.\n\nTarget pace: 1.5 minutes per single-passage set, 2.5 minutes per double/triple passage set.'
      }
    ],
    miniQuiz: [
      {
        q: 'You are answering a "detail" question in Part 7: "According to the memo, when will the renovation begin?" What should you do FIRST?',
        opts: ['Read the entire memo carefully from beginning to end', 'Scan the memo for the keyword "renovation" and read only that section', 'Read all the answer options and eliminate obvious wrong ones', 'Skip this question and come back to it later'],
        correct: 1,
        exp: 'Scan for "renovation" keyword → read only that section. This is faster than full reading and just as accurate.',
        optExps: ['Full reading is far too slow for a simple detail question.', 'Correct. Scan for the keyword → read only that local context.', 'Reading options first without any text context is ineffective for detail questions.', 'Skipping is a last resort — this question is fast if you scan correctly.']
      }
    ],
    memorySummary: [
      'Read questions first, then scan for keyword location, then read ONLY that section.',
      'Vocabulary questions: go directly to the word, read 2-3 words of context.',
      'Inference questions: the answer is ONE step beyond what\'s stated — not a wild guess.'
    ],
    memorySummaryFr: [
      'Lisez les questions en premier, puis scannez le mot-clé, puis lisez UNIQUEMENT cette section.',
      'Questions de vocabulaire: allez directement au mot, lisez 2-3 mots de contexte.',
      'Questions d\'inférence: la réponse est UNE étape au-delà du texte — pas une supposition sauvage.'
    ],
    nextLessonIds: ['vocab_finance', 'strategy_part5']
  },

]

// Category metadata for display
export const LESSON_CATEGORIES: Record<string, { label: string; description: string; icon: string; color: string }> = {
  grammar: { label: 'Grammar', description: 'Master the rules that govern Part 5', icon: '📝', color: '#6366F1' },
  vocabulary: { label: 'Vocabulary', description: 'High-value words and their contexts', icon: '📚', color: '#8B5CF6' },
  traps: { label: 'Traps', description: 'Confusable patterns TOEIC deliberately uses', icon: '⚔️', color: '#EF4444' },
  strategy: { label: 'Strategy', description: 'Exam technique for higher scores', icon: '🎯', color: '#F59E0B' },
  reading: { label: 'Reading', description: 'Part 6 and Part 7 comprehension', icon: '📖', color: '#10B981' },
  business_english: { label: 'Business English', description: 'Professional communication patterns', icon: '💼', color: '#06B6D4' },
}

// Map grammar drill categories to lesson IDs
export const CATEGORY_TO_LESSON: Record<string, string> = {
  word_form: 'word_form',
  preposition: 'preposition',
  conjunction: 'conjunction',
  verb: 'verb',
  passive: 'passive',
  gerund_infinitive: 'gerund_infinitive',
  relative_clause: 'relative_clause',
  article: 'article',
  vocab: 'vocab_finance',
  adjective_adverb: 'adjective_adverb',
  modal_verbs: 'modal_verbs',
  pronoun: 'pronouns',
  connector: 'conjunction',
}
