import React, { useState } from 'react'
import { Headphones, Mic, Users, Volume2, AlertTriangle } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'

type PartInfo = {
  part: string
  title: string
  questions: number
  time: string
  icon: React.ReactNode
  description: string
  strategies: string[]
  traps: string[]
  questionTypes: string[]
}

const PARTS: PartInfo[] = [
  {
    part: 'Part 1',
    title: 'Photographs',
    questions: 6,
    time: '~60s each',
    icon: <Mic className="w-5 h-5 text-indigo-400" />,
    description: 'You see a photograph. You hear 4 statements. Choose the statement that best describes the photograph.',
    strategies: [
      'BEFORE AUDIO: Spend 2 seconds scanning the photo. Identify: (1) main subject, (2) their action/state, (3) location/environment.',
      'Listen for the grammatical structure. Statements about photos use present continuous ("is/are doing") or present perfect passive ("has been placed").',
      'Eliminate options: if ANY part of a statement is incorrect, it is wrong. One wrong detail = wrong answer.',
      'Words you cannot see in the photo are usually wrong. If no people are visible, options starting with "He/She/They" are wrong.',
    ],
    traps: [
      'Similar-sounding words: "beach/bench", "parking lot/market", "desk/disk" — listen carefully.',
      'Active vs. passive confusion: "organizing files" vs "files are being organized" — both may sound plausible.',
      'Partially correct answers: 3 out of 4 details correct, but one critical detail is wrong.',
    ],
    questionTypes: ['Direct description', 'Object location', 'Action description', 'Setting description'],
  },
  {
    part: 'Part 2',
    title: 'Question-Response',
    questions: 25,
    time: '~8s to answer',
    icon: <Headphones className="w-5 h-5 text-emerald-400" />,
    description: 'You hear a question or statement. You hear 3 responses. Choose the most appropriate response. No visual aid.',
    strategies: [
      'Focus on the FIRST WORD of the question: Who/What/When/Where/Why/How → this determines the answer type.',
      'Do not get distracted by repeated words. The correct answer often avoids exact repetition from the question.',
      'Indirect answers are frequently correct on TOEIC. "I\'ll ask the manager" can answer "Who handles that?"',
      'For Yes/No questions: the correct answer does not always start with Yes/No.',
    ],
    traps: [
      'Echo trap: options repeat a key word from the question to confuse you. The word appears in the wrong context.',
      'Homophone trap: similar-sounding words used in options (for/four, whether/weather).',
      'Indirect answer trap: students reject indirect answers thinking they "don\'t answer the question."',
      'Distractor: an option that sounds relevant but is from a completely different topic.',
    ],
    questionTypes: ['Wh- questions', 'Yes/No questions', 'Choice questions (A or B?)', 'Statement + response', 'Request + response'],
  },
  {
    part: 'Part 3',
    title: 'Conversations',
    questions: 39,
    time: '8-9 min total',
    icon: <Users className="w-5 h-5 text-amber-400" />,
    description: 'You hear a conversation between 2-3 speakers. You see 3 questions per conversation. Some include a visual (chart/graphic).',
    strategies: [
      'PRE-READ: Use the time between conversations to read all 3 questions AND all answer choices for the NEXT conversation.',
      'Question order follows audio order: Q1 is answered early in the conversation, Q3 near the end.',
      'Graphic questions: look at the chart/graphic while listening. Connect what you hear to what you see.',
      '"Next action" questions: pay close attention to the LAST line of the conversation.',
    ],
    traps: [
      'Literal vs. implied meaning: the correct answer may rephrase what was said, not quote it.',
      'Wrong speaker: question asks what the woman will do, but student answers based on what the man said.',
      'Graphic mismatch: you hear a city name, but must match it to the correct row/column in a table.',
    ],
    questionTypes: ['Main topic', 'Speaker intention', 'Detail (time/place/person)', 'Next action', 'Graphic interpretation'],
  },
  {
    part: 'Part 4',
    title: 'Talks',
    questions: 30,
    time: '8-9 min total',
    icon: <Volume2 className="w-5 h-5 text-red-400" />,
    description: 'You hear a monologue (announcement, voicemail, broadcast, tour, meeting). 3 questions per talk. Some include a visual graphic.',
    strategies: [
      'PRE-READ all 3 questions before the talk begins. Know exactly what information you need.',
      'Identify the PURPOSE in the first 10 seconds. Announcement? Warning? Instruction? This frames the whole talk.',
      'Write down numbers as you hear them — product codes, times, amounts change quickly.',
      'For inference questions ("What will happen next?"): the answer is usually stated or strongly implied in the final sentence.',
    ],
    traps: [
      'Number confusion: multiple numbers mentioned — identify which one answers the specific question.',
      'Organization trap: the talk mentions several items — student matches wrong item to wrong detail.',
      'Inference overreach: student chooses an answer that is possible but NOT strongly supported by the text.',
    ],
    questionTypes: ['Main purpose', 'Specific detail', 'Graphic interpretation', 'Inference/Next action', 'Audience identification'],
  },
]

export const ListeningCenter: React.FC = () => {
  const [selectedPart, setSelectedPart] = useState<string | null>(null)
  const part = PARTS.find(p => p.part === selectedPart)

  return (
    <div className="p-4 sm:p-5 lg:p-6 max-w-3xl mx-auto space-y-5 pb-24 sm:pb-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Headphones className="w-6 h-6 text-indigo-400" />
          Listening <span className="text-gradient">Center</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">Parts 1-4 — Strategy, traps, and question types</p>
      </div>

      {/* Audio Coming Soon Banner */}
      <Card className="p-4 border-indigo-500/30 bg-indigo-600/5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <Headphones className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-indigo-300 mb-1">Audio Practice — Architecture Ready</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              The listening practice module is architected and ready for audio content integration.
              Audio files can be added to <code className="text-indigo-400 bg-indigo-600/10 px-1 rounded">public/audio/</code> and
              the player component will activate automatically. Currently, all strategy content is fully functional below.
            </p>
          </div>
        </div>
      </Card>

      {/* Part cards */}
      {!selectedPart ? (
        <div className="grid sm:grid-cols-2 gap-3">
          {PARTS.map(p => (
            <Card key={p.part} hover className="p-4" onClick={() => setSelectedPart(p.part)}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/5">{p.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="slate">{p.part}</Badge>
                    <span className="text-xs text-slate-600">{p.questions} Q</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{p.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{p.description}</p>
                  <p className="text-xs text-indigo-400 mt-2">{p.strategies.length} strategies · {p.traps.length} traps</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : part ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <button onClick={() => setSelectedPart(null)} className="text-slate-400 hover:text-white text-sm">← All Parts</button>
            <Badge variant="indigo">{part.part}</Badge>
            <span className="text-sm font-semibold text-white">{part.title}</span>
          </div>

          <Card className="p-4">
            <p className="text-xs text-slate-300">{part.description}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
              <span>📝 {part.questions} questions</span>
              <span>⏱ {part.time}</span>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-semibold text-emerald-400 mb-3">Strategies</h3>
            <div className="space-y-3">
              {part.strategies.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-xs text-emerald-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <p className="text-xs text-slate-300">{s}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 border-amber-500/20">
            <h3 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Trap Patterns
            </h3>
            <div className="space-y-2">
              {part.traps.map((t, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 text-xs flex-shrink-0">⚠</span>
                  <p className="text-xs text-slate-300">{t}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-semibold text-indigo-400 mb-3">Question Types</h3>
            <div className="flex flex-wrap gap-2">
              {part.questionTypes.map(qt => (
                <span key={qt} className="px-2 py-1 bg-indigo-600/10 border border-indigo-500/20 rounded-lg text-xs text-indigo-300">{qt}</span>
              ))}
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  )
}
