// Grammar Basics — pedagogical content for the English Grammar Learning Module
// Covers sentence structure, parts of speech, pronouns, possessives, phrasal verbs

export interface ConceptExample {
  sentence: string
  parts?: Array<{ text: string; label: string; color: 'blue' | 'violet' | 'emerald' | 'amber' | 'rose' | 'slate' }>
  note?: string
}

export interface ConceptQuiz {
  q: string
  opts: [string, string, string, string]
  correct: 0 | 1 | 2 | 3
  exp: string
}

export interface GrammarConcept {
  id: string
  title: string
  icon: string
  group: 'structure' | 'parts-of-speech' | 'pronouns' | 'verbs'
  definition: string
  role: string
  position?: string
  explanation: string
  examples: ConceptExample[]
  mistakes?: string[]
  fr?: string
  quiz: ConceptQuiz[]
}

export const GRAMMAR_CONCEPTS: GrammarConcept[] = [
  // ── SENTENCE STRUCTURE ────────────────────────────────────────────────────
  {
    id: 'sentence_structure',
    title: 'Sentence Structure',
    icon: '🏗️',
    group: 'structure',
    definition: 'The basic order of words in an English sentence is Subject + Verb + Object (S + V + O).',
    role: 'The backbone of every English sentence.',
    position: 'Subject comes first, then the verb, then the object.',
    explanation:
      'English is a Subject-Verb-Object language. The subject usually comes before the verb. The object usually comes after the verb. This order is almost always fixed in statement sentences.',
    examples: [
      {
        sentence: 'Sarah reads a book.',
        parts: [
          { text: 'Sarah', label: 'Subject', color: 'blue' },
          { text: 'reads', label: 'Verb', color: 'violet' },
          { text: 'a book', label: 'Object', color: 'emerald' },
        ],
      },
      {
        sentence: 'They watch a movie.',
        parts: [
          { text: 'They', label: 'Subject', color: 'blue' },
          { text: 'watch', label: 'Verb', color: 'violet' },
          { text: 'a movie', label: 'Object', color: 'emerald' },
        ],
      },
      {
        sentence: 'He is tired.',
        parts: [
          { text: 'He', label: 'Subject', color: 'blue' },
          { text: 'is', label: 'Verb', color: 'violet' },
          { text: 'tired', label: 'Complement', color: 'amber' },
        ],
        note: 'No object here — "tired" is a complement describing the subject.',
      },
    ],
    mistakes: [
      'Do NOT put the object before the subject: ✗ "A book reads Sarah."',
      'The subject always controls the verb: "She reads" not "She read" (third person singular).',
    ],
    fr: 'En anglais, l\'ordre est généralement Sujet + Verbe + Objet (comme en français, mais cet ordre est OBLIGATOIRE en anglais — on ne peut pas l\'inverser comme en français littéraire).',
    quiz: [
      {
        q: 'In "I eat an apple." — what is the correct order?',
        opts: [
          'Subject → Verb → Object',
          'Object → Subject → Verb',
          'Verb → Subject → Object',
          'Subject → Object → Verb',
        ],
        correct: 0,
        exp: 'English follows S + V + O. "I" (subject) + "eat" (verb) + "an apple" (object).',
      },
      {
        q: 'Which sentence has the correct English word order?',
        opts: [
          'A movie they watch.',
          'They watch a movie.',
          'Watch they a movie.',
          'A movie watch they.',
        ],
        correct: 1,
        exp: 'Subject (They) + Verb (watch) + Object (a movie) — standard S+V+O order.',
      },
    ],
  },

  // ── SUBJECT ──────────────────────────────────────────────────────────────
  {
    id: 'subject',
    title: 'Subject',
    icon: '🧍',
    group: 'structure',
    definition: 'The subject is who or what performs the action (or is being described).',
    role: 'Tells us WHO or WHAT the sentence is about.',
    position: 'Usually comes before the verb.',
    explanation:
      'The subject can be a noun, a pronoun, or a noun phrase. It always controls the verb — the verb must agree with it. To find the subject, ask: "Who or what does the action?"',
    examples: [
      {
        sentence: 'Sarah reads a book.',
        parts: [{ text: 'Sarah', label: 'Subject', color: 'blue' }],
        note: '"Who reads?" → Sarah.',
      },
      {
        sentence: 'The students are studying.',
        parts: [{ text: 'The students', label: 'Subject', color: 'blue' }],
        note: 'Subject can be a noun phrase.',
      },
      {
        sentence: 'It is raining.',
        parts: [{ text: 'It', label: 'Subject', color: 'blue' }],
        note: '"It" is a dummy subject — used when there is no real subject.',
      },
    ],
    mistakes: [
      'Don\'t confuse subject and object pronouns: use "She" (not "Her") as subject.',
      '✗ "Her likes coffee." → ✓ "She likes coffee."',
    ],
    fr: 'Le sujet est le même concept qu\'en français. La différence : en anglais on ne peut pas l\'omettre. ✗ "Is raining." → ✓ "It is raining."',
    quiz: [
      {
        q: 'In "My dog runs fast." — what is the subject?',
        opts: ['runs', 'fast', 'My dog', 'My'],
        correct: 2,
        exp: '"My dog" is the noun phrase that performs the action (runs). Ask: "What runs fast?" → My dog.',
      },
      {
        q: 'Which word should be the subject? "_____ studies every day."',
        opts: ['Her', 'Him', 'Them', 'She'],
        correct: 3,
        exp: 'Subject pronouns are used before the verb: I, you, he, she, it, we, they. "Her/Him/Them" are object pronouns.',
      },
    ],
  },

  // ── VERB ─────────────────────────────────────────────────────────────────
  {
    id: 'verb',
    title: 'Verb',
    icon: '⚡',
    group: 'structure',
    definition: 'The verb expresses the action or state of the subject.',
    role: 'The engine of the sentence — every sentence must have one.',
    position: 'Comes after the subject.',
    explanation:
      'Action verbs describe what the subject does (run, eat, think). State verbs describe a condition (be, seem, have). The verb must agree with the subject in number and person.',
    examples: [
      {
        sentence: 'She runs every morning.',
        parts: [{ text: 'runs', label: 'Action verb', color: 'violet' }],
      },
      {
        sentence: 'He is happy.',
        parts: [{ text: 'is', label: 'State verb (to be)', color: 'violet' }],
      },
      {
        sentence: 'They have finished.',
        parts: [{ text: 'have finished', label: 'Verb phrase', color: 'violet' }],
        note: 'A verb can be more than one word (auxiliary + main verb).',
      },
    ],
    mistakes: [
      '3rd person singular: she/he/it → add -s: "She work**s**" not "She work".',
      'Don\'t confuse verb and noun: "work" (verb) vs "the work" (noun).',
    ],
    fr: 'Le verbe fonctionne comme en français. En anglais, au présent, seule la 3ème personne du singulier change : "he/she/it + verb+s".',
    quiz: [
      {
        q: 'In "They eat pizza every Friday." — what is the verb?',
        opts: ['They', 'pizza', 'eat', 'every Friday'],
        correct: 2,
        exp: '"eat" is the action the subject (They) performs. Ask: "What do they do?" → eat.',
      },
      {
        q: 'Which sentence has the correct verb form?',
        opts: ['She work hard.', 'She works hard.', 'She working hard.', 'She worked hard every day now.'],
        correct: 1,
        exp: 'Present simple, 3rd person singular: she/he/it + verb + -s → "she works".',
      },
    ],
  },

  // ── OBJECT ───────────────────────────────────────────────────────────────
  {
    id: 'object',
    title: 'Object',
    icon: '🎯',
    group: 'structure',
    definition: 'The object is what receives the action of the verb.',
    role: 'Tells us WHAT or WHOM the action affects.',
    position: 'Comes after the verb.',
    explanation:
      'A direct object receives the action directly. An indirect object tells us to whom or for whom the action is done. To find the object, ask "What?" or "Whom?" after the verb.',
    examples: [
      {
        sentence: 'I eat an apple.',
        parts: [
          { text: 'I', label: 'Subject', color: 'blue' },
          { text: 'eat', label: 'Verb', color: 'violet' },
          { text: 'an apple', label: 'Direct Object', color: 'emerald' },
        ],
        note: '"Eat what?" → an apple.',
      },
      {
        sentence: 'She gave him a gift.',
        parts: [
          { text: 'She', label: 'Subject', color: 'blue' },
          { text: 'gave', label: 'Verb', color: 'violet' },
          { text: 'him', label: 'Indirect Object', color: 'amber' },
          { text: 'a gift', label: 'Direct Object', color: 'emerald' },
        ],
        note: '"Gave what?" → a gift (direct). "Gave to whom?" → him (indirect).',
      },
      {
        sentence: 'I love her.',
        parts: [
          { text: 'I', label: 'Subject', color: 'blue' },
          { text: 'love', label: 'Verb', color: 'violet' },
          { text: 'her', label: 'Object', color: 'emerald' },
        ],
        note: 'Object pronouns are used after the verb: me, you, him, her, it, us, them.',
      },
    ],
    mistakes: [
      'Use object pronouns (not subject pronouns) after a verb: ✗ "I love she." → ✓ "I love her."',
      'Not all verbs take an object. "She sleeps." has no object.',
    ],
    fr: 'Le COD (complément d\'objet direct) en français = direct object en anglais. En anglais, il se place TOUJOURS après le verbe sans préposition.',
    quiz: [
      {
        q: 'In "He reads the newspaper." — what is the object?',
        opts: ['He', 'reads', 'the newspaper', 'newspaper'],
        correct: 2,
        exp: '"Reads what?" → the newspaper. The full noun phrase "the newspaper" is the object.',
      },
      {
        q: 'Which sentence uses the correct object pronoun?',
        opts: ['I see she every day.', 'I see her every day.', 'I see hers every day.', 'I see her\'s every day.'],
        correct: 1,
        exp: 'After a verb, use an object pronoun: me, you, him, her, it, us, them. "She" is a subject pronoun.',
      },
    ],
  },

  // ── COMPLEMENT ───────────────────────────────────────────────────────────
  {
    id: 'complement',
    title: 'Complement',
    icon: '✨',
    group: 'structure',
    definition: 'A complement adds extra information about the subject or object, completing the meaning.',
    role: 'Describes or identifies the subject/object — not an action, but a description.',
    position: 'Comes after linking verbs (be, seem, become, appear, feel, look).',
    explanation:
      'A subject complement follows a linking verb and describes the subject. It can be an adjective, noun, or noun phrase. There is no "action" — just a description or identity.',
    examples: [
      {
        sentence: 'He is tired.',
        parts: [
          { text: 'He', label: 'Subject', color: 'blue' },
          { text: 'is', label: 'Linking verb', color: 'violet' },
          { text: 'tired', label: 'Complement (adj.)', color: 'amber' },
        ],
      },
      {
        sentence: 'She became a doctor.',
        parts: [
          { text: 'She', label: 'Subject', color: 'blue' },
          { text: 'became', label: 'Linking verb', color: 'violet' },
          { text: 'a doctor', label: 'Complement (noun)', color: 'amber' },
        ],
      },
      {
        sentence: 'The coffee smells good.',
        parts: [
          { text: 'The coffee', label: 'Subject', color: 'blue' },
          { text: 'smells', label: 'Linking verb', color: 'violet' },
          { text: 'good', label: 'Complement (adj.)', color: 'amber' },
        ],
        note: '"Smells" here is a linking verb, not an action. Use adjective (good), NOT adverb (well).',
      },
    ],
    mistakes: [
      'After linking verbs (be, seem, look, smell, feel), use an ADJECTIVE, not an adverb.',
      '✗ "She looks beautifully." → ✓ "She looks beautiful."',
    ],
    fr: 'L\'attribut du sujet en français = subject complement en anglais. Après "être, sembler, paraître, devenir", on met un adjectif ou un nom.',
    quiz: [
      {
        q: 'In "The soup tastes delicious." — what is the complement?',
        opts: ['The soup', 'tastes', 'delicious', 'soup tastes'],
        correct: 2,
        exp: '"Tastes" is a linking verb. "Delicious" describes the subject (the soup) — it is the complement.',
      },
      {
        q: 'Which sentence is correct?',
        opts: [
          'She feels badly about it.',
          'She feels bad about it.',
          'She is feeling badly.',
          'She feeling bad.',
        ],
        correct: 1,
        exp: '"Feel" here is a linking verb → use adjective "bad", not adverb "badly".',
      },
    ],
  },

  // ── NOUN ─────────────────────────────────────────────────────────────────
  {
    id: 'noun',
    title: 'Noun',
    icon: '🏷️',
    group: 'parts-of-speech',
    definition: 'A noun names a person, place, thing, or idea.',
    role: 'Can act as subject, object, or complement in a sentence.',
    position: 'Can appear almost anywhere, but especially as subject (before verb) and object (after verb).',
    explanation:
      'Nouns can be concrete (book, car, person) or abstract (happiness, freedom, idea). Countable nouns can be singular or plural. Uncountable nouns (water, money, information) have no plural.',
    examples: [
      { sentence: 'The book is on the table.', note: '"Book" and "table" are concrete nouns.' },
      { sentence: 'Happiness is important.', note: '"Happiness" is an abstract noun — uncountable.' },
      { sentence: 'She gave me some advice.', note: '"Advice" is uncountable — NO "advices".' },
    ],
    mistakes: [
      '✗ "informations" / "advices" / "furnitures" — these are uncountable, no plural.',
      'Articles before nouns: "a book" (first mention), "the book" (known/specific).',
    ],
    fr: 'Les noms dénombrables et indénombrables fonctionnent comme en français mais les règles ne sont pas toujours les mêmes. Ex: "information" est toujours indénombrable en anglais.',
    quiz: [
      {
        q: 'Which of these is an uncountable noun?',
        opts: ['apple', 'chair', 'information', 'student'],
        correct: 2,
        exp: '"Information" is always uncountable in English. You say "some information" not "an information" or "informations".',
      },
      {
        q: 'In "She reads books every night." — which word is a noun acting as object?',
        opts: ['She', 'reads', 'books', 'every'],
        correct: 2,
        exp: '"Books" is the noun receiving the action — it is the direct object.',
      },
    ],
  },

  // ── ADJECTIVE ────────────────────────────────────────────────────────────
  {
    id: 'adjective',
    title: 'Adjective',
    icon: '🎨',
    group: 'parts-of-speech',
    definition: 'An adjective describes or modifies a noun.',
    role: 'Gives information about a noun: size, color, quality, number, etc.',
    position: 'Usually BEFORE the noun, or AFTER a linking verb (be, seem, look, feel).',
    explanation:
      'In English, adjectives always come before the noun (unlike French). They never take a plural or feminine form — they stay the same for all nouns.',
    examples: [
      { sentence: 'She is a quick runner.', note: '"Quick" is before the noun "runner".' },
      { sentence: 'The big red car is fast.', note: 'Multiple adjectives stack before the noun.' },
      { sentence: 'The coffee is hot.', note: '"Hot" comes after linking verb "is" — also correct.' },
    ],
    mistakes: [
      '✗ "She is a runner quick." → ✓ "She is a quick runner." (adjective before noun)',
      'Adjectives do NOT change: ✗ "a bigs house" → ✓ "a big house"',
      'Don\'t use adverb where adjective is needed: ✗ "She looks beautifully" → ✓ "She looks beautiful"',
    ],
    fr: 'L\'adjectif se place AVANT le nom en anglais (contrairement au français : "une voiture rouge" → "a red car"). Et il ne s\'accorde pas.',
    quiz: [
      {
        q: 'Which sentence is correct?',
        opts: [
          'She bought a dress beautiful.',
          'She bought a beautifully dress.',
          'She bought a beautiful dress.',
          'She bought beautiful a dress.',
        ],
        correct: 2,
        exp: 'Adjectives in English go BEFORE the noun: "a beautiful dress".',
      },
      {
        q: 'He runs _____. She is a _____ runner.',
        opts: ['quick / quickly', 'quickly / quick', 'quick / quick', 'quickly / quickly'],
        correct: 1,
        exp: 'Adverbs modify verbs: "runs quickly". Adjectives modify nouns: "a quick runner".',
      },
    ],
  },

  // ── ADVERB ───────────────────────────────────────────────────────────────
  {
    id: 'adverb',
    title: 'Adverb',
    icon: '🏃',
    group: 'parts-of-speech',
    definition: 'An adverb modifies a verb, adjective, or another adverb — usually formed by adding -ly to an adjective.',
    role: 'Tells us how, when, where, or to what degree an action is done.',
    position: 'Often after the verb, or before an adjective/adverb it modifies.',
    explanation:
      'Most adverbs are formed by adding -ly to adjectives: quick → quickly, beautiful → beautifully. Some are irregular: good → well, fast → fast, hard → hard.',
    examples: [
      { sentence: 'She runs quickly.', note: '"Quickly" modifies the verb "runs" — how she runs.' },
      { sentence: 'He is extremely tall.', note: '"Extremely" modifies the adjective "tall".' },
      { sentence: 'She speaks very well.', note: '"Very" modifies "well"; "well" is the adverb of "good".' },
    ],
    mistakes: [
      '✗ "She sings beautiful." → ✓ "She sings beautifully." (modifying a verb → adverb)',
      'Irregular: "good" (adj.) → "well" (adv.): ✗ "She plays good." → ✓ "She plays well."',
      'After linking verbs, use adjective not adverb: ✗ "She looks tiredly." → ✓ "She looks tired."',
    ],
    fr: 'Les adverbes se forment en -ly (comme -ment en français). Attention : "good" (bien) → "well" (adv.), pas "goodly".',
    quiz: [
      {
        q: 'He is a _____ driver. He drives _____.',
        opts: ['carefully / careful', 'careful / carefully', 'careful / careful', 'carefully / carefully'],
        correct: 1,
        exp: 'Adjective before noun: "careful driver". Adverb after verb: "drives carefully".',
      },
      {
        q: 'Which is correct?',
        opts: [
          'She dances beautiful.',
          'She is a beautifully dancer.',
          'She dances beautifully.',
          'She dances beauty.',
        ],
        correct: 2,
        exp: '"Dances" is a verb → use adverb: "beautifully" (beautiful + -ly).',
      },
    ],
  },

  // ── PRONOUN ──────────────────────────────────────────────────────────────
  {
    id: 'pronoun',
    title: 'Pronoun',
    icon: '🔁',
    group: 'pronouns',
    definition: 'A pronoun replaces a noun to avoid repetition.',
    role: 'Stands in for a noun — person, place, or thing.',
    position: 'Takes the same position as the noun it replaces (subject or object).',
    explanation:
      'English pronouns change form depending on their role: subject pronouns (I, she, they) before the verb; object pronouns (me, her, them) after the verb or preposition. Possessive forms exist too.',
    examples: [
      {
        sentence: 'Sarah is kind. She helps everyone.',
        note: '"She" replaces "Sarah" as subject.',
      },
      {
        sentence: 'I see John every day. I like him.',
        note: '"Him" replaces "John" as object.',
      },
    ],
    mistakes: [
      'Don\'t mix subject and object forms: ✗ "Her is here." → ✓ "She is here."',
      '✗ "Between you and I" → ✓ "Between you and me" (object after preposition)',
    ],
    fr: 'Les pronoms changent de forme selon leur fonction (sujet/objet), comme en français. "Je/me/moi" → "I/me".',
    quiz: [
      {
        q: 'Which sentence is correct?',
        opts: [
          'Her and me went to the store.',
          'She and I went to the store.',
          'She and me went to the store.',
          'Her and I went to the store.',
        ],
        correct: 1,
        exp: 'Both pronouns are subjects (they perform the action) → use subject pronouns: "She and I".',
      },
      {
        q: 'The teacher praised _____ for the good work.',
        opts: ['they', 'them', 'their', 'theirs'],
        correct: 1,
        exp: 'After a verb (praised), use object pronoun: "them".',
      },
    ],
  },

  // ── SUBJECT PRONOUNS ─────────────────────────────────────────────────────
  {
    id: 'subject_pronouns',
    title: 'Subject Pronouns',
    icon: '👤',
    group: 'pronouns',
    definition: 'Subject pronouns replace the subject of a sentence: I, you, he, she, it, we, they.',
    role: 'Act as the subject — they perform the action.',
    position: 'Always BEFORE the verb.',
    explanation:
      'Use subject pronouns when the pronoun is the one doing the action. These pronouns control the verb agreement.',
    examples: [
      {
        sentence: 'I work every day.',
        parts: [{ text: 'I', label: 'Subject pronoun', color: 'blue' }],
      },
      {
        sentence: 'She studies hard.',
        parts: [{ text: 'She', label: 'Subject pronoun', color: 'blue' }],
      },
      {
        sentence: 'They play football.',
        parts: [{ text: 'They', label: 'Subject pronoun', color: 'blue' }],
      },
    ],
    mistakes: [
      '✗ "Me and my friend went." → ✓ "My friend and I went." (both are subjects)',
      '✗ "Him is tall." → ✓ "He is tall." ("him" is object pronoun)',
    ],
    fr: 'Pronoms sujets : I (je), you (tu/vous), he (il), she (elle), it (il/elle pour choses), we (nous), they (ils/elles).',
    quiz: [
      {
        q: '_____ is my best friend.',
        opts: ['Him', 'Her', 'She', 'Them'],
        correct: 2,
        exp: 'The pronoun is the subject (before the verb "is") → use subject pronoun: "She".',
      },
      {
        q: 'Which pronoun completes correctly: "_____ and Tom are coming."',
        opts: ['Me', 'Him', 'I', 'Us'],
        correct: 2,
        exp: 'The compound subject performs the action → use subject pronoun "I". "Me and Tom" is informal/incorrect.',
      },
    ],
  },

  // ── OBJECT PRONOUNS ──────────────────────────────────────────────────────
  {
    id: 'object_pronouns',
    title: 'Object Pronouns',
    icon: '🎁',
    group: 'pronouns',
    definition: 'Object pronouns replace the object: me, you, him, her, it, us, them.',
    role: 'Receive the action — they come after the verb or after a preposition.',
    position: 'AFTER the verb or AFTER a preposition (to, for, with, about...).',
    explanation:
      'Use object pronouns when the pronoun receives the action or follows a preposition. They are different from subject pronouns.',
    examples: [
      {
        sentence: 'He loves me.',
        parts: [{ text: 'me', label: 'Object pronoun', color: 'emerald' }],
        note: '"me" receives the love — it is the object.',
      },
      {
        sentence: 'I see her every day.',
        parts: [{ text: 'her', label: 'Object pronoun', color: 'emerald' }],
      },
      {
        sentence: 'She talked to us.',
        parts: [{ text: 'us', label: 'Object pronoun (after preposition)', color: 'emerald' }],
        note: 'Always use object pronoun after a preposition: to, for, with, about, etc.',
      },
    ],
    mistakes: [
      '✗ "She talked to I." → ✓ "She talked to me." (after preposition → object pronoun)',
      '✗ "Between you and I." → ✓ "Between you and me." (both follow preposition)',
    ],
    fr: 'Pronoms objets : me (me/moi), you (te/toi/vous), him (le/lui), her (la/lui), it (le/la), us (nous), them (les/leur/eux).',
    quiz: [
      {
        q: 'Can you help _____?',
        opts: ['I', 'she', 'they', 'me'],
        correct: 3,
        exp: 'After the verb "help", use object pronoun: "me".',
      },
      {
        q: 'He sent the message to _____ and _____ sister.',
        opts: ['I / my', 'me / my', 'me / mine', 'I / mine'],
        correct: 1,
        exp: '"To me" — object pronoun after preposition. "my sister" — possessive adjective before noun.',
      },
    ],
  },

  // ── POSSESSIVE ADJECTIVES ────────────────────────────────────────────────
  {
    id: 'possessive_adjectives',
    title: 'Possessive Adjectives',
    icon: '🏠',
    group: 'pronouns',
    definition: 'Possessive adjectives show ownership and come before a noun: my, your, his, her, its, our, their.',
    role: 'Modify a noun to show who it belongs to.',
    position: 'Always BEFORE the noun they modify.',
    explanation:
      'Possessive adjectives are always followed by a noun. They replace "the" and don\'t need an article. His/her refer to the owner\'s gender, not the noun\'s gender.',
    examples: [
      { sentence: 'My book is on the table.', note: '"my" → before noun "book".' },
      { sentence: 'Your phone is ringing.', note: '"your" → before noun "phone".' },
      { sentence: 'His car is red. Her car is blue.', note: '"his/her" match the OWNER, not the noun.' },
      { sentence: 'Our house is big. Their house is small.', note: '"our/their" for plural owners.' },
    ],
    mistakes: [
      '✗ "Is this book your?" → ✓ "Is this your book?" (possessive adj. before noun)',
      'Don\'t add apostrophe: ✗ "it\'s car" → ✓ "its car" ("it\'s" = "it is")',
      'Don\'t confuse with possessive pronouns: "my book" ≠ "mine"',
    ],
    fr: 'Adjectifs possessifs : my (mon/ma/mes), your (ton/votre), his (son — masc.), her (son — fém.), its (son — neutre), our (notre), their (leur). Attention : ils ne s\'accordent pas avec le nom.',
    quiz: [
      {
        q: 'She left _____ keys at home.',
        opts: ['she', 'her', 'hers', 'his'],
        correct: 1,
        exp: '"her" is the possessive adjective — before noun "keys". "Hers" is a possessive pronoun (replaces the noun entirely).',
      },
      {
        q: 'Which sentence is correct?',
        opts: [
          'The dog lost it\'s bone.',
          'The dog lost its bone.',
          'The dog lost her bone.',
          'The dog lost their bone.',
        ],
        correct: 1,
        exp: '"its" (no apostrophe) = possessive adjective. "it\'s" = "it is". The dog → use "its" (neutral).',
      },
    ],
  },

  // ── POSSESSIVE PRONOUNS ──────────────────────────────────────────────────
  {
    id: 'possessive_pronouns',
    title: 'Possessive Pronouns',
    icon: '💎',
    group: 'pronouns',
    definition: 'Possessive pronouns replace a noun and show ownership: mine, yours, his, hers, ours, theirs.',
    role: 'Stand alone — they replace the possessive adjective + noun entirely.',
    position: 'Usually after the verb (especially after "be"), or at the end of a clause.',
    explanation:
      'Possessive pronouns do NOT come before a noun — they replace the noun entirely. Compare: "my book" (adjective + noun) → "mine" (pronoun, alone).',
    examples: [
      { sentence: 'This book is mine.', note: '"mine" replaces "my book" — no noun follows.' },
      { sentence: 'That car is hers.', note: '"hers" replaces "her car".' },
      { sentence: 'The house is ours.', note: '"ours" replaces "our house".' },
      { sentence: 'Is this pen yours or mine?', note: 'Both pronouns replace their respective "pen".' },
    ],
    mistakes: [
      '✗ "This is mines." → ✓ "This is mine." (no -s)',
      '✗ "This is my." → ✓ "This is mine." (possessive adjective needs a noun)',
      '✗ "This is hers book." → ✓ "This is her book." (possessive adj.) OR "This book is hers." (possessive pronoun)',
    ],
    fr: 'Pronoms possessifs : mine (le mien), yours (le tien/vôtre), his (le sien — masc.), hers (le sien — fém.), ours (le nôtre), theirs (le leur). Ils remplacent tout le groupe nominal.',
    quiz: [
      {
        q: 'This bag is _____. (referring to my bag)',
        opts: ['my', 'me', 'mine', 'I'],
        correct: 2,
        exp: 'After "is", the possessive pronoun stands alone: "mine" (not "my", which needs a noun after it).',
      },
      {
        q: 'Our results are good. _____ are bad.',
        opts: ['Their', 'Theirs', 'Them', 'They'],
        correct: 1,
        exp: '"Theirs" is the possessive pronoun replacing "their results". It stands alone after "are".',
      },
    ],
  },

  // ── PHRASAL VERBS ────────────────────────────────────────────────────────
  {
    id: 'phrasal_verbs',
    title: 'Phrasal Verbs',
    icon: '🧩',
    group: 'verbs',
    definition: 'A phrasal verb is a verb + particle (preposition or adverb) that together create a new meaning.',
    role: 'Express common actions — the combined meaning is often different from the individual words.',
    position: 'The verb comes first; the particle follows. With an object, it can go between verb and particle (separable) or must follow (inseparable).',
    explanation:
      'Phrasal verbs are extremely common in everyday English. The particle changes the meaning completely: "get" + "up" = "get up" (wake up), "get" + "away" = "get away" (escape). You must learn them as fixed units.',
    examples: [
      { sentence: 'I listen to music every day.', note: '"listen to" = verb + preposition (fixed).' },
      { sentence: 'Put on your jacket.', note: '"put on" = wear. Separable: "Put your jacket on."' },
      { sentence: 'Pick up the phone.', note: '"pick up" = answer/lift. Separable: "Pick the phone up."' },
      { sentence: 'They set up the computer.', note: '"set up" = install/prepare. Separable.' },
      { sentence: 'He wants to get away.', note: '"get away" = escape. No object here (intransitive).' },
    ],
    mistakes: [
      'The meaning is NOT literal: "give up" ≠ give something up physically; it means "quit".',
      'Separable phrasal verbs: if object is a pronoun, it MUST go between verb and particle.',
      '✓ "Pick it up." ✗ "Pick up it."',
    ],
    fr: 'Les verbes à particule n\'ont pas d\'équivalent direct en français. Leur sens doit être mémorisé. Ex: "give up" = abandonner, "find out" = découvrir, "look up" = chercher (dans un dictionnaire).',
    quiz: [
      {
        q: 'What does "give up" mean?',
        opts: ['give a present', 'go up the stairs', 'quit / stop trying', 'give something higher'],
        correct: 2,
        exp: '"Give up" is a phrasal verb meaning to quit or stop trying. The meaning is not literal.',
      },
      {
        q: 'Which is correct with a pronoun object? "Pick _____ up."',
        opts: ['the phone', 'it', 'up it', 'them up it'],
        correct: 1,
        exp: 'With pronoun objects, the pronoun MUST go between verb and particle: "Pick it up." (not "Pick up it.")',
      },
    ],
  },

  // ── VERB + PREPOSITION ───────────────────────────────────────────────────
  {
    id: 'verb_preposition',
    title: 'Verb + Preposition',
    icon: '🔗',
    group: 'verbs',
    definition: 'Some verbs are always followed by a fixed preposition. These must be learned as a unit.',
    role: 'The preposition is part of the verb structure — you cannot replace or omit it.',
    position: 'Preposition comes directly after the verb, before the object.',
    explanation:
      'Unlike phrasal verbs, the preposition in "verb + preposition" combinations does not change the core meaning — but it is still fixed. Common examples: listen TO, wait FOR, look AT, depend ON, believe IN.',
    examples: [
      { sentence: 'I listen to music.', note: '"listen to" — always TO. ✗ "listen music"' },
      { sentence: 'She is waiting for you.', note: '"wait for" — always FOR. ✗ "wait you"' },
      { sentence: 'He looked at the picture.', note: '"look at" — always AT.' },
      { sentence: 'It depends on the weather.', note: '"depend on" — always ON.' },
    ],
    mistakes: [
      '✗ "I listen music." → ✓ "I listen to music." (cannot omit "to")',
      '✗ "She believes the project." → ✓ "She believes in the project."',
      'Different from phrasal verbs: the preposition does NOT create a new meaning here.',
    ],
    fr: 'En anglais, certains verbes imposent une préposition fixe : "listen TO" (pas "écouter de"), "wait FOR" (pas "attendre à"), "look AT" (pas "regarder de"). Ces combinaisons sont à mémoriser.',
    quiz: [
      {
        q: 'She always listens _____ classical music.',
        opts: ['at', 'to', 'for', 'on'],
        correct: 1,
        exp: '"Listen to" — the preposition "to" is always required with "listen" when specifying what you listen to.',
      },
      {
        q: 'We are looking forward _____ the holidays.',
        opts: ['for', 'at', 'to', 'in'],
        correct: 2,
        exp: '"Look forward to" is a fixed expression. "To" is required — and it is followed by a noun or -ing form.',
      },
    ],
  },
]

// ── GRAMMAR TABLES ────────────────────────────────────────────────────────────

export const PRONOUN_TABLE = {
  headers: ['Person', 'Subject', 'Object', 'Poss. Adjective', 'Poss. Pronoun'],
  rows: [
    ['1st singular', 'I', 'me', 'my', 'mine'],
    ['2nd singular', 'you', 'you', 'your', 'yours'],
    ['3rd singular (m)', 'he', 'him', 'his', 'his'],
    ['3rd singular (f)', 'she', 'her', 'her', 'hers'],
    ['3rd singular (n)', 'it', 'it', 'its', '—'],
    ['1st plural', 'we', 'us', 'our', 'ours'],
    ['2nd plural', 'you', 'you', 'your', 'yours'],
    ['3rd plural', 'they', 'them', 'their', 'theirs'],
  ],
}

export const SENTENCE_STRUCTURE_TABLE = {
  headers: ['Element', 'Question it answers', 'Position', 'Example'],
  rows: [
    ['Subject', 'Who / What?', 'Before verb', 'Sarah'],
    ['Verb', 'Does / Is?', 'After subject', 'reads'],
    ['Object', 'What? Whom?', 'After verb', 'a book'],
    ['Complement', 'What kind? How?', 'After linking verb', 'tired'],
    ['Adjective', 'What kind?', 'Before noun', 'big red'],
    ['Adverb', 'How / When / Where?', 'After verb / before adj.', 'quickly'],
  ],
}

export const KEY_RULES = [
  'English usually follows Subject + Verb + Object (S + V + O).',
  'The subject always comes BEFORE the verb.',
  'The object always comes AFTER the verb.',
  'Adjectives go BEFORE the noun (a big house — not "a house big").',
  'Possessive adjectives (my, your, his…) go BEFORE the noun.',
  'Possessive pronouns (mine, yours, his…) REPLACE the noun — they do NOT precede it.',
  'After a linking verb (be, seem, look, feel), use an ADJECTIVE, not an adverb.',
  'Subject pronouns (I, she, they…) go BEFORE the verb; object pronouns (me, her, them…) go AFTER.',
  'Phrasal verbs = verb + particle: the combined meaning is often different from the parts.',
  'Verb + preposition combinations (listen TO, wait FOR, depend ON) must be learned as fixed units.',
]

export const COMMON_PHRASAL_VERBS = [
  { verb: 'give up', meaning: 'quit, stop trying', example: 'She gave up smoking.' },
  { verb: 'find out', meaning: 'discover, learn', example: 'I found out the truth.' },
  { verb: 'look up', meaning: 'search for (in a dictionary/online)', example: 'Look up the word.' },
  { verb: 'put off', meaning: 'postpone', example: 'They put off the meeting.' },
  { verb: 'set up', meaning: 'establish, install', example: 'We set up the system.' },
  { verb: 'pick up', meaning: 'lift, collect, learn casually', example: 'She picked up French quickly.' },
  { verb: 'turn on/off', meaning: 'activate / deactivate', example: 'Turn on the lights.' },
  { verb: 'get along', meaning: 'have a good relationship', example: 'They get along well.' },
  { verb: 'run out of', meaning: 'have no more of something', example: 'We ran out of time.' },
  { verb: 'come across', meaning: 'find by chance', example: 'I came across an old photo.' },
]

export const COMMON_VERB_PREPOSITIONS = [
  { verb: 'listen to', example: 'I listen to music.' },
  { verb: 'wait for', example: 'She waited for an hour.' },
  { verb: 'look at', example: 'He looked at the board.' },
  { verb: 'depend on', example: 'It depends on the weather.' },
  { verb: 'believe in', example: 'She believes in herself.' },
  { verb: 'apply for', example: 'He applied for the job.' },
  { verb: 'apologize for', example: 'I apologize for the delay.' },
  { verb: 'care about', example: 'She cares about her students.' },
  { verb: 'agree with', example: 'I agree with you.' },
  { verb: 'consist of', example: 'The team consists of ten people.' },
]

export const GROUP_LABELS: Record<GrammarConcept['group'], string> = {
  'structure': 'Sentence Structure',
  'parts-of-speech': 'Parts of Speech',
  'pronouns': 'Pronouns & Possessives',
  'verbs': 'Verbs',
}
