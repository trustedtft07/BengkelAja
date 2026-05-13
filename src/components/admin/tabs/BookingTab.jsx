import { useState } from 'react'
import { useApp } from '../../../context/AppContext'
import Badge from '../../ui/Badge'
import ConfirmDialog from '../../ui/ConfirmDialog'

export default function BookingTab() {
  const { allBooks, updateStatus } = useApp()
  const [filterStatus, setFilterStatus] = useState('')
  const [q, setQ] = useState('')
  const [confirm, setConfirm] = useState(null) // { bookId, newStatus }

  const filtered = allBooks
    .filter(b => !filterStatus || b.status === filterStatus)
    .filter(b => !q || b.nama.toLowerCase().includes(q.toLowerCase()) ||
      (b.userName || '').toLowerCase().includes(q.toLowerCase()) ||
      (b.userEmail || '').toLowerCase().includes(q.toLowerCase()))

  const doUpdate = async () => {
    await updateStatus(confirm.bookId, confirm.newStatus)
    setConfirm(null)
  }

  const confirmMsg = {
    Dikonfirmasi: { title:'Konfirmasi booking ini?', msg:'Status booking akan berubah menjadi Dikonfirmasi.', ok:'Konfirmasi', cls:'btn-green' },
    Dibatalkan:   { title:'Tolak booking ini?',      msg:'Booking akan ditandai sebagai dibatalkan.',         ok:'Tolak',      cls:'btn-red'   },
    Selesai:      { title:'Tandai sebagai selesai?', msg:'Booking akan ditandai sebagai selesai.',            ok:'Konfirmasi', cls:'btn-green' },
  }

  return (
    <div>
      {confirm && (
        <ConfirmDialog
          {...confirmMsg[confirm.newStatus]}
          onOk={doUpdate}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:10 }}>
        <div style={{ fontSize:17, fontWeight:900 }}>Daftar Booking</div>
        <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
          <select className="admin-filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Semua Status</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Dikonfirmasi">Dikonfirmasi</option>
            <option value="Dibatalkan">Dibatalkan</option>
          </select>
          <div style={{ position:'relative', display:'inline-flex' }}>
            <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', fontSize:14, color:'var(--text-light)', pointerEvents:'none' }}>🔍</span>
            <input className="search-input" style={{ width:180 }} placeholder="Cari..." value={q} onChange={e => setQ(e.target.value)} />
          </div>
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'48px 20px' }}>
            <span style={{ fontSize:40, display:'block', marginBottom:12 }}>📋</span>
            <p style={{ fontSize:14, fontWeight:700, color:'var(--text-light)' }}>Tidak ada booking ditemukan</p>
          </div>
        ) : filtered.map(b => (
          <div key={b.id} className="admin-bcard">
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                <span style={{ fontSize:17, fontWeight:800 }}>{b.userName || b.userEmail || '—'}</span>
                <Badge status={b.status} />
              </div>
              <div style={{ fontSize:14, color:'var(--text-mid)', marginBottom:5 }}>Layanan: <strong style={{ color:'var(--text)' }}>{b.icon || ''} {b.nama}</strong></div>
              <div style={{ fontSize:14, color:'var(--text-mid)', marginBottom:5 }}>Tanggal: <strong style={{ color:'var(--text)' }}>{b.tanggal || '—'}</strong></div>
              <div style={{ fontSize:14, color:'var(--text-mid)' }}>Harga: <strong style={{ color:'var(--text)' }}>{b.harga}</strong></div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0, alignSelf:'center' }}>
              {b.status === 'Menunggu' && <>
                <button className="btn-konfirmasi" onClick={() => setConfirm({ bookId:b.id, newStatus:'Dikonfirmasi' })}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  Konfirmasi
                </button>
                <button className="btn-tolak" onClick={() => setConfirm({ bookId:b.id, newStatus:'Dibatalkan' })}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                  Tolak
                </button>
              </>}
              {b.status === 'Dikonfirmasi' && (
                <button className="btn-konfirmasi" style={{ background:'var(--green)' }} onClick={() => setConfirm({ bookId:b.id, newStatus:'Selesai' })}>✓ Selesai</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
