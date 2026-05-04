'use client'

import { useEffect, useState } from 'react'
import SessionSidebar from '@/components/main-screen/SessionSidebar'
import FilePanel from '@/components/main-screen/FilePanel'
import type { Session, SessionDetail } from '@/components/main-screen/shared'

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
      <SessionSidebar
        sessions={sessions}
        loading={loadingSessions}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <FilePanel
        selectedId={selectedId}
        detail={detail}
        loading={loadingDetail}
      />
    </div>
  )
}
