export default function ConfirmDialog({ title, msg, okLabel = 'Lanjutkan', okClass = 'btn-red', onOk, onCancel }) {
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center"
         style={{ background: 'rgba(0,0,0,.4)' }}>
      <div className="anim-pop" style={{
        background: '#fff', borderRadius: 16, padding: 24,
        maxWidth: 340, width: '90%', boxShadow: '0 12px 40px rgba(0,0,0,.2)',
      }}>
        <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 7 }}>{title}</div>
        <div style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 18, lineHeight: 1.6 }}>{msg}</div>
        <div className="flex gap-2.5">
          <button className="btn btn-outline" style={{ padding: 10 }} onClick={onCancel}>Batal</button>
          <button className={`btn ${okClass}`} style={{ padding: 10 }} onClick={onOk}>{okLabel}</button>
        </div>
      </div>
    </div>
  )
}
