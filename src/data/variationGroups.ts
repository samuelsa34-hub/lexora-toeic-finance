// ── Variation Groups ──────────────────────────────────────────────────────────
// Prewritten "repair drill" banks. Each group targets a specific grammar rule,
// trap type, or collocation pattern. When a student answers a question wrong,
// the system finds the closest group and surfaces 3–5 focused variations so
// the student practices the same rule in different sentence contexts.

export interface VariationQ {
  id: string
  q: string
  opts: [string, string, string, string]
  correct: number        // 0-3
  exp: string
  fr?: string
}

export interface VariationGroup {
  id: string
  name: string           // display name
  rule: string           // the rule being tested
  // matching keys — any match triggers this group
  cats: string[]         // GrammarQuestion.cat values
  trapTypes: string[]    // GrammarQuestion.trapType substrings (lowercased)
  keywords: string[]     // subtopic substrings (lowercased)
  questions: VariationQ[]
}

export const variationGroups: VariationGroup[] = [

  // ─────────────────────────────────────────────────────────────────────────
  // MODAL VERBS
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: 'vg_wish_could',
    name: 'I wish + could',
    rule: 'I wish + subject + could + base verb (unreal present wish)',
    cats: ['modal_verbs'],
    trapTypes: ['wish', 'could'],
    keywords: ['wish', 'could', 'unreal'],
    questions: [
      {
        id: 'wc1', q: 'She wishes she ___ travel to Europe more often.',
        opts: ['can', 'could', 'will', 'would be'], correct: 1,
        exp: '"I wish + could" expresses an unreal present wish. "Can" is present tense (real ability). "Could" marks the wish as imaginary.',
        fr: '"I wish + could + verbe" exprime un souhait irréel au présent. "Could" = conditionnel, marqueur d\'irréalité.',
      },
      {
        id: 'wc2', q: 'They wish they ___ speak fluent Mandarin for the Shanghai meeting.',
        opts: ['can', 'could', 'will', 'would'], correct: 1,
        exp: '"I wish + could" for unreal present ability. "Would" can follow "wish" only with a direct object ("I wish you would call"), not for a subject\'s own ability.',
        fr: '"Could" exprime la capacité irréelle souhaitée. "Would" s\'utilise différemment avec "wish".',
      },
      {
        id: 'wc3', q: 'I wish I ___ attend the conference in Singapore next month.',
        opts: ['can', 'could', 'will', 'am able to'], correct: 1,
        exp: '"Wish + could" for an unreal present/future wish. "Will" is factual future, incompatible with the "wish" unreal mood.',
        fr: '"Will" indique un futur réel; "could" après "wish" indique un souhait irréalisable.',
      },
      {
        id: 'wc4', q: 'We wish we ___ stay at the resort longer, but we have flights to catch.',
        opts: ['can', 'could', 'will', 'shall'], correct: 1,
        exp: '"Wish + could" for an unreal wish about a current situation. "Shall" is formal future/suggestion, not unreal mood.',
        fr: 'Même structure: "wish" + sujet + "could" + infinitif. "Shall" n\'exprime pas l\'irréalité.',
      },
      {
        id: 'wc5', q: 'He wishes he ___ join the project team — his schedule is fully booked.',
        opts: ['can', 'could', 'will', 'might'], correct: 1,
        exp: '"Might" expresses weak possibility ("maybe"), not an unreal wish. After "wish", use "could" for unreal ability.',
        fr: '"Might" = peut-être; "could" après "wish" = souhait irréalisable. Distinction essentielle.',
      },
    ],
  },

  {
    id: 'vg_will_be_able_to',
    name: 'will + be able to',
    rule: '"will be able to" = future ability (not "will can")',
    cats: ['modal_verbs', 'future_ability'],
    trapTypes: ['be able to', 'future ability', 'will can'],
    keywords: ['be able to', 'future ability', 'can vs will'],
    questions: [
      {
        id: 'wbat1', q: 'She will ___ present the final report at next month\'s board meeting.',
        opts: ['can', 'be able to', 'could', 'able to'], correct: 1,
        exp: '"Will + be able to" = future ability. "Will can" is grammatically impossible in English. "Be able to" is the infinitive form used with modals.',
        fr: '"Will can" est impossible. On dit "will be able to" = sera capable de.',
      },
      {
        id: 'wbat2', q: 'Once the new system is installed, our team will ___ process orders twice as fast.',
        opts: ['can', 'be able to', 'could', 'able'], correct: 1,
        exp: '"Will be able to" for future ability. After "will", the base form is "be able to" — never "can".',
        fr: 'Après "will", impossible d\'utiliser "can". On utilise "be able to" comme infinitif de "can".',
      },
      {
        id: 'wbat3', q: 'The technician says he will ___ fix the server before end of day.',
        opts: ['can', 'be able to', 'could', 'able'], correct: 1,
        exp: '"Will be able to" expresses future ability. "Could" suggests past ability or a conditional, not definite future.',
        fr: '"Could" = capacité passée ou conditionnel; "will be able to" = capacité future confirmée.',
      },
      {
        id: 'wbat4', q: 'With more training, the interns will ___ handle client calls independently.',
        opts: ['can', 'be able to', 'could', 'capable'], correct: 1,
        exp: '"Capable" is an adjective and needs "be + capable of", not "will capable". The correct future ability form is "will be able to".',
        fr: '"Capable" est adjectif; seul "will be able to" fonctionne comme auxiliaire de capacité future.',
      },
      {
        id: 'wbat5', q: 'The software update means customers will ___ track their shipments in real time.',
        opts: ['can', 'be able to', 'could', 'able to'], correct: 1,
        exp: '"Will + be able to" for future ability. "Able to" alone (without "be") is not a complete modal form.',
        fr: '"Able to" seul n\'est pas grammatical. Il faut "be able to" après "will".',
      },
    ],
  },

  {
    id: 'vg_should_have_done',
    name: 'should have + past participle',
    rule: '"should have + PP" = past obligation not fulfilled / criticism of past action',
    cats: ['modal_verbs'],
    trapTypes: ['should have', 'past modal', 'unfulfilled obligation'],
    keywords: ['should have', 'past obligation', 'criticism'],
    questions: [
      {
        id: 'shd1', q: 'He ___ informed his manager about the issue before it escalated.',
        opts: ['should inform', 'should has informed', 'should have informed', 'should informing'], correct: 2,
        exp: '"Should have + past participle" expresses that an action was expected but did not happen. "Should has" is wrong — modals don\'t conjugate.',
        fr: '"Should have + participe passé" = aurait dû faire. Le modal "should" reste invariable.',
      },
      {
        id: 'shd2', q: 'The team ___ submitted their proposal at least a week before the deadline.',
        opts: ['should submit', 'should have submitted', 'should has submitted', 'should submitting'], correct: 1,
        exp: '"Should have + PP" for a past action that was expected but didn\'t happen. "Should submit" is present/future obligation.',
        fr: '"Should have submitted" = aurait dû soumettre (dans le passé). "Should submit" = obligation présente/future.',
      },
      {
        id: 'shd3', q: 'We ___ confirmed the reservation in advance to avoid the confusion.',
        opts: ['should confirm', 'should has confirmed', 'should confirming', 'should have confirmed'], correct: 3,
        exp: '"Should have confirmed" = it was the right thing to do but we didn\'t do it. The structure is modal + have + past participle.',
        fr: 'Aurait dû confirmer. Structure : modal + have + participe passé. Jamais "modal + has".',
      },
      {
        id: 'shd4', q: 'She ___ consulted the legal department before signing the contract.',
        opts: ['should consult', 'should has consulted', 'should have consulted', 'should consulting'], correct: 2,
        exp: '"Should have consulted" = the consultation was expected/necessary but did not occur. This expresses a past regret or criticism.',
        fr: 'Regret ou critique sur une action passée non accomplie. "Should have + PP".',
      },
      {
        id: 'shd5', q: 'The assistant ___ double-checked the figures before sending the report.',
        opts: ['should double-check', 'should have double-checked', 'should has double-checked', 'should double-checking'], correct: 1,
        exp: '"Should have double-checked" indicates that double-checking was the right thing to do, but it wasn\'t done.',
        fr: 'Critique d\'une omission passée. "Should have + participe passé" est la seule forme correcte.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CONNECTORS
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: 'vg_contrast_connectors',
    name: 'Contrast: nevertheless / however',
    rule: 'Contrast connectors (nevertheless, however, nonetheless) join two opposite ideas',
    cats: ['connector'],
    trapTypes: ['connector', 'contrast', 'wrong_connector'],
    keywords: ['nevertheless', 'however', 'nonetheless', 'contrast', 'concession'],
    questions: [
      {
        id: 'cc1', q: 'The report was lengthy; ___, it contained all the essential information.',
        opts: ['therefore', 'moreover', 'nevertheless', 'consequently'], correct: 2,
        exp: '"Nevertheless" (= despite that) links two contrasting ideas: long report, but useful. "Therefore/consequently" show cause-effect, not contrast.',
        fr: '"Nevertheless" = néanmoins, cependant. Relie deux idées contrastées. "Therefore" = donc (résultat).',
      },
      {
        id: 'cc2', q: 'The product is expensive; ___, demand has continued to grow steadily.',
        opts: ['therefore', 'additionally', 'consequently', 'however'], correct: 3,
        exp: '"However" (= but, in contrast) links expensive price with surprising high demand. "Therefore/consequently" show result, not contrast.',
        fr: '"However" = cependant, pourtant. Exprime une opposition entre deux idées.',
      },
      {
        id: 'cc3', q: 'The project ran significantly over budget; ___, the client was satisfied with the outcome.',
        opts: ['therefore', 'moreover', 'consequently', 'nonetheless'], correct: 3,
        exp: '"Nonetheless" (= nevertheless, in spite of that) links budget overrun with client satisfaction — a surprising contrast.',
        fr: '"Nonetheless" = néanmoins. Exprime que le résultat est surprenant malgré la situation.',
      },
      {
        id: 'cc4', q: 'The new hire lacked experience; ___, she adapted to the role remarkably quickly.',
        opts: ['therefore', 'consequently', 'however', 'additionally'], correct: 2,
        exp: '"However" links her lack of experience (negative) with her quick adaptation (positive) — a contrast.',
        fr: 'Contraste entre deux faits opposés → "however" (cependant). "Consequently" = résultat logique.',
      },
      {
        id: 'cc5', q: 'The storm caused significant delays; ___, all shipments arrived before the deadline.',
        opts: ['moreover', 'therefore', 'nevertheless', 'additionally'], correct: 2,
        exp: '"Nevertheless" = despite the storm delays, all shipments arrived on time. The two halves are in contrast.',
        fr: '"Nevertheless" relie une difficulté et un résultat positif inattendu. "Moreover" = de plus (ajout).',
      },
    ],
  },

  {
    id: 'vg_cause_result_connectors',
    name: 'Result: therefore / consequently / as a result',
    rule: '"therefore / consequently / as a result" show logical cause → effect',
    cats: ['connector'],
    trapTypes: ['connector', 'cause result', 'wrong_connector'],
    keywords: ['therefore', 'consequently', 'as a result', 'cause', 'result'],
    questions: [
      {
        id: 'cr1', q: 'Demand for the product increased significantly; ___, the factory expanded its production line.',
        opts: ['however', 'nevertheless', 'therefore', 'although'], correct: 2,
        exp: '"Therefore" shows a logical consequence: increased demand → factory expansion. "However/nevertheless" express contrast, not result.',
        fr: '"Therefore" = par conséquent. Indique un résultat logique. "However" = en revanche (contraste).',
      },
      {
        id: 'cr2', q: 'The CEO resigned unexpectedly; ___, the board appointed a temporary replacement.',
        opts: ['although', 'however', 'consequently', 'despite'], correct: 2,
        exp: '"Consequently" links the resignation (cause) with the board\'s action (effect). "Although/despite" introduce concession, not result.',
        fr: '"Consequently" = par conséquent. La démission entraîne logiquement le remplacement.',
      },
      {
        id: 'cr3', q: 'The supplier failed to meet the delivery deadline; ___, the launch had to be postponed.',
        opts: ['however', 'moreover', 'therefore', 'nonetheless'], correct: 2,
        exp: '"Therefore" or "as a result" show that the failure caused the postponement. "However" would show contrast (but the launch still happened).',
        fr: 'Cause : le fournisseur n\'a pas livré. Effet : report du lancement. → "therefore".',
      },
      {
        id: 'cr4', q: 'The team completed the audit three days early; ___, management gave them the Friday afternoon off.',
        opts: ['however', 'as a result', 'nevertheless', 'although'], correct: 1,
        exp: '"As a result" = because of completing early, they received free time. Clear cause-and-effect, not contrast.',
        fr: '"As a result" = en résultat, par conséquent. Résultat direct d\'une action précédente.',
      },
      {
        id: 'cr5', q: 'The new marketing strategy proved highly effective; ___, sales increased by 40%.',
        opts: ['however', 'despite', 'consequently', 'although'], correct: 2,
        exp: '"Consequently" links effective strategy (cause) with sales increase (effect). "Despite" requires a noun/gerund, not a clause.',
        fr: '"Consequently" = en conséquence. "Despite" = malgré, suivi d\'un nom ou d\'un gérondif.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // GERUND / INFINITIVE
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: 'vg_gerund_enjoy_finish',
    name: 'Gerund after enjoy / finish / suggest',
    rule: 'enjoy, finish, suggest, avoid, consider, keep + gerund (-ing)',
    cats: ['gerund_infinitive'],
    trapTypes: ['gerund', 'enjoy', 'finish', 'suggest', 'avoid', 'consider'],
    keywords: ['gerund', 'enjoy', 'finish', 'suggest', 'avoid', 'consider', 'keep'],
    questions: [
      {
        id: 'gef1', q: 'The consultant suggested ___ the project timeline into shorter phases.',
        opts: ['divide', 'to divide', 'dividing', 'divided'], correct: 2,
        exp: '"Suggest" is always followed by gerund (verb+-ing). "Suggest to divide" is a common error but grammatically wrong.',
        fr: '"Suggest" + gérondif. Erreur fréquente : "suggest to + infinitif" est incorrect.',
      },
      {
        id: 'gef2', q: 'The team finished ___ the quarterly report just before the deadline.',
        opts: ['prepare', 'to prepare', 'preparation', 'preparing'], correct: 3,
        exp: '"Finish" takes a gerund: "finish preparing". "Finish to prepare" is incorrect.',
        fr: '"Finish" + gérondif. "Finish to prepare" est une erreur typique.',
      },
      {
        id: 'gef3', q: 'The HR manager recommended ___ flexible working arrangements for all departments.',
        opts: ['introduce', 'to introduce', 'introducing', 'introduction'], correct: 2,
        exp: '"Recommend" (like suggest) is followed by a gerund. "Introduction" is a noun and needs a different structure.',
        fr: '"Recommend" + gérondif. "Introduction" est un nom, pas une forme verbale utilisable ici.',
      },
      {
        id: 'gef4', q: 'She enjoys ___ with international clients during overseas assignments.',
        opts: ['work', 'to work', 'working', 'worked'], correct: 2,
        exp: '"Enjoy" always takes a gerund. "Enjoy to work" is incorrect in English.',
        fr: '"Enjoy" + gérondif obligatoire. "Enjoy to work" = erreur typique francophone.',
      },
      {
        id: 'gef5', q: 'The committee considered ___ the event to a larger venue due to high demand.',
        opts: ['move', 'to move', 'moved', 'moving'], correct: 3,
        exp: '"Consider" takes a gerund: "consider moving". "Consider to move" is a common but incorrect form.',
        fr: '"Consider" + gérondif. "Consider to move" est une erreur fréquente.',
      },
    ],
  },

  {
    id: 'vg_infinitive_decide_plan',
    name: 'Infinitive after decide / plan / want',
    rule: 'decide, plan, want, hope, need, agree, expect + to + infinitive',
    cats: ['gerund_infinitive'],
    trapTypes: ['infinitive', 'decide', 'plan', 'want', 'hope', 'expect'],
    keywords: ['infinitive', 'decide', 'plan', 'want', 'agree', 'expect', 'hope'],
    questions: [
      {
        id: 'idp1', q: 'The management team decided ___ the launch date by two weeks.',
        opts: ['postponing', 'to postpone', 'postponed', 'postpone'], correct: 1,
        exp: '"Decide" takes the infinitive (to + verb). "Decide postponing" is incorrect.',
        fr: '"Decide" + infinitif (to + verbe). "Decide postponing" est incorrect.',
      },
      {
        id: 'idp2', q: 'The company plans ___ a new research center in the coming fiscal year.',
        opts: ['opening', 'to open', 'open', 'opened'], correct: 1,
        exp: '"Plan" takes the infinitive: "plan to open". "Plan opening" is incorrect.',
        fr: '"Plan" + infinitif. "Plan opening" est une erreur courante.',
      },
      {
        id: 'idp3', q: 'Both parties agreed ___ a neutral third-party mediator for the dispute.',
        opts: ['appointing', 'appointed', 'to appoint', 'appoint'], correct: 2,
        exp: '"Agree" is followed by the infinitive: "agree to appoint". "Agree appointing" is wrong.',
        fr: '"Agree" + infinitif. "Agree appointing" est incorrect.',
      },
      {
        id: 'idp4', q: 'The operations director needs ___ the budget forecast before the shareholders\' meeting.',
        opts: ['reviewing', 'to review', 'reviewed', 'review'], correct: 1,
        exp: '"Need" followed by the infinitive: "need to review". (Note: "need" + gerund = passive meaning, e.g. "the report needs reviewing.")',
        fr: '"Need to + infinitif" = besoin actif. "Need + gérondif" = besoin passif ("need reviewing" = besoin d\'être relu).',
      },
      {
        id: 'idp5', q: 'The supplier expects ___ the full order by the end of the month.',
        opts: ['delivering', 'to deliver', 'delivered', 'deliver'], correct: 1,
        exp: '"Expect" takes the infinitive: "expect to deliver". "Expect delivering" is incorrect.',
        fr: '"Expect" + infinitif. Même logique que "decide", "plan", "want".',
      },
    ],
  },

  {
    id: 'vg_remember_regret',
    name: 'remember / regret + to vs -ing',
    rule: 'remember/regret + to = future/present action | + -ing = past action',
    cats: ['gerund_infinitive'],
    trapTypes: ['meaning change', 'remember', 'regret', 'stop', 'try'],
    keywords: ['remember to', 'regret to', 'meaning change', 'regret -ing'],
    questions: [
      {
        id: 'rr1', q: 'Please remember ___ attach the invoice before sending the email.',
        opts: ['attaching', 'to attach', 'attach', 'having attached'], correct: 1,
        exp: '"Remember to + verb" = don\'t forget to do something (future action). "Remember + -ing" = recall a past event.',
        fr: '"Remember to + infinitif" = ne pas oublier de faire (action future). "Remember + -ing" = se souvenir d\'avoir fait.',
      },
      {
        id: 'rr2', q: 'We regret ___ you that your application has not been successful.',
        opts: ['informing', 'to inform', 'inform', 'having informed'], correct: 1,
        exp: '"Regret to inform" = formal expression meaning "we are sorry to tell you this now". "Regret informing" = sorry about having informed (past).',
        fr: '"Regret to inform" = formule de politesse pour annoncer une mauvaise nouvelle. "Regret informing" = regret d\'avoir informé (passé).',
      },
      {
        id: 'rr3', q: 'She still remembers ___ the opening of the company\'s first branch in 1995.',
        opts: ['to attend', 'attend', 'attending', 'having attend'], correct: 2,
        exp: '"Remember + -ing" = recall a past event. She remembers the memory of attending. "Remember to attend" = a reminder to do something in the future.',
        fr: '"Remember + -ing" = se souvenir d\'un événement passé. "Remember to" = se rappeler de faire quelque chose.',
      },
      {
        id: 'rr4', q: 'The company regrets ___ unable to process your request at this time.',
        opts: ['to be', 'being', 'be', 'been'], correct: 0,
        exp: '"Regret to be" in formal letters means "we are sorry to tell you that we are unable". This announces a current/future inability.',
        fr: '"Regret to be" = formule de regret formel ("nous sommes au regret de ne pas pouvoir"). Action présente/future.',
      },
      {
        id: 'rr5', q: 'I regret ___ so critical during the presentation — it was not the right moment.',
        opts: ['to be', 'be', 'being', 'been'], correct: 2,
        exp: '"Regret + -ing" = sorry about a past action. Regretting being critical refers to something already done.',
        fr: '"Regret + -ing" = regret d\'avoir fait quelque chose dans le passé. "Regret to be" = regret de devoir annoncer quelque chose maintenant.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ADJECTIVE / ADVERB
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: 'vg_adj_vs_adv',
    name: 'Adjective vs Adverb',
    rule: 'Adverbs modify verbs/adjectives/adverbs; adjectives modify nouns',
    cats: ['adjective_adverb', 'word_form'],
    trapTypes: ['adj adv', 'adjective adverb', 'adverb confusion', '-ly'],
    keywords: ['adjective', 'adverb', 'modify', '-ly'],
    questions: [
      {
        id: 'aa1', q: 'The manager spoke ___ to the team about the new safety regulations.',
        opts: ['clear', 'clearly', 'clarity', 'clearer'], correct: 1,
        exp: '"Clearly" (adverb) modifies the verb "spoke". Adverbs answer "how?". "Clear" is an adjective and modifies nouns.',
        fr: '"Clearly" = adverbe modifiant le verbe "spoke". Adverbe = comment ? "Clear" = adjectif (modifie un nom).',
      },
      {
        id: 'aa2', q: 'The quarterly results look very ___ for investors.',
        opts: ['promising', 'promisingly', 'promise', 'promised'], correct: 0,
        exp: '"Look" is a linking verb — it is followed by an adjective, not an adverb. "Promising" (adjective) describes the results.',
        fr: '"Look" = verbe de liaison → adjectif. "Promising" = adjectif. Autres verbes de liaison : seem, feel, become, appear.',
      },
      {
        id: 'aa3', q: 'She presented the financial data ___ and efficiently.',
        opts: ['clear', 'clearly', 'clearer', 'clarity'], correct: 1,
        exp: '"Clearly" (adverb) modifies "presented" (verb). Parallel structure with "efficiently" (also an adverb).',
        fr: 'Parallélisme avec "efficiently" (adverbe). → "clearly" (adverbe). "Clear" est un adjectif.',
      },
      {
        id: 'aa4', q: 'The new delivery system is ___ more cost-effective than the previous one.',
        opts: ['significant', 'significance', 'significantly', 'signify'], correct: 2,
        exp: '"Significantly" (adverb) modifies the adjective "more cost-effective". An adjective cannot modify another adjective.',
        fr: '"Significantly" (adverbe) modifie l\'adjectif composé "more cost-effective". Adverbe → modifie un adjectif.',
      },
      {
        id: 'aa5', q: 'The technician repaired the equipment ___ without disrupting operations.',
        opts: ['quick', 'quickly', 'quickness', 'quicken'], correct: 1,
        exp: '"Quickly" (adverb) modifies the verb "repaired". "Quick" is an adjective and cannot modify a verb.',
        fr: '"Quickly" = adverbe modifiant le verbe "repaired". "Quick" = adjectif (modifie un nom).',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // COMPARATIVE
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: 'vg_comparative_form',
    name: 'Comparative: -er vs more',
    rule: 'Short adj (1-2 syllables) + -er; long adj (3+ syllables) + more',
    cats: ['comparative'],
    trapTypes: ['comparative', 'superlative', '-er vs more'],
    keywords: ['comparative', '-er', 'more', 'superlative', 'than'],
    questions: [
      {
        id: 'cf1', q: 'The new conference room is ___ than the old one.',
        opts: ['more spacious', 'spaciouser', 'spacious than', 'most spacious'], correct: 0,
        exp: '"Spacious" has 3 syllables — use "more spacious". Adding "-er" to long adjectives is incorrect.',
        fr: '"Spacious" (3 syllabes) → "more spacious". On ajoute "-er" uniquement aux adjectifs courts (1-2 syllabes).',
      },
      {
        id: 'cf2', q: 'The direct flight is ___ than the connecting one.',
        opts: ['more fast', 'faster', 'fastest', 'more faster'], correct: 1,
        exp: '"Fast" is a 1-syllable adjective — add "-er" to form the comparative: "faster". "More fast" is wrong.',
        fr: '"Fast" (1 syllabe) → "faster" (comparatif). "More fast" est incorrect.',
      },
      {
        id: 'cf3', q: 'This year\'s proposal is ___ than the one submitted last year.',
        opts: ['compellinger', 'most compelling', 'more compelling', 'compelling than'], correct: 2,
        exp: '"Compelling" has 3 syllables — use "more compelling". Never "-er" for long adjectives.',
        fr: '"Compelling" (3 syllabes) → "more compelling". "-er" est réservé aux adjectifs courts.',
      },
      {
        id: 'cf4', q: 'The new warehouse is ___ than the previous facility.',
        opts: ['more large', 'largest', 'larger', 'more larger'], correct: 2,
        exp: '"Large" has 1 syllable — use "larger". "More large" is incorrect. "More larger" uses double comparison (wrong).',
        fr: '"Large" (1 syllabe) → "larger". "More large" = incorrect. "More larger" = double comparatif (interdit).',
      },
      {
        id: 'cf5', q: 'Our new supplier is ___ than the previous one.',
        opts: ['reliableer', 'more reliable', 'reliably', 'most reliable'], correct: 1,
        exp: '"Reliable" has 4 syllables — use "more reliable". "Reliably" is an adverb, not a comparative adjective.',
        fr: '"Reliable" (4 syllabes) → "more reliable". "Reliably" est un adverbe, pas un comparatif.',
      },
    ],
  },

  {
    id: 'vg_as_as_equality',
    name: 'as + adjective + as',
    rule: '"as + adj + as" expresses equality between two things',
    cats: ['comparative'],
    trapTypes: ['as as', 'equality comparison', 'so as'],
    keywords: ['as...as', 'equality', 'as much as', 'as well as'],
    questions: [
      {
        id: 'asa1', q: 'This year\'s revenue figures are ___ impressive ___ last year\'s.',
        opts: ['more / than', 'as / as', 'so / that', 'most / of'], correct: 1,
        exp: '"as + adjective + as" for equality. "More...than" is for superiority (A is better than B), not equality.',
        fr: '"As...as" = aussi...que (égalité). "More...than" = plus...que (supériorité). Ne pas confondre.',
      },
      {
        id: 'asa2', q: 'The new model is not ___ expensive ___ the original version.',
        opts: ['so / than', 'as / as', 'more / than', 'much / than'], correct: 1,
        exp: '"Not as + adj + as" expresses that A is less than B. "Not so...as" is old-fashioned but sometimes accepted; "as...as" is the standard.',
        fr: '"Not as...as" = pas aussi...que. Indique une inégalité (A < B). Standard moderne.',
      },
      {
        id: 'asa3', q: 'She is ___ experienced ___ any other candidate on the shortlist.',
        opts: ['more / than', 'as / as', 'most / among', 'so / that'], correct: 1,
        exp: '"As experienced as" = equal to the others. "More experienced than" would mean she is better.',
        fr: '"As experienced as" = aussi expérimentée que. "More...than" = plus expérimentée que (supériorité).',
      },
      {
        id: 'asa4', q: 'The new office is ___ well-equipped ___ the headquarters.',
        opts: ['more / than', 'most / among', 'as / as', 'so / that'], correct: 2,
        exp: '"As well-equipped as" states equal quality. "As" is used before adjectives/adverbs in the equality structure.',
        fr: '"As well-equipped as" = aussi bien équipé que. Égalité entre deux entités.',
      },
      {
        id: 'asa5', q: 'Processing the new orders takes ___ long ___ processing the old ones.',
        opts: ['more / than', 'as / as', 'so / that', 'much / than'], correct: 1,
        exp: '"As long as" for equal duration. "Takes as long as" = same amount of time. "More than" indicates difference.',
        fr: '"As long as" = aussi longtemps que (durée égale). "More than" indique une durée supérieure.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PASSIVE
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: 'vg_present_passive',
    name: 'Present passive: is/are + past participle',
    rule: 'Present passive = subject + is/are + past participle (+ by + agent)',
    cats: ['passive'],
    trapTypes: ['passive voice', 'passive present', 'is are'],
    keywords: ['passive', 'is done', 'are done', 'by agent'],
    questions: [
      {
        id: 'pp1', q: 'The monthly financial report ___ by the accounting department every quarter.',
        opts: ['prepares', 'is prepared', 'prepared', 'preparing'], correct: 1,
        exp: 'Present passive: "is prepared". The report (subject) receives the action. Active: "The department prepares the report."',
        fr: 'Passif présent : "is prepared". Le rapport subit l\'action. Actif : "The department prepares it."',
      },
      {
        id: 'pp2', q: 'All new employees ___ to complete a two-week induction programme.',
        opts: ['require', 'are required', 'required', 'requiring'], correct: 1,
        exp: '"Are required" = present passive. Employees (plural) receive the requirement. Note: passive of "require someone to do".',
        fr: '"Are required" = passif présent. Pluriel → "are". "Required" seul = passé simple (pas de sujet clair ici).',
      },
      {
        id: 'pp3', q: 'The packages ___ for damage before they are dispatched to customers.',
        opts: ['inspects', 'inspecting', 'are inspected', 'inspect'], correct: 2,
        exp: '"Are inspected" = present passive. The packages (plural) receive the inspection action.',
        fr: '"Are inspected" = passif présent pluriel. "Inspect" seul = actif (qui inspecte ?).',
      },
      {
        id: 'pp4', q: 'A security check ___ of all visitors entering the building.',
        opts: ['requires', 'is required', 'required', 'requiring'], correct: 1,
        exp: '"Is required" = present passive. A check (singular subject) receives the requirement.',
        fr: '"Is required" = passif présent singulier. Le contrôle est exigé (par l\'entreprise).',
      },
      {
        id: 'pp5', q: 'Meeting agendas ___ to all participants at least 24 hours in advance.',
        opts: ['sends', 'is sent', 'are sent', 'sending'], correct: 2,
        exp: '"Are sent" = present passive. Agendas (plural) receive the action. "Is sent" would be for a singular subject.',
        fr: '"Are sent" = passif présent pluriel (agendas = pluriel). "Is sent" = singulier.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PRONOUNS / RELATIVE CLAUSES
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: 'vg_who_vs_whom',
    name: 'who vs whom',
    rule: '"who" = subject; "whom" = object (especially after prepositions)',
    cats: ['pronoun', 'relative_clause'],
    trapTypes: ['who whom', 'pronoun case', 'subject object pronoun'],
    keywords: ['who', 'whom', 'whose', 'relative', 'subject', 'object'],
    questions: [
      {
        id: 'ww1', q: 'The candidate ___ received the highest score was immediately hired.',
        opts: ['which', 'whose', 'who', 'whom'], correct: 2,
        exp: '"Who" = subject relative pronoun for people. The candidate is the subject who received the score. "Whom" is for objects.',
        fr: '"Who" = pronom relatif sujet pour les personnes. La candidate est le sujet de "received".',
      },
      {
        id: 'ww2', q: 'The consultant ___ we hired last month has already delivered impressive results.',
        opts: ['who', 'which', 'whose', 'whom'], correct: 3,
        exp: '"Whom" = object relative pronoun. The consultant is the object of "hired" (we hired whom?). "Whom" follows the verb.',
        fr: '"Whom" = pronom relatif objet pour les personnes. Test : "we hired him" → "him" = objet → "whom".',
      },
      {
        id: 'ww3', q: 'The manager ___ department achieved the highest sales was promoted.',
        opts: ['who', 'which', 'whose', 'whom'], correct: 2,
        exp: '"Whose" = possessive relative pronoun. "Whose department" = the manager\'s department.',
        fr: '"Whose" = possessif relatif. "Whose department" = le département du manager.',
      },
      {
        id: 'ww4', q: 'To ___ should I address the complaint letter?',
        opts: ['who', 'which', 'whose', 'whom'], correct: 3,
        exp: '"Whom" after a preposition. "To whom" is formal. Test: "I should address it to him" → him (object) → whom.',
        fr: '"Whom" après une préposition ("to whom"). Test : "to him" (objet) → "whom".',
      },
      {
        id: 'ww5', q: 'The employee ___ submitted the quarterly report early received a commendation.',
        opts: ['which', 'whose', 'whom', 'who'], correct: 3,
        exp: '"Who" = subject pronoun for a person. The employee submitted the report — subject position.',
        fr: '"Who" pour une personne en position sujet. La personne accomplit l\'action.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // QUANTIFIERS
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: 'vg_much_many_few_little',
    name: 'much / many / few / little',
    rule: 'much/little → uncountable nouns; many/few → countable nouns',
    cats: ['quantifiers'],
    trapTypes: ['quantifier', 'much many', 'few little', 'countable uncountable'],
    keywords: ['much', 'many', 'few', 'little', 'quantifier', 'countable'],
    questions: [
      {
        id: 'qnt1', q: 'There is not ___ information available about the restructuring plan.',
        opts: ['many', 'much', 'few', 'a few'], correct: 1,
        exp: '"Information" is uncountable → "much". "Many" is for countable nouns. "Not much information" = very little.',
        fr: '"Information" = nom indénombrable → "much". "Many" = pour les noms dénombrables.',
      },
      {
        id: 'qnt2', q: 'Only ___ employees applied for the international transfer.',
        opts: ['much', 'little', 'a few', 'a little'], correct: 2,
        exp: '"Employees" is countable (plural) → "a few" (= some, a small number). "A little" is for uncountable nouns.',
        fr: '"Employees" = dénombrable pluriel → "a few" (quelques-uns). "A little" = pour les indénombrables.',
      },
      {
        id: 'qnt3', q: 'We have very ___ time to complete the revisions — the client is waiting.',
        opts: ['few', 'a few', 'little', 'many'], correct: 2,
        exp: '"Time" is uncountable → "little". "Little" = not much (negative connotation). "A little" = some (positive). "Few" is for countable nouns.',
        fr: '"Time" = indénombrable → "little" (pas beaucoup, connotation négative). "Few" = pour dénombrables.',
      },
      {
        id: 'qnt4', q: 'There were ___ attendees at the seminar than we had predicted.',
        opts: ['less', 'fewer', 'little', 'much'], correct: 1,
        exp: '"Attendees" is countable (plural) → "fewer". "Less" is for uncountable nouns. "Fewer attendees" = a smaller number.',
        fr: '"Attendees" = dénombrable → "fewer". "Less" = pour les indénombrables (less money, less time).',
      },
      {
        id: 'qnt5', q: 'The company allocates ___ of its annual budget to employee training.',
        opts: ['many', 'few', 'much', 'little'], correct: 2,
        exp: '"Budget" is uncountable → "much of its budget". "Many of its budget" is grammatically incorrect.',
        fr: '"Budget" = indénombrable → "much of its budget". "Many" ne s\'emploie pas avec les indénombrables.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PREPOSITIONS
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: 'vg_time_prepositions',
    name: 'Time prepositions: in / on / at',
    rule: 'in + month/year/season; on + day/date; at + specific time/holiday/end',
    cats: ['preposition'],
    trapTypes: ['preposition', 'in on at time', 'time preposition'],
    keywords: ['in on at', 'time preposition', 'on monday', 'in january', 'at 9'],
    questions: [
      {
        id: 'tp1', q: 'The annual shareholders\' meeting is scheduled ___ the third Thursday of June.',
        opts: ['in', 'at', 'on', 'by'], correct: 2,
        exp: '"On" + specific day/date. "On Thursday" / "on June 15th". "In" is for months and years.',
        fr: '"On" + jour/date spécifique. "On Thursday" (pas "in Thursday"). "In" = mois, année, saison.',
      },
      {
        id: 'tp2', q: 'The head office was originally established ___ 1987.',
        opts: ['on', 'at', 'in', 'by'], correct: 2,
        exp: '"In" + year. Also: "in January", "in spring", "in the morning". "On" is for specific dates/days.',
        fr: '"In" + année, mois, saison. "In 1987" / "in January" / "in spring". "On" = jour ou date précise.',
      },
      {
        id: 'tp3', q: 'The conference call begins ___ 9:30 AM sharp.',
        opts: ['in', 'on', 'by', 'at'], correct: 3,
        exp: '"At" + specific time. "At 9:30", "at noon", "at midnight". "In" is for periods (in the morning).',
        fr: '"At" + heure précise. "At 9:30 AM" / "at noon" / "at midnight". "In" = période (in the morning).',
      },
      {
        id: 'tp4', q: 'The company closes ___ New Year\'s Day and all statutory holidays.',
        opts: ['in', 'at', 'on', 'by'], correct: 2,
        exp: '"On" + specific holiday/date: "on New Year\'s Day", "on Christmas Day". "At Christmas" (general period) is also acceptable but "on Christmas Day" is more specific.',
        fr: '"On" + jour de fête précis. "On New Year\'s Day" / "on Easter Sunday". "At Christmas" = pendant Noël en général.',
      },
      {
        id: 'tp5', q: 'The results will be announced ___ the end of the financial quarter.',
        opts: ['on', 'in', 'at', 'by'], correct: 2,
        exp: '"At the end of" is a fixed expression. "By the end of" means "no later than". The question uses "at the end of" (at a specific point in time).',
        fr: '"At the end of" = expression fixe (à la fin de). "By the end of" = avant la fin de (délai maximum).',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SUBJECT-VERB AGREEMENT
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: 'vg_subject_verb_agreement',
    name: 'Subject-verb agreement: each / every / either',
    rule: 'each, every, everyone, either, neither + singular verb',
    cats: ['pronoun', 'verb'],
    trapTypes: ['subject verb agreement', 'each every', 'collective', 'singular plural'],
    keywords: ['subject verb', 'each', 'every', 'agreement', 'singular'],
    questions: [
      {
        id: 'sva1', q: 'Each of the employees ___ required to complete an annual performance review.',
        opts: ['are', 'is', 'were', 'have been'], correct: 1,
        exp: '"Each" takes a singular verb. "Each of the employees IS required." Even though "employees" is plural, "each" is singular.',
        fr: '"Each" → verbe singulier. "Each of the employees IS" (et non "are"). "Each" est toujours singulier.',
      },
      {
        id: 'sva2', q: 'Everyone in the three departments ___ notified about the fire drill last Tuesday.',
        opts: ['were', 'have been', 'was', 'are'], correct: 2,
        exp: '"Everyone" = singular pronoun. "Everyone was notified." Past tense: "was" (not "were").',
        fr: '"Everyone" = pronom singulier → verbe singulier. "Everyone was" (pas "were").',
      },
      {
        id: 'sva3', q: 'Every report submitted by the regional managers ___ reviewed by the head office.',
        opts: ['are', 'were', 'is', 'have been'], correct: 2,
        exp: '"Every + noun" takes a singular verb. "Every report IS reviewed."',
        fr: '"Every" + nom singulier → verbe singulier. "Every report IS reviewed."',
      },
      {
        id: 'sva4', q: 'Neither the project manager nor the team leader ___ available for comment.',
        opts: ['are', 'were', 'was', 'have been'], correct: 2,
        exp: '"Neither...nor" agreement rule: verb agrees with the nearest subject ("team leader" = singular) → "was".',
        fr: '"Neither...nor" → accord avec le sujet le plus proche. "Team leader" (singulier) → "was".',
      },
      {
        id: 'sva5', q: 'Each department ___ responsible for submitting its own annual budget proposal.',
        opts: ['are', 'have', 'is', 'were'], correct: 2,
        exp: '"Each department IS responsible." "Each" always takes a singular verb regardless of what follows.',
        fr: '"Each" → toujours singulier. "Each department IS responsible." Même si "departments" existe en pluriel.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // WORD FORM
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: 'vg_word_form',
    name: 'Word form: noun / verb / adjective / adverb',
    rule: 'Identify the correct part of speech needed in context (N/V/Adj/Adv)',
    cats: ['word_form'],
    trapTypes: ['word form', 'noun verb', 'suffix', 'part of speech'],
    keywords: ['word form', 'noun', 'verb', 'adjective', 'adverb', 'suffix'],
    questions: [
      {
        id: 'wf1', q: 'The company needs to improve its ___ of new employees.',
        opts: ['recruit', 'recruiting', 'recruitment', 'recruiter'], correct: 2,
        exp: '"Recruitment" is the noun form needed after "its". "Recruiting" (gerund/adjective) wouldn\'t follow "its" correctly here.',
        fr: '"Recruitment" = nom. Après "its" (possessif), on a besoin d\'un nom. "Recruit" = verbe.',
      },
      {
        id: 'wf2', q: 'All staff are required to attend the ___ session on data security.',
        opts: ['train', 'trained', 'training', 'trainer'], correct: 2,
        exp: '"Training session" = a compound noun. "Training" functions as an adjective modifying "session". "Train" is a verb.',
        fr: '"Training session" = nom composé. "Training" est ici adjectif (qualifie "session"). "Train" = verbe.',
      },
      {
        id: 'wf3', q: 'The new software is ___ with all major operating systems.',
        opts: ['compatible', 'compatibility', 'compatibly', 'compatibleness'], correct: 0,
        exp: '"Compatible" (adjective) follows "is" in the predicate. "Compatibility" is a noun.',
        fr: '"Compatible" = adjectif après "is". "Compatibility" = nom. "Compatibly" = adverbe (modify verbs).',
      },
      {
        id: 'wf4', q: 'The two companies signed a formal ___ to share research data.',
        opts: ['agree', 'agreed', 'agreement', 'agreeable'], correct: 2,
        exp: '"Agreement" is the noun form needed after "formal". "Agree" is a verb; "agreed" is past tense.',
        fr: '"Agreement" = nom après "formal" (adjectif). "Agree" = verbe. "Agreed" = passé.',
      },
      {
        id: 'wf5', q: 'The committee made a ___ to invest in renewable energy.',
        opts: ['decide', 'decided', 'decision', 'decisive'], correct: 2,
        exp: '"Decision" is the noun form needed after "a". "Decide" is a verb; "decisive" is an adjective.',
        fr: '"Decision" = nom après l\'article "a". "Decide" = verbe. "Decisive" = adjectif.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // COLLOCATIONS
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: 'vg_schedule_attend',
    name: 'Business collocations: schedule / attend / submit',
    rule: 'schedule + meeting/call/appointment; attend + event/meeting; submit + report/proposal',
    cats: ['collocation', 'vocab'],
    trapTypes: ['collocation', 'verb noun collocation', 'schedule attend'],
    keywords: ['schedule', 'attend', 'submit', 'collocation', 'business'],
    questions: [
      {
        id: 'sac1', q: 'The assistant was asked to ___ a meeting with the key suppliers for next Tuesday.',
        opts: ['do', 'make', 'schedule', 'plan'], correct: 2,
        exp: '"Schedule a meeting" is the fixed collocation. "Make a meeting" is incorrect in formal business English.',
        fr: '"Schedule a meeting" = collocation fixe. "Make a meeting" est incorrect en anglais professionnel.',
      },
      {
        id: 'sac2', q: 'All regional directors are expected to ___ the annual strategy summit.',
        opts: ['join', 'participate', 'attend', 'be present'], correct: 2,
        exp: '"Attend" collocates with meetings, conferences, events, seminars, training sessions.',
        fr: '"Attend" + réunion/conférence/événement. "Join" = rejoindre un groupe; "participate" nécessite "in".',
      },
      {
        id: 'sac3', q: 'Could you ___ a conference call with the clients for Thursday afternoon?',
        opts: ['do', 'make', 'plan', 'schedule'], correct: 3,
        exp: '"Schedule a call" = standard collocation. "Arrange a call" is also acceptable.',
        fr: '"Schedule a call" = collocation standard. "Make a call" = passer un appel (téléphoner).',
      },
      {
        id: 'sac4', q: 'All teams must ___ their project proposals by the end of the month.',
        opts: ['give', 'send', 'submit', 'deliver'], correct: 2,
        exp: '"Submit" collocates with report, proposal, application, form, request. "Send" is less formal and less precise.',
        fr: '"Submit" + rapport/proposition/demande = collocation formelle. "Send" est moins précis.',
      },
      {
        id: 'sac5', q: 'The marketing director is scheduled to ___ a press conference tomorrow morning.',
        opts: ['do', 'make', 'hold', 'have'], correct: 2,
        exp: '"Hold a press conference" / "hold a meeting" / "hold an event" = standard collocations.',
        fr: '"Hold a press conference" = collocation fixe. "Do a press conference" et "make a press conference" sont incorrects.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PRESENT PERFECT
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: 'vg_present_perfect',
    name: 'Present perfect: has/have + past participle',
    rule: 'Present perfect with since (point) / for (duration) / just / already / yet',
    cats: ['tense_perfect'],
    trapTypes: ['present perfect', 'since for', 'has have', 'tense confusion'],
    keywords: ['present perfect', 'since', 'for', 'has', 'have', 'already', 'yet'],
    questions: [
      {
        id: 'pp_1', q: 'She ___ with the company for over twelve years.',
        opts: ['works', 'worked', 'has worked', 'is working'], correct: 2,
        exp: '"Has worked" = present perfect with "for" (duration up to now). "Worked" = simple past (finished period). "Has worked for 12 years" = from the past until now.',
        fr: '"Has worked for" = présent parfait avec durée jusqu\'au présent. "Worked" = passé simple (période terminée).',
      },
      {
        id: 'pp_2', q: 'The branch in Hong Kong ___ open since the company\'s expansion in 2010.',
        opts: ['was', 'is', 'has been', 'had been'], correct: 2,
        exp: '"Has been open since 2010" = present perfect with "since" (specific starting point). Still open now → present perfect, not simple past.',
        fr: '"Has been" + "since" = depuis un point dans le temps, jusqu\'à maintenant. "Was" = passé révolu.',
      },
      {
        id: 'pp_3', q: 'The committee ___ already reviewed three of the five submitted proposals.',
        opts: ['review', 'reviewed', 'has reviewed', 'is reviewing'], correct: 2,
        exp: '"Has already reviewed" = present perfect with "already" (completed action with current relevance).',
        fr: '"Has already reviewed" = présent parfait avec "already" (action récente avec pertinence présente).',
      },
      {
        id: 'pp_4', q: 'The company ___ its offices in three new cities this year.',
        opts: ['opens', 'opened', 'has opened', 'is opening'], correct: 2,
        exp: '"Has opened" = present perfect. "This year" (still ongoing period) triggers present perfect. "Opened" would suggest the year is finished.',
        fr: '"This year" (période en cours) → présent parfait. "Opened" suggère une période terminée.',
      },
      {
        id: 'pp_5', q: 'Has the finance director ___ the budget allocation for next quarter yet?',
        opts: ['approve', 'approved', 'approves', 'approving'], correct: 1,
        exp: 'Present perfect question structure: "Has + subject + past participle?" "Approved" is the past participle of "approve".',
        fr: 'Structure du présent parfait : "Has + sujet + participe passé ?" "Approved" = participe passé.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PHRASAL VERBS
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: 'vg_phrasal_put',
    name: 'Phrasal verbs with PUT',
    rule: 'put on = wear; put off = postpone; put forward = propose; put up with = tolerate',
    cats: ['verb', 'collocation'],
    trapTypes: ['phrasal verb', 'put on', 'put off', 'phrasal'],
    keywords: ['put on', 'put off', 'put forward', 'put up with', 'phrasal'],
    questions: [
      {
        id: 'phr1', q: 'The board decided to ___ the vote on the merger until more data was available.',
        opts: ['put on', 'put off', 'put away', 'put through'], correct: 1,
        exp: '"Put off" = postpone. "Put on" = wear or start (put on a show). "Put through" = connect (phone).',
        fr: '"Put off" = reporter, différer. "Put on" = porter (vêtement) ou commencer. "Put through" = transférer (appel).',
      },
      {
        id: 'phr2', q: 'Please ___ your visitor badge before entering the restricted area.',
        opts: ['put off', 'put away', 'put on', 'put out'], correct: 2,
        exp: '"Put on" = wear or attach. "Put away" = store. "Put out" = extinguish.',
        fr: '"Put on" = porter, mettre (un badge, un vêtement). "Put away" = ranger. "Put out" = éteindre.',
      },
      {
        id: 'phr3', q: 'The union ___ a new proposal for a revised overtime compensation scheme.',
        opts: ['put on', 'put off', 'put away', 'put forward'], correct: 3,
        exp: '"Put forward" = submit or propose formally. Very common in meeting and negotiation contexts.',
        fr: '"Put forward" = proposer officiellement, soumettre. Très courant dans les contextes de réunion.',
      },
      {
        id: 'phr4', q: 'Experienced managers have learned to ___ a certain level of workplace ambiguity.',
        opts: ['put off', 'put on', 'put forward', 'put up with'], correct: 3,
        exp: '"Put up with" = tolerate, accept without complaint. "Put up with ambiguity" = manage uncertainty.',
        fr: '"Put up with" = supporter, tolérer. "Put up with ambiguity" = gérer l\'incertitude sans se plaindre.',
      },
      {
        id: 'phr5', q: 'She ___ her coat and left the office without saying goodbye.',
        opts: ['put off', 'put forward', 'put on', 'put away'], correct: 2,
        exp: '"Put on" = wear (a coat, jacket, hat). She dressed and left.',
        fr: '"Put on" = mettre (un vêtement). Elle a mis son manteau et est partie.',
      },
    ],
  },
]

// ── Matcher ───────────────────────────────────────────────────────────────────
// Finds the best-matching variation group for a given wrong question.
// Priority: exact trapType match > cat match > keyword match.

export function findVariationGroup(
  cat: string,
  trapType?: string,
  subtopic?: string,
): VariationGroup | null {
  const catLower     = cat.toLowerCase()
  const trapLower    = (trapType ?? '').toLowerCase()
  const topicLower   = (subtopic ?? '').toLowerCase()

  // 1 — exact trapType substring match
  if (trapLower) {
    const byTrap = variationGroups.find(g =>
      g.trapTypes.some(t => trapLower.includes(t) || t.includes(trapLower))
    )
    if (byTrap) return byTrap
  }

  // 2 — keyword match in subtopic
  if (topicLower) {
    const byKeyword = variationGroups.find(g =>
      g.keywords.some(k => topicLower.includes(k))
    )
    if (byKeyword) return byKeyword
  }

  // 3 — category match (first group with this cat)
  const byCat = variationGroups.find(g => g.cats.includes(catLower))
  return byCat ?? null
}
