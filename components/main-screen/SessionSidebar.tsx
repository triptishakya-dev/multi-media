'use client'

import { Session, StatusBadge, formatDate } from './shared'

type Props = {
  sessions: Session[]
  loading: boolean
  selectedId: string | null
  onSelect: (id: string) => void
}

export default function SessionSidebar({ sessions, loading, selectedId, onSelect }: Props) {
  return (
    <aside className="w-72 shrink-0 border-r border-gray-200 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="text-sm font-semibold text-gray-700 tracking-wide uppercase">
          Sessions
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <p className="px-4 py-6 text-sm text-gray-400">Loading…</p>
        ) : sessions.length === 0 ? (
          <p className="px-4 py-6 text-sm text-gray-400">No sessions found.</p>
        ) : (
          sessions.map((s) => {
            const isActive = selectedId === s.id
            return (
              <button
                key={s.id}
                onClick={() => onSelect(s.id)}
                className={`w-full text-left px-4 py-3 border-b border-gray-100 transition-colors ${
                  isActive ? 'bg-black text-white hover:bg-black' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    className={`text-xs font-mono truncate ${isActive ? 'text-gray-300' : 'text-gray-500'}`}
                  >
                    {s.id.slice(0, 20)}…
                  </span>
                  {!isActive && <StatusBadge status={s.status} />}
                </div>
                <p className="text-xs text-gray-400">{formatDate(s.createdAt)}</p>
                <p className={`text-xs mt-0.5 ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
                  {s._count.documents} file{s._count.documents !== 1 ? 's' : ''}
                </p>
              </button>
            )
          })
        )}
      </div>
    </aside>
  )
}
