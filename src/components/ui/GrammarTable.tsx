import React from 'react'

interface GrammarTableProps {
  headers: string[]
  rows: string[][]
  caption?: string
  note?: string
  accent?: string
  className?: string
  /** 'default' = standard, 'trap' = red accent, 'comparison' = violet, 'word_family' = emerald */
  variant?: 'default' | 'trap' | 'comparison' | 'word_family'
}

function resolveAccent(accent?: string, variant?: GrammarTableProps['variant']): string {
  if (accent) return accent
  switch (variant) {
    case 'trap':        return '#F43F5E'
    case 'comparison':  return '#8B5CF6'
    case 'word_family': return '#10B981'
    default:            return '#6366F1'
  }
}

// Render a cell: wraps **text** in a bold span
function CellContent({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  if (parts.length === 1) return <>{text}</>
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={i} style={{ fontWeight: 700, color: 'inherit' }}>{p.slice(2, -2)}</strong>
          : <React.Fragment key={i}>{p}</React.Fragment>
      )}
    </>
  )
}

export const GrammarTable: React.FC<GrammarTableProps> = ({
  headers,
  rows,
  caption,
  note,
  accent: accentProp,
  variant = 'default',
  className = '',
}) => {
  const accent = resolveAccent(accentProp, variant)

  return (
    <div
      className={`rounded-2xl overflow-hidden ${className}`}
      style={{
        border: `1px solid ${accent}28`,
        boxShadow: `0 1px 3px rgba(0,0,0,0.18), 0 0 0 1px ${accent}10`,
      }}
    >
      {/* Caption banner */}
      {caption && (
        <div
          className="px-5 py-2.5 flex items-center gap-2"
          style={{
            background: `linear-gradient(90deg, ${accent}18 0%, ${accent}08 100%)`,
            borderBottom: `1px solid ${accent}22`,
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accent }} />
          <span
            className="text-[10px] uppercase tracking-[0.20em] font-bold"
            style={{ color: accent }}
          >
            {caption}
          </span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        <table className="w-full text-sm border-collapse" style={{ minWidth: headers.length > 3 ? 480 : 320 }}>
          <thead>
            <tr style={{ background: `${accent}12`, borderBottom: `1px solid ${accent}22` }}>
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider whitespace-nowrap"
                  style={{
                    color: accent,
                    borderRight: i < headers.length - 1 ? `1px solid ${accent}14` : 'none',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr
                key={ri}
                style={{
                  background: ri % 2 === 0 ? 'var(--dp-surface)' : `${accent}06`,
                  borderBottom: `1px solid var(--dp-border-xs)`,
                  transition: 'background 0.1s',
                }}
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className="px-4 py-3.5 align-top"
                    style={{
                      color: ci === 0 ? 'var(--dp-text-1)' : ci === row.length - 1 && row.length > 2 ? 'var(--dp-text-3)' : 'var(--dp-text-2)',
                      fontWeight: ci === 0 ? 600 : 400,
                      fontSize: 13,
                      lineHeight: '1.55',
                      borderRight: ci < row.length - 1 ? `1px solid var(--dp-border-xs)` : 'none',
                    }}
                  >
                    <CellContent text={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Note footer */}
      {note && (
        <div
          className="px-5 py-3 flex items-start gap-2"
          style={{
            background: `${accent}07`,
            borderTop: `1px solid ${accent}16`,
          }}
        >
          <span className="text-[11px] font-bold flex-shrink-0 mt-px" style={{ color: accent }}>Note —</span>
          <p className="text-[12px] leading-relaxed" style={{ color: 'var(--dp-text-3)' }}>{note}</p>
        </div>
      )}
    </div>
  )
}
