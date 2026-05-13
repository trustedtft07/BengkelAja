const MAP = {
  Menunggu:    'bdg-wait',
  Dikonfirmasi:'bdg-ok',
  Selesai:     'bdg-done',
  Dibatalkan:  'bdg-cancel',
}
export default function Badge({ status }) {
  return <span className={`badge ${MAP[status] || 'bdg-wait'}`}>{status || '—'}</span>
}
