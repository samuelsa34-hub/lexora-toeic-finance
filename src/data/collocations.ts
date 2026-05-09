// ── Collocation Studio Data ───────────────────────────────────────────────────
// Organised into 4 practical vocabulary categories.
// Each entry: noun → natural verb(s) → expression → French → example sentence.

export interface CollocVerbPair {
  verb: string          // the natural English verb
  expression: string    // verb + noun (the natural English phrase)
  expressionFr: string  // French translation
  example: string       // example sentence
  note?: string         // usage note / common mistake
}

export interface CollocationEntry {
  noun: string
  nounFr: string
  icon: string
  pos: string           // 'noun', 'verb', etc.
  pairs: CollocVerbPair[]
}

export interface CollocationQuiz {
  q: string
  opts: [string, string, string, string]
  correct: 0 | 1 | 2 | 3
  exp: string
}

export interface CollocationCategory {
  id: string
  label: string
  icon: string
  color: string         // accent color (hex)
  description: string
  entries: CollocationEntry[]
  quiz: CollocationQuiz[]
}

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY 1 — CLOTHING & GETTING DRESSED
// ═══════════════════════════════════════════════════════════════════════════════

const clothingEntries: CollocationEntry[] = [
  {
    noun: 'shoes', nounFr: 'chaussures', icon: '👟', pos: 'noun',
    pairs: [
      { verb: 'put on', expression: 'put on your shoes', expressionFr: 'mettre ses chaussures', example: 'She put on her shoes and left the house.', note: '"Put on" = the action of getting dressed. "Wear" = the state of having them on.' },
      { verb: 'take off', expression: 'take off your shoes', expressionFr: 'enlever ses chaussures', example: 'Please take off your shoes at the door.', note: '"Take off" = remove clothing or accessories.' },
      { verb: 'wear', expression: 'wear shoes', expressionFr: 'porter des chaussures', example: 'He wears formal shoes to the office every day.', note: '"Wear" describes the continuous state: you are wearing them.' },
    ],
  },
  {
    noun: 'shoelaces', nounFr: 'lacets', icon: '🎀', pos: 'noun',
    pairs: [
      { verb: 'tie', expression: 'tie your shoelaces', expressionFr: 'faire ses lacets', example: 'He stopped to tie his shoelaces before jogging.', note: '"Tie" is the only natural verb here. Never "make" or "do" your shoelaces.' },
      { verb: 'untie', expression: 'untie your shoelaces', expressionFr: 'défaire ses lacets', example: 'She untied her shoelaces and took off her shoes.', note: '"Untie" = the reverse action of tying.' },
    ],
  },
  {
    noun: 'tie', nounFr: 'cravate', icon: '👔', pos: 'noun',
    pairs: [
      { verb: 'wear', expression: 'wear a tie', expressionFr: 'porter une cravate', example: 'He always wears a tie to client meetings.', note: '"Wear" = the state of having it on.' },
      { verb: 'put on', expression: 'put on a tie', expressionFr: 'mettre une cravate', example: 'He put on his tie just before the interview.', note: '"Put on" = the action of getting dressed.' },
      { verb: 'tie', expression: 'tie a tie', expressionFr: 'faire sa cravate / nouer sa cravate', example: 'Can you teach me how to tie a tie properly?', note: '"Tie a tie" = to knot it. Also "do up a tie."' },
      { verb: 'loosen', expression: 'loosen a tie', expressionFr: 'desserrer sa cravate', example: 'He loosened his tie after the long presentation.', note: '"Loosen" = to make less tight, but not remove.' },
      { verb: 'take off', expression: 'take off a tie', expressionFr: 'enlever sa cravate', example: 'She told him to take off his tie — it was a casual event.', },
    ],
  },
  {
    noun: 'suit', nounFr: 'costume / tailleur', icon: '🤵', pos: 'noun',
    pairs: [
      { verb: 'wear', expression: 'wear a suit', expressionFr: 'porter un costume', example: 'He wears a suit every day at the office.', note: '"Wear a suit" — state of wearing. Never "put a suit" alone.' },
      { verb: 'put on', expression: 'put on a suit', expressionFr: 'mettre un costume', example: 'She put on her suit and headed to the boardroom.', },
    ],
  },
  {
    noun: 'jacket', nounFr: 'veste / veston', icon: '🧥', pos: 'noun',
    pairs: [
      { verb: 'put on', expression: 'put on a jacket', expressionFr: 'mettre une veste', example: 'Put on your jacket — it\'s cold outside.', },
      { verb: 'take off', expression: 'take off a jacket', expressionFr: 'enlever sa veste', example: 'He took off his jacket when he sat down at his desk.', },
      { verb: 'zip up', expression: 'zip up a jacket', expressionFr: 'fermer une veste (fermeture éclair)', example: 'She zipped up her jacket before stepping outside.', note: '"Zip up" = close using a zipper.' },
      { verb: 'wear', expression: 'wear a jacket', expressionFr: 'porter une veste', example: 'She was wearing a smart jacket at the reception.', },
    ],
  },
  {
    noun: 'shirt', nounFr: 'chemise', icon: '👕', pos: 'noun',
    pairs: [
      { verb: 'button up', expression: 'button up a shirt', expressionFr: 'boutonner une chemise', example: 'He buttoned up his shirt before leaving the changing room.', note: '"Button up" or "do up" = close by doing the buttons.' },
      { verb: 'put on', expression: 'put on a shirt', expressionFr: 'mettre une chemise', example: 'She put on a fresh shirt for the meeting.', },
      { verb: 'iron', expression: 'iron a shirt', expressionFr: 'repasser une chemise', example: 'He ironed his shirt the evening before the interview.', },
      { verb: 'wear', expression: 'wear a shirt', expressionFr: 'porter une chemise', example: 'He was wearing a white shirt with a blue tie.', },
    ],
  },
  {
    noun: 'belt', nounFr: 'ceinture', icon: '🔧', pos: 'noun',
    pairs: [
      { verb: 'wear', expression: 'wear a belt', expressionFr: 'porter une ceinture', example: 'He always wears a leather belt with formal trousers.', },
      { verb: 'put on', expression: 'put on a belt', expressionFr: 'mettre une ceinture', example: 'She put on her belt and checked herself in the mirror.', },
      { verb: 'buckle', expression: 'buckle a belt', expressionFr: 'boucler une ceinture', example: 'He buckled his belt and was ready to go.', note: '"Buckle" = to fasten the buckle of a belt.' },
    ],
  },
  {
    noun: 'coat', nounFr: 'manteau', icon: '🧥', pos: 'noun',
    pairs: [
      { verb: 'put on', expression: 'put on a coat', expressionFr: 'mettre un manteau', example: 'Put on your coat — it\'s raining outside.', },
      { verb: 'take off', expression: 'take off a coat', expressionFr: 'enlever son manteau', example: 'She took off her coat and hung it by the door.', },
      { verb: 'wear', expression: 'wear a coat', expressionFr: 'porter un manteau', example: 'He was wearing a long winter coat.', },
    ],
  },
]

const clothingQuiz: CollocationQuiz[] = [
  {
    q: 'She ______ her shoes before entering the office.',
    opts: ['wore on', 'put on', 'made', 'did'],
    correct: 1,
    exp: '"Put on your shoes" = the action of getting dressed. "Wear" describes the continuous state, not the act of putting them on.',
  },
  {
    q: 'He stopped to ______ his shoelaces before the race.',
    opts: ['make', 'do', 'tie', 'fix on'],
    correct: 2,
    exp: '"Tie your shoelaces" is the only natural collocation. Never "make" or "do" your shoelaces.',
  },
  {
    q: 'The dress code requires all staff to ______ a tie at client meetings.',
    opts: ['put', 'carry', 'wear', 'make'],
    correct: 2,
    exp: '"Wear a tie" = the general state or requirement. "Put on a tie" is used for the specific action of getting dressed.',
  },
  {
    q: 'After the long day, he ______ his jacket and hung it up.',
    opts: ['unzipped', 'took off', 'put down', 'removed on'],
    correct: 1,
    exp: '"Take off" is the standard phrasal verb for removing clothing. "Unzip" is for closing a zipper (zip up / unzip).',
  },
  {
    q: 'She had to ______ her shirt quickly before the meeting started.',
    opts: ['button up', 'tie up', 'zip', 'seal'],
    correct: 0,
    exp: '"Button up a shirt" = to fasten the buttons. "Zip up" is for zippers (jackets), not shirts with buttons.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY 2 — TOOLS & MANUAL WORK
// ═══════════════════════════════════════════════════════════════════════════════

const toolsEntries: CollocationEntry[] = [
  {
    noun: 'shovel', nounFr: 'pelle', icon: '⛏️', pos: 'noun',
    pairs: [
      { verb: 'use', expression: 'use a shovel', expressionFr: 'utiliser une pelle', example: 'He used a shovel to clear the driveway.', },
      { verb: 'dig with', expression: 'dig with a shovel', expressionFr: 'creuser avec une pelle', example: 'They dug with shovels to prepare the foundation.', },
      { verb: 'shovel', expression: 'shovel snow / shovel dirt', expressionFr: 'pelleter de la neige / de la terre', example: 'He spent the morning shovelling snow from the path.', note: '"Shovel" can also be used as a verb: to shovel snow/dirt.' },
    ],
  },
  {
    noun: 'wheelbarrow', nounFr: 'brouette', icon: '🛒', pos: 'noun',
    pairs: [
      { verb: 'push', expression: 'push a wheelbarrow', expressionFr: 'pousser une brouette', example: 'He pushed a wheelbarrow full of soil across the garden.', note: '"Push" is the only natural verb. Never "drive" or "carry" a wheelbarrow.' },
      { verb: 'load', expression: 'load a wheelbarrow', expressionFr: 'remplir / charger une brouette', example: 'She loaded the wheelbarrow with gravel and pushed it to the site.', },
    ],
  },
  {
    noun: 'ladder', nounFr: 'échelle', icon: '🪜', pos: 'noun',
    pairs: [
      { verb: 'climb', expression: 'climb a ladder', expressionFr: 'monter à une échelle', example: 'He climbed the ladder to fix the gutter.', note: '"Climb a ladder" — not "go up a ladder" in formal/written English.' },
      { verb: 'set up', expression: 'set up a ladder', expressionFr: 'installer / dresser une échelle', example: 'She set up the ladder against the wall before climbing.', },
      { verb: 'lean', expression: 'lean a ladder against', expressionFr: 'appuyer une échelle contre', example: 'He leaned the ladder against the side of the building.', },
    ],
  },
  {
    noun: 'bucket', nounFr: 'seau', icon: '🪣', pos: 'noun',
    pairs: [
      { verb: 'carry', expression: 'carry a bucket', expressionFr: 'porter un seau', example: 'She carried a bucket of water to the garden.', },
      { verb: 'fill', expression: 'fill a bucket', expressionFr: 'remplir un seau', example: 'He filled the bucket with soapy water.', },
      { verb: 'empty', expression: 'empty a bucket', expressionFr: 'vider un seau', example: 'She emptied the bucket after cleaning the floor.', },
    ],
  },
  {
    noun: 'broom', nounFr: 'balai', icon: '🧹', pos: 'noun',
    pairs: [
      { verb: 'sweep with', expression: 'sweep with a broom', expressionFr: 'balayer avec un balai', example: 'He swept the warehouse floor with a broom.', },
      { verb: 'use', expression: 'use a broom', expressionFr: 'utiliser un balai', example: 'She used a broom to sweep up the broken glass.', },
    ],
  },
  {
    noun: 'box', nounFr: 'carton / boîte', icon: '📦', pos: 'noun',
    pairs: [
      { verb: 'carry', expression: 'carry a box', expressionFr: 'porter un carton', example: 'He carried the heavy box up the stairs.', },
      { verb: 'pack', expression: 'pack a box', expressionFr: 'emballer / remplir un carton', example: 'She packed a box with the office supplies.', },
      { verb: 'unpack', expression: 'unpack a box', expressionFr: 'déballer un carton', example: 'They spent the afternoon unpacking boxes in the new office.', },
      { verb: 'seal', expression: 'seal a box with tape', expressionFr: 'fermer un carton avec du scotch', example: 'He sealed the box with tape and wrote the address on it.', note: '"Seal with tape" — not "close with tape" in formal packing context.' },
      { verb: 'lift', expression: 'lift a box', expressionFr: 'soulever un carton', example: 'Please lift the box carefully — it is fragile.', },
    ],
  },
  {
    noun: 'tape', nounFr: 'ruban adhésif / scotch', icon: '🖊️', pos: 'noun',
    pairs: [
      { verb: 'use', expression: 'use tape', expressionFr: 'utiliser du scotch', example: 'She used tape to seal the package.', },
      { verb: 'apply', expression: 'apply tape', expressionFr: 'appliquer du ruban adhésif', example: 'He applied tape along the edge of the box.', },
    ],
  },
  {
    noun: 'scissors', nounFr: 'ciseaux', icon: '✂️', pos: 'noun',
    pairs: [
      { verb: 'use', expression: 'use scissors', expressionFr: 'utiliser des ciseaux', example: 'She used scissors to cut the ribbon at the ceremony.', note: '"Scissors" is always plural in English.' },
      { verb: 'cut with', expression: 'cut with scissors', expressionFr: 'couper avec des ciseaux', example: 'He cut the cable with scissors.', },
    ],
  },
  {
    noun: 'rake', nounFr: 'râteau', icon: '🌾', pos: 'noun',
    pairs: [
      { verb: 'use', expression: 'use a rake', expressionFr: 'utiliser un râteau', example: 'He used a rake to gather the leaves.', },
      { verb: 'rake', expression: 'rake the leaves', expressionFr: 'ratisser les feuilles', example: 'She raked the leaves into a pile by the fence.', note: '"Rake" can also be a verb.' },
    ],
  },
]

const toolsQuiz: CollocationQuiz[] = [
  {
    q: 'The workers used a ______ to dig the foundation.',
    opts: ['wheelbarrow', 'ladder', 'shovel', 'bucket'],
    correct: 2,
    exp: '"Dig with a shovel" — a shovel is the tool used for digging. A wheelbarrow transports materials, a ladder helps you climb, and a bucket holds liquids.',
  },
  {
    q: 'He ______ the wheelbarrow full of gravel to the building site.',
    opts: ['carried', 'drove', 'pushed', 'wore'],
    correct: 2,
    exp: '"Push a wheelbarrow" is the only natural collocation. You push it — never "drive" or "carry" it.',
  },
  {
    q: 'She ______ the ladder against the wall before climbing up.',
    opts: ['put', 'leaned', 'pushed on', 'placed on'],
    correct: 1,
    exp: '"Lean a ladder against" = to rest it at an angle against a surface. Also: "set up a ladder."',
  },
  {
    q: 'Could you ______ this box to the storage room on the second floor?',
    opts: ['wear', 'push up', 'carry', 'rake'],
    correct: 2,
    exp: '"Carry a box" = to transport it by holding it. Also "lift a box" or "move a box."',
  },
  {
    q: 'He ______ the cardboard box with tape before shipping it.',
    opts: ['closed up', 'glued', 'sealed', 'tied on'],
    correct: 2,
    exp: '"Seal a box with tape" is the natural expression. "Seal" is the standard verb for closing packages securely.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY 3 — OFFICE & MEETINGS
// ═══════════════════════════════════════════════════════════════════════════════

const officeEntries: CollocationEntry[] = [
  {
    noun: 'meeting', nounFr: 'réunion', icon: '🤝', pos: 'noun',
    pairs: [
      { verb: 'attend', expression: 'attend a meeting', expressionFr: 'assister à une réunion', example: 'All department heads are expected to attend the meeting.', note: 'French false friend: "assister à" → "attend" (NOT "assist").' },
      { verb: 'schedule', expression: 'schedule a meeting', expressionFr: 'programmer / fixer une réunion', example: 'Can you schedule a meeting with the client for Thursday?', },
      { verb: 'arrange', expression: 'arrange a meeting', expressionFr: 'organiser une réunion', example: 'She arranged a meeting between the two teams.', note: '"Schedule" focuses on the time. "Arrange" focuses on the logistics.' },
      { verb: 'hold', expression: 'hold a meeting', expressionFr: 'tenir / organiser une réunion', example: 'The board held a meeting to discuss the budget shortfall.', },
      { verb: 'chair', expression: 'chair a meeting', expressionFr: 'présider une réunion', example: 'He chaired the monthly meeting with great efficiency.', note: '"Chair" = to lead and control the meeting as the presider.' },
      { verb: 'run', expression: 'run a meeting', expressionFr: 'animer / diriger une réunion', example: 'She runs the team meetings every Monday morning.', },
      { verb: 'postpone', expression: 'postpone a meeting', expressionFr: 'reporter une réunion', example: 'The meeting was postponed due to the director\'s absence.', },
      { verb: 'cancel', expression: 'cancel a meeting', expressionFr: 'annuler une réunion', example: 'The client cancelled the meeting at the last minute.', },
      { verb: 'wrap up', expression: 'wrap up a meeting', expressionFr: 'conclure / clore une réunion', example: 'She wrapped up the meeting with a brief summary of next steps.', },
    ],
  },
  {
    noun: 'notes', nounFr: 'notes', icon: '📝', pos: 'noun',
    pairs: [
      { verb: 'take', expression: 'take notes', expressionFr: 'prendre des notes', example: 'She took notes throughout the presentation.', note: '"Take notes" — not "make notes" in standard TOEIC English.' },
      { verb: 'review', expression: 'review your notes', expressionFr: 'relire ses notes', example: 'He reviewed his notes before responding to the client.', },
    ],
  },
  {
    noun: 'minutes', nounFr: 'compte rendu de réunion', icon: '📋', pos: 'noun',
    pairs: [
      { verb: 'take', expression: 'take the minutes', expressionFr: 'rédiger le compte rendu', example: 'Sarah was asked to take the minutes during the board meeting.', note: '"Minutes" (plural) = the official written record of what was decided in a meeting.' },
      { verb: 'circulate', expression: 'circulate the minutes', expressionFr: 'diffuser le compte rendu', example: 'The assistant circulated the minutes to all attendees after the meeting.', },
    ],
  },
  {
    noun: 'report', nounFr: 'rapport', icon: '📄', pos: 'noun',
    pairs: [
      { verb: 'write', expression: 'write a report', expressionFr: 'rédiger un rapport', example: 'He spent the afternoon writing the quarterly sales report.', },
      { verb: 'submit', expression: 'submit a report', expressionFr: 'soumettre / remettre un rapport', example: 'Please submit the report before 5 p.m. on Friday.', },
      { verb: 'prepare', expression: 'prepare a report', expressionFr: 'préparer un rapport', example: 'The analyst prepared a report for the board meeting.', },
      { verb: 'review', expression: 'review a report', expressionFr: 'examiner / relire un rapport', example: 'The manager reviewed the report before sending it to the client.', },
      { verb: 'present', expression: 'present a report', expressionFr: 'présenter un rapport', example: 'She presented the annual report to the shareholders.', },
    ],
  },
  {
    noun: 'agenda', nounFr: 'ordre du jour', icon: '📋', pos: 'noun',
    pairs: [
      { verb: 'set', expression: 'set the agenda', expressionFr: 'fixer l\'ordre du jour', example: 'The director set the agenda for the quarterly review.', },
      { verb: 'go over', expression: 'go over the agenda', expressionFr: 'passer en revue l\'ordre du jour', example: 'She went over the agenda at the start of the meeting.', note: '"Go over" = review and discuss item by item.' },
      { verb: 'follow', expression: 'follow the agenda', expressionFr: 'suivre l\'ordre du jour', example: 'Please follow the agenda and raise other issues at the end.', },
    ],
  },
  {
    noun: 'deadline', nounFr: 'délai / date limite', icon: '⏰', pos: 'noun',
    pairs: [
      { verb: 'meet', expression: 'meet a deadline', expressionFr: 'respecter un délai', example: 'The team worked overtime to meet the project deadline.', note: '"Meet a deadline" — not "respect a deadline" in English.' },
      { verb: 'miss', expression: 'miss a deadline', expressionFr: 'rater une date limite', example: 'He missed the deadline and had to apologise to the client.', },
      { verb: 'extend', expression: 'extend a deadline', expressionFr: 'prolonger une date limite', example: 'She asked for an extension because the deadline was too tight.', },
      { verb: 'set', expression: 'set a deadline', expressionFr: 'fixer une date limite', example: 'The project manager set a strict deadline for the first draft.', },
    ],
  },
  {
    noun: 'presentation', nounFr: 'présentation', icon: '📊', pos: 'noun',
    pairs: [
      { verb: 'give', expression: 'give a presentation', expressionFr: 'faire une présentation', example: 'She gave an impressive presentation to the board of directors.', },
      { verb: 'prepare', expression: 'prepare a presentation', expressionFr: 'préparer une présentation', example: 'He spent the weekend preparing the sales presentation.', },
      { verb: 'deliver', expression: 'deliver a presentation', expressionFr: 'délivrer / faire une présentation', example: 'She delivered the presentation with great confidence.', },
    ],
  },
  {
    noun: 'appointment', nounFr: 'rendez-vous', icon: '📅', pos: 'noun',
    pairs: [
      { verb: 'make', expression: 'make an appointment', expressionFr: 'prendre un rendez-vous', example: 'She made an appointment to meet the consultant next Tuesday.', note: 'TOEIC: "make an appointment" or "schedule an appointment" — not "take an appointment."' },
      { verb: 'keep', expression: 'keep an appointment', expressionFr: 'honorer un rendez-vous', example: 'He kept the appointment despite his busy schedule.', },
      { verb: 'cancel', expression: 'cancel an appointment', expressionFr: 'annuler un rendez-vous', example: 'She had to cancel her appointment at the last minute.', },
    ],
  },
]

const officeQuiz: CollocationQuiz[] = [
  {
    q: 'All employees are expected to ______ the annual safety briefing.',
    opts: ['assist', 'attend', 'join to', 'present'],
    correct: 1,
    exp: '"Attend a meeting/briefing" = to be present at it. "Assist" = to help someone. French false friend: "assister à" → "attend" in English.',
  },
  {
    q: 'Could you ______ a meeting with the finance team for next Wednesday?',
    opts: ['wear', 'hold on', 'schedule', 'run to'],
    correct: 2,
    exp: '"Schedule a meeting" = to set a time and date for it. Also: "arrange a meeting" or "set up a meeting."',
  },
  {
    q: 'Please ______ your expense report before the end of the month.',
    opts: ['make', 'submit', 'write to', 'post'],
    correct: 1,
    exp: '"Submit a report" = to hand it in to the relevant authority. Also: "send in" or "hand in" a report.',
  },
  {
    q: 'The secretary was asked to ______ the minutes during the board meeting.',
    opts: ['write to', 'make', 'take', 'hold'],
    correct: 2,
    exp: '"Take the minutes" = to write the official record of a meeting. "Take notes" is more informal; "take the minutes" is the formal expression.',
  },
  {
    q: 'The project manager warned the team not to ______ the Friday deadline.',
    opts: ['miss', 'lose', 'fail to', 'drop'],
    correct: 0,
    exp: '"Miss a deadline" = to fail to complete something by the agreed date. "Meet a deadline" = to succeed. Never "lose a deadline."',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY 4 — EVERYDAY ACTIONS (Phrasal Verbs & Collocations)
// ═══════════════════════════════════════════════════════════════════════════════

const everydayEntries: CollocationEntry[] = [
  {
    noun: 'light', nounFr: 'lumière / lampe', icon: '💡', pos: 'noun',
    pairs: [
      { verb: 'turn on', expression: 'turn on the light', expressionFr: 'allumer la lumière', example: 'She turned on the light when she entered the room.', note: '"Turn on" = to switch on electricity. The opposite is "turn off."' },
      { verb: 'turn off', expression: 'turn off the light', expressionFr: 'éteindre la lumière', example: 'Please turn off the lights when you leave the office.', },
      { verb: 'switch on/off', expression: 'switch on the light', expressionFr: 'allumer / éteindre', example: 'He switched on the light in the conference room.', note: '"Switch on/off" and "turn on/off" are interchangeable for lights and electronics.' },
    ],
  },
  {
    noun: 'computer', nounFr: 'ordinateur', icon: '💻', pos: 'noun',
    pairs: [
      { verb: 'turn on', expression: 'turn on the computer', expressionFr: 'allumer l\'ordinateur', example: 'She turned on her computer and checked her emails.', },
      { verb: 'turn off', expression: 'turn off the computer', expressionFr: 'éteindre l\'ordinateur', example: 'Remember to turn off your computer before leaving.', },
      { verb: 'plug in', expression: 'plug in the computer', expressionFr: 'brancher l\'ordinateur', example: 'He plugged in his laptop and started the presentation.', },
    ],
  },
  {
    noun: 'charger', nounFr: 'chargeur', icon: '🔌', pos: 'noun',
    pairs: [
      { verb: 'plug in', expression: 'plug in the charger', expressionFr: 'brancher le chargeur', example: 'She plugged in her charger before the long call.', note: '"Plug in" = to connect to an electricity socket.' },
      { verb: 'unplug', expression: 'unplug the charger', expressionFr: 'débrancher le chargeur', example: 'Don\'t forget to unplug the charger before you leave.', },
    ],
  },
  {
    noun: 'phone', nounFr: 'téléphone', icon: '📱', pos: 'noun',
    pairs: [
      { verb: 'pick up', expression: 'pick up the phone', expressionFr: 'décrocher le téléphone', example: 'She picked up the phone and called the client immediately.', note: '"Pick up the phone" = to answer or start a phone call.' },
      { verb: 'put down', expression: 'put down the phone', expressionFr: 'raccrocher / poser le téléphone', example: 'He put down the phone after a long discussion.', },
      { verb: 'answer', expression: 'answer the phone', expressionFr: 'répondre au téléphone', example: 'Please answer the phone if I\'m in a meeting.', },
      { verb: 'charge', expression: 'charge the phone', expressionFr: 'charger son téléphone', example: 'He charged his phone overnight before the business trip.', },
    ],
  },
  {
    noun: 'document', nounFr: 'document', icon: '📄', pos: 'noun',
    pairs: [
      { verb: 'print', expression: 'print a document', expressionFr: 'imprimer un document', example: 'She printed the document and brought it to the meeting.', },
      { verb: 'sign', expression: 'sign a document', expressionFr: 'signer un document', example: 'Please sign the document and return it by Friday.', },
      { verb: 'file', expression: 'file a document', expressionFr: 'classer un document', example: 'He filed the document in the correct folder.', },
      { verb: 'scan', expression: 'scan a document', expressionFr: 'scanner un document', example: 'Can you scan the contract and email it to me?', },
    ],
  },
  {
    noun: 'bag', nounFr: 'sac', icon: '👜', pos: 'noun',
    pairs: [
      { verb: 'pack', expression: 'pack a bag', expressionFr: 'faire son sac / sa valise', example: 'She packed her bag the night before the business trip.', },
      { verb: 'carry', expression: 'carry a bag', expressionFr: 'porter un sac', example: 'He carried his bag from the car to the office.', },
      { verb: 'put down', expression: 'put down your bag', expressionFr: 'poser son sac', example: 'Please put down your bag and take a seat.', },
    ],
  },
  {
    noun: 'coffee', nounFr: 'café', icon: '☕', pos: 'noun',
    pairs: [
      { verb: 'make', expression: 'make a coffee', expressionFr: 'faire un café', example: 'She made a coffee before starting the morning briefing.', },
      { verb: 'pour', expression: 'pour a coffee', expressionFr: 'servir un café', example: 'He poured a coffee for each member of the team.', },
      { verb: 'have', expression: 'have a coffee', expressionFr: 'prendre un café', example: 'Let\'s have a coffee and discuss the proposal informally.', },
    ],
  },
  {
    noun: 'call', nounFr: 'appel téléphonique', icon: '📞', pos: 'noun',
    pairs: [
      { verb: 'make', expression: 'make a call', expressionFr: 'passer un appel', example: 'She made a call to confirm the delivery time.', note: '"Make a call" — not "do a call" or "give a call" (American: "give someone a call" is acceptable informally).' },
      { verb: 'take', expression: 'take a call', expressionFr: 'prendre un appel', example: 'He had to take an urgent call during the meeting.', },
      { verb: 'return', expression: 'return a call', expressionFr: 'rappeler', example: 'I will return your call as soon as possible.', },
      { verb: 'schedule', expression: 'schedule a call', expressionFr: 'programmer un appel', example: 'Can we schedule a call for Tuesday afternoon?', },
    ],
  },
]

const everydayQuiz: CollocationQuiz[] = [
  {
    q: 'Please ______ the light when you leave the conference room.',
    opts: ['shut', 'close', 'turn off', 'press off'],
    correct: 2,
    exp: '"Turn off the light" = to switch off the electricity. The opposite is "turn on the light." Also valid: "switch off."',
  },
  {
    q: 'She ______ the phone and confirmed the appointment.',
    opts: ['took up', 'picked up', 'lifted', 'held'],
    correct: 1,
    exp: '"Pick up the phone" = to take a call or begin a phone conversation. Not "take up" or "lift" the phone.',
  },
  {
    q: 'Don\'t forget to ______ your laptop before you leave the office.',
    opts: ['plug off', 'unplug', 'take out', 'open'],
    correct: 1,
    exp: '"Unplug" = to disconnect from the electricity socket. The opposite is "plug in." Never "plug off."',
  },
  {
    q: 'He needed to ______ a call to the overseas team at 6 a.m.',
    opts: ['do', 'make', 'take', 'set'],
    correct: 1,
    exp: '"Make a call" = to initiate a phone call. "Take a call" = to receive/answer an incoming call.',
  },
  {
    q: 'She asked her assistant to ______ the contract and email it to the client.',
    opts: ['copy', 'print', 'scan', 'write'],
    correct: 2,
    exp: '"Scan a document" = to digitise it using a scanner. "Print" = to produce a paper copy. "Scan and email" is the natural sequence for digital workflows.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export const COLLOCATION_CATEGORIES: CollocationCategory[] = [
  {
    id: 'clothing',
    label: 'Clothing & Getting Dressed',
    icon: '👔',
    color: '#818CF8',
    description: 'Verbs used with clothing items — what you put on, take off, tie, button, and wear.',
    entries: clothingEntries,
    quiz: clothingQuiz,
  },
  {
    id: 'tools',
    label: 'Tools & Manual Work',
    icon: '⛏️',
    color: '#F59E0B',
    description: 'Natural verbs for tools, equipment, and physical tasks at work or in the garden.',
    entries: toolsEntries,
    quiz: toolsQuiz,
  },
  {
    id: 'office',
    label: 'Office & Meetings',
    icon: '🤝',
    color: '#10B981',
    description: 'Key meeting vocabulary and business collocations for reports, agendas, and deadlines.',
    entries: officeEntries,
    quiz: officeQuiz,
  },
  {
    id: 'everyday',
    label: 'Everyday Actions',
    icon: '⚡',
    color: '#EC4899',
    description: 'Common phrasal verbs and collocations for daily objects — phones, lights, computers, calls.',
    entries: everydayEntries,
    quiz: everydayQuiz,
  },
]
