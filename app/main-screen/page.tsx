'use client'

import { useEffect, useState } from 'react'

type Session = {
  id: string
  status: string
  createdAt: string
  _count: { documents: number }
}

type Document = {
  id: string
  name: string
  size: number
  mimeType: string
  s3Url: string
  status: string
}

type SessionDetail = {
  id: string
  status: string
  createdAt: string
  documents: Document[]
}

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: 'bg-green-100 text-green-700',
  UPLOADED: 'bg-green-100 text-green-700',
  FAILED: 'bg-red-100 text-red-700',
  UPLOADING: 'bg-yellow-100 text-yellow-700',
  PENDING: 'bg-gray-100 text-gray-500',
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`text-xs px-1.5 py-0.5 rounded font-medium ${STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-500'}`}
    >
      {status}
    </span>
  )
}

export default function MainScreen() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loadingSessions, setLoadingSessions] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [detail, setDetail] = useState<SessionDetail | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  useEffect(() => {
    fetch('/api/sessions')
      .then((r) => r.json())
      .then(setSessions)
      .catch(() => setSessions([]))
      .finally(() => setLoadingSessions(false))
  }, [])

  useEffect(() => {
    if (!selectedId) return
    setDetail(null)
    setLoadingDetail(true)
    fetch(`/api/sessions/${selectedId}`)
      .then((r) => r.json())
      .then(setDetail)
      .catch(() => setDetail(null))
      .finally(() => setLoadingDetail(false))
  }, [selectedId])

  return (
    <div className="flex" style={{ minHeight: 'calc(100vh - 113px)' }}>
      {/* Sidebar */}
      <aside className="w-72 shrink-0 border-r border-gray-200 flex flex-col">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-700 tracking-wide uppercase">
            Sessions
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingSessions ? (
            <p className="px-4 py-6 text-sm text-gray-400">Loading…</p>
          ) : sessions.length === 0 ? (
            <p className="px-4 py-6 text-sm text-gray-400">No sessions found.</p>
          ) : (
            sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  selectedId === s.id ? 'bg-black text-white hover:bg-black' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    className={`text-xs font-mono truncate ${selectedId === s.id ? 'text-gray-300' : 'text-gray-500'}`}
                  >
                    {s.id.slice(0, 20)}…
                  </span>
                  {selectedId !== s.id && <StatusBadge status={s.status} />}
                </div>
                <p
                  className={`text-xs ${selectedId === s.id ? 'text-gray-400' : 'text-gray-400'}`}
                >
                  {formatDate(s.createdAt)}
                </p>
                <p
                  className={`text-xs mt-0.5 ${selectedId === s.id ? 'text-gray-300' : 'text-gray-500'}`}
                >
                  {s._count.documents} file{s._count.documents !== 1 ? 's' : ''}
                </p>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Right panel */}
      <div className="flex-1 overflow-y-auto bg-white">
        {!selectedId ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 7h18M3 12h18M3 17h18"
              />
            </svg>
            <p className="text-sm">Select a session to view uploaded files</p>
          </div>
        ) : loadingDetail ? (
          <div className="p-8 text-sm text-gray-400">Loading files…</div>
        ) : !detail ? (
          <div className="p-8 text-sm text-red-500">Failed to load session.</div>
        ) : (
          <div className="p-6">
            {/* Session header */}
            <div className="flex flex-wrap items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Session</h2>
              <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">
                {detail.id}
              </span>
              <StatusBadge status={detail.status} />
              <span className="text-xs text-gray-400 ml-auto">
                {formatDate(detail.createdAt)}
              </span>
            </div>

            {/* File list */}
            {detail.documents.length === 0 ? (
              <p className="text-sm text-gray-400">No files in this session.</p>
            ) : (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Name
                      </th>
                      <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Type
                      </th>
                      <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Size
                      </th>
                      <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Status
                      </th>
                      <th className="px-4 py-2" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {detail.documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">
                          {doc.name}
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{doc.mimeType}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                          {formatBytes(doc.size)}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={doc.status} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <a
                            href={doc.s3Url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium text-black hover:underline"
                          >
                            View ↗
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
