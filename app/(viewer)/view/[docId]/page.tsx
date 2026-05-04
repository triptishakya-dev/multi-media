import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getPresignedUrl } from '@/lib/s3'
import CloseButton from './CloseButton'

async function fetchDoc(id: string) {
  const doc = await prisma.document.findUnique({
    where: { id },
    select: { id: true, name: true, mimeType: true, s3Bucket: true, s3Key: true },
  })
  if (!doc) return null
  const signedUrl = await getPresignedUrl(doc.s3Bucket, doc.s3Key)
  return { id: doc.id, name: doc.name, mimeType: doc.mimeType, s3Url: signedUrl }
}

function Viewer({ doc }: { doc: { name: string; mimeType: string; s3Url: string } }) {
  if (doc.mimeType.startsWith('video/')) {
    return (
      <video
        src={doc.s3Url}
        controls
        autoPlay
        className="absolute inset-0 w-full h-full object-contain"
      />
    )
  }

  if (doc.mimeType.startsWith('image/')) {
    return (
      <div className="absolute inset-0 flex items-center justify-center p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={doc.s3Url}
          alt={doc.name}
          className="max-w-full max-h-full object-contain"
        />
      </div>
    )
  }

  if (doc.mimeType === 'application/pdf') {
    return (
      <iframe
        src={doc.s3Url}
        title={doc.name}
        className="absolute inset-0 w-full h-full border-0"
      />
    )
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white">
      <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
      <p className="text-gray-400 text-sm">{doc.name}</p>
      <a
        href={doc.s3Url}
        download={doc.name}
        className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
      >
        Download file
      </a>
    </div>
  )
}

export default async function ViewerPage({
  params,
}: {
  params: Promise<{ docId: string }>
}) {
  const { docId } = await params
  const doc = await fetchDoc(docId)
  if (!doc) notFound()

  return (
    <div className="h-screen flex flex-col bg-black">
      <div className="shrink-0 flex items-center justify-between px-5 py-3 bg-black/80 border-b border-white/10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-2 h-2 shrink-0 rounded-full bg-green-400" />
          <span className="text-sm text-white/80 font-medium truncate">
            {doc.name}
          </span>
          <span className="text-xs text-white/30 font-mono shrink-0">{doc.mimeType}</span>
        </div>
        <CloseButton />
      </div>

      <div className="flex-1 relative overflow-hidden">
        <Viewer doc={doc} />
      </div>
    </div>
  )
}
