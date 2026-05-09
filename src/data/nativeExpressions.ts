// ── Native TOEIC Expressions ──────────────────────────────────────────────────
// Natural American/British expressions that appear in TOEIC texts, emails,
// meetings, and workplace communication. No random slang — every entry has
// a direct business or travel context relevant to the TOEIC exam.

export type ExpressionCategory =
  | 'meetings'
  | 'workplace'
  | 'emails'
  | 'scheduling'
  | 'customer_service'
  | 'time_deadlines'
  | 'finance'
  | 'communication'
  | 'travel'
  | 'negotiations'

export type ExpressionOrigin = 'american' | 'british' | 'both'

export interface NativeExpression {
  id: string
  expression: string
  meaning: string
  example: string
  category: ExpressionCategory
  origin: ExpressionOrigin
  difficulty: 'easy' | 'medium' | 'hard'
  toeicNote?: string
  warningNote?: string
  fr?: string
}

export interface AmeBrEEntry {
  american: string
  british: string
  fr: string
  context: string
}

export const CAT_CONFIG: Record<ExpressionCategory, { label: string; color: string; bg: string }> = {
  meetings:        { label: 'Meetings',         color: '#818CF8', bg: 'rgba(99,102,241,0.12)' },
  workplace:       { label: 'Workplace',         color: '#38BDF8', bg: 'rgba(56,189,248,0.12)' },
  emails:          { label: 'Emails',            color: '#C084FC', bg: 'rgba(192,132,252,0.12)' },
  scheduling:      { label: 'Scheduling',        color: '#34D399', bg: 'rgba(52,211,153,0.12)' },
  customer_service:{ label: 'Customer Service',  color: '#FB923C', bg: 'rgba(251,146,60,0.12)' },
  time_deadlines:  { label: 'Time & Deadlines',  color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  finance:         { label: 'Finance',           color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  communication:   { label: 'Communication',     color: '#A78BFA', bg: 'rgba(167,139,250,0.12)' },
  travel:          { label: 'Travel',            color: '#22D3EE', bg: 'rgba(34,211,238,0.12)' },
  negotiations:    { label: 'Negotiations',      color: '#F472B6', bg: 'rgba(244,114,182,0.12)' },
}

// ── American vs British vocabulary comparison ─────────────────────────────────
export const ameBrEVocab: AmeBrEEntry[] = [
  { american: 'elevator',       british: 'lift',          fr: 'ascenseur',          context: 'office / building' },
  { american: 'apartment',      british: 'flat',          fr: 'appartement',        context: 'housing / travel' },
  { american: 'vacation',       british: 'holiday',       fr: 'vacances',           context: 'HR / scheduling' },
  { american: 'resume',         british: 'CV',            fr: 'curriculum vitae',   context: 'job application' },
  { american: 'line',           british: 'queue',         fr: 'file d\'attente',    context: 'customer service' },
  { american: 'zip code',       british: 'postcode',      fr: 'code postal',        context: 'forms / addresses' },
  { american: 'truck',          british: 'lorry',         fr: 'camion',             context: 'logistics / shipping' },
  { american: 'subway / metro', british: 'underground / tube', fr: 'métro',         context: 'travel / commute' },
  { american: 'first floor',    british: 'ground floor',  fr: 'rez-de-chaussée',   context: 'office / hotel' },
  { american: 'second floor',   british: 'first floor',   fr: '1er étage',         context: 'office / hotel' },
  { american: 'restroom / bathroom', british: 'toilet / loo', fr: 'toilettes',     context: 'travel / office' },
  { american: 'check',          british: 'bill',          fr: 'addition / note',    context: 'restaurant / travel' },
  { american: 'downtown',       british: 'city centre',   fr: 'centre-ville',       context: 'travel / directions' },
  { american: 'cell phone',     british: 'mobile phone',  fr: 'téléphone portable', context: 'workplace / travel' },
  { american: 'gas',            british: 'petrol',        fr: 'essence',            context: 'travel / logistics' },
  { american: 'parking lot',    british: 'car park',      fr: 'parking',            context: 'travel / office' },
  { american: 'meeting',        british: 'meeting / conference', fr: 'réunion',     context: 'workplace' },
  { american: 'math',           british: 'maths',         fr: 'mathématiques',      context: 'general / education' },
  { american: 'store',          british: 'shop',          fr: 'magasin / boutique', context: 'customer service / retail' },
  { american: 'fall',           british: 'autumn',        fr: 'automne',            context: 'general / scheduling' },
]

export const nativeExpressions: NativeExpression[] = [

  // ── Meetings ──────────────────────────────────────────────────────────────

  {
    id: 'mtg_01', expression: 'circle back', category: 'meetings', origin: 'american', difficulty: 'medium',
    meaning: 'To return to a topic or person at a later time.',
    example: "Let's circle back on the budget figures once we have the final numbers from accounting.",
    toeicNote: 'Appears in meeting transcripts and business emails, especially in Part 4 and Part 7.',
    fr: 'Revenir sur un sujet plus tard. "On y reviendra" dans un contexte réunion.',
  },
  {
    id: 'mtg_02', expression: 'touch base', category: 'meetings', origin: 'american', difficulty: 'medium',
    meaning: 'To make brief contact with someone to share or check information.',
    example: "I'll touch base with the marketing team after the client call to make sure we're aligned.",
    toeicNote: 'Common in Part 3 (conversations between colleagues).',
    fr: '"Prendre contact" ou "faire un point rapide" avec quelqu\'un.',
  },
  {
    id: 'mtg_03', expression: 'take it offline', category: 'meetings', origin: 'american', difficulty: 'medium',
    meaning: 'To move a discussion out of the current meeting to avoid taking up everyone\'s time.',
    example: "That\'s a great point — can we take it offline and schedule a separate call?",
    toeicNote: 'Signals a topic is being deferred; common in Part 3 meeting dialogues.',
    fr: 'Reporter une discussion en dehors de la réunion principale.',
  },
  {
    id: 'mtg_04', expression: 'on the same page', category: 'meetings', origin: 'both', difficulty: 'easy',
    meaning: 'To share the same understanding or agreement about something.',
    example: "Before we proceed, I want to make sure everyone is on the same page regarding the project scope.",
    fr: 'Être d\'accord / avoir la même compréhension. "Être sur la même longueur d\'onde."',
  },
  {
    id: 'mtg_05', expression: 'wrap up', category: 'meetings', origin: 'both', difficulty: 'easy',
    meaning: 'To bring something to a conclusion; to finish.',
    example: "We only have five minutes left, so let\'s wrap up with a summary of today\'s action items.",
    toeicNote: 'Very frequent in Part 3 — signals a meeting or call is ending.',
    fr: 'Conclure, terminer. "On va conclure la réunion."',
  },
  {
    id: 'mtg_06', expression: 'run through', category: 'meetings', origin: 'both', difficulty: 'easy',
    meaning: 'To quickly review or rehearse something.',
    example: "Before the presentation, let\'s run through the slides one more time to check for errors.",
    fr: 'Passer en revue rapidement. "On va parcourir les points clés."',
  },
  {
    id: 'mtg_07', expression: 'action items', category: 'meetings', origin: 'both', difficulty: 'easy',
    meaning: 'Specific tasks assigned to individuals following a meeting.',
    example: "Our action items from today\'s meeting: Maria will finalize the report, and James will contact the vendor.",
    toeicNote: 'Appears in Part 7 meeting minutes and memos.',
    fr: 'Les tâches à accomplir décidées lors d\'une réunion. "Points d\'action."',
  },
  {
    id: 'mtg_08', expression: 'go over the agenda', category: 'meetings', origin: 'both', difficulty: 'easy',
    meaning: 'To review the list of topics to be discussed in a meeting.',
    example: "Let's go over the agenda before we get started so everyone knows what to expect.",
    toeicNote: 'Common opening line in Part 3 meeting dialogues.',
    fr: 'Passer en revue l\'ordre du jour avant la réunion.',
  },
  {
    id: 'mtg_09', expression: 'table (a topic)', category: 'meetings', origin: 'both', difficulty: 'hard',
    meaning: 'AmE: to postpone discussion. BrE: to bring a topic forward for discussion.',
    example: "AmE: Let\'s table the expansion proposal until next quarter. | BrE: I\'d like to table the proposal on flexible hours.",
    warningNote: 'Critical TOEIC trap: opposite meanings in American vs British English. Context determines meaning.',
    toeicNote: 'Part 3/4 listening may feature this — pay attention to context.',
    fr: 'AmE : reporter un sujet. BrE : soumettre un sujet à discussion. Faux ami entre les deux variétés d\'anglais!',
  },
  {
    id: 'mtg_10', expression: 'can we move on to the next item?', category: 'meetings', origin: 'both', difficulty: 'easy',
    meaning: 'A polite way to suggest transitioning to the next topic on the agenda.',
    example: "We've covered the budget review — can we move on to the next item?",
    toeicNote: 'Common transition phrase in Part 3 meeting conversations.',
    fr: 'Peut-on passer au point suivant ? — Formule de transition en réunion.',
  },
  {
    id: 'mtg_11', expression: "we're running out of time", category: 'meetings', origin: 'both', difficulty: 'easy',
    meaning: 'There is very little time remaining.',
    example: "We're running out of time — let's save the remaining questions for the follow-up email.",
    fr: 'Il ne nous reste plus beaucoup de temps. "Nous manquons de temps."',
  },
  {
    id: 'mtg_12', expression: 'could you give us an update?', category: 'meetings', origin: 'both', difficulty: 'easy',
    meaning: 'A polite request for the latest information on a situation or project.',
    example: "Before we close, could you give us an update on where the proposal stands?",
    toeicNote: 'Frequent prompt in Part 3 — the response usually contains the main information tested.',
    fr: 'Pourriez-vous nous faire un point ? "Où en sommes-nous ?"',
  },

  // ── Workplace ─────────────────────────────────────────────────────────────

  {
    id: 'wpl_01', expression: 'bandwidth', category: 'workplace', origin: 'american', difficulty: 'medium',
    meaning: 'The capacity to take on additional work or responsibilities (not internet speed here).',
    example: "I don\'t have the bandwidth to take on another project this month — I\'m already managing three.",
    fr: 'La capacité disponible pour effectuer un travail. "Je n\'ai pas la capacité de prendre autre chose."',
  },
  {
    id: 'wpl_02', expression: 'low-hanging fruit', category: 'workplace', origin: 'american', difficulty: 'medium',
    meaning: 'Easily achievable tasks, goals, or opportunities that require minimal effort.',
    example: "The low-hanging fruit in our cost-reduction plan is eliminating unused software subscriptions.",
    fr: 'Les opportunités ou tâches faciles à saisir/réaliser. Les "gains rapides".',
  },
  {
    id: 'wpl_03', expression: 'hit the ground running', category: 'workplace', origin: 'both', difficulty: 'medium',
    meaning: 'To start a new job or project immediately with full energy and effectiveness.',
    example: "We need someone who can hit the ground running — the product launch is in six weeks.",
    fr: 'Démarrer immédiatement et efficacement sans période d\'adaptation.',
  },
  {
    id: 'wpl_04', expression: 'sign off on', category: 'workplace', origin: 'both', difficulty: 'medium',
    meaning: 'To formally approve or authorize something.',
    example: "All capital expenditures over $5,000 must be signed off on by the Finance Director.",
    toeicNote: 'Frequent in Part 7 approval chains and internal memos.',
    fr: 'Approuver officiellement. "Valider" ou "signer pour accord."',
  },
  {
    id: 'wpl_05', expression: 'push back', category: 'workplace', origin: 'american', difficulty: 'medium',
    meaning: 'To resist, oppose, or express disagreement with a decision or timeline.',
    example: "The engineering team pushed back on the six-week deadline, arguing they needed at least ten.",
    fr: 'Résister, s\'opposer, émettre des réserves. "Repousser" une décision.',
  },
  {
    id: 'wpl_06', expression: 'give the green light', category: 'workplace', origin: 'both', difficulty: 'easy',
    meaning: 'To officially approve or authorize something to proceed.',
    example: "The board gave the green light to the overseas expansion after reviewing the financial projections.",
    fr: 'Donner son feu vert, autoriser officiellement.',
  },
  {
    id: 'wpl_07', expression: 'follow through', category: 'workplace', origin: 'both', difficulty: 'easy',
    meaning: 'To complete something as promised; to see a task through to its conclusion.',
    example: "It\'s important to follow through on the commitments you make to clients.",
    fr: 'Tenir ses engagements jusqu\'au bout. "Aller au bout de quelque chose."',
  },
  {
    id: 'wpl_08', expression: 'please keep me posted', category: 'workplace', origin: 'both', difficulty: 'easy',
    meaning: 'Please continue giving me information about how a situation develops.',
    example: "Please keep me posted on the status of the shipment — I need to know as soon as it arrives.",
    toeicNote: 'Common in Part 3/4 — expect a response about giving/receiving updates.',
    fr: 'Tiens-moi au courant. "Tenez-moi informé(e) de l\'évolution de la situation."',
  },
  {
    id: 'wpl_09', expression: "I'll look into it", category: 'workplace', origin: 'both', difficulty: 'easy',
    meaning: 'I will investigate or research the matter and report back.',
    example: "I'm not sure why the payment was delayed — I'll look into it and get back to you this afternoon.",
    toeicNote: 'A very common response in Part 3 when someone is asked about a problem.',
    fr: 'Je vais me renseigner / investiguer. "Je vais regarder ça."',
  },
  {
    id: 'wpl_10', expression: 'that sounds good to me', category: 'workplace', origin: 'both', difficulty: 'easy',
    meaning: 'I agree; I think that is acceptable or a good idea.',
    example: "If we can push the deadline to Thursday instead of Wednesday, that sounds good to me.",
    fr: 'Ça me convient. "Ça me semble bien." — Expression d\'accord dans un contexte professionnel.',
  },
  {
    id: 'wpl_11', expression: 'in the loop', category: 'workplace', origin: 'both', difficulty: 'easy',
    meaning: 'Kept informed about ongoing developments or decisions.',
    example: "Please keep me in the loop on any changes to the shipment schedule.",
    fr: 'Être tenu informé. "Être dans la boucle."',
  },
  {
    id: 'wpl_12', expression: 'move the needle', category: 'workplace', origin: 'american', difficulty: 'hard',
    meaning: 'To cause a measurable change or impact on a situation.',
    example: "The new marketing campaign finally moved the needle on brand recognition in the 18-35 demographic.",
    fr: 'Avoir un impact mesurable, faire bouger les choses. Référence à une aiguille de compteur.',
  },

  // ── Emails ────────────────────────────────────────────────────────────────

  {
    id: 'eml_01', expression: 'please find attached', category: 'emails', origin: 'both', difficulty: 'easy',
    meaning: 'A formal phrase indicating that a document is enclosed or attached to the email.',
    example: "Please find attached the signed contract and the revised project timeline for your review.",
    toeicNote: 'Extremely common in Part 7 email sets — usually followed by a question about the attachment.',
    fr: 'Veuillez trouver ci-joint. Formule standard pour signaler une pièce jointe.',
  },
  {
    id: 'eml_02', expression: "I'm writing to follow up on", category: 'emails', origin: 'both', difficulty: 'easy',
    meaning: 'A formal opening for an email that refers back to a previous message or conversation.',
    example: "I'm writing to follow up on my email from last Tuesday regarding the pending invoice.",
    toeicNote: 'Very common opening line in Part 7 two-email sets. Signals a relationship between messages.',
    fr: 'Je vous écris pour faire suite à… / en référence à… — Suite à un contact précédent.',
  },
  {
    id: 'eml_03', expression: 'just a quick reminder', category: 'emails', origin: 'both', difficulty: 'easy',
    meaning: 'An informal but polite way to remind someone of something.',
    example: "Just a quick reminder that the quarterly report is due this Friday at 5:00 PM.",
    toeicNote: 'Common in Part 7 internal memos and email reminders.',
    fr: 'Juste un petit rappel. — Formule de rappel polie et informelle.',
  },
  {
    id: 'eml_04', expression: 'let me know if you have any questions', category: 'emails', origin: 'both', difficulty: 'easy',
    meaning: 'An invitation for the recipient to ask for clarification or further information.',
    example: "I've attached the full report for your review. Let me know if you have any questions.",
    toeicNote: 'Standard closing line in Part 7 emails — typically before "Best regards" or "Sincerely".',
    fr: 'N\'hésitez pas à me contacter si vous avez des questions. — Invitation à poser des questions.',
  },
  {
    id: 'eml_05', expression: 'I look forward to hearing from you', category: 'emails', origin: 'both', difficulty: 'easy',
    meaning: 'A formal closing expression indicating the sender expects a reply.',
    example: "Thank you for considering our proposal. I look forward to hearing from you at your earliest convenience.",
    toeicNote: 'Standard formal email closing — appears in Part 7 business letters and proposals.',
    fr: 'Dans l\'attente de votre réponse. — Formule de clôture formelle d\'un email.',
  },
  {
    id: 'eml_06', expression: 'thank you for your prompt response', category: 'emails', origin: 'both', difficulty: 'easy',
    meaning: 'Expressing gratitude for a quick reply.',
    example: "Thank you for your prompt response — we can now proceed with the next steps.",
    fr: 'Merci pour votre réponse rapide. — Formule de remerciement pour une réponse rapide.',
  },
  {
    id: 'eml_07', expression: 'could you clarify this point?', category: 'emails', origin: 'both', difficulty: 'easy',
    meaning: 'A polite request for more detail or explanation about something unclear.',
    example: "Could you clarify this point regarding the payment terms? Section 4.2 seems ambiguous.",
    fr: 'Pourriez-vous préciser ce point ? — Demande de clarification formelle.',
  },
  {
    id: 'eml_08', expression: 'please get back to me at your earliest convenience', category: 'emails', origin: 'both', difficulty: 'medium',
    meaning: 'A polite formal request to reply as soon as possible.',
    example: "We need your decision by end of week — please get back to me at your earliest convenience.",
    toeicNote: 'Formal phrasing common in Part 7. "At your earliest convenience" = as soon as you can.',
    fr: 'Revenez vers moi dès que possible. — Formule polie pour demander une réponse rapide.',
  },
  {
    id: 'eml_09', expression: 'I apologize for the inconvenience', category: 'emails', origin: 'both', difficulty: 'easy',
    meaning: 'A formal apology for causing trouble or disruption.',
    example: "We regret that your shipment was delayed. I apologize for the inconvenience and thank you for your patience.",
    toeicNote: 'Very frequent in Part 7 customer service emails and complaint responses.',
    fr: 'Nous vous prions de nous excuser pour la gêne occasionnée. — Excuse formelle.',
  },
  {
    id: 'eml_10', expression: 'we appreciate your patience', category: 'emails', origin: 'both', difficulty: 'easy',
    meaning: 'Thanking someone for waiting or tolerating a delay without complaint.',
    example: "Your order is still being processed. We appreciate your patience and will notify you once it ships.",
    toeicNote: 'Common in Part 7 customer service correspondence alongside apologies.',
    fr: 'Nous vous remercions de votre patience. — Formule standard pour remercier d\'une attente.',
  },

  // ── Scheduling ────────────────────────────────────────────────────────────

  {
    id: 'sch_01', expression: 'can we reschedule?', category: 'scheduling', origin: 'both', difficulty: 'easy',
    meaning: 'A polite request to change the time or date of a meeting or appointment.',
    example: "Something has come up — can we reschedule our 3 PM meeting to Thursday instead?",
    toeicNote: 'Common prompt in Part 3 — expect the response to offer a new time.',
    fr: 'Peut-on reporter / déplacer ce rendez-vous ? — Demande de reprogrammation.',
  },
  {
    id: 'sch_02', expression: 'does [day/time] work for you?', category: 'scheduling', origin: 'both', difficulty: 'easy',
    meaning: 'Asking if a proposed time is convenient for someone.',
    example: "I'd like to set up a call. Does Thursday at 10 AM work for you?",
    toeicNote: 'Very frequent in Part 3 scheduling dialogues — listen for the response (yes/no/counter-offer).',
    fr: 'Est-ce que [jour/heure] vous convient ? — Proposition de créneau.',
  },
  {
    id: 'sch_03', expression: 'the meeting has been postponed', category: 'scheduling', origin: 'both', difficulty: 'easy',
    meaning: 'The meeting has been delayed to a later date.',
    example: "Please note that the board meeting has been postponed from Tuesday to Thursday at 2 PM.",
    toeicNote: 'Appears in Part 4 announcements and Part 7 schedule-change notices.',
    fr: 'La réunion a été reportée. — "Reporté" = postponed; "annulé" = canceled.',
  },
  {
    id: 'sch_04', expression: 'the deadline has been extended', category: 'scheduling', origin: 'both', difficulty: 'easy',
    meaning: 'More time has been given to complete a task.',
    example: "Good news — the submission deadline has been extended by one week to March 28.",
    toeicNote: 'Very common in Part 7 notices and Part 4 announcements — read new deadline carefully.',
    fr: 'La date limite a été prolongée / repoussée. — Bonne nouvelle dans un contexte de délais.',
  },
  {
    id: 'sch_05', expression: 'please confirm your availability', category: 'scheduling', origin: 'both', difficulty: 'easy',
    meaning: 'A formal request to indicate whether you are free at a proposed time.',
    example: "We are planning a site visit for next Wednesday. Please confirm your availability by Monday.",
    toeicNote: 'Standard scheduling request in Part 7 emails.',
    fr: 'Veuillez confirmer votre disponibilité. — Demande formelle de disponibilité.',
  },
  {
    id: 'sch_06', expression: "I'm available after [time]", category: 'scheduling', origin: 'both', difficulty: 'easy',
    meaning: 'Stating the earliest time you are free for a meeting or call.',
    example: "I have back-to-back meetings until noon. I'm available after 1 PM if that works for you.",
    fr: 'Je suis disponible à partir de [heure]. — Formule pour indiquer sa disponibilité.',
  },
  {
    id: 'sch_07', expression: 'the event has been canceled', category: 'scheduling', origin: 'both', difficulty: 'easy',
    meaning: 'The event will not take place as planned.',
    example: "Due to low registration numbers, the networking event scheduled for Friday has been canceled.",
    toeicNote: 'Appears in Part 4/7 — check if there is a refund or rescheduled date.',
    fr: 'L\'événement a été annulé. — Distinguer "canceled" (annulé) de "postponed" (reporté).',
  },
  {
    id: 'sch_08', expression: "I'll put it in the calendar", category: 'scheduling', origin: 'both', difficulty: 'easy',
    meaning: 'Confirming that you will schedule or record the meeting/event officially.',
    example: "Great — Wednesday at 2 PM works perfectly. I'll put it in the calendar and send you an invite.",
    fr: 'Je le mets dans l\'agenda. — Confirmation que le rendez-vous est bien enregistré.',
  },

  // ── Customer Service ──────────────────────────────────────────────────────

  {
    id: 'csr_01', expression: 'how may I assist you?', category: 'customer_service', origin: 'both', difficulty: 'easy',
    meaning: 'A formal greeting used in customer service contexts to offer help.',
    example: "Good afternoon, thank you for calling Nextel Support. How may I assist you today?",
    toeicNote: 'Opening line in Part 4 phone calls and customer service dialogues.',
    fr: 'Comment puis-je vous aider ? — Formule d\'accueil en service clientèle.',
  },
  {
    id: 'csr_02', expression: 'we are sorry for the inconvenience', category: 'customer_service', origin: 'both', difficulty: 'easy',
    meaning: 'A formal apology for a problem that has caused difficulty for the customer.',
    example: "We are sorry for the inconvenience caused by the system outage and thank you for your understanding.",
    toeicNote: 'Common in Part 7 customer service letters and Part 4 recorded messages.',
    fr: 'Nous sommes désolés pour la gêne occasionnée. — Excuse formelle en service clientèle.',
  },
  {
    id: 'csr_03', expression: 'your request is being processed', category: 'customer_service', origin: 'both', difficulty: 'easy',
    meaning: 'Informing a customer that their request is currently being handled.',
    example: "Thank you for your application. Your request is being processed and you will hear from us within 3 business days.",
    fr: 'Votre demande est en cours de traitement. — Formule standard de suivi de dossier.',
  },
  {
    id: 'csr_04', expression: 'please hold while I check', category: 'customer_service', origin: 'both', difficulty: 'easy',
    meaning: 'Asking a customer to wait on the line while information is being retrieved.',
    example: "I'll need to pull up your account. Please hold while I check our records.",
    toeicNote: 'Appears in Part 3/4 telephone dialogues — a response/update usually follows.',
    fr: 'Veuillez patienter pendant que je vérifie. — Formule pour mettre un client en attente.',
  },
  {
    id: 'csr_05', expression: 'a representative will contact you shortly', category: 'customer_service', origin: 'both', difficulty: 'easy',
    meaning: 'A staff member will get in touch with you soon.',
    example: "Your inquiry has been received. A representative will contact you within 24 hours.",
    toeicNote: 'Common in automated email responses tested in Part 7.',
    fr: 'Un représentant vous contactera prochainement. — Formule de service client automatique.',
  },
  {
    id: 'csr_06', expression: 'we will issue a refund', category: 'customer_service', origin: 'both', difficulty: 'easy',
    meaning: 'The company will return the money paid by the customer.',
    example: "Since the item arrived damaged, we will issue a full refund within 5-7 business days.",
    toeicNote: 'Key vocabulary in Part 7 complaint resolution emails.',
    fr: 'Nous procéderons à un remboursement. — "Rembourser" = to refund; "remboursement" = refund.',
  },
  {
    id: 'csr_07', expression: 'the item is currently out of stock', category: 'customer_service', origin: 'both', difficulty: 'easy',
    meaning: 'The product is not available for purchase at this time.',
    example: "We apologize — the model you selected is currently out of stock. We expect a new shipment by March 10.",
    toeicNote: 'Appears in Part 7 product pages and customer service emails.',
    fr: 'L\'article est actuellement en rupture de stock. — "Rupture de stock" = out of stock.',
  },
  {
    id: 'csr_08', expression: 'your order has been shipped', category: 'customer_service', origin: 'both', difficulty: 'easy',
    meaning: 'The customer\'s order has been dispatched and is on its way.',
    example: "Good news! Your order has been shipped and should arrive within 3-5 business days.",
    toeicNote: 'Shipping notification email language — common in Part 7 email chains.',
    fr: 'Votre commande a été expédiée. — "Expédier" = to ship; "livraison" = delivery.',
  },
  {
    id: 'csr_09', expression: 'please provide your order number', category: 'customer_service', origin: 'both', difficulty: 'easy',
    meaning: 'A request for the reference number to identify a specific purchase.',
    example: "To locate your account, please provide your order number as it appears on your confirmation email.",
    toeicNote: 'Part 3/4 — reference numbers are often key details tested in comprehension questions.',
    fr: 'Veuillez fournir votre numéro de commande. — "Numéro de commande" = order number.',
  },
  {
    id: 'csr_10', expression: 'the delivery has been delayed', category: 'customer_service', origin: 'both', difficulty: 'easy',
    meaning: 'The shipment will arrive later than originally scheduled.',
    example: "Due to adverse weather conditions, the delivery has been delayed by two business days.",
    toeicNote: 'Appears in Part 7 shipping notifications — check for new estimated arrival date.',
    fr: 'La livraison a été retardée. — Distinguer "delayed" (retardé) de "canceled" (annulé).',
  },

  // ── Time & Deadlines ──────────────────────────────────────────────────────

  {
    id: 'tmd_01', expression: 'by end of day (EOD)', category: 'time_deadlines', origin: 'both', difficulty: 'easy',
    meaning: 'By the close of business hours today.',
    example: "Can you send me the revised contract by EOD? The client is waiting for our response.",
    toeicNote: 'EOD is very common in Part 7 email chains — know the abbreviation.',
    fr: 'D\'ici la fin de la journée (de travail). "Pour ce soir."',
  },
  {
    id: 'tmd_02', expression: 'ahead of schedule', category: 'time_deadlines', origin: 'both', difficulty: 'easy',
    meaning: 'Completed earlier than the planned timeline.',
    example: "The construction of the new warehouse is two weeks ahead of schedule.",
    toeicNote: 'Appears in Part 4 announcements and Part 7 progress reports.',
    fr: 'En avance sur le calendrier prévu.',
  },
  {
    id: 'tmd_03', expression: 'behind schedule', category: 'time_deadlines', origin: 'both', difficulty: 'easy',
    meaning: 'Running later than the planned timeline.',
    example: "Due to supply chain delays, the product launch is three months behind schedule.",
    fr: 'En retard sur le calendrier prévu.',
  },
  {
    id: 'tmd_04', expression: 'on track', category: 'time_deadlines', origin: 'both', difficulty: 'easy',
    meaning: 'Progressing as expected; likely to meet a deadline or goal.',
    example: "The development team confirmed that the software rollout is on track for a September release.",
    fr: 'Dans les délais, sur la bonne voie. "Tout se déroule comme prévu."',
  },
  {
    id: 'tmd_05', expression: 'tight deadline', category: 'time_deadlines', origin: 'both', difficulty: 'easy',
    meaning: 'A deadline with very little time remaining to complete the work.',
    example: "We\'re working with a tight deadline — the annual report must be filed by Friday.",
    fr: 'Une échéance très proche. "Un délai serré."',
  },
  {
    id: 'tmd_06', expression: 'turnaround time', category: 'time_deadlines', origin: 'both', difficulty: 'medium',
    meaning: 'The amount of time needed to complete a process or respond to a request.',
    example: "Our standard turnaround time for contract review is five business days.",
    toeicNote: 'Appears in Part 7 service agreements and customer communication.',
    fr: 'Le délai de traitement. "Délai d\'exécution" ou "délai de réponse."',
  },
  {
    id: 'tmd_07', expression: 'crunch time', category: 'time_deadlines', origin: 'american', difficulty: 'medium',
    meaning: 'A period of intense pressure as a critical deadline approaches.',
    example: "It\'s crunch time — we need the full team working overtime to finish the proposal by Monday.",
    fr: 'La dernière ligne droite, la période de pression intense avant une échéance critique.',
  },
  {
    id: 'tmd_08', expression: 'backlog', category: 'time_deadlines', origin: 'both', difficulty: 'medium',
    meaning: 'A build-up of work or tasks that have not yet been completed.',
    example: "The customer service team is working through a backlog of over 300 unanswered inquiries.",
    toeicNote: 'Common in Part 3/4 as a reason for delays.',
    fr: 'Un arriéré de travail, des tâches en attente de traitement.',
  },

  // ── Finance ───────────────────────────────────────────────────────────────

  {
    id: 'fin_01', expression: 'bottom line', category: 'finance', origin: 'both', difficulty: 'easy',
    meaning: 'The final figure (profit/loss); or the most important conclusion of a matter.',
    example: "The bottom line is that we need to reduce operating costs by 12% to remain profitable.",
    toeicNote: 'Dual use: literal (accounting) and figurative (conclusion). Both appear in TOEIC.',
    fr: 'Le bénéfice net (sens comptable) ou l\'essentiel du propos (sens figuré). "Ce qui compte, c\'est..."',
  },
  {
    id: 'fin_02', expression: 'break even', category: 'finance', origin: 'both', difficulty: 'easy',
    meaning: 'To reach the point where revenues equal total costs — neither profit nor loss.',
    example: "The new café is expected to break even within 18 months of opening.",
    fr: 'Atteindre le seuil de rentabilité. "Être à l\'équilibre financier."',
  },
  {
    id: 'fin_03', expression: 'cost-effective', category: 'finance', origin: 'both', difficulty: 'easy',
    meaning: 'Producing good results in relation to the money or time spent.',
    example: "Hiring a freelance designer is more cost-effective than bringing on a full-time employee.",
    toeicNote: 'Common in Part 7 business proposals and memos justifying decisions.',
    fr: 'Rentable, efficace par rapport à son coût. "Rapport qualité-prix avantageux."',
  },
  {
    id: 'fin_04', expression: 'overhead costs', category: 'finance', origin: 'both', difficulty: 'medium',
    meaning: 'Ongoing fixed business expenses not directly linked to producing a product.',
    example: "By moving to a smaller office, the company reduced its monthly overhead by $8,000.",
    toeicNote: 'Appears in financial reports and business strategy texts in Part 7.',
    fr: 'Les charges fixes (loyer, salaires permanents). Les "frais généraux."',
  },
  {
    id: 'fin_05', expression: 'ballpark figure', category: 'finance', origin: 'american', difficulty: 'medium',
    meaning: 'A rough or approximate estimate.',
    example: "Can you give me a ballpark figure for the renovation? I need something for the board presentation.",
    fr: 'Un chiffre approximatif, une estimation grossière. "Dans les grandes lignes."',
  },
  {
    id: 'fin_06', expression: 'across the board', category: 'finance', origin: 'both', difficulty: 'medium',
    meaning: 'Applying equally to all employees, products, or categories.',
    example: "Due to the economic downturn, all bonuses were suspended across the board.",
    fr: 'De manière générale, pour tout le monde sans exception. "À tous les niveaux."',
  },
  {
    id: 'fin_07', expression: 'in the red / in the black', category: 'finance', origin: 'both', difficulty: 'medium',
    meaning: 'In the red = operating at a loss. In the black = operating at a profit.',
    example: "After three difficult years, the subsidiary is finally in the black again.",
    toeicNote: 'Both expressions appear in Part 7 financial announcements and earnings reports.',
    fr: 'Dans le rouge = en déficit. Dans le noir = bénéficiaire. Expressions comptables classiques.',
  },
  {
    id: 'fin_08', expression: 'cut costs', category: 'finance', origin: 'both', difficulty: 'easy',
    meaning: 'To reduce expenses.',
    example: "To cut costs, the company renegotiated supplier contracts and reduced travel allowances.",
    fr: 'Réduire les dépenses, faire des économies.',
  },

  // ── Communication ─────────────────────────────────────────────────────────

  {
    id: 'com_01', expression: 'reach out', category: 'communication', origin: 'american', difficulty: 'easy',
    meaning: 'To contact someone, typically to initiate communication.',
    example: "Please feel free to reach out if you have any questions about the onboarding process.",
    toeicNote: 'Extremely common in Part 7 emails — signals friendly, proactive contact.',
    fr: 'Contacter quelqu\'un, prendre contact. "N\'hésitez pas à me contacter."',
  },
  {
    id: 'com_02', expression: 'get back to', category: 'communication', origin: 'both', difficulty: 'easy',
    meaning: 'To respond to someone at a later time.',
    example: "I don\'t have those figures with me right now — I\'ll get back to you by the end of the week.",
    fr: 'Revenir vers quelqu\'un, rappeler ou répondre ultérieurement.',
  },
  {
    id: 'com_03', expression: 'loop in', category: 'communication', origin: 'american', difficulty: 'medium',
    meaning: 'To include someone in a communication or decision-making process.',
    example: "Can you loop in the legal department before we finalize this agreement?",
    fr: 'Inclure quelqu\'un dans une communication. "Mettre dans la boucle."',
  },
  {
    id: 'com_04', expression: 'in writing', category: 'communication', origin: 'both', difficulty: 'easy',
    meaning: 'Formally documented or confirmed in a written format, not just verbally.',
    example: "Before any changes are made to the contract, we need confirmation in writing from both parties.",
    fr: 'Par écrit, sous forme écrite et officielle. Opposé à "oral" ou "verbal."',
  },
  {
    id: 'com_05', expression: 'as per / per', category: 'communication', origin: 'both', difficulty: 'medium',
    meaning: 'According to; in accordance with. Common in formal correspondence.',
    example: "As per our telephone conversation this morning, the delivery will be rescheduled to the 15th.",
    toeicNote: 'Standard formal email phrase; appears frequently in Part 7 correspondence.',
    fr: 'Conformément à, selon. "Comme convenu", "tel que mentionné."',
  },
  {
    id: 'com_06', expression: 'to whom it may concern', category: 'communication', origin: 'both', difficulty: 'easy',
    meaning: 'A formal salutation used when the recipient of a letter is unknown.',
    example: "To Whom It May Concern: I am writing to express my interest in the Regional Manager position.",
    toeicNote: 'Appears in Part 7 formal letters — signals a general/public recipient.',
    fr: '"À qui de droit" — formule d\'ouverture d\'une lettre formelle sans destinataire précis.',
  },
  {
    id: 'com_07', expression: 'regarding / with reference to', category: 'communication', origin: 'both', difficulty: 'easy',
    meaning: 'Formal prepositions introducing the subject of a letter or email.',
    example: "I am writing regarding the invoice dated March 3rd, which appears to contain an error.",
    toeicNote: 'Subject-line formula in Part 7: "Re: / Regarding / With reference to..."',
    fr: '"Concernant" / "En référence à." Introduit l\'objet d\'un courrier formel.',
  },
  {
    id: 'com_08', expression: 'please review the document', category: 'communication', origin: 'both', difficulty: 'easy',
    meaning: 'A request to read and check a document for accuracy, completeness, or approval.',
    example: "Please review the document before Thursday and send me your comments by email.",
    toeicNote: 'Part 7 email instructions — the attachment is often then described in a question.',
    fr: 'Veuillez examiner / relire le document. — Demande de relecture ou de validation.',
  },
  {
    id: 'com_09', expression: 'the results are listed below', category: 'communication', origin: 'both', difficulty: 'easy',
    meaning: 'Indicating that information follows in the current document or email.',
    example: "We have completed the audit. The results are listed below for your reference.",
    toeicNote: 'Part 7 — signals that the next section of the text contains key data.',
    fr: 'Les résultats sont listés ci-dessous. — Formule de référencement dans un document.',
  },
  {
    id: 'com_10', expression: 'heads up', category: 'communication', origin: 'american', difficulty: 'easy',
    meaning: 'An advance warning or notification about something.',
    example: "Just a heads up — the CEO will be joining tomorrow\'s team meeting, so please come prepared.",
    fr: 'Un avertissement préalable, une information donnée à l\'avance. "Juste pour te prévenir..."',
  },

  // ── Travel ────────────────────────────────────────────────────────────────

  {
    id: 'trv_01', expression: 'check in', category: 'travel', origin: 'both', difficulty: 'easy',
    meaning: 'To register your arrival at a hotel, airport, or event.',
    example: "Guests may check in from 3:00 PM. Early check-in is available upon request.",
    toeicNote: 'Appears constantly in Part 4 hotel/airport announcements and Part 7 reservation emails.',
    fr: 'S\'enregistrer à l\'arrivée (hôtel, aéroport). "Faire son check-in."',
  },
  {
    id: 'trv_02', expression: 'please proceed to gate 12', category: 'travel', origin: 'both', difficulty: 'easy',
    meaning: 'A formal instruction to move to a specific boarding gate at an airport.',
    example: "Passengers on flight SK452 to Oslo, please proceed to gate 12 for immediate boarding.",
    toeicNote: 'Classic Part 4 airport announcement — note gate number, destination, and boarding time.',
    fr: 'Veuillez vous rendre à la porte 12. — Formule d\'annonce dans les aéroports.',
  },
  {
    id: 'trv_03', expression: 'connecting flight', category: 'travel', origin: 'both', difficulty: 'easy',
    meaning: 'A flight requiring passengers to change planes at an intermediate airport.',
    example: "My connecting flight departs from Gate B22 — I have a 90-minute layover in Dubai.",
    toeicNote: 'Vocabulary appears in Part 4 airport announcements and Part 7 itineraries.',
    fr: 'Un vol de correspondance. "Escale" = layover, "correspondance" = connection.',
  },
  {
    id: 'trv_04', expression: 'carry-on luggage', category: 'travel', origin: 'both', difficulty: 'easy',
    meaning: 'Hand luggage small enough to be stored in the overhead compartment on a plane.',
    example: "Carry-on bags must not exceed 10 kg and must fit within the cabin luggage sizing frame.",
    toeicNote: 'Appears in airline notices and Part 4 boarding announcements.',
    fr: 'Bagage à main (en cabine). Opposé à "checked baggage" (bagage en soute).',
  },
  {
    id: 'trv_05', expression: 'the shuttle service is available', category: 'travel', origin: 'both', difficulty: 'easy',
    meaning: 'A transportation service (bus/van) that runs between fixed points on a regular schedule.',
    example: "A complimentary shuttle service is available between the hotel and the convention center every 30 minutes.",
    toeicNote: 'Very common in Part 4 hotel/conference announcements and Part 7 event guides.',
    fr: 'La navette est disponible. "Navette" = shuttle. Service de transport entre deux points.',
  },
  {
    id: 'trv_06', expression: 'complimentary', category: 'travel', origin: 'both', difficulty: 'medium',
    meaning: 'Provided free of charge as a courtesy or service.',
    example: "A complimentary breakfast is included with all Deluxe and Suite reservations.",
    toeicNote: 'Key vocabulary in Part 7 hotel/conference brochures. NOT the same as "complementary" (completing something).',
    warningNote: '"Complimentary" (free) vs "complementary" (mutually completing) — common TOEIC spelling trap.',
    fr: 'Offert, gratuit. "Le petit-déjeuner est offert." À ne pas confondre avec "complémentaire."',
  },
  {
    id: 'trv_07', expression: 'please keep your ticket with you', category: 'travel', origin: 'both', difficulty: 'easy',
    meaning: 'An instruction to retain your admission or travel document throughout the journey or event.',
    example: "Please keep your ticket with you at all times — it may be required for re-entry.",
    toeicNote: 'Appears in Part 4 announcements for events, trains, and transit.',
    fr: 'Veuillez conserver votre billet. — Rappel de garder son titre de transport.',
  },
  {
    id: 'trv_08', expression: 'within walking distance', category: 'travel', origin: 'both', difficulty: 'easy',
    meaning: 'Close enough to reach by walking; not requiring transport.',
    example: "The conference center is within walking distance of the hotel — about a 10-minute walk.",
    toeicNote: 'Part 4/7 — often mentioned in hotel and venue descriptions.',
    fr: 'À distance de marche, accessible à pied. "À quelques minutes à pied."',
  },

  // ── Negotiations ──────────────────────────────────────────────────────────

  {
    id: 'neg_01', expression: 'meet halfway', category: 'negotiations', origin: 'both', difficulty: 'easy',
    meaning: 'To compromise, each party making concessions toward a mutual agreement.',
    example: "We asked for a 20% discount; they offered 5%. In the end, we agreed to meet halfway at 12%.",
    fr: 'Faire des concessions mutuelles, se retrouver au milieu. "Trouver un terrain d\'entente."',
  },
  {
    id: 'neg_02', expression: 'deal breaker', category: 'negotiations', origin: 'american', difficulty: 'medium',
    meaning: 'A condition or factor that makes an agreement impossible if not satisfied.',
    example: "For us, intellectual property ownership is a deal breaker — it\'s non-negotiable.",
    toeicNote: 'Appears in Part 3 negotiation dialogues and Part 7 contract discussions.',
    fr: 'Un point de rupture, une condition sine qua non. "Ce qui ferait échouer l\'accord."',
  },
  {
    id: 'neg_03', expression: 'win-win', category: 'negotiations', origin: 'american', difficulty: 'easy',
    meaning: 'An outcome that benefits all parties involved.',
    example: "The revised partnership agreement is a win-win: we get distribution access, they get our product line.",
    fr: 'Un accord mutuellement bénéfique. "Gagnant-gagnant."',
  },
  {
    id: 'neg_04', expression: 'in good faith', category: 'negotiations', origin: 'both', difficulty: 'medium',
    meaning: 'With honest and sincere intentions; without intent to deceive.',
    example: "Both companies entered the joint venture in good faith, but unforeseen market changes derailed it.",
    toeicNote: 'Legal and contractual language — appears in Part 7 business correspondence.',
    fr: 'De bonne foi, avec honnêteté et sincérité. Terme juridique courant.',
  },
  {
    id: 'neg_05', expression: 'terms and conditions', category: 'negotiations', origin: 'both', difficulty: 'easy',
    meaning: 'The rules, requirements, and stipulations of a contract or agreement.',
    example: "Please read the terms and conditions carefully before signing the service agreement.",
    toeicNote: 'Appears in Part 7 contract excerpts and fine print.',
    fr: 'Les conditions générales d\'un contrat. "Les clauses et modalités."',
  },
  {
    id: 'neg_06', expression: 'put forward', category: 'negotiations', origin: 'british', difficulty: 'medium',
    meaning: 'To formally propose or suggest something for consideration.',
    example: "The trade union put forward a proposal for a 7% wage increase at last week\'s negotiations.",
    fr: 'Soumettre, proposer formellement. "Mettre sur la table une proposition."',
  },
  {
    id: 'neg_07', expression: 'non-negotiable', category: 'negotiations', origin: 'both', difficulty: 'easy',
    meaning: 'Not open to discussion or change; a fixed requirement.',
    example: "The payment terms are non-negotiable — we require a 30-day payment window on all contracts.",
    toeicNote: 'Appears in Part 7 contract language and business correspondence.',
    fr: 'Non négociable, fixe, non modifiable. "Ce point n\'est pas discutable."',
  },
  {
    id: 'neg_08', expression: 'call the shots', category: 'negotiations', origin: 'american', difficulty: 'medium',
    meaning: 'To be in control of decisions; to have the authority.',
    example: "In this negotiation, the client is calling the shots — we need to adapt to their priorities.",
    fr: 'Avoir le contrôle, prendre les décisions. "C\'est lui qui décide."',
  },
]
