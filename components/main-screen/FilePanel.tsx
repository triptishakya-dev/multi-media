'use client'

import { SessionDetail } from './shared'

type Props = {
  selectedId: string | null
  detail: SessionDetail | null
  loading: boolean
}

function FileIcon({ mimeType }: { mimeType: string }) {
  if (mimeType.startsWith('image/')) {
    return (
      <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2zm10-10a1 1 0 11-2 0 1 1 0 012 0z" />
      </svg>
    )
  }
  if (mimeType === 'application/pdf') {
    return (
      <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 13h6M9 17h4" />
      </svg>
    )
  }
  if (mimeType.startsWith('video/')) {
    return (
      <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
      </svg>
    )
  }
  if (mimeType.startsWith('audio/')) {
    return (
      <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
      </svg>
    )
  }
  return (
    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  )
}

export default function FilePanel({ selectedId, detail, loading }: Props) {
  return (
    <div className="w-72 shrink-0 border-l border-gray-200 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
        <h2 className="text-sm font-semibold text-gray-700 tracking-wide uppercase">
          Documents
        </h2>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {!selectedId ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 7h18M3 12h18M3 17h18" />
            </svg>
            <p className="text-sm">Select a session to view documents</p>
          </div>
        ) : loading ? (
          <p className="px-4 py-6 text-sm text-gray-400">Loading…</p>
        ) : !detail ? (
          <p className="px-4 py-6 text-sm text-red-500">Failed to load session.</p>
        ) : detail.documents.length === 0 ? (
          <p className="px-4 py-6 text-sm text-gray-400">No documents in this session.</p>
        ) : (
          <div className="p-4 grid grid-cols-2 gap-3">
            {detail.documents.map((doc) => (
              <a
                key={doc.id}
                href={doc.s3Url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <FileIcon mimeType={doc.mimeType} />
                <span className="text-xs text-gray-700 text-center leading-tight line-clamp-2 break-all group-hover:text-black">
                  {doc.name}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
