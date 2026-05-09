import React, { useState } from 'react'
import { Map, Clock, Target, Zap } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'

type Tab = 'overview' | 'part5' | 'part6' | 'part7' | 'listening' | 'time' | 'examday' | 'last48'

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'part5', label: 'Part 5' },
  { id: 'part6', label: 'Part 6' },
  { id: 'part7', label: 'Part 7' },
  { id: 'listening', label: 'Listening' },
  { id: 'time', label: 'Time Budget' },
  { id: 'examday', label: 'Exam Day' },
  { id: 'last48', label: 'Last 48h' },
]

export const Strategy: React.FC = () => {
  const [tab, setTab] = useState<Tab>('overview')

  return (
    <div className="p-4 sm:p-5 lg:p-6 max-w-3xl mx-auto space-y-5 pb-24 sm:pb-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Map className="w-6 h-6 text-indigo-400" />
          Strategy <span className="text-gradient">Guide</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">650 → 940 Game Plan</p>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap border transition-all flex-shrink-0 ${tab === t.id ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && <OverviewTab />}
      {tab === 'part5' && <Part5Tab />}
      {tab === 'part6' && <Part6Tab />}
      {tab === 'part7' && <Part7Tab />}
      {tab === 'listening' && <ListeningTab />}
      {tab === 'time' && <TimeTab />}
      {tab === 'examday' && <ExamDayTab />}
      {tab === 'last48' && <Last48Tab />}
    </div>
  )
}

const Section: React.FC<{ title: string; children: React.ReactNode; badge?: string }> = ({ title, children, badge }) => (
  <Card className="p-4">
    <div className="flex items-center gap-2 mb-3">
      <h3 className="text-sm font-semibold text-indigo-400">{title}</h3>
      {badge && <Badge variant="amber">{badge}</Badge>}
    </div>
    <div className="text-xs text-slate-300 leading-relaxed space-y-2">{children}</div>
  </Card>
)

const Bullet: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="flex items-start gap-2"><span className="text-indigo-400 flex-shrink-0">→</span><span>{children}</span></p>
)

const OverviewTab: React.FC = () => (
  <div className="space-y-4">
    <Section title="The 650 → 940 Path" badge="HIGH ROI">
      <p className="text-slate-300 font-medium">The 290-point gap is achievable in 2-4 weeks with the right strategy. Here is where to invest your time:</p>
      <Bullet><strong className="text-white">Part 5 (40 Q):</strong> Highest ROI. Pure grammar rules + vocabulary. 10 minutes. Each correct answer = 5 points.</Bullet>
      <Bullet><strong className="text-white">Part 7 (54 Q):</strong> Most questions overall. Skim-scan technique + trap avoidance. 55 minutes.</Bullet>
      <Bullet><strong className="text-white">Part 6 (16 Q):</strong> Context-dependent grammar. 8 minutes. Similar to Part 5 but harder.</Bullet>
      <Bullet><strong className="text-white">Parts 1-4 (Listening):</strong> Pre-reading and prediction strategies. Cannot be improved without audio practice.</Bullet>
    </Section>
    <Section title="The 3 Laws of TOEIC 940">
      <Bullet><strong className="text-white">Law 1 — Speed + Accuracy:</strong> Part 5 at 35 seconds each, Part 7 at 65 seconds each. Time discipline is non-negotiable.</Bullet>
      <Bullet><strong className="text-white">Law 2 — Trap Immunity:</strong> The exam is designed to trick you. The correct answer rarely uses the same words as the passage.</Bullet>
      <Bullet><strong className="text-white">Law 3 — Pattern Recognition:</strong> 80% of Part 5 uses the same 8 patterns. Learn the patterns, not just individual questions.</Bullet>
    </Section>
    <Section title="Weekly Study Protocol">
      <Bullet>Week 1: Master all Part 5 categories (word form, prepositions, conjunctions, tenses, pronouns)</Bullet>
      <Bullet>Week 2: Part 7 reading strategy + all 5 passage types</Bullet>
      <Bullet>Week 3: Speed drills + mock exams + error notebook review</Bullet>
      <Bullet>Final 48h: Review only. No new material. Sleep 8+ hours.</Bullet>
    </Section>
  </div>
)

const Part5Tab: React.FC = () => (
  <div className="space-y-4">
    <Section title="Pattern 1: Word Form (≈30% of Part 5)">
      <Bullet>Before a noun → need ADJECTIVE (not adverb). Example: "a <em>comprehensive</em> plan"</Bullet>
      <Bullet>After an article (a/an/the) + before noun → ADJECTIVE. Never adverb here.</Bullet>
      <Bullet>After auxiliary verb → PAST PARTICIPLE or BASE FORM depending on tense.</Bullet>
      <Bullet>KEY: -ly ending is usually adverb. BUT: timely, friendly, costly, lively = adjectives.</Bullet>
    </Section>
    <Section title="Pattern 2: Prepositions (≈15% of Part 5)">
      <Bullet>responsible FOR · comply WITH · result FROM or result IN · in charge OF</Bullet>
      <Bullet>refer TO · specialize IN · aware OF · in accordance WITH · on behalf OF</Bullet>
      <Bullet>at capacity · on time · by deadline · in detail · at risk</Bullet>
      <Bullet>RULE: Memorize as chunks, not separate words. "comply WITH" = one unit.</Bullet>
    </Section>
    <Section title="Pattern 3: Conjunctions (≈15% of Part 5)">
      <Bullet>ALTHOUGH/EVEN THOUGH + full clause (S+V). DESPITE/IN SPITE OF + noun phrase.</Bullet>
      <Bullet>BECAUSE/SINCE + clause = reason. DUE TO + noun phrase = cause.</Bullet>
      <Bullet>UNLESS = if not. IF = condition. AS LONG AS = provided that.</Bullet>
      <Bullet>HOWEVER is NOT a conjunction — it connects sentences, not clauses.</Bullet>
    </Section>
    <Section title="Pattern 4: Verb Tense (≈15% of Part 5)">
      <Bullet>Since/for/recently → present perfect. Yesterday/last → simple past. Tomorrow/next → future.</Bullet>
      <Bullet>By the time + present clause → future perfect in main clause.</Bullet>
      <Bullet>Require/recommend/suggest that + subject + BASE VERB (subjunctive).</Bullet>
      <Bullet>Third conditional: If + past perfect → would have + past participle.</Bullet>
    </Section>
    <Section title="Patterns 5-8">
      <Bullet><strong className="text-white">Articles:</strong> A = first mention, THE = second mention. Superlatives always take THE.</Bullet>
      <Bullet><strong className="text-white">Pronouns:</strong> Each/every = his or her (singular). Committee/team = its. Neither...nor = agree with nearer noun.</Bullet>
      <Bullet><strong className="text-white">Vocabulary:</strong> Read all 4 options. Focus on TOEIC-specific meanings. Postpone ≠ cancel.</Bullet>
      <Bullet><strong className="text-white">Collocations:</strong> Reach a consensus · expand operations · exceed expectations · meet a deadline.</Bullet>
    </Section>
  </div>
)

const Part6Tab: React.FC = () => (
  <div className="space-y-4">
    <Section title="What Makes Part 6 Different From Part 5">
      <Bullet>Blanks appear inside 4 longer texts (letters, memos, notices). Each text has 4 blanks.</Bullet>
      <Bullet>One blank per text requires inserting a FULL SENTENCE — choose the best logical sentence.</Bullet>
      <Bullet>Context matters: the surrounding paragraph determines the correct tense, connector, and vocabulary.</Bullet>
    </Section>
    <Section title="Part 6 Execution Strategy">
      <Bullet>Read the full paragraph around the blank before answering — never just the sentence.</Bullet>
      <Bullet>For connectors: identify the relationship (contrast? addition? result?) first.</Bullet>
      <Bullet>For sentence insertion: the inserted sentence must flow naturally from the previous sentence AND into the next.</Bullet>
      <Bullet>Time budget: ~2 minutes per 4-blank text = 8 minutes for all of Part 6.</Bullet>
    </Section>
    <Section title="Sentence Insertion Technique">
      <Bullet>Step 1: Read sentence before the blank. What is the topic? What pronoun/subject does it end with?</Bullet>
      <Bullet>Step 2: Read sentence after the blank. Does it start with "this" or "therefore" or "however"? That tells you what the inserted sentence must establish.</Bullet>
      <Bullet>Step 3: The inserted sentence must bridge these two smoothly.</Bullet>
    </Section>
  </div>
)

const Part7Tab: React.FC = () => (
  <div className="space-y-4">
    <Section title="The Golden Rule: Question FIRST" badge="Critical">
      <Bullet>Never read the passage first. Read Question 1. Find the keyword. Then scan the passage for ONLY that keyword.</Bullet>
      <Bullet>Detail questions (80%): scan for specific facts, numbers, names, dates.</Bullet>
      <Bullet>Inference questions (10%): read the relevant paragraph fully. Choose the minimum logical conclusion.</Bullet>
      <Bullet>Vocabulary questions (10%): replace the word with each option. Choose best fit in context.</Bullet>
    </Section>
    <Section title="The 5 Trap Types in Part 7">
      <Bullet><strong className="text-white">Paraphrase Trap:</strong> Correct answer uses synonyms — never the exact words from the passage.</Bullet>
      <Bullet><strong className="text-white">Date Confusion:</strong> Multiple dates in document. Each date has a specific purpose — label them all.</Bullet>
      <Bullet><strong className="text-white">NOT TRUE:</strong> Three answers are true. One is false or not mentioned. Read carefully.</Bullet>
      <Bullet><strong className="text-white">Over-inference:</strong> "Will definitely" or "never" = almost always wrong. Choose conservative conclusions.</Bullet>
      <Bullet><strong className="text-white">Detail Swap:</strong> Correct number but wrong category (e.g., 68% of companies vs. 20% reduction).</Bullet>
    </Section>
    <Section title="Time Allocation for Part 7">
      <Bullet>Single passages (2-4 Q): ~3 minutes each. Read question, scan, answer, move on.</Bullet>
      <Bullet>Double passages: ~5 minutes. Third question often requires connecting both texts.</Bullet>
      <Bullet>Triple passages: ~7 minutes. Most complex. Do last if time-pressured.</Bullet>
    </Section>
  </div>
)

const ListeningTab: React.FC = () => (
  <div className="space-y-4">
    <Section title="Part 1 — Photographs (6 Q)">
      <Bullet>Pre-read: look at the photo for 2 seconds before audio starts. Identify: main subject, action, location.</Bullet>
      <Bullet>Eliminate options that describe something NOT in the photo. One small detail error = wrong answer.</Bullet>
      <Bullet>Common traps: passive vs. active ("being loaded" vs. "has been loaded"), similar-sounding words.</Bullet>
    </Section>
    <Section title="Part 2 — Question-Response (25 Q)">
      <Bullet>These 25 questions have NO visual aid. Pure audio. Concentration is everything.</Bullet>
      <Bullet>Focus on the FIRST WORD of the question: Who/What/When/Where/Why/How. This tells you the answer type.</Bullet>
      <Bullet>Indirect answers are frequently correct: "I'll ask David" is a valid answer to "Who handles HR?"</Bullet>
      <Bullet>Time trap: do not overthink. Answer in real-time. Move on.</Bullet>
    </Section>
    <Section title="Part 3 — Conversations (39 Q)">
      <Bullet>Before each conversation: read all 3 questions quickly. Know what information you need before listening.</Bullet>
      <Bullet>Graphic questions: look at the graph/table while listening. Connect visual data to audio information.</Bullet>
      <Bullet>Next action questions: focus on the LAST thing the speakers say.</Bullet>
    </Section>
    <Section title="Part 4 — Talks (30 Q)">
      <Bullet>Same pre-reading strategy as Part 3. Read all 3 questions before the talk begins.</Bullet>
      <Bullet>Pay attention to the PURPOSE of the talk in the first 10 seconds.</Bullet>
      <Bullet>Number questions: write down numbers as you hear them — they change fast.</Bullet>
      <Bullet>Inference questions: "What will the speaker most likely do next?" = context clue in final sentence.</Bullet>
    </Section>
  </div>
)

const TimeTab: React.FC = () => (
  <div className="space-y-4">
    <Card className="p-4">
      <h3 className="text-sm font-semibold text-indigo-400 mb-3">Ideal Time Budget</h3>
      <div className="space-y-2">
        {[
          { part: 'Part 1 (Photos)', q: 6, min: '6 min', tip: '~60s each' },
          { part: 'Part 2 (Response)', q: 25, min: '12 min', tip: '~30s each' },
          { part: 'Part 3 (Conversations)', q: 39, min: '20 min', tip: 'Preset timing' },
          { part: 'Part 4 (Talks)', q: 30, min: '17 min', tip: 'Preset timing' },
          { part: '--- BREAK ---', q: 0, min: '10 min', tip: 'Mandatory' },
          { part: 'Part 5 (Grammar)', q: 40, min: '10 min', tip: '15s ideal, 45s max' },
          { part: 'Part 6 (Text Fill)', q: 16, min: '8 min', tip: '2 min per text' },
          { part: 'Part 7 (Reading)', q: 54, min: '55 min', tip: '65s per question avg' },
        ].map(row => (
          <div key={row.part} className={`flex items-center justify-between py-2 border-b border-stone-200 last:border-0 ${row.q === 0 ? 'opacity-40' : ''}`}>
            <span className="text-xs text-slate-400">{row.part}</span>
            <div className="flex items-center gap-4">
              {row.q > 0 && <span className="text-xs text-slate-600">{row.q} Q</span>}
              <span className="text-xs font-semibold text-white w-14 text-right">{row.min}</span>
              <span className="text-xs text-slate-600 w-24 text-right">{row.tip}</span>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between py-2 font-bold">
          <span className="text-sm text-white">TOTAL</span>
          <span className="text-sm text-indigo-400">120 min</span>
        </div>
      </div>
    </Card>
    <Section title="The 45-Second Rule for Part 5">
      <Bullet>If you cannot answer a Part 5 question within 45 seconds: mark it and MOVE ON.</Bullet>
      <Bullet>Return to marked questions AFTER completing all other questions.</Bullet>
      <Bullet>This prevents the most common high-scorer failure: running out of time in Part 7.</Bullet>
    </Section>
  </div>
)

const ExamDayTab: React.FC = () => (
  <div className="space-y-4">
    <Section title="Morning Routine (Exam Day)">
      <Bullet>Wake up 2+ hours before exam. Eat protein breakfast (eggs, not sugar). No cramming.</Bullet>
      <Bullet>Review your top 10 Error Notebook patterns while having breakfast. Zero new material.</Bullet>
      <Bullet>Arrive 30 minutes early. Bring water, pencils, ID, confirmation slip.</Bullet>
    </Section>
    <Section title="During Listening (Parts 1-4)">
      <Bullet>Use every second of setup time to read the questions for the NEXT set.</Bullet>
      <Bullet>Write answers on answer sheet immediately — do not save for later.</Bullet>
      <Bullet>If you miss a question: let it go. Do not dwell. Focus on the next one.</Bullet>
    </Section>
    <Section title="During Reading (Parts 5-7)">
      <Bullet>Start with Part 5. Spend maximum 10 minutes. Never more.</Bullet>
      <Bullet>Part 6: 8 minutes max. Part 7: ALL remaining time.</Bullet>
      <Bullet>If running low on time in Part 7: skim passage, read all questions, answer all — even guess.</Bullet>
      <Bullet>No blank answers. An educated guess has a 25% chance. Blank = 0%.</Bullet>
    </Section>
    <Section title="Mental Game">
      <Bullet>You will encounter questions you do not know. This is normal. Stay calm.</Bullet>
      <Bullet>One wrong answer does not derail your score. Pattern of wrong answers does.</Bullet>
      <Bullet>The exam rewards consistency, not brilliance. Stay methodical.</Bullet>
    </Section>
  </div>
)

const Last48Tab: React.FC = () => (
  <div className="space-y-4">
    <Card className="p-4 border-amber-500/30">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-semibold text-amber-400">48 Hours Before Exam — Strict Protocol</h3>
      </div>
      <p className="text-xs text-slate-400 mb-3">This is a MAINTENANCE phase, not a learning phase. Your brain needs to consolidate, not absorb.</p>
      <div className="space-y-2 text-xs text-slate-300">
        {[
          '☐ Review Error Notebook — top 10 highest-frequency mistakes only',
          '☐ Read all 20 Trap Lab entries — predict the trap before reading the answer',
          '☐ Vocabulary: Known cards only — confidence building, not new learning',
          '☐ Read the exam day protocol once more',
          '☐ Prepare all exam materials (pencils, ID, directions) the night before',
          '☐ Eat a good dinner. No alcohol.',
          '☐ Sleep by 10 PM — 8+ hours minimum',
          '☐ Morning: light review, protein breakfast, arrive early',
        ].map((item, i) => (
          <p key={i}>{item}</p>
        ))}
      </div>
    </Card>
    <Section title="What NOT To Do In Last 48 Hours" badge="Avoid">
      <Bullet>Do NOT study new vocabulary. Your brain cannot consolidate new words in 48 hours.</Bullet>
      <Bullet>Do NOT take a full mock exam. It depletes cognitive reserves needed for the real exam.</Bullet>
      <Bullet>Do NOT stay up late studying. Sleep deprivation costs 50+ points.</Bullet>
      <Bullet>Do NOT try to "cover everything." Focus only on your personal weak patterns.</Bullet>
    </Section>
  </div>
)
