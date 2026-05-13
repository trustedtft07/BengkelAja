export default function Loading({ txt }) {
  return (
    <div className="fixed inset-0 z-[500] flex flex-col items-center justify-center gap-4"
         style={{ background: 'rgba(255,255,255,.88)' }}>
      <div className="spinner" />
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-mid)' }}>{txt}</div>
    </div>
  )
}
