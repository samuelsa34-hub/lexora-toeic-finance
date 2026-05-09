import type { Part6Passage } from '../types'

// ══════════════════════════════════════════════════════════════════════════════
// PART 6 — TEXT COMPLETION PASSAGES
// 8 original passages inspired by authentic TOEIC exam style.
// Each passage has 4 blanks. Blanks are marked {{1}} {{2}} {{3}} {{4}}.
// Blank types: grammar | vocabulary | collocation | connector | coherence
// ══════════════════════════════════════════════════════════════════════════════

export const part6Passages: Part6Passage[] = [

  // ── PASSAGE 1: Email — Delivery Delay Notification ───────────────────────
  {
    id: 1,
    title: 'Delivery Delay Notification',
    docType: 'email',
    difficulty: 'medium',
    topic: 'Customer service email — explaining a shipment delay and offering compensation',
    body: `Subject: Important Update Regarding Your Order #TW-4427

Dear Mr. Hoffmann,

We are writing to inform you that your recent order has been {{1}} delayed due to unexpected disruptions at our distribution centre in Lyon. We sincerely apologize for the inconvenience this may cause.

Your shipment is now {{2}} for arrival between Thursday and Friday of next week. We have arranged for expedited handling to ensure that your order reaches you as quickly as possible.

As compensation for the delay, a 15% discount code has been added to your account and will be {{3}} during your next checkout. You do not need to take any action for this to apply.

{{4}} you have any questions or wish to modify your delivery preferences, please do not hesitate to contact our customer service team at support@cargotech.com.

Sincerely,
Sara Dumont
Customer Relations Manager, CargoTech Logistics`,
    questions: [
      {
        number: 1,
        opts: ['temporary', 'temporarily', 'temporariness', 'temporize'],
        correct: 1,
        type: 'grammar',
        exp: '"Temporarily" is the adverb needed to modify the past participle "delayed". It tells us HOW the order was delayed — for a limited time.',
        optExps: [
          '"temporary" is an adjective. It cannot directly modify a past participle (verb form). You need an adverb here.',
          'Correct. "temporarily delayed" = adverb + past participle. The adverb "temporarily" modifies "delayed".',
          '"temporariness" is a noun. Nouns cannot modify verb forms. No grammatical role available here.',
          '"temporize" is a verb meaning to delay or stall. It has no place in this passive construction.',
        ],
        fr: '"Temporarily" est l\'adverbe qui modifie le participe passé "delayed". On a besoin d\'un adverbe, pas d\'un adjectif.',
      },
      {
        number: 2,
        opts: ['scheduled', 'programmed', 'planned', 'arranged'],
        correct: 0,
        type: 'collocation',
        exp: '"Scheduled for arrival" is the standard TOEIC business collocation for confirmed delivery timeframes. "Scheduled" implies an official, fixed time slot in a logistics system.',
        optExps: [
          'Correct. "scheduled for arrival" is the established logistics and business English expression. It implies an official timetable.',
          '"programmed for arrival" sounds technical/mechanical (robots are programmed; shipments are scheduled). Wrong register.',
          '"planned for arrival" is grammatically possible but not the idiomatic choice in logistics communication. "Scheduled" is more precise.',
          '"arranged for arrival" is not standard. "Arranged" is used for services (meetings, transport), not for delivery timeframes.',
        ],
        fr: '"Scheduled for arrival" est la collocation standard en anglais des affaires pour indiquer un horaire de livraison prévu.',
      },
      {
        number: 3,
        opts: ['active', 'activating', 'available', 'availability'],
        correct: 2,
        type: 'vocabulary',
        exp: '"Will be available" means the discount will be accessible and usable at checkout. It\'s the natural way to describe a benefit that becomes accessible at a certain point.',
        optExps: [
          '"active" could work in some contexts ("the code is active"), but "will be active during checkout" is less natural than "will be available".',
          '"activating" is a present participle. After "will be", you need an adjective or past participle, not a present participle.',
          'Correct. "will be available during your next checkout" = the discount code will be accessible for use. Natural and clear.',
          '"availability" is a noun. After "will be", you need an adjective, not a noun. "Will be availability" is not grammatical.',
        ],
        fr: '"Will be available" signifie que la réduction sera accessible et utilisable lors du prochain paiement.',
      },
      {
        number: 4,
        opts: ['Although', 'Since', 'Should', 'Unless'],
        correct: 2,
        type: 'connector',
        exp: '"Should you have any questions" uses formal conditional inversion. "Should" replaces "If" and moves to the front: "Should you..." = "If you should...". This is formal, polished business English.',
        optExps: [
          '"Although" is a concessive conjunction (despite the fact that). "Although you have any questions" creates a nonsensical sentence.',
          '"Since" means "because" or "from a point in time". Neither meaning fits a conditional offer of assistance.',
          'Correct. "Should you have any questions" = formal conditional inversion. Equivalent to "If you have any questions". Very common in professional correspondence.',
          '"Unless" means "except if" — it introduces a negative condition. "Unless you have questions" implies the opposite of what is intended.',
        ],
        fr: '"Should you have any questions" est une inversion conditionnelle formelle. "Should" remplace "If" en tête de phrase.',
      },
    ],
    linkedLessonId: 'conjunction',
    tags: ['email', 'logistics', 'passive', 'collocation', 'conditional', 'connector'],
  },

  // ── PASSAGE 2: Job Advertisement — HR Coordinator ────────────────────────
  {
    id: 2,
    title: 'HR Coordinator Position',
    docType: 'job_ad',
    difficulty: 'medium',
    topic: 'Job advertisement for a Human Resources Coordinator role',
    body: `Human Resources Coordinator — Full Time
Vancouver, BC | Nexagen Solutions

Nexagen Solutions is {{1}} for a motivated and detail-oriented Human Resources Coordinator to join our growing team at our Vancouver headquarters.

The ideal candidate will have a minimum of two years' experience in an HR role, strong organizational skills, and the ability to work {{2}} with minimal supervision. Familiarity with Canadian employment legislation is a significant advantage.

{{3}} will include managing employee records, coordinating the onboarding process for new hires, and supporting the HR manager with performance review cycles.

We offer a competitive salary, extended health benefits, and genuine opportunities for career growth. Only {{4}} candidates will be contacted for an interview. We thank all applicants for their interest.

To apply, send your CV and a covering letter to careers@nexagen.ca by Friday, May 2nd.`,
    questions: [
      {
        number: 1,
        opts: ['searching', 'looking', 'seeking', 'aiming'],
        correct: 1,
        type: 'collocation',
        exp: '"Is looking for" is the standard idiomatic expression used in job advertisements. It is the most natural and widely recognized collocation for recruitment contexts.',
        optExps: [
          '"searching for" is correct in general use, but less standard in formal job ad language. "Looking for" is the preferred TOEIC collocation.',
          'Correct. "is looking for" = the standard recruitment phrase. Found in virtually every TOEIC job advertisement question.',
          '"seeking" does not take "for" — you "seek a candidate", not "seek for a candidate". "is seeking for" is grammatically incorrect.',
          '"aiming for" means "targeting a goal", not "recruiting a person". Wrong meaning entirely.',
        ],
        fr: '"Is looking for" est l\'expression idiomatique standard dans les offres d\'emploi. "Seeking" ne prend pas de "for" après lui.',
      },
      {
        number: 2,
        opts: ['independence', 'independent', 'independently', 'independency'],
        correct: 2,
        type: 'grammar',
        exp: '"Independently" is the adverb required to modify the verb "work". The structure is: "ability to work [HOW]". Adverbs describe how an action is performed.',
        optExps: [
          '"independence" is a noun. You cannot say "work independence" — that would need a preposition: "work with independence".',
          '"independent" is an adjective. Adjectives modify nouns, not verbs. "Work independent" is incorrect.',
          'Correct. "work independently" = adverb + verb. "Independently" modifies the verb "work" and describes the manner of working.',
          '"independency" is a non-standard, rarely used form. It does not exist as a standard English word in business contexts.',
        ],
        fr: '"Independently" est l\'adverbe qui modifie le verbe "work". Les adverbes décrivent la manière dont une action est effectuée.',
      },
      {
        number: 3,
        opts: ['Responsible', 'Responsibly', 'Responsibility', 'Responsibilities'],
        correct: 3,
        type: 'grammar',
        exp: '"Responsibilities" (plural noun) is the subject of "will include". The plural is used because multiple duties are listed. This is standard job ad phrasing: "Responsibilities will include..."',
        optExps: [
          '"Responsible" is an adjective. Adjectives cannot be sentence subjects without a noun. "Responsible will include" is not grammatical.',
          '"Responsibly" is an adverb. Adverbs cannot be sentence subjects.',
          '"Responsibility" (singular) is grammatically possible, but the plural "Responsibilities" is standard when listing multiple duties, as here.',
          'Correct. "Responsibilities will include managing employee records, coordinating..." — plural noun as subject, listing multiple duties.',
        ],
        fr: '"Responsibilities" (nom pluriel) est le sujet de "will include". Le pluriel s\'impose car plusieurs tâches sont listées.',
      },
      {
        number: 4,
        opts: ['shortening', 'short-listed', 'shortlist', 'shortlisted'],
        correct: 3,
        type: 'vocabulary',
        exp: '"Shortlisted" means selected from a larger pool for final consideration. "Only shortlisted candidates will be contacted" is the standard closing line in professional job advertisements.',
        optExps: [
          '"shortening" is the present participle of "shorten" (to make shorter). Completely unrelated meaning.',
          '"short-listed" with a hyphen is an older variant of "shortlisted". In modern usage, the one-word form "shortlisted" is preferred.',
          '"shortlist" is a noun or verb ("the shortlist", "to shortlist someone"). As an adjective before "candidates", the past participle "shortlisted" is needed.',
          'Correct. "shortlisted candidates" = candidates who have been placed on a shortlist for final consideration. Standard TOEIC HR vocabulary.',
        ],
        fr: '"Shortlisted" = sélectionné(e) pour la liste restreinte des candidats retenus. Expression standard dans les offres d\'emploi.',
      },
    ],
    linkedLessonId: 'word_form',
    tags: ['job_ad', 'hr', 'adverb', 'collocation', 'word_form', 'vocabulary'],
  },

  // ── PASSAGE 3: Memo — Travel Expense Policy ───────────────────────────────
  {
    id: 3,
    title: 'Business Travel Policy Update',
    docType: 'memo',
    difficulty: 'medium',
    topic: 'HR memo updating the company travel reimbursement policy',
    body: `MEMORANDUM

To: All Sales and Operations Staff
From: Finance Department
Date: April 28th
Re: Revised Business Travel Policy — Effective June 1st

Please be advised that the company's business travel policy has been {{1}} with effect from June 1st. Going forward, all travel arrangements must be booked through the designated corporate platform, GlobalBusiness Travel, prior to any trip.

Employees who {{2}} travel independently without prior written approval from their department head will no longer be eligible for reimbursement. This policy applies to all travel categories, including flights, rail, hotel accommodation, and ground transportation.

Expense claims must be submitted within fifteen days of trip completion. Claims {{3}} after this deadline will not be processed and will be closed automatically.

We understand that these changes may require some {{4}} to your current working practices. Should you have any questions regarding the new procedures, please contact the Finance Department at extension 3040 or by email at finance@company.com.

Finance Department`,
    questions: [
      {
        number: 1,
        opts: ['revision', 'revising', 'revise', 'revised'],
        correct: 3,
        type: 'grammar',
        exp: '"Has been revised" is the present perfect passive: have/has + been + past participle. The policy (thing) was revised (by someone) — passive voice is correct here because the focus is on the policy, not on who revised it.',
        optExps: [
          '"revision" is a noun. "Has been revision" is not grammatical — you need a past participle after "has been".',
          '"revising" is a present participle. "Has been revising" would mean the policy is in the process of being revised — not completed.',
          '"revise" is the base form. "Has been revise" is grammatically impossible.',
          'Correct. "has been revised" = present perfect passive. The policy was updated. Focus on the result, not the actor.',
        ],
        fr: '"Has been revised" est le passif au present perfect: have/has + been + participe passé. La politique a été révisée.',
      },
      {
        number: 2,
        opts: ['which', 'whose', 'whom', 'who'],
        correct: 3,
        type: 'grammar',
        exp: '"Who" is the correct relative pronoun for people when it functions as the SUBJECT of the relative clause. "Employees who travel" — "who" replaces "employees" as the subject of "travel".',
        optExps: [
          '"which" is used for things, not people. "Employees which travel" is incorrect in standard formal English.',
          '"whose" indicates possession: "employees whose policies..." It would need a noun after it. "Employees whose travel independently" is wrong.',
          '"whom" is the object form of "who". Here, the relative pronoun is the subject of "travel", so the subject form "who" is needed.',
          'Correct. "Employees who travel independently" — "who" is the subject of the relative clause verb "travel". Refers to people.',
        ],
        fr: '"Who" est le pronom relatif pour les personnes quand il est SUJET du verbe de la relative. "Whom" est la forme objet.',
      },
      {
        number: 3,
        opts: ['submitted', 'submitting', 'to submit', 'submit'],
        correct: 0,
        type: 'grammar',
        exp: '"Claims submitted after this deadline" uses a reduced relative clause: "Claims [that are] submitted after this deadline". The past participle "submitted" replaces "that are submitted", creating a compact, formal construction common in legal and policy language.',
        optExps: [
          'Correct. "Claims submitted after this deadline" = reduced relative clause. "Submitted" is a past participle acting as an adjective modifying "Claims".',
          '"submitting" (present participle) would imply the claims are in the act of submitting themselves — wrong voice and meaning.',
          '"to submit" creates "Claims to submit after this deadline" = claims that need to be submitted. Wrong meaning — not about timing.',
          '"submit" is the base form. It cannot function as an adjective in this position.',
        ],
        fr: '"Claims submitted" est une relative réduite: "Claims [that are] submitted". Participe passé utilisé comme adjectif.',
      },
      {
        number: 4,
        opts: ['adjust', 'adjusted', 'adjusting', 'adjustment'],
        correct: 3,
        type: 'grammar',
        exp: '"May require some adjustment" — after "some", you need a noun. "Adjustment" is the noun form. "Some" is a determiner that precedes nouns (or noun phrases).',
        optExps: [
          '"adjust" is a verb. "Some adjust" is not grammatical — "some" precedes nouns, not verbs.',
          '"adjusted" is a past participle / adjective. "Some adjusted" would need a noun after it: "some adjusted practices".',
          '"adjusting" is a present participle. "Some adjusting" is possible informally but "some adjustment" is the formal, preferred form.',
          'Correct. "some adjustment to your current working practices" — noun after "some". "Require some adjustment" is a standard formal expression.',
        ],
        fr: '"May require some adjustment" — après "some", on a besoin d\'un nom. "Adjustment" est la forme nominale d\'"adjust".',
      },
    ],
    linkedLessonId: 'relative_clause',
    tags: ['memo', 'hr', 'passive', 'relative_clause', 'reduced_clause', 'word_form'],
  },

  // ── PASSAGE 4: Press Release — Product Launch ─────────────────────────────
  {
    id: 4,
    title: 'New Analytics Platform Launch',
    docType: 'press_release',
    difficulty: 'hard',
    topic: 'Press release announcing the launch of a business intelligence software product',
    body: `FOR IMMEDIATE RELEASE

DataCore Analytics Unveils Prism 3.0 — Next-Generation Business Intelligence Platform

SAN FRANCISCO — DataCore Analytics, a {{1}} provider of enterprise data solutions, today announced the official launch of Prism 3.0, the most advanced version of its flagship data visualization platform.

Designed for businesses of all sizes, Prism 3.0 allows users to transform complex datasets into clear, interactive dashboards with no prior coding experience required. The platform also {{2}} seamlessly with leading business tools including Salesforce, SAP, and Microsoft Azure.

"We designed Prism 3.0 with the real user in mind," said CEO Laura Hendricks. "{{3}}, our clients had to spend hours configuring integrations manually. With Prism 3.0, they are fully operational within minutes."

Prism 3.0 will be {{4}} to all new and existing clients starting March 1st. A free 30-day trial is also available at www.datacore.io/prism3.

For media inquiries, contact press@datacore.io.`,
    questions: [
      {
        number: 1,
        opts: ['lead', 'leader', 'leading', 'leaded'],
        correct: 2,
        type: 'grammar',
        exp: '"A leading provider" — "leading" is a present participle used as an adjective, meaning "most important" or "top-ranked". It is the standard TOEIC business adjective for market position.',
        optExps: [
          '"lead" as an adjective is used in compound nouns like "lead role" or "lead singer". "A lead provider" is not standard business English.',
          '"leader" is a noun. "A leader provider" stacks two nouns awkwardly — you need an adjective before "provider".',
          'Correct. "a leading provider" = adjective + noun. "Leading" (present participle as adjective) means foremost or most prominent. Very frequent in TOEIC press releases.',
          '"leaded" means containing lead (the metal) — e.g., "leaded petrol". Completely wrong meaning in this context.',
        ],
        fr: '"Leading" est un participe présent utilisé comme adjectif signifiant "de premier plan". "A leading provider" = un fournisseur de premier plan.',
      },
      {
        number: 2,
        opts: ['integration', 'integrated', 'integrating', 'integrates'],
        correct: 3,
        type: 'grammar',
        exp: '"Also integrates seamlessly" — third person singular simple present. The subject is "The platform" (singular). General truths and product features are expressed in simple present.',
        optExps: [
          '"integration" is a noun. "The platform also integration seamlessly" is not grammatical — you need a verb as the main predicate.',
          '"integrated" is past tense or past participle. The sentence would describe a past state, contradicting the present-tense launch announcement.',
          '"integrating" is a present participle. Without an auxiliary verb ("is integrating"), it cannot be the main verb of the sentence.',
          'Correct. "The platform also integrates seamlessly" — simple present, third person singular. Describes a current product feature.',
        ],
        fr: 'Simple présent à la 3e personne du singulier. "The platform integrates" car le sujet est singulier et on décrit une caractéristique actuelle du produit.',
      },
      {
        number: 3,
        opts: ['Therefore', 'Previously', 'Nevertheless', 'Although'],
        correct: 1,
        type: 'connector',
        exp: '"Previously, our clients had to spend hours..." — "previously" is a time adverb introducing a contrast between the past (before Prism 3.0) and the present. The CEO is making a before/after comparison.',
        optExps: [
          '"Therefore" signals a logical conclusion or result. "Therefore, our clients had to spend hours" implies hours of configuration is a conclusion — logically wrong.',
          'Correct. "Previously" = in the past / before now. Perfect for a before/after comparison in a product announcement. The next sentence contrasts with "now" (Prism 3.0).',
          '"Nevertheless" signals contrast/concession between two current or adjacent states. It does not introduce a past-vs-present timeline.',
          '"Although" is a subordinating conjunction. "Although, our clients..." with a comma is not standard — "although" must connect two clauses directly.',
        ],
        fr: '"Previously" = dans le passé / avant. Parfait pour introduire une comparaison avant/après dans un communiqué de lancement de produit.',
      },
      {
        number: 4,
        opts: ['available', 'availability', 'availably', 'avail'],
        correct: 0,
        type: 'vocabulary',
        exp: '"Will be available to all new and existing clients" — after the passive auxiliary "will be", use an adjective. "Available" = accessible, at someone\'s disposal. Standard business English for product releases.',
        optExps: [
          'Correct. "will be available to all clients" — adjective after auxiliary "will be". "Available" = accessible. Standard product launch language.',
          '"availability" is a noun. "Will be availability" is not grammatical — you cannot use a noun directly after "will be" without a determiner.',
          '"availably" is not a standard English word. It does not exist in business or general vocabulary.',
          '"avail" as a verb means to be useful (often reflexive: "avail oneself of"). "Will be avail" is grammatically incorrect.',
        ],
        fr: '"Will be available" — adjectif après l\'auxiliaire "will be". "Available" = accessible, disponible. Très courant dans les annonces de lancement.',
      },
    ],
    linkedLessonId: 'word_form',
    tags: ['press_release', 'technology', 'adjective', 'verb_tense', 'connector', 'time_adverb'],
  },

  // ── PASSAGE 5: Notice — Building Maintenance ──────────────────────────────
  {
    id: 5,
    title: 'Elevator Maintenance Notice',
    docType: 'notice',
    difficulty: 'easy',
    topic: 'Building notice informing tenants of weekend elevator maintenance',
    body: `NOTICE TO ALL TENANTS — PARKSIDE COMMERCIAL TOWER

Please {{1}} that essential maintenance work will be carried out on the building's elevator systems this coming weekend (Saturday and Sunday, March 22–23).

As a result, all elevators in Block A will be out of {{2}} for the full duration of the maintenance work. Tenants on floors 5 through 12 are kindly asked to use the emergency stairwell located next to the main reception area.

Building management has {{3}} all necessary health and safety precautions to ensure that the work is completed with minimal disruption. A qualified technician will be present on site throughout the weekend should any urgent issues {{4}}.

We thank you sincerely for your understanding and cooperation.

The Parkside Building Management Team`,
    questions: [
      {
        number: 1,
        opts: ['be noted', 'note', 'noting', 'noted'],
        correct: 1,
        type: 'grammar',
        exp: '"Please note that..." is the standard formal imperative used in notices. "Please" is followed by a base form verb. "Note" here = pay attention to / take note of.',
        optExps: [
          '"be noted" creates "Please be noted" — passive imperative that would mean "please cause yourself to be noticed". Grammatically awkward and wrong meaning.',
          'Correct. "Please note that..." = standard formal notice opening. "Please" + base form verb = polite imperative.',
          '"noting" is a present participle or gerund. "Please noting" is not grammatical — "please" requires a base form verb.',
          '"noted" is a past participle or past tense. "Please noted" is not grammatical for the same reason.',
        ],
        fr: '"Please note that..." est l\'impératif formel standard dans les notices. "Please" est suivi d\'un verbe à la base (infinitif sans "to").',
      },
      {
        number: 2,
        opts: ['use', 'order', 'service', 'function'],
        correct: 2,
        type: 'collocation',
        exp: '"Out of service" is the fixed collocation meaning "not functioning / unavailable for use". It is the standard expression for lifts, machines, and facilities that are temporarily non-operational.',
        optExps: [
          '"out of use" is also possible (and sometimes used in British English), but "out of service" is the dominant TOEIC and business English collocation for equipment.',
          '"out of order" is the most common British English expression for broken equipment. However, the blank is "out of [blank]", and "order" gives "out of order" which also works — but "service" is the standard TOEIC collocation.',
          'Correct. "out of service" = temporarily non-operational. The standard TOEIC collocation for elevators, machines, and facilities.',
          '"out of function" is not a standard English phrase. "Out of service" or "out of order" are the correct expressions.',
        ],
        fr: '"Out of service" = hors service. Collocation fixe standard pour indiquer qu\'un équipement est temporairement non opérationnel.',
      },
      {
        number: 3,
        opts: ['done', 'made', 'taken', 'put'],
        correct: 2,
        type: 'collocation',
        exp: '"Take precautions" is the fixed collocation in English. You always "take" precautions, never "make", "do", or "put" them. This is a verb-noun collocation that must be memorized.',
        optExps: [
          '"done precautions" — the verb "do" is not collocated with "precautions" in standard English.',
          '"made precautions" — "make" collocates with "decisions", "arrangements", "promises" — but not with "precautions".',
          'Correct. "has taken all necessary precautions" — "take precautions" is the fixed collocation. Compare: take action, take measures, take steps.',
          '"put precautions" — "put" is not collocated with "precautions" in any standard English usage.',
        ],
        fr: '"Take precautions" est la collocation fixe. On dit toujours "take" avec precautions, measures, steps, action.',
      },
      {
        number: 4,
        opts: ['arise', 'raise', 'rise', 'arises'],
        correct: 0,
        type: 'vocabulary',
        exp: '"Should any urgent issues arise" — "arise" means to come up / to appear / to occur (for problems, situations, questions). This is a formal subjunctive-like conditional: "should + issues + arise".',
        optExps: [
          'Correct. "issues arise" — "arise" is intransitive and means to come up or occur. "Should any issues arise" = formal conditional (if any issues come up).',
          '"raise" is transitive — it requires an object. "Issues raise" has no object and means "issues lift something". Wrong meaning and grammar.',
          '"rise" is intransitive like "arise" but means to physically go up (temperature rises, sun rises). Issues do not "rise" — they "arise".',
          '"arises" is the third person singular. But "should + base form" requires the base form "arise", not the conjugated "arises".',
        ],
        fr: '"Arise" = surgir, se poser (pour des problèmes, des questions). "Raise" est transitif (soulever qqch). "Rise" = monter physiquement.',
      },
    ],
    linkedLessonId: 'verb_tense',
    tags: ['notice', 'building', 'imperative', 'collocation', 'arise_raise_rise', 'vocabulary'],
  },

  // ── PASSAGE 6: Advertisement — Corporate Training ─────────────────────────
  {
    id: 6,
    title: 'Executive Communication Training',
    docType: 'advertisement',
    difficulty: 'medium',
    topic: 'Advertisement for a professional development and business communication training program',
    body: `Advance Your Team's Performance with Executive Communication Training

Is your organization {{1}} to communicate clearly and confidently in high-stakes business environments? The Geneva Language Institute offers tailored corporate training programs designed to help professionals at every level master written and spoken communication.

Our {{2}} program combines one-to-one coaching, interactive group workshops, and a digital learning platform available 24/7. All sessions are led by certified trainers with extensive international business experience.

Participants consistently report measurable improvements in their writing, presentation skills, and cross-cultural communication within just four weeks of {{3}} the program.

{{4}} now and receive your first individual consultation session completely free of charge.

To learn more or schedule a discovery call, visit www.genvalang.ch or call +41 22 710 4500.

The Geneva Language Institute — Precision. Confidence. Impact.`,
    questions: [
      {
        number: 1,
        opts: ['struggle', 'struggling', 'struggled', 'struggles'],
        correct: 1,
        type: 'grammar',
        exp: '"Is your organization struggling..." — present progressive, asking a rhetorical question about a current, ongoing problem. The structure "is + subject + present participle" = present progressive question.',
        optExps: [
          '"struggle" creates "Is your organization struggle..." — impossible. After the auxiliary "is", you need a present participle, not a base form.',
          'Correct. "Is your organization struggling...?" = present progressive interrogative. The progressive tense implies this is a current, ongoing challenge.',
          '"struggled" creates "Is your organization struggled..." — not standard. Would need "has your organization struggled" (present perfect) for a past-to-present question.',
          '"struggles" creates "Is your organization struggles..." — two finite verb forms cannot be stacked without a connector.',
        ],
        fr: '"Is your organization struggling?" = question au present progressif. "Is" + sujet + participe présent = interrogatif progressif.',
      },
      {
        number: 2,
        opts: ['comprehensively', 'comprehend', 'comprehension', 'comprehensive'],
        correct: 3,
        type: 'grammar',
        exp: '"Our comprehensive program" — adjective needed to modify the noun "program". "Comprehensive" = covering all aspects thoroughly. Position: adjective precedes noun.',
        optExps: [
          '"comprehensively" is an adverb. Adverbs cannot directly precede and modify nouns. "Our comprehensively program" is incorrect.',
          '"comprehend" is a verb. "Our comprehend program" is not grammatical.',
          '"comprehension" is a noun. Two nouns without a connector ("our comprehension program") creates a compound noun meaning a program about comprehension — not the intended meaning.',
          'Correct. "our comprehensive program" = determiner + adjective + noun. "Comprehensive" describes the all-inclusive nature of the training.',
        ],
        fr: '"Comprehensive" est l\'adjectif qui modifie "program". Les adverbes (-ly) ne peuvent pas précéder directement un nom.',
      },
      {
        number: 3,
        opts: ['completing', 'to complete', 'complete', 'completed'],
        correct: 0,
        type: 'grammar',
        exp: '"Within four weeks of completing the program" — after the preposition "of", you must use a gerund (-ing form). Prepositions are always followed by nouns or gerunds, never base infinitives.',
        optExps: [
          'Correct. "of completing" — preposition + gerund. The preposition "of" requires a gerund. "Within four weeks of completing" = within four weeks after they complete the program.',
          '"to complete" is an infinitive. "of to complete" — a preposition cannot be followed by an infinitive. This is one of the most common TOEIC traps.',
          '"complete" is the base form. "of complete" — a base form cannot follow a preposition.',
          '"completed" is a past participle or adjective. "of completed" is not standard here — you need the active gerund "completing".',
        ],
        fr: 'Après une préposition ("of"), on utilise toujours un gérondif (-ing). "of completing" est obligatoire. Jamais "of to complete".',
      },
      {
        number: 4,
        opts: ['Registering', 'Registration', 'Registered', 'Register'],
        correct: 3,
        type: 'grammar',
        exp: '"Register now and receive..." — imperative mood. Imperatives use the base form of the verb, with no subject. This is a direct call-to-action commonly seen in advertisements.',
        optExps: [
          '"Registering now and receive..." — mixing a present participle with an imperative creates a grammatically incomplete structure.',
          '"Registration now and receive..." — noun + "and receive" is not grammatical. You cannot join a noun and a verb with "and" this way.',
          '"Registered now and receive..." — past tense cannot be used for an imperative call-to-action.',
          'Correct. "Register now" = imperative (base form, no subject). "Register now and receive..." = two-part imperative: do X and get Y.',
        ],
        fr: 'L\'impératif utilise la base verbale sans sujet. "Register now" = impératif direct, appel à l\'action courant dans les publicités.',
      },
    ],
    linkedLessonId: 'gerund_infinitive',
    tags: ['advertisement', 'training', 'gerund', 'preposition', 'imperative', 'adjective'],
  },

  // ── PASSAGE 7: Announcement — New Regional Office ────────────────────────
  {
    id: 7,
    title: 'New Singapore Regional Office',
    docType: 'announcement',
    difficulty: 'medium',
    topic: 'Company announcement about opening a new regional headquarters in Singapore',
    body: `Triton Global Expands into Southeast Asia

Triton Global, the international supply chain solutions company, is pleased to {{1}} the official opening of its new regional headquarters in Singapore, effective September 1st.

The Singapore office will serve as Triton's {{2}} hub for all operations across Southeast Asia, overseeing supply chain networks in Thailand, Vietnam, Indonesia, Malaysia, and the Philippines.

"This expansion {{3}} our long-term commitment to the Asian market," said Group CEO Martin Webb. "Singapore's strategic location, world-class infrastructure, and pro-business regulatory environment make it the ideal base for our next phase of international growth."

The new office will {{4}} a team of 25 employees at launch, with plans to scale to over 90 staff within three years as regional operations expand.

For media inquiries, contact press@tritonglobal.com.`,
    questions: [
      {
        number: 1,
        opts: ['announcing', 'announcement', 'announced', 'announce'],
        correct: 3,
        type: 'grammar',
        exp: '"Is pleased to announce" — after "to" (infinitive marker following an adjective: pleased to + verb), you need the base form of the verb. "Pleased to announce" is the standard formal expression for making official corporate announcements.',
        optExps: [
          '"announcing" is a gerund/present participle. "Is pleased to announcing" — after "to" as an infinitive marker, a gerund is incorrect.',
          '"announcement" is a noun. "Is pleased to announcement" — a noun cannot follow an infinitive marker "to" in this structure.',
          '"announced" is a past participle. "Is pleased to announced" — the infinitive marker "to" must be followed by a base form, not a past participle.',
          'Correct. "is pleased to announce" = adjective (pleased) + to + base form (announce). Standard corporate announcement formula.',
        ],
        fr: '"Is pleased to announce" — après "to" (marqueur d\'infinitif), on utilise la base verbale. C\'est la formule standard pour les annonces officielles.',
      },
      {
        number: 2,
        opts: ['primarily', 'primal', 'primary', 'primed'],
        correct: 2,
        type: 'grammar',
        exp: '"Primary hub" — adjective needed before the noun "hub". "Primary" = first in importance, main. Position: determiner + adjective + noun.',
        optExps: [
          '"primarily" is an adverb. "Triton\'s primarily hub" — adverbs cannot directly modify nouns. You need an adjective here.',
          '"primal" means primitive or relating to the earliest stage of existence (primal instincts, primal fears). Wrong meaning in a business context.',
          'Correct. "Triton\'s primary hub" = possessive + adjective + noun. "Primary" = most important, main, chief. Standard business English.',
          '"primed" means prepared or made ready. "Triton\'s primed hub" is not standard business English and changes the meaning.',
        ],
        fr: '"Primary" est l\'adjectif qui modifie "hub". "Primarily" est un adverbe et ne peut pas précéder directement un nom.',
      },
      {
        number: 3,
        opts: ['Reflection', 'Reflected', 'Reflecting', 'Reflects'],
        correct: 3,
        type: 'grammar',
        exp: '"This expansion reflects our long-term commitment" — simple present, third person singular. The subject "This expansion" is singular. Simple present is used for statements of fact, current company values, and ongoing commitments.',
        optExps: [
          '"Reflection" is a noun. "This expansion reflection" — two nouns without a verb creates a fragment, not a complete sentence.',
          '"Reflected" is past tense. The CEO is making a present-tense statement about the company\'s ongoing commitment, not a past event.',
          '"Reflecting" is a present participle. "This expansion reflecting our commitment" — without an auxiliary, this is a participial phrase, not a main clause.',
          'Correct. "This expansion reflects our commitment" — simple present, third person singular ("-s" ending). General truth statement.',
        ],
        fr: 'Simple présent à la 3e personne du singulier. "Reflects" car le sujet "This expansion" est singulier et on énonce un fait présent.',
      },
      {
        number: 4,
        opts: ['employment', 'employ', 'employing', 'employed'],
        correct: 1,
        type: 'grammar',
        exp: '"Will employ a team of 25" — after the modal "will", use the base form. "Will + base form" = simple future. "Employ" here means to have as employees / to staff.',
        optExps: [
          '"employment" is a noun. "Will employment a team" is not grammatical — modals are followed by base form verbs, not nouns.',
          'Correct. "will employ a team of 25" — modal + base form = future simple. "Employ" = to have or give work to. "The office will employ 25 people" is natural.',
          '"employing" is a present participle. "Will employing" is not grammatical — modals cannot be followed by present participles.',
          '"employed" is a past participle. "Will employed" is not grammatical — modals require the base form, not past participles.',
        ],
        fr: '"Will employ" — après un modal ("will"), on utilise la base verbale. "Will + base form" = futur simple.',
      },
    ],
    linkedLessonId: 'verb_tense',
    tags: ['announcement', 'business', 'infinitive', 'adjective', 'simple_present', 'modal'],
  },

  // ── PASSAGE 8: Business Update — Quarterly Results ────────────────────────
  {
    id: 8,
    title: 'Q3 Financial Results Update',
    docType: 'business_update',
    difficulty: 'hard',
    topic: 'CEO letter to stakeholders summarizing quarterly financial performance',
    body: `Q3 Financial Results — Message from the Chief Executive Officer

Dear Stakeholders,

I am delighted to share that Greenfield Industries has {{1}} another quarter of strong financial performance. Our total revenue for Q3 reached €48.3 million, {{2}} a 12% increase compared to the same period last year.

This growth has been driven primarily by the expansion of our product line in the European consumer market and the successful integration of EuroFlex GmbH, the German logistics company {{3}} in January.

We remain {{4}} that our continued investment in product innovation, talent development, and strategic partnerships will generate sustained long-term value for our shareholders.

A full breakdown of Q3 results, including regional performance data and updated full-year guidance, will be presented at the annual investors' meeting on November 18th.

Sincerely,
James O'Brien
Chief Executive Officer, Greenfield Industries`,
    questions: [
      {
        number: 1,
        opts: ['delivery', 'delivering', 'deliver', 'delivered'],
        correct: 3,
        type: 'grammar',
        exp: '"Has delivered another quarter" — present perfect, third person singular: have/has + past participle. The company (singular subject) has achieved this result in the recent past with current relevance.',
        optExps: [
          '"delivery" is a noun. "Has delivery" is not grammatical — the auxiliary "has" must be followed by a past participle, not a noun.',
          '"delivering" is a present participle. "Has delivering" is not grammatical — present perfect requires past participle, not present participle.',
          '"deliver" is the base form. "Has deliver" is not grammatical — the auxiliary "has" requires a past participle.',
          'Correct. "has delivered" = present perfect (has + past participle). Used to describe a recent achievement with ongoing relevance to the present.',
        ],
        fr: '"Has delivered" = present perfect (has + participe passé). Utilisé pour des réalisations récentes avec une pertinence présente.',
      },
      {
        number: 2,
        opts: ['represent', 'represented', 'representation', 'representing'],
        correct: 3,
        type: 'grammar',
        exp: '"Reaching €48 million, representing a 12% increase" — "representing" is a present participle introducing a non-restrictive participial phrase. It describes a consequence or implication of the preceding clause.',
        optExps: [
          '"represent" is the base form. "€48 million, represent a 12% increase" — a base form cannot introduce a participial phrase without an auxiliary.',
          '"represented" is a past participle. "€48 million, represented a 12% increase" is grammatically incorrect in this construction.',
          '"representation" is a noun. "€48 million, representation a 12% increase" is not grammatical — a noun cannot connect to a clause this way.',
          'Correct. "reaching €48 million, representing a 12% increase" — present participle phrase. "Representing" = which represents / amounting to. Standard in financial reporting.',
        ],
        fr: '"Representing" est un participe présent introduisant une proposition participiale. Courant dans les rapports financiers: "atteindre X€, représentant une hausse de Y%".',
      },
      {
        number: 3,
        opts: ['acquiring', 'acquired', 'to acquire', 'acquisition'],
        correct: 1,
        type: 'grammar',
        exp: '"EuroFlex GmbH, the German logistics company acquired in January" — reduced relative clause. "Acquired" (past participle) replaces "that was acquired". The company was acquired (passive) — past participle is correct.',
        optExps: [
          '"acquiring" (present participle) implies EuroFlex is actively acquiring something. Wrong voice — EuroFlex was acquired (passive), not acquiring (active).',
          'Correct. "the company acquired in January" = reduced relative clause. "Acquired" = past participle replacing "that was acquired". Passive, which is correct: Greenfield acquired EuroFlex.',
          '"to acquire" creates "the company to acquire in January" — this implies the company intends to acquire something in the future. Wrong tense and meaning.',
          '"acquisition" is a noun. "the company acquisition in January" is a noun phrase implying "the company\'s acquisition" — but the possessive form would be needed: "the company\'s acquisition".',
        ],
        fr: '"Company acquired in January" = relative réduite. "Acquired" remplace "that was acquired". Le passif s\'impose: Greenfield a acquis EuroFlex.',
      },
      {
        number: 4,
        opts: ['confiding', 'confidence', 'confident', 'confidently'],
        correct: 2,
        type: 'grammar',
        exp: '"We remain confident that..." — after the linking verb "remain", use a predicate adjective. "Remain" functions like "be" here: subject + linking verb + adjective. "Confident that + clause" = standard structure.',
        optExps: [
          '"confiding" is a present participle or gerund. "We remain confiding" = we remain telling secrets. Wrong meaning entirely.',
          '"confidence" is a noun. "We remain confidence" — a noun cannot follow a linking verb as a predicate without "in": "we remain in confidence".',
          'Correct. "We remain confident that..." — linking verb + predicate adjective. "Remain" = stay, continue to be. "Confident that" + clause = standard formal English.',
          '"confidently" is an adverb. "We remain confidently" — adverbs do not follow linking verbs as predicates. You need an adjective (confident).',
        ],
        fr: '"Remain" est un verbe copule (comme "be"). Il est suivi d\'un adjectif attribut: "remain confident". Pas d\'adverbe après un verbe copule.',
      },
    ],
    linkedLessonId: 'word_form',
    tags: ['business_update', 'finance', 'present_perfect', 'participial_phrase', 'reduced_clause', 'linking_verb'],
  },

]

// ── Lookup helpers ─────────────────────────────────────────────────────────────

export const PART6_BY_ID: Record<number, Part6Passage> = Object.fromEntries(
  part6Passages.map(p => [p.id, p])
)

export const PART6_BY_DOC_TYPE: Partial<Record<string, Part6Passage[]>> = part6Passages.reduce(
  (acc, p) => {
    if (!acc[p.docType]) acc[p.docType] = []
    acc[p.docType]!.push(p)
    return acc
  },
  {} as Partial<Record<string, Part6Passage[]>>
)

export const DOC_TYPE_LABELS: Record<string, string> = {
  email:           'Email',
  memo:            'Memo',
  press_release:   'Press Release',
  job_ad:          'Job Ad',
  notice:          'Notice',
  advertisement:   'Advertisement',
  announcement:    'Announcement',
  business_update: 'Business Update',
}

export const DOC_TYPE_ICONS: Record<string, string> = {
  email:           '📧',
  memo:            '📋',
  press_release:   '📰',
  job_ad:          '💼',
  notice:          '📌',
  advertisement:   '📣',
  announcement:    '🏢',
  business_update: '📊',
}

export const BLANK_TYPE_LABELS: Record<string, string> = {
  grammar:     'Grammar',
  vocabulary:  'Vocabulary',
  collocation: 'Collocation',
  connector:   'Connector',
  coherence:   'Coherence',
}

export const BLANK_TYPE_COLORS: Record<string, string> = {
  grammar:     '#6366F1',
  vocabulary:  '#10B981',
  collocation: '#F59E0B',
  connector:   '#F43F5E',
  coherence:   '#0EA5E9',
}
